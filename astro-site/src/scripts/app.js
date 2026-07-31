/* ============================================================
   SNACKRABBIT — DROP 001 · app.js
   i18n ES/EN · carrito + login demo (localStorage) · UI
   ============================================================ */
"use strict";

/* ---------- Utils ---------- */
const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const money = n => "$" + n.toFixed(2);
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const FREE_SHIP = 60;

/* ============================================================
   I18N
   ============================================================ */
const I18N = {
  es: {
    "meta.title": "SNACKRABBIT — DROP 001 · Merch para gente curiosa",
    "pre.loading": "CARGANDO EL DROP…",
    "aria.openCart": "Abrir carrito",
    "aria.openMenu": "Abrir menú",
    "aria.close": "Cerrar",
    "nav.drop": "EL DROP",
    "nav.manifesto": "MANIFIESTO",
    "nav.login": "LOGIN",
    "nav.hello": "HOLA, {name}",
    "hero.kicker": "@SNACKRABBIT.TV PRESENTA",
    "hero.title1": "SIGUE AL",
    "hero.title2": "CONEJO.",
    "hero.sub": "La curiosidad te trajo hasta aquí.<br>La madriguera hace el resto.",
    "hero.cta2": "VER RABBIT FUEL",
    "hero.meta": "DROP 001 · EDICIÓN LIMITADA · NADA SE REPITE · ENVÍO 48H",
    "hero.tape": "100% REAL ▸ SIN COSAS RARAS ▸ EDICIÓN LIMITADA ▸ 100% REAL ▸ SIN COSAS RARAS ▸ EDICIÓN LIMITADA ▸ ",
    "hero.views": "★ VISTO 180 MILLONES DE VECES",
    "hero.stamp": "100% REAL · SIN COSAS RARAS · 100% REAL · ",
    "hero.badge": "EDICIÓN<br>LIMITADA",
    "marquee.text": "DROP 001 · YA DISPONIBLE ▸ FOCUS · PLAY · REPEAT ▸ ENVÍO 48H ▸ MATE + GUARANÁ ▸ CERO TAURINA ▸ SIN AZÚCAR ▸ 100% REAL ▸ EDICIÓN LIMITADA ▸ ",
    "stats.followers": "SEGUIDORES",
    "stats.views": "VIEWS TOTALES",
    "stats.products": "PRODUCTOS",
    "stats.shipping": "ENVÍO EXPRESS",
    "drop.kicker": "DROP 001 — YA DISPONIBLE",
    "drop.title": "COSAS QUE<br><em>NO NECESITAS.</em>",
    "drop.sub": "Pero vas a querer igual: si no lo usaríamos nosotros, no estaría aquí.",
    "card.add": "AÑADIR +",
    "card.left": "QUEDAN {n}",
    "card.low": "¡ÚLTIMAS UNIDADES!",
    "card.view": "Ver {name}",
    "card.addAria": "Añadir {name} al carrito",
    "fuel.kicker": "Nº 01 — EL PRODUCTO HÉROE",
    "fuel.title": "ENERGÍA<br><em>SIN CUENTOS.</em>",
    "fuel.lead": "Yerba mate + guaraná. Cero taurina, cero cosas raras.",
    "fuel.ing1": "Energía natural, sin el bajón de después.",
    "fuel.ing2": "Enfoque y vitalidad que duran.",
    "fuel.ing3name": "VITAMINAS B",
    "fuel.ing3": "Rendimiento sostenido.",
    "fuel.ing4name": "ELECTROLITOS",
    "fuel.ing4": "Hidratación mientras juegas.",
    "fuel.nutriTitle": "INFORMACIÓN NUTRICIONAL",
    "fuel.nutriSub": "(por porción 250 ml)",
    "fuel.nEnergy": "Energía",
    "fuel.nCarbs": "Carbohidratos",
    "fuel.nSugar": "Azúcares",
    "fuel.nSodium": "Sodio",
    "fuel.nTaurine": "Taurina",
    "fuel.kcalLabel": "KCAL POR PORCIÓN",
    "fuel.chipVegan": "VEGANA",
    "fuel.chipTaurine": "SIN TAURINA",
    "fuel.chipSugar": "SIN AZÚCAR",
    "fuel.cta": "PROBAR PACK ×4 — $16",
    "mani.kicker": "MANIFIESTO",
    "mani.title": "CURIOSIDAD,<br>PERO <em class=\"hl\">EN FÍSICO.</em>",
    "mani.text": "SnackRabbit nació contando curiosidades de 60 segundos. <strong>DROP 001</strong> es exactamente lo mismo, pero en objetos: una lata que no te miente, una toalla que ha visto más scroll que sudor y un conejo de peluche que te mira mientras trabajas.",
    "mani.fact1": "LA YERBA MATE TIENE MÁS ANTIOXIDANTES QUE EL TÉ VERDE.",
    "mani.fact2": "UNA SEMILLA DE GUARANÁ TIENE ~2× LA CAFEÍNA DE UN GRANO DE CAFÉ.",
    "mani.fact3": "LOS CONEJOS PUEDEN VER CASI 360°. NOSOTROS, SOLO ESTE DROP.",
    "faq.title": "PREGUNTAS FRECUENTES",
    "faq.q1": "¿CUÁNDO LLEGA MI PEDIDO?",
    "faq.a1": "Preparamos en 24 h y entregamos en 48–72 h laborables. Recibirás seguimiento por email en cuanto salga de la madriguera.",
    "faq.q2": "¿QUÉ TAMAÑO TIENEN LA TOALLA Y EL PLUSH?",
    "faq.a2": "La Gym Towel mide 100×40 cm, tamaño gimnasio clásico. El plush es tamaño escritorio (~20 cm): cabe entre el teclado y la lata sin estorbar.",
    "faq.q3": "¿PUEDO DEVOLVER ALGO?",
    "faq.a3": "Sí: 30 días para textil y plush sin usar con etiqueta. Rabbit Fuel no admite devolución una vez abierto el pack (por razones obvias).",
    "faq.q4": "¿QUÉ LLEVA EXACTAMENTE RABBIT FUEL?",
    "faq.a4": "Agua carbonatada, extracto de yerba mate, extracto de guaraná, vitaminas del grupo B y electrolitos. Sin azúcar, sin taurina, vegana. 90 kcal por lata.",
    "faq.q5": "¿EL PLUSH ES OFICIAL?",
    "faq.a5": "Sí. Está basado en el logo pixel de Rabbit Fuel, con bordados de alta calidad y etiqueta oficial. Disponible en blanco y en negro.",
    "faq.q6": "¿HABRÁ DROP 002?",
    "faq.a6": "Sí, pero no diremos cuándo. Únete a La Madriguera y te enterarás antes que nadie.",
    "news.title": "ÚNETE A<br>LA MADRIGUERA",
    "news.sub": "Un email al mes: drops, curiosidades y cero spam.",
    "news.ph": "TU@EMAIL.COM",
    "news.btn": "SUSCRIBIRME ▸",
    "news.ok": "★ BIENVENIDO A LA MADRIGUERA. REVISA TU BANDEJA.",
    "news.err": "✕ ESE EMAIL NO PARECE UN EMAIL.",
    "foot.tag": "Curiosidades virales desde 2023.<br>Ahora también en objetos.",
    "foot.shop": "TIENDA",
    "foot.help": "AYUDA",
    "foot.shipping": "ENVÍOS",
    "foot.returns": "DEVOLUCIONES",
    "foot.sizes": "GUÍA DE TALLAS",
    "foot.contact": "CONTACTO",
    "foot.terms": "TÉRMINOS",
    "foot.privacy": "PRIVACIDAD",
    "foot.bar": "© 2026 SNACKRABBIT.TV — HECHO CON CAFEÍNA NATURAL",
    "auth.title": "LA MADRIGUERA",
    "auth.tabIn": "ENTRAR",
    "auth.tabUp": "CREAR CUENTA",
    "auth.email": "EMAIL",
    "auth.emailPh": "tu@email.com",
    "auth.pass": "CONTRASEÑA",
    "auth.passPh": "Mínimo 6 caracteres",
    "auth.name": "NOMBRE",
    "auth.namePh": "Tu nombre",
    "auth.submitIn": "ENTRAR ▸",
    "auth.submitUp": "CREAR CUENTA ▸",
    "auth.note": "DEMO LOCAL — TU CUENTA SOLO VIVE EN ESTE NAVEGADOR.",
    "auth.errName": "PON UN NOMBRE (MÍN. 2 LETRAS).",
    "auth.errEmail": "ESE EMAIL NO PARECE UN EMAIL.",
    "auth.errPass": "CONTRASEÑA: MÍNIMO 6 CARACTERES.",
    "auth.errExists": "YA EXISTE UNA CUENTA CON ESE EMAIL.",
    "auth.errBad": "EMAIL O CONTRASEÑA INCORRECTOS.",
    "auth.welcome": "BIENVENIDO A LA MADRIGUERA, {name} ▸",
    "auth.back": "HOLA DE NUEVO, {name} ▸",
    "auth.out": "SESIÓN CERRADA. VUELVE PRONTO ▸",
    "auth.logoutConfirm": "¿Cerrar sesión de {name}?",
    "pm.qty": "CANTIDAD",
    "pm.add": "AÑADIR AL CARRITO ▸",
    "pm.ship": "ENVÍO 48H · DEVOLUCIONES 30 DÍAS · PAGO SEGURO",
    "cart.title": "TU CARRITO",
    "cart.shipFrom": "ENVÍO GRATIS DESDE $60",
    "cart.need": "TE FALTAN {amt} PARA ENVÍO GRATIS",
    "cart.free": "★ ENVÍO GRATIS DESBLOQUEADO",
    "cart.empty": "TU CARRITO ESTÁ VACÍO.<br>EL CONEJO ESTÁ ESPERANDO.",
    "cart.checkout": "TRAMITAR PEDIDO ▸",
    "cart.note": "IMPUESTOS INCLUIDOS · ENVÍO CALCULADO AL PAGAR",
    "cart.emptyToast": "TU CARRITO ESTÁ VACÍO",
    "cart.removed": "PRODUCTO ELIMINADO",
    "cart.added": "{name} AÑADIDO AL CARRITO ▸",
    "sc.title": "¡PEDIDO CONFIRMADO!",
    "sc.text": "Gracias por apoyar el DROP 001.<br>Tu pedido sale de la madriguera en 24 h. <em>(Demo — no se ha cobrado nada.)</em>",
    "sc.btn": "SEGUIR CURIOSEANDO ▸",
    "demo.page": "DEMO — ESTA PÁGINA AÚN NO EXISTE ▸"
  },
  en: {
    "meta.title": "SNACKRABBIT — DROP 001 · Merch for curious people",
    "pre.loading": "LOADING THE DROP…",
    "aria.openCart": "Open cart",
    "aria.openMenu": "Open menu",
    "aria.close": "Close",
    "nav.drop": "THE DROP",
    "nav.manifesto": "MANIFESTO",
    "nav.login": "LOGIN",
    "nav.hello": "HI, {name}",
    "hero.kicker": "@SNACKRABBIT.TV PRESENTS",
    "hero.title1": "FOLLOW THE",
    "hero.title2": "RABBIT.",
    "hero.sub": "Curiosity got you this far.<br>The burrow does the rest.",
    "hero.cta2": "SEE RABBIT FUEL",
    "hero.meta": "DROP 001 · LIMITED EDITION · NOTHING COMES BACK · 48H SHIPPING",
    "hero.tape": "100% REAL ▸ NO WEIRD STUFF ▸ LIMITED EDITION ▸ 100% REAL ▸ NO WEIRD STUFF ▸ LIMITED EDITION ▸ ",
    "hero.views": "★ SEEN 180 MILLION TIMES",
    "hero.stamp": "100% REAL · NO WEIRD STUFF · 100% REAL · ",
    "hero.badge": "LIMITED<br>EDITION",
    "marquee.text": "DROP 001 · OUT NOW ▸ FOCUS · PLAY · REPEAT ▸ 48H SHIPPING ▸ MATE + GUARANÁ ▸ ZERO TAURINE ▸ ZERO SUGAR ▸ 100% REAL ▸ LIMITED EDITION ▸ ",
    "stats.followers": "FOLLOWERS",
    "stats.views": "TOTAL VIEWS",
    "stats.products": "PRODUCTS",
    "stats.shipping": "EXPRESS SHIPPING",
    "drop.kicker": "DROP 001 — OUT NOW",
    "drop.title": "STUFF YOU<br><em>DON'T NEED.</em>",
    "drop.sub": "You'll want it anyway: if we wouldn't use it ourselves, it wouldn't be here.",
    "card.add": "ADD +",
    "card.left": "{n} LEFT",
    "card.low": "LOW STOCK!",
    "card.view": "View {name}",
    "card.addAria": "Add {name} to cart",
    "fuel.kicker": "No. 01 — THE HERO PRODUCT",
    "fuel.title": "ENERGY,<br><em>NO NONSENSE.</em>",
    "fuel.lead": "Yerba mate + guaraná. Zero taurine, zero weird stuff.",
    "fuel.ing1": "Natural energy without the crash.",
    "fuel.ing2": "Focus and vitality that last.",
    "fuel.ing3name": "B VITAMINS",
    "fuel.ing3": "Sustained performance.",
    "fuel.ing4name": "ELECTROLYTES",
    "fuel.ing4": "Hydration while you play.",
    "fuel.nutriTitle": "NUTRITION FACTS",
    "fuel.nutriSub": "(per 250 ml serving)",
    "fuel.nEnergy": "Energy",
    "fuel.nCarbs": "Carbohydrates",
    "fuel.nSugar": "Sugars",
    "fuel.nSodium": "Sodium",
    "fuel.nTaurine": "Taurine",
    "fuel.kcalLabel": "KCAL PER SERVING",
    "fuel.chipVegan": "VEGAN",
    "fuel.chipTaurine": "ZERO TAURINE",
    "fuel.chipSugar": "ZERO SUGAR",
    "fuel.cta": "TRY THE 4-PACK — $16",
    "mani.kicker": "MANIFESTO",
    "mani.title": "CURIOSITY,<br>BUT <em class=\"hl\">PHYSICAL.</em>",
    "mani.text": "SnackRabbit was born telling 60-second curiosities. <strong>DROP 001</strong> is exactly the same, but in objects: a can that doesn't lie to you, a towel that has seen more scrolling than sweat, and a plush bunny that watches you work.",
    "mani.fact1": "YERBA MATE HAS MORE ANTIOXIDANTS THAN GREEN TEA.",
    "mani.fact2": "A GUARANÁ SEED PACKS ~2× THE CAFFEINE OF A COFFEE BEAN.",
    "mani.fact3": "RABBITS CAN SEE ALMOST 360°. WE CAN ONLY SEE THIS DROP.",
    "faq.title": "FREQUENTLY ASKED QUESTIONS",
    "faq.q1": "WHEN DOES MY ORDER ARRIVE?",
    "faq.a1": "We prepare within 24 h and deliver in 48–72 working hours. You'll get tracking by email as soon as it leaves the burrow.",
    "faq.q2": "HOW BIG ARE THE TOWEL AND THE PLUSH?",
    "faq.a2": "The Gym Towel is 100×40 cm, classic gym size. The plush is desk-sized (~20 cm): it fits between your keyboard and your can without getting in the way.",
    "faq.q3": "CAN I RETURN SOMETHING?",
    "faq.a3": "Yes: 30 days for unused apparel and plush with tags on. Rabbit Fuel can't be returned once the pack is opened (for obvious reasons).",
    "faq.q4": "WHAT EXACTLY IS IN RABBIT FUEL?",
    "faq.a4": "Carbonated water, yerba mate extract, guaraná extract, B vitamins and electrolytes. Zero sugar, zero taurine, vegan. 90 kcal per can.",
    "faq.q5": "IS THE PLUSH OFFICIAL?",
    "faq.a5": "Yes. It's based on the official Rabbit Fuel pixel logo, with high-quality embroidery and the official tag. Available in white and black.",
    "faq.q6": "WILL THERE BE A DROP 002?",
    "faq.a6": "Yes, but we won't say when. Join The Burrow and you'll know before anyone else.",
    "news.title": "JOIN<br>THE BURROW",
    "news.sub": "One email a month: drops, curiosities, zero spam.",
    "news.ph": "YOU@EMAIL.COM",
    "news.btn": "SUBSCRIBE ▸",
    "news.ok": "★ WELCOME TO THE BURROW. CHECK YOUR INBOX.",
    "news.err": "✕ THAT EMAIL DOESN'T LOOK LIKE AN EMAIL.",
    "foot.tag": "Viral curiosities since 2023.<br>Now also in objects.",
    "foot.shop": "SHOP",
    "foot.help": "HELP",
    "foot.shipping": "SHIPPING",
    "foot.returns": "RETURNS",
    "foot.sizes": "SIZE GUIDE",
    "foot.contact": "CONTACT",
    "foot.terms": "TERMS",
    "foot.privacy": "PRIVACY",
    "foot.bar": "© 2026 SNACKRABBIT.TV — MADE WITH NATURAL CAFFEINE",
    "auth.title": "THE BURROW",
    "auth.tabIn": "SIGN IN",
    "auth.tabUp": "SIGN UP",
    "auth.email": "EMAIL",
    "auth.emailPh": "you@email.com",
    "auth.pass": "PASSWORD",
    "auth.passPh": "At least 6 characters",
    "auth.name": "NAME",
    "auth.namePh": "Your name",
    "auth.submitIn": "SIGN IN ▸",
    "auth.submitUp": "CREATE ACCOUNT ▸",
    "auth.note": "LOCAL DEMO — YOUR ACCOUNT LIVES ONLY IN THIS BROWSER.",
    "auth.errName": "ENTER A NAME (MIN. 2 LETTERS).",
    "auth.errEmail": "THAT EMAIL DOESN'T LOOK LIKE AN EMAIL.",
    "auth.errPass": "PASSWORD: AT LEAST 6 CHARACTERS.",
    "auth.errExists": "AN ACCOUNT WITH THAT EMAIL ALREADY EXISTS.",
    "auth.errBad": "WRONG EMAIL OR PASSWORD.",
    "auth.welcome": "WELCOME TO THE BURROW, {name} ▸",
    "auth.back": "WELCOME BACK, {name} ▸",
    "auth.out": "SIGNED OUT. COME BACK SOON ▸",
    "auth.logoutConfirm": "Sign out {name}?",
    "pm.qty": "QUANTITY",
    "pm.add": "ADD TO CART ▸",
    "pm.ship": "48H SHIPPING · 30-DAY RETURNS · SECURE PAYMENT",
    "cart.title": "YOUR CART",
    "cart.shipFrom": "FREE SHIPPING FROM $60",
    "cart.need": "{amt} AWAY FROM FREE SHIPPING",
    "cart.free": "★ FREE SHIPPING UNLOCKED",
    "cart.empty": "YOUR CART IS EMPTY.<br>THE BUNNY IS WAITING.",
    "cart.checkout": "CHECKOUT ▸",
    "cart.note": "TAXES INCLUDED · SHIPPING CALCULATED AT CHECKOUT",
    "cart.emptyToast": "YOUR CART IS EMPTY",
    "cart.removed": "ITEM REMOVED",
    "cart.added": "{name} ADDED TO CART ▸",
    "sc.title": "ORDER CONFIRMED!",
    "sc.text": "Thanks for backing DROP 001.<br>Your order leaves the burrow within 24 h. <em>(Demo — nothing was charged.)</em>",
    "sc.btn": "KEEP BROWSING ▸",
    "demo.page": "DEMO — THIS PAGE DOESN'T EXIST YET ▸"
  }
};

