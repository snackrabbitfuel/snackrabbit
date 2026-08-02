// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

export default defineConfig({
  // El sitio sigue siendo estático: todas las páginas se pre-renderizan en build.
  // El adaptador está solo para las rutas que piden servidor de verdad, que se
  // marcan una a una con `export const prerender = false`. Hoy es únicamente el
  // alta en la newsletter; mañana será también el checkout de Stripe.
  adapter: vercel(),
  site: 'https://www.snackrabbit.co',
});
