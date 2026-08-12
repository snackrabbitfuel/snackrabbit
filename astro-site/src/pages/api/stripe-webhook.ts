import type { APIRoute } from "astro";
import type { Linea, NuevoPedido } from "../../lib/pedidos/tipos";
import { almacen } from "../../lib/pedidos/almacen";
import { secreto } from "../../lib/audiencia";

/* EL WEBHOOK DE STRIPE — el enchufe del futuro, con la cerradura ya puesta.
 *
 * Stripe avisará aquí de cada cobro (checkout.session.completed) y este
 * archivo lo convertirá en un pedido del almacén. Hoy no hay cuenta de Stripe:
 * sin STRIPE_WEBHOOK_SECRET la ruta responde 503 y no procesa nada — en
 * espera de Stripe, falla cerrado.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * LA FIRMA SE VERIFICA ANTES DE CREER UNA SOLA COMA DEL CUERPO
 *
 * Esta URL es pública: cualquiera puede mandarle un POST con un JSON que diga
 * "checkout completado, 500 dólares, mándalo a mi casa". Lo único que
 * distingue a Stripe de ese cualquiera es la cabecera `stripe-signature`:
 * un HMAC-SHA256 de `timestamp.cuerpo` con un secreto (whsec_…) que solo
 * Stripe y este servidor conocen. Sin verificarla primero, el webhook es una
 * máquina de fabricar ventas falsas. Por eso el orden de este archivo es
 * inflexible: leer el cuerpo CRUDO (la firma es del texto exacto, byte a
 * byte — parsearlo y reserializarlo la rompería), verificar, y solo entonces
 * parsear y actuar.
 *
 * El timestamp firmado limita el replay: una petición legítima capturada hoy
 * no sirve mañana. Tolerancia de 5 minutos, la que recomienda Stripe.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * IDEMPOTENCIA POR event.id — TODO PARA EL ADAPTADOR REAL
 *
 * Stripe REENVÍA eventos: si respondemos lento o con error, el mismo cobro
 * llega dos, tres, diez veces. Sin registrar los event.id ya procesados,
 * cada reenvío crearía un pedido duplicado — y un duplicado en pedidos es
 * empacar y cobrar dos veces. El adaptador real (Postgres) debe guardar el
 * event.id con restricción de unicidad y descartar los repetidos. El demo lo
 * ignora a sabiendas: su almacén es efímero y no hay dinero real en juego.
 *
 * HMAC con Web Crypto (crypto.subtle) a propósito: cero dependencias nuevas,
 * y `subtle.verify` compara en tiempo constante — comparar hex con `===`
 * filtraría por cronómetro cuántos bytes de la firma iban bien.
 */
export const prerender = false;

/* Eventos ya procesados por esta instancia. Ver el bloque de idempotencia. */
const eventosVistos = new Set<string>();

const json = (cuerpo: unknown, status = 200) =>
  new Response(JSON.stringify(cuerpo), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });

/* Tolerancia de replay: 5 minutos, en segundos porque el `t` de Stripe va en
   segundos de época. */
const TOLERANCIA_S = 5 * 60;

/* Sin anotar el retorno a propósito: `new Uint8Array(n)` infiere
   Uint8Array<ArrayBuffer> en TS 5.7+, que es lo que `subtle.verify` exige
   como BufferSource; anotar `Uint8Array` a secas lo ensancharía a
   ArrayBufferLike y dejaría de compilar en estricto. */