/* Inglés para todo el mundo; el español es una elección explícita que sí se
   recuerda. La clave va versionada a propósito: al pasar de v1 a v2 se descarta
   cualquier preferencia guardada antes, así los visitantes que ya habían visto
   el sitio en español también entran ahora en inglés. */
const LANG_KEY = "sr_lang_v2";
let LANG = (() => {
  try {
    localStorage.removeItem("sr_lang_v1");   // preferencia anterior: deja de contar
    const l = localStorage.getItem(LANG_KEY);
    return (l === "en" || l === "es") ? l : "en";
  } catch { return "en"; }
})();

function t(key, vars) {
  let s = I18N[LANG][key] ?? I18N.es[key] ?? key;
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll("{" + k + "}", v);
  return s;
}

/* Nombres de color y talla: se guardan en canónico (ES) y se traducen al pintar */
const COLOR_EN = { NIEBLA: "FOG", ROSA: "PINK", NEGRO: "BLACK", HUESO: "BONE", ROSADO: "BLUSH", BLANCO: "WHITE", AMARILLO: "YELLOW" };
const SIZE_EN  = { "ÚNICA": "ONE SIZE" };
const colorName = c => LANG === "en" ? (COLOR_EN[c] ?? c) : c;
const sizeName  = s => LANG === "en" ? (SIZE_EN[s] ?? s) : s;

