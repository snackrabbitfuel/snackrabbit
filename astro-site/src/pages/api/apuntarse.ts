import type { APIRoute } from "astro";
import { createClerkClient, verifyToken } from "@clerk/backend";
import { render } from "@react-email/render";
import * as React from "react";

import WelcomeFounder, { asunto, asuntoEs } from "../../emails/welcome-founder";
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
const NOMBRE_PLAN: Record<"es" | "en", Record<string, string>> = {
  en: { curioso: "CURIOUS", cavador: "DIGGER" },
  es: { curioso: "CURIOSO", cavador: "CAVADOR" },
};

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
    /* authorizedParties ata el token a nuestros dominios. Sin esa lista, un
       token emitido para otra aplicación de Clerk se aceptaría aquí como si
       fuera nuestro. */
    const payload = await verifyToken(token, {
      secretKey,
      authorizedParties: [SITIO, "https://snackrabbit.co", "http://localhost:4321"],
    });
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

    /* Solo se avisa a quien de verdad está en la lista. Sin esta comprobación,
       cualquier cuenta podía llamar aquí sin haberse apuntado: gastaba su único
       correo de fundador y quedaba sellada con un puesto en una cola en la que
       no estaba. */
    if (!ficha.lista) return responder("sinlista", 409);

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

    /* Dos enlaces de baja distintos a propósito. El del CUERPO va a la página
       con el correo puesto —un clic de confirmación—, porque los escáneres de
       enlaces (Outlook SafeLinks y compañía) abren los GET de los correos y
       daban de baja a gente que no había tocado nada. El de las CABECERAS va
       al API: el one-click RFC 8058 manda un POST, que los escáneres no
       disparan. */
    const baja = `${SITIO}/unsubscribe?e=${encodeURIComponent(destino)}`;
    const bajaApi = `${SITIO}/api/baja?e=${encodeURIComponent(destino)}`;
    /* El idioma viaja desde el alta: el servidor no puede saberlo de otra
       forma —vive en el localStorage del navegador— y escribirle en inglés a
       quien navega en español es empezar pidiéndole que se esfuerce. */
    const idioma = ficha.idioma === "es" ? "es" : "en";
    const el = React.createElement(WelcomeFounder, {
      plan: NOMBRE_PLAN[idioma][ficha.plan] || NOMBRE_PLAN[idioma].cavador, baja, idioma,
    });
    const html = await render(el);
    /* La versión en texto plano no es decorativa: los filtros de correo
       desconfían de un mensaje solo-HTML, y los lectores de pantalla y los
       relojes la usan tal cual. */
    const text = await render(el, { plainText: true });

    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${claveResend}`, "content-type": "application/json" },
      body: JSON.stringify({
        from: REMITENTE, to: [destino], subject: idioma === "es" ? asuntoEs : asunto, html, text,
        /* Gmail y Apple Mail enseñan su propio botón de baja cuando ven estas
           cabeceras, y lo tienen más en cuenta que el enlace del pie a la hora
           de decidir si un remitente es fiable. El -Post es la baja en un clic
           (RFC 8058): el cliente de correo manda un POST por su cuenta, sin que
           el lector tenga que abrir nada. */
        headers: {
          "List-Unsubscribe": `<${bajaApi}>`,
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
