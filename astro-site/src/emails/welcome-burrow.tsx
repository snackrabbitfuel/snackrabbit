/* Bienvenida al club. No es un recibo: es una entrada. Por eso la curiosidad
   habla de madrigueras y no de otra cosa. */
import * as React from "react";
import { Marco, P, Curiosidad, Datos, Boton, SITIO } from "./_marco";

export const asunto = "You're one of us now.";

interface Props { nombre?: string; plan?: string; fechaCaja?: string; precio?: string; proximoCobro?: string; baja?: string; }

export default function WelcomeBurrow({
  nombre = "{{nombre}}", plan = "{{plan}}", fechaCaja = "{{fecha_caja}}",
  precio = "{{precio}}", proximoCobro = "{{proximo_cobro}}", baja,
}: Props) {
  return (
    <Marco
      adelanto="Once a month, a box with your cans and one curiosity that exists nowhere else."
      kicker="THE BURROW · MEMBER"
      titular="Welcome down."
      baja={baja}
    >
      <P>
        You are in, {nombre}. From here on, once a month, a box shows up with your cans and one
        curiosity that exists nowhere else: printed, numbered, and never reprinted.
      </P>
      <P>Twelve of them make a year. Complete the twelve and the club plush is yours, free.</P>
      <P>The front of each card is public. The back only exists in the box.</P>
      {/* Un correo que confirma un cargo recurrente tiene que decir cuánto, cada
          cuánto y cómo se para. Antes solo decía el plan y la primera caja: el
          socio no tenía por escrito ni el importe ni la fecha del siguiente
          cobro, que es justo lo que se reclama después. */}
      <Datos
        filas={[
          ["PLAN", plan],
          ["PRICE", `${precio} / MONTH`],
          ["NEXT CHARGE", proximoCobro],
          ["FIRST BOX", fechaCaja],
          ["YOUR CARDS", "0 / 12"],
        ]}
      />
      <P>
        It renews on its own at the start of each month until you stop it, always at the same price.
        If we ever change it, we tell you by email first, with time to cancel. You can{" "}
        <strong>pause or cancel any month</strong> from MY BURROW in your account — no fee, no call,
        no form to fill in.
      </P>
      <Curiosidad
        titulo="A burrow always has a second way out"
        texto="Rabbits never dig a tunnel with one entrance. Every warren has bolt holes: exits they may never use, dug for a day that may never come. They build the way out before they need it."
      />
      <Boton texto="OPEN MY BURROW ▸" url={`${SITIO}/#madriguera`} />
    </Marco>
  );
}
