/* La curiosidad del mes: la plantilla de marketing que se reutiliza cada envío.
   Los huecos se rellenan en el editor de Resend o al enviar desde código. La
   frase fija habla de las cartas del club sin dar por hecho que ya hay cajas
   saliendo: vale antes y después de enero de 2027. */
import * as React from "react";
import { Marco, P, Curiosidad, Boton, SITIO } from "./_marco";

export const asunto = "{{asunto_curiosidad}}";

interface Props {
  mes?: string; titulo?: string; cuerpo?: string; tituloExtra?: string;
  cuerpoExtra?: string; adelanto?: string; idioma?: "es" | "en"; baja?: string;
}

const T = {
  en: {
    kicker: "THE CURIOSITY WE DON'T POST",
    remate: "That one is free. The printed ones — the club's twelve a year — are not, and they are better.",
    boton: "JOIN THE BURROW ▸",
  },
  es: {
    kicker: "LA CURIOSIDAD QUE NO SUBIMOS",
    remate: "Esa es gratis. Las impresas — las doce del año del club — no lo son, y son mejores.",
    boton: "ENTRA EN LA MADRIGUERA ▸",
  },
} as const;

export default function Monthly({
  mes = "{{mes}}", titulo = "{{titulo_curiosidad}}", cuerpo = "{{cuerpo_curiosidad}}",
  tituloExtra = "{{titulo_extra}}", cuerpoExtra = "{{cuerpo_extra}}",
  adelanto, idioma = "en", baja,
}: Props) {
  const x = T[idioma === "es" ? "es" : "en"];
  return (
    <Marco
      /* El adelanto es la segunda línea de la bandeja: si repite el asunto se
         desperdicia. Por defecto asoma la curiosidad extra, que es el gancho. */
      adelanto={adelanto || tituloExtra}
      kicker={`${mes} · ${x.kicker}`}
      titular={titulo}
      idioma={idioma}
      baja={baja}
    >
      <P>{cuerpo}</P>
      <P>{x.remate}</P>
      <Curiosidad titulo={tituloExtra} texto={cuerpoExtra} idioma={idioma} />
      <Boton texto={x.boton} url={`${SITIO}/#madriguera`} />
    </Marco>
  );
}
