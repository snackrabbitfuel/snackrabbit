import { createHmac } from "node:crypto";

/* EL CÓDIGO IMPRESO EN LA CARTA.
 *
 * Diez caracteres en el dorso, `K7M2P-9XQR4`, que el socio teclea en su panel
 * para reclamar la carta. Es el puente entre el objeto y la cuenta: hasta que
 * no tienes la carta en la mano no puedes leerlo, y eso es exactamente lo que
 * queremos que demuestre.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * POR QUÉ ESTÁ FIRMADO Y NO GUARDADO EN UNA LISTA
 *
 * Lo obvio sería generar 6.000 códigos al azar y guardarlos en una base de
 * datos. Este no necesita esa lista: el código LLEVA DENTRO qué carta es y qué
 * ejemplar, y una firma que solo se puede calcular con el secreto del
 * servidor. Verificarlo es recalcular la firma — sin consultar nada.
 *
 * Eso significa que el código no se puede inventar. Alguien que vea diez
 * códigos válidos no puede deducir el once: la firma es HMAC-SHA256, y sin el
 * secreto probar sale a una entre 8.600 millones por intento.
 *
 * Lo que la firma NO impide es que alguien COPIE un código válido: fotografiar
 * el dorso y pasarlo. Eso lo impide el registro de canjes (src/lib/registro.ts),
 * que quema el ejemplar en cuanto se reclama. Son dos defensas distintas
 * porque son dos ataques distintos: inventar y copiar.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * EL ALFABETO
 *
 * Crockford Base32: sin I, L, O ni U. Las tres primeras porque se confunden
 * con 1 y 0 al leerlas de un papel impreso, y la U porque su ausencia evita
 * que salgan palabrotas por accidente en un código de diez letras. Al leer se
 * aceptan las confusiones habituales (O→0, I→1, L→1) y da igual mayúsculas,
 * espacios o guiones: quien teclea desde una carta no debería pelearse con el
 * formulario.
 *
 * ⚠ CODIGO_SECRETO en Vercel. Sin él no se generan ni se validan códigos, y la
 * ruta de canje falla cerrada. Si algún día se cambia, TODOS los códigos ya
 * impresos dejan de servir — es un secreto para toda la vida de la serie.
 */

const ALFABETO = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
const VALOR: Record<string, number> = {};
for (let i = 0; i < ALFABETO.length; i++) VALOR[ALFABETO[i]] = i;
/* Las confusiones de quien copia a mano desde un papel. */
VALOR["O"] = 0;
VALOR["I"] = 1;
VALOR["L"] = 1;

/** Año 0 = el Año Uno de la serie. */
export const ANIO_BASE = 2027;

const BITS_ANIO = 3;    // 8 series: hasta 2034
const BITS_CARTA = 4;   // 1..12
const BITS_SERIE = 10;  // 1..1023, cubre la tirada de 500 y la foil de 150
const BITS_CARGA = BITS_ANIO + BITS_CARTA + BITS_SERIE;  // 17
const BITS_FIRMA = 33;
const BITS_TOTAL = BITS_CARGA + BITS_FIRMA;              // 50 = 10 caracteres

export interface Ficha {
  anio: number;   // 2027, 2028…
  carta: number;  // 1..12
  serie: number;  // el ejemplar: 47 de 500
}

/** Los bits de la firma, deterministas a partir de la carga y el secreto. */
function firma(carga: bigint, secreto: string): bigint {
  const bytes = Buffer.alloc(8);
  bytes.writeBigUInt64BE(carga);
  const h = createHmac("sha256", secreto).update(bytes).digest();
  /* Los 33 bits altos del resumen. Se toman de los primeros bytes por
     comodidad: en un HMAC todos los bits son igual de impredecibles. */
  const alto = (BigInt(h.readUInt32BE(0)) << 8n) | BigInt(h[4]);
  return alto & ((1n << BigInt(BITS_FIRMA)) - 1n);
}

function aTexto(v: bigint): string {
  let s = "";
  for (let i = 0; i < 10; i++) {
    s = ALFABETO[Number(v & 31n)] + s;
    v >>= 5n;
  }
  return s.slice(0, 5) + "-" + s.slice(5);
}

/** Genera el código que va impreso en un ejemplar concreto. */
export function generar(f: Ficha, secreto: string): string {
  const anio = f.anio - ANIO_BASE;
  if (anio < 0 || anio >= 1 << BITS_ANIO) throw new Error(`año fuera de rango: ${f.anio}`);
  if (f.carta < 1 || f.carta > 12) throw new Error(`carta fuera de rango: ${f.carta}`);
  if (f.serie < 1 || f.serie >= 1 << BITS_SERIE) throw new Error(`ejemplar fuera de rango: ${f.serie}`);

  const carga =
    (BigInt(anio) << BigInt(BITS_CARTA + BITS_SERIE)) |
    (BigInt(f.carta) << BigInt(BITS_SERIE)) |
    BigInt(f.serie);
  return aTexto((carga << BigInt(BITS_FIRMA)) | firma(carga, secreto));
}

/**
 * Lee un código y devuelve qué carta es — o null si no es válido.
 *
 * Devuelve null sin distinguir entre "mal escrito" y "firma incorrecta": a
 * quien esté probando códigos no se le regala la pista de si iba por buen
 * camino.
 */
export function leer(bruto: string, secreto: string): Ficha | null {
  if (!secreto) return null;
  /* Se acepta como venga: minúsculas, espacios, guiones. Quien teclea desde
     una carta no tiene por qué acertar el formato. */
  const limpio = String(bruto || "").toUpperCase().replace(/[^0-9A-Z]/g, "");
  if (limpio.length !== 10) return null;

  let v = 0n;
  for (const ch of limpio) {
    const d = VALOR[ch];
    if (d === undefined) return null;
    v = (v << 5n) | BigInt(d);
  }
  if (v >= 1n << BigInt(BITS_TOTAL)) return null;

  const carga = v >> BigInt(BITS_FIRMA);
  const traida = v & ((1n << BigInt(BITS_FIRMA)) - 1n);
  if (firma(carga, secreto) !== traida) return null;

  const serie = Number(carga & ((1n << BigInt(BITS_SERIE)) - 1n));
  const carta = Number((carga >> BigInt(BITS_SERIE)) & ((1n << BigInt(BITS_CARTA)) - 1n));
  const anio = Number(carga >> BigInt(BITS_CARTA + BITS_SERIE)) + ANIO_BASE;

  /* La firma ya garantiza que la carga salió de nosotros, pero se comprueba el
     rango igual: un fallo futuro al generar no debe colar una carta 15. */
  if (carta < 1 || carta > 12 || serie < 1) return null;
  return { anio, carta, serie };
}

/** La clave con la que se quema un ejemplar en el registro. */
export const llave = (f: Ficha) => `${f.anio}-${f.carta}-${f.serie}`;
