/* El catálogo visto desde el panel interno.
 *
 * Son los tres productos REALES — nada de datos de muestra. La fuente de la
 * verdad sigue siendo PRODUCTS en app.js (precios y variantes de la tienda);
 * esto es su resumen operativo, y el día que el catálogo viva en el servidor
 * con Stripe, los dos beberán del mismo sitio. Si cambias un precio en la
 * tienda, cámbialo aquí también — está anotado en los dos lados.
 */
export const PRODUCTS_ADMIN = [
  { nombre: "RABBIT FUEL", precio: "$16 / $42", variantes: "PACK ×4 · PACK ×12" },
  { nombre: "THE LOOKOUT", precio: "$35", variantes: "BLANCO · NEGRO" },
  { nombre: "THE ZOOMIES", precio: "$29", variantes: "NEGRO" },
];
