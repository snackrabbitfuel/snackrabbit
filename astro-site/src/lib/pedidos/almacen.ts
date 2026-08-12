import type { Cliente, Envio, Estado, Filtro, Linea, NuevoPedido, Paso, Pedido } from "./tipos";
import { subtotalDe, totalDe } from "./tipos";
import { avanzar } from "./estados";

/* EL ALMACÉN DE PEDIDOS — la única puerta a los datos.
 *
 * El panel y la API no saben de dónde salen los pedidos: hablan con la
 * interfaz `Almacen` y punto. Hoy detrás hay una maqueta en memoria; el día
 * que lleguen Stripe y Postgres, detrás habrá una base de datos — y ese día
 * ESTE es el único archivo que cambia. Todo lo que se construya encima
 * (tablero, filtros, historial, el futuro agente) queda hecho de verdad,
 * no "de mentira hasta que haya datos".
 *
 * ─────────────────────────────────────────────────────────────────────────
 * LA MEMORIA DEL DEMO VIVE POR INSTANCIA — Y ESTÁ BIEN
 *
 * En Vercel cada lambda caliente tiene su propio módulo cargado, así que el
 * Map de abajo no es una base de datos: dos peticiones pueden caer en
 * instancias distintas con memorias distintas, y al reciclarse la instancia
 * los cambios (pedidos creados, transiciones) vuelven a la semilla. No es un
 * fallo: es una maqueta, y su trabajo es que el panel se pueda usar de
 * verdad — mover pedidos, ver el historial crecer — sin fingir persistencia
 * que aún no existe. El adaptador real persistirá; este no lo promete.
 */

export interface Almacen {
  listar(f?: Filtro): Promise<Pedido[]>;
  porId(id: string): Promise<Pedido | null>;
  crear(n: NuevoPedido): Promise<Pedido>;
  transicionar(id: string, a: Estado, por: string, nota?: string): Promise<Pedido>;
  /** Para que el panel pinte el sello DEMO cuando los datos son de mentira. */
  esDemo(): boolean;
}

/* ── la regla de envío de la tienda ──
 * $6.95 plano, gratis desde $60 de subtotal. Vive aquí exportada para que el
 * checkout use LA MISMA cuenta el día que cobre de verdad: dos copias de esta
 * regla acabarían discrepando en un centavo un mal día. */
export const ENVIO_TARIFA = 695;
export const ENVIO_GRATIS_DESDE = 6000;
export const costeEnvioDe = (subtotal: number): number =>
  subtotal >= ENVIO_GRATIS_DESDE ? 0 : ENVIO_TARIFA;

/* ══════════ los pedidos de muestra ══════════
 *
 * Son los mismos diez que enseñaba el panel inline (SR-1040…SR-1049),
 * traducidos al contrato de tipos.ts: ciudad y región separadas (para poder
 * agrupar), dólares pasados a centavos, y el historial reconstruido para que
 * cuadre con el estado — un "enviado" tiene su viaje completo
 * pagado→prepara→empacado→enviado con fechas escalonadas.
 */

/* Ayudas SOLO para sembrar: congelan nombre y precio como quedarían tras una
   venta real. En producción el que congela es el servidor al cobrar, nunca
   una plantilla como esta. */
const rf4 = (cantidad: number, sabor: string | null = null): Linea =>
  ({ productoId: "rabbit-fuel", nombre: "RABBIT FUEL", variante: "PACK ×4", sabor, cantidad, precioUnitario: 1600 });
const rf12 = (cantidad: number): Linea =>
  ({ productoId: "rabbit-fuel", nombre: "RABBIT FUEL", variante: "PACK ×12", sabor: null, cantidad, precioUnitario: 4200 });
const lookout = (color: string | null = null): Linea =>
  ({ productoId: "the-lookout", nombre: "THE LOOKOUT", variante: null, sabor: color, cantidad: 1, precioUnitario: 3500 });

/**
 * Sella un pedido de muestra: el dinero se CALCULA de las líneas (nadie suma
 * centavos a mano), y el estado se deriva del último paso del historial — así
 * es imposible sembrar un pedido cuyo historial cuente otra película.
 */
