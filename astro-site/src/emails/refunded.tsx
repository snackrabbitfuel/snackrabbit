/* Reembolso emitido.
 *
 * La política de devoluciones publicada promete devolver el dinero, y un
 * reembolso sin aviso es peor que uno lento: el cliente ve un movimiento que
 * no reconoce, o no lo ve y cree que no se hizo. Este correo dice cuánto, a
 * dónde y —lo que más se pregunta— cuánto tarda en aparecer, porque el retraso
 * lo pone el banco, no nosotros, y decirlo por adelantado ahorra el segundo
 * correo de "¿y mi dinero?".
 */
import * as React from "react";
import { Marco, P, Curiosidad, Datos, Boton, SITIO } from "./_marco";

export const asunto = "Refunded — {{pedido}}.";
export const asuntoEs = "Reembolsado — {{pedido}}.";

interface Props {
  nombre?: string; pedido?: string; importe?: string; metodo?: string;
  motivo?: string; idioma?: "es" | "en"; baja?: string;
}

const T = {
  en: {
    adelanto: "The money is on its way back. 5 to 10 business days.",
    kicker: "REFUND ISSUED",
    titular: "Money's going back.",
    p1: (n: string) => `Done, ${n}. We have sent the refund to the same card you paid with.`,
    filas: ["ORDER", "AMOUNT", "BACK TO", "REASON"],
    p2: <>It usually shows up in <strong>5 to 10 business days</strong>. That wait is your bank's, not ours — on our side it is already gone. If it has not landed after ten business days, reply to this email with the order number and we chase it.</>,
    p3: "Nothing else to do. Nothing to send back unless we asked you to.",
    curioTitulo: "The word refund is older than paper money",
    curioTexto: "It comes from the Latin refundere: to pour back. Not to compensate, not to settle — to pour back what was poured. The word already assumed the money was still yours, only temporarily somewhere else.",
    boton: "BACK TO THE SHOP ▸",
    motivo: "You get this because you bought from SnackRabbit and we refunded that order.",
  },
  es: {
    adelanto: "El dinero va de vuelta. De 5 a 10 días laborables.",
    kicker: "REEMBOLSO EMITIDO",
    titular: "El dinero vuelve.",
    p1: (n: string) => `Hecho, ${n}. Hemos mandado el reembolso a la misma tarjeta con la que pagaste.`,
    filas: ["PEDIDO", "IMPORTE", "VUELVE A", "MOTIVO"],
    p2: <>Suele aparecer en <strong>5 a 10 días laborables</strong>. Esa espera la pone tu banco, no nosotros — por nuestro lado ya salió. Si pasados diez días laborables no está, responde a este correo con el número de pedido y lo perseguimos.</>,
    p3: "No tienes que hacer nada más. Ni devolver nada, salvo que te lo hayamos pedido.",
    curioTitulo: "La palabra reembolso es más vieja que el papel moneda",
    curioTexto: "Viene del latín refundere: volver a verter. No compensar, no liquidar — verter de vuelta lo que se vertió. La palabra ya daba por hecho que el dinero seguía siendo tuyo, solo que temporalmente en otro sitio.",
    boton: "VOLVER A LA TIENDA ▸",
    motivo: "Recibes esto porque compraste en SnackRabbit y hemos reembolsado ese pedido.",
  },
} as const;

export default function Refunded({
  nombre = "{{nombre}}", pedido = "{{pedido}}", importe = "{{importe}}",
  metodo = "{{metodo}}", motivo = "{{motivo}}", idioma = "en", baja,
}: Props) {
  const x = T[idioma === "es" ? "es" : "en"];
  const [fPedido, fImporte, fMetodo, fMotivo] = x.filas;
  return (
    <Marco adelanto={x.adelanto} kicker={x.kicker} titular={x.titular} idioma={idioma}
           baja={baja} motivo={x.motivo}>
      <P>{x.p1(nombre)}</P>
      <Datos filas={[[fPedido, pedido], [fImporte, importe], [fMetodo, metodo], [fMotivo, motivo]]} />
      <P>{x.p2}</P>
      <P>{x.p3}</P>
      <Curiosidad titulo={x.curioTitulo} texto={x.curioTexto} idioma={idioma} />
      <Boton texto={x.boton} url={SITIO} />
    </Marco>
  );
}
