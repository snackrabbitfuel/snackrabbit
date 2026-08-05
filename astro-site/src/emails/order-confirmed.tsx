/* Confirmación de compra. Un recibo es lo más ignorado de una bandeja; con una
   curiosidad dentro se abre, y eso entrena a la lista a abrir lo que enviamos.
   El envío va desglosado: la web promete gratis desde $60 y plana $6.95, y un
   recibo que no lo enseña genera el correo de "¿y esto?". */
import * as React from "react";
import { Marco, P, Curiosidad, Datos, Boton, SITIO } from "./_marco";

export const asunto = "Order {{pedido}} — the rabbit is packing.";
export const asuntoEs = "Pedido {{pedido}} — el conejo está empacando.";

interface Props {
  nombre?: string; pedido?: string; articulos?: string; envio?: string;
  total?: string; direccion?: string; urlPedido?: string;
  idioma?: "es" | "en"; baja?: string;
}

const T = {
  en: {
    adelanto: "Received. It ships within 1 business day — tracking follows.",
    kicker: "ORDER CONFIRMED",
    titular: (n: string) => `We got it, ${n}.`,
    p1: "Your order is in and we are already packing it. It leaves the burrow within 1 business day, and the moment it does you get an email with the tracking link.",
    filas: ["ORDER", "ITEMS", "SHIPPING", "TOTAL", "SHIPPING TO"],
    curioTitulo: "Bubble wrap was wallpaper",
    curioTexto: "In 1957 two engineers sealed two shower curtains together and tried to sell it as textured wallpaper. Nobody wanted it. They tried greenhouse insulation next. That failed too. Only on the third attempt did somebody think of putting it around fragile things.",
    boton: "VIEW YOUR ORDER ▸",
  },
  es: {
    adelanto: "Recibido. Sale en 1 día laborable — el seguimiento llega al salir.",
    kicker: "PEDIDO CONFIRMADO",
    titular: (n: string) => `Lo tenemos, ${n}.`,
    p1: "Tu pedido está dentro y ya lo estamos empacando. Sale de la madriguera en 1 día laborable, y en cuanto salga te llega un correo con el enlace de seguimiento.",
    filas: ["PEDIDO", "ARTÍCULOS", "ENVÍO", "TOTAL", "ENVIAMOS A"],
    curioTitulo: "El plástico de burbujas era papel pintado",
    curioTexto: "En 1957 dos ingenieros sellaron dos cortinas de ducha e intentaron venderlo como papel pintado con textura. Nadie lo quiso. Después lo probaron como aislante de invernaderos. Tampoco. Solo al tercer intento a alguien se le ocurrió ponerlo alrededor de las cosas frágiles.",
    boton: "VER TU PEDIDO ▸",
  },
} as const;

export default function OrderConfirmed({
  nombre = "{{nombre}}", pedido = "{{pedido}}", articulos = "{{articulos}}",
  envio = "{{envio}}", total = "{{total}}", direccion = "{{direccion}}",
  urlPedido, idioma = "en", baja,
}: Props) {
  const x = T[idioma === "es" ? "es" : "en"];
  const [fPedido, fItems, fEnvio, fTotal, fDir] = x.filas;
  return (
    <Marco adelanto={x.adelanto} kicker={x.kicker} titular={x.titular(nombre)} idioma={idioma} baja={baja}>
      <P>{x.p1}</P>
      <Datos filas={[[fPedido, pedido], [fItems, articulos], [fEnvio, envio], [fTotal, total], [fDir, direccion]]} />
      <Curiosidad titulo={x.curioTitulo} texto={x.curioTexto} idioma={idioma} />
      {/* Cuando Stripe exista, urlPedido lleva la receipt_url o la página del
          pedido; mientras tanto, MY BURROW es el único sitio que existe. */}
      <Boton texto={x.boton} url={urlPedido || `${SITIO}/#micuenta`} />
    </Marco>
  );
}
