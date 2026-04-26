/* ============================================================
 *  Banco de exámenes PAU Región de Murcia (UMU/UPCT)
 *  URLs base de la web oficial de la UMU. Si una URL específica
 *  cambia, se puede acceder al listado completo desde:
 *  https://www.um.es/web/estudios/acceso/estudiantes-bachillerato-y-ciclos-formativos
 * ============================================================ */

window.PAU_EXAMS = {
  // URL raíz oficial donde encontrar TODOS los exámenes anteriores
  rootUrl: "https://www.um.es/web/estudios/acceso/estudiantes-bachillerato-y-ciclos-formativos",

  // Catálogo organizado por materia
  porMateria: {
    lengua: [
      { año: 2025, conv: "Junio",  url: "https://www.um.es/web/estudios/acceso/pau/examenes-anteriores", duracion: 90 },
      { año: 2025, conv: "Julio",  url: "https://www.um.es/web/estudios/acceso/pau/examenes-anteriores", duracion: 90 },
      { año: 2024, conv: "Junio",  url: "https://www.um.es/web/estudios/acceso/pau/examenes-anteriores", duracion: 90 },
      { año: 2024, conv: "Julio",  url: "https://www.um.es/web/estudios/acceso/pau/examenes-anteriores", duracion: 90 },
      { año: 2023, conv: "Junio",  url: "https://www.um.es/web/estudios/acceso/pau/examenes-anteriores", duracion: 90 },
    ],
    historia: [
      { año: 2025, conv: "Junio", url: "https://www.um.es/web/estudios/acceso/pau/examenes-anteriores", duracion: 90 },
      { año: 2025, conv: "Julio", url: "https://www.um.es/web/estudios/acceso/pau/examenes-anteriores", duracion: 90 },
      { año: 2024, conv: "Junio", url: "https://www.um.es/web/estudios/acceso/pau/examenes-anteriores", duracion: 90 },
      { año: 2024, conv: "Julio", url: "https://www.um.es/web/estudios/acceso/pau/examenes-anteriores", duracion: 90 },
      { año: 2023, conv: "Junio", url: "https://www.um.es/web/estudios/acceso/pau/examenes-anteriores", duracion: 90 },
    ],
    filosofia: [
      { año: 2025, conv: "Junio", url: "https://www.um.es/web/estudios/acceso/pau/examenes-anteriores", duracion: 90 },
      { año: 2024, conv: "Junio", url: "https://www.um.es/web/estudios/acceso/pau/examenes-anteriores", duracion: 90 },
      { año: 2023, conv: "Junio", url: "https://www.um.es/web/estudios/acceso/pau/examenes-anteriores", duracion: 90 },
    ],
    ingles: [
      { año: 2025, conv: "Junio", url: "https://www.um.es/web/estudios/acceso/pau/examenes-anteriores", duracion: 90 },
      { año: 2025, conv: "Julio", url: "https://www.um.es/web/estudios/acceso/pau/examenes-anteriores", duracion: 90 },
      { año: 2024, conv: "Junio", url: "https://www.um.es/web/estudios/acceso/pau/examenes-anteriores", duracion: 90 },
      { año: 2023, conv: "Junio", url: "https://www.um.es/web/estudios/acceso/pau/examenes-anteriores", duracion: 90 },
    ],
    matematicas2: [
      { año: 2025, conv: "Junio", url: "https://www.ebaumatematicas.com/examenes-matematicas-murcia/", duracion: 90, soluciones: true },
      { año: 2025, conv: "Julio", url: "https://www.ebaumatematicas.com/examenes-matematicas-murcia/", duracion: 90, soluciones: true },
      { año: 2024, conv: "Junio", url: "https://www.ebaumatematicas.com/examenes-matematicas-murcia/", duracion: 90, soluciones: true },
      { año: 2024, conv: "Julio", url: "https://www.ebaumatematicas.com/examenes-matematicas-murcia/", duracion: 90, soluciones: true },
      { año: 2023, conv: "Junio", url: "https://www.ebaumatematicas.com/examenes-matematicas-murcia/", duracion: 90, soluciones: true },
    ],
    matematicasccss: [
      { año: 2025, conv: "Junio", url: "https://www.ebaumatematicas.com/examenes-matematicas-murcia/", duracion: 90, soluciones: true },
      { año: 2024, conv: "Junio", url: "https://www.ebaumatematicas.com/examenes-matematicas-murcia/", duracion: 90, soluciones: true },
      { año: 2023, conv: "Junio", url: "https://www.ebaumatematicas.com/examenes-matematicas-murcia/", duracion: 90, soluciones: true },
    ],
    latin2: [
      { año: 2025, conv: "Junio", url: "https://www.um.es/web/estudios/acceso/pau/examenes-anteriores", duracion: 90 },
      { año: 2024, conv: "Junio", url: "https://www.um.es/web/estudios/acceso/pau/examenes-anteriores", duracion: 90 },
    ],
    biologia: [
      { año: 2025, conv: "Junio", url: "https://www.um.es/web/estudios/acceso/pau/examenes-anteriores", duracion: 90 },
      { año: 2024, conv: "Junio", url: "https://www.um.es/web/estudios/acceso/pau/examenes-anteriores", duracion: 90 },
      { año: 2023, conv: "Junio", url: "https://www.um.es/web/estudios/acceso/pau/examenes-anteriores", duracion: 90 },
    ],
    quimica: [
      { año: 2025, conv: "Junio", url: "https://www.um.es/web/estudios/acceso/pau/examenes-anteriores", duracion: 90 },
      { año: 2024, conv: "Junio", url: "https://www.um.es/web/estudios/acceso/pau/examenes-anteriores", duracion: 90 },
      { año: 2023, conv: "Junio", url: "https://www.um.es/web/estudios/acceso/pau/examenes-anteriores", duracion: 90 },
    ],
    fisica: [
      { año: 2025, conv: "Junio", url: "https://www.um.es/web/estudios/acceso/pau/examenes-anteriores", duracion: 90 },
      { año: 2024, conv: "Junio", url: "https://www.um.es/web/estudios/acceso/pau/examenes-anteriores", duracion: 90 },
    ],
    dibujo: [
      { año: 2025, conv: "Junio", url: "https://www.um.es/web/estudios/acceso/pau/examenes-anteriores", duracion: 90 },
      { año: 2024, conv: "Junio", url: "https://www.um.es/web/estudios/acceso/pau/examenes-anteriores", duracion: 90 },
    ],
    geografia: [
      { año: 2025, conv: "Junio", url: "https://www.um.es/web/estudios/acceso/pau/examenes-anteriores", duracion: 90 },
      { año: 2024, conv: "Junio", url: "https://www.um.es/web/estudios/acceso/pau/examenes-anteriores", duracion: 90 },
    ],
    empresa: [
      { año: 2025, conv: "Junio", url: "https://www.um.es/web/estudios/acceso/pau/examenes-anteriores", duracion: 90 },
      { año: 2024, conv: "Junio", url: "https://www.um.es/web/estudios/acceso/pau/examenes-anteriores", duracion: 90 },
    ],
    tecnologia: [
      { año: 2025, conv: "Junio", url: "https://www.um.es/web/estudios/acceso/pau/examenes-anteriores", duracion: 90 },
      { año: 2024, conv: "Junio", url: "https://www.um.es/web/estudios/acceso/pau/examenes-anteriores", duracion: 90 },
    ],
    arte: [
      { año: 2025, conv: "Junio", url: "https://www.um.es/web/estudios/acceso/pau/examenes-anteriores", duracion: 90 },
      { año: 2024, conv: "Junio", url: "https://www.um.es/web/estudios/acceso/pau/examenes-anteriores", duracion: 90 },
    ],
    frances: [
      { año: 2025, conv: "Junio", url: "https://www.um.es/web/estudios/acceso/pau/examenes-anteriores", duracion: 90 },
      { año: 2024, conv: "Junio", url: "https://www.um.es/web/estudios/acceso/pau/examenes-anteriores", duracion: 90 },
    ],
  },
};