/* ============================================================
   DATOS DE PRODUCTO
   ============================================================ */
const PRODUCTS = [
  {
    id: "rabbit-fuel",
    num: "DROP 001 · Nº 01",
    name: "RABBIT FUEL",
    price: 16,
    priceNote: "PACK ×4",
    desc: {
      es: "Bebida energética natural: yerba mate + guaraná. Cero taurina, cero cosas raras.",
      en: "Natural energy drink: yerba mate + guaraná. Zero taurine, zero weird stuff."
    },
    specs: {
      es: "250 ML · MATE + GUARANÁ · SIN TAURINA · VEGANA · SIN AZÚCAR · 90 KCAL",
      en: "250 ML · MATE + GUARANÁ · ZERO TAURINE · VEGAN · ZERO SUGAR · 90 KCAL"
    },
    colors: ["#0d0d14", "#ff4fd8", "#ffd400"],
    colorNames: ["NEGRO", "ROSA", "AMARILLO"],
    sizes: ["PACK ×4", "PACK ×12"],
    sizeLabel: { es: "PACK", en: "PACK" },
    sizePrices: { "PACK ×4": 16, "PACK ×12": 42 },
    img: "/assets/product-rabbit-fuel.jpg",
    stock: 87, stockMax: 200
  },
  {
    id: "plush",
    num: "DROP 001 · Nº 02",
    name: "RABBIT FUEL PLUSH",
    price: 35,
    priceNote: "",
    desc: {
      es: "El logo hecho peluche: diseño pixel, ultra suave y con detalles bordados premium.",
      en: "The logo turned plush: pixel design, ultra soft, premium embroidered details."
    },
    specs: {
      es: "DISEÑO PIXEL · MATERIAL ULTRA SUAVE · DETALLES BORDADOS · ETIQUETA OFICIAL",
      en: "PIXEL DESIGN · ULTRA SOFT MATERIAL · EMBROIDERED DETAILS · OFFICIAL TAG"
    },
    colors: ["#f2f2f7", "#17171b"],
    colorNames: ["BLANCO", "NEGRO"],
    imgByColor: { BLANCO: "/assets/plush-white.jpg", NEGRO: "/assets/plush-black.jpg" },
    sizes: ["ÚNICA"],
    sizeLabel: { es: "TAMAÑO", en: "SIZE" },
    img: "/assets/plush-white.jpg",
    imgPos: "50% 42%",
    stock: 28, stockMax: 60
  },
  {
    id: "gym-towel",
    num: "DROP 001 · Nº 03",
    name: "GYM TOWEL",
    price: 29,
    priceNote: "",
    desc: {
      es: "Microfibra quick-dry con franjas jacquard y flecos. Sweat. Scroll. Repeat.",
      en: "Quick-dry microfiber with jacquard stripes and fringe. Sweat. Scroll. Repeat."
    },
    specs: {
      es: "MICROFIBRA QUICK-DRY · 100×40 CM · LAZO COLGADOR · BUNNY BORDADO",
      en: "QUICK-DRY MICROFIBER · 100×40 CM · HANGING LOOP · EMBROIDERED BUNNY"
    },
    colors: ["#fbf2f7", "#ff4fd8", "#050508"],
    colorNames: ["ROSADO", "ROSA", "NEGRO"],
    sizes: ["ÚNICA"],
    sizeLabel: { es: "TAMAÑO", en: "SIZE" },
    img: "/assets/product-gym-towel.jpg",
    stock: 41, stockMax: 100
  }
];

