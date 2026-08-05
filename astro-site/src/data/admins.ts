/* EL REGISTRO DE ADMINISTRADORES — el único sitio donde se decide quién manda.
 *
 * Añadir o quitar un administrador es tocar SOLO este archivo. Ni componentes,
 * ni rutas, ni el panel: todo lo demás pregunta aquí.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * QUIÉN LEE ESTA LISTA
 *
 * SOLO EL SERVIDOR. El único archivo que la importa es `/api/admin`, que se
 * ejecuta en Vercel, así que estos correos NO viajan al navegador: no están en
 * ningún bundle, y el repositorio es público pero la web servida no los
 * contiene. (Comprobado tras cada despliegue buscando los correos en todo lo
 * estático: cero coincidencias. Si algún día un componente de cliente importa
 * esto, esa propiedad se rompe en silencio — no lo hagas.)
 *
 * Aun así el acceso tiene DOS llaves, y conviene entender por qué la lista
 * sola no bastaría aunque fuera secreta:
 *
 *   1. EL NAVEGADOR decide qué se PINTA. El botón del panel del cliente nace
 *      oculto y sin destino, y solo se enciende cuando el servidor lo
 *      confirma. Pero cualquiera puede reescribir el JavaScript de su propia
 *      página: encender ese botón a mano es trivial. Por eso es cortesía
 *      visual, nunca seguridad.
 *
 *   2. EL SERVIDOR decide quién ENTRA. `/api/admin` verifica el token de
 *      Clerk criptográficamente, saca el correo de la CUENTA —nunca de lo que
 *      mande el navegador— y lo contrasta aquí. Esa es la seguridad real, y
 *      es la que no se puede tocar desde fuera.
 *
 * La regla que se deduce: encender el botón a mano te lleva a una puerta que
 * vuelve a preguntar, y esa no se deja engañar. El panel no enseña un solo
 * dato hasta que el servidor responde que sí.
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
