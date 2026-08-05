/* EL REGISTRO DE ADMINISTRADORES — el único sitio donde se decide quién manda.
 *
 * Añadir o quitar un administrador es tocar SOLO este archivo. Ni componentes,
 * ni rutas, ni el panel: todo lo demás pregunta aquí.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * POR QUÉ HAY DOS LLAVES Y NO UNA
 *
 * Este repositorio es PÚBLICO y este archivo viaja al navegador, así que la
 * lista de correos de abajo la puede leer cualquiera. Eso está bien: es una
 * lista de porteros, no una contraseña. Pero significa que NO puede ser lo
 * único que protege el panel — quien la lea sabría exactamente a qué cuenta
 * atacar, y peor, un `publicMetadata` falsificado desde la consola bastaría si
 * la comprobación viviera solo en el cliente.
 *
 * Por eso el acceso tiene dos llaves y hacen falta las dos:
 *
 *   1. ESTA LISTA decide qué se PINTA. Si tu correo no está, el botón de
 *      administración no se renderiza — ni oculto, ni deshabilitado: no
 *      existe en el DOM. Es cortesía visual, no seguridad.
 *
 *   2. LA RUTA DE SERVIDOR (`/api/admin`) decide si de verdad eres admin.
 *      Verifica el token de Clerk criptográficamente, saca el correo de la
 *      CUENTA —nunca de lo que mande el navegador— y lo contrasta contra esta
 *      misma lista en el servidor, donde nadie puede tocarla. Esa es la
 *      seguridad real.
 *
 * La regla que se deduce: cambiar esta lista en tu navegador te pinta un
 * botón que no lleva a ninguna parte. El panel pregunta al servidor antes de
 * enseñar un solo dato.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * EL DÍA QUE ESTO CREZCA
 *
 * Con un puñado de personas, una lista en el código es lo correcto: se lee de
 * un vistazo, va en el control de versiones (queda registro de quién añadió a
 * quién y cuándo) y no depende de ningún servicio. Cuando el equipo pase de
 * ~10, o cuando haga falta dar de alta a alguien sin desplegar, el sustituto
 * natural es `publicMetadata.admin` en Clerk —que ya soporta el panel— y esta
 * lista pasa a ser el arranque de los fundadores. `esAdmin()` seguiría siendo
 * la única puerta que hay que tocar.
 */

/* Correos con acceso al panel interno. En minúsculas: el correo no distingue
   mayúsculas en la práctica y comparar sin normalizar deja entrar a nadie por
   escribir Dieval20@ en vez de dieval20@. */
export const ADMINS: readonly string[] = [
  "dieval20@gmail.com",
  "anderpse25@gmail.com",
];

/** ¿Este correo manda? Única función que decide, en cliente y en servidor. */
export const esAdmin = (correo: string | null | undefined): boolean =>
  !!correo && ADMINS.includes(correo.trim().toLowerCase());
