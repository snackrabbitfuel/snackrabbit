import type { APIRoute } from "astro";
import { resolverAudiencia, secreto } from "../../lib/audiencia";

/* Alta en la lista de correo.
 *
 * Es la única ruta del sitio que se ejecuta en servidor: la clave de Resend no
 * puede viajar al navegador, así que la petición tiene que salir de aquí.
 *
 * Variables de entorno en Vercel (Diego las crea, yo no las veo nunca):
 *   RESEND_API_KEY       clave secreta de Resend — imprescindible
 *   RESEND_AUDIENCE_ID   opcional: si no está, se usa la única audiencia de la
 *                        cuenta. Solo hace falta declararla el día que haya más
 *                        de una y queramos elegir a cuál van las altas.
 */
export const prerender = false;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const responder = (estado: string, code = 200) =>
  new Response(JSON.stringify({ estado }), {
    status: code,
    headers: { "content-type": "application/json" },
  });

export const POST: APIRoute = async ({ request }) => {
  let email = "";
  try {
    const cuerpo = await request.json();
    email = String(cuerpo?.email || "").trim().toLowerCase();
  } catch {
    return responder("invalido", 400);
  }

  /* Se vuelve a validar aquí: la validación del navegador es comodidad para el
     usuario, no una defensa. */
  if (!EMAIL.test(email) || email.length > 254) return responder("invalido", 400);

  const clave = secreto("RESEND_API_KEY");
  if (!clave) {
    /* Sin configurar todavía. Se avisa en el log del servidor y se responde con
       un error claro, en vez de fingir que se guardó algo que se ha perdido. */
    console.error("[subscribe] falta RESEND_API_KEY");
    return responder("sinconfigurar", 503);
  }

  try {
    const audiencia = await resolverAudiencia(clave);
    if (!audiencia) return responder("sinconfigurar", 503);

    const r = await fetch(`https://api.resend.com/audiences/${audiencia}/contacts`, {
      method: "POST",
      headers: { authorization: `Bearer ${clave}`, "content-type": "application/json" },
      body: JSON.stringify({ email, unsubscribed: false }),
    });

    if (r.ok) return responder("ok");

    /* Resend devuelve error si el contacto ya existe. Para quien se apunta dos
       veces eso no es un fallo: la intención se cumplió igual. */
    const texto = (await r.text()).toLowerCase();
    if (r.status === 409 || texto.includes("already")) return responder("yaestaba");

    console.error("[subscribe] respuesta de Resend", r.status, texto.slice(0, 300));
    return responder("error", 502);
  } catch (e) {
    console.error("[subscribe] no se pudo contactar con Resend:", e);
    return responder("error", 502);
  }
};
