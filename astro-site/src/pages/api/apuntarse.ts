import type { APIRoute } from "astro";
import { createClerkClient, verifyToken } from "@clerk/backend";
import { render } from "@react-email/render";
import * as React from "react";

import WelcomeFounder, { asunto } from "../../emails/welcome-founder";
import { secreto } from "../../lib/audiencia";
import { SITIO } from "../../emails/_marco";

/* Avisa por correo a quien acaba de apuntarse a la lista de fundadores.
 *
 * La pregunta obligada con cualquier ruta pública que manda correos es cómo se
 * abusa de ella. Aquí no se puede, y no por una lista de permitidos como en la
 * ruta de pruebas, sino por cómo está construida:
 *
 *   1. Pide el token de sesión de Clerk y lo verifica criptográficamente. Sin
 *      sesión válida no se pasa de aquí.
 *   2. **El destinatario no lo elige quien llama.** Se saca de la cuenta que hay
 *      detrás del token. Aunque alguien robara un token, lo único que lograría
 *      es mandarle un correo a su propio dueño.
 *   3. Se manda una sola vez en la vida de cada cuenta. La marca vive en
 *      publicMetadata, que solo se escribe desde el servidor: en unsafeMetadata
 *      el propio cliente podría borrarla y volver a dispararlo en bucle.
 *
 * Variables de entorno en Vercel (Diego las crea, yo no las veo nunca):
 *   CLERK_SECRET_KEY   para verificar la sesión y leer la cuenta
 *   RESEND_API_KEY     para enviar
 */
export const prerender = false;

const REMITENTE = "SnackRabbit <hello@snackrabbit.co>";
const NOMBRE_PLAN: Record<string, string> = { curioso: "CURIOUS", cavador: "DIGGER" };

const responder = (estado: string, code = 200) =>
  new Response(JSON.stringify({ estado }), {
    status: code,
    headers: { "content-type": "application/json" },
  });

export const POST: APIRoute = async ({ request }) => {
  const secretKey = secreto("CLERK_SECRET_KEY");
  const claveResend = secreto("RESEND_API_KEY");
  if (!secretKey || !claveResend) {
    console.error("[apuntarse] faltan CLERK_SECRET_KEY o RESEND_API_KEY");
    return responder("sinconfigurar", 503);
  }

  let token = "";
  try {
    token = String((await request.json())?.token || "");
  } catch {
    return responder("invalido", 400);
  }
  if (!token) return responder("invalido", 400);

  /* La verificación es lo único que separa esta ruta de un formulario abierto
     de spam. Si falla, se corta aquí sin decir por qué: a quien lo intente no
     se le regalan pistas. */
  let userId = "";
  try {
    const payload = await verifyToken(token, { secretKey });
    userId = String(payload.sub || "");
  } catch {
    return responder("nosesion", 401);
  }
  if (!userId) return responder("nosesion", 401);

  try {
    const clerk = createClerkClient({ secretKey });
    const user = await clerk.users.getUser(userId);
    const pub = (user.publicMetadata || {}) as Record<string, any>;

    if (pub.fundadorAvisado) return responder("yaavisado");

    /* Del token sale la cuenta, y de la cuenta el correo. En ningún momento se
       mira lo que venga en el cuerpo de la petición. */
    const destino = user.primaryEmailAddress?.emailAddress;
    if (!destino) {
      console.error("[apuntarse] la cuenta no tiene correo principal:", userId);
      return responder("sincorreo", 422);
    }

    const ficha = (user.unsafeMetadata as any)?.madriguera || {};

    /* La hora exacta del alta, sellada por el servidor.
     *
     * Es el único dato con el que se podrá decidir quiénes son los cien
     * primeros el día que se abra: lo que escribe el cliente
     * (`unsafeMetadata.madriguera.desde`) es solo el día, sin hora, y además lo
     * puede reescribir él mismo desde el navegador. Aquí, en publicMetadata, no
     * lo toca nadie salvo el servidor.
     *
     * Se sella ANTES de intentar el envío a propósito: si Resend falla, el
     * correo se puede reintentar mañana, pero el puesto en la cola no se
     * reconstruye después. */
    const fundador = pub.fundador || { ts: new Date().toISOString(), plan: ficha.plan || null };
    if (!pub.fundador) {
      await clerk.users.updateUser(userId, { publicMetadata: { ...pub, fundador } });
    }

    /* El enlace de baja llega con el correo ya puesto: un clic y fuera, sin
       teclear nada. */
    const baja = `${SITIO}/api/baja?e=${encodeURIComponent(destino)}`;
    const html = await render(
      React.createElement(WelcomeFounder, { plan: NOMBRE_PLAN[ficha.plan] || "DIGGER", baja }),
    );

    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${claveResend}`, "content-type": "application/json" },
      body: JSON.stringify({
        from: REMITENTE, to: [destino], subject: asunto, html,
        /* Gmail y Apple Mail enseñan su propio botón de baja cuando ven estas
           cabeceras, y lo tienen más en cuenta que el enlace del pie a la hora
           de decidir si un remitente es fiable. El -Post es la baja en un clic
           (RFC 8058): el cliente de correo manda un POST por su cuenta, sin que
           el lector tenga que abrir nada. */
        headers: {
          "List-Unsubscribe": `<${baja}>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        },
      }),
    });

    if (!r.ok) {
      console.error("[apuntarse] Resend respondió", r.status, (await r.text()).slice(0, 300));
      return responder("error", 502);
    }

    /* Se marca después de enviar, nunca antes. Si esto fallara, el peor caso es
       que alguien reciba el correo dos veces; al revés, no lo recibiría nunca. */
    await clerk.users.updateUser(userId, {
      publicMetadata: { ...pub, fundador, fundadorAvisado: true },
    });

    return responder("ok");
  } catch (e) {
    console.error("[apuntarse] no se pudo completar:", e);
    return responder("error", 502);
  }
};
