/* EL MODELO DE PEDIDO — la forma que tendrá una venta de verdad.
 *
 * Este archivo es el contrato. Todo lo demás —el panel, la API, el webhook de
 * Stripe, el futuro agente— habla de pedidos con estas palabras, así que el
 * día que lleguen las ventas reales no hay que traducir nada: solo cambia de
 * dónde salen los datos, no qué son.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * EL DINERO VA EN CENTAVOS, SIEMPRE
 *
 * `total: 4200` son 42,00 $. Nunca 42.0.
 *
 * No es purismo: en coma flotante 0.1 + 0.2 no da 0.3, y un carrito con tres
 * líneas y un descuento acumula el error hasta que el total que ve el cliente
 * y el que cobra Stripe difieren en un centavo. Con enteros eso no puede
 * pasar. Stripe usa centavos por la misma razón, así que además no hay
 * conversión en la frontera.
 *
 * Se formatea solo al pintar. Nunca se guarda formateado.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * LOS NOMBRES SE CONGELAN AL COMPRAR
 *
 * Una línea guarda `nombre: "PINK COLADA"`, no una referencia al catálogo.
 * Si mañana ese sabor se retira o se renombra, el pedido de hace tres meses
 * tiene que seguir diciendo qué se vendió: es un documento contable, no una
 * vista del catálogo de hoy. El `productoId` se guarda además por si hace
 * falta cruzar, pero el nombre que se enseña es el congelado.
 *
 * El precio, en cambio, ya viene congelado por la misma razón — y por otra
 * que ya nos mordió en el carrito: lo que el navegador guarda no se puede
 * creer, así que el precio de una línea lo escribe el servidor al cobrar.
 */

/** Estados por los que pasa un pedido. Ver `estados.ts` para qué puede seguir a qué. */
export type Estado =
  | "pagado"       // Stripe confirmó el cobro. Punto de entrada de todo pedido.
  | "prepara"      // alguien lo está empacando
  | "empacado"     // listo, esperando al transportista
  | "enviado"      // en manos del transportista, con seguimiento
  | "retraso"      // enviado pero el seguimiento no avanza
  | "entregado"    // fin feliz
  | "cancelado"    // no llegó a salir
  | "reembolsado"; // se devolvió el dinero

export interface Linea {
  /** Id del catálogo, por si hace falta cruzar. NO es lo que se enseña. */
  productoId: string;
  /** El nombre tal como se vendió. Congelado: ver cabecera. */
  nombre: string;
  /** El pack o la talla: "PACK ×4", "ÚNICA". */
  variante?: string | null;
  /** El sabor o color elegido: "PINK COLADA", "NEGRO". */
  sabor?: string | null;
  cantidad: number;
  /** Centavos por unidad, congelado al cobrar. */
  precioUnitario: number;
}

export interface Cliente {
  nombre: string;
  email: string;
  /** Se guarda desglosado: el panel agrupa por región y un texto suelto no se puede agrupar. */
  ciudad?: string | null;
  region?: string | null;
  pais?: string | null;
}

export interface Envio {
  transportista?: string | null;   // "USPS Ground Advantage"
  seguimiento?: string | null;     // el número
  urlSeguimiento?: string | null;  // enlace directo, si el transportista lo da
  enviadoEn?: string | null;       // ISO
  entregadoEn?: string | null;     // ISO
}

/** Una entrada del historial. Quién movió el pedido y cuándo — auditoría. */
export interface Paso {
  estado: Estado;
  /** ISO. */
  en: string;
  /** Correo del admin, "stripe" si lo movió un webhook, "sistema" si fue automático. */
  por: string;
  nota?: string | null;
}

export interface Pedido {
  /** Legible para humanos: "SR-1049". Es lo que el cliente pone en un correo. */
  id: string;
  /** ISO. */
  creadoEn: string;
  estado: Estado;
  cliente: Cliente;
  lineas: Linea[];

  /* Dinero, todo en centavos. El total se guarda calculado y no se recalcula
     al pintar: es lo que se cobró de verdad, y si un día cambian los
     impuestos, el pedido viejo tiene que seguir cuadrando con el banco. */
  subtotal: number;
  costeEnvio: number;
  impuestos: number;
  total: number;
  moneda: "usd";

  /** El identificador de Stripe, para cruzar con el banco. Null en demo. */
  pagoId?: string | null;

  envio: Envio;
  /** Del más viejo al más nuevo. Nunca se borra una entrada. */
  historial: Paso[];
}

/** Filtro para listar. Todo opcional: sin filtro, salen todos. */
export interface Filtro {
  estado?: Estado | Estado[];
  /** Busca en id, nombre y correo del cliente. */
  texto?: string;
  /** ISO. Pedidos creados desde esta fecha. */
  desde?: string;
  limite?: number;
}

/** Lo que hace falta para crear un pedido. El id, la fecha y el historial los pone el almacén. */
export interface NuevoPedido {
  cliente: Cliente;
  lineas: Linea[];
  costeEnvio: number;
  impuestos: number;
  pagoId?: string | null;
  /** Si el pago ya está confirmado (el caso normal viniendo de Stripe). */
  estado?: Estado;
}

/* ── ayudas de dinero ──
   Viven aquí para que nadie tenga la tentación de hacer la cuenta a mano en
   una plantilla y equivocarse en el redondeo. */

export const subtotalDe = (lineas: Linea[]): number =>
  lineas.reduce((s, l) => s + l.precioUnitario * l.cantidad, 0);

export const totalDe = (p: Pick<Pedido, "subtotal" | "costeEnvio" | "impuestos">): number =>
  p.subtotal + p.costeEnvio + p.impuestos;

/** Centavos → "$42.00". Solo para pintar. */
export const dinero = (centavos: number, moneda: string = "usd"): string =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: moneda.toUpperCase() })
    .format(centavos / 100);