/* El stat de productos se calcula solo: añadir un producto lo actualiza */
const statProductsNum = document.querySelector("#statProducts .stat-num");
if (statProductsNum) statProductsNum.dataset.count = PRODUCTS.length;

/* ============================================================
   PRELOADER
   ============================================================ */
(() => {
  const pre = $("#preloader"), fill = $("#preBarFill"), pct = $("#prePct");
  let p = 0;
  const timer = setInterval(() => {
    p = Math.min(100, p + 14 + Math.random() * 18);
    fill.style.width = p + "%";
    pct.textContent = Math.round(p) + "%";
    if (p >= 100) {
      clearInterval(timer);
      setTimeout(() => {
        pre.classList.add("done");
        document.body.classList.add("loaded");
        setTimeout(() => pre.remove(), 700);
      }, 180);
    }
  }, 90);
})();

/* ============================================================
   CURSOR PIXEL
   ============================================================ */
(() => {
  const cur = $("#cursorPx");
  if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  let x = 0, y = 0, cx = 0, cy = 0;
  addEventListener("mousemove", e => { x = e.clientX; y = e.clientY; });
  (function loop() {
    cx += (x - cx) * .35; cy += (y - cy) * .35;
    cur.style.left = cx + "px"; cur.style.top = cy + "px";
    requestAnimationFrame(loop);
  })();
  addEventListener("mouseover", e => {
    cur.classList.toggle("big", !!e.target.closest("a, button, summary, .pcard, .swatch, input"));
  });
})();

/* ============================================================
   NAVBAR + MENÚ MÓVIL
   ============================================================ */
(() => {
  const nav = $("#nav");
  addEventListener("scroll", () => nav.classList.toggle("scrolled", scrollY > 40), { passive: true });

  const burger = $("#btnBurger"), menu = $("#mobileMenu");
  const toggle = open => {
    burger.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", open);
    menu.classList.toggle("open", open);
    menu.setAttribute("aria-hidden", !open);
    document.body.style.overflow = open ? "hidden" : "";
  };
  burger.addEventListener("click", () => toggle(!menu.classList.contains("open")));
  $$("#mobileMenu nav a").forEach(a => a.addEventListener("click", () => toggle(false)));

  const secs = ["drop", "fuel", "historia", "faq"].map(id => document.getElementById(id));
  const links = $$(".nav-links a");
  addEventListener("scroll", () => {
    let cur = "#top";
    secs.forEach(s => { if (s && scrollY >= s.offsetTop - 200) cur = "#" + s.id; });
    links.forEach(l => l.classList.toggle("active", l.getAttribute("href") === cur));
  }, { passive: true });
})();

/* ============================================================
   HERO: split letters + parallax
   ============================================================ */
