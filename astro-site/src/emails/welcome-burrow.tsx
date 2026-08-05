/* Bienvenida al club. No es un recibo: es una entrada. Pero confirma un cargo
   recurrente, así que dice por escrito cuánto, cada cuánto, qué se cobró hoy y
   cómo se para. La pausa va como es de verdad —una al año, con la carta
   guardada—: prometer "pausa cualquier mes" era regalar una promesa que el
   club no da, y el pie deja claro que baja de correos ≠ cancelar. */
import * as React from "react";
import { Marco, P, Curiosidad, Datos, Boton, SITIO } from "./_marco";

export const asunto = "You're one of us now.";
export const asuntoEs = "Ya eres de los nuestros.";

interface Props {
  nombre?: string; plan?: string; fechaCaja?: string; precio?: string;
  cobradoHoy?: string; proximoCobro?: string; idioma?: "es" | "en"; baja?: string;
}

const T = {
  en: {
    adelanto: "Your plan, your price and your first box — in writing.",
    kicker: "THE BURROW · MEMBER",
    titular: "Welcome down.",
    p1: (n: string) => `You are in, ${n}. From here on, once a month, a box shows up with your cans and one curiosity that exists nowhere else: printed, numbered, and never reprinted.`,
    p2: "Twelve of them make a year. Complete the twelve and the club plush is yours, free.",
    p3: "The front of each card is public. The back only exists in the box.",
    filas: ["PLAN", "PRICE", "CHARGED TODAY", "NEXT CHARGE", "FIRST BOX", "YOUR CARDS"],
    mes: "MONTH",
    renueva: <>It renews on its own at the start of each month until you stop it, always at the same price. If we ever change it, we tell you by email first, with time to cancel. You can <strong>cancel any month</strong> from MY BURROW — no fee, no call, no form. And once a year you can <strong>pause a month without breaking your collection</strong>: your card is kept and travels with the next box.</>,
    curioTitulo: "A burrow always has a second way out",
    curioTexto: "Rabbits never dig a tunnel with one entrance. Every warren has bolt holes: exits they may never use, dug for a day that may never come. They build the way out before they need it.",
    boton: "OPEN MY BURROW ▸",
    motivo: "You get this because you are a member of The Burrow. Unsubscribing from emails does not cancel your membership — that lives in MY BURROW.",
  },
  es: {
    adelanto: "Tu plan, tu precio y tu primera caja — por escrito.",
    kicker: "LA MADRIGUERA · SOCIO",
    titular: "Bienvenido abajo.",
    p1: (n: string) => `Ya estás dentro, ${n}. Desde ahora, una vez al mes, llega una caja con tus latas y una curiosidad que no existe en ningún otro sitio: impresa, numerada, y que no se reimprime jamás.`,
    p2: "Doce hacen un año. Completa las doce y el plush del club es tuyo, gratis.",
    p3: "La cara de cada carta es pública. El dorso solo existe en la caja.",
    filas: ["PLAN", "PRECIO", "COBRADO HOY", "PRÓXIMO COBRO", "PRIMERA CAJA", "TUS CARTAS"],
    mes: "MES",
    renueva: <>Se renueva sola a principio de cada mes hasta que tú la pares, siempre al mismo precio. Si algún día cambia, te lo decimos antes por correo, con tiempo para cancelar. Puedes <strong>cancelar cualquier mes</strong> desde MY BURROW — sin comisión, sin llamada, sin formulario. Y una vez al año puedes <strong>pausar un mes sin romper la colección</strong>: tu carta se guarda y viaja con la siguiente caja.</>,
    curioTitulo: "Una madriguera siempre tiene otra salida",
    curioTexto: "Un conejo nunca cava un túnel con una sola entrada. Toda madriguera tiene bocas de escape: salidas que quizá nunca use, cavadas para un día que quizá no llegue. Construyen la salida antes de necesitarla.",
    boton: "ABRIR MY BURROW ▸",
    motivo: "Recibes esto porque eres socio de La Madriguera. Darte de baja de los correos no cancela tu suscripción — eso se hace desde MY BURROW.",
  },
} as const;

export default function WelcomeBurrow({
  nombre = "{{nombre}}", plan = "{{plan}}", fechaCaja = "{{fecha_caja}}",
  precio = "{{precio}}", cobradoHoy = "{{cobrado_hoy}}", proximoCobro = "{{proximo_cobro}}",
  idioma = "en", baja,
}: Props) {
  const x = T[idioma === "es" ? "es" : "en"];
  const [fPlan, fPrecio, fHoy, fProx, fCaja, fCartas] = x.filas;
  return (
    <Marco adelanto={x.adelanto} kicker={x.kicker} titular={x.titular} idioma={idioma}
           baja={baja} motivo={x.motivo}>
      <P>{x.p1(nombre)}</P>
      <P>{x.p2}</P>
      <P>{x.p3}</P>
      <Datos
        filas={[
          [fPlan, plan],
          [fPrecio, `${precio} / ${x.mes}`],
          [fHoy, cobradoHoy],
          [fProx, proximoCobro],
          [fCaja, fechaCaja],
          [fCartas, "0 / 12"],
        ]}
      />
      <P>{x.renueva}</P>
      <Curiosidad titulo={x.curioTitulo} texto={x.curioTexto} idioma={idioma} />
      <Boton texto={x.boton} url={`${SITIO}/#micuenta`} />
    </Marco>
  );
}
