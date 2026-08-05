import type { APIRoute } from "astro";
import { verifyToken, createClerkClient } from "@clerk/backend";
import { secreto } from "../../lib/audiencia";
import { SITIO } from "../../emails/_marco";
import { esAdmin } from "../../data/admins";

/* LA PUERTA DE VERDAD del panel interno.
 *
 * El panel no enseña un solo dato hasta que esta ruta diga que sí. La
 * comprobación del navegador (la lista de src/data/admins.ts) decide qué se
 * pinta; esta decide quién entra. Son dos cosas distintas y hacen falta las
 * dos, porque todo lo que corre en el navegador lo puede reescribir quien lo
 * abra: cambiar un `if` en la consola es trivial, y sin esta ruta ese `if`
 * sería lo único entre un curioso y las ventas de la tienda.
 *
 * Por qué esto no se puede burlar:
 *
 *   1. El token se verifica CRIPTOGRÁFICAMENTE con la clave secreta de Clerk,
 *      que solo existe en el servidor. No es un "¿tienes una cookie?": es una
 *      firma que solo Clerk pudo emitir.
 *
 *   2. `authorizedParties` ata el token a nuestros dominios. Sin esa lista, un
 *      token válido emitido para OTRA aplicación de Clerk entraría aquí como
 *      si fuera nuestro — es el fallo clásico de esta verificación.
 *
 *   3. **El correo no lo manda quien llama.** Se lee de la cuenta que hay
 *      detrás del token, consultando a Clerk. Aunque alguien mandara
 *      `{"email":"dieval20@gmail.com"}` en el cuerpo, este código no lo mira.
 *
 *   4. Solo cuenta el correo VERIFICADO y primario. Un correo secundario sin
 *      verificar es una dirección que su dueño escribió y nadie comprobó:
 *      aceptarlo permitiría reclamar el correo de un admin y entrar.
 *
 * Responde a propósito con lo mínimo: `{ admin: true }` o `{ admin: false }`.
 * Ni el motivo, ni la lista, ni si la cuenta existe. A quien lo intente no se
 * le regalan pistas.
 *
 * Variables de entorno en Vercel (las crea Diego; yo no las veo nunca):
 *   CLERK_SECRET_KEY   para verificar la sesión y leer la cuenta
 */
export const prerender = false;

const no = (code = 200) =>
  new Response(JSON.stringify({ admin: false }), {
    status: code,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });

export const POST: APIRoute = async ({ request }) => {
  const secretKey = secreto("CLERK_SECRET_KEY");
  if (!secretKey) {
    console.error("[admin] falta CLERK_SECRET_KEY");
    /* Sin la clave no se puede verificar nada, así que no entra nadie. Fallar
       cerrado es la única opción defendible: un fallo de configuración no
       puede convertirse en una puerta abierta. */
    return no(503);
  }

  let token = "";
  try {
    token = String((await request.json())?.token || "");
  } catch {
    return no(400);
  }
  if (!token) return no(401);

  let userId = "";
  try {
    const payload = await verifyToken(token, {
      secretKey,
      authorizedParties: [SITIO, "https://snackrabbit.co", "http://localhost:4321"],
    });
    userId = String(payload.sub || "");
  } catch {
    return no(401);
  }
  if (!userId) return no(401);

  try {
    const clerk = createClerkClient({ secretKey });
    const user = await clerk.users.getUser(userId);

    /* El correo primario Y verificado, sacado de la cuenta. Un correo sin
       verificar es texto que alguien escribió: si contara, cualquiera podría
       añadir el correo de un admin a su cuenta y entrar sin tocarlo. */
    const principal = user.emailAddresses.find(e => e.id === user.primaryEmailAddressId);
    const verificado = principal?.verification?.status === "verified";
    const correo = verificado ? principal?.emailAddress : null;

    if (!esAdmin(correo)) return no();

    return new Response(
      JSON.stringify({
        admin: true,
        /* Se devuelve para que la cabecera del panel salude con algo real, no
           para decidir nada: la decisión ya está tomada aquí arriba. */
        correo,
      }),
      { status: 200, headers: { "content-type": "application/json", "cache-control": "no-store" } },
    );
  } catch (e) {
    console.error("[admin] no se pudo leer la cuenta:", e);
    return no(502);
  }
};
