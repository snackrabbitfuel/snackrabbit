import type { APIRoute } from "astro";
import type { Estado, Filtro } from "../../../lib/pedidos/tipos";
import { TRANSICIONES } from "../../../lib/pedidos/estados";
import { almacen } from "../../../lib/pedidos/almacen";
import { verificarAdmin } from "../../../lib/pedidos/guardia";

/* LISTAR PEDIDOS — la lectura del panel.
 *
 * GET con filtros en la query (?estado=pagado&estado=prepara&q=ava&desde=...&limite=20)
 * porque una lectura con filtros ES una URL: se puede recargar, compartir
 * entre admins y guardar en un marcador del tablero. Los datos, en cambio,
 * salen SOLO tras verificar el token — la URL dice qué quieres ver, la
 * cabecera Authorization dice quién eres.
 *
 * Sin admin verificado: 401 con `{ok:false}` y nada más. Ni "token caducado",
 * ni "ese usuario no existe" — a quien esté probando puertas no se le regalan
 * pistas de por cuál iba bien.
 */
export const prerender = false;

const json = (cuerpo: unknown, status = 200) =>
  new Response(JSON.stringify(cuerpo), {
    status,
    /* no-store: son datos vivos del negocio. Una caché intermedia enseñando
       pedidos de hace una hora — o a la persona equivocada — no es un bug
       aceptable. */
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });

export const GET: APIRoute = async ({ request }) => {
  const correo = await verificarAdmin(request);
  if (!correo) return json({ ok: false }, 401);

  const q = new URL(request.url).searchParams;

  /* `estado` es repetible (?estado=pagado&estado=prepara). Se filtra contra
     las claves de TRANSICIONES en vez de castear a ciegas: un valor inventado
     en la query no debe colarse hasta el almacén como si fuera un Estado. */
  const estados = q.getAll("estado").filter((e): e is Estado => e in TRANSICIONES);

  const f: Filtro = {};
  if (estados.length) f.estado = estados;
  const texto = q.get("q")?.trim();
  if (texto) f.texto = texto;
  const desde = q.get("desde")?.trim();
  if (desde) f.desde = desde;
  /* limite se sanea aquí: el almacén ya ignora valores <= 0, pero un NaN de
     "?limite=abc" no tiene por qué viajar más adentro. */
  const limite = Number(q.get("limite"));
  if (Number.isFinite(limite) && limite > 0) f.limite = Math.floor(limite);

  const a = almacen();
  try {
    const pedidos = await a.listar(f);
    /* `demo` viaja en la respuesta para que el panel pinte el sello DEMO:
       decidirlo en el cliente sería adivinar qué adaptador corre el servidor. */
    return json({ ok: true, demo: a.esDemo(), pedidos });
  } catch (e) {
    /* El adaptador real sin implementar (o una BD caída) cae aquí: 503 sin
       detalles. Fallar cerrado, nunca degradar a datos de mentira. */
    console.error("[pedidos] listar falló:", e);
    return json({ ok: false }, 503);
  }
};
