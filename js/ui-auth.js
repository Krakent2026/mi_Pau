/* =============================================================
 * ui-auth.js — Gestor visual de autenticación
 * =============================================================
 * Inserta:
 *  - Pantalla de login si no hay sesión y MODO=producto
 *  - Botón usuario en topbar (avatar + dropdown)
 *  - Modal de cuenta (perfil, plan, suscripción, cerrar sesión)
 *  - Modal "premium" para upsell
 * ============================================================= */
(function () {
  "use strict";

  const cfg = window.PAU_CONFIG || {};
  const auth = window.PAU_AUTH;
  if (!auth) return;

  // ---------- Traducción de errores comunes de Supabase ----------
  function traducirErrorAuth(msg) {
    if (!msg) return "Error desconocido";
    const m = String(msg).toLowerCase();
    if (m.includes("invalid login credentials")) return "Email o contraseña incorrectos";
    if (m.includes("email not confirmed")) return "Confirma tu email antes de iniciar sesión (revisa tu bandeja)";
    if (m.includes("user already registered")) return "Ya existe una cuenta con ese email — usa 'Entrar' o 'Recuperar'";
    if (m.includes("password should be at least")) return "La contraseña debe tener al menos 8 caracteres";
    if (m.includes("rate limit") || m.includes("too many requests") || m.includes("over_email_send_rate_limit")) return "Demasiados intentos. Espera unos minutos antes de reintentar";
    if (m.includes("for security purposes")) return "Por seguridad, espera unos segundos antes de reintentar";
    if (m.includes("invalid email")) return "El email no es válido";
    if (m.includes("network") || m.includes("fetch")) return "Sin conexión con el servidor — comprueba tu internet";
    if (m.includes("user not found")) return "No existe una cuenta con ese email";
    if (m.includes("signups not allowed")) return "El registro está desactivado en este momento";
    return msg;
  }

  // ---------- Pantalla de login completa ----------
  function mostrarLogin() {
    if (document.getElementById("auth-screen")) return;
    const div = document.createElement("div");
    div.id = "auth-screen";
    div.innerHTML = `
      <div class="auth-card">
        <h1>📚 ${cfg.APP_NAME || "Mi PAU"}</h1>
        <p class="auth-tag">Tu copiloto para la PAU</p>
        <div class="auth-tabs">
          <button class="auth-tab active" data-mode="login">Entrar</button>
          <button class="auth-tab" data-mode="signup">Crear cuenta</button>
          <button class="auth-tab" data-mode="reset">Recuperar</button>
        </div>
        <form id="auth-form" autocomplete="on">
          <div class="auth-field" data-only="signup">
            <label>Nombre</label>
            <input type="text" name="nombre" placeholder="Cómo te llamas">
          </div>
          <div class="auth-field">
            <label>Email</label>
            <input type="email" name="email" required autocomplete="email" placeholder="tu@email.es">
          </div>
          <div class="auth-field" data-not="reset">
            <label>Contraseña</label>
            <input type="password" name="password" minlength="8" autocomplete="current-password" placeholder="Mínimo 8 caracteres">
          </div>
          <div class="auth-field" data-only="signup">
            <label class="auth-check">
              <input type="checkbox" name="terms" required>
              Acepto los <a href="legal/terminos.html" target="_blank">Términos</a> y la
              <a href="legal/privacidad.html" target="_blank">Política de Privacidad</a>
            </label>
            <label class="auth-check">
              <input type="checkbox" name="mayor_edad" required>
              Soy mayor de 14 años o tengo permiso de mi tutor legal
            </label>
          </div>
          <button type="submit" class="btn-primary auth-submit">Entrar</button>
          <p class="auth-msg" id="auth-msg"></p>
        </form>
        <div class="auth-divider"><span>o</span></div>
        <div class="auth-social">
          <button class="btn-google" id="auth-google">Continuar con Google</button>
          <button class="btn-magic"  id="auth-magic">Enviar enlace mágico</button>
        </div>
        <p class="auth-foot">
          <a href="legal/privacidad.html" target="_blank">Privacidad</a> ·
          <a href="legal/terminos.html"   target="_blank">Términos</a> ·
          <a href="legal/cookies.html"    target="_blank">Cookies</a>
        </p>
      </div>
    `;
    document.body.appendChild(div);

    let mode = "login";
    const form = div.querySelector("#auth-form");
    const msg  = div.querySelector("#auth-msg");

    function aplicarModo() {
      div.querySelectorAll(".auth-tab").forEach(t => t.classList.toggle("active", t.dataset.mode === mode));
      div.querySelectorAll("[data-only]").forEach(f => f.style.display = f.dataset.only === mode ? "" : "none");
      div.querySelectorAll("[data-not]").forEach(f => f.style.display = f.dataset.not === mode ? "none" : "");
      div.querySelector(".auth-submit").textContent = ({
        login: "Entrar", signup: "Crear cuenta", reset: "Enviar enlace de recuperación",
      })[mode];
    }
    aplicarModo();
    div.querySelectorAll(".auth-tab").forEach(t => t.addEventListener("click", () => {
      mode = t.dataset.mode; msg.textContent = ""; aplicarModo();
    }));

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const email = (fd.get("email") || "").trim();
      const password = fd.get("password") || "";
      const nombre = (fd.get("nombre") || "").trim();
      msg.textContent = "Procesando..."; msg.className = "auth-msg";
      const submitBtn = div.querySelector(".auth-submit");
      if (submitBtn) submitBtn.disabled = true;
      try {
        if (mode === "login") {
          if (!email || !password) {
            throw new Error("Introduce email y contraseña");
          }
          await auth.loginEmail(email, password);
          msg.textContent = "✓ Bienvenido"; msg.className = "auth-msg ok";
          // Let onChange handler remove div after successful login
        } else if (mode === "signup") {
          if (!email || !password) {
            throw new Error("Introduce email y contraseña");
          }
          if (password.length < 8) {
            throw new Error("La contraseña debe tener al menos 8 caracteres");
          }
          await auth.registrar(email, password, nombre);
          msg.textContent = "✓ Revisa tu email para confirmar la cuenta";
          msg.className = "auth-msg ok";
        } else {
          if (!email) throw new Error("Introduce tu email");
          await auth.recuperar(email);
          msg.textContent = "✓ Te hemos enviado un email para recuperar la contraseña";
          msg.className = "auth-msg ok";
        }
      } catch (err) { console.group("[UI-AUTH] ERROR"); console.error("Raw error:", err); console.error("message:", err?.message); console.error("error_description:", err?.error_description); console.groupEnd();
        const raw = err.message || err.error_description || "Error inesperado";
        const traducido = traducirErrorAuth(raw);
        msg.textContent = "✗ " + traducido;
        msg.className = "auth-msg err";
        console.error("[UI-AUTH] login error:", err);
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });

    div.querySelector("#auth-google").addEventListener("click", async () => {
      try { await auth.loginGoogle(); }
      catch (e) { msg.textContent = e.message; msg.className = "auth-msg err"; }
    });
    div.querySelector("#auth-magic").addEventListener("click", async () => {
      const email = form.email.value;
      if (!email) { msg.textContent = "Escribe tu email primero"; msg.className = "auth-msg err"; return; }
      try {
        await auth.loginMagicLink(email);
        msg.textContent = "✓ Enlace enviado. Revisa tu correo."; msg.className = "auth-msg ok";
      } catch (e) { msg.textContent = e.message; msg.className = "auth-msg err"; }
    });
  }

  function ocultarLogin() {
    document.getElementById("auth-screen")?.remove();
  }

  // ---------- Botón usuario en topbar ----------
  function pintarBotonUsuario() {
    const tb = document.querySelector(".topbar .topbar-actions") || document.querySelector(".topbar");
    if (!tb) return;
    let btn = document.getElementById("btn-usuario");
    if (!btn) {
      btn = document.createElement("button");
      btn.id = "btn-usuario";
      btn.className = "btn-icon";
      btn.title = "Mi cuenta";
      tb.appendChild(btn);
      btn.addEventListener("click", abrirModalCuenta);
    }
    const u = auth.user, p = auth.profile;
    if (u) {
      const ini = (p?.nombre || u.email || "?").charAt(0).toUpperCase();
      btn.innerHTML = p?.avatar_url
        ? `<img src="${p.avatar_url}" alt="" class="avatar-mini">`
        : `<span class="avatar-mini avatar-text">${ini}</span>`;
      if (auth.isPremium()) btn.classList.add("es-premium"); else btn.classList.remove("es-premium");
      btn.style.display = "";
    } else {
      btn.textContent = "👤";
      btn.style.display = "none";
    }
  }

  // ---------- Modal de cuenta ----------
  function abrirModalCuenta() {
    if (!auth.user) return mostrarLogin();
    const p = auth.profile || {};
    const m = document.createElement("div");
    m.className = "modal-bg"; m.id = "modal-cuenta";
    m.innerHTML = `
      <div class="modal-card">
        <button class="modal-x" aria-label="Cerrar">×</button>
        <h2>Mi cuenta</h2>
        <div class="cuenta-head">
          <div class="avatar-grande">${(p.nombre||auth.user.email).charAt(0).toUpperCase()}</div>
          <div>
            <strong>${p.nombre || "(sin nombre)"}</strong>
            <div class="muted">${auth.user.email}</div>
            <span class="badge badge-${p.plan}">${cfg.PLANES?.[p.plan]?.nombre || p.plan}</span>
            ${auth.isAdmin() ? '<span class="badge badge-admin">Admin</span>' : ''}
            ${auth.isTutor() ? '<span class="badge badge-tutor">Tutor</span>' : ''}
          </div>
        </div>

        <h3>Datos personales</h3>
        <form id="cuenta-form" class="cuenta-form">
          <label>Nombre <input name="nombre" value="${p.nombre || ""}"></label>
          <label>Curso
            <select name="curso">
              <option value="">—</option>
              <option ${p.curso==="2BACH-CIENCIAS"?"selected":""}>2BACH-CIENCIAS</option>
              <option ${p.curso==="2BACH-LETRAS"?"selected":""}>2BACH-LETRAS</option>
              <option ${p.curso==="2BACH-CCSS"?"selected":""}>2BACH-CCSS</option>
              <option ${p.curso==="2BACH-ARTES"?"selected":""}>2BACH-ARTES</option>
            </select>
          </label>
          <label>Comunidad <input name="comunidad" value="${p.comunidad || "MURCIA"}"></label>
          <label>Centro <input name="centro" value="${p.centro || ""}"></label>
          <label>Fecha PAU <input type="date" name="fecha_pau" value="${p.fecha_pau || ""}"></label>
          <label class="cuenta-check"><input type="checkbox" name="notif_email" ${p.notif_email?"checked":""}> Recibir notificaciones por email</label>
          <label class="cuenta-check"><input type="checkbox" name="notif_push"  ${p.notif_push?"checked":""}> Recibir notificaciones push</label>
          <label class="cuenta-check"><input type="checkbox" name="marketing_ok" ${p.marketing_ok?"checked":""}> Acepto recibir consejos y novedades</label>
          <button type="submit" class="btn-primary">Guardar</button>
        </form>

        <h3>Plan y suscripción</h3>
        <div class="cuenta-plan">
          <p><strong>${cfg.PLANES?.[p.plan]?.nombre || p.plan}</strong> — uso IA este mes: <code>${p.ia_uso_mes||0} / ${p.ia_quota_mes||"∞"}</code></p>
          ${!auth.isPremium() ? `<button id="cuenta-upgrade" class="btn-primary">⭐ Hazte Premium</button>` : `<button id="cuenta-portal" class="btn-secundario">Gestionar suscripción</button>`}
        </div>

        <h3>Privacidad y datos</h3>
        <div class="cuenta-priv">
          <button id="cuenta-export" class="btn-secundario">📥 Descargar mis datos (RGPD)</button>
          <button id="cuenta-revocar" class="btn-secundario">🔒 Revocar consentimientos</button>
        </div>

        <h3>Sesión</h3>
        <div class="cuenta-sesion">
          <button id="cuenta-logout" class="btn-secundario">Cerrar sesión</button>
          <button id="cuenta-borrar" class="btn-peligro">Eliminar mi cuenta</button>
        </div>

        <p class="muted small">Versión ${cfg.APP_VERSION || "?"} · <a href="legal/privacidad.html" target="_blank">Privacidad</a> · <a href="legal/terminos.html" target="_blank">Términos</a></p>
      </div>
    `;
    document.body.appendChild(m);

    m.querySelector(".modal-x").onclick = () => m.remove();
    m.addEventListener("click", e => { if (e.target === m) m.remove(); });

    m.querySelector("#cuenta-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const parches = {};
      for (const [k, v] of fd.entries()) parches[k] = v;
      ["notif_email","notif_push","marketing_ok"].forEach(k => parches[k] = !!fd.get(k));
      try {
        await auth.actualizarPerfil(parches);
        e.target.querySelector("button[type=submit]").textContent = "✓ Guardado";
        setTimeout(() => e.target.querySelector("button[type=submit]").textContent = "Guardar", 1500);
      } catch (err) { console.group("[UI-AUTH] ERROR"); console.error("Raw error:", err); console.error("message:", err?.message); console.error("error_description:", err?.error_description); console.groupEnd(); alert(err.message); }
    });

    m.querySelector("#cuenta-logout")?.addEventListener("click", async () => {
      await auth.logout(); m.remove();
    });
    m.querySelector("#cuenta-borrar")?.addEventListener("click", async () => {
      await auth.eliminarCuenta(); m.remove();
    });
    m.querySelector("#cuenta-upgrade")?.addEventListener("click", abrirModalUpgrade);
    m.querySelector("#cuenta-portal")?.addEventListener("click", abrirPortalSuscripcion);
    m.querySelector("#cuenta-export")?.addEventListener("click", exportarDatosUsuario);
    m.querySelector("#cuenta-revocar")?.addEventListener("click", async () => {
      await auth.actualizarPerfil({ marketing_ok: false, notif_email: false, notif_push: false });
      alert("Consentimientos revocados.");
    });
  }

  // ---------- Modal upgrade premium ----------
  function abrirModalUpgrade() {
    document.getElementById("modal-cuenta")?.remove();
    const m = document.createElement("div");
    m.className = "modal-bg"; m.id = "modal-upgrade";
    const planes = cfg.PLANES || {};
    const cards = ["premium_mensual","premium_anual","familia_anual"].map(k => {
      const p = planes[k]; if (!p) return "";
      return `
        <div class="plan-card ${p.destacado?"destacado":""}">
          ${p.destacado?'<span class="plan-flag">Más popular</span>':""}
          <h3>${p.nombre}</h3>
          <div class="plan-precio">${p.precio}</div>
          ${p.ahorro?`<div class="plan-ahorro">${p.ahorro}</div>`:""}
          <ul>${(p.features||[]).map(f=>`<li>${f}</li>`).join("")}</ul>
          <button class="btn-primary" data-plan="${k}">Elegir</button>
        </div>`;
    }).join("");
    m.innerHTML = `
      <div class="modal-card modal-ancho">
        <button class="modal-x">×</button>
        <h2>⭐ Hazte Premium</h2>
        <p>Desbloquea IA ilimitada, sync en la nube, adjuntos sin límite y soporte prioritario.</p>
        <div class="planes-grid">${cards}</div>
        <p class="muted small">Pago seguro con Stripe. Cancela cuando quieras.</p>
      </div>
    `;
    document.body.appendChild(m);
    m.querySelector(".modal-x").onclick = () => m.remove();
    m.addEventListener("click", e => { if (e.target === m) m.remove(); });
    m.querySelectorAll("[data-plan]").forEach(b => b.addEventListener("click", async () => {
      const plan = b.dataset.plan;
      b.disabled = true; b.textContent = "Redirigiendo...";
      try {
        const { data: { session } } = await auth.client.auth.getSession();
        const r = await fetch(cfg.SUPABASE_URL + "/functions/v1/create-checkout", {
          method: "POST",
          headers: {
            "Authorization": "Bearer " + session.access_token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ plan, success_url: cfg.APP_URL + "/?upgrade=ok", cancel_url: cfg.APP_URL + "/?upgrade=cancel" }),
        });
        const d = await r.json();
        if (d.url) location.href = d.url;
        else throw new Error(d.error || "Error");
      } catch (e) {
        alert(e.message); b.disabled = false; b.textContent = "Elegir";
      }
    }));
  }

  async function abrirPortalSuscripcion() {
    alert("Para gestionar tu suscripción, contacta con soporte: " + (cfg.SOPORTE_EMAIL || "soporte@mipau.app"));
    // En producción: llamar a una Edge Function "stripe-portal" que crea una billing portal session.
  }

  async function exportarDatosUsuario() {
    if (!auth.user) return;
    const sb = auth.client;
    const [perfil, estado, adj, ia, sus] = await Promise.all([
      sb.from("profiles").select("*").eq("id", auth.user.id).maybeSingle(),
      sb.from("estados").select("*").eq("user_id", auth.user.id).maybeSingle(),
      sb.from("adjuntos").select("*").eq("user_id", auth.user.id),
      sb.from("ia_uso").select("*").eq("user_id", auth.user.id).limit(500),
      sb.from("suscripciones").select("*").eq("user_id", auth.user.id),
    ]);
    const blob = new Blob([JSON.stringify({
      generado: new Date().toISOString(),
      perfil: perfil.data, estado: estado.data,
      adjuntos: adj.data, uso_ia: ia.data, suscripciones: sus.data,
    }, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `mipau-datos-${auth.user.id}.json`;
    a.click();
  }

  // ---------- Inicialización ----------
  if (cfg.MODO !== "producto" && cfg.MODO !== "personal") {
    window.PAU_AUTH_UI = { abrirModalCuenta, abrirModalUpgrade };
    return;
  }

  auth.init().then(() => {
    if (!auth.user) mostrarLogin();
    else ocultarLogin();
    pintarBotonUsuario();
  }).catch((e) => {
    console.warn("[UI-AUTH] Error en init, mostrando login:", e);
    mostrarLogin();
  });

  if (auth.onChange) {
    auth.onChange((s) => {
      if (s.ready && !s.user) mostrarLogin();
      else if (s.user) ocultarLogin();
      pintarBotonUsuario();
    });
  }

  window.PAU_AUTH_UI = { abrirModalCuenta, abrirModalUpgrade, mostrarLogin };
})();


