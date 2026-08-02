# SnackRabbit — contexto del proyecto

Tienda y club de suscripción de SnackRabbit (@snackrabbit.tv), marca de
curiosidades virales. Producción: **https://www.snackrabbit.co**

El idioma de trabajo con Diego es **español**; los comentarios del código también.
La web, en cambio, se sirve **en inglés** y el español es opt-in.

---

## Estructura

```
SnackRabbit/
├── astro-site/     ← la web que se despliega. Es donde se trabaja.
├── website/        ← la versión HTML original, anterior a Astro. Referencia, no se toca.
└── assets/         ← material privado. NO está en GitHub (ver abajo).
```

`assets/` está excluida a propósito en `.gitignore` con `/assets/` **con barra
inicial**: sin ella la regla también taparía `astro-site/public/assets/`, que sí
tiene que versionarse. Ya pasó una vez y dejó producción pidiendo imágenes
inexistentes.

Dentro de `assets/` viven, entre otras cosas:

- `04-estrategia/fase-0-1-la-madriguera.md` — plan de negocio con márgenes
- `04-estrategia/rabbit-rank.md` — el sistema de rangos
- `04-estrategia/cartas/` — las 13 cartas listas para imprenta y su generador
- `04-estrategia/correos/` — el HTML de los correos, generado desde el repo

**Esa carpeta no tiene copia en ningún sitio.** Si se pierde el disco, se pierde.
Conviene recordárselo a Diego de vez en cuando.

## Comandos

```bash
cd astro-site
npm install
npm run dev      # localhost:4321
npm run build
npm run emails   # regenera los correos en assets/04-estrategia/correos/
```

Ojo: `astro dev` deja un servidor de fondo que sobrevive entre sesiones. Si algo
"no se actualiza", casi siempre es un servidor viejo sirviendo código antiguo:
`npx astro dev status` y `npx astro dev stop`.

## Arquitectura

- **Astro 7** con el adaptador de Vercel. Todo se pre-renderiza estático; solo
  las rutas con `export const prerender = false` corren en servidor. Hoy son
  `/api/subscribe` y `/api/probar-correo`.
- **Sin framework de UI en el cliente.** Todo el comportamiento vive en
  `src/scripts/app.js`, en módulos con patrón IIFE. React está instalado, pero
  **solo para generar correos**: no llega al navegador.
- **i18n en cliente**: diccionario `I18N` en `app.js` y atributos `data-i18n`,
  `data-i18n-html`, `data-i18n-ph`, `data-i18n-aria`. `applyLang()` lo aplica.
  La clave de localStorage va versionada (`sr_lang_v2`) para poder forzar un
  idioma a todo el mundo subiendo la versión.
- **Clerk** para cuentas, con *custom flows*: Clerk no dibuja nada, la interfaz
  es nuestra. Los datos del cliente (envío, plan, rango) van en
  `user.unsafeMetadata`.
- **Resend** para correo. Plantillas en `src/emails/` con React Email.

## Trampas que ya nos costaron caro

- **`overflow-x: hidden` en el `body`** convierte al body en contenedor de scroll
  en iOS y despega el navbar fijo. El recorte va en `html`. Y el navbar es
  `position: sticky`, no `fixed`, por lo mismo. No revertir ninguna de las dos.
- **El texto del navbar es tinta**, diseñado para leerse sobre el hero rosa. Si
  se le quita el fondo rosa a la barra, el texto desaparece sobre el fondo oscuro.
- **`backdrop-filter` sobre elementos fijos** hace que iOS deje bandas de imagen
  vieja al hacer scroll. En táctil el navbar va opaco y sin desenfoque.
- **Clerk**: el panel debe pedir SOLO email y contraseña. Si Phone o Username
  están activos, `signUp` devuelve `missing_requirements`. La configuración de la
  instancia de producción **no hereda** la de desarrollo.
- **No poner claves de reserva en el código.** Una clave de Clerk de desarrollo
  como *fallback* hizo que producción atendiera a clientes reales contra la
  instancia de pruebas durante días, en silencio. Si falta la variable, que falle
  a la vista.
