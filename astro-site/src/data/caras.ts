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
 * Lo genera assets/04-estrategia/cartas/_taller/publicar-web.py. No se edita a
 * mano: si cambia una cara, cambia su hash. */
export const CARAS: Record<number, { es: string; en: string }> = {
  1: { es: "carta-001-es.webp", en: "carta-001-en.webp" },
  2: { es: "c002-es-e74d9d7c8909.webp", en: "c002-en-e0d39cfd02fc.webp" },
  3: { es: "c003-es-4499ff2dece3.webp", en: "c003-en-53c253d4dea7.webp" },
  4: { es: "c004-es-b880f1a4dae0.webp", en: "c004-en-183db0afa0e2.webp" },
  5: { es: "c005-es-67279a2fc250.webp", en: "c005-en-f48519bff3d6.webp" },
  6: { es: "c006-es-3345503c454b.webp", en: "c006-en-293f901209e4.webp" },
  7: { es: "c007-es-ee24932b26db.webp", en: "c007-en-165b4a8cb6bc.webp" },
  8: { es: "c008-es-43b3e04e6a1e.webp", en: "c008-en-26dbe1ae8963.webp" },
  9: { es: "c009-es-c908674633d2.webp", en: "c009-en-8d38f5d40188.webp" },
  10: { es: "c010-es-c12383835a54.webp", en: "c010-en-60a274a36c66.webp" },
  11: { es: "c011-es-f90595e0cdf9.webp", en: "c011-en-1698888399b7.webp" },
  12: { es: "c012-es-4dddfd4eea45.webp", en: "c012-en-56897e5c6476.webp" },
};