function sellado(
  id: string,
  cliente: Cliente,
  lineas: Linea[],
  pasos: Array<[Estado, string, string, string?]>,
  envio: Envio = {},
): Pedido {
  const subtotal = subtotalDe(lineas);
  const costeEnvio = costeEnvioDe(subtotal);
  /* 0 a propósito: los impuestos los calculará Stripe Tax por dirección al
     cobrar. Inventar un porcentaje aquí sería enseñar números falsos. */
  const impuestos = 0;
  const historial: Paso[] = pasos.map(([estado, en, por, nota]) =>
    ({ estado, en, por, nota: nota ?? null }));
  return {
    id,
    creadoEn: historial[0].en,
    estado: historial[historial.length - 1].estado,
    cliente,
    lineas,
    subtotal,
    costeEnvio,
    impuestos,
    total: totalDe({ subtotal, costeEnvio, impuestos }),
    moneda: "usd",
    pagoId: null, // demo: no hubo Stripe
    envio,
    historial,
  };
}

/* Quién movió qué: "stripe" confirma cobros, ADMIN empaca y envía, "sistema"
   apunta lo que detecta solo (seguimiento parado, entrega confirmada). */
const ADMIN = "dieval20@gmail.com";

const SEMILLA: Pedido[] = [
  sellado("SR-1049",
    { nombre: "Ava R.", email: "ava@example.com", ciudad: "Austin", region: "TX", pais: "US" },
    [rf12(1), lookout()],
    [["pagado", "2026-08-05T09:41:00Z", "stripe"]]),

  sellado("SR-1048",
    { nombre: "Mateo G.", email: "mateo@example.com", ciudad: "Miami", region: "FL", pais: "US" },
    [lookout("BLACK")],
    [["pagado", "2026-08-05T08:12:00Z", "stripe"]]),

  sellado("SR-1047",
    { nombre: "Jordan K.", email: "jordan.k@example.com", ciudad: "Portland", region: "OR", pais: "US" },
    [rf4(2)],
    [["pagado", "2026-08-04T19:03:00Z", "stripe"],
     ["prepara", "2026-08-05T08:47:00Z", ADMIN]]),

  sellado("SR-1046",
    { nombre: "Sofía L.", email: "sofia@example.com", ciudad: "Queens", region: "NY", pais: "US" },
    [rf12(1), lookout("WHITE")],
    [["pagado", "2026-08-04T16:40:00Z", "stripe"],
     ["prepara", "2026-08-05T09:02:00Z", ADMIN]]),

  sellado("SR-1045",
    { nombre: "Noah P.", email: "noah@example.com", ciudad: "Denver", region: "CO", pais: "US" },
    [rf4(2, "PINK COLADA")],
    [["pagado", "2026-08-04T11:22:00Z", "stripe"],
     ["prepara", "2026-08-05T10:14:00Z", ADMIN],
     ["empacado", "2026-08-06T15:30:00Z", ADMIN],
     ["enviado", "2026-08-07T10:05:00Z", ADMIN]],
    { transportista: "USPS Ground Advantage", seguimiento: "9400 1112 0345", enviadoEn: "2026-08-07T10:05:00Z" }),

  sellado("SR-1044",
    { nombre: "Emma T.", email: "emma@example.com", ciudad: "Chicago", region: "IL", pais: "US" },
    [rf12(2)],
    [["pagado", "2026-08-03T15:08:00Z", "stripe"],
     ["prepara", "2026-08-04T09:26:00Z", ADMIN],
     ["empacado", "2026-08-05T13:12:00Z", ADMIN],
     ["enviado", "2026-08-06T09:40:00Z", ADMIN]],
    { transportista: "USPS Priority Cubic", seguimiento: "9405 5036 9930", enviadoEn: "2026-08-06T09:40:00Z" }),

  /* El pedido con drama: el mismo que protagoniza el hilo de soporte del
     panel ("SR-1043 has not updated tracking in days"). */
  sellado("SR-1043",
    { nombre: "Jordan M.", email: "jordan.m@example.com", ciudad: "Boise", region: "ID", pais: "US" },
    [rf4(1, "SOUR HOP"), lookout()],
    [["pagado", "2026-07-29T10:15:00Z", "stripe"],
     ["prepara", "2026-07-30T09:00:00Z", ADMIN],
     ["empacado", "2026-07-30T16:45:00Z", ADMIN],
     ["enviado", "2026-07-31T11:05:00Z", ADMIN],
     ["retraso", "2026-08-05T08:00:00Z", "sistema", "Seguimiento sin movimiento desde el 1 AGO; reclamación abierta con USPS."]],
    { transportista: "USPS Ground Advantage", seguimiento: "9400 1108 2214", enviadoEn: "2026-07-31T11:05:00Z" }),

  sellado("SR-1042",
    { nombre: "Liam S.", email: "liam@example.com", ciudad: "Nashville", region: "TN", pais: "US" },
    [lookout("BLACK")],
    [["pagado", "2026-07-27T14:20:00Z", "stripe"],
     ["prepara", "2026-07-28T09:15:00Z", ADMIN],
     ["empacado", "2026-07-28T16:02:00Z", ADMIN],
     ["enviado", "2026-07-29T10:30:00Z", ADMIN],
     ["entregado", "2026-08-02T09:54:00Z", "sistema"]],
    { transportista: "UPS Ground", seguimiento: "1Z 999 AA1 01", enviadoEn: "2026-07-29T10:30:00Z", entregadoEn: "2026-08-02T09:54:00Z" }),

  /* Estos dos no salían en la tabla de envíos del demo viejo, así que no se
     les inventa transportista: entregados con fechas pero sin seguimiento. */
  sellado("SR-1041",
    { nombre: "Mía C.", email: "mia@example.com", ciudad: "Phoenix", region: "AZ", pais: "US" },
    [rf12(1)],
    [["pagado", "2026-07-26T12:05:00Z", "stripe"],
     ["prepara", "2026-07-27T09:40:00Z", ADMIN],
     ["empacado", "2026-07-27T15:55:00Z", ADMIN],
     ["enviado", "2026-07-28T10:12:00Z", ADMIN],
     ["entregado", "2026-08-01T17:31:00Z", "sistema"]],
    { enviadoEn: "2026-07-28T10:12:00Z", entregadoEn: "2026-08-01T17:31:00Z" }),

  sellado("SR-1040",
    { nombre: "Lucas B.", email: "lucas@example.com", ciudad: "Seattle", region: "WA", pais: "US" },
    [rf4(3)],
    [["pagado", "2026-07-25T09:30:00Z", "stripe"],
     ["prepara", "2026-07-26T08:50:00Z", ADMIN],
     ["empacado", "2026-07-26T14:10:00Z", ADMIN],
     ["enviado", "2026-07-27T09:58:00Z", ADMIN],
     ["entregado", "2026-08-01T12:19:00Z", "sistema"]],
    { enviadoEn: "2026-07-27T09:58:00Z", entregadoEn: "2026-08-01T12:19:00Z" }),
];