- **Los tableros de producto** llegan como PNG con nombre UUID en `~/Downloads`.
  El producto **negro sobre fondo oscuro no se puede recortar** ni por brillo ni
  por textura: hay que medir los bordes con perfiles de luminancia.
- **Los tableros son pequeños** (paneles de 260–455 px). Exportar a 900 px
  emborrona el pixel art. Exportar cerca del tamaño nativo y enfocar.
- **Nada de escasez inventada.** Los productos son permanentes; se quitaron los
  contadores de "quedan 41". Si un dato no es real, no se pone.

## Estado

Funcionando en producción: catálogo con galería por color, La Madriguera con
lista de fundadores, panel de cliente MY BURROW, cuatro páginas legales, alta en
la newsletter.

Pendiente, por orden de dependencia:

1. **Registrar la entidad en EE.UU.** → desbloquea Stripe, que es lo que falta
   para cobrar. Hoy el checkout es una demostración: no cobra.
2. Rellenar `astro-site/src/data/empresa.ts` con los datos legales. Mientras
   tengan corchetes salen resaltados en amarillo en las páginas.
3. URLs de TikTok, YouTube y X para el footer. Instagram ya está.
4. **Ningún correo se manda solo todavía.** Las cinco plantillas de
   `src/emails/` solo las usa la ruta de pruebas. Apuntarse a la newsletter
   guarda el contacto y JOIN THE LIST marca el perfil, pero ninguna de las dos
   escribe a nadie. Conectarlo pide una ruta de servidor que compruebe la sesión
   de Clerk antes de enviar —si no, es una URL pública que manda correos a
   cualquiera— y para eso hace falta `CLERK_SECRET_KEY` en Vercel. Es la misma
   clave que necesitará el webhook de Stripe para escribir `publicMetadata`.
5. Borrar `/api/probar-correo` cuando se terminen de revisar los correos.

## Correo

Terminado y verificado de punta a punta el 2 de agosto de 2026. Todo el DNS
vive en Cloudflare y **dos proveedores conviven sin pisarse**:

| | Para qué | Dónde vive |
|---|---|---|
| **Resend** | correo automático (pedidos, newsletter) | MX y SPF en `send.snackrabbit.co`, DKIM en `resend._domainkey` |
| **Zoho Mail** | correo humano, entrante y saliente | MX y SPF en la raíz, DKIM en `zoho._domainkey` |

El remitente de la web es `hello@snackrabbit.co`, que además **recibe**: probado
en los dos sentidos, con DKIM y DMARC en PASS.

DMARC: `v=DMARC1; p=none; rua=...; adkim=r; aspf=r`. Tres cosas que no se tocan
sin pensarlo dos veces:

- **Un solo SPF en la raíz.** Dos registros SPF invalidan el sistema entero. Por
  eso Resend tiene el suyo en `send.` y Zoho el suyo en la raíz.
- **Alineación relajada** (`adkim=r`, `aspf=r`). En estricto, Resend fallaría la
  validación: manda desde `hello@snackrabbit.co` pero usa `send.` por debajo, y
  en estricto esos dos dominios tienen que ser idénticos.
- **`p=none` es deliberado.** Subir a `quarantine` o `reject` sin haber leído
  antes los informes deja de bloquear a los suplantadores y empieza a bloquear
  los correos propios, en silencio.

BIMI (el logo junto al correo en Gmail) queda descartado por ahora: pide DMARC
en reject, un certificado VMC de ~1.000 $/año y una marca registrada. Va después
de la entidad y de la marca, no antes.

`/api/probar-correo` tiene una **lista de destinatarios permitidos** y no es
decorativa. Antes la ruta era inofensiva porque Resend solo entrega desde
`onboarding@resend.dev` al dueño de la cuenta; con el dominio verificado esa
red desapareció y una URL pública que manda correos con la marca es un regalo
para quien quiera quemar la reputación del dominio. Si se amplía la lista, que
sea a conciencia.

## Cómo trabaja Diego

No programa. Hay que explicarle el porqué de las decisiones, no solo el qué, y
avisarle claramente de lo que solo puede hacer él: nada de credenciales, paneles
de terceros ni DNS. Se le entregan pasos concretos y se verifica el resultado
contra producción antes de dar algo por hecho.
