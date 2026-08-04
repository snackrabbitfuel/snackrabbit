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

/* Los textos, en los dos idiomas. La web se sirve en inglés y el español es
   opt-in, pero a quien navega en español escribirle en inglés es empezar la
   relación pidiéndole que se esfuerce. El idioma viaja desde el alta. */
export const asunto = "Your spot is saved.";
export const asuntoEs = "Tu sitio está guardado.";

const T = {
  en: {
    adelanto: "Nothing charged. You hear first when the doors open.",
    kicker: "THE LIST",
    titular: "You're on the list.",
    plan: "PLAN PICKED", cobro: "CHARGED TODAY", aviso: "YOU HEAR", early: "48 HOURS EARLY",
  },
  es: {
    adelanto: "No se te ha cobrado nada. Te avisamos antes que a nadie.",
    kicker: "LA LISTA",
    titular: "Estás en la lista.",
    plan: "PLAN ELEGIDO", cobro: "COBRADO HOY", aviso: "TE AVISAMOS", early: "48 HORAS ANTES",
  },
} as const;

export default function WelcomeFounder({
  plan = "DIGGER", baja, idioma = "en",
}: { plan?: string; baja?: string; idioma?: "es" | "en" }) {
  const es = idioma === "es";
  const x = T[es ? "es" : "en"];
  return (
    <Marco
      adelanto={x.adelanto}
      kicker={x.kicker}
      titular={x.titular}
      baja={baja}
      idioma={idioma}
    >
      <P>
        {es
          ? <>No se te ha cobrado nada, y no se te cobrará hasta que abramos. Lo que tienes es tu
             sitio en la cola — y cuando abramos te enteras <strong>48 horas antes que nadie</strong>.</>
          : <>You have not been charged, and you will not be until the doors open. What you have is
             your place in the queue — and when we open, you hear about it{" "}
             <strong>48 hours before anyone else</strong>.</>}
      </P>

      <Datos
        filas={[
          [x.plan, plan],
          [x.cobro, "$0.00"],
          [x.aviso, x.early],
        ]}
      />

      <P>
        {es
          ? <>Los cien primeros socios reciben la carta 000 — numerada a mano, y que no se vuelve a
             emitir una vez escrita la número cien. Estamos contando desde el momento en que te
             apuntaste, y el día que abramos te diremos exactamente dónde caíste. Sin adivinar y sin
             letra pequeña.</>
          : <>The first hundred members get card 000 — numbered by hand, and never issued again once
             the hundredth is written. We are counting from the moment you joined, and we will tell
             you exactly where you landed the day we open. No guessing, no small print.</>}
      </P>

      <P>{es ? "Ya que estás, una que no está en el canal:" : "Since you are here, one that is not on the channel:"}</P>

      <Curiosidad
        idioma={idioma}
        titulo={es ? "Curiosidad viene de cuidado" : "Curiosity means care"}
        texto={es
          ? "La palabra viene del latín cura — cuidado, atención, preocupación por algo. Ser curioso es, literal y originalmente, que algo te importe. Cada vez que te paras a averiguar por qué, estás haciendo lo más antiguo para lo que se creó la palabra."
          : "The word comes from the Latin cura — care, concern, attention. To be curious about something is, literally and originally, to care about it. Every time you stop to find out why, you are doing the older thing the word was built for."}
      />

      <P>
        {es
          ? "Esa es toda la idea detrás de esto. No hay nada más que hacer ahora mismo — te escribimos a ti primero."
          : "That is the whole idea behind this. Nothing else to do right now — we write to you first."}
      </P>

      <Boton texto={es ? "MIRA LO QUE HACEMOS ▸" : "SEE WHAT WE MAKE ▸"} url={SITIO} />
    </Marco>
  );
}
