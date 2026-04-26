/* ============================================================
 *  Banco de preguntas tipo test por materia
 *  Cada pregunta: { q: enunciado, opts: [4 opciones], correct: índice 0-3, expl: explicación }
 * ============================================================ */

window.PAU_TESTS = {
  lengua: {
    nombre: "Lengua Castellana y Literatura II",
    preguntas: [
      { q: "¿Qué función del lenguaje predomina en una receta de cocina?", opts: ["Expresiva", "Apelativa", "Referencial", "Poética"], correct: 1, expl: "La función apelativa busca influir en el receptor: dar instrucciones." },
      { q: "Identifica la figura: 'Sus cabellos eran oro'", opts: ["Símil", "Metáfora pura", "Metonimia", "Hipérbole"], correct: 1, expl: "Metáfora pura: A es B (no se compara, se identifica)." },
      { q: "¿Quién escribió 'Nada' (1944)?", opts: ["Carmen Martín Gaite", "Carmen Laforet", "Ana María Matute", "Rosa Chacel"], correct: 1, expl: "Carmen Laforet, Premio Nadal 1944." },
      { q: "Marca la oración con sujeto omitido (elíptico)", opts: ["Llueve mucho hoy", "Hay tres libros", "Estudio para la PAU", "Se vive mejor aquí"], correct: 2, expl: "'Estudio' tiene sujeto elíptico 'yo'. Las otras son impersonales." },
      { q: "¿Qué tipo de texto es un editorial periodístico?", opts: ["Narrativo", "Descriptivo", "Argumentativo", "Expositivo"], correct: 2, expl: "El editorial defiende una tesis con argumentos: argumentativo." },
      { q: "'La casa de Bernarda Alba' pertenece al género…", opts: ["Lírico", "Narrativo", "Dramático", "Didáctico"], correct: 2, expl: "Es una obra teatral (drama) de Federico García Lorca." },
      { q: "¿Cuál es el complemento directo en: 'Compré flores a mi madre'?", opts: ["A mi madre", "Flores", "Mi madre", "Compré"], correct: 1, expl: "'Flores' es el CD (acepta sustitución por 'las'). 'A mi madre' es CI." },
    ],
  },

  historia: {
    nombre: "Historia de España",
    preguntas: [
      { q: "¿Qué año se promulgó la Constitución de Cádiz?", opts: ["1810", "1812", "1814", "1820"], correct: 1, expl: "1812, conocida como 'La Pepa' por proclamarse el día de San José." },
      { q: "El Sexenio Democrático abarca…", opts: ["1854-1860", "1868-1874", "1875-1881", "1898-1904"], correct: 1, expl: "1868 (La Gloriosa) – 1874 (golpe de Pavía y restauración borbónica)." },
      { q: "¿Quién diseñó el sistema de Restauración?", opts: ["Sagasta", "Maura", "Cánovas del Castillo", "Romero Robledo"], correct: 2, expl: "Antonio Cánovas del Castillo, basado en el turnismo bipartidista." },
      { q: "El Plan de Estabilización es de…", opts: ["1939", "1959", "1969", "1975"], correct: 1, expl: "1959. Marcó el paso de la autarquía al desarrollismo." },
      { q: "¿En qué año se aprobó la Constitución española vigente?", opts: ["1976", "1977", "1978", "1981"], correct: 2, expl: "Referéndum del 6 de diciembre de 1978." },
      { q: "La II República se proclamó el…", opts: ["12 abril 1931", "14 abril 1931", "1 abril 1931", "18 julio 1931"], correct: 1, expl: "14 de abril de 1931, tras las elecciones municipales del 12 de abril." },
      { q: "¿Quién firmó el Tratado de Tordesillas?", opts: ["Carlos I", "Reyes Católicos", "Felipe II", "Juan II"], correct: 1, expl: "1494, Reyes Católicos con Portugal, repartió el Atlántico." },
    ],
  },

  ingles: {
    nombre: "English",
    preguntas: [
      { q: "She _____ to Paris last summer.", opts: ["has gone", "went", "goes", "had gone"], correct: 1, expl: "Past simple: 'last summer' indica un tiempo terminado." },
      { q: "If I _____ rich, I would travel the world.", opts: ["am", "was", "were", "had been"], correct: 2, expl: "Second conditional: 'If + were' (en formal) para situaciones hipotéticas." },
      { q: "The book _____ by millions.", opts: ["read", "reads", "is read", "is reading"], correct: 2, expl: "Pasiva en presente simple: is/are + past participle." },
      { q: "I look forward to _____ from you.", opts: ["hear", "hearing", "to hear", "heard"], correct: 1, expl: "'Look forward to' va seguido de gerundio (-ing)." },
      { q: "He told me _____ late.", opts: ["don't be", "not be", "not to be", "to not be"], correct: 2, expl: "Estilo indirecto + negativo: 'told me not to be'." },
      { q: "Choose the correct: She has lived here _____ ten years.", opts: ["since", "for", "during", "ago"], correct: 1, expl: "'For' + periodo de tiempo. 'Since' + momento concreto." },
      { q: "By the time we arrived, the film _____.", opts: ["started", "has started", "had started", "was starting"], correct: 2, expl: "Past perfect: acción anterior a otra acción pasada." },
    ],
  },

  matematicas2: {
    nombre: "Matemáticas II",
    preguntas: [
      { q: "Derivada de f(x) = x³·sen(x)", opts: ["3x²·cos(x)", "3x²·sen(x) + x³·cos(x)", "3x²·sen(x) − x³·cos(x)", "x²·(3sen(x) + cos(x))"], correct: 1, expl: "Regla del producto: (uv)' = u'v + uv'." },
      { q: "∫ 2x·cos(x²) dx =", opts: ["sen(x²) + C", "−sen(x²) + C", "cos(x²) + C", "x²·sen(x²) + C"], correct: 0, expl: "Cambio u = x², du = 2x dx. ∫ cos(u) du = sen(u)." },
      { q: "Determinante de [[2,1],[3,4]]", opts: ["5", "11", "−5", "8"], correct: 0, expl: "2·4 − 1·3 = 8 − 3 = 5." },
      { q: "Si A y B son sucesos independientes y P(A)=0,4, P(B)=0,3, P(A∩B)=", opts: ["0,7", "0,12", "0,1", "0,58"], correct: 1, expl: "Independientes: P(A∩B) = P(A)·P(B) = 0,4·0,3 = 0,12." },
      { q: "Vector director de la recta r: (x−1)/2 = (y+3)/−1 = z/4", opts: ["(1, −3, 0)", "(2, −1, 4)", "(−2, 1, −4)", "(1, 3, 0)"], correct: 1, expl: "Los denominadores en la ecuación continua son las componentes del vector director." },
      { q: "Si f es continua en [a,b] y f(a)·f(b)<0, ∃ c ∈ (a,b): f(c)=0. Es el…", opts: ["Teorema de Weierstrass", "Teorema de Bolzano", "Teorema de Rolle", "Teorema de Lagrange"], correct: 1, expl: "Teorema de Bolzano: existencia de raíz." },
      { q: "lim_{x→0} sen(x)/x =", opts: ["0", "1", "∞", "No existe"], correct: 1, expl: "Límite notable. También se ve por L'Hôpital: cos(x)/1 → 1." },
    ],
  },

  filosofia: {
    nombre: "Historia de la Filosofía",
    preguntas: [
      { q: "El mito de la caverna pertenece a…", opts: ["Aristóteles", "Platón", "Sócrates", "Descartes"], correct: 1, expl: "Libro VII de La República de Platón." },
      { q: "'Cogito, ergo sum' es de…", opts: ["Spinoza", "Leibniz", "Descartes", "Hume"], correct: 2, expl: "Descartes, Discurso del método (1637)." },
      { q: "El imperativo categórico fue formulado por…", opts: ["Hegel", "Kant", "Nietzsche", "Marx"], correct: 1, expl: "Immanuel Kant, ética del deber." },
      { q: "¿Quién dijo 'Dios ha muerto'?", opts: ["Marx", "Nietzsche", "Freud", "Sartre"], correct: 1, expl: "Nietzsche, 'La gaya ciencia'. Crítica radical a la moral cristiana." },
      { q: "El materialismo histórico es de…", opts: ["Comte", "Marx", "Engels solo", "Hegel"], correct: 1, expl: "Karl Marx (con Engels). La historia se explica por las relaciones de producción." },
      { q: "Empirismo radical: 'todo conocimiento procede de la experiencia'", opts: ["Descartes", "Locke", "Hume", "Kant"], correct: 2, expl: "David Hume llevó el empirismo hasta el escepticismo radical." },
    ],
  },

  biologia: {
    nombre: "Biología",
    preguntas: [
      { q: "¿Cuál NO es una base nitrogenada del ADN?", opts: ["Adenina", "Uracilo", "Citosina", "Timina"], correct: 1, expl: "Uracilo es exclusivo del ARN. En ADN: A, T, G, C." },
      { q: "Orgánulo donde ocurre la fotosíntesis", opts: ["Mitocondria", "Cloroplasto", "Núcleo", "Retículo"], correct: 1, expl: "Cloroplasto, en la membrana de los tilacoides." },
      { q: "Fase en la que cromátidas hermanas se separan", opts: ["Profase", "Metafase", "Anafase", "Telofase"], correct: 2, expl: "Anafase: las cromátidas migran a polos opuestos." },
      { q: "El ATP se sintetiza principalmente en…", opts: ["Núcleo", "Citoplasma", "Cresta mitocondrial", "Lisosoma"], correct: 2, expl: "ATP-sintasa en la membrana interna mitocondrial (cadena respiratoria)." },
      { q: "Genotipo Aa × Aa: proporción fenotípica esperada (A dominante)", opts: ["3:1", "1:2:1", "1:1", "9:3:3:1"], correct: 0, expl: "3 dominantes (AA, Aa, aA) : 1 recesivo (aa). Fenotipo." },
      { q: "Linfocitos B producen…", opts: ["Anticuerpos", "Interferón", "Histamina", "Lisozima"], correct: 0, expl: "Linfocitos B → células plasmáticas → anticuerpos (inmunidad humoral)." },
    ],
  },

  quimica: {
    nombre: "Química",
    preguntas: [
      { q: "pH de una disolución con [H₃O⁺] = 10⁻³ M", opts: ["3", "−3", "11", "10"], correct: 0, expl: "pH = −log[H₃O⁺] = −log(10⁻³) = 3. Disolución ácida." },
      { q: "El número atómico (Z) indica…", opts: ["Nº de neutrones", "Nº de protones", "Masa atómica", "Nº de electrones de valencia"], correct: 1, expl: "Z = nº de protones (= electrones en átomo neutro)." },
      { q: "Reacción exotérmica: ΔH es…", opts: ["Positivo", "Negativo", "Cero", "Indeterminado"], correct: 1, expl: "Exotérmica libera calor → ΔH < 0." },
      { q: "Grupo funcional aldehído", opts: ["−COOH", "−CHO", "−OH", "−NH₂"], correct: 1, expl: "−CHO: carbonilo en carbono terminal." },
      { q: "Ácido fuerte:", opts: ["CH₃COOH", "HF", "HCl", "H₂CO₃"], correct: 2, expl: "HCl se disocia totalmente en agua." },
    ],
  },

  fisica: {
    nombre: "Física",
    preguntas: [
      { q: "Unidad SI de campo eléctrico", opts: ["V/m", "N/C", "A y B son correctas", "T"], correct: 2, expl: "V/m = N/C son equivalentes. La T (tesla) es para campo magnético." },
      { q: "El periodo de un péndulo simple depende de…", opts: ["La masa", "La amplitud", "La longitud y la gravedad", "Todas las anteriores"], correct: 2, expl: "T = 2π√(L/g). No depende de la masa ni (en pequeños ángulos) de la amplitud." },
      { q: "El efecto fotoeléctrico fue explicado por…", opts: ["Planck", "Einstein", "Bohr", "Heisenberg"], correct: 1, expl: "Einstein (1905): luz como cuantos de energía. Premio Nobel 1921." },
      { q: "La fuerza de Lorentz sobre una carga en movimiento es…", opts: ["F=qE", "F=qv×B", "F=qE+qv×B", "F=qvB"], correct: 2, expl: "Forma general: campos eléctrico y magnético combinados." },
      { q: "Velocidad de la luz en el vacío", opts: ["3·10⁶ m/s", "3·10⁸ m/s", "3·10¹⁰ m/s", "9·10⁸ m/s"], correct: 1, expl: "c ≈ 299.792.458 m/s ≈ 3·10⁸ m/s." },
    ],
  },

  geografia: {
    nombre: "Geografía",
    preguntas: [
      { q: "Río más largo de la Península Ibérica", opts: ["Ebro", "Tajo", "Duero", "Guadalquivir"], correct: 1, expl: "Tajo: 1.038 km hasta Lisboa." },
      { q: "Vertiente cantábrica: característica", opts: ["Ríos largos", "Régimen pluvial", "Caudal escaso", "Régimen nival y abundante"], correct: 3, expl: "Ríos cortos pero caudalosos por las precipitaciones constantes." },
      { q: "Clima predominante en Murcia", opts: ["Oceánico", "Mediterráneo árido/semiárido", "Continental", "De montaña"], correct: 1, expl: "Sureste peninsular: precipitaciones <300 mm/año." },
      { q: "Sector con mayor peso en el PIB español", opts: ["Primario", "Industrial", "Construcción", "Servicios"], correct: 3, expl: "Servicios ≈ 74% del PIB." },
    ],
  },

  latin2: {
    nombre: "Latín II",
    preguntas: [
      { q: "Caso del sujeto en latín", opts: ["Acusativo", "Genitivo", "Nominativo", "Dativo"], correct: 2, expl: "El nominativo desempeña la función de sujeto." },
      { q: "Genitivo singular de 'rosa, rosae'", opts: ["rosa", "rosam", "rosae", "rosā"], correct: 2, expl: "1ª declinación, gen. sg.: -ae." },
      { q: "'Vincere' significa", opts: ["Ver", "Vencer", "Venir", "Venerar"], correct: 1, expl: "'Vincere, vinco, vici, victum' = vencer. De ahí 'invicto', 'victoria'." },
      { q: "Evolución de 'noctem'", opts: ["nocha", "noche", "nocte", "noita"], correct: 1, expl: "ct → ch (palatalización): noctem > noche." },
      { q: "Mito en el que un héroe baja al inframundo por amor", opts: ["Heracles", "Teseo", "Orfeo", "Aquiles"], correct: 2, expl: "Orfeo desciende al Hades para recuperar a Eurídice." },
    ],
  },
};
