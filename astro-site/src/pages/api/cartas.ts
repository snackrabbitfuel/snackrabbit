import type { APIRoute } from "astro";
import { verifyToken, createClerkClient } from "@clerk/backend";
import { secreto } from "../../lib/audiencia";
import { SITIO } from "../../emails/_marco";
import { esAdmin } from "../../data/admins";
import { CARAS } from "../../data/caras";
import { desbloqueadas, desbloqueadasAdmin } from "../../data/serie";

/* QUÉ CARAS SE PUEDEN VER HOY.
 *
 * Antes esto era una tarea de calendario: alguien tenía que acordarse de subir
 * la cara del mes. Una tarea mensual que se olvida tiene víctima concreta — el
 * socio de ese mes abre su panel y ve un hueco en vez de su carta, que es lo
 * que ha pagado. Ahora lo decide el reloj, y el reloj no se olvida.
 *
 * POR QUÉ ESTO TIENE QUE VIVIR EN EL SERVIDOR
 *
 * Las doce caras están subidas desde ya, pero con el nombre marcado por un
 * hash de su contenido: `c007-en-53879369df18.webp`. Nadie llega ahí
 * escribiendo la URL. La única forma de saber cómo se llama la carta de
 * septiembre es que esta ruta te lo diga, y solo lo dice cuando septiembre ha
 * llegado. Si esta lógica viviera en el navegador, el manifiesto entero
 * viajaría con la página y el estreno mes a mes se acabaría el primer día.
 *
 * DOS RELOJES (están explicados en src/data/serie.ts):
 *   · público → el del club: nada hasta enero de 2027, luego una al mes.
 *   · equipo  → el del calendario: en agosto ocho, en septiembre nueve, para
 *               poder ver el producto funcionando sin esperar ni falsear datos.
 *
 * La vista previa del equipo NO otorga cartas: dice qué caras se pueden
 * mirar, no de quién son. Quién tiene qué sigue viviendo en
 * publicMetadata.cartas, que solo escribe el servidor.
 *
 * Sin token responde igual, con el reloj público: la portada la necesita para
 * su carrusel y ahí no hay nadie que haya entrado.
 */
export const prerender = false;

const responder = (hasta: number, admin: boolean) => {
  /* Solo se nombran las desbloqueadas. Las demás no aparecen: no se puede
     filtrar lo que nunca se manda. */
  const caras: Record<number, { es: string; en: string }> = {};
  for (let n = 1; n <= hasta; n++) if (CARAS[n]) caras[n] = CARAS[n];
  return new Response(JSON.stringify({ hasta, admin, caras }), {
    status: 200,
    headers: {
      "content-type": "application/json",
      /* No se cachea: cambia solo al cruzar un mes, pero una respuesta de
         admin cacheada por un intermediario le daría la vista previa a
         cualquiera. */
      "cache-control": "no-store",
    },
  });
};

export const POST: APIRoute = async ({ request }) => {
  const publico = desbloqueadas();

  let token = "";
  try {
    token = String((await request.json())?.token || "");
  } catch {
    return responder(publico, false);
  }
  if (!token) return responder(publico, false);

  const secretKey = secreto("CLERK_SECRET_KEY");
  /* Sin la clave no se puede verificar nada, así que nadie es admin. Fallar
     cerrado: un fallo de configuración no puede abrir el año entero. */
  if (!secretKey) return responder(publico, false);

  try {
    const payload = await verifyToken(token, {
      secretKey,
      authorizedParties: [SITIO, "https://snackrabbit.co", "http://localhost:4321"],
    });
    const userId = String(payload.sub || "");
    if (!userId) return responder(publico, false);

    const clerk = createClerkClient({ secretKey });
    const user = await clerk.users.getUser(userId);
    /* El correo sale de la CUENTA y tiene que estar verificado — nunca de lo
       que mande el navegador. Es la misma regla que /api/admin. */
    const principal = user.emailAddresses.find(e => e.id === user.primaryEmailAddressId);
    const correo = principal?.verification?.status === "verified" ? principal.emailAddress : null;

    if (!esAdmin(correo)) return responder(publico, false);
    return responder(desbloqueadasAdmin(), true);
  } catch {
    return responder(publico, false);
  }
};

/* La portada no tiene sesión y necesita saber cuál es la carta del mes. */
export const GET: APIRoute = async () => responder(desbloqueadas(), false);
