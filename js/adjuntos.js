/* ============================================================
 *  adjuntos.js — Carga, extracción y gestión de archivos/enlaces
 *  para los apuntes. Soporta PDF, DOCX, TXT/MD e imágenes.
 *  El texto extraído queda accesible para la IA.
 * ============================================================ */
(function () {
  "use strict";

  // Configurar worker de PDF.js si está disponible
  if (window.pdfjsLib) {
    try {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/legacy/build/pdf.worker.min.js";
    } catch (e) { /* ignore */ }
  }

  // Tamaño máximo del archivo binario que guardamos en localStorage (base64)
  // El TEXTO extraído se guarda siempre. Esto es solo para conservar el original.
  const MAX_INLINE_SIZE = 1.5 * 1024 * 1024; // 1.5 MB

  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  function fileToArrayBuffer(file) {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result);
      r.onerror = () => reject(r.error);
      r.readAsArrayBuffer(file);
    });
  }
  function fileToText(file) {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result);
      r.onerror = () => reject(r.error);
      r.readAsText(file);
    });
  }
  function fileToDataURL(file) {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result);
      r.onerror = () => reject(r.error);
      r.readAsDataURL(file);
    });
  }

  async function extraerPDF(file) {
    if (!window.pdfjsLib) throw new Error("PDF.js no está cargado (sin conexión a internet?).");
    const buf = await fileToArrayBuffer(file);
    const pdf = await window.pdfjsLib.getDocument({ data: buf }).promise;
    let texto = "";
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const linea = content.items.map((it) => it.str).join(" ");
      texto += linea + "\n\n";
    }
    return texto.trim();
  }

  async function extraerDOCX(file) {
    if (!window.mammoth) throw new Error("Mammoth.js no está cargado (sin conexión a internet?).");
    const buf = await fileToArrayBuffer(file);
    const result = await window.mammoth.extractRawText({ arrayBuffer: buf });
    return (result.value || "").trim();
  }

  /**
   * Procesa un File y devuelve un objeto adjunto listo para guardar.
   * { id, type:'file', name, mime, size, text, dataUrl?, addedAt }
   */
  async function procesarArchivo(file) {
    const name = file.name || "archivo";
    const mime = file.type || "";
    const size = file.size || 0;
    const lower = name.toLowerCase();
    let text = "";
    let kind = "otro";

    if (mime === "application/pdf" || lower.endsWith(".pdf")) {
      kind = "pdf";
      text = await extraerPDF(file);
    } else if (
      mime === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      lower.endsWith(".docx")
    ) {
      kind = "docx";
      text = await extraerDOCX(file);
    } else if (
      mime.startsWith("text/") ||
      lower.endsWith(".txt") ||
      lower.endsWith(".md") ||
      lower.endsWith(".markdown")
    ) {
      kind = "texto";
      text = await fileToText(file);
    } else if (mime.startsWith("image/")) {
      kind = "imagen";
      // Sin OCR — guardamos solo la imagen
    } else if (lower.endsWith(".doc")) {
      throw new Error("El formato .doc antiguo no está soportado. Conviértelo a .docx o PDF.");
    } else {
      throw new Error("Formato no soportado. Usa PDF, DOCX, TXT, MD o imagen.");
    }

    const adj = {
      id: uid(),
      type: "file",
      kind,
      name,
      mime,
      size,
      text,
      addedAt: new Date().toISOString(),
    };

    // Guardar el binario solo si es razonablemente pequeño
    if (size <= MAX_INLINE_SIZE) {
      try {
        adj.dataUrl = await fileToDataURL(file);
      } catch { /* no pasa nada */ }
    }
    return adj;
  }

  function crearEnlace(url, title) {
    const u = (url || "").trim();
    if (!u) throw new Error("URL vacía.");
    try {
      // Validar URL; permitimos relativas con http(s)
      const parsed = new URL(u.startsWith("http") ? u : "https://" + u);
      return {
        id: uid(),
        type: "link",
        url: parsed.href,
        name: (title || "").trim() || parsed.hostname + parsed.pathname,
        addedAt: new Date().toISOString(),
      };
    } catch {
      throw new Error("URL no válida.");
    }
  }

  function formatearTamano(bytes) {
    if (!bytes) return "";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1024 / 1024).toFixed(2) + " MB";
  }

  function iconoAdjunto(adj) {
    if (adj.type === "link") return "🔗";
    return ({ pdf: "📄", docx: "📝", texto: "📃", imagen: "🖼️" }[adj.kind] || "📎");
  }

  window.PAU_ADJUNTOS = {
    procesarArchivo,
    crearEnlace,
    formatearTamano,
    iconoAdjunto,
    MAX_INLINE_SIZE,
  };
})();
