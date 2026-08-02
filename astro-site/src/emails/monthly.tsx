/* La curiosidad del mes: la plantilla de marketing que se reutiliza cada envío.
   Los huecos se rellenan en el editor de Resend o al enviar desde código. */
import * as React from "react";
import { Marco, P, Curiosidad, Boton, SITIO } from "./_marco";

export const asunto = "{{asunto_curiosidad}}";

interface Props {
  mes?: string; titulo?: string; cuerpo?: string; tituloExtra?: string; cuerpoExtra?: string;
}

export default function Monthly({
  mes = "{{mes}}", titulo = "{{titulo_curiosidad}}", cuerpo = "{{cuerpo_curiosidad}}",
  tituloExtra = "{{titulo_extra}}", cuerpoExtra = "{{cuerpo_extra}}",
}: Props) {
  return (
    <Marco
      adelanto="The curiosity we don't post."
      kicker={`${mes} · THE CURIOSITY WE DON'T POST`}
      titular={titulo}
    >
      <P>{cuerpo}</P>
      <P>That one is free. The one that arrives printed in the box is not, and it is better.</P>
      <Curiosidad titulo={tituloExtra} texto={cuerpoExtra} />
      <Boton texto="JOIN THE BURROW ▸" url={`${SITIO}/#madriguera`} />
    </Marco>
  );
}
