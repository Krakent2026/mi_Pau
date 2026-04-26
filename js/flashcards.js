/* ============================================================
 *  Mazos de flashcards iniciales por materia
 *  Cada flashcard: { f: frente, b: dorso, tags: [] }
 * ============================================================ */

window.PAU_FLASHCARDS = {
  lengua: {
    nombre: "Lengua Castellana y Literatura II",
    cards: [
      { f: "¿Qué es una metáfora?", b: "Figura retórica que identifica un término real con uno imaginario por su semejanza." },
      { f: "Diferencia entre metonimia y sinécdoque", b: "Metonimia: relación de causa-efecto, contigüidad. Sinécdoque: relación de la parte por el todo (o viceversa)." },
      { f: "¿Qué es la cohesión textual?", b: "Mecanismos lingüísticos que conectan los enunciados de un texto: anáforas, conectores, elipsis, sinónimos…" },
      { f: "Funciones del lenguaje (Jakobson)", b: "Referencial, expresiva, apelativa, fática, metalingüística y poética." },
      { f: "Tipologías textuales", b: "Narrativo, descriptivo, expositivo, argumentativo, dialogado e instructivo." },
      { f: "Autor de 'La casa de Bernarda Alba'", b: "Federico García Lorca (1936). Drama rural, símbolo de la represión." },
      { f: "Autora de 'Nada' y año", b: "Carmen Laforet (1944). Premio Nadal 1944." },
      { f: "Tema central de 'El rayo que no cesa'", b: "Miguel Hernández. El amor doloroso, la pena y la angustia existencial." },
      { f: "¿Qué es una oración subordinada sustantiva?", b: "Funciona como un sustantivo (sujeto, CD, atributo…). Suele ir introducida por 'que' o un infinitivo." },
      { f: "Generación del 27", b: "Lorca, Alberti, Cernuda, Salinas, Aleixandre, Guillén, Diego, Altolaguirre, Prados, Dámaso Alonso." },
    ],
  },

  historia: {
    nombre: "Historia de España",
    cards: [
      { f: "Año Cortes de Cádiz", b: "1810-1813. Constitución de 1812 ('La Pepa')." },
      { f: "Características de la Constitución de 1812", b: "Soberanía nacional, división de poderes, sufragio universal masculino indirecto, confesionalidad católica." },
      { f: "Reinado de Isabel II", b: "1833-1868. Construcción del Estado liberal, guerras carlistas, alternancia moderados/progresistas." },
      { f: "Sexenio Democrático", b: "1868-1874: La Gloriosa, regencia, Amadeo I, I República, golpe de Pavía." },
      { f: "Sistema canovista", b: "Restauración (1874-1923): turnismo entre conservadores (Cánovas) y liberales (Sagasta), caciquismo, Constitución 1876." },
      { f: "Causas de la Guerra Civil", b: "Polarización política, crisis económica, fracaso reformas II República, golpe del 18 julio 1936." },
      { f: "Etapas del franquismo", b: "Posguerra-autarquía (39-59), desarrollismo (59-73), tardofranquismo (73-75)." },
      { f: "Fechas clave Transición", b: "1975 muerte Franco, 1976 Suárez presidente, 1977 elecciones, 1978 Constitución, 1981 23-F, 1982 PSOE." },
      { f: "Reyes Católicos: aportaciones", b: "Unión dinástica, conquista de Granada (1492), descubrimiento América, expulsión judíos, Inquisición." },
      { f: "II República: bienios", b: "Reformista (31-33), conservador (33-36), Frente Popular (36)." },
      { f: "Al-Ándalus: etapas políticas", b: "Emirato dependiente (711-756), independiente (756-929), Califato (929-1031), Reinos de Taifas." },
      { f: "Desamortizaciones del s.XIX", b: "Mendizábal (1836, eclesiástica) y Madoz (1855, civil). Vendieron tierras de manos muertas." },
    ],
  },

  ingles: {
    nombre: "Inglés — Use of English",
    cards: [
      { f: "Reported speech: 'I will go tomorrow' →", b: "He said (that) he would go the following day / the next day." },
      { f: "Third conditional structure", b: "If + past perfect, would have + past participle. Ej: If I had studied, I would have passed." },
      { f: "Phrasal verb: 'put off'", b: "To postpone. Ej: They put off the meeting until next week." },
      { f: "Passive voice: 'They build houses' →", b: "Houses are built (by them)." },
      { f: "Difference 'still' vs 'yet'", b: "Still: action continues (positive/questions). Yet: action not yet completed (negatives/questions, end of sentence)." },
      { f: "Used to vs would (past habits)", b: "Both for past habits. 'Used to' also for past states. 'Would' only actions." },
      { f: "Phrasal verb: 'come across'", b: "To find by chance. Ej: I came across an old letter." },
      { f: "Linking words: contrast", b: "However, although, even though, despite, in spite of, nevertheless, whereas, while." },
      { f: "Linking words: result", b: "Therefore, thus, consequently, as a result, so." },
      { f: "Mixed conditional", b: "If + past perfect, would + verb. Ej: If I had studied harder, I would be a doctor now." },
      { f: "Reported question: 'Where do you live?'", b: "He asked me where I lived." },
      { f: "Inversion after 'never'", b: "Never have I seen such a beautiful sunset." },
    ],
  },

  matematicas2: {
    nombre: "Matemáticas II",
    cards: [
      { f: "Definición de derivada en un punto", b: "f'(a) = lim_{h→0} [f(a+h) − f(a)] / h" },
      { f: "Regla de la cadena", b: "(f∘g)'(x) = f'(g(x)) · g'(x)" },
      { f: "Teorema de Rolle", b: "Si f es continua en [a,b], derivable en (a,b) y f(a)=f(b), existe c ∈ (a,b) con f'(c)=0." },
      { f: "Teorema de Lagrange (valor medio)", b: "Si f es continua en [a,b] y derivable en (a,b), ∃ c ∈ (a,b): f'(c) = [f(b)−f(a)]/(b−a)." },
      { f: "Regla de Barrow", b: "∫_a^b f(x) dx = F(b) − F(a), siendo F una primitiva de f." },
      { f: "Integración por partes", b: "∫ u dv = uv − ∫ v du" },
      { f: "Determinante 2x2", b: "|a b; c d| = ad − bc" },
      { f: "Producto vectorial: módulo", b: "|u × v| = |u| · |v| · sen(α). Igual al área del paralelogramo." },
      { f: "Distancia punto-plano", b: "d(P, π) = |Ax₀ + By₀ + Cz₀ + D| / √(A² + B² + C²)" },
      { f: "Probabilidad condicionada", b: "P(A|B) = P(A ∩ B) / P(B), si P(B) > 0" },
      { f: "Teorema de Bayes", b: "P(A|B) = [P(B|A) · P(A)] / P(B)" },
      { f: "Distribución normal: tipificación", b: "Z = (X − μ) / σ, sigue N(0,1)" },
      { f: "Derivada de ln(x)", b: "1/x" },
      { f: "Derivada de e^x", b: "e^x" },
      { f: "∫ 1/(1+x²) dx", b: "arctan(x) + C" },
    ],
  },

  filosofia: {
    nombre: "Historia de la Filosofía",
    cards: [
      { f: "Mito de la caverna (Platón)", b: "Alegoría del conocimiento: salir de la caverna = paso del mundo sensible al inteligible (Ideas)." },
      { f: "Cuatro causas de Aristóteles", b: "Material, formal, eficiente y final." },
      { f: "Cogito de Descartes", b: "'Pienso, luego existo'. Primera certeza tras la duda metódica." },
      { f: "Imperativo categórico (Kant)", b: "'Obra solo según una máxima tal que puedas querer al mismo tiempo que se torne ley universal'." },
      { f: "Materialismo histórico (Marx)", b: "Las relaciones de producción (estructura económica) determinan la superestructura (política, ideología, cultura)." },
      { f: "Voluntad de poder (Nietzsche)", b: "Fuerza vital creadora que impulsa la vida. Crítica a la moral de esclavos del cristianismo." },
      { f: "Empirismo (Locke, Hume)", b: "Todo conocimiento procede de la experiencia. La mente es 'tabula rasa'." },
      { f: "Racio-vitalismo (Ortega)", b: "'Yo soy yo y mi circunstancia'. La razón debe estar al servicio de la vida." },
      { f: "Contrato social (Locke)", b: "Los hombres ceden parte de su libertad al Estado para proteger sus derechos naturales (vida, libertad, propiedad)." },
      { f: "Dios en San Agustín", b: "Iluminación divina como fuente del conocimiento verdadero. La Ciudad de Dios vs Ciudad terrenal." },
    ],
  },

  biologia: {
    nombre: "Biología",
    cards: [
      { f: "Estructura del ADN", b: "Doble hélice antiparalela. Bases: A-T, G-C. Pentosa: desoxirribosa." },
      { f: "Fases de la mitosis", b: "Profase, metafase, anafase, telofase (+ citocinesis)." },
      { f: "Glucólisis: balance neto", b: "1 glucosa → 2 piruvato + 2 ATP + 2 NADH" },
      { f: "Ciclo de Krebs: localización", b: "Matriz mitocondrial. Por cada acetil-CoA: 3 NADH + 1 FADH₂ + 1 GTP + 2 CO₂." },
      { f: "Operón lac", b: "Modelo de regulación génica en procariotas. La lactosa actúa como inductor." },
      { f: "Anticuerpo: estructura", b: "Inmunoglobulina con 2 cadenas pesadas y 2 ligeras unidas por puentes disulfuro. Forma de Y." },
      { f: "Fotosíntesis: fase luminosa", b: "Tilacoides. Fotólisis del agua, transporte de electrones, ATP y NADPH." },
      { f: "PCR: en qué consiste", b: "Reacción en cadena de la polimerasa. Amplificación de ADN: desnaturalización, anillamiento, extensión." },
      { f: "Mendel: 1ª ley", b: "Uniformidad de los híbridos de la primera generación filial." },
      { f: "Diferencia mitosis vs meiosis", b: "Mitosis: una división, células diploides idénticas. Meiosis: dos divisiones, 4 células haploides distintas." },
    ],
  },

  quimica: {
    nombre: "Química",
    cards: [
      { f: "Configuración electrónica del C", b: "1s² 2s² 2p². Z=6." },
      { f: "Constante Ka del ácido acético", b: "≈ 1,8 × 10⁻⁵ (ácido débil)." },
      { f: "pH = ?", b: "pH = −log[H₃O⁺]" },
      { f: "Principio de Le Chatelier", b: "Si se altera un equilibrio, el sistema se desplaza para contrarrestar el cambio." },
      { f: "Ley de Hess", b: "ΔH de una reacción es independiente del camino: suma de las ΔH de las etapas intermedias." },
      { f: "Energía libre de Gibbs", b: "ΔG = ΔH − TΔS. Si ΔG<0: espontáneo." },
      { f: "Reacción redox", b: "Aquella en que hay transferencia de electrones. Oxidación: pierde e⁻. Reducción: gana e⁻." },
      { f: "Grupo funcional alcohol", b: "−OH unido a un C saturado." },
      { f: "Isomería geométrica", b: "Cis/trans en dobles enlaces o ciclos. Diferentes propiedades físicas." },
      { f: "Pila Daniell", b: "Zn|Zn²⁺ || Cu²⁺|Cu. Ánodo (Zn, oxidación) y cátodo (Cu, reducción). E°=1,10 V." },
    ],
  },

  fisica: {
    nombre: "Física",
    cards: [
      { f: "Ley de gravitación universal", b: "F = G·m₁·m₂/r². G = 6,67·10⁻¹¹ N·m²/kg²." },
      { f: "Velocidad de escape", b: "v_e = √(2GM/R)" },
      { f: "Ley de Coulomb", b: "F = K·q₁·q₂/r². K = 9·10⁹ N·m²/C²." },
      { f: "Ley de Lenz", b: "La corriente inducida se opone a la variación del flujo magnético que la produce." },
      { f: "Ecuación de una onda", b: "y(x,t) = A·sen(ωt − kx + φ). v = λ·f = ω/k." },
      { f: "Efecto fotoeléctrico (Einstein)", b: "E_fotón = h·f = W₀ + ½mv². Solo si f ≥ f_umbral." },
      { f: "Relación masa-energía (Einstein)", b: "E = mc²" },
      { f: "Ley de desintegración radiactiva", b: "N(t) = N₀·e^(−λt). Periodo de semidesintegración: T₁/₂ = ln2/λ." },
      { f: "Principio de incertidumbre (Heisenberg)", b: "Δx·Δp ≥ ℏ/2" },
      { f: "Modelo atómico de Bohr", b: "Electrones en órbitas estacionarias con energía cuantizada. Saltos emiten/absorben fotones." },
    ],
  },

  latin2: {
    nombre: "Latín II",
    cards: [
      { f: "Declinaciones latinas: terminaciones genitivo singular", b: "1ª -ae, 2ª -i, 3ª -is, 4ª -us, 5ª -ei." },
      { f: "Caso ablativo: usos principales", b: "Compañía, instrumento, modo, lugar 'de donde', tiempo 'cuando'." },
      { f: "Subjuntivo en oraciones finales", b: "Con 'ut/ne' + subjuntivo: 'ut videat' = 'para que vea'." },
      { f: "Ablativo absoluto", b: "Construcción participial en ablativo, sin nexo: 'urbe capta' = 'tomada la ciudad'." },
      { f: "Verbos deponentes: definición", b: "Forma pasiva pero significado activo. Ej: loquor, locutus sum." },
      { f: "Mito de Prometeo", b: "Robó el fuego a los dioses para dárselo a los hombres. Castigado por Zeus en el Cáucaso." },
      { f: "Mito de Orfeo y Eurídice", b: "Orfeo baja al Hades por su esposa muerta. Pierde por mirar atrás antes de salir." },
      { f: "Evolución fonética: 'ct' →", b: "Vocaliza la c en 'i': nocte > noche; lacte > leche." },
      { f: "Pretérito perfecto: característica", b: "Tema de perfecto + desinencias: -i, -isti, -it, -imus, -istis, -erunt." },
    ],
  },

  geografia: {
    nombre: "Geografía",
    cards: [
      { f: "Climas de España: principales", b: "Oceánico, mediterráneo (litoral, interior, continentalizado), de montaña, subtropical (Canarias)." },
      { f: "Sistemas montañosos peninsulares", b: "Pirineos, Cantábrica, Sistema Ibérico, Sistema Central, Sierra Morena, Béticas." },
      { f: "Comunidades con mayor densidad", b: "Madrid, País Vasco, Cataluña, Comunidad Valenciana." },
      { f: "Sectores productivos por % PIB España", b: "Servicios ~74%, Industria ~17%, Construcción ~6%, Sector primario ~3%." },
      { f: "Balanza comercial española", b: "Tradicionalmente deficitaria. Compensada por turismo." },
      { f: "Ríos vertiente atlántica", b: "Miño, Duero, Tajo, Guadiana, Guadalquivir." },
    ],
  },
};
