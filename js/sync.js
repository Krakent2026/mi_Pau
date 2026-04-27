/* =============================================================
 * sync.js — Sincronización bidireccional state ↔ Supabase
 * =============================================================
 * - Al login: descarga estado nube, fusiona con local (last-write-wins
 *   por timestamp), guarda en localStorage y sube versión fusionada.
 * - Subscribe a cambios remotos vía Realtime: si otro dispositivo
 *   actualiza, refresca state local.
 * - Save() debounced sube cambios cada 5 s tras la última edición.
 *
 * Expone: window.PAU_SYNC_CLOUD = { iniciar, parar, forzarSubida, forzarBajada, estado }
 * Depende de: window.PAU_AUTH, window.state, window.save, window.load
 * ============================================================= */
(function () {
  "use strict";

  if (!window.PAU_AUTH || !window.PAU_AUTH.configurado) {
    window.PAU_SYNC_CLOUD = { iniciar(){}, parar(){}, forzarSubida: async()=>{}, forzarBajada: async()=>{}, estado:{activo:false} };
    return;
  }

  const sb = window.PAU_AUTH.client;
  const STATE_KEY = "pauMurcia2026";
  const DEVICE_ID = (function () {
    let d = localStorage.getItem("pau-device-id");
    if (!d) { d = crypto.randomUUID(); localStorage.setItem("pau-device-id", d); }
    return d;
  })();

  const estado = {
    activo: false,
    sincronizando: false,
    ultimaSubida: null,
    ultimaBajada: null,
    error: null,
    pendiente: false,
  };

  let canal = null;
  let timerSubida = null;
  let pollTimer = null;

  function leerLocal() {
    try {
      const raw = localStorage.getItem(STATE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch { return null; }
  }

  // recargarUI=true: re-renderiza la app (para escrituras desde la nube)
  // recargarUI=false: solo guarda en localStorage (para escrituras locales)
  function escribirLocal(data, recargarUI) {
    try {
      localStorage.setItem(STATE_KEY, JSON.stringify(data));
      if (recargarUI && typeof window.load === "function") window.load();
    } catch (e) { console.warn("[SYNC] escribir local:", e); }
  }

  async function obtenerRemoto() {
    const u = window.PAU_AUTH.user;
    if (!u) return null;
    const { data, error } = await sb.from("estados").select("*").eq("user_id", u.id).maybeSingle();
    if (error) { console.warn("[SYNC] get remoto:", error); return null; }
    return data;
  }

  // Fusión simple: el más reciente gana globalmente.
  // Para un merge campo-a-campo más fino, ampliar aquí (logros: union; tests: append por id).
  function fusionar(local, remoto) {
    if (!local) return remoto?.data || {};
    if (!remoto) return local;
    const tLocal = local.lastModified || 0;
    const tRemoto = new Date(remoto.updated_at).getTime();
    return tRemoto > tLocal ? remoto.data : local;
  }

  async function subirEstado() {
    if (!window.PAU_AUTH.user || estado.sincronizando) { estado.pendiente = true; return; }
    estado.sincronizando = true;
    try {
      const data = leerLocal();
      if (!data) { estado.sincronizando = false; return; }
      data.lastModified = Date.now();
      // No re-cargamos UI: el cambio viene del propio dispositivo
      escribirLocal(data, false);

      const { error } = await sb.from("estados").upsert({
        user_id: window.PAU_AUTH.user.id,
        schema_version: data.schemaVersion || 2,
        data,
        device_id: DEVICE_ID,
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id" });
      if (error) throw error;
      estado.ultimaSubida = new Date();
      estado.error = null;
    } catch (e) {
      console.warn("[SYNC] subir:", e);
      estado.error = e.message;
    } finally {
      estado.sincronizando = false;
      if (estado.pendiente) { estado.pendiente = false; agendarSubida(); }
      emitirEvento();
    }
  }

  function agendarSubida(ms = 2000) {
    clearTimeout(timerSubida);
    timerSubida = setTimeout(subirEstado, ms);
  }

  async function bajarEstado() {
    if (!window.PAU_AUTH.user) return;
    const remoto = await obtenerRemoto();
    if (!remoto) { await subirEstado(); return; }
    const local = leerLocal();
    const fusionado = fusionar(local, remoto);
    fusionado.lastModified = Date.now();
    // Re-cargar UI porque el cambio viene de la nube
    escribirLocal(fusionado, true);
    estado.ultimaBajada = new Date();
    emitirEvento();
  }

  function suscribirseTiempoReal() {
    if (canal) sb.removeChannel(canal);
    if (!window.PAU_AUTH.user) return;
    const onPayload = (payload) => {
      // Ignorar nuestros propios cambios
      if (payload.new?.device_id === DEVICE_ID) return;
      if (!payload.new?.data) return;
      const local = leerLocal();
      const fusionado = fusionar(local, { data: payload.new.data, updated_at: payload.new.updated_at });
      // Re-cargar UI porque viene de otro dispositivo
      escribirLocal(fusionado, true);
      estado.ultimaBajada = new Date();
      emitirEvento();
    };
    canal = sb.channel("estado-" + window.PAU_AUTH.user.id)
      .on("postgres_changes", {
        event: "*",  // INSERT, UPDATE, DELETE
        schema: "public",
        table: "estados",
        filter: "user_id=eq." + window.PAU_AUTH.user.id,
      }, onPayload)
      .subscribe((status) => {
        console.log("[SYNC] Realtime status:", status);
      });

    // Polling de respaldo cada 30s por si Realtime falla
    clearInterval(pollTimer);
    pollTimer = setInterval(async () => {
      if (!window.PAU_AUTH.user || estado.sincronizando) return;
      try {
        const remoto = await obtenerRemoto();
        if (!remoto) return;
        const local = leerLocal();
        const tLocal = local?.lastModified || 0;
        const tRemoto = new Date(remoto.updated_at).getTime();
        if (tRemoto > tLocal && remoto.device_id !== DEVICE_ID) {
          const fusionado = fusionar(local, remoto);
          escribirLocal(fusionado, true);
          estado.ultimaBajada = new Date();
          emitirEvento();
        }
      } catch (e) { /* silencioso */ }
    }, 30000);
  }

  function emitirEvento() {
    window.dispatchEvent(new CustomEvent("pau-sync", { detail: { ...estado } }));
  }

  // Hook al setItem de localStorage del state principal
  function instrumentarSave() {
    const orig = window.save;
    window.save = function () {
      const r = typeof orig === "function" ? orig.apply(this, arguments) : null;
      if (estado.activo) agendarSubida();
      return r;
    };
  }

  async function iniciar() {
    if (estado.activo) return;
    estado.activo = true;
    instrumentarSave();
    await bajarEstado();
    suscribirseTiempoReal();
    emitirEvento();
  }

  function parar() {
    estado.activo = false;
    if (canal) sb.removeChannel(canal);
    canal = null;
    clearTimeout(timerSubida);
    clearInterval(pollTimer);
    emitirEvento();
  }

  // Auto-iniciar/parar según auth
  window.PAU_AUTH.onChange(s => {
    if (s.user && !estado.activo) iniciar();
    if (!s.user && estado.activo) parar();
  });

  window.PAU_SYNC_CLOUD = {
    iniciar, parar,
    forzarSubida: subirEstado,
    forzarBajada: bajarEstado,
    notificarCambio: () => agendarSubida(),
    estado,
  };
})();
