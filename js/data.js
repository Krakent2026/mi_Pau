// ============================================================================
//  Datos PAU 2026 — Región de Murcia
//  Fuente: UMU/UPCT (PAU2026), guías oficiales y academias acreditadas.
//  Última actualización: abril 2026.
// ============================================================================

window.PAU_DATA = {
  region: "Región de Murcia",
  curso: "2025-2026",

  // Fechas oficiales convocatoria ordinaria y extraordinaria
  convocatorias: {
    ordinaria: {
      matricula: { inicio: "2026-05-11", fin: "2026-05-27" },
      examenes: ["2026-06-02", "2026-06-03", "2026-06-04"],
      publicacionNotas: "2026-06-10",
      // Calendario detallado por bloques (orientativo según horarios típicos UMU)
      calendario: [
        { fecha: "2026-06-02", hora: "09:00", duracion: 90, materias: ["Lengua Castellana y Literatura II"] },
        { fecha: "2026-06-02", hora: "11:30", duracion: 90, materias: ["Historia de España", "Historia de la Filosofía"] },
        { fecha: "2026-06-02", hora: "16:00", duracion: 90, materias: ["Inglés"] },
        { fecha: "2026-06-03", hora: "09:00", duracion: 90, materias: ["Matemáticas II", "Mat. Aplicadas a CC.SS. II", "Latín II", "Dibujo Artístico II"] },
        { fecha: "2026-06-03", hora: "11:30", duracion: 90, materias: ["Biología", "Geografía", "Dibujo Técnico II"] },
        { fecha: "2026-06-03", hora: "16:00", duracion: 90, materias: ["Química", "Historia del Arte", "Empresa y Modelos de Negocio"] },
        { fecha: "2026-06-04", hora: "09:00", duracion: 90, materias: ["Física", "Literatura Universal", "Tecnología e Ing. II"] },
        { fecha: "2026-06-04", hora: "11:30", duracion: 90, materias: ["Francés", "Italiano", "Griego II", "Geología y CC. Amb."] },
      ],
    },
    extraordinaria: {
      matricula: { inicio: "2026-06-17", fin: "2026-06-24" },
      examenes: ["2026-06-30", "2026-07-01", "2026-07-02"],
      publicacionNotas: "2026-07-07",
      calendario: [
        { fecha: "2026-06-30", hora: "09:00", duracion: 90, materias: ["Lengua Castellana y Literatura II"] },
        { fecha: "2026-06-30", hora: "11:30", duracion: 90, materias: ["Historia de España", "Historia de la Filosofía"] },
        { fecha: "2026-06-30", hora: "16:00", duracion: 90, materias: ["Inglés"] },
        { fecha: "2026-07-01", hora: "09:00", duracion: 90, materias: ["Matemáticas II", "Mat. Aplicadas a CC.SS. II", "Latín II"] },
        { fecha: "2026-07-01", hora: "11:30", duracion: 90, materias: ["Biología", "Geografía", "Dibujo Técnico II"] },
        { fecha: "2026-07-01", hora: "16:00", duracion: 90, materias: ["Química", "Historia del Arte", "Empresa"] },
        { fecha: "2026-07-02", hora: "09:00", duracion: 90, materias: ["Física", "Literatura Universal", "Tecnología e Ing. II"] },
        { fecha: "2026-07-02", hora: "11:30", duracion: 90, materias: ["Francés", "Italiano", "Griego II"] },
      ],
    },
  },

  // Fórmula de nota
  formula: {
    notaAcceso: "0.6 × Nota Media Bachillerato + 0.4 × Fase General",
    notaAdmision: "Nota Acceso + a·M1 + b·M2 (a,b ∈ {0.1, 0.15, 0.2})",
    minimoFaseGeneral: 4,
    minimoAcceso: 5,
  },

  // Modalidades de Bachillerato y materia troncal asociada
  modalidades: {
    ciencias: {
      nombre: "Ciencias y Tecnología",
      troncalModalidad: ["Matemáticas II"],
      especificasFrecuentes: ["Biología", "Química", "Física", "Dibujo Técnico II", "Tecnología e Ingeniería II", "Geología y Ciencias Ambientales"],
    },
    humanidades: {
      nombre: "Humanidades",
      troncalModalidad: ["Latín II"],
      especificasFrecuentes: ["Literatura Universal", "Historia del Arte", "Griego II", "Geografía", "Francés", "Italiano"],
    },
    sociales: {
      nombre: "Ciencias Sociales",
      troncalModalidad: ["Matemáticas Aplicadas a las Ciencias Sociales II"],
      especificasFrecuentes: ["Geografía", "Historia del Arte", "Empresa y Diseño de Modelos de Negocio", "Literatura Universal", "Francés"],
    },
    artes: {
      nombre: "Artes",
      troncalModalidad: ["Dibujo Artístico II", "Artes Escénicas II", "Análisis Musical II"],
      especificasFrecuentes: ["Historia del Arte", "Literatura Universal", "Diseño", "Cultura Audiovisual II"],
    },
    general: {
      nombre: "General",
      troncalModalidad: ["Ciencias Generales"],
      especificasFrecuentes: ["Geografía", "Historia del Arte", "Empresa y Diseño de Modelos de Negocio"],
    },
  },

  // Materias comunes (Fase General) — se examinan TODOS
  materiasComunes: [
    {
      id: "lengua",
      nombre: "Lengua Castellana y Literatura II",
      color: "#ef4444",
      duracionExamen: 90,
      estructura: [
        { bloque: "1. Comunicación escrita", puntos: 4, temas: [
          "Tema y ideas principales del texto",
          "Texto argumentativo (introducción, argumentos, conclusión)",
          "Tipologías textuales y funciones del lenguaje",
        ]},
        { bloque: "2. Conocimiento sobre la lengua", puntos: 3, temas: [
          "Sintaxis (oración del texto o ajena)",
          "Análisis morfológico",
          "Cohesión textual",
        ]},
        { bloque: "3. Educación literaria", puntos: 3, temas: [
          "Miguel Hernández: 'El rayo que no cesa' y 'Viento del pueblo'",
          "Federico García Lorca: 'La Casa de Bernarda Alba'",
          "Carmen Laforet: 'Nada'",
        ]},
      ],
      penalizaciones: "Hasta 2 puntos por ortografía, 1 por expresión, 0,5 por presentación.",
    },
    {
      id: "historia",
      nombre: "Historia de España",
      color: "#f59e0b",
      duracionExamen: 90,
      estructura: [
        { bloque: "Parte A — Preguntas cortas", puntos: 3, temas: [
          "4 preguntas a elegir 2 (una de Bloque A y otra de Bloque B, o ambas mezcladas)",
        ]},
        { bloque: "Parte B — Comentario de textos", puntos: 4, temas: [
          "Dos textos del mismo periodo (s.XIX o s.XX-XXI), 4 cuestiones",
        ]},
        { bloque: "Parte C — Tema de desarrollo", puntos: 3, temas: [
          "Dos cuestiones de desarrollo, se elige una (del periodo no tratado en B)",
        ]},
      ],
      bloquesContenido: [
        "Bloque A: Romanización · Al-Ándalus · Edad Media (Castilla y Aragón)",
        "Bloque B: Reyes Católicos · Austrias · Descubrimiento América · Borbones siglo XVIII",
        "Siglo XIX: Cortes de Cádiz · Fernando VII · Isabel II · Sexenio · Restauración",
        "Siglo XX: Alfonso XIII · Primo de Rivera · II República · Guerra Civil · Franquismo · Transición",
      ],
    },
    {
      id: "filosofia",
      nombre: "Historia de la Filosofía",
      color: "#a855f7",
      duracionExamen: 90,
      alternativaCon: "historia",
      estructura: [
        { bloque: "Ejercicio 1 — Análisis de texto", puntos: 4, temas: [
          "Análisis de fragmento (2 pts)",
          "Relación con otra posición filosófica (2 pts)",
        ]},
        { bloque: "Ejercicio 2 — Disertación", puntos: 3, temas: [
          "Disertación 350 palabras sobre actualidad de las ideas",
        ]},
        { bloque: "Ejercicio 3 — Desarrollo temático", puntos: 3, temas: [
          "Contenido temático vinculado al texto",
        ]},
      ],
      autores: ["Platón", "Aristóteles", "Agustín de Hipona", "Tomás de Aquino", "Descartes", "Locke", "Hume", "Kant", "Marx", "Nietzsche", "Ortega y Gasset"],
    },
    {
      id: "ingles",
      nombre: "Lengua Extranjera II — Inglés",
      color: "#3b82f6",
      duracionExamen: 90,
      estructura: [
        { bloque: "I. Reading (texto único 450-500 palabras)", puntos: 3, temas: [
          "Ej.1: 4 ítems V/F + multiple choice (1,6 pts)",
          "Ej.2: 2 ítems respuesta semiabierta (1 pt)",
          "Ej.3: 4 ítems léxico 'Find a word that means…' (0,4 pts)",
        ]},
        { bloque: "II. Use of English", puntos: 3, temas: [
          "Ej.4: 15 ítems respuesta cerrada (1,5 pts)",
          "Ej.5: 5 ítems a elegir 3 semiabierta (1,5 pts)",
        ]},
        { bloque: "III. Writing (150-175 palabras)", puntos: 4, temas: [
          "Tipologías: informal email, formal email, for-and-against, opinion essay",
        ]},
      ],
    },
  ],

  // Materias troncales de modalidad (una elegida)
  materiasModalidad: [
    {
      id: "matematicas2",
      nombre: "Matemáticas II",
      color: "#10b981",
      modalidad: "ciencias",
      duracionExamen: 90,
      estructura: [
        { bloque: "P1 — Modelización (competencial)", puntos: 2, temas: ["Análisis aplicado a contexto real"] },
        { bloque: "P2 obligatoria", puntos: 2, temas: ["Análisis o álgebra"] },
        { bloque: "P3 obligatoria", puntos: 2, temas: ["Geometría o probabilidad"] },
        { bloque: "P4 (a elegir)", puntos: 2, temas: ["Análisis o álgebra"] },
        { bloque: "P5 (a elegir)", puntos: 2, temas: ["Probabilidad / geometría"] },
      ],
      bloquesContenido: [
        "Análisis (4 pts) — Límites, continuidad, derivadas, integrales, Lagrange",
        "Álgebra (2 pts) — Matrices, determinantes, sistemas",
        "Geometría (2 pts) — Vectores, rectas, planos, posiciones",
        "Probabilidad y estadística (2 pts) — Combinatoria, distribuciones",
      ],
    },
    {
      id: "matematicasccss",
      nombre: "Matemáticas Aplicadas a las CCSS II",
      color: "#10b981",
      modalidad: "sociales",
      duracionExamen: 90,
      estructura: [
        { bloque: "P1 obligatoria", puntos: 3, temas: [] },
        { bloque: "P2 obligatoria", puntos: 2, temas: [] },
        { bloque: "P3 (3.1 o 3.2)", puntos: 3, temas: [] },
        { bloque: "P4 (4.1 o 4.2)", puntos: 2, temas: [] },
      ],
      bloquesContenido: [
        "Estadística y probabilidad (3 pts)",
        "Álgebra lineal (4 pts)",
        "Análisis (3 pts)",
      ],
    },
    {
      id: "latin2",
      nombre: "Latín II",
      color: "#a855f7",
      modalidad: "humanidades",
      duracionExamen: 90,
      estructura: [
        { bloque: "Cuestión 1 — Traducción con diccionario", puntos: 4, temas: ["Texto A: Eutropio · Texto B: Ovidio"] },
        { bloque: "Cuestión 2 — Análisis morfológico", puntos: 1, temas: ["4 palabras"] },
        { bloque: "Cuestión 3 — Análisis sintáctico", puntos: 1, temas: [] },
        { bloque: "Cuestión 4 — Evolución fonética", puntos: 2, temas: ["4 términos latinos"] },
        { bloque: "Cuestión 5 — Mitología clásica", puntos: 2, temas: ["Identificar y narrar mito"] },
      ],
    },
  ],

  // Específicas más comunes (Fase Voluntaria)
  materiasEspecificas: [
    {
      id: "biologia",
      nombre: "Biología",
      color: "#22c55e",
      duracionExamen: 90,
      bloquesContenido: [
        "A. Las biomoléculas (2 pts)",
        "B. Genética molecular y mendeliana (2 pts)",
        "C. Biología celular (2 pts)",
        "D. Metabolismo (2 pts)",
        "E. Ingeniería genética y biotecnología (1 pt)",
        "F. Inmunología (1 pt)",
      ],
      estructura: [
        { bloque: "2 preguntas obligatorias competenciales", puntos: 4, temas: [] },
        { bloque: "3 preguntas con opcionalidad", puntos: 6, temas: [] },
      ],
    },
    {
      id: "quimica",
      nombre: "Química",
      color: "#06b6d4",
      duracionExamen: 90,
      bloquesContenido: [
        "1. Estructura atómica y enlace (A o B)",
        "2. Termodinámica, cinética y equilibrio (A o B)",
        "3. Ácido-base (A o B)",
        "4. Redox (A o B)",
        "5. Química orgánica (obligatoria, sin opciones)",
      ],
    },
    {
      id: "fisica",
      nombre: "Física",
      color: "#6366f1",
      duracionExamen: 90,
      bloquesContenido: [
        "A. Campo gravitatorio — obligatoria sin opciones (2 pts)",
        "B. Campo electromagnético (3 pts, A o B)",
        "C. Vibraciones y ondas (3 pts, A o B)",
        "D. Física relativista, cuántica, nuclear y de partículas (2 pts, A o B)",
      ],
    },
    {
      id: "dibujo",
      nombre: "Dibujo Técnico II",
      color: "#ec4899",
      duracionExamen: 90,
      bloquesContenido: [
        "Bloque 1. Fundamentos geométricos (30%)",
        "Bloque 2. Geometría descriptiva — Diédrico, axonométrico, cónica (50%)",
        "Bloque 3. Normalización y documentación gráfica (20%)",
      ],
    },
    {
      id: "geografia",
      nombre: "Geografía",
      color: "#84cc16",
      duracionExamen: 90,
      bloquesContenido: [
        "A. España, Europa y la globalización",
        "B. Sostenibilidad del medio físico de España",
        "C. Ordenación del territorio (enfoque ecosocial)",
      ],
    },
    {
      id: "empresa",
      nombre: "Empresa y Diseño de Modelos de Negocio",
      color: "#f97316",
      duracionExamen: 90,
      bloquesContenido: [
        "1. La empresa y su entorno",
        "2. Modelo de negocio y de gestión",
        "3. Patrones e innovación",
        "4. Estrategia empresarial",
      ],
    },
    {
      id: "tecnologia",
      nombre: "Tecnología e Ingeniería II",
      color: "#0891b2",
      duracionExamen: 90,
      bloquesContenido: [
        "A. Proyectos I+D",
        "B. Materiales y fabricación",
        "C. Sistemas mecánicos",
        "D. Sistemas eléctricos y electrónicos",
        "E. Sistemas informáticos emergentes",
        "F. Sistemas automáticos",
        "G. Tecnología sostenible",
      ],
    },
    {
      id: "arte",
      nombre: "Historia del Arte",
      color: "#d946ef",
      duracionExamen: 90,
      bloquesContenido: [
        "Arte clásico (Grecia y Roma)",
        "Arte medieval",
        "Renacimiento y Barroco",
        "Siglos XIX y XX (Vanguardias)",
      ],
    },
    {
      id: "frances",
      nombre: "Francés (Segunda Lengua Extranjera)",
      color: "#1e40af",
      duracionExamen: 90,
      bloquesContenido: [
        "I. Comprensión lectora",
        "II. Uso de la lengua",
        "III. Producción escrita",
      ],
    },
  ],

  // Recursos oficiales y de calidad
  recursos: [
    { titulo: "PAU Universidad de Murcia (UMU)", url: "https://www.um.es/web/estudios/acceso/estudiantes-bachillerato-y-ciclos-formativos", tipo: "oficial" },
    { titulo: "Estructura de las pruebas PAU 2026 (UMU)", url: "https://www.um.es/documents/d/estudios/co-pau2026-1-doc-4-estructura-de-las-pruebas-de-acceso", tipo: "oficial" },
    { titulo: "Admisión UPCT (Cartagena)", url: "https://admision.upct.es/", tipo: "oficial" },
    { titulo: "Ponderaciones admisión UMU 2026", url: "https://www.um.es/web/estudios/utilidades/ponderaciones", tipo: "oficial" },
    { titulo: "Notas de corte UMU 2025/2026", url: "https://www.um.es/web/estudios/admision/notas-de-corte", tipo: "oficial" },
    { titulo: "Exámenes resueltos PAU Matemáticas Murcia", url: "https://www.ebaumatematicas.com/examenes-matematicas-murcia/", tipo: "examenes" },
    { titulo: "Selectividad.tv — exámenes resueltos", url: "https://www.selectividad.tv/", tipo: "examenes" },
    { titulo: "Unicoos (Matemáticas, Física, Química)", url: "https://www.unicoos.com/", tipo: "video" },
    { titulo: "Academia Nota — Guía PAU Murcia", url: "https://academianota.com/guia-definitiva-para-la-pau-2026-en-murcia/", tipo: "guia" },
  ],

  // Frases motivacionales
  frases: [
    "El éxito es la suma de pequeños esfuerzos repetidos día tras día.",
    "No tienes que ser perfecta, solo constante.",
    "Cada tema que dominas es un paso más hacia tu carrera soñada.",
    "Estudiar 1 hora hoy vale más que 5 horas la noche antes del examen.",
    "Los errores en los simulacros son lecciones gratis.",
    "Respira hondo. Tienes más tiempo del que crees.",
    "La memoria se construye con repaso, no con desesperación.",
    "Hoy es un buen día para sumar otro tema dominado.",
    "Descansar también es parte del estudio.",
    "Confía en el proceso: cada día estás más cerca.",
  ],
};
