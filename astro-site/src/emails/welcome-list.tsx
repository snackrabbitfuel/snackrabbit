/* Alta en la lista. Es el primer correo que recibe alguien de SnackRabbit, así
   que entrega una curiosidad ya, en vez de prometerla. Bilingüe: el formulario
   manda el idioma en el que navegaba quien se apunta. */
import * as React from "react";
import { Marco, P, Curiosidad, Boton, SITIO } from "./_marco";

export const asunto = "You followed the rabbit.";
export const asuntoEs = "Seguiste al conejo.";

const T = {
  en: {
    adelanto: "A curiosity a month, and whatever we are making — first.",
    kicker: "THE LIST",
    titular: "You're in.",
    p1: <>One email a month. One curiosity that never goes up on @snackrabbit.tv, and whatever we are making.</>,
    p2: <>No spam, no filler, no <em>hey there!</em>. If we would not read it, we do not send it.</>,
    p3: <>Here is the first one, so you know what you signed up for:</>,
    curioTitulo: "A day is longer than a year",
    curioTexto: "On Venus, the planet turns so slowly that a single day lasts longer than the time it takes to go around the Sun. If you lived there, you would have a birthday before lunchtime was over.",
    boton: "SEE WHAT WE MAKE ▸",
  },
  es: {
    adelanto: "Una curiosidad al mes, y lo que estemos haciendo — antes que nadie.",
    kicker: "LA LISTA",
    titular: "Estás dentro.",
    p1: <>Un correo al mes. Una curiosidad que no sube a @snackrabbit.tv, y lo que estemos haciendo.</>,
    p2: <>Sin spam, sin relleno, sin <em>¡hola, crack!</em>. Si no lo leeríamos nosotros, no lo mandamos.</>,
    p3: <>Aquí va la primera, para que sepas a qué te apuntaste:</>,
    curioTitulo: "Un día más largo que un año",
    curioTexto: "En Venus el planeta gira tan despacio que un solo día dura más que su vuelta entera alrededor del Sol. Si vivieras allí, cumplirías años antes de que terminara la hora del almuerzo.",
    boton: "MIRA LO QUE HACEMOS ▸",
  },
} as const;

export default function WelcomeList({ idioma = "en", baja }: { idioma?: "es" | "en"; baja?: string }) {
  const x = T[idioma === "es" ? "es" : "en"];
  return (
    <Marco adelanto={x.adelanto} kicker={x.kicker} titular={x.titular} idioma={idioma} baja={baja}>
      <P>{x.p1}</P>
      <P>{x.p2}</P>
      <P>{x.p3}</P>
      <Curiosidad titulo={x.curioTitulo} texto={x.curioTexto} idioma={idioma} />
      <Boton texto={x.boton} url={SITIO} />
    </Marco>
  );
}
