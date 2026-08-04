/* Confirmación de compra. Un recibo es lo más ignorado de una bandeja; con una
   curiosidad dentro se abre, y eso entrena a la lista a abrir lo que enviamos. */
import * as React from "react";
import { Marco, P, Curiosidad, Datos, Boton, SITIO } from "./_marco";

export const asunto = "Order {{pedido}} — the rabbit is packing.";

interface Props { nombre?: string; pedido?: string; articulos?: string; total?: string; direccion?: string; }

export default function OrderConfirmed({
  nombre = "{{nombre}}", pedido = "{{pedido}}", articulos = "{{articulos}}",
  total = "{{total}}", direccion = "{{direccion}}",
}: Props) {
  return (
    <Marco
      adelanto="Your order is in and we are already packing it."
      kicker="ORDER CONFIRMED"
      titular={`We got it, ${nombre}.`}
    >
      <P>
        Your order is in and we are already packing it. It leaves the burrow within 24 business hours,
        and the moment it does you get an email with the tracking link.
      </P>
      <Datos filas={[["ORDER", pedido], ["ITEMS", articulos], ["TOTAL", total], ["SHIPPING TO", direccion]]} />
      <Curiosidad
        titulo="Bubble wrap was wallpaper"
        texto="In 1957 two engineers sealed two shower curtains together and tried to sell it as textured wallpaper. Nobody wanted it. They tried greenhouse insulation next. That failed too. Only on the third attempt did somebody think of putting it around fragile things."
      />
      <Boton texto="VIEW YOUR ORDER ▸" url={`${SITIO}/#micuenta`} />
    </Marco>
  );
}
