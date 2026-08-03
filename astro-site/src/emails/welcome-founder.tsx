/* Alta en la lista de fundadores.
 *
 * Es el correo con más peso de los cinco: llega en el momento de mayor
 * intención —alguien acaba de elegir plan— pero todavía no se le puede cobrar.
 * Tiene que hacer dos cosas a la vez: confirmar que su sitio está guardado y
 * dejar clarísimo que no se le ha cobrado nada, porque un correo ambiguo en ese
 * punto genera exactamente la desconfianza que no te puedes permitir antes de
 * abrir.
 *
 * ESTE CORREO NO RESERVA LA CARTA 000, y no es un descuido.
 *
 * La versión anterior decía «CARD 000 · RESERVED · ONE OF 100» a todo el que se
 * apuntaba, sin contador de ninguna clase. Solo van a existir cien cartas 000.
 * Con un canal de 2,4 M de seguidores, un vídeo de lanzamiento mete miles de
 * personas en la lista en horas, y el apuntado 800 se habría quedado con una
 * reserva por escrito, con la marca, de algo que no existe.
 *
 * Tampoco se le da a nadie su número. Repartir números exige un contador
 * atómico, y sin base de datos lo único disponible sería contar cuentas en
 * Clerk en cada alta: dos personas que se apunten a la vez se llevarían el
 * mismo número, y eso pasa justo el día del lanzamiento, que es cuando importa.
 * En su lugar el servidor sella la hora exacta del alta en publicMetadata
 * —donde el cliente no puede tocarla— y los cien primeros se deciden ordenando
 * por esa marca cuando se abra. El correo promete solo eso, que sí es verdad.
 */
import * as React from "react";
import { Marco, P, Curiosidad, Datos, Boton, SITIO } from "./_marco";

export const asunto = "Your spot is saved.";

export default function WelcomeFounder({ plan = "DIGGER" }: { plan?: string }) {
  return (
    <Marco
      adelanto="Nothing charged. You hear first when the doors open."
      kicker="THE LIST"
      titular="You're on the list."
    >
      <P>
        You have not been charged, and you will not be until the doors open. What you have is your
        place in the queue — and when we open, you hear about it{" "}
        <strong>48 hours before anyone else</strong>.
      </P>

      <Datos
        filas={[
          ["PLAN PICKED", plan],
          ["CHARGED TODAY", "$0.00"],
          ["YOU HEAR", "48 HOURS EARLY"],
        ]}
      />

      <P>
        The first hundred members get card 000 — numbered by hand, and never issued again once the
        hundredth is written. We are counting from the moment you joined, and we will tell you
        exactly where you landed the day we open. No guessing, no small print.
      </P>

      <P>Since you are here, one that is not on the channel:</P>

      <Curiosidad
        titulo="Curiosity means care"
        texto="The word comes from the Latin cura — care, concern, attention. To be curious about something is, literally and originally, to care about it. Every time you stop to find out why, you are doing the older thing the word was built for."
      />

      <P>That is the whole idea behind this. Nothing else to do right now — we write to you first.</P>

      <Boton texto="SEE WHAT WE MAKE ▸" url={SITIO} />
    </Marco>
  );
}
