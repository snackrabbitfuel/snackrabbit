/* Bienvenida al club. No es un recibo: es una entrada. Por eso la curiosidad
   habla de madrigueras y no de otra cosa. */
import * as React from "react";
import { Marco, P, Curiosidad, Datos, Boton, SITIO } from "./_marco";

export const asunto = "You're one of us now.";

interface Props { nombre?: string; plan?: string; fechaCaja?: string; }

export default function WelcomeBurrow({
  nombre = "{{nombre}}", plan = "{{plan}}", fechaCaja = "{{fecha_caja}}",
}: Props) {
  return (
    <Marco
      adelanto="Once a month, a box with your cans and one curiosity that exists nowhere else."
      kicker="THE BURROW · MEMBER"
      titular="Welcome down."
    >
      <P>
        You are in, {nombre}. From here on, once a month, a box shows up with your cans and one
        curiosity that exists nowhere else: printed, numbered, and never reprinted.
      </P>
      <P>Twelve of them make a year. Complete the twelve and the club plush is yours, free, in December.</P>
      <P>The front of each card is public. The back only exists in the box.</P>
      <Datos filas={[["PLAN", plan], ["FIRST BOX", fechaCaja], ["YOUR CARDS", "0 / 12"]]} />
      <Curiosidad
        titulo="A burrow always has a second way out"
        texto="Rabbits never dig a tunnel with one entrance. Every warren has bolt holes: exits they may never use, dug for a day that may never come. They build the way out before they need it."
      />
      <Boton texto="OPEN MY BURROW ▸" url={`${SITIO}/#madriguera`} />
    </Marco>
  );
}
