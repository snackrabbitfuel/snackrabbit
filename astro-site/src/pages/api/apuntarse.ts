import type { APIRoute } from "astro";
import { createClerkClient, verifyToken } from "@clerk/backend";
import { render } from "@react-email/render";
import * as React from "react";

import WelcomeFounder, { asunto } from "../../emails/welcome-founder";

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
  const secretKey = import.meta.env.CLERK_SECRET_KEY;
  const claveResend = import.meta.env.RESEND_API_KEY;
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

    if ((user.publicMetadata as any)?.fundadorAvisado) return responder("yaavisado");

    /* Del token sale la cuenta, y de la cuenta el correo. En ningún momento se
       mira lo que venga en el cuerpo de la petición. */
    const destino = user.primaryEmailAddress?.emailAddress;
    if (!destino) {
      console.error("[apuntarse] la cuenta no tiene correo principal:", userId);
      return responder("sincorreo", 422);
    }

    const ficha = (user.unsafeMetadata as any)?.madriguera || {};
    const html = await render(
      React.createElement(WelcomeFounder, { plan: NOMBRE_PLAN[ficha.plan] || "DIGGER" }),
    );

    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${claveResend}`, "content-type": "application/json" },
      body: JSON.stringify({ from: REMITENTE, to: [destino], subject: asunto, html }),
    });

    if (!r.ok) {
      console.error("[apuntarse] Resend respondió", r.status, (await r.text()).slice(0, 300));
      return responder("error", 502);
    }

    /* Se marca después de enviar, nunca antes. Si esto fallara, el peor caso es
       que alguien reciba el correo dos veces; al revés, no lo recibiría nunca. */
    await clerk.users.updateUser(userId, {
      publicMetadata: { ...(user.publicMetadata || {}), fundadorAvisado: true },
    });

    return responder("ok");
  } catch (e) {
    console.error("[apuntarse] no se pudo completar:", e);
    return responder("error", 502);
  }
};