function splitTitle() {
  const w1 = t("hero.title1"), w2 = t("hero.title2");
  const h1 = $("#heroTitle");
  h1.setAttribute("aria-label", w1 + " " + w2);
  [[$("#htWord1"), w1, 300], [$("#htWord2"), w2, 650]].forEach(([el, txt, base]) => {
    el.innerHTML = "";
    [...txt].forEach((ch, i) => {
      const s = document.createElement("span");
      s.className = "ch";
      s.textContent = ch === " " ? " " : ch;
      s.style.setProperty("--ch-delay", base + i * 55 + "ms");
      el.appendChild(s);
    });
  });
  fitTitle();
}

/* Encoge la fuente del titular hasta que cada línea quepa (por idioma y viewport).
   Actúa ya al 98% del ancho y deja el texto al 96%: sin ese margen, un titular que
   encaja al milímetro aquí se recorta en otro dispositivo que rasterice la fuente
   un poco más ancha (pasaba con "FOLLOW THE" en iPad). */
function fitTitle() {
  const h1 = $("#heroTitle");
  h1.style.fontSize = "";
  const base = parseFloat(getComputedStyle(h1).fontSize);
  const avail = h1.clientWidth;
  let ratio = 1;
  $$(".ht-line", h1).forEach(l => {
    if (l.scrollWidth > avail * 0.98) ratio = Math.min(ratio, (avail * 0.96) / l.scrollWidth);
  });
  if (ratio < 1) h1.style.fontSize = Math.floor(base * ratio) + "px";
}
let fitTimer;
addEventListener("resize", () => { clearTimeout(fitTimer); fitTimer = setTimeout(fitTitle, 150); });
if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => fitTitle());

(() => {
  // hover juguetón por letra cuando termina la entrada
  $("#heroTitle").addEventListener("animationend", e => {
    if (e.target.classList && e.target.classList.contains("ch")) e.target.classList.add("done");
  });

  if (reducedMotion || !matchMedia("(pointer: fine)").matches) return;
  const zone = $("#hero"), items = $$("[data-depth]");
  let mx = 0, my = 0, tx = 0, ty = 0;
  zone.addEventListener("mousemove", e => {
    const r = zone.getBoundingClientRect();
    mx = (e.clientX - r.left) / r.width - .5;
    my = (e.clientY - r.top) / r.height - .5;
  });
  (function loop() {
    tx += (mx - tx) * .06; ty += (my - ty) * .06;
    items.forEach(el => {
      const d = +el.dataset.depth;
      el.style.translate = `${(-tx * d).toFixed(1)}px ${(-ty * d).toFixed(1)}px`;
    });
    requestAnimationFrame(loop);
  })();
})();

/* ============================================================
   REVEALS + CONTADORES
   ============================================================ */
const revealIO = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (!en.isIntersecting) return;
    en.target.classList.add("in");
    const bar = en.target.querySelector("[data-fill]");
    if (bar) bar.style.width = bar.dataset.fill + "%";
    revealIO.unobserve(en.target);
  });
}, { threshold: .15 });

(() => {
  $$(".rv").forEach(el => {
    if (el.dataset.delay) el.style.setProperty("--rv-delay", el.dataset.delay + "ms");
    revealIO.observe(el);
  });

  const cio = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      cio.unobserve(en.target);
      const el = en.target;
      const target = parseFloat(el.dataset.count);
      const dec = +(el.dataset.decimals || 0);
      const suf = el.dataset.suffix || "";
      const pad = +(el.dataset.pad || 0);
      const t0 = performance.now(), dur = 1400;
      (function tick(now) {
        const p = Math.min(1, (now - t0) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        let v = (target * eased).toFixed(dec);
        if (pad) v = String(Math.round(v)).padStart(pad, "0");
        el.textContent = v + suf;
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
    });
  }, { threshold: .5 });
  $$("[data-count]").forEach(el => cio.observe(el));
})();

/* ============================================================
   CONFETTI PIXEL
   ============================================================ */
const confetti = (() => {
  const cv = $("#confetti"), ctx = cv.getContext("2d");
  let parts = [], raf = null;
  const resize = () => { cv.width = innerWidth; cv.height = innerHeight; };
  resize(); addEventListener("resize", resize);
  const COLORS = ["#ff4fd8", "#ffd400", "#050508", "#e9e9f6", "#e93fc4"];
  function burst(x, y, n = 34) {
    if (reducedMotion) return;
    for (let i = 0; i < n; i++) {
      parts.push({
        x, y,
        vx: (Math.random() - .5) * 11,
        vy: -Math.random() * 10 - 3,
        s: 4 + Math.random() * 7,
        c: COLORS[Math.random() * COLORS.length | 0],
        r: Math.random() * Math.PI,
        vr: (Math.random() - .5) * .3,
        life: 90 + Math.random() * 40
      });
    }
    if (!raf) loop();
  }
  function loop() {
    raf = requestAnimationFrame(loop);
    ctx.clearRect(0, 0, cv.width, cv.height);
    parts = parts.filter(p => p.life > 0 && p.y < cv.height + 30);
    if (!parts.length) { cancelAnimationFrame(raf); raf = null; return; }
    parts.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.vy += .34; p.r += p.vr; p.life--;
      ctx.save();
      ctx.translate(p.x, p.y); ctx.rotate(p.r);
      ctx.fillStyle = p.c;
      ctx.globalAlpha = Math.min(1, p.life / 40);
      ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s);
      ctx.restore();
    });
  }
  return { burst };
})();

/* ============================================================
   TOASTS
   ============================================================ */
function toast(msg) {
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = msg;
  $("#toasts").appendChild(el);
  setTimeout(() => el.remove(), 3100);
}

/* ============================================================
   OVERLAY / MODALES
   ============================================================ */
const UI = (() => {
  const overlay = $("#overlay");
  let openEl = null, lastFocus = null;

  function open(el) {
    close(true);
    lastFocus = document.activeElement;
    openEl = el;
    overlay.hidden = false;
    requestAnimationFrame(() => overlay.classList.add("on"));
    if (el.classList.contains("cart")) {
      el.classList.add("open");
      el.setAttribute("aria-hidden", "false");
    } else {
      el.hidden = false;
      requestAnimationFrame(() => el.classList.add("on"));
    }
    document.body.style.overflow = "hidden";
    const f = el.querySelector("input, button:not(.modal-x)");
    if (f) setTimeout(() => f.focus(), 120);
  }

  function close(silent) {
    if (!openEl) return;
    const el = openEl;
    openEl = null;
    if (el.classList.contains("cart")) {
      el.classList.remove("open");
      el.setAttribute("aria-hidden", "true");
    } else {
      el.classList.remove("on");
      setTimeout(() => { el.hidden = true; }, 280);
    }
    if (!silent) {
      overlay.classList.remove("on");
      setTimeout(() => { overlay.hidden = true; }, 260);
      document.body.style.overflow = "";
      if (lastFocus) lastFocus.focus();
    }
  }

  overlay.addEventListener("click", () => close());
  addEventListener("keydown", e => { if (e.key === "Escape") close(); });
  $$("[data-close]").forEach(b => b.addEventListener("click", () => close()));
  return { open, close, isOpen: el => openEl === el };
})();

