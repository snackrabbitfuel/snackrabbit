/* Cancelación de la suscripción.
 *
 * Existe porque los Términos y el panel prometen que se puede cancelar desde
 * MY BURROW, y una cancelación sin confirmación por escrito es la primera
 * fuente de disputas: el socio no sabe si funcionó, vuelve a intentarlo, y
 * acaba escribiendo a soporte o pidiendo un contracargo.
 *
 * Dice las cuatro cosas que hacen falta: que está hecho, qué NO se le va a
 * cobrar, qué caja todavía le llega (la del mes ya pagado) y qué pasa con su
 * colección. Sin pedir nada a cambio: un correo de cancelación que intenta
 * retener es el que hace que no vuelvan.
 */
import * as React from "react";
import { Marco, P, Curiosidad, Datos, Boton, SITIO } from "./_marco";

export const asunto = "Cancelled. No more charges.";
export const asuntoEs = "Cancelada. No hay más cobros.";

interface Props {
  nombre?: string; plan?: string; ultimaCaja?: string; cartas?: string;
  idioma?: "es" | "en"; baja?: string;
}

const T = {
  en: {
    adelanto: "Done. Nothing else will be charged.",
    kicker: "THE BURROW · CANCELLED",
    titular: "Done.",
    p1: (n: string) => `Your membership is cancelled, ${n}. Nothing else will be charged — not this month, not next.`,
    p2: "The box you already paid for still ships. After that, silence from us on this.",
    filas: ["PLAN", "LAST BOX", "CARDS YOU KEEP"],
    p3: <>Your cards are yours forever, and so is the number on each one. If you come back, you pick up the year where you left it — but the months you miss do not get reprinted, so the gap stays a gap. That is the deal we made with everyone, and we are not going to break it for anyone, including you.</>,
    p4: "No hard feelings and no survey. If something was wrong, just reply to this email — a person reads it.",
    curioTitulo: "Rabbits do not slam doors",
    curioTexto: "When a rabbit leaves a warren it does not seal the entrance behind it. The tunnel stays open, the way out stays a way in, and nothing about the burrow changes because one rabbit went above ground for a while.",
    boton: "SEE WHAT WE MAKE ▸",
    motivo: "You get this because you cancelled a SnackRabbit membership. This is the last email about it.",
  },
  es: {
    adelanto: "Hecho. No se te cobrará nada más.",
    kicker: "LA MADRIGUERA · CANCELADA",
    titular: "Hecho.",
    p1: (n: string) => `Tu suscripción está cancelada, ${n}. No se te cobrará nada más — ni este mes ni el siguiente.`,
    p2: "La caja que ya pagaste sale igual. Después de esa, silencio por nuestra parte en esto.",
    filas: ["PLAN", "ÚLTIMA CAJA", "CARTAS QUE TE QUEDAS"],
    p3: <>Tus cartas son tuyas para siempre, y el número de cada una también. Si vuelves, retomas el año donde lo dejaste — pero los meses que te pierdas no se reimprimen, así que el hueco se queda hueco. Es el trato que hicimos con todo el mundo, y no lo vamos a romper por nadie, tú incluido.</>,
    p4: "Sin rencor y sin encuesta. Si algo falló, responde a este correo — lo lee una persona.",
    curioTitulo: "Los conejos no dan portazos",
    curioTexto: "Cuando un conejo se va de una madriguera no sella la entrada detrás. El túnel sigue abierto, la salida sigue siendo entrada, y nada de la madriguera cambia porque uno se haya ido a la superficie una temporada.",
    boton: "MIRA LO QUE HACEMOS ▸",
    motivo: "Recibes esto porque cancelaste una suscripción de SnackRabbit. Es el último correo sobre esto.",
  },
} as const;

export default function SubscriptionCancelled({
  nombre = "{{nombre}}", plan = "{{plan}}", ultimaCaja = "{{ultima_caja}}",
  cartas = "{{cartas}}", idioma = "en", baja,
}: Props) {
  const x = T[idioma === "es" ? "es" : "en"];
  const [fPlan, fCaja, fCartas] = x.filas;
  return (
    <Marco adelanto={x.adelanto} kicker={x.kicker} titular={x.titular} idioma={idioma}
           baja={baja} motivo={x.motivo}>
      <P>{x.p1(nombre)}</P>
      <P>{x.p2}</P>
      <Datos filas={[[fPlan, plan], [fCaja, ultimaCaja], [fCartas, cartas]]} />
      <P>{x.p3}</P>
      <P>{x.p4}</P>
      <Curiosidad titulo={x.curioTitulo} texto={x.curioTexto} idioma={idioma} />
      <Boton texto={x.boton} url={SITIO} />
    </Marco>
  );
}
