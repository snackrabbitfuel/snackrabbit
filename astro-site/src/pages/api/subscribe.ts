import type { APIRoute } from "astro";
import { resolverAudiencia, secreto } from "../../lib/audiencia";
import { render } from "@react-email/render";
import * as React from "react";
import WelcomeList, { asunto, asuntoEs } from "../../emails/welcome-list";

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
const SITIO = "https://www.snackrabbit.co";
const REMITENTE = "SnackRabbit <hello@snackrabbit.co>";

/* La bienvenida. La plantilla existía y no la enviaba nadie: quien se apuntaba
 * quedaba mudo en la lista, y la promesa del formulario —la curiosidad del
 * mes— empezaba con un silencio. Se envía SOLO en el alta nueva (no en
 * "yaestaba": apuntarse dos veces no debe llenar la bandeja), y si el envío
 * falla, el alta sigue valiendo: el contacto ya está guardado y el error se
 * queda en el log, no en la cara del usuario. */
async function enviarBienvenida(clave: string, email: string, idioma: "es" | "en") {
  try {
    const el = React.createElement(WelcomeList, {
      idioma,
      /* El enlace del cuerpo va a la página con el correo puesto (un clic de
         confirmación): los escáneres de enlaces abren los GET y daban de baja
         a gente sin querer. El one-click de verdad va en las cabeceras. */
      baja: `${SITIO}/unsubscribe?e=${encodeURIComponent(email)}`,
    });
    const html = await render(el);
    const text = await render(el, { plainText: true });
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${clave}`, "content-type": "application/json" },
      body: JSON.stringify({
        from: REMITENTE, to: [email],
        subject: idioma === "es" ? asuntoEs : asunto,
        html, text,
        headers: {
          "List-Unsubscribe": `<${SITIO}/api/baja?e=${encodeURIComponent(email)}>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        },
      }),
    });
    if (!r.ok) console.error("[subscribe] bienvenida no enviada", r.status, (await r.text()).slice(0, 200));
  } catch (e) {
    console.error("[subscribe] bienvenida no enviada:", e);
  }
}

const responder = (estado: string, code = 200) =>
  new Response(JSON.stringify({ estado }), {
    status: code,
    headers: { "content-type": "application/json" },
  });

export const POST: APIRoute = async ({ request }) => {
  let email = "";
  let idioma: "es" | "en" = "en";
  try {
    const cuerpo = await request.json();
    email = String(cuerpo?.email || "").trim().toLowerCase();
    if (cuerpo?.lang === "es") idioma = "es";
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

    if (r.ok) {
      await enviarBienvenida(clave, email, idioma);
      return responder("ok");
    }

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