/* ══════════ adaptador demo ══════════ */

/* A nivel de módulo adrede: es lo que hace que la memoria sobreviva entre
   peticiones dentro de la misma instancia caliente (ver cabecera). */
const memoria: Map<string, Pedido> = new Map();
for (const p of SEMILLA) memoria.set(p.id, p);

/* Todo lo que entra o sale del Map se clona: si el panel mutara un pedido
   devuelto (o el llamador retocara el que acaba de crear), estaría escribiendo
   en el almacén por la puerta de atrás, sin pasar por `transicionar`. */
const clon = <T>(x: T): T => structuredClone(x);

class AlmacenDemo implements Almacen {
  async listar(f?: Filtro): Promise<Pedido[]> {
    let xs = Array.from(memoria.values());
    if (f?.estado) {
      const quiere = Array.isArray(f.estado) ? f.estado : [f.estado];
      xs = xs.filter(p => quiere.includes(p.estado));
    }
    if (f?.texto) {
      const q = f.texto.trim().toLowerCase();
      xs = xs.filter(p =>
        p.id.toLowerCase().includes(q) ||
        p.cliente.nombre.toLowerCase().includes(q) ||
        p.cliente.email.toLowerCase().includes(q));
    }
    if (f?.desde) {
      /* Comparar los ISO como texto funciona porque todos van en UTC con el
         mismo formato; es la razón de guardar fechas así y no como Date. */
      const desde = f.desde;
      xs = xs.filter(p => p.creadoEn >= desde);
    }
    /* Más nuevo primero: es el orden que quiere cualquier vista del panel,
       y decidirlo aquí evita que cada llamador ordene por su cuenta. */
    xs.sort((a, b) => (a.creadoEn < b.creadoEn ? 1 : a.creadoEn > b.creadoEn ? -1 : 0));
    if (f?.limite && f.limite > 0) xs = xs.slice(0, f.limite);
    return xs.map(clon);
  }

  async porId(id: string): Promise<Pedido | null> {
    const p = memoria.get(id);
    return p ? clon(p) : null;
  }

