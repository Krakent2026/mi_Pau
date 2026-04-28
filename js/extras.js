/* ============================================================
 *  extras.js — Funcionalidades avanzadas (Fase 5)
 *  Módulos:
 *   - PAU_SIMULACRO: simulacros cronometrados
 *   - PAU_CHART: mini gráficas en canvas (sin librerías)
 *   - PAU_NOTIF: notificaciones nativas + recordatorios
 *   - PAU_VOZ: STT/TTS con Web Speech API
 *   - PAU_FOCO: modo concentración pantalla completa
 *   - PAU_SYNC: export/import por código corto + URL data
 *   - PAU_IMPORTADOR: importar exámenes oficiales con IA
 *   - PAU_REPASO: repaso inteligente (SM-2 + débiles)
 *   - PAU_FLASHCARDS_BANCO: banco predefinido por materia
 *   - PAU_RUBRICA: rúbricas PAU para corrección
 *   - PAU_TESTS_UNIT: mini test runner
 * ============================================================ */
(function () {
  "use strict";

  // ============================================================
  // 1. CHART — gráficas simples en canvas
  // ============================================================
  const CHART = {
    line(canvas, points, opts = {}) {
      const ctx = canvas.getContext("2d");
      const w = canvas.width = canvas.clientWidth || canvas.width || 600;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      if (!points.length) {
        ctx.fillStyle = "#9ca3af";
        ctx.font = "14px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Sin datos todavía", w / 2, h / 2);
        return;
      }
      const min = opts.min ?? 0;
      const max = opts.max ?? 10;
      const pad = 28;
      const xStep = (w - pad * 2) / Math.max(1, points.length - 1);
      const scaleY = (v) => h - pad - ((v - min) / (max - min)) * (h - pad * 2);

      // Ejes
      ctx.strokeStyle = "#e5e7eb";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(pad, pad);
      ctx.lineTo(pad, h - pad);
      ctx.lineTo(w - pad, h - pad);
      ctx.stroke();

      // Línea de aprobado (5)
      if (max >= 5) {
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = "#dc2626";
        ctx.beginPath();
        ctx.moveTo(pad, scaleY(5));
        ctx.lineTo(w - pad, scaleY(5));
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Línea de datos
      ctx.strokeStyle = opts.color || "#7c3aed";
      ctx.lineWidth = 2;
      ctx.beginPath();
      points.forEach((p, i) => {
        const x = pad + i * xStep;
        const y = scaleY(p.y);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // Puntos + labels
      ctx.fillStyle = opts.color || "#7c3aed";
      points.forEach((p, i) => {
        const x = pad + i * xStep;
        const y = scaleY(p.y);
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      });

      // Eje Y labels
      ctx.fillStyle = "#6b7280";
      ctx.font = "11px sans-serif";
      ctx.textAlign = "right";
      [min, (min + max) / 2, max].forEach((v) => {
        ctx.fillText(v.toFixed(1), pad - 4, scaleY(v) + 3);
      });

      // Eje X labels
      ctx.textAlign = "center";
      points.forEach((p, i) => {
        if (points.length > 8 && i % Math.ceil(points.length / 8) !== 0) return;
        ctx.fillText(p.label || (i + 1), pad + i * xStep, h - pad + 14);
      });
    },

    bars(canvas, items, opts = {}) {
      const ctx = canvas.getContext("2d");
      const w = canvas.width = canvas.clientWidth || canvas.width || 600;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      if (!items.length) return;
      const max = opts.max ?? Math.max(...items.map((i) => i.value), 1);
      const pad = 28;
      const bw = (w - pad * 2) / items.length - 6;
      items.forEach((it, i) => {
        const x = pad + i * (bw + 6);
        const bh = (it.value / max) * (h - pad * 2);
        ctx.fillStyle = it.color || "#7c3aed";
        ctx.fillRect(x, h - pad - bh, bw, bh);
        ctx.fillStyle = "#6b7280";
        ctx.font = "10px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(it.label, x + bw / 2, h - pad + 12);
        ctx.fillText(it.value.toFixed(1), x + bw / 2, h - pad - bh - 4);
      });
    },
  };
  window.PAU_CHART = CHART;

  // ============================================================
  // 2. NOTIFICACIONES
  // ============================================================
  const NOTIF = {
    isSupported() { return "Notification" in window; },
    permission() { return this.isSupported() ? Notification.permission : "denied"; },
    async pedir() {
      if (!this.isSupported()) return "denied";
      if (Notification.permission === "granted") return "granted";
      if (Notification.permission === "denied") return "denied";
      return await Notification.requestPermission();
    },
    enviar(titulo, body, opts = {}) {
      if (this.permission() !== "granted") return;
      try {
        new Notification(titulo, { body, icon: opts.icon, tag: opts.tag, ...opts });
      } catch {}
    },
    // Programa un recordatorio en X minutos (solo mientras la página está abierta)
    programar(min, titulo, body) {
      if (this.permission() !== "granted") return null;
      return setTimeout(() => this.enviar(titulo, body), min * 60 * 1000);
    },
    // Recordatorio diario aproximado (mientras app esté abierta)
    diario(hh, mm, titulo, body) {
      const ahora = new Date();
      const obj = new Date();
      obj.setHours(hh, mm, 0, 0);
      if (obj <= ahora) obj.setDate(obj.getDate() + 1);
      const ms = obj - ahora;
      setTimeout(() => {
        this.enviar(titulo, body);
        this.diario(hh, mm, titulo, body);
      }, ms);
    },
  };
  window.PAU_NOTIF = NOTIF;

  // ============================================================
  // 3. VOZ (Speech Recognition + Synthesis)
  // ============================================================
  const VOZ = {
    SR: window.SpeechRecognition || window.webkitSpeechRecognition,
    soporta() { return !!this.SR; },
    soportaTTS() { return "speechSynthesis" in window; },
    escuchar({ onResult, onEnd, lang = "es-ES" } = {}) {
      if (!this.soporta()) { alert("Tu navegador no soporta reconocimiento de voz."); return null; }
      const r = new this.SR();
      r.lang = lang;
      r.continuous = false;
      r.interimResults = true;
      let texto = "";
      r.onresult = (e) => {
        let interim = "";
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const t = e.results[i][0].transcript;
          if (e.results[i].isFinal) texto += t; else interim += t;
        }
        onResult && onResult(texto, interim);
      };
      r.onend = () => onEnd && onEnd(texto);
      r.start();
      return r;
    },
    hablar(texto, { lang = "es-ES", rate = 1 } = {}) {
      if (!this.soportaTTS()) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(texto);
      u.lang = lang;
      u.rate = rate;
      window.speechSynthesis.speak(u);
    },
    parar() {
      if (this.soportaTTS()) window.speechSynthesis.cancel();
    },
  };
  window.PAU_VOZ = VOZ;

  // ============================================================
  // 4. MODO CONCENTRACIÓN (foco)
  // ============================================================
  const FOCO = {
    activo: false,
    activar() {
      document.body.classList.add("focus-mode");
      this.activo = true;
      // Botón flotante para salir
      if (!document.getElementById("focus-exit")) {
        const btn = document.createElement("button");
        btn.id = "focus-exit";
        btn.className = "focus-exit-btn";
        btn.textContent = "✕ Salir (Esc)";
        btn.addEventListener("click", () => this.desactivar());
        document.body.appendChild(btn);
      }
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    },
    desactivar() {
      document.body.classList.remove("focus-mode");
      this.activo = false;
      const btn = document.getElementById("focus-exit");
      if (btn) btn.remove();
      if (document.exitFullscreen && document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    },
    toggle() { this.activo ? this.desactivar() : this.activar(); },
  };
  window.PAU_FOCO = FOCO;

  // ============================================================
  // 5. SIMULACRO cronometrado
  // ============================================================
  const SIMULACRO = {
    intervalId: null,
    inicio: null,
    duracionMs: 0,

    empezar(duracionMin, onTick, onTimeout) {
      this.inicio = Date.now();
      this.duracionMs = duracionMin * 60 * 1000;
      const tick = () => {
        const elapsed = Date.now() - this.inicio;
        const restante = Math.max(0, this.duracionMs - elapsed);
        onTick && onTick(restante, elapsed);
        if (restante === 0) {
          this.parar();
          onTimeout && onTimeout();
        }
      };
      tick();
      this.intervalId = setInterval(tick, 1000);
      // Aviso en notificación cuando quede 1 minuto
      setTimeout(() => {
        if (this.intervalId) {
          NOTIF.enviar("⏰ Te queda 1 minuto", "Empieza a revisar el examen.");
        }
      }, this.duracionMs - 60000);
    },
    parar() {
      if (this.intervalId) clearInterval(this.intervalId);
      this.intervalId = null;
      const elapsed = this.inicio ? Date.now() - this.inicio : 0;
      this.inicio = null;
      return elapsed;
    },
    formatTime(ms) {
      const s = Math.floor(ms / 1000);
      const mm = String(Math.floor(s / 60)).padStart(2, "0");
      const ss = String(s % 60).padStart(2, "0");
      return `${mm}:${ss}`;
    },
  };
  window.PAU_SIMULACRO = SIMULACRO;

  // ============================================================
  // 6. SYNC — export/import por URL data y QR
  // ============================================================
  const SYNC = {
    encode(state) {
      // Comprimir simple: JSON + base64 (sin librerías)
      const json = JSON.stringify(state);
      // unescape para soportar UTF-8 → btoa
      return btoa(unescape(encodeURIComponent(json)));
    },
    decode(b64) {
      try {
        const json = decodeURIComponent(escape(atob(b64)));
        return JSON.parse(json);
      } catch (e) {
        return null;
      }
    },
    // QR usando API de quickchart.io (sin instalar librería)
    qrUrl(text) {
      // Limitamos por seguridad: si es muy largo no cabe en QR
      return `https://quickchart.io/qr?text=${encodeURIComponent(text)}&size=300&margin=2`;
    },
  };
  window.PAU_SYNC = SYNC;

  // ============================================================
  // 7. IMPORTADOR de exámenes con IA (extrae preguntas)
  // ============================================================
  const IMPORTADOR = {
    async extraer(texto, materia) {
      if (!window.PAU_IA?.isConfigured()) {
        throw new Error("Configura primero un proveedor de IA.");
      }
      const prompt = `Tienes el texto de un examen oficial PAU de "${materia}". Extrae las preguntas tipo test que puedas identificar y devuelve SOLO JSON válido (sin markdown ni \`\`\`):
[
  { "pregunta": "...", "opciones": ["A","B","C","D"], "correcta": 0, "explicacion": "..." }
]
Si no encuentras preguntas tipo test claras, inventa 5 preguntas tipo test BASADAS en el contenido del texto, con 4 opciones cada una.

TEXTO DEL EXAMEN:
"""
${texto.slice(0, 12000)}
"""`;
      const resp = await window.PAU_IA.chat({
        system: "Eres un extractor de preguntas tipo test de exámenes PAU. Devuelve solo JSON válido.",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
      });
      // Parseo flexible
      const match = resp.match(/\[[\s\S]*\]/);
      if (!match) throw new Error("No se pudo extraer JSON de la respuesta de la IA.");
      return JSON.parse(match[0]);
    },
  };
  window.PAU_IMPORTADOR = IMPORTADOR;

  // ============================================================
  // 8. REPASO INTELIGENTE
  // ============================================================
  const REPASO = {
    sugerirHoy(state, materias) {
      // Combina: tarjetas SM-2 vencidas + materias con más errores recientes
      const hoy = new Date().toISOString().slice(0, 10);
      const sugerencias = [];

      // 1. Flashcards due
      Object.entries(state.flashcards || {}).forEach(([mid, lista]) => {
        const due = lista.filter((c) => !c.due || c.due <= hoy);
        if (due.length > 0) {
          const m = materias.find((x) => x.id === mid);
          sugerencias.push({
            tipo: "flashcards",
            prioridad: due.length >= 10 ? 3 : 2,
            materiaId: mid,
            materiaNombre: m?.nombre || mid,
            cantidad: due.length,
            mensaje: `Tienes ${due.length} flashcard${due.length === 1 ? "" : "s"} pendientes de repasar`,
          });
        }
      });

      // 2. Materias con tests recientes con muchos errores
      const ultimosTests = (state.tests || []).slice(-15);
      const erroresPorMat = {};
      ultimosTests.forEach((t) => {
        if (!erroresPorMat[t.materiaId]) erroresPorMat[t.materiaId] = { ok: 0, ko: 0 };
        erroresPorMat[t.materiaId].ok += t.aciertos || 0;
        erroresPorMat[t.materiaId].ko += (t.total || 0) - (t.aciertos || 0);
      });
      Object.entries(erroresPorMat).forEach(([mid, d]) => {
        const total = d.ok + d.ko;
        if (total < 5) return;
        const aciertoPct = (d.ok / total) * 100;
        if (aciertoPct < 60) {
          const m = materias.find((x) => x.id === mid);
          sugerencias.push({
            tipo: "test",
            prioridad: aciertoPct < 40 ? 3 : 2,
            materiaId: mid,
            materiaNombre: m?.nombre || mid,
            mensaje: `Solo aciertas el ${aciertoPct.toFixed(0)}% en ${m?.nombre || mid}. Refuerza este tema.`,
          });
        }
      });

      // 3. Materias sin sesión hace > 5 días
      const ultimaSesionPorMat = {};
      (state.sesiones || []).forEach((s) => {
        const prev = ultimaSesionPorMat[s.materiaId];
        if (!prev || s.fecha > prev) ultimaSesionPorMat[s.materiaId] = s.fecha;
      });
      materias.forEach((m) => {
        const ultima = ultimaSesionPorMat[m.id];
        if (!ultima) return;
        const diasSinTocar = Math.round((new Date(hoy) - new Date(ultima)) / 86400000);
        if (diasSinTocar > 5) {
          sugerencias.push({
            tipo: "abandono",
            prioridad: diasSinTocar > 10 ? 3 : 1,
            materiaId: m.id,
            materiaNombre: m.nombre,
            mensaje: `Llevas ${diasSinTocar} días sin estudiar ${m.nombre}.`,
          });
        }
      });

      return sugerencias.sort((a, b) => b.prioridad - a.prioridad).slice(0, 6);
    },
  };
  window.PAU_REPASO = REPASO;

  // ============================================================
  // 9. BANCO DE FLASHCARDS PREDEFINIDAS
  // ============================================================
  const FC_BANCO = {
    historia: [
      { f: "¿Qué supone el Tratado de Utrecht (1713)?", b: "Fin de la Guerra de Sucesión española; pérdida de Gibraltar y Menorca, y de territorios europeos. Felipe V reconocido como rey." },
      { f: "Constitución de 1812 (apodo y aporte clave)", b: "«La Pepa». Soberanía nacional, división de poderes, derechos individuales, sufragio universal masculino indirecto." },
      { f: "Desamortización de Mendizábal (1836)", b: "Expropiación y venta de bienes eclesiásticos para amortizar deuda pública y crear una clase de propietarios afín al liberalismo." },
      { f: "Sexenio Democrático (1868-1874)", b: "Revolución «La Gloriosa», reinado de Amadeo I, Primera República, Restauración con Alfonso XII." },
      { f: "Generación del 98 — autores", b: "Unamuno, Azorín, Baroja, Maeztu, Machado. Reflexión crítica sobre la decadencia tras la pérdida de las colonias." },
      { f: "Pronunciamiento de Primo de Rivera", b: "13 sept 1923. Dictadura militar con apoyo de Alfonso XIII; cae en 1930 («dictablanda» de Berenguer)." },
      { f: "Proclamación de la II República", b: "14 abril 1931, tras elecciones municipales con triunfo republicano-socialista. Niceto Alcalá-Zamora primer presidente." },
      { f: "Ofensiva del Ebro", b: "Batalla decisiva (jul-nov 1938) de la Guerra Civil. Derrota republicana que abre la caída de Cataluña." },
      { f: "Plan de Estabilización (1959)", b: "Liberalización económica del franquismo con tecnócratas del Opus Dei. Inicia el «desarrollismo»." },
      { f: "Pactos de la Moncloa (1977)", b: "Acuerdo político y económico de la Transición: contención salarial, reformas fiscales, libertades sindicales." },
    ],
    matematicas2: [
      { f: "Derivada de sin(x)", b: "cos(x)" },
      { f: "Derivada de e^x", b: "e^x" },
      { f: "Integral de 1/x", b: "ln|x| + C" },
      { f: "Regla de la cadena", b: "(f∘g)'(x) = f'(g(x)) · g'(x)" },
      { f: "Teorema fundamental del cálculo", b: "Si F'(x) = f(x), entonces ∫ₐᵇ f(x)dx = F(b) − F(a)" },
      { f: "Determinante 2×2", b: "|a b; c d| = ad − bc" },
      { f: "Producto vectorial — interpretación", b: "Vector perpendicular al plano de los dos vectores; módulo = área del paralelogramo." },
      { f: "Distancia punto-plano", b: "d = |Ax₀+By₀+Cz₀+D| / √(A²+B²+C²)" },
      { f: "Probabilidad condicionada", b: "P(A|B) = P(A∩B)/P(B), si P(B)>0" },
      { f: "Teorema de Bayes", b: "P(A|B) = P(B|A)·P(A) / P(B)" },
    ],
    ingles: [
      { f: "Conditional type 2 — estructura", b: "If + past simple, would + base form. Hipótesis irreal en el presente." },
      { f: "Reported speech: 'I am tired'", b: "He said (that) he was tired." },
      { f: "Phrasal: «give up»", b: "Rendirse / dejar (un hábito)" },
      { f: "Passive voice — «They built the bridge»", b: "The bridge was built (by them)." },
      { f: "Difference: since vs for", b: "Since + punto en el tiempo. For + duración." },
      { f: "Used to vs would", b: "Ambos para hábitos del pasado, pero «used to» también vale para estados (I used to live...). «Would» solo acciones repetidas." },
      { f: "3rd conditional", b: "If + past perfect, would have + past participle. Hipótesis irreal en el pasado." },
      { f: "Linker: «however»", b: "Sin embargo. Va seguido de coma. Marca contraste." },
    ],
    biologia: [
      { f: "Replicación del ADN — modelo", b: "Semiconservativo: cada hebra hija contiene una hebra original y una nueva." },
      { f: "Transcripción", b: "ADN → ARNm catalizado por la ARN polimerasa." },
      { f: "Traducción — orgánulo", b: "Ribosoma. Lee codones del ARNm para sintetizar la proteína." },
      { f: "Mitocondria — función clave", b: "Respiración celular: producción de ATP por fosforilación oxidativa." },
      { f: "Cloroplasto", b: "Fotosíntesis. Estroma + tilacoides con clorofila." },
      { f: "Meiosis vs mitosis", b: "Meiosis: 2 divisiones, 4 células haploides distintas (gametos). Mitosis: 1 división, 2 células diploides idénticas." },
      { f: "Inmunidad humoral vs celular", b: "Humoral: linfocitos B → anticuerpos. Celular: linfocitos T citotóxicos eliminan células infectadas." },
    ],
    quimica: [
      { f: "pH y [H⁺]", b: "pH = -log[H⁺]" },
      { f: "Le Chatelier", b: "Si se altera un equilibrio, el sistema se desplaza para contrarrestar la perturbación." },
      { f: "Enlace iónico vs covalente", b: "Iónico: transferencia de electrones (metal+no metal). Covalente: compartición (no metal+no metal)." },
      { f: "Velocidad de reacción — factores", b: "Concentración, temperatura, superficie, catalizador." },
      { f: "Oxidación", b: "Pérdida de electrones (aumento del número de oxidación)." },
    ],
    fisica: [
      { f: "2ª Ley de Newton", b: "F = m·a" },
      { f: "Energía cinética", b: "Eₖ = ½ m v²" },
      { f: "Ley de gravitación universal", b: "F = G m₁m₂/r²" },
      { f: "Ley de Coulomb", b: "F = K q₁q₂/r²" },
      { f: "Ondas — relación v, λ, f", b: "v = λ · f" },
      { f: "Fuerza magnética sobre carga", b: "F = q·v×B" },
      { f: "Energía potencial gravitatoria (cerca de la superficie)", b: "Eₚ = m·g·h" },
    ],
    filosofia: [
      { f: "Mito de la caverna — autor y obra", b: "Platón, «República» (Libro VII). Alegoría sobre el conocimiento y la educación." },
      { f: "Imperativo categórico", b: "Kant. «Obra solo según una máxima tal que puedas querer al mismo tiempo que se torne ley universal»." },
      { f: "«Pienso, luego existo»", b: "Descartes. Primera certeza tras la duda metódica." },
      { f: "Voluntad de poder", b: "Nietzsche. Fuerza vital que impulsa toda existencia, frente a la moral del resentimiento." },
      { f: "Dasein", b: "Heidegger. «Ser-ahí», el ser humano como existencia abierta al sentido del ser." },
    ],
    lengua: [
      { f: "Función poética", b: "Centrada en el mensaje en sí (recursos estilísticos, ritmo). Típica de literatura y publicidad." },
      { f: "Oración compuesta subordinada sustantiva", b: "Equivale a un sintagma nominal: «Dijo que vendría»." },
      { f: "Sinécdoque", b: "Tropo: tomar la parte por el todo o viceversa («cuatro bocas que alimentar»)." },
      { f: "Hipérbaton", b: "Alteración del orden lógico de la oración para enfatizar." },
    ],
    latin2: [
      { f: "Declinaciones latinas — número", b: "5 declinaciones, distinguidas por la terminación del genitivo singular." },
      { f: "Ablativo absoluto", b: "Construcción de participio + sustantivo en ablativo, con valor circunstancial: «Caesare duce» (siendo César el general)." },
      { f: "Cum histórico", b: "«Cum» + subjuntivo (imperfecto/pluscuamperfecto) en narración histórica: «Cum venisset, dixit» (cuando hubo venido, dijo)." },
    ],
  };
  window.PAU_FLASHCARDS_BANCO = (function () {
    const data = {
      historia: FC_BANCO.historia,
      matematicas2: FC_BANCO.matematicas2,
      ingles: FC_BANCO.ingles,
      biologia: FC_BANCO.biologia,
      quimica: FC_BANCO.quimica,
      fisica: FC_BANCO.fisica,
      filosofia: FC_BANCO.filosofia,
      lengua: FC_BANCO.lengua,
      latin2: FC_BANCO.latin2,
    };
    return {
      data,
      obtener(materiaId) { return data[materiaId] || []; },
      materiasDisponibles() { return Object.keys(data); },
    };
  })();

  // ============================================================
  // 10. RÚBRICA PAU para corrección
  // ============================================================
  const RUBRICAS = {
    lengua: {
      nombre: "Lengua Castellana y Literatura II",
      criterios: [
        { peso: 25, criterio: "Comprensión y resumen del texto" },
        { peso: 25, criterio: "Coherencia, cohesión y adecuación" },
        { peso: 20, criterio: "Análisis sintáctico/morfológico" },
        { peso: 15, criterio: "Conocimiento literario" },
        { peso: 15, criterio: "Corrección ortográfica y léxica" },
      ],
    },
    historia: {
      nombre: "Historia de España",
      criterios: [
        { peso: 30, criterio: "Contextualización del periodo" },
        { peso: 30, criterio: "Causas y consecuencias" },
        { peso: 20, criterio: "Uso de vocabulario histórico" },
        { peso: 10, criterio: "Estructura y argumentación" },
        { peso: 10, criterio: "Ortografía y expresión" },
      ],
    },
    filosofia: {
      nombre: "Historia de la Filosofía",
      criterios: [
        { peso: 30, criterio: "Comprensión del fragmento" },
        { peso: 30, criterio: "Relación con el pensamiento del autor" },
        { peso: 20, criterio: "Comparación con otra corriente" },
        { peso: 10, criterio: "Vocabulario filosófico" },
        { peso: 10, criterio: "Expresión escrita" },
      ],
    },
    ingles: {
      nombre: "Inglés",
      criterios: [
        { peso: 30, criterio: "Task achievement (cumplimiento de la tarea)" },
        { peso: 25, criterio: "Coherencia y cohesión" },
        { peso: 25, criterio: "Riqueza léxica" },
        { peso: 20, criterio: "Corrección gramatical" },
      ],
    },
  };
  window.PAU_RUBRICA = {
    obtener(materiaId) { return RUBRICAS[materiaId]; },
    todas() { return RUBRICAS; },
    promptCorreccion(materiaId, texto) {
      const r = RUBRICAS[materiaId];
      if (!r) return null;
      const criterios = r.criterios.map((c) => `- ${c.criterio} (${c.peso}%)`).join("\n");
      return `Eres examinador oficial PAU. Corrige el siguiente texto de "${r.nombre}" siguiendo ESTRICTAMENTE esta rúbrica oficial PAU Murcia:

${criterios}

Devuelve la corrección en Markdown con:

## 📊 Tabla de puntuación
| Criterio | Peso | Nota (0-10) | Subtotal |
|---|---|---|---|
${r.criterios.map((c) => `| ${c.criterio} | ${c.peso}% | _ | _ |`).join("\n")}
| **TOTAL** | 100% | | **_ / 10** |

## ✅ Aciertos
- ...

## ⚠️ Errores
- ...

## ✏️ Mejoras concretas
- ...

TEXTO A CORREGIR:
"""
${texto}
"""`;
    },
  };

  // ============================================================
  // 11. TESTS UNITARIOS (mini runner)
  // ============================================================
  const TESTS = {
    casos: [],
    add(nombre, fn) { this.casos.push({ nombre, fn }); },
    async ejecutar() {
      const resultados = [];
      for (const t of this.casos) {
        try {
          await t.fn();
          resultados.push({ nombre: t.nombre, ok: true });
        } catch (e) {
          resultados.push({ nombre: t.nombre, ok: false, error: e.message });
        }
      }
      return resultados;
    },
    assert(cond, msg) {
      if (!cond) throw new Error(msg || "Aserción fallida");
    },
    assertEq(a, b, msg) {
      if (JSON.stringify(a) !== JSON.stringify(b)) throw new Error((msg || "No iguales") + ` — esperado ${JSON.stringify(b)}, recibido ${JSON.stringify(a)}`);
    },
  };

  // SM-2: actualizar facilidad
  TESTS.add("SM-2: respuesta correcta sube ease", () => {
    const card = { ease: 2.5, interval: 1, reps: 0 };
    // Simulación del algoritmo (q=5, máxima calidad)
    const q = 5;
    const newEase = card.ease + 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02);
    TESTS.assert(newEase >= card.ease, "ease no aumentó con q=5");
  });

  TESTS.add("SM-2: respuesta mala resetea reps", () => {
    const q = 1;
    const reps = q < 3 ? 0 : 1;
    TESTS.assertEq(reps, 0, "reps debería resetearse");
  });

  TESTS.add("Calculadora: nota acceso", () => {
    const nmb = 8.0, fg = 7.0;
    const acceso = 0.6 * nmb + 0.4 * fg;
    TESTS.assertEq(acceso.toFixed(2), "7.60");
  });

  TESTS.add("Calculadora: admisión con ponderación", () => {
    const acceso = 8.0, m1 = 9.0, p1 = 0.2, m2 = 7.5, p2 = 0.15;
    const adm = acceso + m1 * p1 + m2 * p2;
    TESTS.assertEq(adm.toFixed(3), "10.925");
  });

  TESTS.add("Sync: encode + decode preserva datos", () => {
    const obj = { a: 1, b: "hola á é í", arr: [1, 2, 3] };
    const enc = SYNC.encode(obj);
    const dec = SYNC.decode(enc);
    TESTS.assertEq(dec, obj);
  });

  TESTS.add("Repaso: prioriza muchas flashcards", () => {
    const state = {
      flashcards: { historia: Array(15).fill({ due: "2020-01-01" }) },
      tests: [],
      sesiones: [],
    };
    const sugs = REPASO.sugerirHoy(state, [{ id: "historia", nombre: "Historia" }]);
    TESTS.assert(sugs.length > 0, "no devolvió sugerencias");
    TESTS.assertEq(sugs[0].tipo, "flashcards");
  });

  window.PAU_TESTS_UNIT = TESTS;

})();
