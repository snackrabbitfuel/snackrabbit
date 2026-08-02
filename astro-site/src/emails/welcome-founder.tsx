/* Alta en la lista de fundadores.
 *
 * Es el correo con más peso de los cinco: llega en el momento de mayor
 * intención —alguien acaba de elegir plan— pero todavía no se le puede cobrar.
 * Tiene que hacer dos cosas a la vez: confirmar que su sitio está guardado y
 * dejar clarísimo que no se le ha cobrado nada, porque un correo ambiguo en ese
 * punto genera exactamente la desconfianza que no te puedes permitir antes de
 * abrir.
 */
import * as React from "react";
import { Marco, P, Curiosidad, Datos, Boton, SITIO } from "./_marco";

export const asunto = "Your spot in the burrow is held.";

export default function WelcomeFounder({
  plan = "DIGGER",
  puesto,
}: {
  plan?: string;
  puesto?: number;
}) {
  return (
    <Marco
      adelanto="Card 000 is reserved for the first 100. Yours is one of them."
      kicker="THE FIRST 100"
      titular="You're on the list."
    >
      <P>
        You have not been charged, and you will not be until the doors open. What you have is a
        place held — and when we open, you hear about it <strong>48 hours before anyone else</strong>.
      </P>

      <Datos
        filas={[
          ["PLAN PICKED", plan],
          ["CARD 000", puesto ? `RESERVED · No. ${puesto} OF 100` : "RESERVED · ONE OF 100"],
          ["CHARGED TODAY", "$0.00"],
        ]}
      />

      <P>
        Card 000 is the one that never comes back. A hundred of them exist, each numbered by hand,
        and once the hundredth is written the plate is closed for good. Everything else we make can
        be made again. That one cannot.
      </P>

      <P>Since you are here, one that is not on the channel:</P>

      <Curiosidad
        titulo="Curiosity means care"
        texto="The word comes from the Latin cura — care, concern, attention. To be curious about something is, literally and originally, to care about it. Every time you stop to find out why, you are doing the older thing the word was built for."
      />

      <P>
        That is the whole idea behind this. Nothing else to do right now — we write to you first.
      </P>

      <Boton texto="SEE WHAT WE MAKE ▸" url={SITIO} />
    </Marco>
  );
}