/* ============================================================
   GRID DE PRODUCTOS (re-renderizable por idioma)
   ============================================================ */
function renderGrid(instant) {
  const grid = $("#dropGrid");
  grid.innerHTML = "";
  PRODUCTS.forEach((p, i) => {
    const card = document.createElement("article");
    card.className = "pcard rv";
    card.style.setProperty("--rv-delay", i * 90 + "ms");
    card.style.setProperty("--tilt", (i % 2 ? ".6deg" : "-.6deg"));
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", t("card.view", { name: p.name }));
    const low = p.stock <= 15;
    const pos = p.imgPos ? ` style="object-position:${p.imgPos}"` : "";
    card.innerHTML = `
      <p class="pcard-num">${p.num}</p>
      ${low ? `<span class="pcard-stock-flag">${t("card.low")}</span>` : ""}
      <div class="pcard-media"><img src="${p.img}" alt="${p.name}" loading="lazy"${pos}></div>
      <div class="pcard-body">
        <h3 class="pcard-name">${p.name}</h3>
        <p class="pcard-desc">${p.desc[LANG]}</p>
        <p class="pcard-specs">${p.specs[LANG]}</p>
        <div class="pcard-stock">
          <div class="pcard-stock-bar"><span data-fill="${Math.round(p.stock / p.stockMax * 100)}"></span></div>
          <span class="pcard-stock-label">${t("card.left", { n: p.stock })}</span>
        </div>
        <div class="pcard-foot">
          <div class="pcard-swatches">
            ${p.colors.map((c, ci) => `<span class="swatch" style="background:${c}" title="${colorName(p.colorNames[ci])}"></span>`).join("")}
          </div>
          <div class="pcard-buy">
            <span class="pcard-price">${money(p.price)}${p.priceNote ? `<small>${p.priceNote}</small>` : ""}</span>
            <button class="pcard-add" type="button" aria-label="${t("card.addAria", { name: p.name })}">${t("card.add")}</button>
          </div>
        </div>
      </div>`;
    card.querySelector(".pcard-add").addEventListener("click", e => {
      e.stopPropagation();
      const size = p.sizes[Math.floor(p.sizes.length / 2 - .5)] || p.sizes[0];
      Cart.add(p.id, { size, color: p.colorNames[0], qty: 1 });
      confetti.burst(e.clientX, e.clientY, 26);
    });
    card.addEventListener("click", () => ProductModal.open(p.id));
    card.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); ProductModal.open(p.id); } });
    grid.appendChild(card);

    if (instant) {
      card.classList.add("in");
      const bar = card.querySelector("[data-fill]");
      if (bar) bar.style.width = bar.dataset.fill + "%";
    } else {
      revealIO.observe(card);
    }
  });
}

/* ============================================================
   MODAL DE PRODUCTO
   ============================================================ */
const ProductModal = (() => {
  const el = $("#productModal");
  let cur = null, qty = 1, size = null, color = null, view = null;

  const price = () => (cur.sizePrices && cur.sizePrices[size] != null) ? cur.sizePrices[size] : cur.price;
  const imgFor = c => (cur.imgByColor && cur.imgByColor[c]) || cur.img;
  /* la imagen la manda el color (plush) o la vista elegida en la galería (textil) */
  const srcNow = () => cur.imgByColor ? imgFor(color) : (view || cur.img);

  function paint() {
    $("#pmPrice").textContent = money(price() * qty);
    $("#pmQty").textContent = qty;
    $$(".pm-size", el).forEach(b => b.classList.toggle("sel", b.dataset.size === size));
    $$(".pm-swatches .swatch", el).forEach(s => s.classList.toggle("sel", s.dataset.color === color));
    $$(".pm-thumb", el).forEach(b => b.classList.toggle("sel", b.dataset.src === view));
    const img = $("#pmImg"), src = srcNow();
    if (!img.src.endsWith(src)) img.src = src;
  }

  function populate(keepSelection) {
    if (!keepSelection) { qty = 1; size = cur.sizes[0]; color = cur.colorNames[0]; view = cur.views ? cur.views[0] : null; }
    if (view && !(cur.views || []).includes(view)) view = cur.views ? cur.views[0] : null;
    $("#pmImg").src = srcNow();
    $("#pmImg").alt = cur.name;
    $("#pmImg").style.objectPosition = cur.imgPos || "";
    $("#pmNum").textContent = cur.num;
    $("#pmName").textContent = cur.name;
    $("#pmTagline").textContent = cur.tagline ? cur.tagline[LANG] : "";
    $("#pmDesc").textContent = cur.desc[LANG];
    $("#pmSpecs").textContent = cur.specs[LANG];
    $("#pmSizeLabel").textContent = cur.sizeLabel[LANG];
    $("#pmFeatures").innerHTML = (cur.features || [])
      .map(f => `<li><strong>${f[LANG][0]}</strong><span>${f[LANG][1]}</span></li>`).join("");
    $("#pmThumbs").innerHTML = (cur.views || []).length > 1
      ? cur.views.map((v, i) => `<button class="pm-thumb" type="button" data-src="${v}" aria-label="${cur.name} ${i + 1}"><img src="${v}" alt=""></button>`).join("")
      : "";
    $$(".pm-thumb", el).forEach(b => b.addEventListener("click", () => { view = b.dataset.src; paint(); }));
    $("#pmSwatches").innerHTML = cur.colorNames.map((cn, i) =>
      `<span class="swatch" style="background:${cur.colors[i]}" data-color="${cn}" title="${colorName(cn)}" role="button" tabindex="0" aria-label="${colorName(cn)}"></span>`).join("");
    $("#pmSizes").innerHTML = cur.sizes.map(s => `<button class="pm-size" type="button" data-size="${s}">${sizeName(s)}</button>`).join("");
    $$(".pm-swatches .swatch", el).forEach(s => s.addEventListener("click", () => { color = s.dataset.color; paint(); }));
    $$(".pm-size", el).forEach(b => b.addEventListener("click", () => { size = b.dataset.size; paint(); }));
    paint();
  }

  function open(id) {
    cur = PRODUCTS.find(p => p.id === id);
    populate(false);
    UI.open(el);
  }
  function refreshLang() {
    if (cur && !el.hidden) populate(true);
  }

  $("#pmMinus").addEventListener("click", () => { qty = Math.max(1, qty - 1); paint(); });
  $("#pmPlus").addEventListener("click", () => { qty = Math.min(9, qty + 1); paint(); });
  $("#pmAdd").addEventListener("click", e => {
    Cart.add(cur.id, { size, color, qty, unitPrice: price() });
    confetti.burst(e.clientX, e.clientY, 30);
    UI.close();
  });
  return { open, refreshLang };
})();

/* ============================================================
   CARRITO
   ============================================================ */
