// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  // Sitio 100% estático: el HTML se pre-renderiza en build y no hay servidor.
  // El comportamiento (carrito, i18n, modales) vive en src/scripts/app.js,
  // que Astro empaqueta como módulo y sirve con hash de caché.
  site: 'https://snackrabbit.tv',
});
