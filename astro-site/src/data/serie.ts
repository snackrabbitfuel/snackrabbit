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
 * Cuántas ve el equipo: el mes del calendario, sin esperar al Año Uno.
 * En agosto, ocho. En septiembre, nueve. En enero de 2027 vuelve a una y
 * sigue al club, que para entonces es lo mismo.
 */
export function desbloqueadasAdmin(hoy: Date = new Date()): number {
  return hoy.getFullYear() >= ANIO_SERIE ? desbloqueadas(hoy) : hoy.getMonth() + 1;
}
