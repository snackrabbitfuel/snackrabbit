import type { APIRoute } from "astro";
import { secreto } from "../../lib/audiencia";
import { puedeEnviarMarketing } from "../../emails/_marco";
import { render } from "@react-email/render";
import * as React from "react";

import WelcomeList, { asunto as a1, asuntoEs as a1es } from "../../emails/welcome-list";
import OrderConfirmed, { asunto as a2, asuntoEs as a2es } from "../../emails/order-confirmed";
import Shipped, { asunto as a3, asuntoEs as a3es } from "../../emails/shipped";
import WelcomeBurrow, { asunto as a4, asuntoEs as a4es } from "../../emails/welcome-burrow";
import Monthly from "../../emails/monthly";
import WelcomeFounder, { asunto as a6, asuntoEs as a6es } from "../../emails/welcome-founder";
import Cancelled, { asunto as a7, asuntoEs as a7es } from "../../emails/subscription-cancelled";
import Refunded, { asunto as a8, asuntoEs as a8es } from "../../emails/refunded";

/* Envío de prueba de las plantillas.
 *
 *   /api/probar-correo?a=tu@correo.com&p=4
 *
 * Es una ruta pública y manda correos, así que la pregunta obligada es si se
 * puede abusar de ella.
 *
 * Antes no se podía: el remitente era `onboarding@resend.dev` y Resend solo
 * entrega desde esa dirección al dueño de la cuenta. La protección la ponía
 * Resend, no este código. Al pasar al dominio verificado esa red desaparece —
 * ahora el dominio puede escribir a cualquiera— así que la restricción tiene
 * que vivir aquí: solo se entrega a las direcciones de Diego.
 *
 * Sin esa lista, quien encontrara la URL podría mandar correos con la marca de
 * SnackRabbit a quien quisiera, y las quejas de spam las cobraría el dominio.
 *
 * Esto sigue siendo una herramienta de prueba: cuando terminemos, se borra.
 */
export const prerender = false;

const REMITENTE = "SnackRabbit <hello@snackrabbit.co>";

/* A quién se le puede mandar una prueba.
 *
 * Sale de una variable de entorno, no del código: este repositorio es público y
 * estaban aquí las dos direcciones personales de Diego, a la vista de cualquier
 * rastreador de correos. La variable es `PRUEBA_DESTINOS` en Vercel, con las
 * direcciones separadas por comas.
 *
 * Si no está definida, la ruta no manda nada. Es lo correcto: sin lista, el
 * único límite de una URL pública que envía correos sería la cuota de Resend. */
const permitidos = () =>
  secreto("PRUEBA_DESTINOS").split(",").map(s => s.trim().toLowerCase()).filter(Boolean);

/* Cada plantilla, en los dos idiomas: `p=3` da la inglesa y `p=3es` la
   española. Todas son bilingües desde la auditoría de agosto de 2026, así que
   probar solo una mitad ya no vale. */
