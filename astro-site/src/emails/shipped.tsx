/* Aviso de envío con seguimiento. La política de envíos lo promete, así que
   este correo no es opcional. El plazo va en días laborables, no en "business
   hours": 48 horas laborables leído literal son 6 días, y la expectativa de
   plazo es lo primero que el cliente contrasta. */
import * as React from "react";
import { Marco, P, Curiosidad, Datos, Boton } from "./_marco";

export const asunto = "It left the burrow — {{pedido}}.";
export const asuntoEs = "Salió de la madriguera — {{pedido}}.";

interface Props {
  pedido?: string; transportista?: string; seguimiento?: string;
  seguimientoUrl?: string; idioma?: "es" | "en"; baja?: string;
}

const T = {
  en: {
    adelanto: "With the carrier. 2 to 3 business days to your door.",
    kicker: "ON ITS WAY",
    titular: "It's moving.",
    p1: "Your order is with the carrier. Expect it in 2 to 3 business days.",
    p2: "Tracking can take a few hours to start updating. That is the carrier's system waking up, not a lost parcel.",
    filas: ["ORDER", "CARRIER", "TRACKING"],
    curioTitulo: "The first thing sold online was broken",
    curioTexto: "The first item sold on eBay was a laser pointer that did not work. It went for $14.83. The seller wrote to the buyer to make sure he understood it was broken. He did: he collected broken laser pointers.",
    boton: "TRACK IT ▸",
  },
  es: {
    adelanto: "Con el transportista. En 2 o 3 días laborables llama a tu puerta.",
    kicker: "EN CAMINO",
    titular: "Ya se mueve.",
    p1: "Tu pedido va con el transportista. Cuenta 2 o 3 días laborables.",
    p2: "El seguimiento puede tardar unas horas en empezar a moverse. Es el sistema del transportista despertando, no un paquete perdido.",
    filas: ["PEDIDO", "TRANSPORTISTA", "SEGUIMIENTO"],
    curioTitulo: "Lo primero vendido en internet estaba roto",
    curioTexto: "Lo primero que se vendió en eBay fue un puntero láser que no funcionaba. Se fue por $14.83. El vendedor escribió al comprador para asegurarse de que sabía que estaba roto. Lo sabía: coleccionaba punteros láser rotos.",
    boton: "SÍGUELO ▸",
  },
} as const;

export default function Shipped({
  pedido = "{{pedido}}", transportista = "{{transportista}}",
  seguimiento = "{{seguimiento}}", seguimientoUrl = "{{seguimiento_url}}",
  idioma = "en", baja,
}: Props) {
  const x = T[idioma === "es" ? "es" : "en"];
  const [fPedido, fTrans, fSeg] = x.filas;
  return (
    <Marco adelanto={x.adelanto} kicker={x.kicker} titular={x.titular} idioma={idioma} baja={baja}>
      <P>{x.p1}</P>
      <P>{x.p2}</P>
      <Datos filas={[[fPedido, pedido], [fTrans, transportista], [fSeg, seguimiento]]} />
      <Curiosidad titulo={x.curioTitulo} texto={x.curioTexto} idioma={idioma} />
      <Boton texto={x.boton} url={seguimientoUrl} />
    </Marco>
  );
}
