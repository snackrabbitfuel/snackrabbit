/* EL MANIFIESTO DE LAS CARAS — qué archivo es cada carta.
 *
 * ⚠ SOLO SERVIDOR. Lo importa únicamente /api/cartas. Si algún día lo importa
 * un componente de cliente, los doce nombres viajan al navegador y el estreno
 * mes a mes se acaba: cualquiera podría abrir las doce caras el primer día.
 *
 * De la 002 a la 012 el nombre lleva un hash del contenido, así que no se
 * pueden adivinar. La 001 va con nombre llano a propósito: es el escaparate de
 * la portada, y tiene que poder verla cualquiera sin haber entrado.
 *
 * Lo genera assets/04-estrategia/cartas/_taller/publicar-carta.py. No se
 * edita a mano: si cambia una cara, cambia su hash. */
export const CARAS: Record<number, { es: string; en: string }> = {
  1: { es: "carta-001-es.webp", en: "carta-001-en.webp" },
  2: { es: "c002-es-4bedcdf139e9.webp", en: "c002-en-068b03faeb5f.webp" },
  3: { es: "c003-es-0702c77f965e.webp", en: "c003-en-95dbfea44970.webp" },
  4: { es: "c004-es-dfae06f380b6.webp", en: "c004-en-52be20226784.webp" },
  5: { es: "c005-es-baf0fe55dd0f.webp", en: "c005-en-3bb949a19f24.webp" },
  6: { es: "c006-es-5ddb6d8f647e.webp", en: "c006-en-fd8df871c6f0.webp" },
  7: { es: "c007-es-845da10652dd.webp", en: "c007-en-53879369df18.webp" },
  8: { es: "c008-es-7505a18de540.webp", en: "c008-en-eb1d7d207313.webp" },
  9: { es: "c009-es-cdd1efe3a29e.webp", en: "c009-en-5e81cf9667ad.webp" },
  10: { es: "c010-es-d4fb1b71f76f.webp", en: "c010-en-eee08fa1a826.webp" },
  11: { es: "c011-es-ca43985cc141.webp", en: "c011-en-2defaa1d501a.webp" },
  12: { es: "c012-es-75a7a270c459.webp", en: "c012-en-ceee73cae73c.webp" },
};
