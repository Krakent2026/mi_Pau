/* ============================================================
 *  Sistema de logros y mensajes de bienestar
 * ============================================================ */

window.PAU_LOGROS = [
  // Constancia
  { id: "primer-dia",     icono: "🌱", nombre: "Primer paso",          desc: "Has completado tu primera sesión de estudio.", check: (s) => s.sesiones.length >= 1 },
  { id: "racha-3",        icono: "🔥", nombre: "Triple",                desc: "3 días seguidos estudiando.", check: (s) => s.racha.dias >= 3 },
  { id: "racha-7",        icono: "🔥🔥", nombre: "Una semana entera",   desc: "7 días seguidos estudiando.", check: (s) => s.racha.dias >= 7 },
  { id: "racha-14",       icono: "🚀", nombre: "Imparable",             desc: "14 días seguidos estudiando.", check: (s) => s.racha.dias >= 14 },
  { id: "racha-30",       icono: "🏆", nombre: "Un mes de oro",         desc: "30 días seguidos estudiando.", check: (s) => s.racha.dias >= 30 },

  // Sesiones de estudio (cronómetro / temporizador)
  { id: "pomo-10",        icono: "⏱️", nombre: "10 sesiones",            desc: "Has completado 10 sesiones de estudio.", check: (s) => (s.sesiones || []).length >= 10 },
  { id: "pomo-50",        icono: "⏱️⏱️", nombre: "50 sesiones",          desc: "Eres una máquina del foco.", check: (s) => (s.sesiones || []).length >= 50 },
  { id: "horas-10",       icono: "⌛", nombre: "10 horas de estudio",    desc: "Has acumulado 10 horas de estudio.", check: (s) => (s.sesiones || []).reduce((a, x) => a + (x.minutos || 0), 0) >= 600 },
  { id: "horas-50",       icono: "🕰️", nombre: "50 horas de estudio",    desc: "Has acumulado 50 horas de estudio.", check: (s) => (s.sesiones || []).reduce((a, x) => a + (x.minutos || 0), 0) >= 3000 },
  { id: "horas-100",      icono: "🏅", nombre: "100 horas de estudio",   desc: "Cien horas. Esto va en serio.", check: (s) => (s.sesiones || []).reduce((a, x) => a + (x.minutos || 0), 0) >= 6000 },

  // Flashcards
  { id: "fc-50",          icono: "🃏", nombre: "Mente afilada",         desc: "50 tarjetas repasadas.", check: (s) => Object.values(s.flashcards || {}).flat().reduce((a, c) => a + c.reps, 0) >= 50 },
  { id: "fc-200",         icono: "🧠", nombre: "Memoria de elefante",    desc: "200 tarjetas repasadas.", check: (s) => Object.values(s.flashcards || {}).flat().reduce((a, c) => a + c.reps, 0) >= 200 },

  // Tests
  { id: "test-1",         icono: "✅", nombre: "Primer test",            desc: "Has hecho tu primer test.", check: (s) => (s.tests || []).length >= 1 },
  { id: "test-perfecto",  icono: "💯", nombre: "Pleno",                  desc: "Has sacado un 100% en un test.", check: (s) => (s.tests || []).some((t) => t.aciertos === t.total && t.total >= 5) },
  { id: "test-10",        icono: "📈", nombre: "10 tests realizados",    desc: "Practicas con regularidad.", check: (s) => (s.tests || []).length >= 10 },

  // Simulacros
  { id: "sim-1",          icono: "📝", nombre: "Primer simulacro",      desc: "Has completado tu primer simulacro PAU.", check: (s) => (s.simulacros || []).length >= 1 },
  { id: "sim-9",          icono: "🎯", nombre: "Por encima del 9",      desc: "Has obtenido 9 o más en un simulacro.", check: (s) => (s.simulacros || []).some((x) => x.nota >= 9) },

  // Temario
  { id: "temas-25",       icono: "📚", nombre: "25 temas dominados",    desc: "Estás dejando huella en el temario.", check: (s) => Object.values(s.temas || {}).filter((v) => v === 2).length >= 25 },
  { id: "temas-100",      icono: "🎓", nombre: "100 temas dominados",   desc: "Casi listo para la PAU.", check: (s) => Object.values(s.temas || {}).filter((v) => v === 2).length >= 100 },
];

// Frases de bienestar antes de simulacros
window.PAU_BIENESTAR = {
  respiracion: [
    "Cierra los ojos. Inhala 4 segundos. Mantén 4. Exhala 6. Repite 5 veces.",
    "Coloca una mano en el pecho y otra en el abdomen. Solo debe moverse la del abdomen al respirar. 1 minuto.",
    "Técnica 4-7-8: inhala 4s, retén 7s, exhala 8s. Reduce la ansiedad rápidamente.",
  ],
  consejos: [
    "💧 Bebe agua antes de empezar — la deshidratación reduce la concentración hasta un 20%.",
    "🌅 Si has dormido <7 horas, una siesta de 20 min antes de estudiar mejora la memoria.",
    "🚶 Pasea 10 minutos antes de un examen difícil: oxigena el cerebro.",
    "🍫 Un cuadradito de chocolate negro 30 min antes mejora el rendimiento cognitivo.",
    "📵 Pon el móvil en otra habitación. Solo verlo reduce tu rendimiento.",
    "🎵 La música sin letra (lo-fi, clásica) ayuda a concentrarte. La música con letra distrae.",
    "✏️ Escribir a mano lo que estudias activa más áreas del cerebro que solo leer.",
    "💤 Repasar justo antes de dormir consolida mejor la memoria que repasar por la mañana.",
  ],
};
