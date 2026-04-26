/* ============================================================
 *  ia.js — Capa unificada para llamar a varios proveedores LLM
 *  Soporta: OpenAI, Anthropic (Claude), Google Gemini
 *  Las claves se guardan en localStorage (clave: pauMurciaIA)
 * ============================================================ */
(function () {
  "use strict";

  const STORAGE_KEY = "pauMurciaIA";

  // Modelos por defecto (rápidos y baratos)
  const DEFAULTS = {
    openai:     { model: "gpt-4o-mini",                    label: "OpenAI" },
    anthropic:  { model: "claude-3-5-haiku-latest",         label: "Anthropic (Claude)" },
    gemini:     { model: "gemini-2.0-flash",                label: "Google Gemini" },
    groq:       { model: "llama-3.3-70b-versatile",         label: "Groq (gratis)" },
    openrouter: { model: "meta-llama/llama-3.3-70b-instruct:free", label: "OpenRouter (free)" },
  };

  function getConfig() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch {
      return {};
    }
  }
  function saveConfig(cfg) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
  }
  function isConfigured() {
    const c = getConfig();
    return !!(c.provider && c.apiKey);
  }

  // ----------------------------------------------------------------
  //  Llamadas por proveedor
  // ----------------------------------------------------------------
  async function callOpenAI({ apiKey, model, system, messages, temperature = 0.5 }) {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model || DEFAULTS.openai.model,
        temperature,
        messages: [
          ...(system ? [{ role: "system", content: system }] : []),
          ...messages,
        ],
      }),
    });
    if (!res.ok) throw new Error(`OpenAI ${res.status}: ${await res.text()}`);
    const data = await res.json();
    return data.choices?.[0]?.message?.content || "";
  }

  async function callAnthropic({ apiKey, model, system, messages, temperature = 0.5 }) {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: model || DEFAULTS.anthropic.model,
        max_tokens: 2048,
        temperature,
        system: system || undefined,
        messages: messages.map((m) => ({
          role: m.role === "assistant" ? "assistant" : "user",
          content: m.content,
        })),
      }),
    });
    if (!res.ok) throw new Error(`Anthropic ${res.status}: ${await res.text()}`);
    const data = await res.json();
    return data.content?.[0]?.text || "";
  }

  async function callGemini({ apiKey, model, system, messages, temperature = 0.5 }) {
    const m = model || DEFAULTS.gemini.model;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${encodeURIComponent(apiKey)}`;
    const contents = messages.map((msg) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));
    const body = {
      contents,
      generationConfig: { temperature, maxOutputTokens: 2048 },
    };
    if (system) body.systemInstruction = { parts: [{ text: system }] };
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`Gemini ${res.status}: ${await res.text()}`);
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  }

  /**
   * Llamada genérica.
   * @param {object} opts
   * @param {string} opts.system  prompt de sistema
   * @param {Array<{role:'user'|'assistant',content:string}>} opts.messages
   * @param {number} [opts.temperature]
   */
  async function chat(opts) {
    const cfg = getConfig();
    if (!cfg.provider || !cfg.apiKey) {
      throw new Error("IA no configurada. Ve a ⚙️ Ajustes IA y añade tu clave.");
    }
    const params = {
      apiKey: cfg.apiKey,
      model: cfg.model,
      system: opts.system,
      messages: opts.messages,
      temperature: opts.temperature,
    };
    switch (cfg.provider) {
      case "openai":     return callOpenAI(params);
      case "anthropic":  return callAnthropic(params);
      case "gemini":     return callGemini(params);
      case "groq":       return callGroq(params);
      case "openrouter": return callOpenRouter(params);
      default: throw new Error("Proveedor desconocido: " + cfg.provider);
    }
  }

  // Groq usa la API compatible OpenAI
  async function callGroq({ apiKey, model, system, messages, temperature = 0.5 }) {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model || DEFAULTS.groq.model,
        temperature,
        messages: [
          ...(system ? [{ role: "system", content: system }] : []),
          ...messages,
        ],
      }),
    });
    if (!res.ok) throw new Error(`Groq ${res.status}: ${await res.text()}`);
    const data = await res.json();
    return data.choices?.[0]?.message?.content || "";
  }

  async function callOpenRouter({ apiKey, model, system, messages, temperature = 0.5 }) {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": location.origin,
        "X-Title": "Mi PAU 2026",
      },
      body: JSON.stringify({
        model: model || DEFAULTS.openrouter.model,
        temperature,
        messages: [
          ...(system ? [{ role: "system", content: system }] : []),
          ...messages,
        ],
      }),
    });
    if (!res.ok) throw new Error(`OpenRouter ${res.status}: ${await res.text()}`);
    const data = await res.json();
    return data.choices?.[0]?.message?.content || "";
  }

  // ----------------------------------------------------------------
  //  Helpers de prompt (PAU Murcia 2026)
  // ----------------------------------------------------------------
  const SYSTEM_TUTOR = `Eres un tutor experto preparando a una estudiante para la PAU 2026 de la Región de Murcia (UMU/UPCT).
Adapta tu nivel de explicación al de Bachillerato. Sé claro, breve y didáctico.
Cuando proceda, usa ejemplos, esquemas en lista o pequeñas tablas Markdown.
Si la pregunta sale del temario PAU, indícalo amablemente. Responde siempre en español.`;

  function promptCorregirRedaccion(materia, texto) {
    return `Corrige esta redacción siguiendo la rúbrica oficial PAU de la Región de Murcia para la materia "${materia}".
Devuelve la respuesta con este formato Markdown EXACTO:

## ✏️ Nota estimada
**X / 10**

## ✅ Aspectos positivos
- ...

## ⚠️ Errores y mejoras
- ...

## 📝 Sugerencias concretas
- ...

## 🔁 Reformulación de un párrafo a modo de ejemplo
> ...

---

REDACCIÓN A CORREGIR:
"""
${texto}
"""`;
  }

  function promptGenerarTest(materia, tema, n = 5) {
    return `Genera ${n} preguntas tipo test de nivel PAU Murcia 2026 sobre "${tema}" (materia: ${materia}).
Devuelve **únicamente JSON válido**, sin texto extra ni \`\`\`, con este esquema:
[
  {
    "pregunta": "…",
    "opciones": ["A", "B", "C", "D"],
    "correcta": 0,
    "explicacion": "Por qué es correcta y por qué fallan las demás"
  }
]
La propiedad "correcta" es el índice (0-3). Sé riguroso académicamente.`;
  }

  function promptResumir(materia, tema, texto) {
    return `Resume el siguiente material para repasar antes de la PAU (${materia} — ${tema}).
Devuelve Markdown con esta estructura:

## 📌 Idea clave
Una sola frase.

## 🗂️ Esquema
- Punto 1
  - subpunto
- Punto 2

## 💡 Conceptos a memorizar
- término: definición breve

## ❓ 5 preguntas de autoevaluación
1. …

TEXTO:
"""
${texto}
"""`;
  }

  function promptExplicarSimple(texto) {
    return `Reformula la siguiente explicación como si se la contaras a alguien de 12 años, manteniendo todo el rigor pero usando ejemplos cotidianos y frases cortas.
Devuelve solo la nueva explicación.

TEXTO:
"""
${texto}
"""`;
  }

  // ----------------------------------------------------------------
  //  API pública
  // ----------------------------------------------------------------
  window.PAU_IA = {
    DEFAULTS,
    getConfig,
    saveConfig,
    isConfigured,
    chat,
    SYSTEM_TUTOR,
    promptCorregirRedaccion,
    promptGenerarTest,
    promptResumir,
    promptExplicarSimple,
  };
})();
