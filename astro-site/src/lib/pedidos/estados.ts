import type { Estado, Pedido } from "./tipos";

/* LA MÁQUINA DE ESTADOS DE PEDIDOS.
 *
 * Un pedido podría llevar su estado en un campo libre que cualquiera escribe.
 * No lo lleva, y la razón es contable: un pedido "entregado" que vuelve a
 * "pagado" es un desastre — el historial dice que se entregó, el banco dice
 * que se cobró, y el tablero lo enseña como pendiente de empacar. Nadie sabe
 * ya qué pasó de verdad.
 *
 * Con la máquina, las transiciones inválidas se rechazan en UN solo sitio.
 * La alternativa es confiar en que cada llamador — el panel, el webhook de
 * Stripe, el futuro agente — compruebe por su cuenta qué movimientos tienen
 * sentido, y basta con que uno se lo salte una vez para corromper un pedido.
 * Aquí el que quiera mover un pedido pasa por `avanzar`, y `avanzar` no
 * negocia.
 *
 * `avanzar` además devuelve un pedido NUEVO en vez de mutar el que recibe:
 * si la escritura al almacén falla a mitad, el pedido original sigue intacto
 * y no queda un objeto en memoria que dice una cosa mientras el disco dice
 * otra.
 */

/* Qué puede seguir a qué. Un estado ausente de su propia lista no puede
 * repetirse: no existe "volver a pagar". Los arrays vacíos son los estados
 * terminales — de "cancelado" y "reembolsado" no se sale, porque las dos
 * significan que el dinero ya volvió (o nunca se movió) y reabrirlos
 * descuadraría la caja. */
export const TRANSICIONES: Record<Estado, Estado[]> = {
  pagado: ["prepara", "cancelado"],
  prepara: ["empacado", "cancelado"],
  empacado: ["enviado", "cancelado"],
  /* Después de "enviado" ya no hay "cancelado": el paquete está en la calle
     y lo que procede si algo va mal es reembolsar, no fingir que no salió. */
  enviado: ["entregado", "retraso"],
  retraso: ["enviado", "entregado", "reembolsado"],
  entregado: ["reembolsado"],
  cancelado: [],
  reembolsado: [],
};

export function puedeIr(de: Estado, a: Estado): boolean {
  return TRANSICIONES[de].includes(a);
}

export function esTerminal(e: Estado): boolean {
  return TRANSICIONES[e].length === 0;
}

/**
 * Mueve un pedido a otro estado. Devuelve un pedido NUEVO — el recibido no se
 * toca — con el estado cambiado y la entrada de auditoría añadida al final del
 * historial. Si la transición no está en el mapa, lanza: mejor un error ruidoso
 * en el servidor que un pedido corrupto callado en el almacén.
 */
export function avanzar(pedido: Pedido, a: Estado, por: string, nota?: string): Pedido {
  if (!puedeIr(pedido.estado, a)) {
    throw new Error(
      `Transición inválida en ${pedido.id}: ${pedido.estado} → ${a}. ` +
        `Desde "${pedido.estado}" solo se puede ir a: ${TRANSICIONES[pedido.estado].join(", ") || "(ninguno, es terminal)"}.`
    );
  }
  return {
    ...pedido,
    estado: a,
    /* El historial también se copia: mutar el array del pedido original sería
       mutarlo a él por la puerta de atrás. */
    historial: [
      ...pedido.historial,
      { estado: a, en: new Date().toISOString(), por, nota: nota ?? null },
    ],
  };
}

/* El orden de las columnas del tablero kanban del panel: el viaje feliz de
 * izquierda a derecha, con "retraso" al final como columna de alarma. Los
 * otros tres estados no son columnas — "entregado", "cancelado" y
 * "reembolsado" son listas aparte, porque un pedido que ya terminó no es
 * trabajo pendiente y solo estorbaría en el tablero. */
export const ORDEN_TABLERO: Estado[] = ["pagado", "prepara", "empacado", "enviado", "retraso"];
