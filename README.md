# SNACKRABBIT — DROP 001 · Astro

Migración a [Astro](https://astro.build) de la landing bilingüe de SnackRabbit.
**El diseño y el comportamiento son exactamente los mismos**: mismo HTML, mismo
CSS y el mismo `app.js`. Lo que cambia es la organización del código y el build.

## Comandos

```bash
npm run dev
```

Servidor de desarrollo con recarga en caliente en <http://localhost:4321>.

```bash
npm run build
```

Genera el sitio estático en `dist/` (HTML pre-renderizado + CSS y JS con hash de
caché). Se puede subir tal cual a Vercel, Netlify, Cloudflare Pages o cualquier
hosting estático.

```bash
npm run preview
```

Sirve el contenido ya construido de `dist/`, igual que en producción.

## Estructura

```
astro-site/
├── astro.config.mjs
├── public/
│   └── assets/              ← fotos y logos (se sirven tal cual en /assets/…)
└── src/
    ├── pages/index.astro    ← ensambla la página en orden
    ├── layouts/
    │   └── BaseLayout.astro ← <head>, meta/OG, fuentes, favicon, CSS y script
    ├── components/
    │   ├── BunnySymbol.astro    ← símbolo SVG del conejo (se reutiliza con <use>)
    │   ├── Preloader.astro
    │   ├── Navbar.astro         ← navbar + menú móvil
    │   ├── Hero.astro
    │   ├── PixelEdge.astro      ← borde dentado; recibe los colores por props
    │   ├── Marquee.astro
    │   ├── Stats.astro
    │   ├── DropGrid.astro
    │   ├── RabbitFuel.astro
    │   ├── Manifesto.astro      ← incluye Faq.astro
    │   ├── Faq.astro
    │   ├── Newsletter.astro
    │   ├── Footer.astro
    │   ├── LoginModal.astro
    │   ├── ProductModal.astro
    │   ├── CartDrawer.astro
    │   └── SuccessModal.astro
    ├── scripts/app.js       ← i18n, carrito, modales, animaciones (sin tocar)
    └── styles/styles.css    ← sistema de diseño (sin tocar)
```

## Qué cambió respecto a la versión HTML

Solo dos cosas, ninguna visible:

1. **Rutas de imagen absolutas**: `assets/foo.jpg` → `/assets/foo.jpg`, para que
   funcionen desde cualquier ruta si mañana se añaden más páginas.
2. **Etiquetas SVG auto-cerradas expandidas**: Astro escribe `<rect …></rect>` en
   vez de `<rect … />`. Es el mismo DOM; el navegador no distingue.

Verificado comparando el HTML generado contra el original: **569 nodos en ambos,
cero diferencias**. Y comparando estilos computados de 32 selectores en el mismo
viewport: **idénticos** (mismos colores, tipografías, sombras, gradientes,
rotaciones y hasta la misma altura total de página, 8424 px).

## Dónde tocar cada cosa

| Quiero cambiar… | Archivo |
|---|---|
| Textos ES/EN | diccionario `I18N` en `src/scripts/app.js` |
| Productos, precios, fotos, specs | array `PRODUCTS` en `src/scripts/app.js` |
| Colores, tipografías, espaciado | variables `:root` en `src/styles/styles.css` |
| Estructura de una sección | su componente en `src/components/` |
| Meta tags / OG / título | props de `BaseLayout` (o `src/pages/index.astro`) |
| Orden de las secciones | `src/pages/index.astro` |

## Siguientes pasos posibles

- Mover `PRODUCTS` a `src/data/products.json` y renderizar las tarjetas en el
  servidor (mejor SEO: hoy las pinta el navegador).
- Páginas propias por producto (`src/pages/producto/[id].astro`).
- Rutas `/es` y `/en` con el i18n nativo de Astro en vez de hacerlo en cliente.
- `@astrojs/image` o `<Image />` para servir AVIF/WebP responsivos.

La versión original en HTML plano sigue intacta en `../website/` como referencia.
