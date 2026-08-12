import { verifyToken, createClerkClient } from "@clerk/backend";
import { secreto } from "../audiencia";
import { SITIO } from "../../emails/_marco";
import { esAdmin } from "../../data/admins";

/* LA GUARDIA DE LAS RUTAS DE PEDIDOS — la misma puerta que /api/admin, extraída.
 *
 * La lógica de "¿quién eres y mandas?" ya existe en /api/admin y funciona en
 * producción. Ahora la necesitan TRES rutas nuevas (listar pedidos, mover
 * pedidos, y las que vengan), y copiarla tres veces es exactamente como se
 * desincronizan las puertas: alguien endurece una copia —añade un dominio a
 * `authorizedParties`, aprieta la comprobación del correo— y las otras dos se
 * quedan blandas sin que nadie lo note. Una guardia, un archivo, y quien
 * quiera endurecerla la endurece para todos a la vez.
 *
 * /api/admin NO se toca a propósito: está desplegada y el panel depende de
 * ella. Migrarla a esta guardia es un cambio con calma y su propia prueba,
 * no un "ya que estamos" colado en el commit de la API de pedidos.
 *
 * Por qué esto no se puede burlar (idéntico a /api/admin):
 *
 *   1. El token se verifica CRIPTOGRÁFICAMENTE con CLERK_SECRET_KEY, que solo
 *      existe en el servidor. No es "¿traes una cookie?": es una firma que
 *      solo Clerk pudo emitir.
 *
 *   2. `authorizedParties` ata el token a nuestros dominios. Sin esa lista,
 *      un token válido de OTRA aplicación de Clerk entraría como si fuera
 *      nuestro — el fallo clásico de esta verificación.
 *
 *   3. El correo NO lo manda quien llama: se lee de la cuenta que hay detrás
 *      del token, consultando a Clerk. Y solo cuenta el correo primario Y
 *      verificado — un correo sin verificar es texto que alguien escribió.
 *
 * Devuelve el correo verificado del admin, o null. A propósito no distingue
 * POR QUÉ falló (sin token, token caducado, cuenta sin permiso): las rutas
 * responden lo mínimo y aquí no se fabrica el desglose que luego alguien
 * tendría la tentación de filtrar al cliente.
 */

export async function verificarAdmin(request: Request): Promise<string | null> {
  const secretKey = secreto("CLERK_SECRET_KEY");
  if (!secretKey) {
    /* Fallo de configuración = no entra nadie. La ruta que llame decidirá el
       código HTTP; aquí solo consta que la puerta está cerrada. */
    console.error("[guardia] falta CLERK_SECRET_KEY");
    return null;
  }

  /* El token viaja en `Authorization: Bearer <token>`, el sitio estándar para
     credenciales. (/api/admin lo lee del cuerpo por historia; las rutas nuevas
     usan la cabecera y así un GET puede autenticarse sin inventarse cuerpo.) */
  const auth = request.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice("Bearer ".length).trim() : "";
  if (!token) return null;

  let userId = "";
  try {
    const payload = await verifyToken(token, {
      secretKey,
      authorizedParties: [SITIO, "https://snackrabbit.co", "http://localhost:4321"],
    });
    userId = String(payload.sub || "");
  } catch {
    return null;
  }
  if (!userId) return null;

  try {
    const clerk = createClerkClient({ secretKey });
    const user = await clerk.users.getUser(userId);

    /* El correo primario Y verificado, sacado de la cuenta. Un correo sin
       verificar es texto que alguien escribió: si contara, cualquiera podría
       añadir el correo de un admin a su cuenta y entrar sin tocarlo. */
    const principal = user.emailAddresses.find(e => e.id === user.primaryEmailAddressId);
    const verificado = principal?.verification?.status === "verified";
    const correo = verificado ? principal?.emailAddress : null;

    return esAdmin(correo) ? (correo as string) : null;
  } catch (e) {
    console.error("[guardia] no se pudo leer la cuenta:", e);
    return null;
  }
}
