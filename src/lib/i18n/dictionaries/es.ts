import type { Dictionary } from "./en";

export const es: Dictionary = {
  meta: {
    titleDefault: "UangCounsel — revisión de contratos con IA y pruebas",
    titleHome: "Revisión de contratos con IA y pruebas",
    titleQa: "Preguntas y respuestas — sobre este proyecto",
    description:
      "Sube un contrato, mira cómo un LLM lo lee cláusula por cláusula y recibe alertas de riesgo con el texto exacto resaltado en el documento. No opiniones: pruebas.",
    descriptionHome:
      "Sube un contrato, mira cómo un LLM lo lee cláusula por cláusula y recibe alertas de riesgo que señalan el texto exacto que las activó.",
    descriptionQa:
      "Preguntas y respuestas directas sobre UangCounsel: qué es real, qué está precalculado, cómo funciona el pipeline, la privacidad y su relación con uang.ai.",
    ogTitle: "UangCounsel — revisión de contratos con IA y pruebas",
    ogDescription:
      "Revisión de contratos con IA donde cada alerta de riesgo señala el texto exacto de la cláusula que la activó. Un proyecto de portafolio de Rico.",
  },
  common: {
    chooseLanguage: "Elegir idioma",
    toLight: "Cambiar a modo claro",
    toDark: "Cambiar a modo oscuro",
    toggleTheme: "Cambiar tema",
  },
  nav: {
    review: "Revisar",
    samples: "Ejemplos",
    how: "Cómo funciona",
    qa: "P y R",
  },
  home: {
    badge: "Revisión con IA, pero con pruebas",
    heroTitleA: "Contratos revisados cláusula por cláusula —",
    heroTitleB: " con el texto exacto resaltado.",
    heroBodyA:
      "La mayoría de las revisiones con IA te dan opiniones en una ventana de chat. UangCounsel marca las cláusulas riesgosas ",
    heroBodyEm: "sobre el propio documento",
    heroBodyB:
      ", explica el impacto de negocio en una frase y redacta la petición de negociación. Tú lees el contrato; la máquina te muestra dónde mirar.",
    step1: "① abre un ejemplo o sube un PDF",
    step2: "② el LLM lo lee",
    step3: "③ cada alerta enlaza a su texto de origen",
    samplesTitle: "Los archivos de ejemplo",
    samplesBody:
      "Tres contratos realistas con condiciones unilaterales planteadas a propósito — las mismas trampas que los equipos legales internos enfrentan cada semana.",
    howTitle: "Sin cajas negras",
    howBody:
      "El pipeline es deliberadamente transparente — los mismos marcadores de honestidad que nuestras otras creaciones.",
    howSteps: [
      {
        n: "01",
        t: "Texto + geometría",
        d: "El PDF se analiza con pdf.js: cada carácter se extrae con su posición exacta en la página, construyendo un índice de coordenadas buscable.",
      },
      {
        n: "02",
        t: "Pase de LLM estructurado",
        d: "El modelo debe responder en una forma JSON estricta: título, categoría, riesgo, una cita textual, el impacto de negocio y una petición de negociación. La salida inválida se repara una vez y luego se rechaza.",
      },
      {
        n: "03",
        t: "Localización de citas",
        d: "Cada cita textual se localiza de nuevo en el índice de coordenadas — línea por línea. Si el modelo truncó una cita, la coincidencia de fragmentos la recupera. Las citas no encontrables se etiquetan, nunca se falsifican.",
      },
      {
        n: "04",
        t: "Un resaltado que puedes auditar",
        d: "El resultado no es una respuesta de chat. Es un resaltado en la página que puedes verificar con tus propios ojos, más un modo precalculado que funciona sin infraestructura de IA.",
      },
    ],
    disclaimer:
      "Asistido por IA y orientativo — no es asesoría legal. Los PDF subidos se analizan en memoria y nunca se almacenan.",
  },
  samples: {
    "vendor-msa": {
      title: "Vendor Master Services Agreement",
      type: "MSA · consultoría",
      blurb:
        "El documento de proveedor clásico: renovación automática con trampa de aviso de 180 días, indemnización unilateral, límite de responsabilidad de 3 meses — y una cláusula de modificación unilateral.",
      traps: ["renovación automática", "indemnización unilateral", "límite de responsabilidad bajo", "modificación unilateral"],
    },
    "saas-subscription": {
      title: "SaaS Subscription Agreement",
      type: "SaaS · suscripción",
      blurb:
        "Escalada de precios apilada con renovación automática, sin recursos de SLA, datos bloqueados al salir, y cambios de términos del tipo 'el uso continuado constituye aceptación'.",
      traps: ["escalada de precios", "sin recurso de SLA", "tarifa de recuperación de datos", "cambio de términos silencioso"],
    },
    "employment-offer": {
      title: "Senior Consultant Employment Agreement",
      type: "Laboral",
      blurb:
        "No competencia amplia, confidencialidad perpetua, clawback del preaviso no pagado y cesión de propiedad intelectual que invade proyectos personales.",
      traps: ["no competencia", "NDA perpetuo", "clawback", "cesión amplia de PI"],
    },
  },
  reviewer: {
    trySample: "Prueba un contrato de ejemplo",
    upload: "Sube tu PDF",
    samplesNote:
      "Ejemplos: PDFs reales analizados por el mismo pipeline, precalculados para que se abran al instante. Las subidas se procesan en vivo por el pipeline del LLM. Solo PDFs basados en texto (máx. 8 MB).",
    stages: [
      "Leyendo el documento…",
      "Extrayendo cláusulas…",
      "Ponderando riesgos…",
      "Localizando citas en la página…",
    ],
    analysisFailed: "El análisis falló.",
    noLlmTip:
      "Consejo: los tres contratos de ejemplo funcionan sin ninguna clave de API — su análisis viene precalculado.",
    networkError: "Error de red — no se pudo alcanzar el endpoint de análisis.",
    choosePdf: "Elige un archivo PDF.",
    tooLarge: "PDF demasiado grande (máx. 8 MB).",
    copied: "Copiado ✓",
    copySummary: "Copiar resumen",
    pages: "{n} página(s)",
    precomputed: "análisis precalculado",
    live: "análisis en vivo",
    liveAnalysis: "análisis en vivo en {s}s",
    flagsNote: "cada alerta señala su texto de origen",
    notFound: "cita no encontrada",
    noClauses: "{n} cláusulas notables encontradas.",
    riskLabel: { high: "Riesgo alto", medium: "Revisar", low: "OK" },
    risk: { high: "alto", medium: "medio", low: "bajo" },
    copyTitle: "Revisión de contrato — {doc}",
    copyExcerpt: "Extracto",
    copyWhy: "Por qué importa",
    copyAsk: "Petición de negociación",
    copyDisclaimer: "Revisión asistida por IA — orientativa, no asesoría legal.",
  },
  footer: {
    disclaimer:
      "Proyecto de portafolio de Rico. El análisis es asistido por IA y orientativo — no es asesoría legal. Sin afiliación ni respaldo de uang.ai.",
  },
  notFound: {
    text: "Esta página no está en el contrato.",
    back: "Volver a la revisión",
  },
  qa: {
    heading: "P y R",
    intro:
      "Respuestas directas sobre el propio UangCounsel: qué es real, qué está precalculado, cómo funciona el pipeline y qué pasa con tus datos.",
    cover: "¿Algo que las P y R no cubren? Prueba el ",
    coverLink: "revisor",
    coverTail: " y compruébalo tú mismo.",
    categories: {
      project: {
        label: "El proyecto",
        items: [
          {
            q: "¿Qué es UangCounsel?",
            a: "Una herramienta de revisión de contratos con IA construida como pieza de portafolio: sube un contrato PDF basado en texto y recibe alertas de riesgo a nivel de cláusula, cada una señalando el texto resaltado exacto que la activó, más una explicación de negocio de una frase y una petición de negociación por cláusula.",
          },
          {
            q: "¿Por qué lo construiste?",
            a: "Como la tercera pieza de un escaparate para uang.ai (\"The AI Factory\"): UangLite demuestra que un agente puede operar una app de negocio con seguridad, UangFactory demuestra que un sitio web puede probar en vez de contar, y UangCounsel demuestra que el mismo lenguaje de diseño funciona en documentos no estructurados — uno de los verticales de casos de estudio de la propia uang.ai (legal).",
          },
          {
            q: "¿Está afiliado a uang.ai?",
            a: "No. Trabajo de portafolio independiente de Rico — sin afiliación ni respaldo de uang.ai. Se inspira en su posicionamiento: comprensión de negocio + ingeniería + experiencia en IA.",
          },
          {
            q: "¿Es esto asesoría legal?",
            a: "No. El análisis es asistido por IA y orientativo. Está diseñado para decirte dónde mirar y qué preguntar, no para reemplazar a un abogado. Cada salida lo dice.",
          },
        ],
      },
      real: {
        label: "Real vs. precalculado",
        items: [
          {
            q: "¿El análisis es IA real?",
            a: "Sí. Los PDF subidos se procesan en vivo por un pipeline de LLM (cualquier endpoint compatible con OpenAI). Los tres contratos de ejemplo incluyen análisis precalculados — producidos por exactamente el mismo pipeline, luego congelados para que la demo abra al instante y no cueste nada.",
          },
          {
            q: "¿Cómo sé que los resaltados no son falsos?",
            a: "Cada resaltado es geometría, no una captura: el servidor localiza la cita textual del modelo en un índice de coordenadas a nivel de carácter del PDF. Si una cita no se encuentra — por ejemplo porque el modelo la truncó — la tarjeta de la cláusula dice 'cita no encontrada' en vez de fingir.",
          },
          {
            q: "¿Qué pasa sin una clave de API?",
            a: "Los ejemplos siguen funcionando por completo (precalculados), y las subidas devuelven un mensaje claro 'endpoint de LLM no configurado' en vez de una pantalla rota. La degradación elegante es un principio de diseño aquí, no una ocurrencia tardía.",
          },
          {
            q: "¿Puede alucinar el modelo?",
            a: "Puede alucinar una cita — exactamente por eso existe el paso de localización. El pipeline solo muestra una cita que puede encontrar textualmente en el documento; todo lo demás se repara (un reintento) o se etiqueta como no encontrada. Los campos 'por qué' y 'sugerencia' son juicio del modelo y están marcados como orientativos.",
          },
        ],
      },
      pipeline: {
        label: "Cómo funciona",
        items: [
          {
            q: "¿Cómo funciona el resaltado, técnicamente?",
            a: "pdf.js extrae cada carácter con su posición en la página. Eso construye un índice de coordenadas; la cita del modelo se empareja con él (sin distinguir mayúsculas, tolerante a espacios, con respaldo de fragmentos de elipsis) y se fusiona en un rectángulo por línea visual. El visor renderiza el PDF en canvas y posiciona superposiciones de color en esas coordenadas.",
          },
          {
            q: "¿Qué mantiene válida la salida del LLM?",
            a: "Una forma JSON estricta está escrita en el prompt (los endpoints compatibles con OpenAI a menudo corren sin exigencia dura de esquema), la salida se valida con zod con normalización indulgente (p. ej. 'High' → 'high'), y un intento fallido recibe exactamente un viaje de reparación antes de caer en un error claro.",
          },
          {
            q: "¿Cuáles son los límites?",
            a: "Solo PDFs basados en texto — los documentos escaneados no tienen texto extraíble y se rechazan con una explicación. Máximo 8 MB y 40 páginas. Los diseños de varias columnas pueden estresar las heurísticas de fusión de líneas. Limitado a 10 análisis por minuto por IP.",
          },
        ],
      },
      privacy: {
        label: "Privacidad y datos",
        items: [
          {
            q: "¿Almacenan mis contratos subidos?",
            a: "No. Las subidas se analizan en memoria y se descartan. No hay base de datos en este proyecto — nada de tu documento persiste después de enviar la respuesta.",
          },
          {
            q: "¿Qué ve el proveedor del LLM?",
            a: "El texto extraído del documento que subes se envía al endpoint de LLM configurado para analizarlo. Eso es inherente a cualquier revisión con LLM. Para contratos sensibles, ejecuta tu propia instancia — todo el pipeline funciona autoalojado con un endpoint de modelo local.",
          },
        ],
      },
      stack: {
        label: "Stack y meta",
        items: [
          {
            q: "¿Con qué está construido?",
            a: "Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · TypeScript · AI SDK con cualquier endpoint compatible con OpenAI · pdf.js para parseo y render · Vitest para pruebas unitarias · Playwright para pruebas end-to-end. Sin base de datos por diseño.",
          },
          {
            q: "¿Cómo se probó?",
            a: "Las pruebas unitarias cubren la capa de geometría (localización de citas, respaldo de fragmentos) y la validación de salida. Las pruebas end-to-end de Playwright cubren el flujo completo: abrir un ejemplo, ver los resaltados, hacer clic en una cláusula para saltar a su texto de origen, cambio de tema y la página de P y R.",
          },
          {
            q: "¿De dónde viene el modo oscuro/claro?",
            a: "Un sistema de tokens hecho a mano (CSS custom properties + Tailwind 4), persistido por navegador, siguiendo prefers-color-scheme en la primera visita. Sin librería de UI.",
          },
          {
            q: "¿Puedo ejecutar mi propia instancia?",
            a: "Sí — es open source. Clona el repo, opcionalmente define LLM_BASE_URL / LLM_API_KEY / LLM_MODEL como variables de entorno (funciona cualquier endpoint compatible con OpenAI, incluso local) y despliega. Todo lo demás funciona sin configuración.",
          },
        ],
      },
    },
  },
};