const ejemplos = (idioma: "es" | "en"): Record<string, { asunto: string; el: React.ReactElement }> => {
  const es = idioma === "es";
  return {
    "1": { asunto: es ? a1es : a1, el: React.createElement(WelcomeList, { idioma }) },
    "2": { asunto: (es ? a2es : a2).replace("{{pedido}}", "#SR-4927"),
           el: React.createElement(OrderConfirmed, {
             idioma, nombre: "Diego", pedido: "#SR-4927",
             articulos: "RABBIT FUEL ×8 · PINK COLADA ×4",
             envio: es ? "GRATIS (más de $60)" : "FREE (over $60)",
             total: "$71.00", direccion: "128 Curiosity Ave, Austin, TX 78701" }) },
    "3": { asunto: (es ? a3es : a3).replace("{{pedido}}", "#SR-4927"),
           el: React.createElement(Shipped, {
             idioma, pedido: "#SR-4927", transportista: "USPS Ground Advantage",
             seguimiento: "9400 1112 0345 6789",
             seguimientoUrl: "https://tools.usps.com/go/TrackConfirmAction?tLabels=9400111203456789" }) },
    "4": { asunto: es ? a4es : a4, el: React.createElement(WelcomeBurrow, {
             idioma, nombre: "Diego", plan: es ? "CAVADOR" : "DIGGER",
             precio: "$49", cobradoHoy: "$49.00",
             proximoCobro: es ? "1 FEB 2027" : "1 FEB 2027",
             fechaCaja: es ? "5 ENE 2027" : "5 JAN 2027" }) },
    "5": { asunto: es ? "El olor de la lluvia tiene nombre" : "The smell of rain has a name",
           el: React.createElement(Monthly, {
             idioma, mes: es ? "ENERO" : "JANUARY",
             titulo: es ? "El olor de la lluvia tiene nombre" : "The smell of rain has a name",
             cuerpo: es
               ? "La lluvia casi no huele. Lo que hueles es el suelo respondiéndole."
               : "Rain barely smells of anything. What you smell is the ground answering it.",
             tituloExtra: es ? "Y el nombre es petricor" : "And the name is petrichor",
             cuerpoExtra: es
               ? "Bautizado en 1964. Llevas toda la vida reconociendo una señal bacteriana."
               : "Coined in 1964. You have been recognising a bacterial signal your whole life." }) },
    "6": { asunto: es ? a6es : a6, el: React.createElement(WelcomeFounder, {
             idioma, plan: es ? "CAVADOR" : "DIGGER" }) },
    "7": { asunto: es ? a7es : a7, el: React.createElement(Cancelled, {
             idioma, nombre: "Diego", plan: es ? "CAVADOR" : "DIGGER",
             ultimaCaja: es ? "5 MAR 2027" : "5 MAR 2027", cartas: "3 / 12" }) },
    "8": { asunto: (es ? a8es : a8).replace("{{pedido}}", "#SR-4927"),
           el: React.createElement(Refunded, {
             idioma, nombre: "Diego", pedido: "#SR-4927", importe: "$71.00",
             metodo: es ? "VISA ····4242" : "VISA ····4242",
             motivo: es ? "Devolución aceptada" : "Return accepted" }) },
  };
};

export const GET: APIRoute = async ({ url }) => {
  const a = (url.searchParams.get("a") || "").trim().toLowerCase();
  const bruto = url.searchParams.get("p") || "1";
  const idioma: "es" | "en" = bruto.endsWith("es") ? "es" : "en";
  const p = bruto.replace(/es$/, "");
  const plantilla = ejemplos(idioma)[p];

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(a)) {
    return new Response("Falta el destinatario: ?a=tu@correo.com&p=1..8 (añade 'es' para la versión española: p=3es)", { status: 400 });
  }
  const lista = permitidos();
  if (!lista.length) {
    return new Response(
      "Falta PRUEBA_DESTINOS en Vercel: los correos permitidos, separados por comas.\n" +
      "Sin esa lista esta ruta no manda nada, a propósito.",
      { status: 503 },
    );
  }
  if (!lista.includes(a)) {
    return new Response(
      "Esta ruta solo manda pruebas a las direcciones de PRUEBA_DESTINOS.",
      { status: 403 },
    );
  }
  if (!plantilla) {
    return new Response("Plantilla desconocida. Usa p=1 a p=8, o p=1es..p=8es.", { status: 400 });
  }

  /* La plantilla 5 es marketing puro: sin dirección postal registrada, ni
     siquiera en pruebas — el arnés no debe enseñar como válido un correo que
     no se puede mandar de verdad. */
  if (p === "5" && !puedeEnviarMarketing()) {
    return new Response(
      "La curiosidad del mes es marketing y CAN-SPAM exige una dirección postal física.\n" +
      "Rellena `direccion` en src/data/empresa.ts cuando exista la entidad y esto se desbloquea solo.",
      { status: 409, headers: { "content-type": "text/plain; charset=utf-8" } },
    );
  }

  const clave = secreto("RESEND_API_KEY");
  if (!clave) return new Response("Falta RESEND_API_KEY en Vercel.", { status: 503 });

  const html = await render(plantilla.el);
  const text = await render(plantilla.el, { plainText: true });
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${clave}`, "content-type": "application/json" },
    body: JSON.stringify({ from: REMITENTE, to: [a], subject: `[PRUEBA] ${plantilla.asunto}`, html, text }),
  });

  const cuerpo = await r.text();
  return new Response(
    r.ok ? `Enviada la plantilla ${p} a ${a}. Mira tu bandeja (y la carpeta de spam).\n\n${cuerpo}`
         : `Resend respondió ${r.status}:\n\n${cuerpo}`,
    { status: r.ok ? 200 : 502, headers: { "content-type": "text/plain; charset=utf-8" } },
  );
};