const hexABytes = (hex: string) => {
  if (hex.length === 0 || hex.length % 2 !== 0 || /[^0-9a-f]/i.test(hex)) return null;
  const b = new Uint8Array(hex.length / 2);
  for (let i = 0; i < b.length; i++) b[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return b;
};

/**
 * Verifica el esquema v1 de Stripe: la cabecera trae `t=<época>,v1=<hex>`
 * (puede traer VARIAS v1 mientras se rota el secreto: basta con que una
 * cuadre). Lo firmado es literalmente `${t}.${cuerpoCrudo}` con la clave
 * whsec_ tal cual, en UTF-8.
 */
async function firmaValida(cabecera: string, cuerpo: string, secretoWh: string): Promise<boolean> {
  const partes = new Map<string, string[]>();
  for (const trozo of cabecera.split(",")) {
    const i = trozo.indexOf("=");
    if (i <= 0) continue;
    const k = trozo.slice(0, i).trim();
    (partes.get(k) ?? partes.set(k, []).get(k)!).push(trozo.slice(i + 1).trim());
  }

  const t = Number(partes.get("t")?.[0]);
  const firmas = partes.get("v1") ?? [];
  if (!Number.isFinite(t) || firmas.length === 0) return false;

  /* El timestamp se comprueba ANTES de calcular nada: una firma válida pero
     vieja es exactamente el ataque de replay que el `t` existe para parar. */
  if (Math.abs(Date.now() / 1000 - t) > TOLERANCIA_S) return false;

  const codificador = new TextEncoder();
  const clave = await crypto.subtle.importKey(
    "raw",
    codificador.encode(secretoWh),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"],
  );
  const firmado = codificador.encode(`${t}.${cuerpo}`);

  for (const hex of firmas) {
    const bytes = hexABytes(hex);
    if (!bytes) continue;
    /* subtle.verify compara en tiempo constante — ver cabecera. */
    if (await crypto.subtle.verify("HMAC", clave, bytes, firmado)) return true;
  }
  return false;
}

/**
 * De la sesión de Checkout al contrato NuevoPedido. Los nombres de campo son
 * los REALES de Stripe (customer_details, line_items, total_details) para que
 * el día del enchufe esto sea rellenar TODOs, no arqueología.
 *
 * Sin SDK de Stripe no hay tipos: `sesion` va como any a sabiendas, y cada
 * lectura es defensiva.
 */
function aNuevoPedido(sesion: any): NuevoPedido {
  const cd = sesion?.customer_details ?? {};
  const dir = cd?.address ?? {};

  /* ⚠ line_items NO viene en el evento por defecto: hay que pedirlo aparte
     (GET /v1/checkout/sessions/{id}/line_items) o configurar el webhook con
     expand. TODO adaptador real: recuperarlas ahí; si esto llega vacío con
     dinero real, mejor lanzar que crear un pedido sin líneas. */
  const items: any[] = sesion?.line_items?.data ?? [];
  const lineas: Linea[] = items.map((it) => ({
    /* TODO: hoy `price.product` es el id interno de Stripe (prod_…). Decidir
       si el catálogo viaja en metadata del producto o se mapea aquí a los
       slugs de la tienda ("rabbit-fuel", "the-lookout"). */
    productoId: String(it?.price?.product ?? "desconocido"),
    /* El nombre congelado al comprar: la descripción de la línea es lo que el
       cliente vio en el Checkout. */
    nombre: String(it?.description ?? "ARTÍCULO"),
    /* TODO: variante y sabor dependen de cómo el checkout los codifique
       (metadata del price, o un price por combinación). Decisión pendiente. */
    variante: it?.price?.metadata?.variante ?? null,
    sabor: it?.price?.metadata?.sabor ?? null,
    cantidad: Number(it?.quantity ?? 1),
    /* Centavos, como todo: Stripe ya habla en centavos, sin conversión. */
    precioUnitario: Number(it?.price?.unit_amount ?? 0),
  }));

  return {
    cliente: {
      nombre: String(cd?.name ?? ""),
      email: String(cd?.email ?? ""),
      ciudad: dir?.city ?? null,
      region: dir?.state ?? null,
      pais: dir?.country ?? null,
    },
    lineas,
    /* Lo que se COBRÓ, no lo que la tarifa de hoy diría: el almacén apunta
       historia, no reglas. amount_shipping/amount_tax vienen del total real
       de la sesión. */
    costeEnvio: Number(sesion?.total_details?.amount_shipping ?? 0),
    impuestos: Number(sesion?.total_details?.amount_tax ?? 0),
    /* El payment_intent cruza el pedido con el banco. */
    pagoId: typeof sesion?.payment_intent === "string" ? sesion.payment_intent : null,
    estado: "pagado",
  };
}

export const POST: APIRoute = async ({ request }) => {
  const secretoWh = secreto("STRIPE_WEBHOOK_SECRET");
  if (!secretoWh) {
    /* En espera de Stripe: falla cerrado. Sin secreto no hay forma de saber
       quién llama, y un webhook que procesa sin verificar es una puerta
       abierta con un cartel de "fabrique aquí sus ventas". */
    return json({ ok: false }, 503);
  }

  /* El texto CRUDO: la firma es de estos bytes exactos. Nada del cuerpo se
     cree todavía. */
  const crudo = await request.text();
  const cabecera = request.headers.get("stripe-signature") || "";
  if (!cabecera || !(await firmaValida(cabecera, crudo, secretoWh))) {
    /* Sin distinguir "sin cabecera", "vieja" o "firma incorrecta": a quien
       fabrique peticiones no se le cuenta qué parte falló. */
    return json({ ok: false }, 400);
  }

  /* A partir de aquí el cuerpo es palabra de Stripe. */
  let evento: any;
  try {
    evento = JSON.parse(crudo);
  } catch {
    return json({ ok: false }, 400);
  }

  /* IDEMPOTENCIA — la defensa existe desde hoy, no como promesa. Stripe
     reenvía eventos (a propósito: es su garantía de entrega), y una firma
     válida capturada puede repetirse dentro de la ventana de tolerancia; sin
     esto, cada reenvío fabricaría un pedido duplicado del mismo cobro.

     Este registro es en memoria: sobrevive dentro de una instancia caliente,
     que ya corta el caso común (los reintentos de Stripe llegan en segundos o
     minutos). El adaptador real DEBE volverlo durable —una restricción de
     unicidad sobre evento.id en Postgres— porque dos instancias frías no
     comparten memoria. Anotado en la cabecera como requisito del día Stripe. */
  const idEvento = String(evento?.id || "");
  if (idEvento) {
    if (eventosVistos.has(idEvento)) return json({ ok: true, repetido: true });
    eventosVistos.add(idEvento);
    if (eventosVistos.size > 5000) {
      /* Sin poda, una instancia longeva crecería sin límite. FIFO burdo pero
         suficiente: 5000 eventos cubren con holgura la ventana de reintentos. */
      eventosVistos.delete(eventosVistos.values().next().value);
    }
  }

  if (evento?.type === "checkout.session.completed") {
    try {
      const pedido = await almacen().crear(aNuevoPedido(evento?.data?.object));
      return json({ ok: true, pedidoId: pedido.id });
    } catch (e) {
      /* 500 a propósito: Stripe reintenta ante error, y un cobro real que no
         pudo apuntarse DEBE reintentarse, no perderse con un 200 educado. */
      console.error("[stripe-webhook] no se pudo crear el pedido:", e);
      return json({ ok: false }, 500);
    }
  }

  /* Evento verificado pero que no manejamos (aún): 200, que Stripe no
     reintente lo que no vamos a procesar. */
  return json({ ok: true, ignorado: evento?.type ?? null });
};
