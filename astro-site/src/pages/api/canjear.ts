import type { APIRoute } from "astro";
import { verifyToken, createClerkClient } from "@clerk/backend";
import { secreto } from "../../lib/audiencia";
import { SITIO } from "../../emails/_marco";
import { leer, llave } from "../../lib/codigos";
import { disponible, quemar } from "../../lib/registro";

/* CANJEAR EL CÓDIGO DE UNA CARTA.
 *
 * El socio teclea los diez caracteres del dorso y la carta aparece en su
 * panel. Todo el trabajo ocurre aquí porque otorgar una carta es escribir en
 * `publicMetadata`, y eso solo lo puede hacer el servidor: si el navegador
 * pudiera, cualquiera se pondría las doce desde la consola.
 *
 * TRES PUERTAS, Y CADA UNA PARA UN ATAQUE DISTINTO
 *
 *   1. La FIRMA del código (src/lib/codigos.ts) — contra inventarse códigos.
 *      Sin el secreto del servidor, acertar sale a una entre 8.600 millones.
 *
 *   2. El REGISTRO (src/lib/registro.ts) — contra copiar un código válido. El
 *      ejemplar se quema al reclamarlo, de forma atómica: si dos llegan a la
 *      vez, gana exactamente uno.
 *
 *   3. El LÍMITE DE INTENTOS — contra probar a lo bruto. Una entre 8.600
 *      millones es mucho, pero un guion que dispare sin parar acaba llegando.
 *      El contador vive en `publicMetadata` del propio usuario, que solo
 *      escribe el servidor: no se puede poner a cero desde el navegador.
 *
 * Y una regla que las cruza todas: **el código nunca dice a quién pertenece**.
 * Lo que se otorga se otorga a la cuenta que hay detrás del token verificado,
 * jamás a un identificador que venga en la petición.
 *
 * Variables de entorno (las crea Diego; yo no las veo nunca):
 *   CLERK_SECRET_KEY              verifica la sesión y escribe la carta
 *   CODIGO_SECRETO                firma y valida los códigos impresos
 *   UPSTASH_REDIS_REST_URL/TOKEN  el registro de ejemplares quemados
 */
export const prerender = false;

/* Ventana y tope de intentos fallidos. Diez por hora deja teclear mal varias
   veces sin bloquear a nadie de verdad, y convierte la fuerza bruta en un
   problema de siglos. */
const TOPE = 10;
const VENTANA = 60 * 60 * 1000;

const responder = (estado: string, extra: Record<string, unknown> = {}, code = 200) =>
  new Response(JSON.stringify({ estado, ...extra }), {
    status: code,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });

export const POST: APIRoute = async ({ request }) => {
  const secretKey = secreto("CLERK_SECRET_KEY");
  const firmaSecreta = secreto("CODIGO_SECRETO");

  /* Sin lo necesario no se canjea: fallar cerrado. Un fallo de configuración
     no puede acabar repartiendo cartas. */
  if (!secretKey || !firmaSecreta) {
    console.error("[canjear] faltan CLERK_SECRET_KEY o CODIGO_SECRETO");
    return responder("sinconfigurar", {}, 503);
  }
  if (!disponible()) {
    console.error("[canjear] falta el registro de canjes (UPSTASH_REDIS_REST_*)");
    return responder("sinconfigurar", {}, 503);
  }

  let token = "";
  let codigo = "";
  try {
    const cuerpo = await request.json();
    token = String(cuerpo?.token || "");
    codigo = String(cuerpo?.codigo || "");
  } catch {
    return responder("invalido", {}, 400);
  }
  if (!token) return responder("sinsesion", {}, 401);

  /* ---- quién eres: del token, nunca de la petición ---- */
  let userId = "";
  try {
    const payload = await verifyToken(token, {
      secretKey,
      authorizedParties: [SITIO, "https://snackrabbit.co", "http://localhost:4321"],
    });
    userId = String(payload.sub || "");
  } catch {
    return responder("sinsesion", {}, 401);
  }
  if (!userId) return responder("sinsesion", {}, 401);

  try {
    const clerk = createClerkClient({ secretKey });
    const user = await clerk.users.getUser(userId);
    const pub = (user.publicMetadata || {}) as Record<string, any>;

    /* ---- límite de intentos ---- */
    const ahora = Date.now();
    const previo = pub.canjes || {};
    const dentroVentana = typeof previo.desde === "number" && ahora - previo.desde < VENTANA;
    const fallos = dentroVentana ? Number(previo.fallos) || 0 : 0;
    if (fallos >= TOPE) {
      const faltan = Math.ceil((previo.desde + VENTANA - ahora) / 60000);
      return responder("demasiados", { minutos: Math.max(1, faltan) }, 429);
    }

    const anotarFallo = async () => {
      await clerk.users.updateUser(userId, {
        publicMetadata: {
          ...pub,
          canjes: { fallos: fallos + 1, desde: dentroVentana ? previo.desde : ahora },
        },
      });
    };

    /* ---- ¿es un código nuestro? ---- */
    const ficha = leer(codigo, firmaSecreta);
    if (!ficha) {
      await anotarFallo();
      return responder("novale");
    }

    const mias: number[] = Array.isArray(pub.cartas) ? pub.cartas : [];
    /* Ya la tiene: se dice y no se gasta intento. Reclamar dos veces la misma
       carta es un despiste, no un ataque. */
    if (mias.includes(ficha.carta)) {
      return responder("yatienes", { carta: ficha.carta });
    }

    /* ---- quemar el ejemplar: aquí se decide de verdad ---- */
    const fuego = await quemar(llave(ficha), userId);
    if (fuego === "usado") {
      await anotarFallo();
      return responder("usado");
    }
    if (fuego === "error") {
      /* El registro no responde. No se otorga nada: sin poder comprobar que
         estaba libre, dar la carta sería regalarla a quien copie un código. */
      return responder("reintenta", {}, 503);
    }

    /* ---- la carta es suya ---- */
    /* Se lee el perfil OTRA VEZ justo antes de escribir: entre la primera
       lectura y aquí ha habido varias esperas, y otro canje simultáneo del
       mismo usuario podría haber añadido una carta que este escritura borraría. */
    const fresco = (await clerk.users.getUser(userId)).publicMetadata as Record<string, any>;
    const actuales: number[] = Array.isArray(fresco.cartas) ? fresco.cartas : [];
    const cartas = [...new Set([...actuales, ficha.carta])].sort((a, b) => a - b);

    await clerk.users.updateUser(userId, {
      publicMetadata: {
        ...fresco,
        cartas,
        /* Qué ejemplar concreto tiene de cada carta: es su número de la
           tirada, y algún día querrá verlo en el panel. */
        ejemplares: { ...(fresco.ejemplares || {}), [ficha.carta]: ficha.serie },
        canjes: { fallos: 0, desde: ahora },
      },
    });

    return responder("ok", { carta: ficha.carta, serie: ficha.serie, cartas });
  } catch (e) {
    console.error("[canjear] fallo al canjear:", e);
    return responder("error", {}, 502);
  }
};
