import type { APIRoute } from "astro";
import type { Estado } from "../../../lib/pedidos/tipos";
import { TRANSICIONES } from "../../../lib/pedidos/estados";
import { almacen } from "../../../lib/pedidos/almacen";
import { verificarAdmin } from "../../../lib/pedidos/guardia";

/* MOVER UN PEDIDO — la única escritura del panel.
 *
 * POST {id, a, nota?}. La regla que importa: el `por` del historial es el
 * correo VERIFICADO que devuelve la guardia, JAMÁS nada que venga en el
 * cuerpo. El historial es auditoría — "quién movió esto" — y una auditoría
 * donde el auditado escribe su propio nombre no audita nada: cualquiera
 * mandaría el correo de otro admin y firmaría en su nombre.
 *
 * La validación de la transición NO vive aquí: vive en la máquina de estados
 * (estados.ts) y el almacén la invoca. Esta ruta solo traduce el rechazo a
 * HTTP: 409 (conflicto con el estado actual del recurso), con el error
 * genérico "transicion" — el panel ya sabe qué intentó, no hace falta
 * devolverle el grafo.
 */
export const prerender = false;

const json = (cuerpo: unknown, status = 200) =>
  new Response(JSON.stringify(cuerpo), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });

export const POST: APIRoute = async ({ request }) => {
  const correo = await verificarAdmin(request);
  if (!correo) return json({ ok: false }, 401);

  let id = "";
  let a = "";
  let nota: string | undefined;
  try {
    const cuerpo = await request.json();
    id = String(cuerpo?.id || "");
    a = String(cuerpo?.a || "");
    /* La nota es opcional y se acota: el historial no es un sitio donde pegar
       novelas (ni payloads de 2 MB que alguien "olvidó" recortar). */
    if (typeof cuerpo?.nota === "string" && cuerpo.nota.trim()) {
      nota = cuerpo.nota.trim().slice(0, 500);
    }
  } catch {
    return json({ ok: false }, 400);
  }
  /* Un `a` que ni siquiera es un Estado del contrato es cuerpo malformado
     (400), no una transición inválida (409): el 409 queda reservado para
     "ese estado existe pero desde aquí no se llega". */
  if (!id || !(a in TRANSICIONES)) return json({ ok: false }, 400);
  const destino = a as Estado;

  const al = almacen();
  try {
    /* Existencia primero, para poder responder 404 sin adivinar en el mensaje
       de un Error. En el demo hay una ventana teórica entre mirar y mover
       (otro admin podría tocar en medio); si eso pasa, `transicionar` lanza
       igual y se responde 409 — nunca se escribe nada inválido. */
    if (!(await al.porId(id))) return json({ ok: false }, 404);

    const pedido = await al.transicionar(id, destino, correo, nota);
    return json({ ok: true, pedido });
  } catch (e) {
    /* `avanzar` lanzó: la máquina de estados dijo que no. El detalle se queda
       en el log del servidor — ahí sí con el pedido y el grafo completo. */
    console.error("[pedidos] transición rechazada:", e);
    return json({ ok: false, error: "transicion" }, 409);
  }
};
