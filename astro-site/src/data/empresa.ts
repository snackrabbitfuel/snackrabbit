/* Datos legales de la empresa.
 *
 * TODO DIEGO: rellenar estos cinco campos cuando la entidad esté registrada.
 * Se escriben UNA vez aquí y aparecen solos en las cuatro páginas legales.
 * Mientras tengan corchetes, las páginas los enseñan como huecos evidentes,
 * que es mejor que un dato inventado.
 */
export const EMPRESA = {
  /* Nombre legal completo, tal cual quede registrado. Ej: "SnackRabbit LLC" */
  nombre: "[LEGAL COMPANY NAME]",

  /* Dirección registrada completa */
  direccion: "[REGISTERED ADDRESS]",

  /* Estado o jurisdicción cuyas leyes rigen. Ej: "Delaware, United States" */
  jurisdiccion: "[STATE / JURISDICTION]",

  /* Correo de contacto público. Tiene que ser un buzón que alguien lea:
     Stripe lo comprueba y los clientes lo van a usar. */
  email: "[CONTACT EMAIL]",

  /* Países a los que envías. Ej: "the United States and Canada" */
  envios: "[COUNTRIES YOU SHIP TO]",
};

/* Fecha de la última revisión de los textos legales */
export const ACTUALIZADO = "1 August 2026";

/* Umbral de envío gratis. Vive también en app.js (FREE_SHIP); si cambia uno,
   cambia el otro. */
export const ENVIO_GRATIS = 60;
