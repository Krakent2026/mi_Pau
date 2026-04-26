/* ===========================================================
 *  Mi PAU 2026 — lógica de la aplicación
 *  Persistencia: localStorage (clave "pauMurcia2026")
 * =========================================================== */

(() => {
  "use strict";

  const STORAGE_KEY = "pauMurcia2026";
  const SCHEMA_VERSION = 2;
  const D = window.PAU_DATA;

  // ---------------------- ESTADO -----------------------------
  const defaultState = {
    perfil: null, // { nombre, modalidad, historiaElegida, especificas:[], convocatoria }
    temas: {},    // { "materiaId::indiceTema": 0|1|2 }
    sesiones: [], // [{fecha, materiaId, minutos, tipo}]
    planner: {},  // { "dia-hora": {materiaId, nota} }
    racha: { ultimoDia: null, dias: 0 },
    quoteIndex: 0,
    // Fase 2
    simulacros: [], // [{fecha, materiaId, año, conv, nota, minutos, comentarios}]
    flashcards: {}, // { materiaId: [{id, f, b, ease, interval, due, reps}] }
    fcCustomCount: 0,
    tests: [],     // [{fecha, materiaId, total, aciertos, errores:[idx]}]
    apuntes: {},   // { materiaId: "markdown..." }
    adjuntos: {},  // { materiaId: [ {id, type:'file'|'link', ...} ] }
    // Fase 3
    logrosDesbloqueados: [], // [logroId]
    gradoObjetivo: null,     // id del grado
    gradosCustom: [],        // [{id, nombre, uni, rama, notaCorte, pond, custom:true}]
    gradosOverrides: {},     // { gradoId: { nombre, notaCorte, pond, ... } } overrides sobre grados predefinidos
    // Fase 4
    testsCustom: {}, // { materiaId: [ {q, opts, correct, expl} ] }  preguntas generadas por IA
    // Meta
    schemaVersion: SCHEMA_VERSION,
    notificacionesActivas: false,
  };

  let state = load();

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return structuredClone(defaultState);
      const parsed = JSON.parse(raw);
      const merged = { ...structuredClone(defaultState), ...parsed };
      return migrate(merged);
    } catch {
      return structuredClone(defaultState);
    }
  }

  function migrate(s) {
    const v = s.schemaVersion || 1;
    // v1 → v2: garantizar arrays y objetos por defecto
    if (v < 2) {
      s.gradosCustom = s.gradosCustom || [];
      s.gradosOverrides = s.gradosOverrides || {};
      s.adjuntos = s.adjuntos || {};
      s.testsCustom = s.testsCustom || {};
      s.logrosDesbloqueados = s.logrosDesbloqueados || [];
      s.schemaVersion = 2;
    }
    return s;
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  // ---------------------- HELPERS ----------------------------
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  function todayISO() {
    return new Date().toISOString().slice(0, 10);
  }

  function diffDays(fromISO, toISO) {
    const a = new Date(fromISO + "T00:00:00");
    const b = new Date(toISO + "T00:00:00");
    return Math.round((b - a) / 86400000);
  }

  function formatDateES(iso) {
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  }

  function getMateriasUsuario() {
    if (!state.perfil) return [];
    const out = [];
    // Comunes (todas excepto la historia no elegida)
    D.materiasComunes.forEach((m) => {
      if (m.id === "historia" && state.perfil.historiaElegida === "filosofia") return;
      if (m.id === "filosofia" && state.perfil.historiaElegida !== "filosofia") return;
      out.push(m);
    });
    // Troncal de modalidad
    const mod = D.modalidades[state.perfil.modalidad];
    if (mod) {
      const troncalNombre = mod.troncalModalidad[0];
      const troncal = D.materiasModalidad.find((m) => m.nombre === troncalNombre);
      if (troncal) out.push(troncal);
    }
    // Específicas elegidas
    (state.perfil.especificas || []).forEach((id) => {
      const m = D.materiasEspecificas.find((x) => x.id === id);
      if (m) out.push(m);
    });
    return out;
  }

  function totalTemas(materia) {
    return (materia.estructura || []).reduce((acc, b) => acc + (b.temas?.length || 0), 0);
  }

  function temasDominados(materia) {
    let count = 0;
    (materia.estructura || []).forEach((b, bi) => {
      (b.temas || []).forEach((_, ti) => {
        const k = `${materia.id}::${bi}::${ti}`;
        if (state.temas[k] === 2) count++;
      });
    });
    return count;
  }

  // ---------------------- ONBOARDING -------------------------
  function renderOnboarding() {
    const grid = $("#ob-especificas");
    grid.innerHTML = D.materiasEspecificas
      .map(
        (m) => `
      <label data-id="${m.id}">
        <input type="checkbox" value="${m.id}" />
        <span>${m.nombre}</span>
      </label>`
      )
      .join("");
    grid.addEventListener("change", (e) => {
      const lbl = e.target.closest("label");
      if (lbl) lbl.classList.toggle("checked", e.target.checked);
    });

    $("#ob-start").addEventListener("click", () => {
      const nombre = $("#ob-nombre").value.trim() || "Estudiante";
      const modalidad = $("#ob-modalidad").value;
      const historiaElegida = $("#ob-historia").value;
      const convocatoria = $("#ob-convocatoria").value;
      const especificas = $$("#ob-especificas input:checked").map((i) => i.value);

      state.perfil = { nombre, modalidad, historiaElegida, especificas, convocatoria };
      save();
      $("#onboarding").classList.add("hidden");
      $("#app").classList.remove("hidden");
      bootApp();
    });
  }

  // ---------------------- TABS -------------------------------
  function setupTabs() {
    $$(".tab").forEach((btn) => {
      btn.addEventListener("click", () => {
        $$(".tab").forEach((b) => b.classList.remove("active"));
        $$(".tab-panel").forEach((p) => p.classList.remove("active"));
        btn.classList.add("active");
        $(`#tab-${btn.dataset.tab}`).classList.add("active");
      });
    });
  }

  // ---------------------- DASHBOARD --------------------------
  function renderDashboard() {
    $("#user-greeting").textContent = `Hola, ${state.perfil.nombre} 👋`;

    // Cuenta atrás
    const conv = D.convocatorias[state.perfil.convocatoria];
    const primerExamen = conv.examenes[0];
    const days = diffDays(todayISO(), primerExamen);
    $("#countdown-days").textContent = days >= 0 ? days : "✓";
    $("#countdown-date").textContent = `Primer examen: ${formatDateES(primerExamen)}`;

    renderCalendarioPAU();

    // Frase del día
    const idx = new Date().getDate() % D.frases.length;
    $("#daily-quote").textContent = D.frases[idx];

    // Racha
    actualizarRacha();
    $("#streak-days").textContent = state.racha.dias || 0;

    // Minutos hoy
    const hoy = todayISO();
    const minHoy = state.sesiones
      .filter((s) => s.fecha === hoy)
      .reduce((a, s) => a + s.minutos, 0);
    $("#today-minutes").textContent = minHoy;

    // Progreso por materia
    const lista = $("#progress-list");
    const materias = getMateriasUsuario();
    lista.innerHTML = materias
      .map((m) => {
        const total = totalTemas(m);
        const dom = temasDominados(m);
        const pct = total ? Math.round((dom / total) * 100) : 0;
        return `
        <div class="progress-row">
          <span class="name">${m.nombre}</span>
          <div class="progress-bar"><div class="progress-fill" style="width:${pct}%; background:${m.color}"></div></div>
          <span class="pct">${pct}%</span>
        </div>`;
      })
      .join("");

    // Próximos exámenes
    $("#exam-dates").innerHTML = conv.examenes
      .map((d) => `<li>📝 ${formatDateES(d)}</li>`)
      .join("");
  }

  function renderCalendarioPAU() {
    const cont = $("#calendario-list");
    if (!cont) return;
    const conv = D.convocatorias[state.perfil.convocatoria];
    if (!conv.calendario) { cont.innerHTML = ""; return; }

    // Materias del usuario para resaltar
    const mats = getMateriasUsuario().map((m) => m.nombre.toLowerCase());
    const hoy = todayISO();
    const items = conv.calendario.map((slot) => {
      const dias = diffDays(hoy, slot.fecha);
      const esRelevante = slot.materias.some((m) =>
        mats.some((um) => m.toLowerCase().includes(um.toLowerCase()) || um.toLowerCase().includes(m.toLowerCase()))
      );
      const cls = dias < 0 ? "pasado" : (dias === 0 ? "hoy" : (esRelevante ? "relevante" : ""));
      const etq = dias < 0 ? "ya pasado" : (dias === 0 ? "¡HOY!" : `en ${dias} día${dias === 1 ? "" : "s"}`);
      return `
        <div class="cal-slot ${cls}">
          <div class="cal-fecha">
            <strong>${formatDateES(slot.fecha)}</strong>
            <span class="cal-hora">${slot.hora} · ${slot.duracion} min</span>
          </div>
          <div class="cal-materias">${slot.materias.map((m) => {
            const tuya = mats.some((um) => m.toLowerCase().includes(um.toLowerCase()) || um.toLowerCase().includes(m.toLowerCase()));
            return `<span class="cal-mat ${tuya ? "tuya" : ""}">${m}</span>`;
          }).join("")}</div>
          <div class="cal-dias">${etq}</div>
        </div>`;
    }).join("");
    cont.innerHTML = items;
  }

  function actualizarRacha() {
    const hoy = todayISO();
    const tieneSesionHoy = state.sesiones.some((s) => s.fecha === hoy);
    if (!tieneSesionHoy) return;
    if (state.racha.ultimoDia === hoy) return;
    if (state.racha.ultimoDia && diffDays(state.racha.ultimoDia, hoy) === 1) {
      state.racha.dias++;
    } else {
      state.racha.dias = 1;
    }
    state.racha.ultimoDia = hoy;
    save();
  }

  // ---------------------- MATERIAS ---------------------------
  function renderMaterias() {
    const cont = $("#materias-list");
    const materias = getMateriasUsuario();
    cont.innerHTML = materias
      .map((m) => {
        const total = totalTemas(m);
        const dom = temasDominados(m);
        const bloques = (m.estructura || [])
          .map(
            (b, bi) => `
        <div class="bloque">
          <h4>${b.bloque}${b.puntos ? ` <span class="muted">(${b.puntos} pts)</span>` : ""}</h4>
          ${(b.temas || []).map((t, ti) => {
            const k = `${m.id}::${bi}::${ti}`;
            const st = state.temas[k] || 0;
            return `<div class="tema">
              <button class="tema-status" data-key="${k}" data-state="${st}" title="Clic para cambiar estado">
                ${st === 2 ? "✓" : st === 1 ? "•" : ""}
              </button>
              <span class="text">${t}</span>
            </div>`;
          }).join("")}
        </div>`
          )
          .join("");

        const bloquesContenidoHTML = (m.bloquesContenido || [])
          .map((bc) => `<li>${bc}</li>`)
          .join("");

        return `
      <div class="materia-card" data-id="${m.id}">
        <div class="materia-header" style="border-left-color:${m.color}">
          <div>
            <h3>${m.nombre}</h3>
            <div class="meta">⏱️ ${m.duracionExamen} min · ${dom}/${total} temas dominados</div>
          </div>
          <span class="chevron">›</span>
        </div>
        <div class="materia-body">
          ${m.bloquesContenido ? `<div class="bloque"><h4>📋 Contenido del temario</h4><ul>${bloquesContenidoHTML}</ul></div>` : ""}
          ${bloques}
          ${m.penalizaciones ? `<p class="muted" style="margin-top:8px"><strong>⚠️ Penalizaciones:</strong> ${m.penalizaciones}</p>` : ""}
        </div>
      </div>`;
      })
      .join("");

    // Toggle expand
    $$(".materia-header", cont).forEach((h) => {
      h.addEventListener("click", () => h.parentElement.classList.toggle("open"));
    });
    // Tema status cycling
    $$(".tema-status", cont).forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const k = btn.dataset.key;
        const cur = state.temas[k] || 0;
        const next = (cur + 1) % 3;
        state.temas[k] = next;
        save();
        btn.dataset.state = next;
        btn.textContent = next === 2 ? "✓" : next === 1 ? "•" : "";
        renderDashboard();
      });
    });
  }

  // ---------------------- PLANNER ----------------------------
  const DIAS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
  const HORAS = ["08-10", "10-12", "12-14", "16-18", "18-20", "20-22"];

  function renderPlanner() {
    const tbl = $("#planner");
    let html = "<thead><tr><th>Hora</th>";
    DIAS.forEach((d) => (html += `<th>${d}</th>`));
    html += "</tr></thead><tbody>";
    HORAS.forEach((h) => {
      html += `<tr><th>${h}</th>`;
      DIAS.forEach((d) => {
        const k = `${d}-${h}`;
        const cell = state.planner[k];
        if (cell) {
          const m = getMateriasUsuario().find((x) => x.id === cell.materiaId);
          html += `<td class="slot has-session" data-key="${k}">
            <span class="slot-tag" style="background:${m?.color || "#888"}">${m?.nombre.split(" ")[0] || cell.materiaId}</span>
            ${cell.nota ? `<small>${cell.nota}</small>` : ""}
          </td>`;
        } else {
          html += `<td class="slot" data-key="${k}">+</td>`;
        }
      });
      html += "</tr>";
    });
    html += "</tbody>";
    tbl.innerHTML = html;

    $$("td.slot", tbl).forEach((td) => {
      td.addEventListener("click", () => abrirSlot(td.dataset.key));
    });
  }

  function abrirSlot(key) {
    const cell = state.planner[key];
    const materias = getMateriasUsuario();
    const opts = materias
      .map((m) => `<option value="${m.id}" ${cell?.materiaId === m.id ? "selected" : ""}>${m.nombre}</option>`)
      .join("");

    openModal(`
      <h3>📅 Sesión de estudio — ${key}</h3>
      <label>Materia
        <select id="slot-materia">
          <option value="">— ninguna —</option>
          ${opts}
        </select>
      </label>
      <label>Nota / tema concreto
        <input type="text" id="slot-nota" value="${cell?.nota || ""}" placeholder="Ej. Tema 5 derivadas" />
      </label>
      <div class="row">
        <button class="btn-primary" id="slot-save">Guardar</button>
        <button class="btn-ghost" id="slot-delete">🗑️ Borrar</button>
      </div>
    `);

    $("#slot-save").addEventListener("click", () => {
      const materiaId = $("#slot-materia").value;
      const nota = $("#slot-nota").value.trim();
      if (materiaId) {
        state.planner[key] = { materiaId, nota };
      } else {
        delete state.planner[key];
      }
      save();
      closeModal();
      renderPlanner();
    });
    $("#slot-delete").addEventListener("click", () => {
      delete state.planner[key];
      save();
      closeModal();
      renderPlanner();
    });
  }

  // ---------------------- POMODORO ---------------------------
  const POMO = { focus: 25 * 60, shortBreak: 5 * 60, longBreak: 15 * 60 };
  let pomoState = { mode: "focus", remaining: POMO.focus, running: false, intervalId: null, cycles: 0 };

  function renderPomodoro() {
    // Materias dropdown
    const sel = $("#pomo-materia");
    const materias = getMateriasUsuario();
    sel.innerHTML = materias.map((m) => `<option value="${m.id}">${m.nombre}</option>`).join("");

    updatePomoDisplay();
    pomoState.cycles = state.sesiones.filter(
      (s) => s.fecha === todayISO() && s.tipo === "pomodoro"
    ).length;
    $("#pomo-cycles").textContent = pomoState.cycles;

    renderSessions();
  }

  function updatePomoDisplay() {
    const m = Math.floor(pomoState.remaining / 60);
    const s = pomoState.remaining % 60;
    $("#pomo-display").textContent = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    $("#pomo-mode").textContent = pomoState.mode === "focus" ? "🎯 Foco" : "☕ Descanso";
  }

  function pomoTick() {
    pomoState.remaining--;
    if (pomoState.remaining <= 0) {
      clearInterval(pomoState.intervalId);
      pomoState.running = false;
      if (pomoState.mode === "focus") {
        // Registrar sesión
        const materiaId = $("#pomo-materia").value;
        state.sesiones.push({
          fecha: todayISO(),
          materiaId,
          minutos: 25,
          tipo: "pomodoro",
        });
        save();
        actualizarRacha();
        pomoState.cycles++;
        $("#pomo-cycles").textContent = pomoState.cycles;
        renderSessions();
        renderDashboard();
        notify("¡Pomodoro completado! 🎉", "Tómate 5 minutos de descanso.");
        pomoState.mode = "break";
        pomoState.remaining = POMO.shortBreak;
      } else {
        notify("Descanso terminado", "¿Listo para otro pomodoro?");
        pomoState.mode = "focus";
        pomoState.remaining = POMO.focus;
      }
    }
    updatePomoDisplay();
  }

  function setupPomodoroControls() {
    $("#pomo-start").addEventListener("click", () => {
      if (pomoState.running) return;
      pomoState.running = true;
      pomoState.intervalId = setInterval(pomoTick, 1000);
    });
    $("#pomo-pause").addEventListener("click", () => {
      pomoState.running = false;
      clearInterval(pomoState.intervalId);
    });
    $("#pomo-reset").addEventListener("click", () => {
      pomoState.running = false;
      clearInterval(pomoState.intervalId);
      pomoState.mode = "focus";
      pomoState.remaining = POMO.focus;
      updatePomoDisplay();
    });
  }

  function renderSessions() {
    const ul = $("#sessions-list");
    const last = [...state.sesiones].slice(-15).reverse();
    if (!last.length) {
      ul.innerHTML = `<li class="muted">Aún no has registrado ninguna sesión. ¡Inicia tu primer Pomodoro! 🍅</li>`;
      return;
    }
    ul.innerHTML = last
      .map((s) => {
        const m = [...D.materiasComunes, ...D.materiasModalidad, ...D.materiasEspecificas].find((x) => x.id === s.materiaId);
        return `<li>
          <span>${formatDateES(s.fecha).split(",")[0]} · ${m?.nombre || s.materiaId}</span>
          <strong>${s.minutos} min</strong>
        </li>`;
      })
      .join("");
  }

  function notify(title, body) {
    if (!("Notification" in window)) return;
    if (Notification.permission === "granted") {
      new Notification(title, { body, icon: "📚" });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission();
    }
  }

  // ---------------------- CALCULADORA ------------------------
  function setupCalculadora() {
    $("#calc-go").addEventListener("click", () => {
      const nmb = parseFloat($("#calc-nmb").value);
      const fg = parseFloat($("#calc-fg").value);
      const m1 = parseFloat($("#calc-m1").value) || 0;
      const m2 = parseFloat($("#calc-m2").value) || 0;
      const p1 = parseFloat($("#calc-p1").value);
      const p2 = parseFloat($("#calc-p2").value);

      if (isNaN(nmb) || isNaN(fg)) {
        $("#calc-result").innerHTML = `<p class="muted">⚠️ Introduce nota de Bachillerato y Fase General.</p>`;
        return;
      }

      let warnings = [];
      if (fg < 4) warnings.push("⚠️ Fase General < 4: no se puede calcular nota de acceso.");

      const acceso = 0.6 * nmb + 0.4 * fg;
      const aporta1 = m1 >= 5 ? m1 * p1 : 0;
      const aporta2 = m2 >= 5 ? m2 * p2 : 0;
      const extra = Math.min(aporta1 + aporta2, 4);
      const admision = Math.min(acceso + extra, 14);

      $("#calc-result").innerHTML = `
        <p class="muted">Nota de Acceso</p>
        <h2>${acceso.toFixed(3)}</h2>
        <p class="muted">Nota de Admisión (con específicas)</p>
        <h2>${admision.toFixed(3)} <span style="font-size:1rem">/ 14</span></h2>
        ${m1 < 5 && m1 > 0 ? `<p class="muted">M1 no aporta (necesita ≥5)</p>` : ""}
        ${m2 < 5 && m2 > 0 ? `<p class="muted">M2 no aporta (necesita ≥5)</p>` : ""}
        ${warnings.map((w) => `<p style="color:var(--danger)">${w}</p>`).join("")}
      `;
    });
  }

  // ---------------------- RECURSOS ---------------------------
  function renderRecursos() {
    $("#resources-list").innerHTML = D.recursos
      .map(
        (r) => `<a class="res-item" href="${r.url}" target="_blank" rel="noopener">
          <span class="res-tag ${r.tipo}">${r.tipo}</span>
          <span style="flex:1">${r.titulo}</span>
          <span>↗</span>
        </a>`
      )
      .join("");

    const conv = D.convocatorias[state.perfil.convocatoria];
    $("#exam-info").innerHTML = `
      <p><strong>Convocatoria ${state.perfil.convocatoria}:</strong></p>
      <ul>
        <li>📋 Matrícula: del ${formatDateES(conv.matricula.inicio)} al ${formatDateES(conv.matricula.fin)}</li>
        ${conv.examenes.map((d) => `<li>📝 Examen: ${formatDateES(d)}</li>`).join("")}
        <li>🎓 Publicación de notas: ${formatDateES(conv.publicacionNotas)}</li>
      </ul>`;
  }

  // =====================================================================
  //  FASE 2 — Banco de exámenes + simulacro cronometrado
  // =====================================================================
  function poblarSelectMateria(selector) {
    const el = $(selector);
    if (!el) return;
    const materias = getMateriasUsuario();
    el.innerHTML = materias.map((m) => `<option value="${m.id}">${m.nombre}</option>`).join("");
  }

  function renderExamenes() {
    poblarSelectMateria("#exam-materia");
    const sel = $("#exam-materia");
    const refresh = () => {
      const id = sel.value;
      const materia = getMateriasUsuario().find((m) => m.id === id);
      const exams = (window.PAU_EXAMS?.porMateria?.[id]) || [];
      const cont = $("#exam-list");
      if (!exams.length) {
        cont.innerHTML = `<p class="muted" style="margin-top:12px">Sin exámenes catalogados aún para esta materia. Consulta la web oficial: <a href="${window.PAU_EXAMS.rootUrl}" target="_blank" rel="noopener">UMU — Exámenes anteriores</a></p>`;
        return;
      }
      cont.innerHTML = `<div class="exam-grid">${exams.map((e, idx) => `
        <div class="exam-item" style="border-left-color:${materia?.color || '#888'}">
          <div>
            <strong>${e.año} · ${e.conv}</strong>
            <div class="muted">${e.duracion} min ${e.soluciones ? "· con soluciones" : ""}</div>
          </div>
          <div class="exam-actions">
            <a href="${e.url}" target="_blank" rel="noopener" class="btn-ghost">📄 Ver PDF</a>
            <button class="btn-primary" data-sim="${idx}">⏱️ Simulacro</button>
          </div>
        </div>`).join("")}</div>`;

      $$(".exam-item button[data-sim]", cont).forEach((b) => {
        b.addEventListener("click", () => iniciarSimulacro(materia, exams[+b.dataset.sim]));
      });
    };
    sel.addEventListener("change", refresh);
    refresh();
    renderSimulacrosList();
  }

  let simState = null;
  function iniciarSimulacro(materia, examen) {
    const minutos = examen.duracion || 90;
    simState = { materia, examen, remaining: minutos * 60, intervalId: null, paused: false };

    openModal(`
      <h3>⏱️ Simulacro: ${materia.nombre}</h3>
      <p class="muted">${examen.año} · ${examen.conv} · ${minutos} minutos</p>
      <div class="sim-timer" id="sim-timer">${minutos}:00</div>
      <p class="muted" id="sim-warn"></p>
      <a href="${examen.url}" target="_blank" rel="noopener" class="btn-ghost">📄 Abrir PDF del examen</a>
      <div class="row" style="margin-top:14px">
        <button id="sim-pause" class="btn-ghost">⏸️ Pausa</button>
        <button id="sim-finish" class="btn-primary">✓ Finalizar</button>
      </div>
    `);

    const tick = () => {
      if (simState.paused) return;
      simState.remaining--;
      const m = Math.floor(simState.remaining / 60);
      const s = simState.remaining % 60;
      $("#sim-timer").textContent = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
      if (simState.remaining === 600) $("#sim-warn").textContent = "⚠️ Quedan 10 minutos. Repasa.";
      if (simState.remaining <= 0) {
        clearInterval(simState.intervalId);
        notify("⏰ Tiempo terminado", `${materia.nombre}`);
        finalizarSimulacro();
      }
    };
    simState.intervalId = setInterval(tick, 1000);

    $("#sim-pause").addEventListener("click", () => {
      simState.paused = !simState.paused;
      $("#sim-pause").textContent = simState.paused ? "▶️ Reanudar" : "⏸️ Pausa";
    });
    $("#sim-finish").addEventListener("click", finalizarSimulacro);
  }

  function finalizarSimulacro() {
    if (!simState) return;
    clearInterval(simState.intervalId);
    const usados = (simState.examen.duracion * 60 - simState.remaining);
    const minutosUsados = Math.max(1, Math.round(usados / 60));
    const { materia, examen } = simState;
    simState = null;

    openModal(`
      <h3>✓ ¡Simulacro terminado!</h3>
      <p class="muted">Tiempo empleado: <strong>${minutosUsados} min</strong></p>
      <label>Tu nota autoevaluada (0-10)
        <input type="number" id="sim-nota" min="0" max="10" step="0.25" />
      </label>
      <label>Comentarios (qué fallaste, qué aprendiste…)
        <textarea id="sim-comm" rows="3"></textarea>
      </label>
      <button id="sim-save" class="btn-primary">Guardar</button>
    `);

    $("#sim-save").addEventListener("click", () => {
      const nota = parseFloat($("#sim-nota").value);
      const comentarios = $("#sim-comm").value.trim();
      state.simulacros.push({
        fecha: todayISO(),
        materiaId: materia.id,
        año: examen.año,
        conv: examen.conv,
        nota: isNaN(nota) ? null : nota,
        minutos: minutosUsados,
        comentarios,
      });
      // También registramos como sesión para la racha
      state.sesiones.push({ fecha: todayISO(), materiaId: materia.id, minutos: minutosUsados, tipo: "simulacro" });
      save();
      actualizarRacha();
      closeModal();
      renderSimulacrosList();
      renderDashboard();
    });
  }

  function renderSimulacrosList() {
    const ul = $("#simulacros-list");
    if (!ul) return;
    if (!state.simulacros.length) {
      ul.innerHTML = `<li class="muted">Aún no has hecho ningún simulacro.</li>`;
      return;
    }
    ul.innerHTML = [...state.simulacros].reverse().map((s) => {
      const m = [...D.materiasComunes, ...D.materiasModalidad, ...D.materiasEspecificas].find((x) => x.id === s.materiaId);
      return `<li>
        <span>${s.fecha} · ${m?.nombre || s.materiaId} (${s.año} ${s.conv})</span>
        <strong>${s.nota != null ? s.nota.toFixed(2) : "—"}/10 · ${s.minutos} min</strong>
      </li>`;
    }).join("");
  }

  // =====================================================================
  //  FASE 2 — Flashcards con repetición espaciada (algoritmo SM-2)
  // =====================================================================
  function inicializarMazos() {
    const fc = window.PAU_FLASHCARDS || {};
    Object.entries(fc).forEach(([materiaId, deck]) => {
      if (!state.flashcards[materiaId]) {
        state.flashcards[materiaId] = deck.cards.map((c, i) => ({
          id: `${materiaId}-${i}`,
          f: c.f,
          b: c.b,
          ease: 2.5,    // factor de facilidad SM-2
          interval: 0,  // días hasta próximo repaso
          due: todayISO(),
          reps: 0,
        }));
      }
    });
    save();
  }

  function srsUpdate(card, q) {
    // q ∈ {0,3,4,5}: 0 = falló, ≥3 = acierto
    if (q < 3) {
      card.reps = 0;
      card.interval = 1; // mañana
    } else {
      card.reps += 1;
      if (card.reps === 1) card.interval = 1;
      else if (card.reps === 2) card.interval = 6;
      else card.interval = Math.round(card.interval * card.ease);
      card.ease = Math.max(1.3, card.ease + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));
    }
    const d = new Date();
    d.setDate(d.getDate() + card.interval);
    card.due = d.toISOString().slice(0, 10);
  }

  let fcSession = null; // { materiaId, queue, idx, currentCard }

  function renderFlashcardsDecks() {
    inicializarMazos();
    $("#fc-decks").classList.remove("hidden");
    $("#fc-study").classList.add("hidden");
    const cont = $("#fc-decks-list");
    const materias = getMateriasUsuario();
    const today = todayISO();

    const items = materias.map((m) => {
      const cards = state.flashcards[m.id] || [];
      if (!cards.length) return null;
      const due = cards.filter((c) => c.due <= today).length;
      return `<div class="deck" style="border-left-color:${m.color}">
        <div>
          <strong>${m.nombre}</strong>
          <div class="muted">${cards.length} tarjetas · <span style="color:${due ? 'var(--accent)' : 'var(--text-muted)'}">${due} para repasar hoy</span></div>
        </div>
        <button class="btn-primary" data-deck="${m.id}" ${due === 0 ? "disabled" : ""}>${due ? "📚 Estudiar" : "✓ Al día"}</button>
      </div>`;
    }).filter(Boolean);

    cont.innerHTML = items.length ? items.join("") : `<p class="muted">No hay mazos disponibles para tus materias.</p>`;
    $$(".deck button[data-deck]", cont).forEach((b) => {
      b.addEventListener("click", () => iniciarFC(b.dataset.deck));
    });
  }

  function iniciarFC(materiaId) {
    const today = todayISO();
    const due = (state.flashcards[materiaId] || []).filter((c) => c.due <= today);
    if (!due.length) return;
    // Mezclamos
    fcSession = {
      materiaId,
      queue: due.sort(() => Math.random() - 0.5),
      idx: 0,
      total: due.length,
    };
    $("#fc-decks").classList.add("hidden");
    $("#fc-study").classList.remove("hidden");
    const m = getMateriasUsuario().find((x) => x.id === materiaId);
    $("#fc-deck-name").textContent = `🃏 ${m?.nombre || materiaId}`;
    mostrarFCActual();
  }

  function mostrarFCActual() {
    if (!fcSession) return;
    if (fcSession.idx >= fcSession.queue.length) {
      // Sesión terminada
      $("#fc-front").innerHTML = `<div style="font-size:1.2rem">🎉<br/>¡Sesión completada!</div>`;
      $("#fc-back-side").classList.add("hidden");
      $("#fc-show-controls").classList.add("hidden");
      $("#fc-rating").classList.add("hidden");
      setTimeout(() => renderFlashcardsDecks(), 1500);
      return;
    }
    const card = fcSession.queue[fcSession.idx];
    fcSession.currentCard = card;
    $("#fc-counter").textContent = `${fcSession.idx + 1} / ${fcSession.total}`;
    $("#fc-due-count").textContent = `Ease: ${card.ease.toFixed(2)} · ${card.reps} repasos`;
    $("#fc-front").textContent = card.f;
    $("#fc-back-side").textContent = card.b;
    $("#fc-back-side").classList.add("hidden");
    $("#fc-show-controls").classList.remove("hidden");
    $("#fc-rating").classList.add("hidden");
  }

  function setupFlashcards() {
    $("#fc-flip").addEventListener("click", () => {
      $("#fc-back-side").classList.remove("hidden");
      $("#fc-show-controls").classList.add("hidden");
      $("#fc-rating").classList.remove("hidden");
    });
    $$(".btn-rating").forEach((b) => {
      b.addEventListener("click", () => {
        const q = parseInt(b.dataset.q, 10);
        srsUpdate(fcSession.currentCard, q);
        save();
        fcSession.idx++;
        mostrarFCActual();
      });
    });
    $("#fc-back").addEventListener("click", renderFlashcardsDecks);

    $("#fc-create").addEventListener("click", () => {
      const materias = getMateriasUsuario();
      const opts = materias.map((m) => `<option value="${m.id}">${m.nombre}</option>`).join("");
      openModal(`
        <h3>➕ Nueva tarjeta</h3>
        <label>Materia<select id="nf-mat">${opts}</select></label>
        <label>Frente (pregunta)<textarea id="nf-f" rows="2"></textarea></label>
        <label>Dorso (respuesta)<textarea id="nf-b" rows="3"></textarea></label>
        <button class="btn-primary" id="nf-save">Crear</button>
      `);
      $("#nf-save").addEventListener("click", () => {
        const mid = $("#nf-mat").value;
        const f = $("#nf-f").value.trim();
        const b = $("#nf-b").value.trim();
        if (!f || !b) { alert("Completa ambos campos"); return; }
        if (!state.flashcards[mid]) state.flashcards[mid] = [];
        state.fcCustomCount = (state.fcCustomCount || 0) + 1;
        state.flashcards[mid].push({
          id: `${mid}-custom-${state.fcCustomCount}`,
          f, b, ease: 2.5, interval: 0, due: todayISO(), reps: 0,
        });
        save();
        closeModal();
        renderFlashcardsDecks();
      });
    });

    const btnBanco = $("#fc-import-banco");
    if (btnBanco) btnBanco.addEventListener("click", abrirImportadorBanco);
  }

  function abrirImportadorBanco() {
    const banco = window.PAU_FLASHCARDS_BANCO;
    if (!banco) { alert("Banco no disponible."); return; }
    const materias = getMateriasUsuario();
    const disponibles = materias.filter((m) => banco.obtener(m.id).length > 0);
    if (!disponibles.length) {
      alert("No hay flashcards en el banco para tus materias.");
      return;
    }
    openModal(`
      <h3>📦 Banco de flashcards predefinidas</h3>
      <p class="muted">Añade tarjetas ya preparadas a tus mazos. Solo se añadirán las que aún no tengas.</p>
      <div id="banco-list">
        ${disponibles.map((m) => {
          const fcs = banco.obtener(m.id);
          return `
            <div class="banco-mat">
              <label>
                <input type="checkbox" data-banco-mid="${m.id}" checked />
                <strong>${m.nombre}</strong> — ${fcs.length} tarjetas
              </label>
            </div>`;
        }).join("")}
      </div>
      <button id="banco-add" class="btn-primary">📥 Añadir seleccionadas</button>
      <p id="banco-status" class="muted"></p>
    `);
    $("#banco-add").addEventListener("click", () => {
      let total = 0;
      document.querySelectorAll("[data-banco-mid]:checked").forEach((cb) => {
        const mid = cb.dataset.bancoMid;
        const fcs = banco.obtener(mid);
        if (!state.flashcards[mid]) state.flashcards[mid] = [];
        const existentes = new Set(state.flashcards[mid].map((c) => c.f));
        fcs.forEach((c, i) => {
          if (existentes.has(c.f)) return;
          state.flashcards[mid].push({
            id: `${mid}-banco-${Date.now()}-${i}`,
            f: c.f, b: c.b, ease: 2.5, interval: 0, due: todayISO(), reps: 0,
          });
          total++;
        });
      });
      save();
      $("#banco-status").innerHTML = `<span style="color:var(--success)">✅ Añadidas ${total} tarjetas nuevas.</span>`;
      setTimeout(() => { closeModal(); renderFlashcardsDecks(); }, 1500);
    });
  }

  // ---- IMPORTADOR DE EXÁMENES CON IA ----
  function setupImportadorExamenes() {
    const sel = $("#imp-ex-materia");
    if (!sel) return;
    sel.innerHTML = getMateriasUsuario().map((m) => `<option value="${m.id}">${m.nombre}</option>`).join("");

    const fileInput = $("#imp-ex-file");
    fileInput.addEventListener("change", async (e) => {
      const f = e.target.files[0];
      if (!f) return;
      $("#imp-ex-status").textContent = "⏳ Extrayendo texto…";
      try {
        const data = await window.PAU_ADJUNTOS.procesarArchivo(f);
        $("#imp-ex-texto").value = data.texto || "";
        $("#imp-ex-status").textContent = `✅ ${data.texto?.length || 0} caracteres extraídos.`;
      } catch (err) {
        $("#imp-ex-status").innerHTML = `<span style="color:var(--danger)">❌ ${err.message}</span>`;
      }
    });

    $("#imp-ex-go").addEventListener("click", async () => {
      const texto = $("#imp-ex-texto").value.trim();
      if (texto.length < 50) { $("#imp-ex-status").textContent = "⚠️ Pega más texto (mín. 50 chars)."; return; }
      const mid = sel.value;
      const m = getMateriasUsuario().find((x) => x.id === mid);
      $("#imp-ex-status").textContent = "🤖 Procesando con IA… (puede tardar 10-30 s)";
      try {
        const preguntas = await window.PAU_IMPORTADOR.extraer(texto, m.nombre);
        $("#imp-ex-status").innerHTML = `<span style="color:var(--success)">✅ ${preguntas.length} preguntas extraídas.</span>`;
        renderPreviewImpEx(preguntas, mid);
      } catch (err) {
        $("#imp-ex-status").innerHTML = `<span style="color:var(--danger)">❌ ${err.message}</span>`;
      }
    });
  }

  function renderPreviewImpEx(preguntas, mid) {
    const cont = $("#imp-ex-preview");
    cont.innerHTML = `
      <div class="ia-preguntas-preview">
        ${preguntas.map((p, i) => `
          <div class="ia-pregunta">
            <strong>${i + 1}. ${escapeHtml(p.pregunta || "")}</strong>
            <ol type="a">
              ${(p.opciones || []).map((o, j) => `<li class="${j === p.correcta ? "ok" : ""}">${escapeHtml(o)}</li>`).join("")}
            </ol>
            ${p.explicacion ? `<small class="muted">${escapeHtml(p.explicacion)}</small>` : ""}
          </div>
        `).join("")}
      </div>
      <button id="imp-ex-save" class="btn-primary">💾 Guardar en mis tests</button>
    `;
    $("#imp-ex-save").addEventListener("click", () => {
      if (!state.testsCustom[mid]) state.testsCustom[mid] = [];
      preguntas.forEach((p) => {
        state.testsCustom[mid].push({
          q: p.pregunta,
          opts: p.opciones,
          correct: p.correcta,
          expl: p.explicacion,
        });
      });
      save();
      $("#imp-ex-status").innerHTML = `<span style="color:var(--success)">✅ Guardadas ${preguntas.length} preguntas en tus tests.</span>`;
      cont.innerHTML = "";
      $("#imp-ex-texto").value = "";
    });
  }

  // =====================================================================
  //  FASE 2 — Tests por tema con análisis de errores
  // =====================================================================
  let testSession = null;

  function renderTests() {
    poblarSelectMateria("#test-materia");
    // Filtrar select sólo a materias con preguntas
    const sel = $("#test-materia");
    const materias = getMateriasUsuario().filter((m) => window.PAU_TESTS[m.id]);
    sel.innerHTML = materias.map((m) => `<option value="${m.id}">${m.nombre}</option>`).join("");
    if (!materias.length) sel.innerHTML = `<option>Sin tests para tus materias</option>`;
    renderTestHistory();
  }

  function setupTests() {
    $("#test-start").addEventListener("click", () => {
      const id = $("#test-materia").value;
      const num = parseInt($("#test-num").value, 10);
      iniciarTest(id, num);
    });
    $("#test-cancel").addEventListener("click", () => {
      testSession = null;
      $("#test-running").classList.add("hidden");
      $("#test-setup").classList.remove("hidden");
    });
    $("#test-next").addEventListener("click", siguienteTest);
    $("#test-retry").addEventListener("click", () => {
      $("#test-result").classList.add("hidden");
      $("#test-setup").classList.remove("hidden");
    });
  }

  function iniciarTest(materiaId, num) {
    const banco = window.PAU_TESTS[materiaId]?.preguntas || [];
    if (!banco.length) return;
    const preguntas = [...banco].sort(() => Math.random() - 0.5);
    const seleccion = num > 0 ? preguntas.slice(0, Math.min(num, preguntas.length)) : preguntas;
    testSession = { materiaId, preguntas: seleccion, idx: 0, aciertos: 0, errores: [] };
    $("#test-setup").classList.add("hidden");
    $("#test-result").classList.add("hidden");
    $("#test-running").classList.remove("hidden");
    mostrarPreguntaTest();
  }

  function mostrarPreguntaTest() {
    const s = testSession;
    if (!s) return;
    const p = s.preguntas[s.idx];
    $("#test-counter").textContent = `${s.idx + 1} / ${s.preguntas.length}`;
    $("#test-question").innerHTML = `<h3>${p.q}</h3>`;
    $("#test-options").innerHTML = p.opts.map((o, i) => `
      <button class="test-opt" data-i="${i}">${String.fromCharCode(65 + i)}. ${o}</button>
    `).join("");
    $("#test-feedback").classList.add("hidden");
    $("#test-next").classList.add("hidden");

    $$(".test-opt").forEach((btn) => {
      btn.addEventListener("click", () => {
        const i = parseInt(btn.dataset.i, 10);
        const ok = i === p.correct;
        $$(".test-opt").forEach((b) => {
          b.disabled = true;
          const bi = parseInt(b.dataset.i, 10);
          if (bi === p.correct) b.classList.add("correct");
          else if (bi === i) b.classList.add("wrong");
        });
        if (ok) s.aciertos++;
        else s.errores.push(s.idx);
        $("#test-feedback").classList.remove("hidden");
        $("#test-feedback").innerHTML = `<div class="feedback ${ok ? "ok" : "ko"}">
          ${ok ? "✅ ¡Correcto!" : "❌ Incorrecto"} · ${p.expl}
        </div>`;
        $("#test-next").classList.remove("hidden");
        $("#test-next").textContent = s.idx === s.preguntas.length - 1 ? "Ver resultado" : "Siguiente →";
      });
    });
  }

  function siguienteTest() {
    const s = testSession;
    if (!s) return;
    s.idx++;
    if (s.idx >= s.preguntas.length) {
      finalizarTest();
    } else {
      mostrarPreguntaTest();
    }
  }

  function finalizarTest() {
    const s = testSession;
    state.tests.push({
      fecha: todayISO(),
      materiaId: s.materiaId,
      total: s.preguntas.length,
      aciertos: s.aciertos,
      errores: s.errores.map((i) => s.preguntas[i].q),
    });
    state.sesiones.push({ fecha: todayISO(), materiaId: s.materiaId, minutos: Math.max(1, s.preguntas.length), tipo: "test" });
    save();
    actualizarRacha();
    const pct = Math.round((s.aciertos / s.preguntas.length) * 100);
    const erroresHTML = s.errores.length
      ? `<div style="margin-top:14px;text-align:left">
          <strong>Repasa estos temas:</strong>
          <ul>${s.errores.map((i) => `<li>${s.preguntas[i].q}</li>`).join("")}</ul>
        </div>`
      : `<p style="margin-top:14px">🎉 ¡Pleno! Sin errores.</p>`;

    $("#test-running").classList.add("hidden");
    $("#test-result").classList.remove("hidden");
    $("#test-score").innerHTML = `
      <h2 style="font-size:3rem;color:var(--primary)">${s.aciertos}/${s.preguntas.length}</h2>
      <p class="muted">${pct}% de aciertos</p>
      ${erroresHTML}`;
    testSession = null;
    renderTestHistory();
    renderDashboard();
  }

  function renderTestHistory() {
    const cont = $("#test-history");
    if (!state.tests.length) {
      cont.innerHTML = `<p class="muted">Aún no has hecho ningún test.</p>`;
      return;
    }
    // Estadísticas por materia
    const porMateria = {};
    state.tests.forEach((t) => {
      if (!porMateria[t.materiaId]) porMateria[t.materiaId] = { aciertos: 0, total: 0, n: 0 };
      porMateria[t.materiaId].aciertos += t.aciertos;
      porMateria[t.materiaId].total += t.total;
      porMateria[t.materiaId].n++;
    });
    const all = [...D.materiasComunes, ...D.materiasModalidad, ...D.materiasEspecificas];
    const stats = Object.entries(porMateria).map(([mid, s]) => {
      const m = all.find((x) => x.id === mid);
      const pct = Math.round((s.aciertos / s.total) * 100);
      return `<div class="progress-row">
        <span class="name">${m?.nombre || mid}</span>
        <div class="progress-bar"><div class="progress-fill" style="width:${pct}%; background:${pct >= 70 ? 'var(--success)' : pct >= 50 ? 'var(--accent)' : 'var(--danger)'}"></div></div>
        <span class="pct">${pct}% (${s.n})</span>
      </div>`;
    }).join("");
    cont.innerHTML = stats + `<p class="muted" style="margin-top:8px">Última sesión: ${[...state.tests].pop().fecha}. Total: <strong>${state.tests.length} tests</strong> realizados.</p>`;
  }

  // =====================================================================
  //  FASE 2 — Apuntes Markdown por materia
  // =====================================================================
  let notesSaveTimer = null;
  let apuntesSetup = false;

  function renderApuntes() {
    poblarSelectMateria("#notes-materia");
    const sel = $("#notes-materia");
    const editor = $("#notes-editor");

    const cargarApuntes = () => {
      const id = sel.value;
      editor.value = state.apuntes[id] || "";
      $("#notes-render").classList.add("hidden");
      $("#notes-saved").textContent = "";
      renderAdjuntos();
    };

    if (!apuntesSetup) {
      apuntesSetup = true;
      sel.addEventListener("change", cargarApuntes);

      editor.addEventListener("input", () => {
        clearTimeout(notesSaveTimer);
        $("#notes-saved").textContent = "Escribiendo…";
        notesSaveTimer = setTimeout(() => {
          const id = sel.value;
          state.apuntes[id] = editor.value;
          save();
          $("#notes-saved").textContent = `💾 Guardado a las ${new Date().toLocaleTimeString("es-ES").slice(0, 5)}`;
        }, 500);
      });

      $("#notes-preview").addEventListener("click", () => {
        const html = miniMarkdown(editor.value);
        const renderEl = $("#notes-render");
        renderEl.innerHTML = html;
        renderEl.classList.toggle("hidden");
      });

      setupAdjuntos();
    }
    cargarApuntes();
  }

  // =====================================================================
  //  Adjuntos (archivos y enlaces) por materia
  // =====================================================================
  function getMateriaActualApuntes() {
    return $("#notes-materia").value;
  }

  function setupAdjuntos() {
    if (!window.PAU_ADJUNTOS) return;
    const A = window.PAU_ADJUNTOS;

    $("#adj-upload-btn").addEventListener("click", () => {
      $("#adj-file-input").click();
    });

    $("#adj-file-input").addEventListener("change", async (e) => {
      const files = [...e.target.files];
      e.target.value = "";
      if (!files.length) return;
      const materiaId = getMateriaActualApuntes();
      if (!materiaId) return alert("Selecciona una materia primero.");

      const status = $("#adj-status");
      let ok = 0, fail = 0;
      for (const f of files) {
        status.textContent = `⏳ Procesando "${f.name}"…`;
        try {
          const adj = await A.procesarArchivo(f);
          guardarAdjunto(materiaId, adj);
          ok++;
        } catch (err) {
          console.error(err);
          status.textContent = `❌ ${f.name}: ${err.message}`;
          fail++;
        }
      }
      const msg = [];
      if (ok) msg.push(`✅ ${ok} archivo(s) añadido(s)`);
      if (fail) msg.push(`⚠️ ${fail} con error`);
      status.textContent = msg.join(" · ");
      renderAdjuntos();
    });

    $("#adj-link-btn").addEventListener("click", () => {
      $("#adj-link-form").classList.toggle("hidden");
      $("#adj-link-url").focus();
    });

    $("#adj-link-cancel").addEventListener("click", () => {
      $("#adj-link-form").classList.add("hidden");
      $("#adj-link-url").value = "";
      $("#adj-link-title").value = "";
    });

    $("#adj-link-save").addEventListener("click", () => {
      const materiaId = getMateriaActualApuntes();
      if (!materiaId) return alert("Selecciona una materia primero.");
      try {
        const link = A.crearEnlace($("#adj-link-url").value, $("#adj-link-title").value);
        guardarAdjunto(materiaId, link);
        $("#adj-link-form").classList.add("hidden");
        $("#adj-link-url").value = "";
        $("#adj-link-title").value = "";
        $("#adj-status").textContent = `✅ Enlace guardado.`;
        renderAdjuntos();
      } catch (e) {
        alert(e.message);
      }
    });
  }

  function guardarAdjunto(materiaId, adj) {
    if (!state.adjuntos) state.adjuntos = {};
    if (!state.adjuntos[materiaId]) state.adjuntos[materiaId] = [];
    state.adjuntos[materiaId].push(adj);
    try {
      save();
    } catch (e) {
      // localStorage lleno: descartamos el dataUrl y reintentamos
      if (adj.dataUrl) {
        delete adj.dataUrl;
        try {
          save();
          $("#adj-status").innerHTML = `⚠️ Archivo demasiado grande para guardar el original; conservado solo el texto extraído.`;
          return;
        } catch (_) { /* sigue */ }
      }
      // Quitar el adjunto que falló
      state.adjuntos[materiaId].pop();
      throw new Error("Almacenamiento lleno. Borra adjuntos antiguos.");
    }
  }

  function borrarAdjunto(materiaId, id) {
    if (!state.adjuntos?.[materiaId]) return;
    state.adjuntos[materiaId] = state.adjuntos[materiaId].filter((a) => a.id !== id);
    save();
    renderAdjuntos();
  }

  function insertarTextoEnApuntes(materiaId, adj) {
    const editor = $("#notes-editor");
    const sep = editor.value && !editor.value.endsWith("\n") ? "\n\n" : "";
    const cab = `\n## 📎 ${adj.name}\n`;
    editor.value += sep + cab + (adj.text || "") + "\n";
    state.apuntes[materiaId] = editor.value;
    save();
    $("#notes-saved").textContent = `💾 Insertado en apuntes`;
  }

  function abrirAdjunto(adj) {
    if (adj.type === "link") {
      window.open(adj.url, "_blank", "noopener");
      return;
    }
    if (adj.dataUrl) {
      const w = window.open();
      if (!w) return alert("Bloqueado por el navegador. Permite ventanas emergentes.");
      if (adj.kind === "imagen") {
        w.document.write(`<img src="${adj.dataUrl}" style="max-width:100%">`);
      } else {
        // PDF u otros: abrir directamente
        w.location.href = adj.dataUrl;
      }
      return;
    }
    if (adj.text) {
      const w = window.open();
      if (!w) return alert("Bloqueado por el navegador. Permite ventanas emergentes.");
      w.document.write(`<pre style="white-space:pre-wrap;font-family:system-ui;padding:20px">${
        adj.text.replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c]))
      }</pre>`);
      return;
    }
    alert("No hay contenido que mostrar.");
  }

  function renderAdjuntos() {
    if (!window.PAU_ADJUNTOS) return;
    const A = window.PAU_ADJUNTOS;
    const cont = $("#adj-list");
    if (!cont) return;
    const materiaId = getMateriaActualApuntes();
    const lista = (state.adjuntos?.[materiaId]) || [];
    if (!lista.length) {
      cont.innerHTML = `<p class="muted">No hay archivos ni enlaces para esta materia.</p>`;
      return;
    }
    cont.innerHTML = lista.map((adj) => {
      const sub = adj.type === "link"
        ? `<a href="${escapeHtml(adj.url)}" target="_blank" rel="noopener" class="muted">${escapeHtml(adj.url)}</a>`
        : `<span class="muted">${A.formatearTamano(adj.size)} · ${adj.text ? `${adj.text.length} caracteres extraídos` : "sin texto"}</span>`;
      const acciones = adj.type === "link"
        ? `<button class="btn-ghost adj-open" data-id="${adj.id}">🔗 Abrir</button>`
        : `<button class="btn-ghost adj-open" data-id="${adj.id}">👁️ Ver</button>
           ${adj.text ? `<button class="btn-ghost adj-insert" data-id="${adj.id}">📥 Insertar</button>` : ""}`;
      return `<div class="adj-item">
        <div class="adj-icon">${A.iconoAdjunto(adj)}</div>
        <div class="adj-info">
          <strong>${escapeHtml(adj.name)}</strong>
          <div>${sub}</div>
        </div>
        <div class="adj-actions">
          ${acciones}
          <button class="btn-ghost adj-del" data-id="${adj.id}" title="Borrar">🗑️</button>
        </div>
      </div>`;
    }).join("");

    // Listeners
    cont.querySelectorAll(".adj-open").forEach((b) => {
      b.addEventListener("click", () => {
        const adj = lista.find((a) => a.id === b.dataset.id);
        if (adj) abrirAdjunto(adj);
      });
    });
    cont.querySelectorAll(".adj-insert").forEach((b) => {
      b.addEventListener("click", () => {
        const adj = lista.find((a) => a.id === b.dataset.id);
        if (adj) insertarTextoEnApuntes(materiaId, adj);
      });
    });
    cont.querySelectorAll(".adj-del").forEach((b) => {
      b.addEventListener("click", () => {
        if (!confirm("¿Borrar este adjunto?")) return;
        borrarAdjunto(materiaId, b.dataset.id);
      });
    });
  }

  // Mini parser de Markdown sin dependencias (suficiente para apuntes)
  function miniMarkdown(src) {
    if (!src) return "<p><em>Sin apuntes.</em></p>";
    let html = src
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    html = html.replace(/^### (.*)$/gm, "<h3>$1</h3>")
               .replace(/^## (.*)$/gm, "<h2>$1</h2>")
               .replace(/^# (.*)$/gm, "<h1>$1</h1>");
    html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
               .replace(/\*([^*]+)\*/g, "<em>$1</em>")
               .replace(/`([^`]+)`/g, "<code>$1</code>");
    // Listas
    html = html.replace(/(^|\n)((?:- .+(?:\n|$))+)/g, (m, pre, block) => {
      const items = block.trim().split(/\n/).map((l) => `<li>${l.replace(/^- /, "")}</li>`).join("");
      return `${pre}<ul>${items}</ul>`;
    });
    // Párrafos
    html = html.split(/\n{2,}/).map((p) => {
      if (/^<(h\d|ul|ol|p)/i.test(p.trim())) return p;
      return `<p>${p.replace(/\n/g, "<br/>")}</p>`;
    }).join("\n");
    return html;
  }

  // =====================================================================
  //  FASE 3 — Generador automático de plan de estudio
  // =====================================================================
  function calcularPesoMateria(materia) {
    // Combinación: 0..1 según urgencia
    let peso = 1;
    // Temas pendientes (no dominados)
    const total = totalTemas(materia);
    const dominados = temasDominados(materia);
    const pctPendiente = total ? 1 - dominados / total : 0.5;
    peso += pctPendiente * 2;

    // % de aciertos en tests (cuanto peor, más prioridad)
    const tests = (state.tests || []).filter((t) => t.materiaId === materia.id);
    if (tests.length) {
      const aciertos = tests.reduce((a, t) => a + t.aciertos, 0);
      const totalP = tests.reduce((a, t) => a + t.total, 0);
      const pct = aciertos / totalP;
      peso += (1 - pct) * 1.5;
    }

    // Última nota de simulacro
    const sims = (state.simulacros || []).filter((s) => s.materiaId === materia.id && s.nota != null);
    if (sims.length) {
      const last = sims[sims.length - 1].nota;
      peso += Math.max(0, (8 - last) / 8) * 1.5;
    }

    // Ponderación del grado objetivo
    const grado = (typeof getGradoById === "function") ? getGradoById(state.gradoObjetivo) : window.PAU_GRADOS.find((g) => g.id === state.gradoObjetivo);
    if (grado && grado.pond[materia.id]) {
      peso += grado.pond[materia.id] * 5; // x5 para dar peso significativo
    }

    return peso;
  }

  function generarPlanAutomatico() {
    if (!confirm("Esto sobrescribirá tu plan semanal actual. ¿Continuar?")) return;
    const materias = getMateriasUsuario();
    if (!materias.length) return;

    // Calcular pesos y normalizar
    const pesos = materias.map((m) => ({ m, w: calcularPesoMateria(m) }));
    const totalPeso = pesos.reduce((a, p) => a + p.w, 0);
    pesos.forEach((p) => (p.cuota = p.w / totalPeso));

    // Total de slots: 7 días × 6 franjas = 42
    // Ocupamos sólo franjas de tarde-noche entre semana (10) + finde mañana y tarde (12) = 22
    const slotsLaboral = ["16-18", "18-20", "20-22"];
    const slotsFinde = ["10-12", "12-14", "16-18", "18-20"];
    const planSlots = [];
    DIAS.forEach((d) => {
      const slots = (d === "Sáb" || d === "Dom") ? slotsFinde : slotsLaboral;
      slots.forEach((h) => planSlots.push(`${d}-${h}`));
    });

    // Repartir slots por cuota (algoritmo de mayor restos)
    const reparto = pesos.map((p) => ({
      m: p.m,
      ideal: p.cuota * planSlots.length,
      asignados: 0,
    }));
    reparto.forEach((r) => (r.asignados = Math.floor(r.ideal)));
    let restantes = planSlots.length - reparto.reduce((a, r) => a + r.asignados, 0);
    reparto.sort((a, b) => (b.ideal - b.asignados) - (a.ideal - a.asignados));
    for (let i = 0; i < restantes; i++) reparto[i].asignados++;

    // Generar lista de slots por materia, mezclar para interleaving
    const queue = [];
    reparto.forEach((r) => {
      for (let i = 0; i < r.asignados; i++) queue.push(r.m);
    });
    // Mezcla
    queue.sort(() => Math.random() - 0.5);

    // Asignar al planner
    const nuevoPlanner = {};
    planSlots.forEach((slot, i) => {
      const m = queue[i];
      if (m) {
        const total = totalTemas(m);
        const dominados = temasDominados(m);
        const pendientes = total - dominados;
        nuevoPlanner[slot] = {
          materiaId: m.id,
          nota: pendientes > 0 ? `${pendientes} temas pdtes.` : "Repaso",
        };
      }
    });

    state.planner = nuevoPlanner;
    save();
    renderPlanner();
    notify("📅 Plan generado", "Tu plan semanal está listo.");
  }

  // =====================================================================
  //  FASE 3 — Panel de puntos débiles y análisis
  // =====================================================================
  function calcularAnalisis() {
    const materias = getMateriasUsuario();
    return materias.map((m) => {
      const total = totalTemas(m);
      const dominados = temasDominados(m);
      const pctTemas = total ? Math.round((dominados / total) * 100) : 0;

      const tests = (state.tests || []).filter((t) => t.materiaId === m.id);
      const aciertos = tests.reduce((a, t) => a + t.aciertos, 0);
      const totalP = tests.reduce((a, t) => a + t.total, 0);
      const pctTests = totalP ? Math.round((aciertos / totalP) * 100) : null;

      const sims = (state.simulacros || []).filter((s) => s.materiaId === m.id && s.nota != null);
      const ultSim = sims.length ? sims[sims.length - 1].nota : null;

      // Score: cuanto más alto, peor (más urgencia de estudiar)
      const score = (100 - pctTemas) * 0.5 + (pctTests !== null ? (100 - pctTests) * 0.3 : 30) + (ultSim !== null ? (10 - ultSim) * 5 : 25);

      return { materia: m, pctTemas, pctTests, ultSim, score };
    }).sort((a, b) => b.score - a.score);
  }

  function renderAnalisis() {
    const datos = calcularAnalisis();
    const top3 = datos.slice(0, 3);
    const cont = $("#prioridades");
    if (!datos.length) {
      cont.innerHTML = `<p class="muted">Configura primero tus materias.</p>`;
      return;
    }
    cont.innerHTML = top3.map((d, i) => `
      <div class="prioridad-item" style="border-left-color:${d.materia.color}">
        <div class="prio-num">${i + 1}</div>
        <div class="prio-info">
          <strong>${d.materia.nombre}</strong>
          <div class="muted">
            ${d.pctTemas}% temas dominados ·
            ${d.pctTests !== null ? `${d.pctTests}% aciertos tests` : "Sin tests"} ·
            ${d.ultSim !== null ? `Último simulacro ${d.ultSim}/10` : "Sin simulacros"}
          </div>
        </div>
      </div>
    `).join("");

    // Tabla detallada
    $("#analisis-table").innerHTML = `
      <div class="analisis-header">
        <span>Materia</span>
        <span>Temas</span>
        <span>Tests</span>
        <span>Simulacro</span>
      </div>
      ${datos.map((d) => `
        <div class="analisis-row">
          <span class="name">${d.materia.nombre}</span>
          <span class="${d.pctTemas >= 70 ? "good" : d.pctTemas >= 40 ? "mid" : "bad"}">${d.pctTemas}%</span>
          <span class="${d.pctTests >= 70 ? "good" : d.pctTests >= 50 ? "mid" : "bad"}">${d.pctTests !== null ? d.pctTests + "%" : "—"}</span>
          <span class="${d.ultSim >= 7 ? "good" : d.ultSim >= 5 ? "mid" : "bad"}">${d.ultSim !== null ? d.ultSim.toFixed(1) : "—"}</span>
        </div>
      `).join("")}
    `;

    // Bienestar
    const B = window.PAU_BIENESTAR;
    const r = B.respiracion[Math.floor(Math.random() * B.respiracion.length)];
    const c = B.consejos[Math.floor(Math.random() * B.consejos.length)];
    $("#bienestar").innerHTML = `
      <div class="bienestar-card">
        <h4>🌬️ Ejercicio de respiración</h4>
        <p>${r}</p>
      </div>
      <div class="bienestar-card">
        <h4>💡 Consejo del día</h4>
        <p>${c}</p>
      </div>
    `;
  }

  // =====================================================================
  //  FASE 3 — Logros y gamificación
  // =====================================================================
  function comprobarLogros() {
    const nuevos = [];
    (window.PAU_LOGROS || []).forEach((l) => {
      if (!state.logrosDesbloqueados.includes(l.id) && l.check(state)) {
        state.logrosDesbloqueados.push(l.id);
        nuevos.push(l);
      }
    });
    if (nuevos.length) {
      save();
      nuevos.forEach((l) => mostrarToastLogro(l));
    }
    return nuevos;
  }

  function mostrarToastLogro(logro) {
    const t = document.createElement("div");
    t.className = "toast-logro";
    t.innerHTML = `<div class="toast-icon">${logro.icono}</div>
      <div><strong>¡Logro desbloqueado!</strong><br/>${logro.nombre}</div>`;
    document.body.appendChild(t);
    setTimeout(() => t.classList.add("show"), 50);
    setTimeout(() => {
      t.classList.remove("show");
      setTimeout(() => t.remove(), 400);
    }, 4000);
  }

  function renderLogros() {
    const cont = $("#logros-grid");
    const todos = window.PAU_LOGROS || [];
    const desbloqueados = state.logrosDesbloqueados || [];
    $("#logros-count").textContent = desbloqueados.length;
    $("#logros-total").textContent = todos.length;
    cont.innerHTML = todos.map((l) => {
      const ok = desbloqueados.includes(l.id);
      return `<div class="logro ${ok ? "unlocked" : "locked"}">
        <div class="logro-icon">${ok ? l.icono : "🔒"}</div>
        <div>
          <strong>${l.nombre}</strong>
          <div class="muted">${l.desc}</div>
        </div>
      </div>`;
    }).join("");
  }

  // =====================================================================
  //  FASE 3 — Grado objetivo
  // =====================================================================
  // Lista combinada (predefinidos + custom) con overrides aplicados
  function getGradosAll() {
    const base = (window.PAU_GRADOS || []).map((g) => {
      const ov = (state.gradosOverrides || {})[g.id];
      return ov ? { ...g, ...ov, _overridden: true } : g;
    });
    const custom = (state.gradosCustom || []).map((g) => ({ ...g, custom: true }));
    return [...base, ...custom];
  }

  function getGradoById(id) {
    return getGradosAll().find((g) => g.id === id);
  }

  function setupGradoObjetivo() {
    const sel = $("#grado-select");
    const filtro = $("#grado-filter");
    const btnAdd = $("#btn-grado-add");
    const btnEdit = $("#btn-grado-edit");
    const btnDel = $("#btn-grado-delete");

    function pintar(termino) {
      const grados = getGradosAll();
      const t = (termino || "").toLowerCase().trim();
      const filtrados = !t ? grados : grados.filter((g) =>
        g.nombre.toLowerCase().includes(t) ||
        g.uni.toLowerCase().includes(t) ||
        g.rama.toLowerCase().includes(t)
      );

      // Agrupar: primero "Mis grados" si hay custom, luego por rama
      const ramas = {};
      const customs = [];
      filtrados.forEach((g) => {
        if (g.custom) customs.push(g);
        if (!ramas[g.rama]) ramas[g.rama] = [];
        ramas[g.rama].push(g);
      });

      let opts = `<option value="">— ${filtrados.length ? "Selecciona un grado" : "Sin resultados"} —</option>`;
      if (customs.length) {
        opts += `<optgroup label="⭐ Mis grados (${customs.length})">`;
        customs.forEach((g) => {
          opts += `<option value="${g.id}" ${state.gradoObjetivo === g.id ? "selected" : ""}>${escapeHtml(g.nombre)} — corte ${Number(g.notaCorte).toFixed(2)}</option>`;
        });
        opts += `</optgroup>`;
      }
      Object.entries(ramas).forEach(([rama, lista]) => {
        opts += `<optgroup label="${rama} (${lista.length})">`;
        lista.forEach((g) => {
          const marca = g._overridden ? " ✏️" : "";
          opts += `<option value="${g.id}" ${state.gradoObjetivo === g.id ? "selected" : ""}>${escapeHtml(g.nombre)}${marca} — corte ${Number(g.notaCorte).toFixed(2)}</option>`;
        });
        opts += `</optgroup>`;
      });
      sel.innerHTML = opts;
      actualizarBotones();
    }

    function actualizarBotones() {
      const g = state.gradoObjetivo ? getGradoById(state.gradoObjetivo) : null;
      if (btnEdit) btnEdit.disabled = !g;
      if (btnDel) {
        if (g && g.custom) {
          btnDel.style.display = "";
          btnDel.disabled = false;
        } else {
          btnDel.style.display = "none";
          btnDel.disabled = true;
        }
      }
    }

    pintar();

    if (filtro) filtro.addEventListener("input", () => pintar(filtro.value));

    sel.addEventListener("change", () => {
      state.gradoObjetivo = sel.value || null;
      save();
      renderGradoInfo();
      actualizarBotones();
    });

    if (btnAdd) btnAdd.addEventListener("click", () => abrirFormGrado(null));
    if (btnEdit) btnEdit.addEventListener("click", () => {
      if (state.gradoObjetivo) abrirFormGrado(state.gradoObjetivo);
    });
    if (btnDel) btnDel.addEventListener("click", () => {
      const g = getGradoById(state.gradoObjetivo);
      if (!g || !g.custom) return;
      if (!confirm(`¿Eliminar el grado «${g.nombre}»?`)) return;
      state.gradosCustom = (state.gradosCustom || []).filter((x) => x.id !== g.id);
      state.gradoObjetivo = null;
      save();
      pintar(filtro ? filtro.value : "");
      renderGradoInfo();
    });

    // Exponer pintar para refrescar tras guardar desde el modal
    setupGradoObjetivo._refrescar = () => pintar(filtro ? filtro.value : "");
    renderGradoInfo();
  }

  function abrirFormGrado(idEditar) {
    // Materias disponibles para ponderar (las de modalidad/específicas relevantes)
    const todasMaterias = [
      ...D.materiasComunes,
      ...D.materiasModalidad,
      ...D.materiasEspecificas,
    ];
    const ramas = ["Salud", "Ingeniería", "Ciencias", "Sociales", "Humanidades", "Artes"];

    const existente = idEditar ? getGradoById(idEditar) : null;
    const esPredefinido = existente && !existente.custom;
    const titulo = idEditar ? (esPredefinido ? "✏️ Editar grado predefinido" : "✏️ Editar grado") : "➕ Añadir grado manual";

    const valores = existente || {
      nombre: "",
      uni: "",
      rama: "Sociales",
      notaCorte: 5.0,
      pond: {},
    };

    const filasPond = todasMaterias.map((m) => {
      const valActual = valores.pond?.[m.id];
      return `
        <tr>
          <td>${escapeHtml(m.nombre)}</td>
          <td>
            <select data-pond="${m.id}">
              <option value="" ${!valActual ? "selected" : ""}>—</option>
              <option value="0.1"  ${valActual === 0.1 ? "selected" : ""}>×0.1</option>
              <option value="0.15" ${valActual === 0.15 ? "selected" : ""}>×0.15</option>
              <option value="0.2"  ${valActual === 0.2 ? "selected" : ""}>×0.2</option>
            </select>
          </td>
        </tr>`;
    }).join("");

    openModal(`
      <h3>${titulo}</h3>
      ${esPredefinido ? `<p class="muted">Estás editando un grado predefinido. Los cambios se guardan como personalización (puedes restaurar abajo).</p>` : ""}
      <label>Nombre del grado
        <input id="gf-nombre" type="text" value="${escapeHtml(valores.nombre)}" placeholder="Ej: Doble Grado Historia + Hª del Arte" />
      </label>
      <label>Universidad
        <input id="gf-uni" type="text" value="${escapeHtml(valores.uni)}" placeholder="Ej: US, UCM, UMU…" />
      </label>
      <label>Rama de conocimiento
        <select id="gf-rama">
          ${ramas.map((r) => `<option value="${r}" ${valores.rama === r ? "selected" : ""}>${r}</option>`).join("")}
        </select>
      </label>
      <label>Nota de corte (0–14)
        <input id="gf-corte" type="number" min="0" max="14" step="0.001" value="${Number(valores.notaCorte).toFixed(3)}" />
      </label>
      <h4 style="margin-top:14px">Materias que ponderan</h4>
      <p class="muted" style="font-size:0.85rem">Marca solo las materias de Fase Voluntaria que ponderan para este grado. Para PAU, los factores son ×0.1, ×0.15 o ×0.2.</p>
      <div style="max-height:300px; overflow-y:auto; border:1px solid var(--border); border-radius:8px; padding:6px;">
        <table style="width:100%; font-size:0.9rem;">
          <thead><tr><th style="text-align:left">Materia</th><th style="text-align:left; width:90px">Factor</th></tr></thead>
          <tbody>${filasPond}</tbody>
        </table>
      </div>
      <div class="row" style="margin-top:12px; display:flex; gap:8px; flex-wrap:wrap;">
        <button id="gf-save" class="btn-primary">💾 Guardar</button>
        <button id="gf-cancel" class="btn-ghost">Cancelar</button>
        ${esPredefinido && (state.gradosOverrides || {})[idEditar] ? `<button id="gf-reset" class="btn-ghost">↩️ Restaurar original</button>` : ""}
      </div>
      <div id="gf-status" class="muted" style="margin-top:8px"></div>
    `);

    $("#gf-cancel").addEventListener("click", closeModal);

    const btnReset = $("#gf-reset");
    if (btnReset) {
      btnReset.addEventListener("click", () => {
        if (!confirm("¿Restaurar los valores originales de este grado?")) return;
        if (state.gradosOverrides && state.gradosOverrides[idEditar]) {
          delete state.gradosOverrides[idEditar];
          save();
        }
        closeModal();
        if (setupGradoObjetivo._refrescar) setupGradoObjetivo._refrescar();
        renderGradoInfo();
      });
    }

    $("#gf-save").addEventListener("click", () => {
      const nombre = $("#gf-nombre").value.trim();
      const uni = $("#gf-uni").value.trim();
      const rama = $("#gf-rama").value;
      const notaCorte = parseFloat($("#gf-corte").value);

      if (!nombre) { $("#gf-status").textContent = "⚠️ El nombre es obligatorio."; return; }
      if (isNaN(notaCorte) || notaCorte < 0 || notaCorte > 14) {
        $("#gf-status").textContent = "⚠️ Nota de corte inválida (0–14)."; return;
      }

      const pond = {};
      $("#modal-body").querySelectorAll("select[data-pond]").forEach((s) => {
        if (s.value) pond[s.getAttribute("data-pond")] = parseFloat(s.value);
      });

      if (esPredefinido) {
        // Guardar como override del grado predefinido
        state.gradosOverrides = state.gradosOverrides || {};
        state.gradosOverrides[idEditar] = { nombre, uni, rama, notaCorte, pond };
      } else if (existente) {
        // Editar custom existente
        const idx = state.gradosCustom.findIndex((x) => x.id === existente.id);
        if (idx >= 0) {
          state.gradosCustom[idx] = { ...state.gradosCustom[idx], nombre, uni, rama, notaCorte, pond };
        }
      } else {
        // Crear nuevo custom
        const id = "custom-" + Date.now().toString(36);
        state.gradosCustom = state.gradosCustom || [];
        state.gradosCustom.push({ id, nombre, uni: uni || "—", rama, notaCorte, pond, custom: true });
        state.gradoObjetivo = id;
      }
      save();
      closeModal();
      if (setupGradoObjetivo._refrescar) setupGradoObjetivo._refrescar();
      renderGradoInfo();
    });
  }

  function renderGradoInfo() {
    const cont = $("#grado-info");
    const g = getGradoById(state.gradoObjetivo);
    if (!g) {
      cont.innerHTML = `<p class="muted">Selecciona un grado para ver su nota de corte y materias que más ponderan.</p>`;
      return;
    }
    const ponds = Object.entries(g.pond)
      .sort((a, b) => b[1] - a[1])
      .map(([mid, p]) => {
        const all = [...D.materiasComunes, ...D.materiasModalidad, ...D.materiasEspecificas];
        const m = all.find((x) => x.id === mid);
        return `<li><span class="pond-badge p${(p * 100).toFixed(0)}">×${p}</span> ${m?.nombre || mid}</li>`;
      }).join("");
    cont.innerHTML = `
      <div class="grado-card">
        <h4>${g.nombre}</h4>
        <p class="muted">${g.uni} · ${g.rama}</p>
        <div class="big-number" style="color:var(--primary)">${g.notaCorte.toFixed(3)}</div>
        <p class="muted">Nota de corte 2025/26 — necesitas como mínimo esta nota de admisión.</p>
        <h5>Materias que ponderan:</h5>
        <ul class="pond-list">${ponds}</ul>
        <p class="muted" style="font-size:0.8rem;margin-top:8px">Las ponderaciones se aplican a las 2 mejores notas (≥5) de la Fase Voluntaria. Pueden sumar hasta +4 a tu nota de acceso.</p>
      </div>
    `;
    // Si la calculadora ya tiene datos, refrescar
    refrescarCalcConGrado();
  }

  function refrescarCalcConGrado() {
    // Si hay grado, sugerimos las materias con mayor ponderación
    const g = getGradoById(state.gradoObjetivo);
    if (!g) return;
    const sorted = Object.entries(g.pond).sort((a, b) => b[1] - a[1]);
    if (sorted[0]) $("#calc-p1").value = sorted[0][1];
    if (sorted[1]) $("#calc-p2").value = sorted[1][1];
  }

  // =====================================================================
  //  Acciones del planificador (auto / limpiar)
  // =====================================================================
  function setupPlannerActions() {
    const auto = $("#plan-auto");
    const clear = $("#plan-clear");
    if (auto) auto.addEventListener("click", generarPlanAutomatico);
    if (clear) clear.addEventListener("click", () => {
      if (!confirm("¿Borrar todo el plan semanal?")) return;
      state.planner = {};
      save();
      renderPlanner();
    });
  }

  // =====================================================================
  //  FASE 4 — Integración con IA (OpenAI / Anthropic / Gemini)
  // =====================================================================
  const IA = window.PAU_IA;
  let chatHistory = [];        // mensajes del chat tutor (no persistido)
  let lastGenTest = null;      // último test generado pendiente de guardar
  let lastResumen = null;      // último resumen pendiente de guardar

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
  }

  function abrirAjustesIA() {
    const cfg = IA.getConfig();
    openModal(`
      <h3>🤖 Ajustes IA</h3>
      <p class="muted">Tu clave se guarda solo en este navegador. No se envía a ningún servidor nuestro.</p>
      <label>Proveedor
        <select id="ia-cfg-provider">
          <option value="">— Selecciona —</option>
          <option value="openai"     ${cfg.provider === "openai" ? "selected" : ""}>OpenAI (gpt-4o-mini)</option>
          <option value="anthropic"  ${cfg.provider === "anthropic" ? "selected" : ""}>Anthropic Claude (haiku)</option>
          <option value="gemini"     ${cfg.provider === "gemini" ? "selected" : ""}>Google Gemini (flash)</option>
          <option value="groq"       ${cfg.provider === "groq" ? "selected" : ""}>⭐ Groq (gratis, Llama 3.3)</option>
          <option value="openrouter" ${cfg.provider === "openrouter" ? "selected" : ""}>⭐ OpenRouter (free tier)</option>
        </select>
      </label>
      <label>Usuario / alias <span class="muted">(opcional, solo informativo)</span>
        <input id="ia-cfg-user" type="text" value="${escapeHtml(cfg.user || "")}" placeholder="Tu nombre o email" />
      </label>
      <label>API Key
        <input id="ia-cfg-key" type="password" value="${escapeHtml(cfg.apiKey || "")}" placeholder="sk-… / claude-… / AIza…" />
      </label>
      <label>Modelo <span class="muted">(opcional, deja vacío para el por defecto)</span>
        <input id="ia-cfg-model" type="text" value="${escapeHtml(cfg.model || "")}" placeholder="gpt-4o-mini / claude-3-5-haiku-latest / gemini-2.0-flash" />
      </label>
      <details>
        <summary>¿De dónde saco la clave?</summary>
        <ul>
          <li><strong>OpenAI:</strong> <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener">platform.openai.com/api-keys</a></li>
          <li><strong>Anthropic:</strong> <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener">console.anthropic.com/settings/keys</a></li>
          <li><strong>Gemini:</strong> <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener">aistudio.google.com/app/apikey</a></li>
          <li>⭐ <strong>Groq</strong> (gratis, muy rápido): <a href="https://console.groq.com/keys" target="_blank" rel="noopener">console.groq.com/keys</a></li>
          <li>⭐ <strong>OpenRouter</strong> (modelos gratuitos): <a href="https://openrouter.ai/keys" target="_blank" rel="noopener">openrouter.ai/keys</a></li>
        </ul>
        <p class="muted">⚠️ Anthropic puede bloquear el uso desde navegador en algunas claves; si falla, prueba con OpenAI o Gemini.</p>
      </details>
      <div class="row" style="margin-top:12px">
        <button id="ia-cfg-save" class="btn-primary">💾 Guardar</button>
        <button id="ia-cfg-test" class="btn-ghost">🧪 Probar conexión</button>
        <button id="ia-cfg-clear" class="btn-ghost">🗑️ Borrar</button>
      </div>
      <div id="ia-cfg-status" class="muted" style="margin-top:8px"></div>
    `);

    const leerForm = () => ({
      provider: $("#ia-cfg-provider").value || null,
      user: $("#ia-cfg-user").value.trim() || null,
      apiKey: $("#ia-cfg-key").value.trim() || null,
      model: $("#ia-cfg-model").value.trim() || null,
    });

    $("#ia-cfg-save").addEventListener("click", () => {
      const c = leerForm();
      if (!c.provider || !c.apiKey) {
        $("#ia-cfg-status").textContent = "⚠️ Selecciona proveedor y pega tu clave.";
        return;
      }
      IA.saveConfig(c);
      $("#ia-cfg-status").innerHTML = `<span style="color:var(--success)">✅ Guardado.</span>`;
      renderTutorStatus();
    });

    $("#ia-cfg-test").addEventListener("click", async () => {
      const c = leerForm();
      if (!c.provider || !c.apiKey) {
        $("#ia-cfg-status").textContent = "⚠️ Falta proveedor o clave.";
        return;
      }
      IA.saveConfig(c);
      $("#ia-cfg-status").textContent = "⏳ Probando…";
      try {
        const resp = await IA.chat({
          system: "Responde solo con la palabra 'ok'.",
          messages: [{ role: "user", content: "ping" }],
          temperature: 0,
        });
        $("#ia-cfg-status").innerHTML = `<span style="color:var(--success)">✅ Conexión OK. Respuesta: "${escapeHtml(resp.slice(0, 60))}"</span>`;
        renderTutorStatus();
      } catch (e) {
        $("#ia-cfg-status").innerHTML = `<span style="color:var(--danger)">❌ ${escapeHtml(e.message)}</span>`;
      }
    });

    $("#ia-cfg-clear").addEventListener("click", () => {
      if (!confirm("¿Borrar la configuración de IA?")) return;
      localStorage.removeItem("pauMurciaIA");
      closeModal();
      renderTutorStatus();
    });
  }

  function renderTutorStatus() {
    const el = $("#ia-status-text");
    if (!el) return;
    const cfg = IA.getConfig();
    if (cfg.provider && cfg.apiKey) {
      const label = IA.DEFAULTS[cfg.provider]?.label || cfg.provider;
      const model = cfg.model || IA.DEFAULTS[cfg.provider]?.model;
      el.innerHTML = `✅ IA activa — <strong>${label}</strong> · <code>${escapeHtml(model)}</code>${cfg.user ? ` · <span class="muted">${escapeHtml(cfg.user)}</span>` : ""}`;
    } else {
      el.innerHTML = `⚠️ Aún no has configurado la IA. Pulsa el botón <strong>⚙️ Configurar IA</strong> o el botón 🤖 de la barra superior.`;
    }
  }

  function setupTutor() {
    const btn = $("#ia-open-settings");
    if (!btn) return;
    btn.addEventListener("click", abrirAjustesIA);

    // Rellenar selectores de materia
    const materias = getMateriasUsuario();
    const opts = `<option value="">— Cualquiera —</option>` +
      materias.map((m) => `<option value="${m.id}">${escapeHtml(m.nombre)}</option>`).join("");
    ["#ia-chat-materia", "#ia-corr-materia", "#ia-gen-materia", "#ia-res-materia"].forEach((sel) => {
      const el = $(sel);
      if (el) el.innerHTML = opts;
    });

    setupChatTutor();
    setupCorreccion();
    setupGeneradorTests();
    setupResumen();
    setupExplicarSimple();
    renderTutorStatus();
    mergeCustomTests();
  }

  // ---------- Chat tutor ----------
  function setupChatTutor() {
    $("#ia-chat-send").addEventListener("click", enviarChat);
    $("#ia-chat-text").addEventListener("keydown", (e) => {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        enviarChat();
      }
    });
    $("#ia-chat-clear").addEventListener("click", () => {
      chatHistory = [];
      $("#ia-chat-log").innerHTML = "";
    });

    // Botón micrófono (STT)
    const btnMic = $("#ia-chat-mic");
    if (btnMic && window.PAU_VOZ?.soporta()) {
      let recog = null;
      btnMic.addEventListener("click", () => {
        if (recog) {
          recog.stop();
          return;
        }
        btnMic.classList.add("activo");
        btnMic.textContent = "⏹️";
        recog = window.PAU_VOZ.escuchar({
          onResult: (texto, interim) => {
            $("#ia-chat-text").value = texto + interim;
          },
          onEnd: () => {
            btnMic.classList.remove("activo");
            btnMic.textContent = "🎤";
            recog = null;
          },
        });
      });
    } else if (btnMic) {
      btnMic.style.display = "none";
    }

    // Botón leer última respuesta (TTS)
    const btnTts = $("#ia-chat-tts");
    if (btnTts && window.PAU_VOZ?.soportaTTS()) {
      btnTts.addEventListener("click", () => {
        const ultima = chatHistory.filter((m) => m.role === "assistant").slice(-1)[0];
        if (!ultima) return;
        // Limpiar markdown
        const limpio = ultima.content.replace(/[#*`_>-]/g, " ").replace(/\s+/g, " ");
        if (window.speechSynthesis.speaking) {
          window.PAU_VOZ.parar();
          btnTts.textContent = "🔊";
        } else {
          window.PAU_VOZ.hablar(limpio);
          btnTts.textContent = "⏹️";
          const interval = setInterval(() => {
            if (!window.speechSynthesis.speaking) {
              btnTts.textContent = "🔊";
              clearInterval(interval);
            }
          }, 500);
        }
      });
    } else if (btnTts) {
      btnTts.style.display = "none";
    }
  }

  function appendChatMessage(role, content) {
    const log = $("#ia-chat-log");
    const div = document.createElement("div");
    div.className = `ia-msg ia-msg-${role}`;
    div.innerHTML = role === "user"
      ? `<div class="ia-msg-bubble">${escapeHtml(content)}</div>`
      : `<div class="ia-msg-bubble">${miniMarkdown(content)}</div>`;
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
  }

  async function enviarChat() {
    if (!IA.isConfigured()) {
      alert("⚠️ Configura primero la IA (botón 🤖 arriba).");
      return abrirAjustesIA();
    }
    const text = $("#ia-chat-text").value.trim();
    if (!text) return;

    const materiaId = $("#ia-chat-materia").value;
    let system = IA.SYSTEM_TUTOR;
    if (materiaId) {
      const m = getMateriasUsuario().find((x) => x.id === materiaId);
      if (m) system += `\nLa estudiante está estudiando ahora: ${m.nombre}.`;
    }

    appendChatMessage("user", text);
    chatHistory.push({ role: "user", content: text });
    $("#ia-chat-text").value = "";

    const log = $("#ia-chat-log");
    const thinking = document.createElement("div");
    thinking.className = "ia-msg ia-msg-assistant";
    thinking.innerHTML = `<div class="ia-msg-bubble"><em>⏳ Pensando…</em></div>`;
    log.appendChild(thinking);
    log.scrollTop = log.scrollHeight;

    try {
      const resp = await IA.chat({ system, messages: chatHistory.slice(-10) });
      thinking.remove();
      chatHistory.push({ role: "assistant", content: resp });
      appendChatMessage("assistant", resp);
    } catch (e) {
      thinking.remove();
      appendChatMessage("assistant", `❌ Error: ${e.message}`);
    }
  }

  // ---------- Corrección de redacciones ----------
  function setupCorreccion() {
    $("#ia-corr-go").addEventListener("click", async () => {
      if (!IA.isConfigured()) return abrirAjustesIA();
      const texto = $("#ia-corr-text").value.trim();
      const matSel = $("#ia-corr-materia");
      if (!texto) return alert("Pega un texto a corregir.");
      const materiaNom = matSel.options[matSel.selectedIndex]?.text || "general";
      const out = $("#ia-corr-out");
      out.innerHTML = `<em>⏳ Corrigiendo…</em>`;
      try {
        const resp = await IA.chat({
          system: IA.SYSTEM_TUTOR,
          messages: [{ role: "user", content: IA.promptCorregirRedaccion(materiaNom, texto) }],
          temperature: 0.3,
        });
        out.innerHTML = miniMarkdown(resp);
      } catch (e) {
        out.innerHTML = `<span style="color:var(--danger)">❌ ${escapeHtml(e.message)}</span>`;
      }
    });

    const btnRub = $("#ia-corr-rub");
    if (btnRub) btnRub.addEventListener("click", async () => {
      if (!IA.isConfigured()) return abrirAjustesIA();
      const texto = $("#ia-corr-text").value.trim();
      const matSel = $("#ia-corr-materia");
      if (!texto) return alert("Pega un texto a corregir.");
      const materiaId = matSel.value;
      const promptRub = window.PAU_RUBRICA.promptCorreccion(materiaId, texto);
      if (!promptRub) {
        alert("No hay rúbrica PAU específica para esta materia. Usando corrección genérica.");
        $("#ia-corr-go").click();
        return;
      }
      const out = $("#ia-corr-out");
      out.innerHTML = `<em>⏳ Corrigiendo con rúbrica oficial…</em>`;
      try {
        const resp = await IA.chat({
          system: "Eres un examinador oficial PAU. Aplica la rúbrica con rigor y sé constructivo.",
          messages: [{ role: "user", content: promptRub }],
          temperature: 0.2,
        });
        out.innerHTML = miniMarkdown(resp);
      } catch (e) {
        out.innerHTML = `<span style="color:var(--danger)">❌ ${escapeHtml(e.message)}</span>`;
      }
    });
  }

  // ---------- Generador de tests ----------
  function setupGeneradorTests() {
    $("#ia-gen-go").addEventListener("click", async () => {
      if (!IA.isConfigured()) return abrirAjustesIA();
      const matSel = $("#ia-gen-materia");
      const materiaId = matSel.value;
      const materiaNom = matSel.options[matSel.selectedIndex]?.text || "general";
      const tema = $("#ia-gen-tema").value.trim();
      const n = parseInt($("#ia-gen-n").value, 10) || 5;
      if (!materiaId) return alert("Selecciona una materia.");
      if (!tema) return alert("Indica un tema.");

      const out = $("#ia-gen-out");
      out.innerHTML = `<em>⏳ Generando ${n} preguntas…</em>`;
      $("#ia-gen-save").classList.add("hidden");
      try {
        const resp = await IA.chat({
          system: "Eres un examinador PAU experto. Responde SOLO con JSON válido, sin texto extra.",
          messages: [{ role: "user", content: IA.promptGenerarTest(materiaNom, tema, n) }],
          temperature: 0.4,
        });
        const preguntas = parseJSONLoose(resp);
        if (!Array.isArray(preguntas) || !preguntas.length) throw new Error("No se pudo parsear el JSON.");

        const normalizadas = preguntas
          .filter((p) => p && p.pregunta && Array.isArray(p.opciones) && p.opciones.length === 4)
          .map((p) => ({
            q: p.pregunta,
            opts: p.opciones,
            correct: typeof p.correcta === "number" ? p.correcta : 0,
            expl: p.explicacion || "",
          }));

        if (!normalizadas.length) throw new Error("Las preguntas no tienen el formato esperado.");

        lastGenTest = { materiaId, preguntas: normalizadas };
        out.innerHTML = renderPreguntasPreview(normalizadas);
        $("#ia-gen-save").classList.remove("hidden");
      } catch (e) {
        out.innerHTML = `<span style="color:var(--danger)">❌ ${escapeHtml(e.message)}</span>${e.raw ? `<details><summary>Respuesta cruda</summary><pre>${escapeHtml(String(e.raw))}</pre></details>` : ""}`;
      }
    });

    $("#ia-gen-save").addEventListener("click", () => {
      if (!lastGenTest) return;
      const { materiaId, preguntas } = lastGenTest;
      if (!state.testsCustom[materiaId]) state.testsCustom[materiaId] = [];
      state.testsCustom[materiaId].push(...preguntas);
      save();
      mergeCustomTests();
      $("#ia-gen-save").classList.add("hidden");
      lastGenTest = null;
      alert(`✅ ${preguntas.length} preguntas añadidas a tu banco. Ve a la pestaña Tests.`);
      renderTests();
    });
  }

  function mergeCustomTests() {
    Object.entries(state.testsCustom || {}).forEach(([mid, lista]) => {
      if (!window.PAU_TESTS[mid]) {
        const m = getMateriasUsuario().find((x) => x.id === mid);
        window.PAU_TESTS[mid] = { nombre: m?.nombre || mid, preguntas: [] };
      }
      const existentes = new Set(window.PAU_TESTS[mid].preguntas.map((p) => p.q));
      lista.forEach((p) => {
        if (!existentes.has(p.q)) window.PAU_TESTS[mid].preguntas.push(p);
      });
    });
  }

  function renderPreguntasPreview(preguntas) {
    return `<div class="ia-preguntas-preview">
      ${preguntas.map((p, i) => `
        <div class="ia-pregunta">
          <strong>${i + 1}. ${escapeHtml(p.q)}</strong>
          <ol type="A">
            ${p.opts.map((o, j) => `<li class="${j === p.correct ? "ok" : ""}">${escapeHtml(o)}</li>`).join("")}
          </ol>
          ${p.expl ? `<p class="muted"><em>💡 ${escapeHtml(p.expl)}</em></p>` : ""}
        </div>
      `).join("")}
    </div>`;
  }

  function parseJSONLoose(s) {
    if (!s) throw Object.assign(new Error("Respuesta vacía"), { raw: s });
    const cleaned = s.replace(/```(?:json)?/gi, "").replace(/```/g, "").trim();
    try { return JSON.parse(cleaned); } catch { /* sigue */ }
    const m = cleaned.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
    if (!m) throw Object.assign(new Error("No se encontró JSON en la respuesta"), { raw: s });
    try { return JSON.parse(m[0]); }
    catch (e) { throw Object.assign(new Error("JSON inválido: " + e.message), { raw: s }); }
  }

  // ---------- Resumir ----------
  function setupResumen() {
    $("#ia-res-go").addEventListener("click", async () => {
      if (!IA.isConfigured()) return abrirAjustesIA();
      const matSel = $("#ia-res-materia");
      const materiaId = matSel.value;
      const materiaNom = matSel.options[matSel.selectedIndex]?.text || "general";
      const tema = $("#ia-res-tema").value.trim() || "Tema general";
      const texto = $("#ia-res-text").value.trim();
      if (!texto) return alert("Pega el material a resumir.");

      const out = $("#ia-res-out");
      out.innerHTML = `<em>⏳ Resumiendo…</em>`;
      $("#ia-res-save").classList.add("hidden");
      try {
        const resp = await IA.chat({
          system: IA.SYSTEM_TUTOR,
          messages: [{ role: "user", content: IA.promptResumir(materiaNom, tema, texto) }],
          temperature: 0.4,
        });
        lastResumen = { materiaId, md: `\n\n## ${tema}\n${resp}\n` };
        out.innerHTML = miniMarkdown(resp);
        if (materiaId) $("#ia-res-save").classList.remove("hidden");
      } catch (e) {
        out.innerHTML = `<span style="color:var(--danger)">❌ ${escapeHtml(e.message)}</span>`;
      }
    });

    $("#ia-res-save").addEventListener("click", () => {
      if (!lastResumen || !lastResumen.materiaId) return;
      const { materiaId, md } = lastResumen;
      state.apuntes[materiaId] = (state.apuntes[materiaId] || "") + md;
      save();
      $("#ia-res-save").classList.add("hidden");
      lastResumen = null;
      alert("✅ Añadido a tus apuntes.");
      renderApuntes();
    });
  }

  // ---------- Explicar simple ----------
  function setupExplicarSimple() {
    $("#ia-simple-go").addEventListener("click", async () => {
      if (!IA.isConfigured()) return abrirAjustesIA();
      const texto = $("#ia-simple-text").value.trim();
      if (!texto) return;
      const out = $("#ia-simple-out");
      out.innerHTML = `<em>⏳ Reformulando…</em>`;
      try {
        const resp = await IA.chat({
          system: IA.SYSTEM_TUTOR,
          messages: [{ role: "user", content: IA.promptExplicarSimple(texto) }],
          temperature: 0.6,
        });
        out.innerHTML = miniMarkdown(resp);
      } catch (e) {
        out.innerHTML = `<span style="color:var(--danger)">❌ ${escapeHtml(e.message)}</span>`;
      }
    });
  }

  // ---------------------- MODAL ------------------------------
  function openModal(html) {
    $("#modal-body").innerHTML = html;
    $("#modal").classList.remove("hidden");
  }
  function closeModal() {
    $("#modal").classList.add("hidden");
  }
  function setupModal() {
    $("#modal-close").addEventListener("click", closeModal);
    $("#modal").addEventListener("click", (e) => {
      if (e.target.id === "modal") closeModal();
    });
  }

  // ---------------------- EXPORT / RESET ---------------------
  function setupTopbar() {
    $("#btn-export").addEventListener("click", abrirModalSync);
    $("#btn-reset").addEventListener("click", () => {
      if (!confirm("¿Borrar todos los datos y volver a empezar?")) return;
      localStorage.removeItem(STORAGE_KEY);
      location.reload();
    });
    const btnIA = $("#btn-ia-config");
    if (btnIA) btnIA.addEventListener("click", abrirAjustesIA);
  }

  function abrirModalSync() {
    const code = window.PAU_SYNC.encode(state);
    const tooLong = code.length > 2000;
    const qrUrl = tooLong ? null : window.PAU_SYNC.qrUrl(code);
    openModal(`
      <h3>⬇️ Exportar / Sincronizar</h3>
      <div class="row" style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:12px">
        <button id="exp-json" class="btn-primary">📥 Descargar JSON</button>
        <button id="exp-copy" class="btn-secondary">📋 Copiar código</button>
      </div>

      <details open>
        <summary>📱 Sincronizar con otro dispositivo (QR)</summary>
        <p class="muted" style="font-size:0.85rem">Escanea este QR con tu otro móvil/tablet (o pega el código abajo) para clonar tus datos.</p>
        ${qrUrl ? `<div style="text-align:center"><img src="${qrUrl}" alt="QR" style="max-width:280px; width:100%; border-radius:8px; border:1px solid var(--border)" /></div>`
                : `<p class="muted">⚠️ Tus datos son demasiado grandes para caber en un QR (${code.length} chars). Usa "Copiar código" o "Descargar JSON".</p>`}
        <textarea id="exp-code" readonly rows="4" style="width:100%; font-family:monospace; font-size:0.75rem; margin-top:8px">${code}</textarea>
      </details>

      <details>
        <summary>📤 Importar datos desde otro dispositivo</summary>
        <p class="muted" style="font-size:0.85rem">Pega aquí el código exportado de otro dispositivo o sube un archivo JSON.</p>
        <textarea id="imp-code" rows="4" placeholder="Pega el código aquí…" style="width:100%; font-family:monospace; font-size:0.75rem"></textarea>
        <input id="imp-file" type="file" accept=".json,application/json" style="margin-top:6px" />
        <div class="row" style="margin-top:8px">
          <button id="imp-apply" class="btn-primary">↩️ Restaurar datos</button>
        </div>
        <p id="imp-status" class="muted" style="margin-top:6px"></p>
      </details>
    `);

    $("#exp-json").addEventListener("click", () => {
      const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `pau-murcia-backup-${todayISO()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    });

    $("#exp-copy").addEventListener("click", () => {
      navigator.clipboard.writeText(code).then(() => {
        $("#exp-copy").textContent = "✅ Copiado";
        setTimeout(() => { $("#exp-copy").textContent = "📋 Copiar código"; }, 2000);
      });
    });

    $("#imp-file").addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const txt = await file.text();
      $("#imp-code").value = txt.startsWith("{") ? window.PAU_SYNC.encode(JSON.parse(txt)) : txt;
    });

    $("#imp-apply").addEventListener("click", () => {
      const codigo = $("#imp-code").value.trim();
      if (!codigo) { $("#imp-status").textContent = "⚠️ Pega un código o sube un archivo."; return; }
      let nuevoEstado;
      // Probar si es JSON directo
      try {
        nuevoEstado = JSON.parse(codigo);
      } catch {
        nuevoEstado = window.PAU_SYNC.decode(codigo);
      }
      if (!nuevoEstado || !nuevoEstado.perfil) {
        $("#imp-status").innerHTML = `<span style="color:var(--danger)">❌ Código inválido.</span>`;
        return;
      }
      if (!confirm("¿Sustituir TODOS tus datos actuales por los importados?")) return;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nuevoEstado));
      location.reload();
    });
  }

  // ---------------------- INIT -------------------------------
  function renderApp() {
    renderDashboard();
    renderMaterias();
    renderPlanner();
    renderPomodoro();
    renderExamenes();
    renderFlashcardsDecks();
    renderTests();
    renderApuntes();
    renderAnalisis();
    renderLogros();
    renderRecursos();
    comprobarLogros();
  }

  // =====================================================================
  //  FASE 5 — Simulacro, foco, notificaciones, gráficas, repaso
  // =====================================================================

  // ---- SIMULACRO ----
  function setupSimulacro() {
    const sel = $("#simu-materia");
    if (!sel) return;
    const mats = getMateriasUsuario();
    sel.innerHTML = mats.map((m) => `<option value="${m.id}">${m.nombre}</option>`).join("");

    const btnStart = $("#simu-start");
    const btnFinish = $("#simu-finish");
    const btnCancel = $("#simu-cancel");
    const btnSave = $("#simu-save");

    let elapsedFinal = 0;
    let materiaActual = null;

    btnStart.addEventListener("click", () => {
      const dur = parseInt($("#simu-duracion").value, 10);
      if (!dur || dur < 5) { alert("Duración inválida."); return; }
      materiaActual = sel.value;
      $("#simu-config").classList.add("hidden");
      $("#simu-running").classList.remove("hidden");
      $("#simu-result").classList.add("hidden");
      $("#simu-info").textContent = `Materia: ${sel.options[sel.selectedIndex].text} · ${dur} min`;
      window.PAU_FOCO.activar();

      window.PAU_SIMULACRO.empezar(dur,
        (restante) => {
          $("#simu-time").textContent = window.PAU_SIMULACRO.formatTime(restante);
          const pct = 100 - (restante / (dur * 60000)) * 100;
          $("#simu-bar").style.width = pct.toFixed(1) + "%";
          if (restante < 60000) $("#simu-time").classList.add("alerta");
        },
        () => {
          alert("⏰ ¡Tiempo agotado!");
          finalizarSimu();
        }
      );
    });

    function finalizarSimu() {
      elapsedFinal = window.PAU_SIMULACRO.parar();
      $("#simu-time").classList.remove("alerta");
      window.PAU_FOCO.desactivar();
      $("#simu-running").classList.add("hidden");
      $("#simu-result").classList.remove("hidden");
      $("#simu-elapsed").textContent = window.PAU_SIMULACRO.formatTime(elapsedFinal);
    }

    btnFinish.addEventListener("click", finalizarSimu);
    btnCancel.addEventListener("click", () => {
      if (!confirm("¿Cancelar el simulacro?")) return;
      window.PAU_SIMULACRO.parar();
      window.PAU_FOCO.desactivar();
      $("#simu-running").classList.add("hidden");
      $("#simu-config").classList.remove("hidden");
    });

    btnSave.addEventListener("click", () => {
      const nota = parseFloat($("#simu-nota").value);
      const coment = $("#simu-coment").value;
      if (isNaN(nota)) { alert("Introduce una nota válida."); return; }
      state.simulacros.push({
        fecha: todayISO(),
        materiaId: materiaActual,
        año: $("#simu-anio").value || null,
        nota,
        minutos: Math.round(elapsedFinal / 60000),
        comentarios: coment,
        notas: $("#simu-notas").value,
      });
      save();
      $("#simu-result").classList.add("hidden");
      $("#simu-config").classList.remove("hidden");
      $("#simu-nota").value = ""; $("#simu-coment").value = ""; $("#simu-notas").value = "";
      renderSimuHistory();
      comprobarLogros();
    });

    renderSimuHistory();
  }

  function renderSimuHistory() {
    const cont = $("#simu-history");
    if (!cont) return;
    const list = (state.simulacros || []).slice().reverse();
    if (!list.length) {
      cont.innerHTML = `<p class="muted">Aún no has hecho ningún simulacro.</p>`;
    } else {
      cont.innerHTML = `
        <table style="width:100%; font-size:0.9rem;">
          <thead><tr><th>Fecha</th><th>Materia</th><th>Min</th><th>Nota</th></tr></thead>
          <tbody>${list.map((s) => {
            const m = getMateriasUsuario().find((x) => x.id === s.materiaId);
            const cls = s.nota >= 7 ? "good" : s.nota >= 5 ? "mid" : "bad";
            return `<tr><td>${s.fecha}</td><td>${m?.nombre || s.materiaId}</td><td>${s.minutos}</td><td class="${cls}">${s.nota.toFixed(1)}</td></tr>`;
          }).join("")}</tbody>
        </table>`;
    }
    // Gráfica
    const canvas = $("#simu-chart");
    if (canvas && window.PAU_CHART) {
      const points = (state.simulacros || []).map((s, i) => ({
        y: s.nota,
        label: s.fecha.slice(5),
      }));
      window.PAU_CHART.line(canvas, points, { min: 0, max: 10 });
    }
  }

  // ---- MODO CONCENTRACIÓN ----
  function setupFoco() {
    const btn = $("#btn-foco");
    if (!btn) return;
    btn.addEventListener("click", () => window.PAU_FOCO.toggle());
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && window.PAU_FOCO.activo) window.PAU_FOCO.desactivar();
    });
  }

  // ---- NOTIFICACIONES ----
  function setupNotificaciones() {
    const btn = $("#btn-notif");
    if (!btn) return;
    btn.addEventListener("click", async () => {
      if (!window.PAU_NOTIF.isSupported()) {
        alert("Tu navegador no soporta notificaciones.");
        return;
      }
      const perm = await window.PAU_NOTIF.pedir();
      if (perm === "granted") {
        state.notificacionesActivas = true;
        save();
        window.PAU_NOTIF.enviar("✅ Notificaciones activadas", "Te avisaré para tus sesiones de estudio.");
        // Recordatorio diario a las 17:00
        window.PAU_NOTIF.diario(17, 0, "📚 Hora de estudiar", "Tu sesión PAU del día te espera.");
      } else {
        alert("Permiso denegado. Ve a la configuración del navegador para activarlo.");
      }
    });
    // Si ya estaban activas y el navegador lo permite, programar diaria
    if (state.notificacionesActivas && window.PAU_NOTIF.permission() === "granted") {
      window.PAU_NOTIF.diario(17, 0, "📚 Hora de estudiar", "Tu sesión PAU del día te espera.");
    }
  }

  // ---- REPASO INTELIGENTE (en dashboard) ----
  function renderRepasoInteligente() {
    let cont = $("#repaso-inteligente");
    if (!cont) {
      const dash = $("#tab-dashboard");
      if (!dash) return;
      cont = document.createElement("div");
      cont.id = "repaso-inteligente";
      cont.className = "card";
      cont.innerHTML = `<h3>🧠 Repaso inteligente para hoy</h3><div id="repaso-list"></div>`;
      // Insertar tras el calendario
      const cal = $("#calendario-pau");
      if (cal && cal.parentNode) cal.parentNode.insertBefore(cont, cal.nextSibling);
      else dash.appendChild(cont);
    }
    const list = $("#repaso-list");
    const sugs = window.PAU_REPASO.sugerirHoy(state, getMateriasUsuario());
    if (!sugs.length) {
      list.innerHTML = `<p class="muted">¡Estás al día! 🎉 No hay urgencias.</p>`;
      return;
    }
    list.innerHTML = sugs.map((s) => {
      const icon = s.tipo === "flashcards" ? "🃏" : s.tipo === "test" ? "📝" : "⏳";
      const tabDest = s.tipo === "flashcards" ? "flashcards" : s.tipo === "test" ? "tests" : "materias";
      return `
        <div class="repaso-item prio-${s.prioridad}">
          <span class="repaso-icon">${icon}</span>
          <div class="repaso-info">
            <strong>${s.materiaNombre}</strong>
            <div class="muted">${s.mensaje}</div>
          </div>
          <button class="btn-secondary" data-go="${tabDest}">Ir →</button>
        </div>`;
    }).join("");
    list.querySelectorAll("[data-go]").forEach((b) => {
      b.addEventListener("click", () => {
        const tab = b.dataset.go;
        const btnTab = document.querySelector(`.tab[data-tab="${tab}"]`);
        if (btnTab) btnTab.click();
      });
    });
  }

  let appBooted = false;
  function bootApp() {
    if (appBooted) {
      renderApp();
      return;
    }
    appBooted = true;
    setupTabs();
    setupModal();
    setupTopbar();
    setupPomodoroControls();
    setupCalculadora();
    setupFlashcards();
    setupTests();
    setupGradoObjetivo();
    setupPlannerActions();
    setupTutor();
    setupSimulacro();
    setupFoco();
    setupNotificaciones();
    setupImportadorExamenes();
    renderRepasoInteligente();
    renderApp();
  }

  function init() {
    // Modo tests unitarios: ?tests=1
    if (location.search.includes("tests=1") && window.PAU_TESTS_UNIT) {
      ejecutarTestsUnit();
      return;
    }
    if (!state.perfil) {
      $("#onboarding").classList.remove("hidden");
      renderOnboarding();
    } else {
      $("#app").classList.remove("hidden");
      bootApp();
    }
  }

  async function ejecutarTestsUnit() {
    document.body.innerHTML = `<div style="padding:24px; font-family:sans-serif;">
      <h1>🧪 Tests unitarios</h1>
      <p>Ejecutando…</p>
      <ul id="tests-out"></ul>
      <a href="./index.html">← Volver a la app</a>
    </div>`;
    const ul = document.getElementById("tests-out");
    const resultados = await window.PAU_TESTS_UNIT.ejecutar();
    ul.innerHTML = resultados.map((r) =>
      `<li style="color:${r.ok ? "green" : "red"}">${r.ok ? "✅" : "❌"} ${r.nombre}${r.error ? ` — <code>${r.error}</code>` : ""}</li>`
    ).join("");
    const ok = resultados.filter((r) => r.ok).length;
    ul.insertAdjacentHTML("afterend", `<p><strong>${ok} / ${resultados.length}</strong> tests pasados.</p>`);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
