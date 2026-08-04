/* ============================================================
   SNACKRABBIT — DROP 001 · app.js
   i18n ES/EN · carrito + login demo (localStorage) · UI
   ============================================================ */
"use strict";

/* La dirección de contacto sale del mismo archivo que las páginas legales, no
   escrita a mano aquí: es un dato que tiene que decir lo mismo en los cuatro
   sitios donde aparece. Lo empaqueta Vite, así que no viaja nada de más. */
import { EMPRESA } from "../data/empresa";
import { UMBRALES_RANGO } from "../data/rangos";
const CONTACTO = EMPRESA.email;

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
    "aria.cart": "Carrito",
    "aria.email": "Correo",
    "aria.help": "Ayuda",
    "aria.legal": "Legal",
    "aria.nav": "Navegación principal",
    "aria.menu": "Menú",
    "aria.scroll": "Bajar",
    "aria.shop": "Tienda",
    "nav.drop": "EL DROP",
    "nav.manifesto": "MANIFIESTO",
    "nav.burrow": "LA MADRIGUERA",
    "nav.checking": "…",
    "nav.login": "LOGIN",
    "nav.hello": "HOLA, {name}",
    "hero.kicker": "@SNACKRABBIT.TV PRESENTA",
    "hero.title1": "SIGUE AL",
    "hero.title2": "CONEJO.",
    "hero.sub": "La curiosidad te trajo hasta aquí.<br>La madriguera hace el resto.",
    "hero.cta1": "VER EL DROP ▸",
    "a11y.skip": "Saltar al contenido",
    "hero.cta2": "VER RABBIT FUEL",
    "hero.meta": "SIN AZÚCAR · SIN TAURINA · MATE + GUARANÁ · SALE EN 24H",
    "hero.tape": "100% REAL ▸ SIN COSAS RARAS ▸ SIN AZÚCAR ▸ 100% REAL ▸ SIN COSAS RARAS ▸ SIN AZÚCAR ▸ ",
    "hero.stamp": "100% REAL · SIN COSAS RARAS · 100% REAL · ",
    "hero.badge": "CERO<br>AZÚCAR",
    "marquee.text": "DROP 001 · YA DISPONIBLE ▸ FOCUS · PLAY · REPEAT ▸ SALE EN 24H ▸ MATE + GUARANÁ ▸ CERO TAURINA ▸ SIN AZÚCAR ▸ 100% REAL ▸ SIN COSAS RARAS ▸ ",
    "stats.followers": "SEGUIDORES",
    "stats.views": "VIEWS TOTALES",
    "stats.products": "PRODUCTOS",
    "stats.shipping": "ENVÍO EXPRESS",
    "drop.kicker": "DROP 001 — YA DISPONIBLE",
    "drop.title": "COSAS QUE<br><em>NO NECESITAS.</em>",
    "drop.sub": "Pero vas a querer igual: si no lo usaríamos nosotros, no estaría aquí.",
    "card.add": "AÑADIR +",
    "card.ship": "SALE EN 24H",
    "card.always": "SIEMPRE DISPONIBLE",
    "card.view": "Ver {name}",
    "card.colorGroup": "Color de {name}",
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
    "pn.title": "MI MADRIGUERA",
    "pn.cards": "TU AÑO",
    "pn.card000": "+ CARTA 000 · FUNDADOR",
    "pn.cardsEmpty": "TUS CARTAS APARECEN AQUÍ SEGÚN SE ENVÍAN, UNA AL MES. AÑO UNO EMPIEZA EN ENERO.",
    "pn.cardsSome": "CADA CARTA SE IMPRIME UNA VEZ. COMPLETA LAS DOCE Y EL PLUSH DEL CLUB ES TUYO.",
    "pn.rank": "TU RANGO",
    "pn.descent": "EL DESCENSO",
    "pn.cans": "LATAS",
    "pn.rankNone": "AÚN NO HAS REGISTRADO LATAS. CADA LATA LLEVARÁ UN CÓDIGO BAJO LA ANILLA.",
    "pn.rankNext": "{n} LATAS MÁS PARA {rank}",
    "pn.rankTop": "LLEGASTE AL FONDO DE LA MADRIGUERA.",
    "pn.orders": "PEDIDOS",
    "pn.ordersEmpty": "TODAVÍA NO HAY PEDIDOS. APARECERÁN AQUÍ, CON SEGUIMIENTO, CUANDO ABRA LA TIENDA.",
    "pn.member": "MEMBRESÍA",
    "pn.manageWait": "Cuando abra el club, tu suscripción se gestiona desde aquí: pausar, cambiar de nivel o cancelar. Todavía no hay ningún cobro activo.",
    "pn.manageMail": "¿Necesitas cambiar o cancelar algo? Escribe a <a href=\"mailto:{email}\">{email}</a> y lo resolvemos el mismo día.",
    "pn.memberNone": "Todavía no estás en la lista de fundadores.",
    "pn.memberPaid": "Socio · plan <b>{plan}</b>",
    "pn.memberYes": "Lista de fundadores · plan <b>{plan}</b>",
    "pn.editShip": "CAMBIAR DIRECCIÓN",
    "pn.saveShip": "GUARDAR DIRECCIÓN",
    "pn.cancelShip": "CANCELAR",
    "pn.shipSaved": "DIRECCIÓN ACTUALIZADA.",
    "pn.shipErr": "NO SE PUDO GUARDAR. INTÉNTALO OTRA VEZ.",
    "pn.ship": "ENVÍO",
    "pn.shipNone": "Aún no hay dirección guardada. Se guarda con tu primer pedido.",
    "pn.out": "CERRAR SESIÓN",
    "pn.outSure": "PULSA OTRA VEZ PARA CONFIRMAR",
    "rank.1": "LA SEÑAL",
    "rank.2": "EL RASTRO",
    "rank.3": "LA CAÍDA",
    "rank.4": "BAJO TIERRA",
    "rank.5": "EL SILENCIO",
    "rank.6": "EL CONEJO",
    "bur.kicker": "MEMBRESÍA · LA MADRIGUERA",
    "bur.title": "LA CURIOSIDAD<br><em>QUE NO SUBIMOS.</em>",
    "bur.sub": "Cada mes: tus latas y una curiosidad que nunca sale en el canal. Impresa, numerada y solo para socios.",
    "bur.yearHead": "AÑO UNO · DE ENERO A DICIEMBRE",
    "bur.yearNote": "CADA CARTA SE IMPRIME UNA VEZ. NO SE REIMPRIME.",
    "bur.prize": "COMPLETA LAS 12 CARTAS DEL AÑO Y EL PLUSH DE LA SERIE ES <b>TUYO. GRATIS.</b> HAY QUE ESTAR SUSCRITO LOS DOCE MESES: CADA CARTA LLEGA EN SU CAJA Y NO SE REIMPRIME.",
    "bur.months": "ENE,FEB,MAR,ABR,MAY,JUN,JUL,AGO,SEP,OCT,NOV,DIC",
    /* Los meses completos son para el pie de la carta destacada: ahí "ENE"
       parecería una errata. Los abreviados son para las casillas, que no dan
       para más. */
    "bur.monthsFull": "ENERO,FEBRERO,MARZO,ABRIL,MAYO,JUNIO,JULIO,AGOSTO,SEPTIEMBRE,OCTUBRE,NOVIEMBRE,DICIEMBRE",
    "bur.cardCap": "{mes} · CARTA {n} — EL DORSO SOLO EXISTE EN LA CAJA",
    "bur.cardAlt": "Carta {n} de La Madriguera",
    /* No "AGOTADA": agotado suena a que puede reponerse, y la regla del club es
       justo la contraria. Enterrada es definitivo, y además es el idioma de la
       madriguera. */
    "bur.gone": "ENTERRADA",
    "bur.per": "/MES",
    "bur.t1name": "CURIOSO",
    "bur.t1f1": "8 LATAS (2 PACKS ×4)",
    "bur.t1f2": "CARTA DEL MES NUMERADA",
    "bur.t1f3": "STICKER EXCLUSIVO",
    "bur.t1f4": "ENVÍO INCLUIDO",
    "bur.pick1": "ELEGIR CURIOSO",
    "bur.best": "MEJOR VALOR",
    "bur.t2name": "CAVADOR",
    "bur.t2f1": "16 LATAS (4 PACKS ×4)",
    "bur.t2f2": "CARTA FOIL — TIRADA MÁS CORTA",
    "bur.t2f3": "STICKER EXCLUSIVO",
    "bur.t2f4": "DROPS NUEVOS 48H ANTES",
    "bur.t2f5": "10% EN TODA LA TIENDA",
    "bur.pick2": "ELEGIR CAVADOR",
    "bur.annual": "PLAN ANUAL: 319 $ CURIOSO · 539 $ CAVADOR — PAGAS 11 MESES, RECIBES 12, Y EL PIN «AÑO UNO». ES LA ÚNICA FORMA DE ASEGURAR LAS DOCE CARTAS.",
    "bur.foundTitle": "LOS PRIMEROS 100",
    "bur.foundText": "Los 100 primeros socios reciben la carta 000 —que no se vuelve a emitir— y su nombre en el Muro de la Madriguera.",
    "bur.cta": "ENTRAR EN LA LISTA ▸",
    "bur.ctaIn": "ESTÁS EN LA LISTA ✓",
    "bur.note": "TODAVÍA NO COBRAMOS NADA. TE ESCRIBIMOS A TI PRIMERO CUANDO ABRAMOS.",
    "bur.noteIn": "GUARDADO EN TU CUENTA. TE AVISAMOS EN {email} ANTES DE ABRIR.",
    "bur.sel": "PLAN ELEGIDO: {tier}",
    "bur.needAcc": "CREA TU CUENTA PARA GUARDAR TU PLAZA",
    "bur.joined": "★ ESTÁS EN LA LISTA DE LA MADRIGUERA",
    "bur.errSave": "NO PUDIMOS GUARDAR TU PLAZA. INTÉNTALO OTRA VEZ.",
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
    "faq.a2": "THE ZOOMIES mide 100×50 cm, tamaño gimnasio clásico, y viene en blanco, rosa y negro. THE LOOKOUT es tamaño escritorio (~20 cm): cabe entre el teclado y la lata sin estorbar.",
    "faq.q3": "¿PUEDO DEVOLVER ALGO?",
    "faq.a3": "Sí: 30 días para textil y plush sin usar con etiqueta. Rabbit Fuel no admite devolución una vez abierto el pack (por razones obvias).",
    "faq.q4": "¿QUÉ LLEVA EXACTAMENTE RABBIT FUEL?",
    "faq.a4": "Agua carbonatada, extracto de yerba mate, extracto de guaraná, vitaminas del grupo B y electrolitos. Sin azúcar, sin taurina, vegana. 90 kcal por lata.",
    "faq.q5": "¿EL PLUSH ES OFICIAL?",
    "faq.a5": "Sí. Está basado en el logo pixel de Rabbit Fuel, con bordados de alta calidad y etiqueta oficial. Disponible en blanco y en negro.",
    "faq.q6": "¿HABRÁ DROP 002?",
    "faq.a6": "Sí, pero no diremos cuándo. Únete a La Madriguera y te enterarás antes que nadie.",
    "news.title": "ÚNETE A<br>LA LISTA",
    "news.sub": "Un email al mes: drops, curiosidades y cero spam.",
    "news.ph": "TU@EMAIL.COM",
    "news.btn": "SUSCRIBIRME ▸",
    "news.ok": "★ ESTÁS DENTRO. REVISA TU BANDEJA.",
    "news.err": "✕ ESE EMAIL NO PARECE UN EMAIL.",
    "news.sending": "ENVIANDO…",
    "news.already": "★ YA ESTABAS EN LA LISTA. TRANQUILO.",
    "news.fail": "✕ NO PUDIMOS APUNTARTE. INTÉNTALO EN UN RATO.",
    "foot.tag": "Curiosidades virales desde 2026.<br>Ahora también en objetos.",
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
    "news.legal": "Te das de baja de un clic, cuando quieras. Mira nuestra <a href=\"/privacy\">política de privacidad</a>.",
    "auth.legal": "Al crear la cuenta aceptas nuestros <a href=\"/terms\">términos</a> y la <a href=\"/privacy\">política de privacidad</a>.",
    "bur.legal1": "29 $/mes. Se renueva hasta que canceles. Hoy no se cobra nada.",
    "bur.legal2": "49 $/mes. Se renueva hasta que canceles. Hoy no se cobra nada.",
    "auth.forgot": "¿OLVIDASTE TU CONTRASEÑA?",
    "auth.backIn": "← VOLVER A ENTRAR",
    "auth.lostIntro": "Escribe tu correo y te mandamos un código para poner una contraseña nueva.",
    "auth.newPass": "CONTRASEÑA NUEVA",
    "auth.submitLost": "MÁNDAME UN CÓDIGO ▸",
    "auth.submitReset": "GUARDAR CONTRASEÑA ▸",
    "auth.resetOk": "CONTRASEÑA CAMBIADA. YA ESTÁS DENTRO.",
    "auth.passPh": "Mínimo 8 caracteres",
    "auth.name": "NOMBRE",
    "auth.namePh": "Tu nombre",
    "auth.submitIn": "ENTRAR ▸",
    "auth.submitUp": "CREAR CUENTA ▸",
    "auth.note": "ACCESO SEGURO · NUNCA VEMOS TU CONTRASEÑA.",
    "auth.code": "CÓDIGO DE VERIFICACIÓN",
    "auth.codeSent": "Te enviamos un código de 6 dígitos a <strong>{email}</strong>.",
    "auth.submitCode": "VERIFICAR ▸",
    "auth.resend": "REENVIAR CÓDIGO",
    "auth.resent": "CÓDIGO REENVIADO ▸",
    "auth.errCode": "CÓDIGO INCORRECTO O CADUCADO.",
    "auth.errWeakPass": "CONTRASEÑA DEMASIADO DÉBIL O FILTRADA. PRUEBA OTRA.",
    "auth.errNet": "NO HAY CONEXIÓN CON EL SERVIDOR. INTÉNTALO DE NUEVO.",
    "auth.errTooMany": "DEMASIADOS INTENTOS. ESPERA UN MINUTO Y VUELVE A PROBAR.",
    "auth.errConfig": "ESTO ES COSA NUESTRA, NO TUYA. ESCRÍBENOS Y LO ARREGLAMOS.",
    "auth.outErr": "NO SE PUDO CERRAR LA SESIÓN. SIGUES DENTRO.",
    "auth.errGeneric": "ALGO SALIÓ MAL. INTÉNTALO DE NUEVO.",
    "auth.loading": "CONECTANDO…",
    "ck.title": "ENVÍO",
    "ck.sub": "¿Dónde te lo lleva el conejo?",
    "ck.name": "NOMBRE COMPLETO",
    "ck.email": "EMAIL",
    "ck.phone": "TELÉFONO",
    "ck.address": "DIRECCIÓN",
    "ck.city": "CIUDAD",
    "ck.zip": "CÓDIGO POSTAL",
    "ck.country": "PAÍS",
    "ck.notes": "INDICACIONES DE ENTREGA (OPCIONAL)",
    "ck.submit": "CONFIRMAR PEDIDO ▸",
    "ck.note": "DEMO — NO SE COBRA NADA.",
    "ck.noteSaved": "GUARDAMOS TUS DATOS PARA LA PRÓXIMA COMPRA · DEMO, NO SE COBRA NADA.",
    "ck.shipFree": "ENVÍO GRATIS · SUPERAS LOS {n} $",
    "ck.shipAdd": "EL ENVÍO SE CALCULA EN EL PASO DEL PAGO, ANTES DE COBRARTE.",
    "ck.legal": "Al confirmar el pedido aceptas nuestros <a href=\"/terms\">términos de venta</a> y la <a href=\"/returns\">política de devoluciones</a>.",
    "ck.errRequired": "COMPLETA LOS CAMPOS OBLIGATORIOS.",
    "ck.errEmail": "ESE CORREO NO PARECE VÁLIDO. AHÍ TE MANDAMOS EL SEGUIMIENTO.",
    "ck.errPhone": "ESE TELÉFONO NO PARECE VÁLIDO.",
    "auth.errMissing": "TU CUENTA DE CLERK PIDE CAMPOS QUE NO ENVIAMOS ({fields}). DESACTÍVALOS EN EL PANEL.",
    "auth.errName": "PON UN NOMBRE (MÍN. 2 LETRAS).",
    "auth.errEmail": "ESE EMAIL NO PARECE UN EMAIL.",
    "auth.errPass": "CONTRASEÑA: MÍNIMO 8 CARACTERES.",
    "auth.errExists": "YA EXISTE UNA CUENTA CON ESE EMAIL.",
    "auth.errBad": "EMAIL O CONTRASEÑA INCORRECTOS.",
    "auth.welcome": "BIENVENIDO A LA MADRIGUERA, {name} ▸",
    "auth.back": "HOLA DE NUEVO, {name} ▸",
    "auth.out": "SESIÓN CERRADA. VUELVE PRONTO ▸",
    "auth.logoutConfirm": "¿Cerrar sesión de {name}?",
    "pm.qty": "CANTIDAD",
    "pm.add": "AÑADIR AL CARRITO ▸",
    "pm.ship": "SALE EN 24H · DEVOLUCIONES 30 DÍAS · PAGO SEGURO",
    "cart.title": "TU CARRITO",
    "cart.shipFrom": "ENVÍO GRATIS DESDE $60",
    "cart.need": "TE FALTAN {amt} PARA ENVÍO GRATIS",
    "cart.free": "★ ENVÍO GRATIS DESBLOQUEADO",
    "cart.empty": "TU CARRITO ESTÁ VACÍO.<br>EL CONEJO ESTÁ ESPERANDO.",
    "cart.checkout": "TRAMITAR PEDIDO ▸",
    /* No decir "impuestos incluidos": con entidad en EE.UU. y Stripe Tax, el
       impuesto se SUMA en la pantalla de pago. Prometer lo contrario aquí deja
       al cliente viendo un total mayor del anunciado justo al pagar, y además
       contradice los Términos, que dicen que se calculan al pagar. */
    "cart.less": "Quitar una unidad de {name}",
    "cart.more": "Añadir una unidad de {name}",
    "cart.del": "Quitar {name} del carrito",
    "cart.max": "MÁXIMO {n} POR LÍNEA.",
    "ck.phonePh": "+34 600 000 000",
    "cart.note": "IMPUESTOS Y ENVÍO SE CALCULAN AL PAGAR",
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
    "aria.cart": "Cart",
    "aria.email": "Email",
    "aria.help": "Help",
    "aria.legal": "Legal",
    "aria.nav": "Main navigation",
    "aria.menu": "Menu",
    "aria.scroll": "Scroll down",
    "aria.shop": "Shop",
    "nav.drop": "THE DROP",
    "nav.manifesto": "MANIFESTO",
    "nav.burrow": "THE BURROW",
    "nav.checking": "…",
    "nav.login": "LOGIN",
    "nav.hello": "HI, {name}",
    "hero.kicker": "@SNACKRABBIT.TV PRESENTS",
    "hero.title1": "FOLLOW THE",
    "hero.title2": "RABBIT.",
    "hero.sub": "Curiosity got you this far.<br>The burrow does the rest.",
    "hero.cta1": "SHOP THE DROP ▸",
    "a11y.skip": "Skip to content",
    "hero.cta2": "SEE RABBIT FUEL",
    "hero.meta": "ZERO SUGAR · ZERO TAURINE · MATE + GUARANÁ · SHIPS IN 24H",
    "hero.tape": "100% REAL ▸ NO WEIRD STUFF ▸ ZERO SUGAR ▸ 100% REAL ▸ NO WEIRD STUFF ▸ ZERO SUGAR ▸ ",
    "hero.stamp": "100% REAL · NO WEIRD STUFF · 100% REAL · ",
    "hero.badge": "ZERO<br>SUGAR",
    "marquee.text": "DROP 001 · OUT NOW ▸ FOCUS · PLAY · REPEAT ▸ SHIPS IN 24H ▸ MATE + GUARANÁ ▸ ZERO TAURINE ▸ ZERO SUGAR ▸ 100% REAL ▸ NO WEIRD STUFF ▸ ",
    "stats.followers": "FOLLOWERS",
    "stats.views": "TOTAL VIEWS",
    "stats.products": "PRODUCTS",
    "stats.shipping": "EXPRESS SHIPPING",
    "drop.kicker": "DROP 001 — OUT NOW",
    "drop.title": "STUFF YOU<br><em>DON'T NEED.</em>",
    "drop.sub": "You'll want it anyway: if we wouldn't use it ourselves, it wouldn't be here.",
    "card.add": "ADD +",
    "card.ship": "SHIPS IN 24H",
    "card.always": "ALWAYS IN STOCK",
    "card.view": "View {name}",
    "card.colorGroup": "{name} colour",
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
    "pn.title": "MY BURROW",
    "pn.cards": "YOUR YEAR",
    "pn.card000": "+ CARD 000 · FOUNDER",
    "pn.cardsEmpty": "YOUR CARDS SHOW UP HERE AS THEY SHIP, ONE A MONTH. YEAR ONE STARTS IN JANUARY.",
    "pn.cardsSome": "EACH CARD IS PRINTED ONCE. COMPLETE THE TWELVE AND THE CLUB PLUSH IS YOURS.",
    "pn.rank": "YOUR RANK",
    "pn.descent": "THE DESCENT",
    "pn.cans": "CANS",
    "pn.rankNone": "NO CANS REGISTERED YET. EVERY CAN WILL CARRY A CODE UNDER THE TAB.",
    "pn.rankNext": "{n} MORE CANS TO {rank}",
    "pn.rankTop": "YOU REACHED THE BOTTOM OF THE BURROW.",
    "pn.orders": "ORDERS",
    "pn.ordersEmpty": "NO ORDERS YET. THEY SHOW UP HERE, WITH TRACKING, ONCE THE STORE OPENS.",
    "pn.member": "MEMBERSHIP",
    "pn.manageWait": "When the club opens, your membership is managed right here: pause, change tier or cancel. There is no active charge yet.",
    "pn.manageMail": "Need to change or cancel something? Write to <a href=\"mailto:{email}\">{email}</a> and we sort it out the same day.",
    "pn.memberNone": "You are not on the founder list yet.",
    "pn.memberPaid": "Member · plan <b>{plan}</b>",
    "pn.memberYes": "Founder list · plan <b>{plan}</b>",
    "pn.editShip": "CHANGE ADDRESS",
    "pn.saveShip": "SAVE ADDRESS",
    "pn.cancelShip": "CANCEL",
    "pn.shipSaved": "ADDRESS UPDATED.",
    "pn.shipErr": "COULD NOT SAVE. TRY AGAIN.",
    "pn.ship": "SHIPPING",
    "pn.shipNone": "No address saved yet. It gets saved with your first order.",
    "pn.out": "LOG OUT",
    "pn.outSure": "TAP AGAIN TO CONFIRM",
    "rank.1": "THE SIGNAL",
    "rank.2": "THE TRAIL",
    "rank.3": "THE FALL",
    "rank.4": "UNDERGROUND",
    "rank.5": "THE SILENCE",
    "rank.6": "THE RABBIT",
    "bur.kicker": "MEMBERSHIP · THE BURROW",
    "bur.title": "THE CURIOSITY<br><em>WE DON'T POST.</em>",
    "bur.sub": "Every month: your cans and one curiosity that never makes it to the channel. Printed, numbered, members only.",
    "bur.yearHead": "YEAR ONE · JANUARY TO DECEMBER",
    "bur.yearNote": "EACH CARD IS PRINTED ONCE. NEVER REPRINTED.",
    "bur.prize": "COLLECT ALL 12 CARDS OF THE YEAR AND THE SERIES PLUSH IS <b>YOURS. FREE.</b> IT TAKES ALL TWELVE MONTHS: EACH CARD ARRIVES IN ITS BOX AND IS NEVER REPRINTED.",
    "bur.months": "JAN,FEB,MAR,APR,MAY,JUN,JUL,AUG,SEP,OCT,NOV,DEC",
    "bur.monthsFull": "JANUARY,FEBRUARY,MARCH,APRIL,MAY,JUNE,JULY,AUGUST,SEPTEMBER,OCTOBER,NOVEMBER,DECEMBER",
    "bur.cardCap": "{mes} · CARD {n} — THE BACK ONLY EXISTS IN THE BOX",
    "bur.cardAlt": "Card {n} of The Burrow",
    "bur.gone": "BURIED",
    "bur.per": "/MONTH",
    "bur.t1name": "CURIOUS",
    "bur.t1f1": "8 CANS (2 PACKS ×4)",
    "bur.t1f2": "NUMBERED CARD OF THE MONTH",
    "bur.t1f3": "EXCLUSIVE STICKER",
    "bur.t1f4": "SHIPPING INCLUDED",
    "bur.pick1": "CHOOSE CURIOUS",
    "bur.best": "BEST VALUE",
    "bur.t2name": "DIGGER",
    "bur.t2f1": "16 CANS (4 PACKS ×4)",
    "bur.t2f2": "FOIL CARD — SHORTER PRINT RUN",
    "bur.t2f3": "EXCLUSIVE STICKER",
    "bur.t2f4": "NEW DROPS 48H EARLY",
    "bur.t2f5": "10% OFF THE WHOLE STORE",
    "bur.pick2": "CHOOSE DIGGER",
    "bur.annual": "ANNUAL PLAN: $319 CURIOUS · $539 DIGGER — PAY 11 MONTHS, GET 12, PLUS THE \"YEAR ONE\" PIN. IT IS THE ONLY WAY TO GUARANTEE ALL TWELVE CARDS.",
    "bur.foundTitle": "THE FIRST 100",
    "bur.foundText": "The first 100 members get card 000 — never issued again — and their name on the Burrow Wall.",
    "bur.cta": "JOIN THE LIST ▸",
    "bur.ctaIn": "YOU'RE ON THE LIST ✓",
    "bur.note": "WE'RE NOT CHARGING YET. YOU GET WRITTEN TO FIRST WHEN THE DOORS OPEN.",
    "bur.noteIn": "SAVED TO YOUR ACCOUNT. WE'LL WRITE TO {email} BEFORE WE OPEN.",
    "bur.sel": "PLAN PICKED: {tier}",
    "bur.needAcc": "CREATE YOUR ACCOUNT TO HOLD YOUR SPOT",
    "bur.joined": "★ YOU'RE ON THE BURROW LIST",
    "bur.errSave": "WE COULDN'T SAVE YOUR SPOT. TRY AGAIN.",
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
    "faq.a2": "THE ZOOMIES towel is 100×50 cm, classic gym size, and comes in white, pink and black. THE LOOKOUT is desk-sized (~20 cm): it fits between your keyboard and your can without getting in the way.",
    "faq.q3": "CAN I RETURN SOMETHING?",
    "faq.a3": "Yes: 30 days for unused apparel and plush with tags on. Rabbit Fuel can't be returned once the pack is opened (for obvious reasons).",
    "faq.q4": "WHAT EXACTLY IS IN RABBIT FUEL?",
    "faq.a4": "Carbonated water, yerba mate extract, guaraná extract, B vitamins and electrolytes. Zero sugar, zero taurine, vegan. 90 kcal per can.",
    "faq.q5": "IS THE PLUSH OFFICIAL?",
    "faq.a5": "Yes. It's based on the official Rabbit Fuel pixel logo, with high-quality embroidery and the official tag. Available in white and black.",
    "faq.q6": "WILL THERE BE A DROP 002?",
    "faq.a6": "Yes, but we won't say when. Join The Burrow and you'll know before anyone else.",
    "news.title": "JOIN<br>THE LIST",
    "news.sub": "One email a month: drops, curiosities, zero spam.",
    "news.ph": "YOU@EMAIL.COM",
    "news.btn": "SUBSCRIBE ▸",
    "news.ok": "★ YOU'RE IN. CHECK YOUR INBOX.",
    "news.err": "✕ THAT EMAIL DOESN'T LOOK LIKE AN EMAIL.",
    "news.sending": "SENDING…",
    "news.already": "★ YOU WERE ALREADY ON THE LIST. RELAX.",
    "news.fail": "✕ WE COULD NOT ADD YOU. TRY AGAIN IN A BIT.",
    "foot.tag": "Viral curiosities since 2026.<br>Now also in objects.",
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
    "news.legal": "One click to leave, any time. See our <a href=\"/privacy\">privacy policy</a>.",
    "auth.legal": "Creating an account means you accept our <a href=\"/terms\">terms</a> and <a href=\"/privacy\">privacy policy</a>.",
    "bur.legal1": "$29/month. Renews until you cancel. Nothing is charged today.",
    "bur.legal2": "$49/month. Renews until you cancel. Nothing is charged today.",
    "auth.forgot": "FORGOT YOUR PASSWORD?",
    "auth.backIn": "← BACK TO SIGN IN",
    "auth.lostIntro": "Enter your email and we will send you a code to set a new password.",
    "auth.newPass": "NEW PASSWORD",
    "auth.submitLost": "SEND ME A CODE ▸",
    "auth.submitReset": "SAVE PASSWORD ▸",
    "auth.resetOk": "PASSWORD CHANGED. YOU'RE IN.",
    "auth.passPh": "At least 8 characters",
    "auth.name": "NAME",
    "auth.namePh": "Your name",
    "auth.submitIn": "SIGN IN ▸",
    "auth.submitUp": "CREATE ACCOUNT ▸",
    "auth.note": "SECURE SIGN-IN · WE NEVER SEE YOUR PASSWORD.",
    "auth.code": "VERIFICATION CODE",
    "auth.codeSent": "We sent a 6-digit code to <strong>{email}</strong>.",
    "auth.submitCode": "VERIFY ▸",
    "auth.resend": "RESEND CODE",
    "auth.resent": "CODE RESENT ▸",
    "auth.errCode": "WRONG OR EXPIRED CODE.",
    "auth.errWeakPass": "PASSWORD TOO WEAK OR FOUND IN A BREACH. TRY ANOTHER.",
    "auth.errNet": "CAN'T REACH THE SERVER. PLEASE TRY AGAIN.",
    "auth.errTooMany": "TOO MANY TRIES. WAIT A MINUTE AND TRY AGAIN.",
    "auth.errConfig": "THIS ONE IS ON US, NOT YOU. WRITE TO US AND WE FIX IT.",
    "auth.outErr": "COULD NOT SIGN OUT. YOU ARE STILL IN.",
    "auth.errGeneric": "SOMETHING WENT WRONG. PLEASE TRY AGAIN.",
    "auth.loading": "CONNECTING…",
    "ck.title": "SHIPPING",
    "ck.sub": "Where should the rabbit deliver?",
    "ck.name": "FULL NAME",
    "ck.email": "EMAIL",
    "ck.phone": "PHONE",
    "ck.address": "ADDRESS",
    "ck.city": "CITY",
    "ck.zip": "POSTAL CODE",
    "ck.country": "COUNTRY",
    "ck.notes": "DELIVERY NOTES (OPTIONAL)",
    "ck.submit": "PLACE ORDER ▸",
    "ck.note": "DEMO — NO PAYMENT IS TAKEN.",
    "ck.noteSaved": "WE SAVE YOUR DETAILS FOR NEXT TIME · DEMO, NO PAYMENT IS TAKEN.",
    "ck.shipFree": "FREE SHIPPING · YOU'RE OVER ${n}",
    "ck.shipAdd": "SHIPPING IS CALCULATED AT THE PAYMENT STEP, BEFORE YOU ARE CHARGED.",
    "ck.legal": "By placing the order you accept our <a href=\"/terms\">terms of sale</a> and <a href=\"/returns\">returns policy</a>.",
    "ck.errRequired": "PLEASE FILL IN THE REQUIRED FIELDS.",
    "ck.errEmail": "THAT EMAIL DOESN'T LOOK VALID. IT IS WHERE YOUR TRACKING GOES.",
    "ck.errPhone": "THAT PHONE NUMBER DOESN'T LOOK VALID.",
    "auth.errMissing": "YOUR CLERK APP REQUIRES FIELDS WE DO NOT SEND ({fields}). TURN THEM OFF IN THE DASHBOARD.",
    "auth.errName": "ENTER A NAME (MIN. 2 LETTERS).",
    "auth.errEmail": "THAT EMAIL DOESN'T LOOK LIKE AN EMAIL.",
    "auth.errPass": "PASSWORD: AT LEAST 8 CHARACTERS.",
    "auth.errExists": "AN ACCOUNT WITH THAT EMAIL ALREADY EXISTS.",
    "auth.errBad": "WRONG EMAIL OR PASSWORD.",
    "auth.welcome": "WELCOME TO THE BURROW, {name} ▸",
    "auth.back": "WELCOME BACK, {name} ▸",
    "auth.out": "SIGNED OUT. COME BACK SOON ▸",
    "auth.logoutConfirm": "Sign out {name}?",
    "pm.qty": "QUANTITY",
    "pm.add": "ADD TO CART ▸",
    "pm.ship": "SHIPS IN 24H · 30-DAY RETURNS · SECURE PAYMENT",
    "cart.title": "YOUR CART",
    "cart.shipFrom": "FREE SHIPPING FROM $60",
    "cart.need": "{amt} AWAY FROM FREE SHIPPING",
    "cart.free": "★ FREE SHIPPING UNLOCKED",
    "cart.empty": "YOUR CART IS EMPTY.<br>THE BUNNY IS WAITING.",
    "cart.checkout": "CHECKOUT ▸",
    "cart.less": "Remove one {name}",
    "cart.more": "Add one {name}",
    "cart.del": "Remove {name} from the cart",
    "cart.max": "MAXIMUM {n} PER LINE.",
    "ck.phonePh": "+1 555 000 0000",
    "cart.note": "TAXES AND SHIPPING CALCULATED AT CHECKOUT",
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
      es: "250 ML · 80 MG DE CAFEÍNA · MATE + GUARANÁ · SIN TAURINA · VEGANA · SIN AZÚCAR · 90 KCAL",
      en: "250 ML · 80 MG CAFFEINE · MATE + GUARANÁ · ZERO TAURINE · VEGAN · ZERO SUGAR · 90 KCAL"
    },
    sizes: ["PACK ×4", "PACK ×12"],
    sizeLabel: { es: "PACK", en: "PACK" },
    sizePrices: { "PACK ×4": 16, "PACK ×12": 42 },
    img: "/assets/can-cutout.webp",
    /* Una sola galería: la lata no tiene variantes, solo ángulos */
    views: ["/assets/can-cutout.webp", "/assets/can-top.webp", "/assets/can-back.webp",
            "/assets/can-label.webp", "/assets/can-mood.webp"],
    imgScale: 1
  },
  {
    id: "plush",
    num: "DROP 001 · Nº 02",
    /* El nombre sale de una conducta real: mientras la madriguera come, un
       conejo se queda erguido vigilando. No come, no juega — mira. Que es
       exactamente lo que hace un peluche en tu escritorio. */
    name: "THE LOOKOUT",
    price: 35,
    priceNote: "PLUSH",
    desc: {
      es: "Mientras la madriguera come, un conejo se queda erguido y vigila. No come, no juega: mira. Este es ese. Pixel, ultrasuave y bordado, en tu escritorio.",
      en: "While the warren feeds, one rabbit sits up and keeps watch. It does not eat, it does not play: it watches. This is that one. Pixel, ultra soft, embroidered, on your desk."
    },
    specs: {
      es: "DISEÑO PIXEL · MATERIAL ULTRA SUAVE · DETALLES BORDADOS · ETIQUETA OFICIAL",
      en: "PIXEL DESIGN · ULTRA SOFT MATERIAL · EMBROIDERED DETAILS · OFFICIAL TAG"
    },
    colors: ["#f2f2f7", "#17171b"],
    colorNames: ["BLANCO", "NEGRO"],
    imgByColor: { BLANCO: "/assets/plush-cutout.webp", NEGRO: "/assets/plush-black-cutout.webp" },
    viewsByColor: {
      BLANCO: ["/assets/plush-cutout.webp", "/assets/plush-white-34.webp",
               "/assets/plush-white-side.webp", "/assets/plush-white-back.webp"],
      NEGRO:  ["/assets/plush-black-cutout.webp", "/assets/plush-black-34.webp",
               "/assets/plush-black-side.webp", "/assets/plush-black-back.webp"]
    },
    sizes: ["ÚNICA"],
    sizeLabel: { es: "TAMAÑO", en: "SIZE" },
    img: "/assets/plush-cutout.webp",
    imgScale: .74,  // es casi cuadrado: sin esto domina la tarjeta
    viewScale: 1    // las vistas de galería ya vienen encuadradas
  },
  {
    id: "gym-towel",
    num: "DROP 001 · Nº 03",
    /* "Zoomies" tiene nombre científico: frenetic random activity period. Le
       pasa a cualquier animal que de pronto no puede con su propia energía —y
       a ti en el gimnasio—. Es una curiosidad de verdad, que es justo lo que
       vende esta marca, y encima da gracia en una toalla. */
    name: "THE ZOOMIES",
    price: 29,
    priceNote: "TOWEL",
    desc: {
      es: "Tiene nombre científico: frenetic random activity period. Le pasa a cualquier animal que de pronto no puede con su propia energía. A ti te pasa en el gimnasio. Microfibra, seca rápido, no pesa nada.",
      en: "It has a scientific name: frenetic random activity period. It happens to any animal that suddenly cannot contain its own energy. Yours happens at the gym. Microfibre, dries fast, weighs nothing."
    },
    specs: {
      es: "100×50 CM · 250 G · 80% POLIÉSTER / 20% POLIAMIDA · BORDADO PREMIUM · LAVADO EN FRÍO",
      en: "100×50 CM · 250 G · 80% POLYESTER / 20% POLYAMIDE · PREMIUM EMBROIDERY · COLD WASH"
    },
    features: [
      { es: ["ULTRA ABSORBENTE", "Se lleva el sudor al instante."],
        en: ["ULTRA ABSORBENT", "Soaks up sweat on contact."] },
      { es: ["SUAVE Y LIGERA", "Cómoda para cualquier rutina."],
        en: ["SOFT & LIGHTWEIGHT", "Comfortable for any routine."] },
      { es: ["CALIDAD QUE DURA", "Aguanta lavada tras lavada."],
        en: ["DURABLE QUALITY", "Holds up wash after wash."] },
      { es: ["TAMAÑO JUSTO", "Gimnasio, deporte y viaje."],
        en: ["PERFECT SIZE", "Gym, sports and travel."] }
    ],
    colors: ["#f2f2f7", "#d9558a", "#17171b"],
    colorNames: ["BLANCO", "ROSA", "NEGRO"],
    imgByColor: {
      BLANCO: "/assets/towel-white-cutout.webp",
      ROSA:   "/assets/towel-pink-cutout.webp",
      NEGRO:  "/assets/towel-black-cutout.webp"
    },
    /* Galería por color: producto, plegada, bordado de cerca y acabado del canto */
    viewsByColor: {
      BLANCO: ["/assets/towel-white-cutout.webp", "/assets/towel-white-fold.webp",
               "/assets/towel-white-stitch.webp", "/assets/towel-white-edge.webp"],
      ROSA:   ["/assets/towel-pink-cutout.webp", "/assets/towel-pink-fold.webp",
               "/assets/towel-pink-stitch.webp", "/assets/towel-pink-edge.webp"],
      NEGRO:  ["/assets/towel-black-cutout.webp", "/assets/towel-black-fold.webp",
               "/assets/towel-black-stitch.webp", "/assets/towel-black-edge.webp"]
    },
    sizes: ["ÚNICA"],
    sizeLabel: { es: "TAMAÑO", en: "SIZE" },
    img: "/assets/towel-white-cutout.webp",
    imgScale: 1.12,   // el lienzo nativo lleva más margen que el anterior
    viewScale: 1.06
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
    /* inert además de aria-hidden: cerrado seguía siendo tabulable, así que el
       foco se metía en un menú invisible a pantalla completa. */
    if (open) menu.removeAttribute("inert"); else menu.setAttribute("inert", "");
    document.body.style.overflow = open ? "hidden" : "";
    /* Al abrir, el foco entra en el menú; al cerrar, vuelve al botón. Sin esto
       se abría un panel a pantalla completa y el teclado seguía en la página
       de detrás. */
    if (open) setTimeout(() => $("#mobileMenu nav a")?.focus(), 120);
    else burger.focus();
  };
  burger.addEventListener("click", () => toggle(!menu.classList.contains("open")));
  $$("#mobileMenu nav a").forEach(a => a.addEventListener("click", () => toggle(false)));
  addEventListener("keydown", e => {
    if (e.key === "Escape" && menu.classList.contains("open")) toggle(false);
  });

  /* Faltaba "madriguera", que sí está en el menú: al llegar al club el navbar
     se quedaba marcando "faq" y ya no volvía a moverse. Y como el orden importa
     —gana la última sección que hayas pasado— se recorre en el orden del
     documento, no en el que estuvieran escritos aquí. */
  const secs = ["drop", "fuel", "madriguera", "historia", "faq"]
    .map(id => document.getElementById(id))
    .filter(Boolean)
    .sort((a, b) => a.offsetTop - b.offsetTop);
  const links = $$(".nav-links a");
  addEventListener("scroll", () => {
    let cur = "#top";
    secs.forEach(s => { if (scrollY >= s.offsetTop - 200) cur = "#" + s.id; });
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
  /* Los temporizadores de cierre, para poder cancelarlos.
     close() programa `hidden = true` a 280 ms para dejar acabar la transición.
     Si se reabría antes, ese temporizador disparaba DESPUÉS de open() y volvía
     a esconder el modal recién abierto: quedaba el fondo negro, el scroll
     bloqueado y nada en pantalla. Solo se salía recargando. */
  let tOcultar = null, tFondo = null;

  const ENFOCABLES = 'a[href], button:not([disabled]), input:not([disabled]), ' +
                     'select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function open(el) {
    close(true);
    clearTimeout(tOcultar); clearTimeout(tFondo);
    lastFocus = document.activeElement;
    openEl = el;
    overlay.hidden = false;
    requestAnimationFrame(() => overlay.classList.add("on"));
    el.removeAttribute("inert");
    if (el.classList.contains("cart")) {
      el.classList.add("open");
      el.setAttribute("aria-hidden", "false");
    } else {
      el.hidden = false;
      requestAnimationFrame(() => el.classList.add("on"));
    }
    document.body.style.overflow = "hidden";
    /* Se salta también LOG OUT: al abrir MY BURROW el foco caía justo ahí, y
       lo primero que ofrecía el panel a quien navega con teclado era cerrar la
       sesión. El primer campo o botón útil, nunca el que destruye algo. */
    const f = el.querySelector("input, button:not(.modal-x):not(.pn-salir)");
    if (f) setTimeout(() => f.focus(), 120);
  }

  function close(silent) {
    if (!openEl) return;
    const el = openEl;
    openEl = null;
    /* `inert` y no solo aria-hidden: aria-hidden lo esconde del lector de
       pantalla pero deja sus botones en el orden de tabulación, así que con el
       carrito cerrado el tabulador se metía dentro y el foco desaparecía de la
       vista. `inert` lo saca de las dos cosas a la vez. */
    el.setAttribute("inert", "");
    if (el.classList.contains("cart")) {
      el.classList.remove("open");
      el.setAttribute("aria-hidden", "true");
    } else {
      el.classList.remove("on");
      tOcultar = setTimeout(() => { el.hidden = true; }, 280);
    }
    if (!silent) {
      overlay.classList.remove("on");
      tFondo = setTimeout(() => { overlay.hidden = true; }, 260);
      document.body.style.overflow = "";
      if (lastFocus) lastFocus.focus();
    }
  }

  /* El foco no se escapa del modal abierto.
     Sin esto, tabulando dentro de un diálogo se salía a la página de detrás:
     el foco seguía moviéndose por enlaces que no se ven, sin forma de saber
     dónde está. Es la avería que deja fuera a quien no usa ratón. */
  addEventListener("keydown", e => {
    if (e.key !== "Tab" || !openEl) return;
    const items = $$(ENFOCABLES, openEl).filter(n => n.offsetParent !== null);
    if (!items.length) return;
    const primero = items[0], ultimo = items[items.length - 1];
    if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
    else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
    else if (!openEl.contains(document.activeElement)) { e.preventDefault(); primero.focus(); }
  });

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
    const esc = ` style="--img-scale:${p.imgScale || 1}"`;
    card.innerHTML = `
      <p class="pcard-num">${p.num}</p>
      <div class="pcard-media"><img src="${p.img}" alt="${p.name}" loading="lazy"${esc}></div>
      <div class="pcard-body">
        <h3 class="pcard-name">${p.name}</h3>
        <p class="pcard-desc">${p.desc[LANG]}</p>
        <p class="pcard-specs">${p.specs[LANG]}</p>
        <div class="pcard-tags">
          <span class="ptag">${t("card.ship")}</span><span class="ptag">${t("card.always")}</span>
        </div>
        <div class="pcard-foot">
          <div class="pcard-swatches" role="group" aria-label="${t("card.colorGroup", { name: p.name })}">
            ${(p.colors || []).map((c, ci) => `<button type="button" class="swatch${ci === 0 ? " sel" : ""}" style="background:${c}" data-color="${p.colorNames[ci]}" aria-pressed="${ci === 0}" aria-label="${colorName(p.colorNames[ci])}"></button>`).join("")}
          </div>
          <div class="pcard-buy">
            <span class="pcard-price">${money(p.price)}${p.priceNote ? `<small>${p.priceNote}</small>` : ""}</span>
            <button class="pcard-add" type="button" aria-label="${t("card.addAria", { name: p.name })}">${t("card.add")}</button>
          </div>
        </div>
      </div>`;
    /* Las muestras eligen de verdad.
       Eran <span> decorativos: se pulsara la que se pulsara, al carrito iba
       siempre colorNames[0]. Elegías la toalla negra y te llegaba la blanca.
       Como botones, además, se alcanzan con el tabulador — antes el color solo
       se podía elegir con ratón, dentro del modal. */
    const muestras = $$(".swatch", card);
    let elegido = p.colorNames && p.colorNames[0];
    muestras.forEach(b => b.addEventListener("click", e => {
      e.stopPropagation();                       // no abrir el modal al elegir
      elegido = b.dataset.color;
      muestras.forEach(o => {
        const yo = o === b;
        o.classList.toggle("sel", yo);
        o.setAttribute("aria-pressed", String(yo));
      });
    }));

    card.querySelector(".pcard-add").addEventListener("click", e => {
      e.stopPropagation();
      const size = p.sizes[Math.floor(p.sizes.length / 2 - .5)] || p.sizes[0];
      Cart.add(p.id, { size, color: p.colorNames && elegido, qty: 1 });
      confetti.burst(e.clientX, e.clientY, 26);
    });
    card.addEventListener("click", () => ProductModal.open(p.id));
    card.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); ProductModal.open(p.id); } });
    grid.appendChild(card);

    if (instant) {
      card.classList.add("in");
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
  let cur = null, qty = 1, size = null, color = null, vista = 0;

  const price = () => (cur.sizePrices && cur.sizePrices[size] != null) ? cur.sizePrices[size] : cur.price;
  const imgFor = c => (cur.imgByColor && cur.imgByColor[c]) || cur.img;
  /* Cada color puede traer su propia galería (la toalla), o el producto una sola
     galería común, o una única imagen por color. La vista es un índice: al
     cambiar de color se mantiene, así que si estás mirando el bordado y pasas a
     otro color, sigues viendo el bordado. */
  const galeria = c => (cur.viewsByColor && cur.viewsByColor[c]) || cur.views || [imgFor(c)];
  const srcNow = () => { const g = galeria(color); return g[Math.min(vista, g.length - 1)]; };

  function pintarVistas() {
    const g = galeria(color), cont = $("#pmThumbs");
    cont.innerHTML = g.length > 1
      ? g.map((v, i) => `<button class="pm-thumb" type="button" data-i="${i}" aria-label="${cur.name} ${i + 1}"><img src="${v}" alt=""></button>`).join("")
      : "";
    $$(".pm-thumb", cont).forEach(b => b.addEventListener("click", () => { vista = +b.dataset.i; paint(); }));
  }

  function paint() {
    if (vista >= galeria(color).length) vista = 0;
    $("#pmPrice").textContent = money(price() * qty);
    $("#pmQty").textContent = qty;
    /* aria-pressed además de la clase: sin él, quien usa lector de pantalla
       oía la lista de tallas pero no cuál estaba elegida. */
    $$(".pm-size", el).forEach(b => {
      const yo = b.dataset.size === size;
      b.classList.toggle("sel", yo);
      b.setAttribute("aria-pressed", String(yo));
    });
    $$(".pm-swatches .swatch", el).forEach(s => {
      const yo = s.dataset.color === color;
      s.classList.toggle("sel", yo);
      s.setAttribute("aria-pressed", String(yo));
    });
    $$(".pm-thumb", el).forEach(b => b.classList.toggle("sel", +b.dataset.i === vista));
    const img = $("#pmImg"), src = srcNow();
    /* imgScale está calibrado para el recorte del producto; las demás vistas de
       la galería ya vienen con su propio aire, así que pueden llevar otro ajuste. */
    img.style.setProperty("--img-scale",
      (vista === 0 ? cur.imgScale : (cur.viewScale ?? cur.imgScale)) || 1);
    if (!img.src.endsWith(src)) img.src = src;
  }

  function populate(keepSelection) {
    if (!keepSelection) { qty = 1; size = cur.sizes[0]; color = cur.colorNames ? cur.colorNames[0] : null; vista = 0; }
    $("#pmImg").src = srcNow();
    $("#pmImg").alt = cur.name;
    $("#pmImg").style.setProperty("--img-scale", cur.imgScale || 1);
    $("#pmNum").textContent = cur.num;
    $("#pmName").textContent = cur.name;
    $("#pmTagline").textContent = cur.tagline ? cur.tagline[LANG] : "";
    $("#pmDesc").textContent = cur.desc[LANG];
    $("#pmSpecs").textContent = cur.specs[LANG];
    $("#pmSizeLabel").textContent = cur.sizeLabel[LANG];
    $("#pmFeatures").innerHTML = (cur.features || [])
      .map(f => `<li><strong>${f[LANG][0]}</strong><span>${f[LANG][1]}</span></li>`).join("");
    pintarVistas();
    /* La lata no tiene variantes: sin colorNames la fila de color desaparece */
    $("#pmColorsRow").hidden = !cur.colorNames;
    /* <button> y no <span role="button">: el span se podía tabular pero Enter no
       hacía nada, porque un span no dispara clic con el teclado. El color solo
       se podía elegir con ratón. */
    $("#pmSwatches").innerHTML = (cur.colorNames || []).map((cn, i) =>
      `<button type="button" class="swatch" style="background:${cur.colors[i]}" data-color="${cn}" aria-label="${colorName(cn)}" aria-pressed="false"></button>`).join("");
    $("#pmSizes").innerHTML = cur.sizes.map(s =>
      `<button class="pm-size" type="button" data-size="${s}" aria-pressed="false">${sizeName(s)}</button>`).join("");
    /* al cambiar de color hay que repintar la tira de vistas: cada color tiene la suya */
    $$(".pm-swatches .swatch", el).forEach(s => s.addEventListener("click", () => {
      color = s.dataset.color; pintarVistas(); paint();
    }));
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
  $("#pmPlus").addEventListener("click", () => {
    /* Avisa al llegar al tope. Antes se pulsaba + y no pasaba nada: parecía
       que el botón estaba roto. */
    if (qty >= 9) return toast(t("cart.max", { n: 9 }));
    qty = Math.min(9, qty + 1); paint();
  });
  $("#pmAdd").addEventListener("click", e => {
    Cart.add(cur.id, { size, color, qty });
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

  const clave = (id, size, color) => `${id}|${size}|${color || ""}`;

  /* Limpia lo guardado de catálogos anteriores: descarta productos que ya no
     existen, quita el color a los que dejaron de tener variantes (la lata) y
     fusiona las líneas que queden repetidas al recalcular la clave.

     Y sobre todo, **vuelve a sacar el precio del catálogo**. Lo que hay en
     localStorage lo escribe el navegador del cliente y no caduca nunca, así que
     confiar en el precio guardado tiene dos consecuencias: el día que suba una
     tarifa, quien ya tuviera algo en el carrito —justo los más interesados—
     seguiría comprando al precio viejo; y cualquiera que abra las herramientas
     del navegador podría fijar el importe que quisiera. El precio, la cantidad
     y la talla son datos del catálogo, no del cliente. */
  (() => {
    const antes = JSON.stringify(items);
    const salida = [];
    items.forEach(i => {
      const p = i && PRODUCTS.find(x => x.id === i.id);
      if (!p) return;
      if (!p.colorNames) i.color = null;

      /* Con tallas, la talla tiene que existir: si no, el precio base daría un
         pack de doce al precio de uno de cuatro. */
      if (p.sizePrices && p.sizePrices[i.size] == null) return;
      /* Y el color tiene que seguir existiendo. Si un día se retira un color
         —como pasó con los de la lata— la línea guardada en el navegador
         sobrevivía apuntando a una variante que ya no se fabrica, y ese pedido
         no se puede cumplir. */
      if (p.colorNames && i.color && !p.colorNames.includes(i.color)) return;
      const precio = p.sizePrices?.[i.size] ?? p.price;
      if (!Number.isFinite(precio)) return;
      i.unitPrice = precio;

      const q = Math.round(Number(i.qty));
      i.qty = Number.isFinite(q) ? Math.min(9, Math.max(1, q)) : 1;

      i.key = clave(i.id, i.size, i.color);
      const ya = salida.find(f => f.key === i.key);
      if (ya) ya.qty = Math.min(9, ya.qty + i.qty);
      else salida.push(i);
    });
    items = salida;
    if (antes !== JSON.stringify(items)) save();
  })();

  const count = () => items.reduce((a, i) => a + i.qty, 0);
  const total = () => items.reduce((a, i) => a + i.qty * i.unitPrice, 0);

  /* El precio no se recibe: se busca. Antes se aceptaba un `unitPrice` del
     llamante, y aunque los tres sitios que llaman lo sacaban del mismo catálogo
     —era literalmente la misma expresión—, dejaba abierta una vía por la que el
     importe podía entrar desde fuera. El catálogo es la única fuente. */
  function add(id, { size, color, qty = 1 }) {
    const p = PRODUCTS.find(x => x.id === id);
    if (!p) return;
    const up = p.sizePrices?.[size] ?? p.price;
    const key = clave(id, size, color);
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
          <p class="citem-var">${sizeName(it.size)}${p.colorNames && it.color ? " · " + colorName(it.color) : ""}</p>
          <div class="citem-qty">
            <button type="button" aria-label="${t("cart.less", { name: p.name })}">−</button>
            <span>${it.qty}</span>
            <button type="button" aria-label="${t("cart.more", { name: p.name })}">+</button>
          </div>
        </div>
        <div class="citem-right">
          <span class="citem-price">${money(it.unitPrice * it.qty)}</span>
          <button class="citem-del" type="button" aria-label="${t("cart.del", { name: p.name })}">✕</button>
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

/* ============================================================
   CHECKOUT — datos de envío
   El teléfono se pide aquí porque es dato logístico, no de identidad: el login
   sigue siendo solo email + contraseña. Si hay sesión, el formulario se rellena
   con lo que el cliente guardó la última vez y se vuelve a guardar en su perfil
   de Clerk (unsafeMetadata), así queda también en el panel de clientes.
   ============================================================ */
const Checkout = (() => {
  const modal = $("#checkoutModal"), form = $("#formCheckout");
  const CAMPOS = ["name", "email", "phone", "address", "city", "zip", "country", "notes"];
  const LOCAL = "sr_envio_v1";

  const guardadoLocal = () => { try { return JSON.parse(localStorage.getItem(LOCAL)) || {}; } catch { return {}; } };
  const olvidarLocal = () => { try { localStorage.removeItem(LOCAL); } catch {} };

  /* La copia local lleva anotado de quién es.
   *
   * Sin eso, el nombre, el teléfono y la dirección de casa de quien compró
   * antes se le rellenaban al siguiente que abriera el checkout en ese
   * navegador: un ordenador compartido, el portátil de la familia, un móvil que
   * se presta. Ahora solo se reutiliza si es de la misma cuenta, o si nadie ha
   * entrado ni entonces ni ahora. Y al cerrar sesión se borra. */
  function previoSeguro(u) {
    const local = guardadoLocal();
    const suyo = u ? local._de === u.id : local._de == null;
    return { ...(suyo ? local : {}), ...(u?.unsafeMetadata?.envio || {}) };
  }

  function abrir() {
    if (!Cart.count()) { toast(t("cart.emptyToast")); return; }
    const u = Auth.user();
    const previo = previoSeguro(u);
    CAMPOS.forEach(c => { form[c].value = previo[c] || ""; });
    if (u) {                                   // lo que ya sabemos de la cuenta
      form.name.value = form.name.value || [u.firstName, u.lastName].filter(Boolean).join(" ");
      form.email.value = form.email.value || u.primaryEmailAddress?.emailAddress || "";
    }
    const suma = Cart.total();
    $("#ckTotal").textContent = money(suma);
    $("#ckEnvio").textContent = suma >= FREE_SHIP
      ? t("ck.shipFree", { n: FREE_SHIP })
      : t("ck.shipAdd");
    $("#ckNote").textContent = t(u ? "ck.noteSaved" : "ck.note");
    form.querySelector(".lm-err").textContent = "";
    UI.open(modal);
  }

  form.addEventListener("submit", async e => {
    e.preventDefault();
    const err = form.querySelector(".lm-err");
    const datos = Object.fromEntries(CAMPOS.map(c => [c, form[c].value.trim()]));
    if (CAMPOS.filter(c => c !== "notes").some(c => !datos[c])) return err.textContent = t("ck.errRequired");
    /* Que el campo no esté vacío no lo convierte en un correo. Sin esta
       comprobación se aceptaba cualquier cosa, y a esa dirección es a donde iba
       a ir la confirmación del pedido y el seguimiento del envío. */
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(datos.email)) return err.textContent = t("ck.errEmail");
    if (datos.phone.replace(/[^0-9]/g, "").length < 7) return err.textContent = t("ck.errPhone");

    const b = form.querySelector(".lm-submit");
    b.setAttribute("aria-busy", "true"); b.disabled = true;
    const u = Auth.user();
    try { localStorage.setItem(LOCAL, JSON.stringify({ ...datos, _de: u?.id || null })); } catch {}
    // si hay cuenta, los datos viajan al perfil del cliente en Clerk
    try { await Auth.guardarEnvio(datos); }
    catch (ex) { console.warn("[checkout] no se pudo guardar en el perfil:", ex); }
    b.setAttribute("aria-busy", "false"); b.disabled = false;

    $("#scOrder").textContent = "#SR-" + String(Math.floor(1000 + Math.random() * 9000));
    Cart.clear();
    UI.open($("#successModal"));
    setTimeout(() => confetti.burst(innerWidth / 2, innerHeight / 3, 80), 250);
  });

  return { abrir, olvidarLocal };
})();

$("#btnCheckout").addEventListener("click", () => Checkout.abrir());

/* CTA Rabbit Fuel */
$("#btnFuelAdd").addEventListener("click", e => {
  Cart.add("rabbit-fuel", { size: "PACK ×4", qty: 1 });
  confetti.burst(e.clientX, e.clientY, 30);
});

/* ============================================================
   LOGIN DEMO (localStorage)
   ============================================================ */
const Auth = (() => {
  /* Autenticación real con Clerk usando "custom flows": Clerk no pinta nada,
     toda la interfaz es la nuestra. La clave publicable es pública por diseño
     (Clerk documenta que es seguro exponerla); la clave secreta no se usa aquí
     ni debe estar nunca en el cliente. */
  /* Sin valor de reserva a propósito. Antes había uno con la clave de desarrollo
     y fue justo lo que permitió que una instancia de pruebas atendiera a clientes
     reales durante días sin que nadie lo notara: tapaba la falta de configuración
     en silencio. Ahora, si la variable no está, el login falla a la vista y se
     dice por consola, que es mucho mejor que funcionar a medias.
     En local la aporta el archivo .env. */
  const PK = import.meta.env.PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!PK) console.error("[auth] falta PUBLIC_CLERK_PUBLISHABLE_KEY. En Vercel es una " +
                         "variable de entorno; en local va en .env.");
  if (PK && PK.startsWith("pk_test_") && !/^(localhost|127\.|192\.168\.|\[::1\])/.test(location.hostname)) {
    console.warn("[auth] Clerk está usando la instancia de DESARROLLO en un dominio público.");
  }

  const modal = $("#loginModal");
  const tabIn = $("#tabIn"), tabUp = $("#tabUp");
  const formIn = $("#formIn"), formUp = $("#formUp"), formCode = $("#formCode");
  const formLost = $("#formLost"), formReset = $("#formReset");
  let clerk = null, listo = false, fallo = false;
  /* Marca de que en este navegador ya se entró alguna vez. No guarda identidad
     ni nada que valga para suplantar: solo sirve para no enseñar LOGIN a quien
     probablemente siga dentro, y para arrancar Clerk sin esperar. */
  const SESION = "sr_sesion_v1";
  const tuvoSesion = () => { try { return localStorage.getItem(SESION) === "1"; } catch { return false; } };
  const marcarSesion = si => { try { si ? localStorage.setItem(SESION, "1") : localStorage.removeItem(SESION); } catch {} };
  let pendiente = null;   // { email, nombre } mientras se verifica el correo
  let correoCodigo = null;   // a quién se le mandó el código, para repintar al cambiar de idioma
  const oyentes = [];     // otros módulos que quieren enterarse de login/logout

  /* Clerk pesa ~1,4 MB, así que va en su propio chunk y no se descarga con la
     página: arranca cuando el navegador está ocioso (o al instante si el
     usuario pulsa el botón antes). Así la landing no paga ese coste. */
  let arranque = null;
  function iniciar() {
    if (arranque) return arranque;
    arranque = (async () => {
      if (!PK) { fallo = true; return; }
      try {
        const { Clerk } = await import("@clerk/clerk-js");
        clerk = new Clerk(PK);
        /* Con tope de tiempo: si Clerk no contesta —red mala, su servicio
           caído— antes se quedaba en CONECTANDO… para siempre y el botón no
           hacía nada, sin decir nunca por qué. Mejor fallar a la vista. */
        await Promise.race([
          clerk.load(),
          new Promise((_, no) => setTimeout(() => no(new Error("tiempo agotado")), 15000)),
        ]);
        listo = true;
        clerk.addListener(cambio);     // sesión restaurada, login o logout
        cambio();
      } catch (e) {
        fallo = true;
        console.error("[auth] Clerk no pudo cargarse:", e);
        paintNav();
      }
    })();
    return arranque;
  }

  /* Quien ya entró alguna vez en este navegador arranca Clerk de inmediato; el
     resto espera a que el navegador esté ocioso.
     Antes esperaban todos, y durante esos hasta 3 segundos el navbar decía
     LOGIN a alguien con la sesión abierta: parecía que se había caído. Así el
     1,4 MB lo paga solo quien lo necesita, y el visitante nuevo sigue teniendo
     la portada ligera. */
  if (tuvoSesion()) iniciar();
  else if ("requestIdleCallback" in window) requestIdleCallback(iniciar, { timeout: 3000 });
  else setTimeout(iniciar, 1500);

  /* Traduce los códigos de error de Clerk a NUESTROS mensajes de marca */
  function traducirError(err) {
    const c = err?.errors?.[0]?.code || "";
    if (c === "form_identifier_exists") return t("auth.errExists");
    if (c === "form_password_pwned" || c === "form_password_length_too_short"
        || c === "form_password_not_strong_enough") return t("auth.errWeakPass");
    if (c === "form_password_incorrect" || c === "form_identifier_not_found") return t("auth.errBad");
    if (c === "form_code_incorrect" || c === "verification_expired"
        || c === "form_param_nil") return t("auth.errCode");
    if (c === "form_param_format_invalid") return t("auth.errEmail");
    /* Demasiados intentos: Clerk lo dice, y antes se traducía a "algo salió
       mal". Quien lo ve necesita saber que solo tiene que esperar. */
    if (c === "too_many_requests" || c === "form_identifier_locked") return t("auth.errTooMany");
    /* Errores de configuración de la instancia: no son culpa de quien entra, y
       decirle "revisa tus datos" le hace perder el rato buscando su fallo.
       Se le dice que es cosa nuestra y se deja el detalle en la consola. */
    if (c.startsWith("form_param_unknown") || c === "strategy_for_user_invalid"
        || c === "form_param_missing" || err?.errors?.[0]?.meta?.paramName) {
      console.error("[auth] parece un problema de configuración de Clerk:", err?.errors);
      return t("auth.errConfig");
    }
    if (!err?.errors) return t("auth.errNet");
    console.error("[auth] código sin traducir:", c, err?.errors);
    return t("auth.errGeneric");
  }

  const ocupado = (form, si) => {
    const b = form.querySelector(".lm-submit");
    b.setAttribute("aria-busy", si ? "true" : "false");
    b.disabled = si;
  };

  function paso(cual) {   // "in" | "up" | "code" | "lost" | "reset"
    formIn.hidden = cual !== "in";
    formUp.hidden = cual !== "up";
    formCode.hidden = cual !== "code";
    formLost.hidden = cual !== "lost";
    formReset.hidden = cual !== "reset";
    /* Las pestañas solo aplican a entrar y registrarse. Verificar un código o
       recuperar la contraseña no son ninguna de las dos. */
    modal.classList.toggle("step-code", cual !== "in" && cual !== "up");
    const up = cual === "up";
    tabIn.classList.toggle("active", cual === "in"); tabUp.classList.toggle("active", up);
    tabIn.setAttribute("aria-pressed", String(cual === "in")); tabUp.setAttribute("aria-pressed", String(up));
    $$(".lm-err", modal).forEach(e => e.textContent = "");
  }
  tabIn.addEventListener("click", () => paso("in"));
  tabUp.addEventListener("click", () => paso("up"));

  /* Toda vuelta atrás lleva al principio. Antes el paso del código no tenía
     salida: quien se equivocaba de correo o cerraba el modal se quedaba
     encerrado y solo recargando la página volvía a empezar. */
  $$("[data-volver]", modal).forEach(b => b.addEventListener("click", () => {
    formLost.reset(); formReset.reset(); formCode.reset();
    paso("in");
  }));

  const usuario = () => (listo && clerk.user) ? clerk.user : null;
  const nombreDe = u => u.firstName || (u.primaryEmailAddress?.emailAddress || "").split("@")[0] || "";

  function paintNav() {
    const u = usuario();
    const label = $("#loginLabel"), btn = $("#btnLogin");
    if (u) {
      label.textContent = t("nav.hello", { name: nombreDe(u).split(" ")[0].toUpperCase() });
      btn.classList.add("logged");
      marcarSesion(true);
      return;
    }
    btn.classList.remove("logged");
    /* Mientras Clerk resuelve y aquí ya hubo sesión, no se dice ni una cosa ni
       la otra. Decir LOGIN sería afirmar que está fuera sin saberlo, y decir su
       nombre sería afirmar que está dentro. */
    if (!listo && !fallo && tuvoSesion()) { label.textContent = t("nav.checking"); return; }
    label.textContent = t("nav.login");
    if (listo) marcarSesion(false);
  }

  function cambio() {
    paintNav();
    oyentes.forEach(f => { try { f(); } catch (e) { console.error("[auth] oyente:", e); } });
  }
  const alCambiar = fn => { oyentes.push(fn); };

  /* Sesión iniciada: cerrar, saludar y celebrar (igual que antes) */
  async function entrar(sessionId, saludo, nombre) {
    await clerk.setActive({ session: sessionId });
    cambio(); UI.close();
    toast(t(saludo, { name: (nombre || "").toUpperCase() }));
  }

  /* ---------------- CREAR CUENTA ---------------- */
  formUp.addEventListener("submit", async e => {
    e.preventDefault();
    const err = formUp.querySelector(".lm-err");
    const nombre = formUp.name.value.trim();
    const email = formUp.email.value.trim().toLowerCase();
    const pass = formUp.pass.value;
    if (nombre.length < 2) return err.textContent = t("auth.errName");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return err.textContent = t("auth.errEmail");
    if (pass.length < 8) return err.textContent = t("auth.errPass");
    if (!listo) return err.textContent = t(fallo ? "auth.errNet" : "auth.loading");

    ocupado(formUp, true); err.textContent = "";
    try {
      const su = await clerk.client.signUp.create({ emailAddress: email, password: pass, firstName: nombre });
      if (su.status === "complete") {                       // sin verificación de email
        await entrar(su.createdSessionId, "auth.welcome", nombre);
        confetti.burst(innerWidth / 2, 120, 40);
        formUp.reset();
      } else {                                              // hace falta el código
        await su.prepareEmailAddressVerification({ strategy: "email_code" });
        pendiente = { email, nombre };
        correoCodigo = email;
        $("#lmSent").innerHTML = t("auth.codeSent", { email });
        paso("code");
        formCode.code.value = ""; formCode.code.focus();
      }
    } catch (ex) { err.textContent = traducirError(ex); }
    finally { ocupado(formUp, false); }
  });

  /* ---------------- VERIFICAR CÓDIGO ---------------- */
  formCode.addEventListener("submit", async e => {
    e.preventDefault();
    const err = formCode.querySelector(".lm-err");
    const code = formCode.code.value.trim();
    if (code.length !== 6) return err.textContent = t("auth.errCode");
    ocupado(formCode, true); err.textContent = "";
    try {
      const su = await clerk.client.signUp.attemptEmailAddressVerification({ code });
      if (su.status !== "complete") {
        // Suele significar que el panel de Clerk exige campos que este
        // formulario no pide (p. ej. teléfono o nombre de usuario).
        console.warn("[auth] registro incompleto:", su.status, "faltan:", su.missingFields, su.unverifiedFields);
        return err.textContent = su.missingFields?.length
          ? t("auth.errMissing", { fields: su.missingFields.join(", ") })
          : t("auth.errGeneric");
      }
      await entrar(su.createdSessionId, "auth.welcome", pendiente?.nombre);
      confetti.burst(innerWidth / 2, 120, 40);
      formUp.reset(); formCode.reset(); pendiente = null; paso("in");
    } catch (ex) { err.textContent = traducirError(ex); }
    finally { ocupado(formCode, false); }
  });

  $("#lmResend").addEventListener("click", async e => {
    const b = e.currentTarget;
    b.disabled = true;
    try {
      await clerk.client.signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      toast(t("auth.resent"));
    } catch (ex) { formCode.querySelector(".lm-err").textContent = traducirError(ex); }
    setTimeout(() => { b.disabled = false; }, 30000);   // evita spam de correos
  });

  /* ---------------- RECUPERAR CONTRASEÑA ----------------
   *
   * No existía. Quien olvidaba la suya se quedaba fuera para siempre, y la
   * cuenta es donde vive su plaza de fundador, el plan que eligió y su
   * dirección de envío: no era perder el acceso a una web, era perder eso.
   *
   * En Clerk son dos llamadas: se pide un código con la estrategia
   * reset_password_email_code, y luego se manda ese código junto con la
   * contraseña nueva. Si sale bien, la sesión queda abierta directamente — no
   * tiene sentido pedirle que entre otra vez con la contraseña que acaba de
   * escribir. */
  $("#lmOlvide").addEventListener("click", () => {
    formLost.email.value = formIn.email.value;   // si ya lo escribió, no repetirlo
    paso("lost");
    formLost.email.focus();
  });

  formLost.addEventListener("submit", async e => {
    e.preventDefault();
    const err = formLost.querySelector(".lm-err");
    const email = formLost.email.value.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return err.textContent = t("auth.errEmail");
    if (!listo) return err.textContent = t(fallo ? "auth.errNet" : "auth.loading");

    ocupado(formLost, true); err.textContent = "";
    try {
      await clerk.client.signIn.create({ strategy: "reset_password_email_code", identifier: email });
      correoCodigo = email;
      $("#lmSentReset").innerHTML = t("auth.codeSent", { email });
      paso("reset");
      formReset.code.value = ""; formReset.pass.value = ""; formReset.code.focus();
    } catch (ex) { err.textContent = traducirError(ex); }
    finally { ocupado(formLost, false); }
  });

  formReset.addEventListener("submit", async e => {
    e.preventDefault();
    const err = formReset.querySelector(".lm-err");
    const code = formReset.code.value.trim(), pass = formReset.pass.value;
    if (code.length !== 6) return err.textContent = t("auth.errCode");
    if (pass.length < 8) return err.textContent = t("auth.errPass");

    ocupado(formReset, true); err.textContent = "";
    try {
      const si = await clerk.client.signIn.attemptFirstFactor({
        strategy: "reset_password_email_code", code, password: pass,
      });
      if (si.status !== "complete") {
        /* Puede quedar pendiente un segundo factor si la cuenta lo tiene. No es
           un error, pero este formulario no sabe resolverlo. */
        console.warn("[auth] recuperación incompleta:", si.status);
        return err.textContent = t("auth.errGeneric");
      }
      await entrar(si.createdSessionId, "auth.resetOk", "");
      formIn.reset(); formLost.reset(); formReset.reset(); paso("in");
    } catch (ex) { err.textContent = traducirError(ex); }
    finally { ocupado(formReset, false); }
  });

  /* ---------------- ENTRAR ---------------- */
  formIn.addEventListener("submit", async e => {
    e.preventDefault();
    const err = formIn.querySelector(".lm-err");
    const email = formIn.email.value.trim().toLowerCase(), pass = formIn.pass.value;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return err.textContent = t("auth.errEmail");
    if (!listo) return err.textContent = t(fallo ? "auth.errNet" : "auth.loading");

    ocupado(formIn, true); err.textContent = "";
    try {
      const si = await clerk.client.signIn.create({ strategy: "password", identifier: email, password: pass });
      if (si.status !== "complete") {
        console.warn("[auth] inicio de sesión incompleto:", si.status);
        return err.textContent = t("auth.errGeneric");
      }
      await entrar(si.createdSessionId, "auth.back", si.userData?.firstName || email.split("@")[0]);
      formIn.reset();
    } catch (ex) { err.textContent = traducirError(ex); }
    finally { ocupado(formIn, false); }
  });

  /* ---------------- BOTÓN DEL NAVBAR ---------------- */
  $("#btnLogin").addEventListener("click", async () => {
    iniciar();                      // por si el usuario se adelanta al idle
    const u = usuario();
    if (!u) { paso("in"); UI.open(modal); return; }
    Panel.abrir();          // con sesión, el botón lleva a MY BURROW
  });

  /* Guarda un dato en el perfil del cliente conservando el resto: se manda
     siempre el objeto completo porque Clerk reemplaza unsafeMetadata entero. */
  async function guardarMeta(clave, valor) {
    const u = usuario();
    if (!u) return false;
    await u.updateMetadata({ unsafeMetadata: { ...(u.unsafeMetadata || {}), [clave]: valor } });
    return true;
  }
  const guardarEnvio = envio => guardarMeta("envio", envio);

  /* Abre el modal directamente en "crear cuenta" (lo usa La Madriguera) */
  function abrirRegistro() {
    iniciar();
    paso("up");
    UI.open(modal);
  }

  async function salir() {
    /* Si signOut falla —red caída— antes se seguía adelante igual: se limpiaba
       todo y se decía "hasta luego" con la sesión todavía abierta. En un
       ordenador compartido eso es dejar a alguien dentro creyendo que salió. */
    try {
      await clerk.signOut();
    } catch (e) {
      console.error("[auth] no se pudo cerrar la sesión:", e);
      toast(t("auth.outErr"));
      return;
    }
    /* La dirección guardada en el navegador se va con la sesión: si no, el
       siguiente que abra el checkout en este ordenador se encuentra el nombre,
       el teléfono y la dirección de casa del anterior. */
    Checkout.olvidarLocal();
    cambio();
    toast(t("auth.out"));
  }

  /* El token de la sesión en curso. Lo pide el servidor para comprobar quién
     llama: es lo que le permite sacar el correo de la cuenta en vez de fiarse
     del que le manden. Caduca solo, así que se pide en el momento de usarlo. */
  async function token() {
    try { return (await clerk?.session?.getToken()) || null; } catch { return null; }
  }

  /* applyLang la llama al cambiar de idioma: los dos avisos del código llevan
     el correo dentro, así que los reescribe el módulo y no el traductor. */
  function refreshLang() {
    if (!correoCodigo) return;
    const txt = t("auth.codeSent", { email: correoCodigo });
    $("#lmSent").innerHTML = txt;
    $("#lmSentReset").innerHTML = txt;
  }

  return { paintNav, user: usuario, token, guardarEnvio, guardarMeta, alCambiar, abrirRegistro, salir, refreshLang };
})();

/* ============================================================
   LA MADRIGUERA (club de suscripción)
   ============================================================
   Todavía no cobra: esto es la lista de fundadores. La plaza y el plan
   elegido se guardan en el perfil de Clerk (unsafeMetadata.madriguera), así
   que quedan en el panel de clientes y sobreviven a cambiar de dispositivo.
   Cuando la pasarela de pagos esté activa, este mismo botón pasa al checkout
   de la suscripción y el campo `lista` distingue a los fundadores. */
const Madriguera = (() => {
  const sec  = $("#madriguera");
  const btn  = $("#burJoin"), note = $("#burNote"), sel = $("#burSel");
  const KEY  = "sr_burrow_tier_v1";
  const ANIO_SERIE = 2027;      // Año Uno: enero a diciembre de 2027
  const NOMBRE = { curioso: "bur.t1name", cavador: "bur.t2name" };

  /* Caras que se pidieron y no existían todavía. Hay que recordarlas: el
     navegador no vuelve a lanzar `error` si se le pide dos veces la misma URL
     rota, así que sin esta lista un segundo repintado —al apuntarse a la lista,
     sin recargar— dejaría el pie anunciando una carta que no se está viendo. */
  const faltan = new Set();

  let plan = (() => { try { return localStorage.getItem(KEY); } catch { return null; } })();
  if (plan !== "curioso" && plan !== "cavador") plan = "cavador";
  let queria = false;   // pulsó sin sesión: se completa solo al crear la cuenta
  let tocado = false;   // ha elegido plan en esta visita: manda su elección

  const ficha  = () => Auth.user()?.unsafeMetadata?.madriguera || null;
  const dentro = () => !!ficha()?.lista;

  function pintar() {
    $$(".tier", sec).forEach(c => c.classList.toggle("sel", c.dataset.tier === plan));
    sel.textContent = t("bur.sel", { tier: t(NOMBRE[plan]) });

    const ok = dentro();
    btn.textContent = t(ok ? "bur.ctaIn" : "bur.cta");
    btn.classList.toggle("joined", ok);
    note.textContent = ok
      ? t("bur.noteIn", { email: Auth.user()?.primaryEmailAddress?.emailAddress || "" })
      : t("bur.note");

    /* Año Uno va de enero a diciembre, así que el número de carta y el mes
       coinciden para siempre: la 010 cae en octubre y la 012 en diciembre. */
    const meses = t("bur.months").split(",");
    $$("[data-mes]", sec).forEach(el => { el.textContent = meses[+el.dataset.mes]; });

    /* La casilla del mes en curso; antes de que arranque la serie, la primera,
       que es la que se está enseñando. */
    const hoy = new Date();
    /* Antes del año de la serie se enseña la primera; durante, la del mes; y
       pasado el año, ninguna: las doce quedan enterradas, que es la verdad.
       Fingir que diciembre sigue en curso en 2029 sería inventarse un mes. */
    const anio = hoy.getFullYear();
    const activa = anio === ANIO_SERIE ? hoy.getMonth() : anio < ANIO_SERIE ? 0 : -1;

    /* Tres estados, no dos. Marcar solo la del mes deja las pasadas idénticas a
       las futuras: en junio se verían cinco "?" que parecen estar por llegar
       cuando en realidad ya no existen. Se perdería justo lo que esta rejilla
       tiene que contar, que es que llegar tarde cuesta. */
    const acabado = activa < 0;
    $$(".by-card", sec).forEach((c, i) => {
      c.classList.toggle("on",  i === activa);
      c.classList.toggle("ida", acabado || i < activa);
    });

    /* La carta destacada sigue al mes en curso. Las caras se publican de una en
       una, el mes que les toca, para no destripar el año: si la de este mes aún
       no está subida se cae a la 001, que siempre está, en vez de dejar el hueco
       roto y un pie mintiendo. */
    const largos = t("bur.monthsFull").split(",");
    const carta = $("#burCarta"), pie = $("#burCarPie");
    const rotular = (n) => {
      carta.alt = t("bur.cardAlt", { n });
      pie.textContent = t("bur.cardCap", { mes: largos[+n - 1], n });
    };

    const num = String((acabado ? 11 : activa) + 1).padStart(3, "0");
    const src = `/assets/carta-${num}-${LANG}.webp`;
    const respaldo = () => { carta.src = `/assets/carta-001-${LANG}.webp`; rotular("001"); };

    if (faltan.has(src)) respaldo();
    else {
      carta.onerror = () => { faltan.add(src); carta.onerror = null; respaldo(); };
      carta.src = src;
      rotular(num);
    }
  }

  /* Aviso por correo del alta. El servidor decide a quién escribe y se encarga
     de mandarlo una sola vez, así que desde aquí basta con avisarle.
     No se espera a que termine ni se le cuenta al usuario si falla: su sitio en
     la lista ya está guardado, que es lo que vino a hacer, y un aviso de error
     por un correo que no salió solo sembraría dudas sobre si quedó apuntado. */
  function avisarPorCorreo() {
    Auth.token()
      .then(tk => tk && fetch("/api/apuntarse", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token: tk }),
      }))
      .then(r => { if (r && !r.ok) console.warn("[madriguera] el correo de bienvenida no salió:", r.status); })
      .catch(e => console.warn("[madriguera] el correo de bienvenida no salió:", e));
  }

  async function guardar(callado) {
    btn.disabled = true;
    try {
      await Auth.guardarMeta("madriguera", {
        lista: true,
        plan,
        /* En qué idioma lee la web. El servidor no puede saberlo —el idioma
           vive en localStorage— así que viaja con el alta: sin esto, a quien
           navega en español se le escribe en inglés. */
        idioma: LANG,
        /* Si el plan vino puesto por defecto o lo eligió de verdad. CAVADOR
           está preseleccionado, así que sin este dato la lista de fundadores
           parecería llena de gente que quiere el plan caro y la previsión de
           ingresos saldría inflada. */
        elegido: tocado,
        desde: ficha()?.desde || new Date().toISOString().slice(0, 10)
      });
      pintar();
      avisarPorCorreo();
      if (!callado) {
        const r = btn.getBoundingClientRect();
        confetti.burst(r.left + r.width / 2, r.top + r.height / 2, 34);
        toast(t("bur.joined"));
      }
    } catch (e) {
      console.error("[madriguera] no se pudo guardar:", e);
      toast(t("bur.errSave"));
    } finally { btn.disabled = false; }
  }

  function elegir(p) {
    if (p !== "curioso" && p !== "cavador") return;
    plan = p; tocado = true;
    try { localStorage.setItem(KEY, p); } catch {}
    pintar();
    if (dentro()) guardar(true);      // ya es fundador: solo cambia de plan
  }

  sec.addEventListener("click", e => {
    const card = e.target.closest(".tier");
    if (card) elegir(card.dataset.tier);
  });
  /* Ya no hay keydown en la tarjeta: era un role="button" envolviendo un
     encabezado, una lista y otro botón —un botón no puede contener eso— y un
     lector de pantalla lo leía como un solo control sin nombre claro. El
     teclado llega igual por el botón de dentro, y el clic en la tarjeta se
     queda como comodidad para el ratón. */

  btn.addEventListener("click", () => {
    if (!Auth.user()) {          // sin cuenta no hay dónde guardar la plaza
      queria = true;
      toast(t("bur.needAcc"));
      Auth.abrirRegistro();
      return;
    }
    if (dentro()) return void toast(t("bur.joined"));
    guardar(false);
  });

  Auth.alCambiar(() => {
    /* El plan vive en la cuenta: al entrar desde otro dispositivo manda ese,
       salvo que en esta visita ya haya elegido uno distinto. */
    const guardado = ficha()?.plan;
    if (!tocado && guardado) plan = guardado;
    if (queria && Auth.user()) { queria = false; guardar(false); }
    pintar();
  });

  return { refresh: pintar };
})();

