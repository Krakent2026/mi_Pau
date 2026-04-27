/* =============================================================
 * auth.js — Autenticación con Supabase
 * =============================================================
 * Expone: window.PAU_AUTH = {
 *   client, user, profile,
 *   init(), onChange(cb),
 *   registrar(email, password, nombre),
 *   loginEmail(email, password),
 *   loginMagicLink(email),
 *   loginGoogle(),
 *   logout(),
 *   recuperar(email),
 *   actualizarPerfil(parches),
 *   eliminarCuenta()
 * }
 * Requiere: <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
 * ============================================================= */
(function () {
  "use strict";

  const cfg = window.PAU_CONFIG || {};
  if (!cfg.SUPABASE_URL || cfg.SUPABASE_URL.startsWith("https://YOUR_")) {
    console.warn("[PAU_AUTH] Supabase no configurado — modo local activo");
    window.PAU_AUTH = { configurado: false, init: () => Promise.resolve(false) };
    return;
  }

  if (!window.supabase) {
    console.error("[PAU_AUTH] supabase-js no cargado. Añade el <script> antes de auth.js");
    window.PAU_AUTH = { configurado: false, init: () => Promise.resolve(false) };
    return;
  }

  const client = window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: "pau-auth",
    },
  });

  const listeners = new Set();
  const state = { user: null, profile: null, ready: false };

  async function cargarPerfil(userId) {
    if (!userId) return null;
    const { data, error } = await client
      .from("profiles").select("*").eq("id", userId).maybeSingle();
    if (error) console.warn("[PAU_AUTH] perfil:", error.message);
    return data || null;
  }

  function notify() { listeners.forEach(cb => { try { cb(state); } catch(_){} }); }

  async function init() {
    try {
      const { data } = await client.auth.getSession();
      state.user = data.session?.user || null;
      state.profile = state.user ? await cargarPerfil(state.user.id) : null;
    } catch (e) {
      console.warn("[PAU_AUTH] Error al inicializar sesión:", e.message || e);
      state.user = null;
      state.profile = null;
    }
    state.ready = true;
    notify();

    try {
      client.auth.onAuthStateChange(async (event, session) => {
        state.user = session?.user || null;
        state.profile = state.user ? await cargarPerfil(state.user.id) : null;
        notify();
      });
    } catch (e) {
      console.warn("[PAU_AUTH] Error en onAuthStateChange:", e.message || e);
    }
    return !!state.user;
  }

  function onChange(cb) {
    listeners.add(cb);
    if (state.ready) try { cb(state); } catch(_){}
    return () => listeners.delete(cb);
  }

  async function registrar(email, password, nombre) {
    const { data, error } = await client.auth.signUp({
      email, password,
      options: { data: { nombre }, emailRedirectTo: cfg.APP_URL + "/?verified=1" },
    });
    if (error) throw error;
    return data;
  }

  async function loginEmail(email, password) {
    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }

  async function loginMagicLink(email) {
    const { error } = await client.auth.signInWithOtp({
      email, options: { emailRedirectTo: cfg.APP_URL + "/?magic=1" },
    });
    if (error) throw error;
  }

  async function loginGoogle() {
    const { error } = await client.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: cfg.APP_URL + "/?oauth=1" },
    });
    if (error) throw error;
  }

  async function logout() {
    await client.auth.signOut();
  }

  async function recuperar(email) {
    const { error } = await client.auth.resetPasswordForEmail(email, {
      redirectTo: cfg.APP_URL + "/?reset=1",
    });
    if (error) throw error;
  }

  async function actualizarPerfil(parches) {
    if (!state.user) throw new Error("no auth");
    // upsert: si la fila no existe (p.ej. registro previo al trigger), la crea
    const fila = { id: state.user.id, ...parches };
    const { data, error } = await client
      .from("profiles")
      .upsert(fila, { onConflict: "id" })
      .select()
      .single();
    if (error) throw error;
    state.profile = data;
    notify();
    return data;
  }

  async function eliminarCuenta() {
    // Borra perfil → cascade sobre estados/adjuntos/etc.
    if (!state.user) return;
    if (!confirm("¿Seguro? Se borrarán todos tus datos. Esta acción es irreversible.")) return;
    // Cliente solo puede pedir logout; el borrado real lo hace una RPC con security definer
    // o un Edge Function llamando a auth.admin.deleteUser. Aquí marcamos y cerramos sesión.
    const { error } = await client.rpc("solicitar_borrado_cuenta");
    if (error) console.warn(error);
    await logout();
    alert("Tu solicitud se procesará en 30 días. Mientras, tu cuenta está desactivada.");
  }

  function isPremium() {
    const p = state.profile;
    if (!p) return false;
    if (!["premium","familia"].includes(p.plan)) return false;
    if (p.premium_hasta && new Date(p.premium_hasta) < new Date()) return false;
    return true;
  }

  function isAdmin() { return state.profile?.rol === "admin"; }
  function isTutor() { return state.profile?.rol === "tutor"; }

  window.PAU_AUTH = {
    configurado: true,
    client,
    get user()    { return state.user; },
    get profile() { return state.profile; },
    get ready()   { return state.ready; },
    init, onChange,
    registrar, loginEmail, loginMagicLink, loginGoogle, logout, recuperar,
    actualizarPerfil, eliminarCuenta,
    isPremium, isAdmin, isTutor,
  };
})();
