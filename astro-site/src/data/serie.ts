/* EL CALENDARIO DE LA SERIE — cuándo se destapa cada carta.
 *
 * Vive aquí y no en app.js porque ahora lo necesitan los dos lados: el
 * navegador para pintar el año, y el servidor para decidir qué caras entrega.
 * Dos copias del mismo número siempre acaban separándose, y separadas
 * significarían que la web enseña una cosa y el servidor otra.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * DOS RELOJES, A PROPÓSITO
 *
 * `desbloqueadas()` — el reloj del CLUB. La serie es el Año Uno completo:
 * enero a diciembre de 2027. Antes de esa fecha no hay ninguna carta que
 * enseñar, porque no se ha enviado ninguna. Este es el reloj que ve todo el
 * mundo, y es el que guarda la sorpresa.
 *
 * `desbloqueadasAdmin()` — el reloj del EQUIPO. Sigue el mes del calendario
 * real, sea el año que sea, para que quien lleva la empresa pueda ver el
 * producto funcionando sin esperar a 2027 ni tocar datos a mano. En agosto ve
 * ocho, en septiembre nueve. Es una vista previa, no una propiedad: no otorga
 * cartas a nadie ni escribe nada.
 */

/** Año Uno: enero a diciembre. La serie no se reimprime. */
export const ANIO_SERIE = 2027;

/** Cartas de una serie. */
export const TOTAL_CARTAS = 12;

/**
 * Cuántas caras puede ver el público a día de hoy.
 *
 * Antes del Año Uno: 1 — la 001 es el escaparate, la que enseña de qué va
 * esto en la portada. Durante el año: una por mes cumplido. Después: las doce.
 */
export function desbloqueadas(hoy: Date = new Date()): number {
  const anio = hoy.getFullYear();
  if (anio < ANIO_SERIE) return 1;
  if (anio > ANIO_SERIE) return TOTAL_CARTAS;
  return hoy.getMonth() + 1;
}

/**
 * Cuántas ve el equipo: TODAS, siempre.
 *
 * Antes seguía el mes del calendario —en agosto ocho, en septiembre nueve—
 * imitando al reloj del club. La idea era ver el producto "funcionando", pero
 * en la práctica escondía el propio catálogo a quien lo escribió: para revisar
 * la carta de diciembre había que esperar a diciembre, y para comprobar un
 * canje de una carta futura no había forma.
 *
 * El reloj mensual existe para guardar la sorpresa DE LOS SOCIOS. Al dueño no
 * hay nada que ocultarle: son sus textos, su arte y sus PDF de imprenta.
 *
 * Esto no abre ninguna puerta. Quien decide si esta función se usa es
 * /api/cartas, y solo la llama DESPUÉS de verificar el token contra Clerk y
 * comprobar el correo contra el registro de administradores. Sin ese par de
 * llaves se responde siempre con `desbloqueadas()`, el reloj público, que no
 * cambia. La sorpresa la protege la verificación, no la aritmética del mes.
 */
export function desbloqueadasAdmin(_hoy: Date = new Date()): number {
  return TOTAL_CARTAS;
}
