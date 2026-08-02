/* Aviso de envío con seguimiento. La política de envíos lo promete, así que
   este correo no es opcional. */
import * as React from "react";
import { Marco, P, Curiosidad, Datos, Boton } from "./_marco";

export const asunto = "It left the burrow.";

interface Props { pedido?: string; transportista?: string; seguimiento?: string; seguimientoUrl?: string; }

export default function Shipped({
  pedido = "{{pedido}}", transportista = "{{transportista}}",
  seguimiento = "{{seguimiento}}", seguimientoUrl = "{{seguimiento_url}}",
}: Props) {
  return (
    <Marco
      adelanto="Your order is with the carrier."
      kicker="ON ITS WAY"
      titular="It's moving."
    >
      <P>Your order is with the carrier. Expect it in 48 to 72 business hours.</P>
      <P>
        Tracking can take a few hours to start updating. That is the carrier's system waking up,
        not a lost parcel.
      </P>
      <Datos filas={[["ORDER", pedido], ["CARRIER", transportista], ["TRACKING", seguimiento]]} />
      <Curiosidad
        titulo="The first thing sold online was broken"
        texto="The first item sold on eBay was a laser pointer that did not work. It went for $14.83. The seller wrote to the buyer to make sure he understood it was broken. He did: he collected broken laser pointers."
      />
      <Boton texto="TRACK IT ▸" url={seguimientoUrl} />
    </Marco>
  );
}
