/* Convierte las plantillas de React Email en el HTML que se pega en Resend.
 *
 *   npm run emails
 *
 * La salida NO va al repositorio: se escribe en assets/04-estrategia/correos/,
 * junto al resto del material de Diego, porque es un artefacto y no código.
 */
import * as React from "react";
import { render } from "@react-email/render";
import { writeFileSync, mkdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import WelcomeList, { asunto as a1 } from "../src/emails/welcome-list";
import OrderConfirmed, { asunto as a2 } from "../src/emails/order-confirmed";
import Shipped, { asunto as a3 } from "../src/emails/shipped";
import WelcomeBurrow, { asunto as a4 } from "../src/emails/welcome-burrow";
import Monthly, { asunto as a5 } from "../src/emails/monthly";
import WelcomeFounder, { asunto as a6 } from "../src/emails/welcome-founder";

const AQUI = dirname(fileURLToPath(import.meta.url));
const SALIDA = resolve(AQUI, "../../assets/04-estrategia/correos");
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const CORREOS = [
  { archivo: "01-welcome-list",   asunto: a1, el: <WelcomeList /> },
  { archivo: "02-order-confirmed", asunto: a2, el: <OrderConfirmed /> },
  { archivo: "03-shipped",         asunto: a3, el: <Shipped /> },
  { archivo: "04-welcome-burrow",  asunto: a4, el: <WelcomeBurrow /> },
  { archivo: "05-monthly",         asunto: a5, el: <Monthly /> },
  { archivo: "06-welcome-founder", asunto: a6, el: <WelcomeFounder plan="DIGGER" /> },
];

mkdirSync(SALIDA, { recursive: true });

for (const c of CORREOS) {
  const html = await render(c.el, { pretty: true });
  const ruta = `${SALIDA}/${c.archivo}.html`;
  writeFileSync(ruta, html, "utf8");

  try {
    execFileSync(CHROME, ["--headless", "--disable-gpu", "--no-sandbox", "--hide-scrollbars",
      "--force-color-profile=srgb", "--virtual-time-budget=9000", "--window-size=700,1450",
      `--screenshot=${SALIDA}/vista-${c.archivo}.png`, `file://${ruta}`], { stdio: "ignore" });
  } catch { /* la vista previa es un extra: si Chrome falla, el HTML ya está */ }

  console.log(`${c.archivo.padEnd(20)} ${(html.length / 1024).toFixed(1)} KB · ${c.asunto}`);
}

/* Los asuntos, juntos, para copiarlos al configurar los envíos */
writeFileSync(`${SALIDA}/ASUNTOS.txt`,
  CORREOS.map(c => `${c.archivo}\n  ${c.asunto}\n`).join("\n"), "utf8");
