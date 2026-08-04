/* Piezas compartidas de los correos de SnackRabbit.
 *
 * El HTML de correo no es el de la web: Outlook y Gmail no entienden flexbox ni
 * grid, ignoran las hojas de estilo externas y no descargan tipografías. React
 * Email se encarga de convertir esto en tablas con estilos escritos en cada
 * etiqueta; lo que sigue siendo cosa nuestra es elegir tipografías que existan
 * en el ordenador de quien abre: Anton cae a Impact, que es la más parecida de
 * las que están en todas partes.
 *
 * Nada de esto viaja al navegador: solo se usa al construir los correos.
 */
import * as React from "react";
import {
  Body, Column, Container, Head, Heading, Hr, Html, Link, Preview, Row, Section, Text,
} from "@react-email/components";
import { EMPRESA } from "../data/empresa";

export const SITIO = "https://www.snackrabbit.co";

/* El pie sale de src/data/empresa.ts, el mismo archivo que rellenan las cuatro
   páginas legales. Antes estaba escrito a mano como "[[EMPRESA]] · [[DIRECCION]]"
   y no lo sustituía nadie: los correos salían con los corchetes a la vista, y
   el día que se rellenaran los datos legales las páginas se habrían arreglado
   solas mientras los correos seguían igual. Un solo sitio que rellenar.

   Mientras un dato siga sin rellenar no se enseña el hueco: se cae al nombre de
   la marca y al correo de contacto, que sí son ciertos. Pero ojo — CAN-SPAM
   exige una dirección postal real en los correos de marketing. Hasta que exista
   la entidad, solo se pueden mandar transaccionales. */
const pendiente = (v: string) => !v || v.startsWith("[");
const NOMBRE = pendiente(EMPRESA.nombre) ? "SnackRabbit" : EMPRESA.nombre;
const DIRECCION = pendiente(EMPRESA.direccion) ? EMPRESA.email : EMPRESA.direccion;

export const C = {
  tinta: "#050508",
  fondo: "#0a0a12",
  tarjeta: "#0d0d14",
  linea: "#1c1c2a",
  rosa: "#ff4fd8",
  amarillo: "#ffd400",
  hueso: "#e6e6ff",
  texto: "#b9b9cf",
  gris: "#8a8a9e",
  tenue: "#5a5a72",
};

export const F = {
  display: "Anton, Impact, 'Arial Narrow Bold', Haettenschweiler, sans-serif",
  pixel: "'Courier New', Courier, monospace",
  cuerpo: "Georgia, 'Times New Roman', serif",
};


/* El conejo dibujado con celdas de tabla, no con una imagen.
 *
 * Gmail bloquea las imágenes remotas cuando el remitente no está autenticado, y
 * entonces la cabecera se queda con un icono roto: justo lo que no quieres que
 * vea alguien que abre tu correo por primera vez. Como el logo es pixel art, es
 * literalmente una rejilla, así que se puede pintar con celdas de color. Eso se
 * ve en el 100% de los clientes, con imágenes activadas o no, y pesa cero.
 *
 * 0 = fondo (se ve el rosa) · 1 = cuerpo · 2 = ojos y hocico
 */
