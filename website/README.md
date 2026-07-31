# SNACKRABBIT — DROP 001 · Landing Page

Landing page bilingüe (ES/EN) de la primera línea de merch de SnackRabbit
(@snackrabbit.tv), construida a partir del handoff `SNACKRABBIT.zip` + los
boards oficiales de Rabbit Fuel y Rabbit Fuel Plush.

## Cómo verla

Opción 1 — doble clic en `index.html`.

Opción 2 — servidor local (recomendado):

```bash
cd "/Users/dvalencia97/Documents/SnackRabbit/website" && python3 -m http.server 8123
```

y abre <http://localhost:8123>.

> Las tipografías (Anton, Silkscreen, DM Serif Display) se cargan de Google Fonts
> (se necesita internet; sin conexión caen a fuentes de sistema).

## Estructura

```
website/
├── index.html      ← estructura + atributos data-i18n para traducción
├── styles.css      ← sistema de diseño zine/pixel (rosa #FF4FD8 + amarillo #FFD400)
├── app.js          ← i18n ES/EN, carrito, login demo, modales, animaciones
└── assets/         ← fotos de producto, boards y logos
```

## Idiomas (ES/EN)

- Selector **ES/EN** en la navbar (y en el menú móvil). Persiste en `localStorage`.
- Todo el contenido visible se traduce: navegación, hero, productos, ficha,
  carrito, login, FAQ, newsletter, footer, toasts y mensajes de error.
- Las variantes del carrito se guardan en canónico y se traducen al pintar
  (p. ej. "ÚNICA · NEGRO" ⇄ "ONE SIZE · BLACK").
- Para editar textos: diccionario `I18N` al inicio de `app.js` (claves es/en).

## Productos (5)

| Nº | Producto | id | Precio | Imagen principal |
|----|----------|----|--------|------------------|
| 01 | RAIN JACKET | `rain-jacket` | $89 | `assets/product-rain-jacket.jpg` |
| 02 | HOODIE PERFORMANCE | `hoodie-performance` | $75 | `assets/product-hoodie-perf.jpg` |
| 03 | GYM TOWEL | `gym-towel` | $29 | `assets/product-gym-towel.jpg` |
| 04 | RABBIT FUEL (pack ×4 $16 / ×12 $42) | `rabbit-fuel` | — | `assets/product-rabbit-fuel.jpg` + `can-tight.jpg` |
| 05 | RABBIT FUEL PLUSH (blanco/negro) | `plush` | $35 | `assets/plush-white.jpg` / `plush-black.jpg` |

Todo el catálogo se edita en el array `PRODUCTS` de `app.js`. Campos opcionales:

- `tagline` — lema del board, se muestra en la ficha bajo el nombre.
- `features` — lista de ventajas `{ es: [título, texto], en: [...] }`, se pinta
  con viñetas pixel alternando rosa/amarillo.
- `views` — galería de vistas; genera miniaturas en la ficha (frente / espalda /
  detalle). La vista elegida se mantiene al cambiar talla o idioma.
- `imgByColor` — cambia la foto según el colorway (lo usa el plush).

Notas por producto:

- **Rain Jacket** y **Hoodie Performance** usan las fotos del board Rabbit Fuel
  (branding RABBIT FUEL, FOCUS · PLAY · REPEAT), con specs reales: 10.000 mm
  waterproof / 220 g / fit sport, y Dry-Tech Pro / 190 g / fit athletic.
  Tallas S–XXL. Cada uno trae 3 vistas y 6 características.
- **Rabbit Fuel**: acento amarillo `#FFD400`, 4 ingredientes y tabla nutricional
  (90 kcal · 22 g carb. · 0 g azúcares · 40 mg sodio · 0 mg taurina).
- **Plush**: la foto cambia con el colorway en la ficha y en el carrito.
- **Gym Towel** es el único que aún usa el render del handoff original; para
  pasarlo a foto real basta reemplazar `assets/product-gym-towel.jpg`.
- Si cambias un `id`, el carrito guardado descarta solo los productos que ya no
  existen (sin romperse) y reescribe el `localStorage` limpio.

## Imágenes

Las fotos son JPEG optimizados (calidad 88, progresivos): ~1,6 MB en total, frente
a los 13 MB de PNG originales. Los boards de referencia en alta viven fuera del
sitio, en `../reference/`, para no cargarlos al usuario.

## Hero — "SIGUE AL CONEJO." / "FOLLOW THE RABBIT."

Titular de campaña con gancho viral (referencia "follow the white rabbit"),
en tríada rosa/negro/amarillo: línea 1 en tinta, línea 2 en caja amarilla con
sombra dura, conejo pixel saltando sobre el titular (letras con hover juguetón),
panel negro con borde amarillo tras el collage de producto, cinta amarilla en
movimiento "100% REAL ▸ SIN COSAS RARAS ▸", sticker de prueba social
"★ VISTO 180 MILLONES DE VECES" y sello girando en amarillo. El nombre
DROP 001 se mantiene como identificador de la colección (meta del hero, kicker
del grid y numeración de producto).

## Experiencia

- Paleta oficial del board aplicada a todo el sitio: rosa `#FF4FD8` + amarillo `#FFD400`
  como acento secundario (badge del hero, halftone dual, marquee, stats, sellos,
  nutrición, chips, barras y hovers alternados).
- Barra de progreso de scroll (gradiente rosa→amarillo) fija arriba.
- Bordes "pixel" dentados entre secciones (hero→marquee, fuel→manifiesto, manifiesto→newsletter).
- Tilt 3D de las cards de producto siguiendo el cursor.
- Glow rosa/amarillo que sigue al cursor en la sección Rabbit Fuel.
- Estela de píxeles tras el cursor + cursor pixel custom (solo desktop).
- Parallax de scroll en el collage del hero y en la lata de la sección fuel.
- Barrido de brillo en los botones al hacer hover.
- Preloader con contador de porcentaje.
- Todo respeta `prefers-reduced-motion` y se desactiva en táctil donde corresponde.

## Funcionalidad

- Navbar fija con estado de scroll, menú móvil, selector de idioma y badge de carrito.
- Login / crear cuenta (modal "La Madriguera") — DEMO en `localStorage`, sin backend:
  no usar contraseñas reales.
- Carrito con drawer, variantes, cantidades, barra de envío gratis ($60),
  persistencia y checkout demo.
- Ficha de producto con talla/color/pack, cantidad y swap de imagen por color.
- Interacciones: confetti pixel, latas "PSSHT!", contadores, parallax, marquee,
  FAQ acordeón, newsletter con validación.
- Responsive + `prefers-reduced-motion`.

Los precios y datos se editan en el array `PRODUCTS` de `app.js`.
