/* Alta en la lista. Es el primer correo que recibe alguien de SnackRabbit, así
   que entrega una curiosidad ya, en vez de prometerla. */
import * as React from "react";
import { Marco, P, Curiosidad, Boton, SITIO } from "./_marco";

export const asunto = "You followed the rabbit.";

export default function WelcomeList() {
  return (
    <Marco
      adelanto="One email a month. One curiosity that is not on the channel."
      kicker="THE LIST"
      titular="You're in."
    >
      <P>One email a month. One curiosity that is not on the channel, and whatever we are making.</P>
      <P>No spam, no filler, no <em>hey there!</em>. If we would not read it, we do not send it.</P>
      <P>Here is the first one, so you know what you signed up for:</P>
      <Curiosidad
        titulo="A day is longer than a year"
        texto="On Venus, the planet turns so slowly that a single day lasts longer than the time it takes to go around the Sun. If you lived there, you would have a birthday before lunchtime was over."
      />
      <Boton texto="SEE WHAT WE MAKE ▸" url={SITIO} />
    </Marco>
  );
}
