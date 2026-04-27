/* =============================================================
 * admin.js — Panel de administrador in-app
 * =============================================================
 * Requiere: js/auth.js (PAU_AUTH) y supabase_admin.sql ejecutado.
 * Si el usuario tiene profiles.rol='admin' aparece la pestaña 👑 Admin.
 * Además, todos los usuarios autenticados se anuncian en el canal
 * de presencia "pau-online" para que el admin vea quién está conectado.
 * ============================================================= */
(function () {
  "use strict";

  let booted = false;
  let panelInyectado = false;
  let usuariosCache = [];
  let presenceChannel = null;
  let onlineSet = new Set();
  let presenceTracking = false;
  let adminConfirmado = false;

  function esAdminCache() {
    const p = window.PAU_AUTH && window.PAU_AUTH.profile;
    return !!(p && p.rol === "admin");
  }

  // Comprueba contra el servidor (RPC is_admin) — más fiable que el perfil cacheado
  async function comprobarAdminServidor() {
    if (!window.PAU_AUTH || !window.PAU_AUTH.client || !window.PAU_AUTH.user) return false;
    try {
      const { data, error } = await window.PAU_AUTH.client.rpc("is_admin");
      if (error) {
        console.warn("[admin] is_admin RPC:", error.message);
        return false;
      }
      return !!data;
    } catch (e) {
      console.warn("[admin] is_admin error:", e);
      return false;
    }
  }

  function escape(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    }[c]));
  }

  function fmtFecha(s) {
    if (!s) return "—";
    const d = new Date(s);
    if (isNaN(d)) return "—";
    return d.toLocaleString("es-ES", { dateStyle: "short", timeStyle: "short" });
  }

  function fmtHoras(min) {
    min = Number(min) || 0;
    if (!min) return "0h";
    const h = Math.floor(min / 60);
    const m = min % 60;
    return h ? `${h}h ${m}m` : `${m}m`;
  }

  // -----------------------------------------------------------
  // Presencia: todos los usuarios autenticados se anuncian
  // -----------------------------------------------------------
  function iniciarPresencia() {
    if (presenceTracking) return;
    if (!window.PAU_AUTH || !window.PAU_AUTH.client || !window.PAU_AUTH.user) return;
    presenceTracking = true;
    try {
      const c = window.PAU_AUTH.client;
      const userId = window.PAU_AUTH.user.id;
      presenceChannel = c.channel("pau-online", {
        config: { presence: { key: userId } },
      });
      presenceChannel
        .on("presence", { event: "sync" }, () => {
          const st = presenceChannel.presenceState();
          onlineSet = new Set(Object.keys(st));
          if (panelInyectado) {
            const k = document.getElementById("adm-online");
            if (k) k.textContent = onlineSet.size;
            renderTabla();
          }
        })
        .subscribe(async (status) => {
          if (status === "SUBSCRIBED") {
            const meta = {
              online_at: new Date().toISOString(),
              nombre: (window.PAU_AUTH.profile && window.PAU_AUTH.profile.nombre) || "",
            };
            try { await presenceChannel.track(meta); } catch (_) {}
          }
        });
    } catch (e) {
      console.warn("[admin] presencia no disponible:", e);
      presenceTracking = false;
    }
  }

  // -----------------------------------------------------------
  // UI: solo para admins
  // -----------------------------------------------------------
  function init() {
    if (booted) return;
    if (!window.PAU_AUTH || !window.PAU_AUTH.client) return;
    if (!adminConfirmado && !esAdminCache()) return;
    booted = true;
    inyectarUI();
    cargar();
  }

  function inyectarUI() {
    if (panelInyectado) return;
    const tabs = document.querySelector(".tabs");
    const main = document.querySelector("main");
    if (!tabs || !main) return;

    const btn = document.createElement("button");
    btn.className = "tab";
    btn.dataset.tab = "admin";
    btn.textContent = "👑 Admin";
    tabs.appendChild(btn);

    const sec = document.createElement("section");
    sec.id = "tab-admin";
    sec.className = "tab-panel";
    sec.innerHTML = `
      <div class="card">
        <h2 style="margin-top:0">👑 Panel de administrador</h2>
        <div class="admin-stats">
          <div class="admin-kpi"><span id="adm-total">--</span><small>Usuarios</small></div>
          <div class="admin-kpi"><span id="adm-online">0</span><small>En línea ahora</small></div>
          <div class="admin-kpi"><span id="adm-7d">--</span><small>Activos (7 días)</small></div>
          <div class="admin-kpi"><span id="adm-horas">--</span><small>Horas totales</small></div>
        </div>
        <div class="admin-toolbar">
          <input id="adm-buscar" type="search" placeholder="Buscar por nombre o email…" />
          <select id="adm-orden">
            <option value="ultimo_login">Orden: último acceso</option>
            <option value="alta">Orden: fecha de alta</option>
            <option value="minutos_totales">Orden: horas estudiadas</option>
            <option value="num_sesiones">Orden: nº de sesiones</option>
            <option value="nombre">Orden: nombre</option>
          </select>
          <button id="adm-recargar" class="btn-secondary">🔄 Recargar</button>
        </div>
        <div id="adm-tabla-cont"><p class="muted">Cargando…</p></div>
        <p class="muted" style="margin-top:12px;font-size:.85em">
          🔒 Borrar a un usuario es definitivo y elimina todos sus datos. No se puede deshacer.
        </p>
      </div>`;
    main.appendChild(sec);

    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
      document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("active"));
      btn.classList.add("active");
      sec.classList.add("active");
      cargar();
    });

    document.getElementById("adm-recargar").addEventListener("click", cargar);
    document.getElementById("adm-buscar").addEventListener("input", renderTabla);
    document.getElementById("adm-orden").addEventListener("change", renderTabla);
    panelInyectado = true;
  }

  async function cargar() {
    const cont = document.getElementById("adm-tabla-cont");
    if (cont) cont.innerHTML = '<p class="muted">Cargando…</p>';
    try {
      const { data, error } = await window.PAU_AUTH.client.rpc("admin_listar_usuarios");
      if (error) throw error;
      usuariosCache = data || [];
      pintarKPIs();
      renderTabla();
    } catch (e) {
      const msg = (e && e.message) || String(e);
      if (cont) {
        cont.innerHTML = `<p style="color:var(--danger,#c00)">⚠️ Error: ${escape(msg)}</p>
          <p class="muted">¿Has ejecutado supabase_admin.sql en Supabase?</p>`;
      }
    }
  }

  function pintarKPIs() {
    const total = usuariosCache.length;
    const ahora = Date.now();
    const sieteDias = ahora - 7 * 24 * 3600 * 1000;
    const activos7 = usuariosCache.filter(
      (u) => u.ultimo_login && new Date(u.ultimo_login).getTime() > sieteDias
    ).length;
    const minTot = usuariosCache.reduce((a, u) => a + (u.minutos_totales || 0), 0);
    const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    set("adm-total", total);
    set("adm-7d", activos7);
    set("adm-horas", (minTot / 60).toFixed(1));
    set("adm-online", onlineSet.size);
  }

  function renderTabla() {
    const cont = document.getElementById("adm-tabla-cont");
    if (!cont) return;
    const inputBuscar = document.getElementById("adm-buscar");
    const inputOrden = document.getElementById("adm-orden");
    const q = ((inputBuscar && inputBuscar.value) || "").trim().toLowerCase();
    const orden = (inputOrden && inputOrden.value) || "ultimo_login";

    let lista = usuariosCache.slice();
    if (q) {
      lista = lista.filter(
        (u) =>
          (u.nombre || "").toLowerCase().includes(q) ||
          (u.email || "").toLowerCase().includes(q)
      );
    }
    lista.sort((a, b) => {
      if (orden === "nombre") return (a.nombre || "").localeCompare(b.nombre || "");
      const va = a[orden]; const vb = b[orden];
      if (va == null && vb == null) return 0;
      if (va == null) return 1;
      if (vb == null) return -1;
      if (typeof va === "number") return vb - va;
      return new Date(vb) - new Date(va);
    });

    if (!lista.length) {
      cont.innerHTML = '<p class="muted">No hay usuarios.</p>';
      return;
    }

    const yoId = window.PAU_AUTH.user && window.PAU_AUTH.user.id;
    cont.innerHTML = `
      <div class="admin-tabla-scroll">
      <table class="admin-tabla">
        <thead><tr>
          <th></th><th>Nombre</th><th>Email</th><th>Curso</th><th>Plan</th>
          <th>Alta</th><th>Último login</th><th>Última sync</th>
          <th>Sesiones</th><th>Horas</th><th>Rol</th><th></th>
        </tr></thead>
        <tbody>
          ${lista.map((u) => {
            const online = onlineSet.has(u.id);
            const yo = u.id === yoId;
            const sinConfirmar = u.email_confirmado === false;
            return `
            <tr data-id="${u.id}">
              <td><span class="dot ${online ? "on" : "off"}" title="${online ? "En línea" : "Desconectado"}"></span></td>
              <td>${escape(u.nombre || "—")}${yo ? ' <small class="muted">(tú)</small>' : ""}</td>
              <td>${escape(u.email || "—")}${sinConfirmar ? ' <small style="color:var(--accent,#f59e0b)">⚠ sin confirmar</small>' : ""}</td>
              <td>${escape(u.curso || "—")}</td>
              <td>${escape(u.plan || "—")}</td>
              <td>${fmtFecha(u.alta)}</td>
              <td>${fmtFecha(u.ultimo_login)}</td>
              <td>${fmtFecha(u.ultima_sync)}</td>
              <td style="text-align:right">${u.num_sesiones || 0}</td>
              <td style="text-align:right">${fmtHoras(u.minutos_totales || 0)}</td>
              <td>
                <select class="adm-rol" data-id="${u.id}" ${yo ? "disabled" : ""}>
                  ${["estudiante", "admin", "tutor", "padre"].map(
                    (r) => `<option value="${r}" ${u.rol === r ? "selected" : ""}>${r}</option>`
                  ).join("")}
                </select>
              </td>
              <td>${yo ? "" : `<button class="btn-ghost adm-borrar" data-id="${u.id}" data-email="${escape(u.email || "")}" title="Borrar usuario">🗑️</button>`}</td>
            </tr>`;
          }).join("")}
        </tbody>
      </table></div>`;

    cont.querySelectorAll(".adm-borrar").forEach((b) => {
      b.addEventListener("click", () => borrar(b.dataset.id, b.dataset.email));
    });
    cont.querySelectorAll(".adm-rol").forEach((s) => {
      s.addEventListener("change", () => cambiarRol(s.dataset.id, s.value, s));
    });
  }

  async function borrar(id, email) {
    const ok = confirm(
      `¿Borrar definitivamente al usuario "${email}"?\n\n` +
      `Se eliminará su cuenta, perfil, sesiones y datos.\n` +
      `Esto NO se puede deshacer.`
    );
    if (!ok) return;
    const ok2 = prompt('Escribe BORRAR (en mayúsculas) para confirmar:');
    if (ok2 !== "BORRAR") return;
    try {
      const { error } = await window.PAU_AUTH.client.rpc("admin_delete_user", { target: id });
      if (error) throw error;
      usuariosCache = usuariosCache.filter((u) => u.id !== id);
      pintarKPIs();
      renderTabla();
    } catch (e) {
      alert("Error al borrar: " + (e.message || e));
    }
  }

  async function cambiarRol(id, nuevo, sel) {
    const previo = sel.dataset.previo || "";
    try {
      const { error } = await window.PAU_AUTH.client.rpc("admin_set_role", {
        target: id, nuevo_rol: nuevo,
      });
      if (error) throw error;
      const u = usuariosCache.find((x) => x.id === id);
      if (u) u.rol = nuevo;
      sel.dataset.previo = nuevo;
    } catch (e) {
      alert("Error al cambiar rol: " + (e.message || e));
      if (previo) sel.value = previo;
    }
  }

  // -----------------------------------------------------------
  // Arranque
  // -----------------------------------------------------------
  async function intentar() {
    if (!window.PAU_AUTH) return;
    if (window.PAU_AUTH.user) iniciarPresencia();
    // Comprobar siempre contra el servidor para evitar perfiles cacheados desactualizados
    if (window.PAU_AUTH.user && !booted) {
      const ok = await comprobarAdminServidor();
      if (ok) {
        adminConfirmado = true;
        init();
      }
    }
  }

  function arrancar() {
    if (!window.PAU_AUTH) return;
    intentar();
    if (typeof window.PAU_AUTH.onChange === "function") {
      window.PAU_AUTH.onChange(() => intentar());
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", arrancar);
  } else {
    arrancar();
  }

  window.PAU_ADMIN = {
    init,
    recargar: () => { init(); cargar(); },
    esAdmin: esAdminCache,
    comprobarAdmin: comprobarAdminServidor,
  };
})();
