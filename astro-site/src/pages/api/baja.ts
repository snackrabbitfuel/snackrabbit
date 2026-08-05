import type { APIRoute } from "astro";
import { resolverAudiencia, secreto } from "../../lib/audiencia";

/* Baja de la lista de correo.
 *
 * Existe porque el pie de todos los correos enlazaba a "{{unsubscribe}}" tal
 * cual: un enlace que daba 404. Eso incumple CAN-SPAM —que exige un mecanismo
 * de baja que funcione— y contradice de frente lo que promete la política de
 * privacidad publicada.
 *
 * No pide token, y es una decisión consciente. Firmar el enlace obligaría a
 * otro secreto más en Vercel, y lo peor que puede hacer quien abuse de esto es
 * quitar de una lista de marketing a alguien cuyo correo ya conocía: molesto,
 * reversible en un clic, y sin acceso a ningún dato. Frente a eso, un enlace de
 * baja que no funcione es una multa. El equilibrio está claro.
 *
 * Acepta GET y POST a propósito. El GET es para el enlace del correo; el POST,
 * para el formulario y para la baja en un clic de Gmail y Apple Mail
 * (List-Unsubscribe-Post, RFC 8058), que exige que el enlace no sea un GET.
 */
export const prerender = false;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

async function darDeBaja(email: string): Promise<"ok" | "invalido" | "sinconfigurar" | "error"> {
  if (!EMAIL.test(email) || email.length > 254) return "invalido";

  const clave = secreto("RESEND_API_KEY");
  if (!clave) {
    console.error("[baja] falta RESEND_API_KEY");
    return "sinconfigurar";
  }

  try {
    const audiencia = await resolverAudiencia(clave);
    if (!audiencia) return "sinconfigurar";

    /* Se marca como dado de baja en vez de borrarlo: así queda la constancia y
       Resend lo suprime de los envíos siguientes. Borrarlo dejaría la puerta
       abierta a que una importación posterior lo volviera a meter. */
    const r = await fetch(
      `https://api.resend.com/audiences/${audiencia}/contacts/${encodeURIComponent(email)}`,
      {
        method: "PATCH",
        headers: { authorization: `Bearer ${clave}`, "content-type": "application/json" },
        body: JSON.stringify({ unsubscribed: true }),
      },
    );

    /* Si no estaba en la lista, la intención se cumplió igual: no recibe nada.
       Decirle "no estabas" solo confirmaría a un curioso si esa dirección está
       apuntada o no. */
    if (r.ok || r.status === 404) return "ok";

    console.error("[baja] Resend respondió", r.status, (await r.text()).slice(0, 300));
    return "error";
  } catch (e) {
    console.error("[baja] no se pudo contactar con Resend:", e);
    return "error";
  }
}

const responder = (estado: string) =>
  new Response(JSON.stringify({ estado }), {
    status: estado === "ok" ? 200 : estado === "invalido" ? 400 : 502,
    headers: { "content-type": "application/json" },
  });

export const POST: APIRoute = async ({ request, url }) => {
  let email = url.searchParams.get("e") || "";
  if (!email) {
    try { email = String((await request.json())?.email || ""); } catch { /* venía en la URL */ }
  }
  return responder(await darDeBaja(email.trim().toLowerCase()));
};

/* El enlace del correo entra por aquí y aterriza en la página con el correo ya
   puesto — SIN darse de baja todavía. Antes el GET ejecutaba la baja, y eso
   tiene una trampa conocida: los escáneres de enlaces (Outlook SafeLinks, los
   antivirus corporativos) abren por GET todos los enlaces de un correo al
   recibirlo, y estaban dando de baja a gente que no había tocado nada. La baja
   real es el POST: el botón del formulario o el one-click RFC 8058 de Gmail y
   Apple Mail, que los escáneres no disparan. Un clic más para el humano; cero
   bajas fantasma. */
export const GET: APIRoute = async ({ url }) => {
  const email = (url.searchParams.get("e") || "").trim().toLowerCase();
  return new Response(null, {
    status: 302,
    headers: { location: `/unsubscribe?e=${encodeURIComponent(email)}` },
  });
};
