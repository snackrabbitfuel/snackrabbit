# Hero v1 — respaldo del diseño original

El hero de la portada tal y como estaba el **10 de agosto de 2026**, antes de
rediseñarlo alrededor del vídeo de fondo. Está aquí para poder volver atrás si
el nuevo no convence.

Esta carpeta empieza por `_` y vive fuera de `src/`, así que **Astro no la
construye**: es documentación, no código vivo.

## Por qué no basta con copiar el componente

El hero no es un archivo. Son cuatro:

| Dónde | Qué |
|---|---|
| `src/components/Hero.astro` | el marcado |
| `src/styles/styles.css` | 31 reglas `.hero*` / `.hv-*`, repartidas entre la línea 407 y la 2099, algunas dentro de `@media` |
| `src/scripts/app.js` | 10 claves `hero.*` × 2 idiomas, más el parallax y la sacudida de la lata |
| `public/assets/` | `can-hero.webp` y `hero-fondo.webp` |

Como el CSS, los textos y la lógica viven dentro de archivos compartidos, no se
pueden restaurar con un `git checkout` de un fichero suelto sin arrastrar todo
lo demás que haya cambiado ahí. Por eso se guardan aquí extraídos.

## Qué hay

- `Hero.astro` — el componente, copia exacta.
- `hero-v1.css` — las 31 reglas, con su contexto de `@media`. Verificado: no
  falta ninguna.
- `hero-v1.i18n.json` — las 10 claves en español e inglés.

Lo que **no** está aquí y sí hace falta para restaurar del todo:

- El parallax y el clic de la lata, en `app.js` (busca `heroVisual` y `heroCan`).
- Las dos imágenes, que siguen en `public/assets/`.

Para eso está la etiqueta.

## Cómo volver atrás

**El sitio entero como estaba:**

```bash
git checkout hero-v1
```

**Solo el hero, conservando todo lo demás** — la vía normal:

```bash
git checkout hero-v1 -- astro-site/src/components/Hero.astro
```

y luego traer a mano el CSS de `hero-v1.css` y los textos de
`hero-v1.i18n.json`, que es exactamente el motivo de que estén extraídos.

**Ver qué cambió** desde entonces:

```bash
git diff hero-v1 -- astro-site/src/components/Hero.astro astro-site/src/styles/styles.css
```

## Cómo era

Rejilla de dos columnas sobre fondo rosa `#ff4fd8`. A la izquierda el texto en
negro: `@SNACKRABBIT.TV PRESENTS`, el titular *FOLLOW THE RABBIT.* con el conejo
saltando dentro de la O, el subtítulo en serif cursiva, dos botones y la línea
de datos. A la derecha, la lata recortada flotando sobre `hero-fondo.webp` con
parallax al mover el ratón, la cinta de texto en marcha, el sello circular
giratorio y la insignia ZERO SUGAR. La lata se sacude al hacerle clic.
