import { secreto } from "./audiencia";

/* EL REGISTRO DE CANJES — qué ejemplares ya se reclamaron.
 *
 * La firma del código impide INVENTARSE uno. Lo que no impide es COPIAR uno
 * válido: fotografiar el dorso y mandarlo por ahí. Sin este registro, un solo
 * código circulando por un grupo daría la carta a doscientas personas, y con
 * doce cartas copiadas cualquiera reclamaría el plush del año — que cuesta
 * dinero de verdad.
 *
 * Así que cada ejemplar se quema al reclamarlo: `2027-3-47` (carta 3, ejemplar
 * 47 del Año Uno) se guarda apuntando a quién lo canjeó. El segundo que llegue
 * con ese mismo código se encuentra la puerta cerrada.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * POR QUÉ HACE FALTA UN ALMACÉN DE VERDAD
 *
 * Esto no cabe en Clerk. `publicMetadata` es por usuario y aquí hace falta una
 * respuesta GLOBAL —"¿alguien, quien sea, ya usó este ejemplar?"— y además
 * ATÓMICA: si dos personas mandan el mismo código en el mismo segundo, exactamente
 * una debe ganar. Eso lo da un `SET ... NX`, que es una operación indivisible;
 * un "leer, mirar, escribir" en tres pasos deja una rendija por la que se
 * cuelan los dos.
 *
 * Se usa Redis por su API REST: sin SDK, sin conexiones que mantener, una
 * petición HTTP desde la función. Se provisiona desde el Marketplace de Vercel
 * (Upstash) y trae sus variables puestas. Con 500 ejemplares × 12 cartas son
 * 6.000 claves al año: el plan gratuito sobra de largo.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * SIN ALMACÉN, LA PUERTA SE CIERRA
 *
 * Si las variables no están, `disponible()` dice que no y la ruta de canje
 * responde que el sistema no está listo. Es deliberado: un canje sin registro
 * es peor que ningún canje, porque reparte cartas —y el plush— a quien copie
 * un código, y eso no se puede deshacer. Fallar cerrado es lo único
 * defendible.
 */

const url = () => secreto("UPSTASH_REDIS_REST_URL") || secreto("KV_REST_API_URL");
const token = () => secreto("UPSTASH_REDIS_REST_TOKEN") || secreto("KV_REST_API_TOKEN");

/** ¿Está el registro configurado? Sin él no se canjea nada. */
export const disponible = () => !!(url() && token());

async function mandar(comando: unknown[]): Promise<any> {
  const r = await fetch(url(), {
    method: "POST",
    headers: { authorization: `Bearer ${token()}`, "content-type": "application/json" },
    body: JSON.stringify(comando),
  });
  if (!r.ok) throw new Error(`registro respondió ${r.status}`);
  return (await r.json())?.result;
}

/**
 * Intenta quemar un ejemplar para un usuario.
 *
 * Devuelve "ok" si este canje se lo queda; "usado" si ya estaba reclamado (por
 * otro o por él mismo); "error" si el registro no responde — y en ese caso no
 * se otorga nada, porque no se puede saber si estaba libre.
 *
 * El SET va con NX: escribe SOLO si la clave no existía. Es la operación
 * atómica que decide el empate cuando dos llegan a la vez.
 */
export async function quemar(clave: string, userId: string): Promise<"ok" | "usado" | "error"> {
  try {
    const puesto = await mandar(["SET", `canje:${clave}`, userId, "NX"]);
    return puesto ? "ok" : "usado";
  } catch (e) {
    console.error("[registro] no se pudo quemar", clave, e);
    return "error";
  }
}

/** Quién canjeó este ejemplar, si alguien lo hizo. Para soporte. */
export async function duenio(clave: string): Promise<string | null> {
  try {
    return (await mandar(["GET", `canje:${clave}`])) ?? null;
  } catch {
    return null;
  }
}