  async crear(n: NuevoPedido): Promise<Pedido> {
    const subtotal = subtotalDe(n.lineas);
    const estado: Estado = n.estado ?? "pagado";
    const creadoEn = new Date().toISOString();
    const p: Pedido = {
      id: siguienteId(),
      creadoEn,
      estado,
      cliente: clon(n.cliente),
      lineas: clon(n.lineas),
      subtotal,
      /* El coste de envío y los impuestos vienen del llamador, no se
         recalculan aquí: el almacén apunta lo que se cobró de verdad, y quien
         sabe eso es el checkout (Stripe). Recalcular sería reescribir la
         historia si la tarifa cambia mañana. */
      costeEnvio: n.costeEnvio,
      impuestos: n.impuestos,
      total: totalDe({ subtotal, costeEnvio: n.costeEnvio, impuestos: n.impuestos }),
      moneda: "usd",
      pagoId: n.pagoId ?? null,
      envio: {},
      /* El primer paso del historial nace con el pedido: un pedido sin
         historial no puede existir, porque la auditoría empieza en el cobro. */
      historial: [{ estado, en: creadoEn, por: n.pagoId ? "stripe" : "sistema", nota: null }],
    };
    memoria.set(p.id, p);
    return clon(p);
  }

  async transicionar(id: string, a: Estado, por: string, nota?: string): Promise<Pedido> {
    const actual = memoria.get(id);
    if (!actual) throw new Error(`pedido desconocido: ${id}`);
    /* La validación vive en estados.ts y SOLO ahí: si la transición no vale,
       `avanzar` lanza y aquí no se escribe nada. */
    const nuevo = avanzar(actual, a, por, nota);
    memoria.set(id, nuevo);
    return clon(nuevo);
  }

  esDemo(): boolean {
    return true;
  }
}

/* Sigue la numeración desde el id más alto que exista, no desde un contador
   aparte: un contador se desincronizaría en cuanto la instancia se recicle y
   la memoria vuelva a la semilla. */
function siguienteId(): string {
  let mayor = 1000;
  memoria.forEach((_, id) => {
    const m = /^SR-(\d+)$/.exec(id);
    if (m) mayor = Math.max(mayor, Number(m[1]));
  });
  return "SR-" + String(mayor + 1).padStart(4, "0");
}

/* ══════════ adaptador real (stub) ══════════
 *
 * EL PLAN: Postgres del marketplace de Vercel (Neon). El webhook de Stripe
 * (checkout.session.completed) llamará a `crear()` con las líneas y el cobro
 * ya congelados; el panel seguirá llamando a `listar`/`transicionar` sin
 * enterarse del cambio. Ese día se implementa esta clase, se define
 * DATABASE_URL en Vercel, y NADA MÁS se toca — esa es la gracia del patrón
 * adaptador y la razón de que este stub exista ya: reserva el sitio y deja
 * escrito el contrato que tendrá que cumplir.
 *
 * Mientras tanto lanza en vez de devolver listas vacías: una base de datos
 * "configurada" que en silencio no guarda nada es la clase de mentira que se
 * descubre con ventas reales perdidas.
 */
export class AlmacenPostgres implements Almacen {
  async listar(_f?: Filtro): Promise<Pedido[]> {
    throw new Error("sin implementar: llega con Stripe");
  }
  async porId(_id: string): Promise<Pedido | null> {
    throw new Error("sin implementar: llega con Stripe");
  }
  async crear(_n: NuevoPedido): Promise<Pedido> {
    throw new Error("sin implementar: llega con Stripe");
  }
  async transicionar(_id: string, _a: Estado, _por: string, _nota?: string): Promise<Pedido> {
    throw new Error("sin implementar: llega con Stripe");
  }
  esDemo(): boolean {
    return false;
  }
}

/* Declarado a mano en vez de tirar de @types/node: el proyecto no los trae y
   este es el único sitio del módulo que mira el entorno. En Vercel (Node)
   `process` existe siempre. */
declare const process: { env: Record<string, string | undefined> };

const demo = new AlmacenDemo();

/**
 * La puerta de entrada: todo el que necesite pedidos llama a `almacen()` y
 * recibe el adaptador que toque. Mientras no exista DATABASE_URL, el demo;
 * en cuanto exista, el real — y si el real aún no está implementado, que
 * lance: configurar una base de datos y seguir enseñando datos de mentira
 * sería fallar abierto.
 */
export function almacen(): Almacen {
  return process.env.DATABASE_URL ? new AlmacenPostgres() : demo;
}
