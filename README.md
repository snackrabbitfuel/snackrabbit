# SNACKRABBIT — DROP 001

Landing page bilingüe (ES/EN) de la primera línea de merch de SnackRabbit
(@snackrabbit.tv): Gym Towel, Rabbit Fuel — la bebida energética natural — y el
Rabbit Fuel Plush.

Este repositorio contiene **dos versiones del mismo sitio**, con idéntico diseño:

```
snackrabbit/
├── astro-site/   ← versión actual, en Astro (es la que se despliega)
└── website/      ← versión original en HTML/CSS/JS plano (referencia)
```

## astro-site — versión actual

Proyecto [Astro](https://astro.build): 17 componentes `.astro`, build estático y
listo para desplegar en Vercel, Netlify o Cloudflare Pages.

```bash
cd astro-site
npm install
npm run dev        # http://localhost:4321
npm run build      # genera dist/
```

Detalles de estructura y de dónde tocar cada cosa: [`astro-site/README.md`](astro-site/README.md).

## website — instantánea original

El sitio tal como se construyó al principio: un `index.html`, un `styles.css` y
un `app.js`, sin build ni dependencias.

> **Es una instantánea histórica, no una copia viva.** Coincidía con la versión
> Astro en el momento de la migración, pero desde entonces `astro-site/` ha
> seguido evolucionando (catálogo, inglés por defecto, fotos recortadas sin
> fondo…). Para ver el sitio actual, usa `astro-site/` o www.snackrabbit.co.

```bash
cd website && python3 -m http.server 8123   # http://localhost:8123
```

Incluye `website/reference/` con los boards de diseño en alta resolución
(Rabbit Fuel, plush y apparel) usados para recortar las fotos de producto.

## Nota

El carrito y el login son **demo**: guardan en `localStorage` del navegador y no
hay backend. No usar con contraseñas reales.