const Cart = (() => {
  const KEY = "sr_cart_v1";
  let items = [];
  try { items = JSON.parse(localStorage.getItem(KEY)) || []; } catch { items = []; }
  const save = () => localStorage.setItem(KEY, JSON.stringify(items));

  /* descarta lo guardado de catálogos anteriores (productos que ya no existen) */
  const kept = items.filter(i => i && PRODUCTS.some(p => p.id === i.id));
  if (kept.length !== items.length) { items = kept; save(); }
  const count = () => items.reduce((a, i) => a + i.qty, 0);
  const total = () => items.reduce((a, i) => a + i.qty * i.unitPrice, 0);

  function add(id, { size, color, qty = 1, unitPrice }) {
    const p = PRODUCTS.find(x => x.id === id);
    const up = unitPrice != null ? unitPrice
      : (p.sizePrices && p.sizePrices[size] != null ? p.sizePrices[size] : p.price);
    const key = `${id}|${size}|${color}`;
    const found = items.find(i => i.key === key);
    if (found) found.qty = Math.min(9, found.qty + qty);
    else items.push({ key, id, size, color, qty, unitPrice: up });
    save(); render();
    toast(t("cart.added", { name: p.name }));
    const cc = $("#cartCount");
    cc.classList.remove("pop"); void cc.offsetWidth; cc.classList.add("pop");
  }
  function setQty(key, q) {
    const it = items.find(i => i.key === key);
    if (!it) return;
    it.qty = q;
    if (it.qty <= 0) items = items.filter(i => i.key !== key);
    save(); render();
  }
  function clear() { items = []; save(); render(); }

  function render() {
    $("#cartCount").textContent = count();
    $("#cartHeadCount").textContent = `(${count()})`;
    $("#cartTotal").textContent = money(total());

    const tot = total();
    $("#cartShipFill").style.width = Math.min(100, tot / FREE_SHIP * 100) + "%";
    const msg = $("#cartShipMsg");
    if (!items.length) { msg.textContent = t("cart.shipFrom"); msg.classList.remove("free"); }
    else if (tot >= FREE_SHIP) { msg.textContent = t("cart.free"); msg.classList.add("free"); }
    else { msg.textContent = t("cart.need", { amt: money(FREE_SHIP - tot) }); msg.classList.remove("free"); }

    const box = $("#cartItems");
    if (!items.length) {
      box.innerHTML = `
        <div class="cart-empty">
          <svg aria-hidden="true"><use href="#bunny"></use></svg>
          <p>${t("cart.empty")}</p>
        </div>`;
      return;
    }
    box.innerHTML = "";
    items.forEach(it => {
      const p = PRODUCTS.find(x => x.id === it.id);
      const thumb = (p.imgByColor && p.imgByColor[it.color]) || p.img;
      const row = document.createElement("div");
      row.className = "citem";
      row.innerHTML = `
        <img src="${thumb}" alt="${p.name}">
        <div>
          <p class="citem-name">${p.name}</p>
          <p class="citem-var">${sizeName(it.size)} · ${colorName(it.color)}</p>
          <div class="citem-qty">
            <button type="button" aria-label="−">−</button>
            <span>${it.qty}</span>
            <button type="button" aria-label="+">+</button>
          </div>
        </div>
        <div class="citem-right">
          <span class="citem-price">${money(it.unitPrice * it.qty)}</span>
          <button class="citem-del" type="button" aria-label="✕">✕</button>
        </div>`;
      const [minus, plus] = row.querySelectorAll(".citem-qty button");
      minus.addEventListener("click", () => setQty(it.key, it.qty - 1));
      plus.addEventListener("click", () => setQty(it.key, Math.min(9, it.qty + 1)));
      row.querySelector(".citem-del").addEventListener("click", () => { setQty(it.key, 0); toast(t("cart.removed")); });
      box.appendChild(row);
    });
  }

  return { add, clear, count, total, render };
})();

$("#btnCart").addEventListener("click", () => UI.open($("#cartDrawer")));

/* Checkout demo */
$("#btnCheckout").addEventListener("click", () => {
  if (!Cart.count()) { toast(t("cart.emptyToast")); return; }
  const n = String(Math.floor(1000 + Math.random() * 9000));
  $("#scOrder").textContent = "#SR-" + n;
  Cart.clear();
  UI.open($("#successModal"));
  setTimeout(() => confetti.burst(innerWidth / 2, innerHeight / 3, 80), 250);
});

/* CTA Rabbit Fuel */
$("#btnFuelAdd").addEventListener("click", e => {
  Cart.add("rabbit-fuel", { size: "PACK ×4", color: "NEGRO", qty: 1 });
  confetti.burst(e.clientX, e.clientY, 30);
});

/* ============================================================
   LOGIN DEMO (localStorage)
   ============================================================ */
const Auth = (() => {
  const USERS = "sr_users_v1", SESS = "sr_session_v1";
  const modal = $("#loginModal");
  const tabIn = $("#tabIn"), tabUp = $("#tabUp");
  const formIn = $("#formIn"), formUp = $("#formUp");

  const getUsers = () => { try { return JSON.parse(localStorage.getItem(USERS)) || {}; } catch { return {}; } };
  const session = () => { try { return JSON.parse(localStorage.getItem(SESS)); } catch { return null; } };
  const emailOk = e => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);

  function switchTab(up) {
    tabIn.classList.toggle("active", !up); tabUp.classList.toggle("active", up);
    tabIn.setAttribute("aria-selected", !up); tabUp.setAttribute("aria-selected", up);
    formIn.hidden = up; formUp.hidden = !up;
    $$(".lm-err").forEach(e => e.textContent = "");
  }
  tabIn.addEventListener("click", () => switchTab(false));
  tabUp.addEventListener("click", () => switchTab(true));

  function paintNav() {
    const s = session();
    const label = $("#loginLabel"), btn = $("#btnLogin");
    if (s) { label.textContent = t("nav.hello", { name: s.name.split(" ")[0].toUpperCase() }); btn.classList.add("logged"); }
    else { label.textContent = t("nav.login"); btn.classList.remove("logged"); }
  }

  formUp.addEventListener("submit", e => {
    e.preventDefault();
    const err = formUp.querySelector(".lm-err");
    const name = formUp.name.value.trim(), email = formUp.email.value.trim().toLowerCase(), pass = formUp.pass.value;
    if (name.length < 2) return err.textContent = t("auth.errName");
    if (!emailOk(email)) return err.textContent = t("auth.errEmail");
    if (pass.length < 6) return err.textContent = t("auth.errPass");
    const users = getUsers();
    if (users[email]) return err.textContent = t("auth.errExists");
    users[email] = { name, pass };
    localStorage.setItem(USERS, JSON.stringify(users));
    localStorage.setItem(SESS, JSON.stringify({ email, name }));
    paintNav(); UI.close();
    toast(t("auth.welcome", { name: name.toUpperCase() }));
    confetti.burst(innerWidth / 2, 120, 40);
    formUp.reset();
  });

  formIn.addEventListener("submit", e => {
    e.preventDefault();
    const err = formIn.querySelector(".lm-err");
    const email = formIn.email.value.trim().toLowerCase(), pass = formIn.pass.value;
    if (!emailOk(email)) return err.textContent = t("auth.errEmail");
    const u = getUsers()[email];
    if (!u || u.pass !== pass) return err.textContent = t("auth.errBad");
    localStorage.setItem(SESS, JSON.stringify({ email, name: u.name }));
    paintNav(); UI.close();
    toast(t("auth.back", { name: u.name.toUpperCase() }));
    formIn.reset();
  });

  $("#btnLogin").addEventListener("click", () => {
    const s = session();
    if (!s) { switchTab(false); UI.open(modal); return; }
    if (confirm(t("auth.logoutConfirm", { name: s.name }))) {
      localStorage.removeItem(SESS);
      paintNav();
      toast(t("auth.out"));
    }
  });

  return { session, paintNav };
})();