/* ============================================================
   PANEL DE CLIENTE (MY BURROW)
   ============================================================
   Todo sale del perfil de Clerk. Lo que aún no existe —pedidos, cartas,
   latas registradas— se enseña con su estado vacío y diciendo qué lo
   desbloquea; nunca con datos de mentira. */
const Panel = (() => {
  const el = $("#panelModal");
  const UMBRALES = UMBRALES_RANGO;   // de src/data/rangos.ts, único sitio

  /* Cuenta arriba desde cero. El progreso es el motor del club entero, así que
     merece verse crecer en vez de aparecer ya hecho. */
  function contar(nodo, hasta) {
    if (reducedMotion || !hasta) { nodo.textContent = hasta; return; }
    const t0 = performance.now(), dur = 900;
    (function paso(now) {
      const p = Math.min(1, (now - t0) / dur);
      nodo.textContent = Math.round(hasta * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(paso);
    })(t0);
  }

  function pintar(animar) {
    const u = Auth.user();
    if (!u) return;
    const m = u.unsafeMetadata || {};
    $("#pnUser").textContent = u.primaryEmailAddress?.emailAddress || "";

    /* Los meses también aquí: el módulo de La Madriguera los traduce, pero
       scoped a su sección, así que la rejilla del panel se quedaba en inglés
       con el sitio en español. */
    const meses = t("bur.months").split(",");
    $$("[data-mes]", el).forEach(n => { n.textContent = meses[+n.dataset.mes]; });

    /* ---- el año ---- */
    /* Las cartas se leen de publicMetadata, que solo se escribe desde el
       servidor —lo hará el webhook de Stripe al cobrar el mes—. En
       unsafeMetadata no pueden vivir: ese lo cambia el propio cliente desde su
       navegador, y con el plush del mes 12 de por medio sería regalar el premio
       a quien sepa abrir la consola.
       Se sigue mirando unsafeMetadata como respaldo para poder probar el panel
       antes de que exista la pasarela. */
    const pub = u.publicMetadata || {};
    const mias = Array.isArray(pub.cartas) ? pub.cartas
               : Array.isArray(m.cartas)   ? m.cartas
               : [];
    $$(".pn-carta", el).forEach(c => {
      const n = +c.dataset.carta, tengo = mias.includes(n);
      c.classList.toggle("tiene", tengo);
      c.querySelector("img")?.remove();
      if (!tengo) return;
      /* La cara de la carta solo existe cuando esa carta ya se ha enviado; si
         todavía no está publicada, se queda la placa con el número. */
      const img = new Image();
      img.src = `/assets/carta-${String(n).padStart(3, "0")}-${LANG}.webp`;
      img.alt = "";
      /* Si esa cara aún no está publicada se quita la imagen y se queda la
         placa con el número — pero la carta SIGUE siendo suya. Antes se le
         quitaba la clase, así que quien tuviera la 3 la veía como no
         conseguida y el contador mentía. */
      img.onerror = () => img.remove();
      c.appendChild(img);
    });
    /* La 000 es de fundador, no del año: contarla daba 13/12 a quien tuviera
       las doce y además la de fundador, y en la rejilla no tiene casilla. */
    const delAnio = mias.filter(n => n >= 1 && n <= 12).length;
    animar ? contar($("#pnCartasN"), delAnio) : ($("#pnCartasN").textContent = delAnio);
    $("#pnCarta000").hidden = !mias.includes(0);
    $("#pnCartasNota").textContent = t(mias.length ? "pn.cardsSome" : "pn.cardsEmpty");

    /* ---- el descenso ----
       Las latas se leen de publicMetadata por lo mismo que las cartas: en
       unsafeMetadata cualquiera se pone 300 desde la consola y aparece como
       THE RABBIT. El día que esos rangos den un pin o un plush, sería regalar
       objetos físicos a quien sepa abrir el navegador. */
    const latasCruda = Number(pub.rango?.latas ?? m.rango?.latas);
    const latas = Number.isFinite(latasCruda) && latasCruda > 0 ? Math.floor(latasCruda) : 0;
    const logrados = UMBRALES.filter(x => latas >= x).length;
    $$(".pn-peldano", el).forEach((li, i) => {
      li.classList.toggle("hecho", i < logrados);
      li.classList.toggle("actual", i === logrados - 1);
    });
    animar ? contar($("#pnLatasN"), latas) : ($("#pnLatasN").textContent = latas);
    $("#pnRangoN").textContent = logrados ? t(`rank.${logrados}`) : "—";

    const sig = UMBRALES[logrados], desde = logrados ? UMBRALES[logrados - 1] : 0;
    const pct = sig ? Math.min(100, (latas - desde) / (sig - desde) * 100) : 100;
    const barra = $("#pnRangoFill");
    if (animar) { barra.style.width = "0"; requestAnimationFrame(() => { barra.style.width = pct + "%"; }); }
    else barra.style.width = pct + "%";
    $("#pnRangoNota").textContent = !latas ? t("pn.rankNone")
      : sig ? t("pn.rankNext", { n: sig - latas, rank: t(`rank.${logrados + 1}`) })
      : t("pn.rankTop");

    /* ---- pedidos ----
       Con nodos y textContent, no con innerHTML. Estos datos los escribirá el
       webhook de Stripe, pero hasta que exista los escribe quien tenga la
       consola abierta: un «<img onerror=…>» metido en el nombre de un pedido se
       ejecutaba al pintar el panel.
       Y el importe se convierte a número: money() hace n.toFixed(2), así que un
       total guardado como texto —que es justo como lo modela la plantilla del
       correo— lanzaba y dejaba el panel sin abrirse. */
    const pedidos = Array.isArray(pub.pedidos) ? pub.pedidos
                  : Array.isArray(m.pedidos)   ? m.pedidos
                  : [];
    $("#pnPedidosN").textContent = pedidos.length || "";
    const caja = $("#pnPedidos");
    caja.textContent = "";
    if (!pedidos.length) {
      const p = document.createElement("p");
      p.className = "pn-nota";
      p.textContent = t("pn.ordersEmpty");
      caja.appendChild(p);
    } else {
      pedidos.forEach(o => {
        const fila = document.createElement("div");
        fila.className = "pn-pedido";

        const izq = document.createElement("span");
        izq.textContent = [o?.id, o?.fecha].filter(Boolean).join(" · ") || "—";

        const est = document.createElement("i");
        /* La clase sale de una lista cerrada: si viniera del dato, se podría
           colar cualquier cosa dentro del atributo. */
        est.className = "pn-estado" +
          (o?.estado === "entregado" ? " entregado" : o?.estado === "en" ? " en" : "");
        est.textContent = o?.estadoTxt || "";

        const n = Number(o?.total);
        const der = document.createElement("span");
        der.append(est, document.createTextNode(" " + money(Number.isFinite(n) ? n : 0)));

        fila.append(izq, der);
        caja.appendChild(fila);
      });
    }

    /* ---- lo administrativo ---- */
    /* Aquí sí va innerHTML: el texto sale entero del diccionario de la casa
       —lleva un <b>— y lo único que decide el dato es qué clave se usa. */
    /* La membresía de pago la escribirá el servidor en publicMetadata cuando
       exista Stripe; unsafeMetadata solo vale para la lista de fundadores, que
       no cuesta dinero. Sin esta distinción, cualquiera se ponía plan:cavador
       desde la consola y el panel le daba el nivel caro por bueno — y ese nivel
       lleva carta foil, acceso 48 h antes y 10% de descuento. */
    const socio = pub.madriguera || null;              // lo pone el servidor
    const enLista = m.madriguera?.lista;               // lo pone el cliente
    const plan = socio?.plan || (enLista ? m.madriguera.plan : null);
    $("#pnMembresia").innerHTML = (socio || enLista)
      ? t(socio ? "pn.memberPaid" : "pn.memberYes",
          { plan: t(plan === "cavador" ? "bur.t2name" : "bur.t1name") })
      : t("pn.memberNone");

    /* Los Términos y la política de devoluciones dicen que se cancela desde
       aquí. Mientras no exista el portal de Stripe, "desde aquí" es una
       dirección de correo que sí funciona — pero tiene que estar, porque una
       promesa legal sin camino que la cumpla es la promesa la que falla. */
    $("#pnGestion").innerHTML = (pub.madriguera || m.madriguera?.lista)
      ? t("pn.manageWait") + " " + t("pn.manageMail", { email: CONTACTO })
      : "";

    const e = m.envio;
    const env = $("#pnEnvio");
    env.textContent = "";
    if (!e) env.textContent = t("pn.shipNone");
    else {
      const b = document.createElement("b");
      b.textContent = e.name || "";
      env.append(b, document.createElement("br"),
                 document.createTextNode([e.address, e.city, e.country].filter(Boolean).join(", ")));
    }
  }

  /* ---- cambiar la dirección de envío ----
     Antes solo se podía tocar haciendo otro pedido, y las cajas del club salen
     todos los meses: quien se mudaba no tenía forma de corregirla. */
  const CAMPOS_ENVIO = ["name", "phone", "address", "city", "zip", "country"];
  const formEnvio = $("#pnFormEnvio"), btnEditar = $("#pnEditar");

  function editarEnvio(si) {
    formEnvio.hidden = !si;
    btnEditar.hidden = si;
    if (!si) return;
    const e = Auth.user()?.unsafeMetadata?.envio || {};
    CAMPOS_ENVIO.forEach(c => { formEnvio[c].value = e[c] || ""; });
    formEnvio.querySelector(".lm-err").textContent = "";
    formEnvio.name.focus();
  }
  btnEditar.addEventListener("click", () => editarEnvio(true));
  $("#pnCancelar").addEventListener("click", () => editarEnvio(false));

  formEnvio.addEventListener("submit", async ev => {
    ev.preventDefault();
    const err = formEnvio.querySelector(".lm-err");
    const datos = Object.fromEntries(CAMPOS_ENVIO.map(c => [c, formEnvio[c].value.trim()]));
    if (CAMPOS_ENVIO.some(c => !datos[c])) return err.textContent = t("ck.errRequired");
    if (datos.phone.replace(/[^0-9]/g, "").length < 7) return err.textContent = t("ck.errPhone");

    const b = formEnvio.querySelector(".lm-submit");
    b.disabled = true; err.textContent = "";
    try {
      /* Se conserva lo que ya hubiera guardado el checkout —el correo, las
         notas de entrega— en vez de reemplazar la ficha entera. */
      const previo = Auth.user()?.unsafeMetadata?.envio || {};
      await Auth.guardarEnvio({ ...previo, ...datos });
      editarEnvio(false);
      pintar(false);
      toast(t("pn.shipSaved"));
    } catch (e) {
      console.error("[panel] no se pudo guardar la dirección:", e);
      err.textContent = t("pn.shipErr");
    } finally { b.disabled = false; }
  });

  /* Se abre primero y se pinta después, dentro de un try.
     Antes era `pintar(true); UI.open(el);`, así que cualquier excepción al
     pintar dejaba el panel sin abrirse: el botón del navbar no hacía nada —ni
     panel, ni error, ni aviso— y solo para el cliente que tuviera el dato roto,
     que es la avería más difícil de que te reporten. */
  function abrir() {
    editarEnvio(false);
    UI.open(el);
    try { pintar(true); } catch (err) { console.error("[panel] no se pudo pintar:", err); }
  }

  /* Cerrar sesión pide confirmación, en el propio botón.
     Estaba a un toque, pegado al resto del panel: en el móvil, donde los dedos
     no son precisos, se salía sin querer y había que volver a entrar. Dos
     toques, y si te lo piensas vuelve solo a los 4 segundos. */
  let salirArmado = false, tSalir = null;
  const btnSalir = $("#pnSalir");
  btnSalir.addEventListener("click", async () => {
    if (!salirArmado) {
      salirArmado = true;
      btnSalir.classList.add("armado");
      btnSalir.textContent = t("pn.outSure");
      tSalir = setTimeout(() => {
        salirArmado = false;
        btnSalir.classList.remove("armado");
        btnSalir.textContent = t("pn.out");
      }, 4000);
      return;
    }
    clearTimeout(tSalir);
    salirArmado = false;
    btnSalir.classList.remove("armado");
    btnSalir.textContent = t("pn.out");
    UI.close();
    await Auth.salir();
  });

  /* Enlace directo al panel: #micuenta.
     Los correos llevaban botones que decían "ver tu pedido" y "abrir mi
     madriguera" y aterrizaban en la portada y en la sección pública del club.
     Con un ancla propia llevan de verdad donde dicen; si no hay sesión, se
     abre el login y el panel espera a que entre. */
  function porUrl() {
    if (location.hash !== "#micuenta") return;
    history.replaceState(null, "", location.pathname + location.search);
    if (Auth.user()) abrir();
    else {
      Auth.alCambiar(function una() { if (Auth.user()) abrir(); });
      Auth.abrirRegistro();
    }
  }
  addEventListener("hashchange", porUrl);
  Auth.alCambiar(() => { if (location.hash === "#micuenta") porUrl(); });
  addEventListener("load", () => setTimeout(porUrl, 400));

  return { abrir, refresh: () => { if (!el.hidden) pintar(false); } };
})();

/* ============================================================
   NEWSLETTER
   ============================================================ */
$("#newsForm").addEventListener("submit", async e => {
  e.preventDefault();
  const input = $("#newsEmail"), msg = $("#newsMsg"), boton = e.submitter;
  const email = input.value.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    msg.textContent = t("news.err");
    input.focus();
    return;
  }

  msg.textContent = t("news.sending");
  if (boton) { boton.disabled = true; boton.setAttribute("aria-busy", "true"); }
  try {
    const r = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email })
    });
    const { estado } = await r.json().catch(() => ({ estado: "error" }));

    if (estado === "ok" || estado === "yaestaba") {
      msg.textContent = t(estado === "ok" ? "news.ok" : "news.already");
      input.value = "";
      if (estado === "ok") {
        const c = boton?.getBoundingClientRect();
        if (c) confetti.burst(c.left + c.width / 2, c.top, 40);
      }
    } else {
      /* Nunca se dice "guardado" si no se guardó: quien lo intente merece saber
         que hay que volver más tarde. */
      msg.textContent = t("news.fail");
    }
  } catch {
    msg.textContent = t("news.fail");
  } finally {
    if (boton) { boton.disabled = false; boton.removeAttribute("aria-busy"); }
  }
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
  Auth.refreshLang();
  Madriguera.refresh();
  Panel.refresh();
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
