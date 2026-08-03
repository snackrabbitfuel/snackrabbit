/* Resolver la audiencia de Resend, compartido por el alta y la baja.
 *
 * Estaba escrito solo dentro de /api/subscribe. Al añadir la baja habría
 * quedado duplicado, y dos copias de la misma lógica se separan siempre: la que
 * se toca deja de parecerse a la otra sin que nadie se entere.
 *
 * Variables de entorno en Vercel:
 *   RESEND_API_KEY       imprescindible
 *   RESEND_AUDIENCE_ID   opcional: sin ella se usa la única audiencia de la
 *                        cuenta. Solo hace falta el día que haya más de una.
 */

/* Se recuerda entre peticiones: Vercel reutiliza la instancia y no tiene sentido
   volver a preguntar por la lista de audiencias en cada alta. */
let cacheada: string | null = null;

export async function resolverAudiencia(clave: string): Promise<string | null> {
  const declarada = import.meta.env.RESEND_AUDIENCE_ID || process.env.RESEND_AUDIENCE_ID;
  if (declarada) return declarada;
  if (cacheada) return cacheada;

  const r = await fetch("https://api.resend.com/audiences", {
    headers: { authorization: `Bearer ${clave}` },
  });
  if (!r.ok) {
    console.error("[audiencia] no se pudo listar:", r.status);
    return null;
  }
  const lista = (await r.json())?.data ?? [];
  if (!lista.length) {
    console.error("[audiencia] la cuenta de Resend no tiene ninguna audiencia");
    return null;
  }
  if (lista.length > 1) {
    console.warn("[audiencia] hay varias y no se declaró RESEND_AUDIENCE_ID; se usa la primera:",
                 lista[0].id, lista[0].name);
  }
  cacheada = lista[0].id;
  return cacheada;
}

/* Las claves se leen en el momento de la petición, no al compilar.
 *
 * `import.meta.env.LO_QUE_SEA` lo sustituye Astro por texto literal al construir,
 * así que la clave queda congelada en el archivo desplegado: revocarla y poner
 * la nueva en Vercel no surte efecto hasta el siguiente despliegue, y no avisa
 * nadie. Con process.env se lee de verdad en cada petición. */
export const secreto = (nombre: string): string =>
  process.env[nombre] || (import.meta.env as any)[nombre] || "";
