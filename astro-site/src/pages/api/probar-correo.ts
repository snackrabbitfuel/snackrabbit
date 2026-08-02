import type { APIRoute } from "astro";
import { render } from "@react-email/render";
import * as React from "react";

import WelcomeList, { asunto as a1 } from "../../emails/welcome-list";
import OrderConfirmed, { asunto as a2 } from "../../emails/order-confirmed";
import Shipped, { asunto as a3 } from "../../emails/shipped";
import WelcomeBurrow, { asunto as a4 } from "../../emails/welcome-burrow";
import Monthly, { asunto as a5 } from "../../emails/monthly";

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

/* A quién se le puede mandar una prueba. Si hace falta enseñárselo a alguien
   más, se añade aquí y se despliega: es deliberadamente incómodo. */
const PERMITIDOS = [
  "dieval20@gmail.com",
  "rabbithole.tv26@gmail.com",
];

const PLANTILLAS: Record<string, { asunto: string; el: React.ReactElement }> = {
  "1": { asunto: a1, el: React.createElement(WelcomeList) },
  "2": { asunto: a2, el: React.createElement(OrderConfirmed, {
           nombre: "Diego", pedido: "#SR-4927", articulos: "Rabbit Fuel ×4, Gym Towel",
           total: "$45.00", direccion: "Calle Madriguera 12, Bogotá" }) },
  "3": { asunto: a3, el: React.createElement(Shipped, {
           pedido: "#SR-4927", transportista: "DHL", seguimiento: "JD0123456789",
           seguimientoUrl: "https://www.dhl.com" }) },
  "4": { asunto: a4, el: React.createElement(WelcomeBurrow, {
           nombre: "Diego", plan: "DIGGER", fechaCaja: "5 JAN 2027" }) },
  "5": { asunto: "The curiosity we don't post", el: React.createElement(Monthly, {
           mes: "JANUARY", titulo: "The smell of rain has a name",
           cuerpo: "Rain barely smells of anything. What you smell is the ground answering it.",
           tituloExtra: "And the name is petrichor",
           cuerpoExtra: "Coined in 1964. You have been recognising a bacterial signal your whole life." }) },
};

export const GET: APIRoute = async ({ url }) => {
  const a = (url.searchParams.get("a") || "").trim().toLowerCase();
  const p = url.searchParams.get("p") || "1";
  const plantilla = PLANTILLAS[p];

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(a)) {
    return new Response("Falta el destinatario: ?a=tu@correo.com&p=1..5", { status: 400 });
  }
  if (!PERMITIDOS.includes(a)) {
    return new Response(
      "Esta ruta solo manda pruebas a las direcciones de la lista.\n" +
      "Para añadir una, se edita PERMITIDOS en el código y se despliega.",
      { status: 403 },
    );
  }
  if (!plantilla) {
    return new Response("Plantilla desconocida. Usa p=1 a p=5.", { status: 400 });
  }

  const clave = import.meta.env.RESEND_API_KEY;
  if (!clave) return new Response("Falta RESEND_API_KEY en Vercel.", { status: 503 });

  const html = await render(plantilla.el);
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${clave}`, "content-type": "application/json" },
    body: JSON.stringify({ from: REMITENTE, to: [a], subject: `[PRUEBA] ${plantilla.asunto}`, html }),
  });

  const cuerpo = await r.text();
  return new Response(
    r.ok ? `Enviada la plantilla ${p} a ${a}. Mira tu bandeja (y la carpeta de spam).\n\n${cuerpo}`
         : `Resend respondió ${r.status}:\n\n${cuerpo}`,
    { status: r.ok ? 200 : 502, headers: { "content-type": "text/plain; charset=utf-8" } },
  );
};