const REJILLA = [
  [0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
  [0, 1, 1, 2, 1, 1, 2, 1, 1, 0],
  [0, 1, 1, 1, 2, 2, 1, 1, 1, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
];

export function Conejo({ lado = 5, cuerpo = C.tinta, hueco = C.rosa }) {
  return (
    <table role="presentation" cellPadding={0} cellSpacing={0} border={0}
           style={{ borderCollapse: "collapse", borderSpacing: 0 }}>
      <tbody>
        {REJILLA.map((fila, y) => (
          <tr key={y} style={{ height: `${lado}px` }}>
            {fila.map((celda, x) => (
              <td key={x} width={lado} height={lado}
                  bgcolor={celda === 1 ? cuerpo : celda === 2 ? hueco : undefined}
                  style={{
                    width: `${lado}px`, height: `${lado}px`,
                    lineHeight: `${lado}px`, fontSize: 0, padding: 0,
                    background: celda === 1 ? cuerpo : celda === 2 ? hueco : "transparent",
                  }}>&#8203;</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* ---------------------------------------------------------------- bloques */

export function Curiosidad({ titulo, texto }: { titulo: string; texto: string }) {
  return (
    <Section style={{ border: `3px solid ${C.amarillo}`, margin: "6px 0 30px", padding: "20px 22px" }}>
      <Text style={{ margin: "0 0 9px", fontFamily: F.pixel, fontSize: "11px", letterSpacing: "3px", color: C.amarillo }}>
        THE CURIOSITY
      </Text>
      <Text style={{ margin: "0 0 8px", fontFamily: F.display, fontSize: "21px", letterSpacing: ".5px", color: C.hueso, textTransform: "uppercase" }}>
        {titulo}
      </Text>
      <Text style={{ margin: 0, fontFamily: F.cuerpo, fontSize: "15px", lineHeight: "1.6", color: C.texto }}>
        {texto}
      </Text>
    </Section>
  );
}

export function Datos({ filas }: { filas: [string, string][] }) {
  return (
    <Section style={{ background: C.tarjeta, border: `3px solid ${C.linea}`, margin: "6px 0 30px", padding: "8px 20px 14px" }}>
      {filas.map(([k, v]) => (
        <Row key={k}>
          <Column style={{ padding: "9px 0", borderBottom: `1px solid ${C.linea}`, fontFamily: F.pixel, fontSize: "12px", letterSpacing: "1px", color: C.gris }}>
            {k}
          </Column>
          <Column align="right" style={{ padding: "9px 0", borderBottom: `1px solid ${C.linea}`, fontFamily: F.pixel, fontSize: "12px", letterSpacing: "1px", color: C.hueso }}>
            {v}
          </Column>
        </Row>
      ))}
    </Section>
  );
}

/* Botón hecho a mano y no con <Button>: Outlook ignora el relleno de un enlace,
   así que el color tiene que vivir en una celda de tabla. */
export function Boton({ texto, url }: { texto: string; url: string }) {
  return (
    <Section style={{ textAlign: "center", margin: "4px 0 6px" }}>
      <table role="presentation" cellPadding={0} cellSpacing={0} border={0} align="center" style={{ margin: "0 auto" }}>
        <tbody><tr>
          <td bgcolor={C.rosa} style={{ background: C.rosa, border: `3px solid ${C.tinta}` }}>
            <Link href={url} style={{ display: "block", padding: "15px 30px", fontFamily: F.pixel, fontSize: "13px", letterSpacing: "2.5px", fontWeight: "bold", color: C.tinta, textDecoration: "none" }}>
              {texto}
            </Link>
          </td>
        </tr></tbody>
      </table>
    </Section>
  );
}

/* ---------------------------------------------------------------- marco */

interface MarcoProps {
  adelanto: string;      // lo que se lee en la bandeja después del asunto
  kicker: string;
  titular: string;
  /* URL de baja. La pasa quien envía, porque cada envío sabe a quién escribe:
     así el enlace llega con el correo ya puesto y basta un clic. Si no se pasa,
     se cae a la página de baja genérica, donde hay que teclearlo. */
  baja?: string;
  children: React.ReactNode;
}

export function Marco({ adelanto, kicker, titular, baja, children }: MarcoProps) {
  return (
    <Html lang="en">
      <Head>
        {/* Sin esto, Outlook y el modo oscuro de iOS invierten los colores de un
            correo que ya es oscuro: el fondo se vuelve claro, el texto hueso
            queda blanco sobre blanco y el correo desaparece. */}
        <meta name="color-scheme" content="dark" />
        <meta name="supported-color-schemes" content="dark" />
      </Head>
      <Preview>{adelanto}</Preview>
      <Body style={{ margin: 0, padding: 0, background: C.fondo }}>
        <Container style={{ width: "600px", maxWidth: "100%", margin: "0 auto", padding: "26px 12px" }}>

          <Section style={{ background: C.rosa, padding: "20px 26px", border: `4px solid ${C.tinta}` }}>
            <Row>
              <Column style={{ width: "62px", verticalAlign: "middle" }}>
                <Conejo />
              </Column>
              <Column style={{ fontFamily: F.display, fontSize: "23px", letterSpacing: "1.5px", color: C.tinta }}>
                SNACKRABBIT
              </Column>
            </Row>
          </Section>

          <Section style={{ background: C.tarjeta, border: `4px solid ${C.tinta}`, borderTop: 0, padding: "34px 30px 30px" }}>
            <Text style={{ margin: "0 0 14px", fontFamily: F.pixel, fontSize: "11px", letterSpacing: "4px", color: C.rosa }}>
              {kicker}
            </Text>
            <Heading as="h1" style={{ margin: "0 0 22px", fontFamily: F.display, fontSize: "40px", lineHeight: "1.04", letterSpacing: ".5px", color: C.hueso, textTransform: "uppercase" }}>
              {titular}
            </Heading>
            {children}
          </Section>

          <Section style={{ padding: "22px 26px 8px" }}>
            <Text style={{ margin: "0 0 10px", fontFamily: F.pixel, fontSize: "10px", letterSpacing: "2px", color: C.gris }}>
              <Link href={SITIO} style={{ color: C.gris, textDecoration: "none" }}>SNACKRABBIT.CO</Link>
              {"  ·  "}
              <Link href="https://www.instagram.com/snackrabbit.tv/" style={{ color: C.gris, textDecoration: "none" }}>INSTAGRAM</Link>
              {"  ·  "}
              <Link href={`${SITIO}/shipping`} style={{ color: C.gris, textDecoration: "none" }}>SHIPPING</Link>
              {"  ·  "}
              <Link href={`${SITIO}/returns`} style={{ color: C.gris, textDecoration: "none" }}>RETURNS</Link>
            </Text>
            <Hr style={{ borderColor: C.linea, margin: "0 0 10px" }} />
            {/* Dirección física y baja: en marketing no son opcionales, las exige la ley */}
            <Text style={{ margin: 0, fontFamily: F.pixel, fontSize: "9.5px", lineHeight: "1.9", letterSpacing: "1px", color: C.tenue }}>
              {NOMBRE} · {DIRECCION}<br />
              You are receiving this because you bought from us or joined our list.<br />
              <Link href={baja || `${SITIO}/unsubscribe`} style={{ color: C.tenue }}>Unsubscribe</Link>
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  );
}

export function P({ children }: { children: React.ReactNode }) {
  return (
    <Text style={{ margin: "0 0 15px", fontFamily: F.cuerpo, fontSize: "16.5px", lineHeight: "1.62", color: C.texto }}>
      {children}
    </Text>
  );
}