/* ============================================================
   NEWSLETTER
   ============================================================ */
$("#newsForm").addEventListener("submit", e => {
  e.preventDefault();
  const input = $("#newsEmail"), msg = $("#newsMsg");
  const email = input.value.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    msg.textContent = t("news.err");
    input.focus();
    return;
  }
  msg.textContent = t("news.ok");
  const r = e.submitter?.getBoundingClientRect();
  if (r) confetti.burst(r.left + r.width / 2, r.top, 40);
  input.value = "";
});

/* ============================================================
   LATAS INTERACTIVAS (PSSHT!)
   ============================================================ */
(() => {
  const can = $("#fuelCan"), psst = $("#fuelPsst");
  can.addEventListener("click", e => {
    can.classList.remove("shake"); void can.offsetWidth; can.classList.add("shake");
    psst.classList.add("on");
    confetti.burst(e.clientX, e.clientY, 36);
    setTimeout(() => psst.classList.remove("on"), 900);
  });
  const heroCan = $("#heroCan");
  heroCan.addEventListener("click", e => {
    heroCan.classList.remove("shake"); void heroCan.offsetWidth; heroCan.classList.add("shake");
    confetti.burst(e.clientX, e.clientY, 30);
  });
})();

/* ============================================================
   ENLACES DEMO + ficha desde footer
   ============================================================ */
$$("[data-demo]").forEach(a => a.addEventListener("click", e => {
  e.preventDefault();
  toast(t("demo.page"));
}));
$$("[data-open-product]").forEach(a => a.addEventListener("click", e => {
  e.preventDefault();
  ProductModal.open(a.dataset.openProduct);
}));

/* ============================================================
   EXPERIENCIA: progreso de scroll, glow, estela, tilt, parallax
   ============================================================ */
(() => {
  // Barra de progreso de scroll (rosa → amarillo)
  const bar = $("#scrollProgress");
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`;
  };
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll);
  onScroll();

  // Glow rosa/amarillo que sigue al cursor en la sección Rabbit Fuel
  const fuel = $("#fuel");
  fuel.addEventListener("mousemove", e => {
    const r = fuel.getBoundingClientRect();
    fuel.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100).toFixed(1) + "%");
    fuel.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100).toFixed(1) + "%");
  });

  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (reducedMotion || !fine) return;

  // Estela de píxeles tras el cursor
  const TRAIL = ["#ff4fd8", "#ffd400", "#e6e6ff"];
  let lastTrail = 0, trailCount = 0;
  addEventListener("mousemove", e => {
    const now = performance.now();
    if (now - lastTrail < 40 || trailCount > 32) return;
    lastTrail = now; trailCount++;
    const px = document.createElement("span");
    px.className = "trail-px";
    px.style.left = e.clientX + (Math.random() * 12 - 6) + "px";
    px.style.top = e.clientY + (Math.random() * 12 - 6) + "px";
    px.style.background = TRAIL[Math.random() * TRAIL.length | 0];
    document.body.appendChild(px);
    px.addEventListener("animationend", () => { px.remove(); trailCount--; });
  }, { passive: true });

  // Tilt 3D de las cards siguiendo el cursor (delegado: sobrevive re-renders)
  const grid = $("#dropGrid");
  grid.addEventListener("mousemove", e => {
    const card = e.target.closest(".pcard");
    if (!card) return;
    const r = card.getBoundingClientRect();
    const rx = ((e.clientY - r.top) / r.height - .5) * -7;
    const ry = ((e.clientX - r.left) / r.width - .5) * 7;
    card.style.transform = `perspective(900px) translate(-4px,-4px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
  });
  grid.addEventListener("mouseout", e => {
    const card = e.target.closest(".pcard");
    if (card && !card.contains(e.relatedTarget)) card.style.transform = "";
  });

  // Parallax de scroll: collage del hero + lata de la sección fuel
  const heroVisual = $("#heroVisual");
  const fuelVisual = $(".fuel-visual");
  fuelVisual.style.transitionProperty = "opacity";   // el reveal conserva el fade; el transform es del parallax
  (function loop() {
    const sy = scrollY;
    if (sy < innerHeight * 1.3) heroVisual.style.translate = `0 ${(sy * -0.1).toFixed(1)}px`;
    const fr = fuelVisual.getBoundingClientRect();
    if (fr.top < innerHeight && fr.bottom > 0) {
      const c = (fr.top + fr.height / 2 - innerHeight / 2) / innerHeight;
      fuelVisual.style.transform = `translateY(${(c * 30).toFixed(1)}px) rotate(${(c * -1.8).toFixed(2)}deg)`;
    }
    requestAnimationFrame(loop);
  })();
})();

/* ============================================================
   APLICAR IDIOMA
   ============================================================ */
let langBooted = false;
function applyLang() {
  document.documentElement.lang = LANG;
  document.title = t("meta.title");
  $$("[data-i18n]").forEach(el => { el.textContent = t(el.dataset.i18n); });
  $$("[data-i18n-html]").forEach(el => { el.innerHTML = t(el.dataset.i18nHtml); });
  $$("[data-i18n-ph]").forEach(el => { el.placeholder = t(el.dataset.i18nPh); });
  $$("[data-i18n-aria]").forEach(el => { el.setAttribute("aria-label", t(el.dataset.i18nAria)); });
  $$("[data-lang-opt]").forEach(el => el.classList.toggle("active", el.dataset.langOpt === LANG));
  $$(".marquee-track span").forEach(sp => { sp.innerHTML = t("marquee.text").replaceAll("▸", "<i>▸</i>") + "&nbsp;"; });
  splitTitle();

  renderGrid(langBooted);      // primera vez con reveal animado; después instantáneo
  Cart.render();
  Auth.paintNav();
  ProductModal.refreshLang();
  langBooted = true;
}

function setLang(l) {
  if (l === LANG) return;
  LANG = l;
  try { localStorage.setItem(LANG_KEY, l); } catch {}
  applyLang();
}
$("#btnLang").addEventListener("click", () => setLang(LANG === "es" ? "en" : "es"));
$("#btnLangM").addEventListener("click", () => setLang(LANG === "es" ? "en" : "es"));

applyLang();
