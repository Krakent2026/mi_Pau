/* ============================================================
 *  Grados universitarios UMU/UPCT — notas de corte 2025/2026
 *  y ponderaciones (factor a aplicar a M1/M2 de Fase Voluntaria)
 *
 *  Fuente: Universidad de Murcia (notas de corte) y tablas
 *  de ponderaciones para admisión 2026.
 *  Selección representativa de grados con mayor demanda.
 * ============================================================ */

window.PAU_GRADOS = [
  // ===== CIENCIAS DE LA SALUD =====
  { id: "medicina-um",     nombre: "Medicina (UMU)",                     uni: "UMU",  rama: "Salud",      notaCorte: 12.987, pond: { biologia: 0.2, quimica: 0.2, fisica: 0.2, matematicas2: 0.2 } },
  { id: "medicina-cu",     nombre: "Medicina (Cat. San Antonio)",        uni: "UCAM", rama: "Salud",      notaCorte: 12.500, pond: { biologia: 0.2, quimica: 0.2, fisica: 0.1 } },
  { id: "enfermeria-um",   nombre: "Enfermería (UMU)",                   uni: "UMU",  rama: "Salud",      notaCorte: 11.700, pond: { biologia: 0.2, quimica: 0.2, fisica: 0.1 } },
  { id: "fisio-um",        nombre: "Fisioterapia (UMU)",                 uni: "UMU",  rama: "Salud",      notaCorte: 11.800, pond: { biologia: 0.2, quimica: 0.2, fisica: 0.1 } },
  { id: "psicologia-um",   nombre: "Psicología (UMU)",                   uni: "UMU",  rama: "Salud",      notaCorte: 11.000, pond: { biologia: 0.2, matematicasccss: 0.2, matematicas2: 0.2, filosofia: 0.1 } },
  { id: "veterinaria-um",  nombre: "Veterinaria (UMU)",                  uni: "UMU",  rama: "Salud",      notaCorte: 11.300, pond: { biologia: 0.2, quimica: 0.2, fisica: 0.1, matematicas2: 0.1 } },
  { id: "farmacia-um",     nombre: "Farmacia (UMU)",                     uni: "UMU",  rama: "Salud",      notaCorte: 10.000, pond: { biologia: 0.2, quimica: 0.2, fisica: 0.1, matematicas2: 0.1 } },
  { id: "odontologia-um",  nombre: "Odontología (UMU)",                  uni: "UMU",  rama: "Salud",      notaCorte: 11.700, pond: { biologia: 0.2, quimica: 0.2, fisica: 0.1 } },
  { id: "nutricion-um",    nombre: "Nutrición Humana y Dietética (UMU)", uni: "UMU",  rama: "Salud",      notaCorte:  9.500, pond: { biologia: 0.2, quimica: 0.2, fisica: 0.1 } },

  // ===== INGENIERÍAS Y CIENCIAS =====
  { id: "telecom-upct",    nombre: "Ingeniería de Telecomunicación (UPCT)", uni: "UPCT", rama: "Ingeniería", notaCorte: 6.900, pond: { matematicas2: 0.2, fisica: 0.2, quimica: 0.1, dibujo: 0.1, tecnologia: 0.2 } },
  { id: "industriales-upct", nombre: "Ing. Tecnologías Industriales (UPCT)", uni: "UPCT", rama: "Ingeniería", notaCorte: 7.500, pond: { matematicas2: 0.2, fisica: 0.2, quimica: 0.1, dibujo: 0.1, tecnologia: 0.2 } },
  { id: "informatica-um",  nombre: "Ingeniería Informática (UMU)",       uni: "UMU",  rama: "Ingeniería", notaCorte:  9.500, pond: { matematicas2: 0.2, fisica: 0.2, tecnologia: 0.1 } },
  { id: "civil-upct",      nombre: "Ingeniería Civil (UPCT)",            uni: "UPCT", rama: "Ingeniería", notaCorte:  5.500, pond: { matematicas2: 0.2, fisica: 0.2, dibujo: 0.1, tecnologia: 0.2 } },
  { id: "arquitectura-upct", nombre: "Fundamentos de Arquitectura (UPCT)", uni: "UPCT", rama: "Ingeniería", notaCorte: 7.800, pond: { matematicas2: 0.2, fisica: 0.2, dibujo: 0.2 } },
  { id: "matematicas-um",  nombre: "Matemáticas (UMU)",                  uni: "UMU",  rama: "Ciencias",   notaCorte:  9.500, pond: { matematicas2: 0.2, fisica: 0.2, quimica: 0.1 } },
  { id: "fisica-um",       nombre: "Física (UMU)",                       uni: "UMU",  rama: "Ciencias",   notaCorte:  8.700, pond: { matematicas2: 0.2, fisica: 0.2, quimica: 0.1 } },
  { id: "quimica-um",      nombre: "Química (UMU)",                      uni: "UMU",  rama: "Ciencias",   notaCorte:  6.500, pond: { quimica: 0.2, biologia: 0.2, fisica: 0.1, matematicas2: 0.1 } },
  { id: "biologia-um",     nombre: "Biología (UMU)",                     uni: "UMU",  rama: "Ciencias",   notaCorte:  9.000, pond: { biologia: 0.2, quimica: 0.2, fisica: 0.1, matematicas2: 0.1 } },
  { id: "biotec-um",       nombre: "Biotecnología (UMU)",                uni: "UMU",  rama: "Ciencias",   notaCorte: 11.400, pond: { biologia: 0.2, quimica: 0.2, fisica: 0.1, matematicas2: 0.1 } },

  // ===== CIENCIAS SOCIALES Y JURÍDICAS =====
  { id: "derecho-um",      nombre: "Derecho (UMU)",                      uni: "UMU",  rama: "Sociales",   notaCorte:  7.000, pond: { latin2: 0.2, filosofia: 0.1, matematicasccss: 0.1, geografia: 0.1, empresa: 0.1 } },
  { id: "ade-um",          nombre: "Administración y Dir. Empresas (UMU)", uni: "UMU", rama: "Sociales", notaCorte:  9.500, pond: { matematicasccss: 0.2, matematicas2: 0.2, empresa: 0.2 } },
  { id: "ade-upct",        nombre: "Administración y Dir. Empresas (UPCT)", uni: "UPCT", rama: "Sociales", notaCorte: 6.500, pond: { matematicasccss: 0.2, matematicas2: 0.2, empresa: 0.2 } },
  { id: "economia-um",     nombre: "Economía (UMU)",                     uni: "UMU",  rama: "Sociales",   notaCorte:  7.500, pond: { matematicasccss: 0.2, matematicas2: 0.2, empresa: 0.2 } },
  { id: "primaria-um",     nombre: "Educación Primaria (UMU)",           uni: "UMU",  rama: "Sociales",   notaCorte:  9.300, pond: { biologia: 0.1, matematicasccss: 0.1, geografia: 0.1, filosofia: 0.1, latin2: 0.1, dibujo: 0.1 } },
  { id: "infantil-um",     nombre: "Educación Infantil (UMU)",           uni: "UMU",  rama: "Sociales",   notaCorte:  9.700, pond: { biologia: 0.1, matematicasccss: 0.1, geografia: 0.1, filosofia: 0.1, latin2: 0.1, dibujo: 0.1 } },
  { id: "criminologia-um", nombre: "Criminología (UMU)",                 uni: "UMU",  rama: "Sociales",   notaCorte:  9.000, pond: { biologia: 0.1, latin2: 0.1, filosofia: 0.1, matematicasccss: 0.1 } },
  { id: "trabajosocial-um", nombre: "Trabajo Social (UMU)",              uni: "UMU",  rama: "Sociales",   notaCorte:  8.000, pond: { filosofia: 0.1, latin2: 0.1, matematicasccss: 0.1 } },
  { id: "publicidad-um",   nombre: "Publicidad y RR.PP. (UMU)",          uni: "UMU",  rama: "Sociales",   notaCorte:  9.700, pond: { latin2: 0.2, matematicasccss: 0.1, empresa: 0.2, dibujo: 0.1 } },
  { id: "periodismo-um",   nombre: "Periodismo (UMU)",                   uni: "UMU",  rama: "Sociales",   notaCorte:  9.500, pond: { latin2: 0.2, filosofia: 0.1, matematicasccss: 0.1 } },

  // ===== ARTES Y HUMANIDADES =====
  { id: "historia-um",     nombre: "Historia (UMU)",                     uni: "UMU",  rama: "Humanidades", notaCorte: 5.500, pond: { latin2: 0.2, filosofia: 0.2, geografia: 0.2 } },
  { id: "historia-arte-um", nombre: "Historia del Arte (UMU)",           uni: "UMU",  rama: "Humanidades", notaCorte: 5.500, pond: { latin2: 0.2, filosofia: 0.2, geografia: 0.2, dibujo: 0.1 } },
  { id: "filologia-um",    nombre: "Filología Hispánica (UMU)",          uni: "UMU",  rama: "Humanidades", notaCorte: 5.000, pond: { latin2: 0.2, filosofia: 0.2 } },
  { id: "ingles-um",       nombre: "Estudios Ingleses (UMU)",            uni: "UMU",  rama: "Humanidades", notaCorte: 7.300, pond: { latin2: 0.2, filosofia: 0.1, frances: 0.1 } },
  { id: "filosofia-um",    nombre: "Filosofía (UMU)",                    uni: "UMU",  rama: "Humanidades", notaCorte: 5.000, pond: { latin2: 0.2, filosofia: 0.2 } },
  { id: "bellasartes-um",  nombre: "Bellas Artes (UMU)",                 uni: "UMU",  rama: "Artes",      notaCorte:  7.500, pond: { dibujo: 0.2, arte: 0.2, latin2: 0.1 } },

  // =====================================================================
  //  ===== UNIVERSIDADES DE TODA ESPAÑA =====
  //  Notas de corte aproximadas (curso 2024/25) y ponderaciones típicas.
  //  Verifica siempre en la web oficial de cada universidad.
  // =====================================================================

  // ===== MADRID — UCM, UAM, UC3M, UPM, URJC, UAH =====
  { id: "medicina-ucm",    nombre: "Medicina (UCM)",                          uni: "UCM",  rama: "Salud",      notaCorte: 13.158, pond: { biologia: 0.2, quimica: 0.2, fisica: 0.2, matematicas2: 0.2 } },
  { id: "medicina-uam",    nombre: "Medicina (UAM)",                          uni: "UAM",  rama: "Salud",      notaCorte: 13.094, pond: { biologia: 0.2, quimica: 0.2, fisica: 0.2, matematicas2: 0.2 } },
  { id: "medicina-uah",    nombre: "Medicina (UAH)",                          uni: "UAH",  rama: "Salud",      notaCorte: 12.890, pond: { biologia: 0.2, quimica: 0.2, fisica: 0.2 } },
  { id: "medicina-urjc",   nombre: "Medicina (URJC)",                         uni: "URJC", rama: "Salud",      notaCorte: 12.873, pond: { biologia: 0.2, quimica: 0.2, fisica: 0.2 } },
  { id: "enfermeria-ucm",  nombre: "Enfermería (UCM)",                        uni: "UCM",  rama: "Salud",      notaCorte: 12.150, pond: { biologia: 0.2, quimica: 0.2 } },
  { id: "fisio-ucm",       nombre: "Fisioterapia (UCM)",                      uni: "UCM",  rama: "Salud",      notaCorte: 12.300, pond: { biologia: 0.2, quimica: 0.2 } },
  { id: "psicologia-ucm",  nombre: "Psicología (UCM)",                        uni: "UCM",  rama: "Salud",      notaCorte: 11.700, pond: { biologia: 0.2, matematicas2: 0.2, matematicasccss: 0.2, filosofia: 0.1 } },
  { id: "psicologia-uam",  nombre: "Psicología (UAM)",                        uni: "UAM",  rama: "Salud",      notaCorte: 11.530, pond: { biologia: 0.2, matematicas2: 0.2, matematicasccss: 0.2, filosofia: 0.1 } },
  { id: "odontologia-ucm", nombre: "Odontología (UCM)",                       uni: "UCM",  rama: "Salud",      notaCorte: 12.380, pond: { biologia: 0.2, quimica: 0.2, fisica: 0.1 } },
  { id: "veterinaria-ucm", nombre: "Veterinaria (UCM)",                       uni: "UCM",  rama: "Salud",      notaCorte: 12.150, pond: { biologia: 0.2, quimica: 0.2, fisica: 0.1, matematicas2: 0.1 } },
  { id: "farmacia-ucm",    nombre: "Farmacia (UCM)",                          uni: "UCM",  rama: "Salud",      notaCorte: 11.000, pond: { biologia: 0.2, quimica: 0.2, fisica: 0.1, matematicas2: 0.1 } },
  { id: "biotec-uam",      nombre: "Biotecnología (UAM)",                     uni: "UAM",  rama: "Ciencias",   notaCorte: 12.985, pond: { biologia: 0.2, quimica: 0.2, fisica: 0.1, matematicas2: 0.1 } },
  { id: "bioquimica-ucm",  nombre: "Bioquímica (UCM)",                        uni: "UCM",  rama: "Ciencias",   notaCorte: 12.420, pond: { biologia: 0.2, quimica: 0.2, fisica: 0.1, matematicas2: 0.1 } },
  { id: "matematicas-ucm", nombre: "Matemáticas (UCM)",                       uni: "UCM",  rama: "Ciencias",   notaCorte: 11.020, pond: { matematicas2: 0.2, fisica: 0.2, quimica: 0.1 } },
  { id: "fisica-ucm",      nombre: "Física (UCM)",                            uni: "UCM",  rama: "Ciencias",   notaCorte: 11.620, pond: { matematicas2: 0.2, fisica: 0.2, quimica: 0.1 } },
  { id: "fisica-uam",      nombre: "Física (UAM)",                            uni: "UAM",  rama: "Ciencias",   notaCorte: 12.130, pond: { matematicas2: 0.2, fisica: 0.2, quimica: 0.1 } },
  { id: "informatica-uam", nombre: "Ingeniería Informática (UAM)",            uni: "UAM",  rama: "Ingeniería", notaCorte: 11.500, pond: { matematicas2: 0.2, fisica: 0.2, tecnologia: 0.1 } },
  { id: "informatica-uc3m", nombre: "Ingeniería Informática (UC3M)",          uni: "UC3M", rama: "Ingeniería", notaCorte: 12.150, pond: { matematicas2: 0.2, fisica: 0.2, tecnologia: 0.1 } },
  { id: "aero-upm",        nombre: "Ingeniería Aeroespacial (UPM)",           uni: "UPM",  rama: "Ingeniería", notaCorte: 12.610, pond: { matematicas2: 0.2, fisica: 0.2, dibujo: 0.1, quimica: 0.1, tecnologia: 0.2 } },
  { id: "telecom-upm",     nombre: "Ingeniería de Telecomunicación (UPM)",    uni: "UPM",  rama: "Ingeniería", notaCorte: 11.000, pond: { matematicas2: 0.2, fisica: 0.2, dibujo: 0.1, quimica: 0.1, tecnologia: 0.2 } },
  { id: "industriales-upm", nombre: "Ing. Tecnologías Industriales (UPM)",    uni: "UPM",  rama: "Ingeniería", notaCorte: 12.230, pond: { matematicas2: 0.2, fisica: 0.2, dibujo: 0.1, quimica: 0.1, tecnologia: 0.2 } },
  { id: "arquitectura-upm", nombre: "Fundamentos de Arquitectura (UPM)",      uni: "UPM",  rama: "Ingeniería", notaCorte: 11.610, pond: { matematicas2: 0.2, fisica: 0.2, dibujo: 0.2, arte: 0.1 } },
  { id: "ade-uc3m",        nombre: "Administración y Dir. Empresas (UC3M)",   uni: "UC3M", rama: "Sociales",   notaCorte: 11.420, pond: { matematicasccss: 0.2, matematicas2: 0.2, empresa: 0.2 } },
  { id: "ade-ucm",         nombre: "Administración y Dir. Empresas (UCM)",    uni: "UCM",  rama: "Sociales",   notaCorte: 10.500, pond: { matematicasccss: 0.2, matematicas2: 0.2, empresa: 0.2 } },
  { id: "economia-uc3m",   nombre: "Economía (UC3M)",                         uni: "UC3M", rama: "Sociales",   notaCorte: 11.120, pond: { matematicasccss: 0.2, matematicas2: 0.2, empresa: 0.2 } },
  { id: "derecho-uc3m",    nombre: "Derecho (UC3M)",                          uni: "UC3M", rama: "Sociales",   notaCorte:  9.860, pond: { latin2: 0.2, filosofia: 0.1, matematicasccss: 0.1, geografia: 0.1, empresa: 0.1 } },
  { id: "derecho-ucm",     nombre: "Derecho (UCM)",                           uni: "UCM",  rama: "Sociales",   notaCorte:  9.500, pond: { latin2: 0.2, filosofia: 0.1, matematicasccss: 0.1, geografia: 0.1, empresa: 0.1 } },
  { id: "rrii-uc3m",       nombre: "Estudios Internacionales (UC3M)",         uni: "UC3M", rama: "Sociales",   notaCorte: 12.200, pond: { latin2: 0.2, matematicasccss: 0.2, geografia: 0.2, empresa: 0.1 } },
  { id: "rrii-urjc",       nombre: "Relaciones Internacionales (URJC)",       uni: "URJC", rama: "Sociales",   notaCorte: 11.500, pond: { latin2: 0.2, matematicasccss: 0.2, geografia: 0.2 } },
  { id: "periodismo-ucm",  nombre: "Periodismo (UCM)",                        uni: "UCM",  rama: "Sociales",   notaCorte: 10.800, pond: { latin2: 0.2, filosofia: 0.1, matematicasccss: 0.1 } },
  { id: "comunicacion-ucm", nombre: "Comunicación Audiovisual (UCM)",         uni: "UCM",  rama: "Sociales",   notaCorte: 11.000, pond: { latin2: 0.2, arte: 0.2, dibujo: 0.1 } },
  { id: "primaria-ucm",    nombre: "Educación Primaria (UCM)",                uni: "UCM",  rama: "Sociales",   notaCorte:  9.800, pond: { biologia: 0.1, matematicasccss: 0.1, geografia: 0.1, filosofia: 0.1, latin2: 0.1, dibujo: 0.1 } },
  { id: "infantil-ucm",    nombre: "Educación Infantil (UCM)",                uni: "UCM",  rama: "Sociales",   notaCorte:  9.500, pond: { biologia: 0.1, matematicasccss: 0.1, geografia: 0.1, filosofia: 0.1, latin2: 0.1, dibujo: 0.1 } },
  { id: "criminologia-ucm", nombre: "Criminología (UCM)",                     uni: "UCM",  rama: "Sociales",   notaCorte: 11.000, pond: { biologia: 0.1, latin2: 0.1, filosofia: 0.1, matematicasccss: 0.1 } },
  { id: "filosofia-ucm",   nombre: "Filosofía (UCM)",                         uni: "UCM",  rama: "Humanidades", notaCorte: 5.000, pond: { latin2: 0.2, filosofia: 0.2 } },
  { id: "historia-ucm",    nombre: "Historia (UCM)",                          uni: "UCM",  rama: "Humanidades", notaCorte: 6.500, pond: { latin2: 0.2, filosofia: 0.2, geografia: 0.2 } },
  { id: "bellasartes-ucm", nombre: "Bellas Artes (UCM)",                      uni: "UCM",  rama: "Artes",      notaCorte:  9.000, pond: { dibujo: 0.2, arte: 0.2, latin2: 0.1 } },

  // ===== CATALUÑA — UB, UAB, UPC, UPF =====
  { id: "medicina-ub",     nombre: "Medicina (UB)",                           uni: "UB",   rama: "Salud",      notaCorte: 13.198, pond: { biologia: 0.2, quimica: 0.2, fisica: 0.2, matematicas2: 0.2 } },
  { id: "medicina-uab",    nombre: "Medicina (UAB)",                          uni: "UAB",  rama: "Salud",      notaCorte: 13.318, pond: { biologia: 0.2, quimica: 0.2, fisica: 0.2, matematicas2: 0.2 } },
  { id: "medicina-upf",    nombre: "Medicina (UPF-UAB)",                      uni: "UPF",  rama: "Salud",      notaCorte: 13.380, pond: { biologia: 0.2, quimica: 0.2, fisica: 0.2, matematicas2: 0.2 } },
  { id: "enfermeria-ub",   nombre: "Enfermería (UB)",                         uni: "UB",   rama: "Salud",      notaCorte: 11.610, pond: { biologia: 0.2, quimica: 0.2 } },
  { id: "fisio-ub",        nombre: "Fisioterapia (UB)",                       uni: "UB",   rama: "Salud",      notaCorte: 12.150, pond: { biologia: 0.2, quimica: 0.2 } },
  { id: "psicologia-ub",   nombre: "Psicología (UB)",                         uni: "UB",   rama: "Salud",      notaCorte: 11.428, pond: { biologia: 0.2, matematicas2: 0.2, matematicasccss: 0.2 } },
  { id: "biotec-ub",       nombre: "Biotecnología (UB)",                      uni: "UB",   rama: "Ciencias",   notaCorte: 12.700, pond: { biologia: 0.2, quimica: 0.2, fisica: 0.1, matematicas2: 0.1 } },
  { id: "biomedicina-ub",  nombre: "Ciencias Biomédicas (UB)",                uni: "UB",   rama: "Ciencias",   notaCorte: 12.530, pond: { biologia: 0.2, quimica: 0.2, fisica: 0.1, matematicas2: 0.1 } },
  { id: "fisica-ub",       nombre: "Física (UB)",                             uni: "UB",   rama: "Ciencias",   notaCorte: 12.030, pond: { matematicas2: 0.2, fisica: 0.2, quimica: 0.1 } },
  { id: "matematicas-ub",  nombre: "Matemáticas (UB)",                        uni: "UB",   rama: "Ciencias",   notaCorte: 12.460, pond: { matematicas2: 0.2, fisica: 0.2, quimica: 0.1 } },
  { id: "aero-upc",        nombre: "Ingeniería Aeroespacial (UPC)",           uni: "UPC",  rama: "Ingeniería", notaCorte: 12.658, pond: { matematicas2: 0.2, fisica: 0.2, dibujo: 0.1, tecnologia: 0.2 } },
  { id: "informatica-upc", nombre: "Ingeniería Informática (UPC)",            uni: "UPC",  rama: "Ingeniería", notaCorte: 11.500, pond: { matematicas2: 0.2, fisica: 0.2, tecnologia: 0.1 } },
  { id: "telecom-upc",     nombre: "Ingeniería de Telecomunicación (UPC)",    uni: "UPC",  rama: "Ingeniería", notaCorte: 10.500, pond: { matematicas2: 0.2, fisica: 0.2, tecnologia: 0.2, dibujo: 0.1 } },
  { id: "ade-upf",         nombre: "Administración y Dir. Empresas (UPF)",    uni: "UPF",  rama: "Sociales",   notaCorte: 12.026, pond: { matematicasccss: 0.2, matematicas2: 0.2, empresa: 0.2 } },
  { id: "economia-upf",    nombre: "Economía (UPF)",                          uni: "UPF",  rama: "Sociales",   notaCorte: 11.700, pond: { matematicasccss: 0.2, matematicas2: 0.2, empresa: 0.2 } },
  { id: "derecho-upf",     nombre: "Derecho (UPF)",                           uni: "UPF",  rama: "Sociales",   notaCorte: 10.800, pond: { latin2: 0.2, filosofia: 0.1, matematicasccss: 0.1 } },
  { id: "rrii-upf",        nombre: "Relaciones Internacionales (UPF)",        uni: "UPF",  rama: "Sociales",   notaCorte: 12.500, pond: { latin2: 0.2, matematicasccss: 0.2, geografia: 0.2 } },
  { id: "criminologia-upf", nombre: "Criminología (UPF)",                     uni: "UPF",  rama: "Sociales",   notaCorte: 11.730, pond: { biologia: 0.1, latin2: 0.1, filosofia: 0.1, matematicasccss: 0.1 } },

  // ===== VALENCIA — UV, UPV, UA =====
  { id: "medicina-uv",     nombre: "Medicina (UV)",                           uni: "UV",   rama: "Salud",      notaCorte: 13.080, pond: { biologia: 0.2, quimica: 0.2, fisica: 0.2, matematicas2: 0.2 } },
  { id: "medicina-umh",    nombre: "Medicina (UMH-Elche)",                    uni: "UMH",  rama: "Salud",      notaCorte: 12.890, pond: { biologia: 0.2, quimica: 0.2, fisica: 0.2 } },
  { id: "fisio-uv",        nombre: "Fisioterapia (UV)",                       uni: "UV",   rama: "Salud",      notaCorte: 12.450, pond: { biologia: 0.2, quimica: 0.2 } },
  { id: "psicologia-uv",   nombre: "Psicología (UV)",                         uni: "UV",   rama: "Salud",      notaCorte: 11.730, pond: { biologia: 0.2, matematicasccss: 0.2, matematicas2: 0.2 } },
  { id: "veterinaria-cv",  nombre: "Veterinaria (CEU-Cardenal Herrera)",      uni: "CEU",  rama: "Salud",      notaCorte: 11.000, pond: { biologia: 0.2, quimica: 0.2 } },
  { id: "biotec-upv",      nombre: "Biotecnología (UPV)",                     uni: "UPV",  rama: "Ciencias",   notaCorte: 12.860, pond: { biologia: 0.2, quimica: 0.2, fisica: 0.1, matematicas2: 0.1 } },
  { id: "aero-upv",        nombre: "Ingeniería Aeroespacial (UPV)",           uni: "UPV",  rama: "Ingeniería", notaCorte: 12.748, pond: { matematicas2: 0.2, fisica: 0.2, dibujo: 0.1, tecnologia: 0.2 } },
  { id: "informatica-upv", nombre: "Ingeniería Informática (UPV)",            uni: "UPV",  rama: "Ingeniería", notaCorte: 10.700, pond: { matematicas2: 0.2, fisica: 0.2, tecnologia: 0.1 } },
  { id: "telecom-upv",     nombre: "Ingeniería de Telecomunicación (UPV)",    uni: "UPV",  rama: "Ingeniería", notaCorte: 10.230, pond: { matematicas2: 0.2, fisica: 0.2, tecnologia: 0.2 } },
  { id: "ade-uv",          nombre: "Administración y Dir. Empresas (UV)",     uni: "UV",   rama: "Sociales",   notaCorte: 10.450, pond: { matematicasccss: 0.2, matematicas2: 0.2, empresa: 0.2 } },
  { id: "derecho-uv",      nombre: "Derecho (UV)",                            uni: "UV",   rama: "Sociales",   notaCorte:  9.300, pond: { latin2: 0.2, filosofia: 0.1, matematicasccss: 0.1 } },

  // ===== ANDALUCÍA — UGR, US, UPO, UMA, UCO, UAL, UCA, UJA, UHU =====
  { id: "medicina-ugr",    nombre: "Medicina (UGR)",                          uni: "UGR",  rama: "Salud",      notaCorte: 12.910, pond: { biologia: 0.2, quimica: 0.2, fisica: 0.2, matematicas2: 0.2 } },
  { id: "medicina-us",     nombre: "Medicina (US)",                           uni: "US",   rama: "Salud",      notaCorte: 12.890, pond: { biologia: 0.2, quimica: 0.2, fisica: 0.2, matematicas2: 0.2 } },
  { id: "medicina-uma",    nombre: "Medicina (UMA)",                          uni: "UMA",  rama: "Salud",      notaCorte: 12.910, pond: { biologia: 0.2, quimica: 0.2, fisica: 0.2 } },
  { id: "medicina-uco",    nombre: "Medicina (UCO)",                          uni: "UCO",  rama: "Salud",      notaCorte: 12.890, pond: { biologia: 0.2, quimica: 0.2, fisica: 0.2 } },
  { id: "medicina-uca",    nombre: "Medicina (UCA)",                          uni: "UCA",  rama: "Salud",      notaCorte: 12.870, pond: { biologia: 0.2, quimica: 0.2, fisica: 0.2 } },
  { id: "fisio-ugr",       nombre: "Fisioterapia (UGR)",                      uni: "UGR",  rama: "Salud",      notaCorte: 12.550, pond: { biologia: 0.2, quimica: 0.2 } },
  { id: "odontologia-ugr", nombre: "Odontología (UGR)",                       uni: "UGR",  rama: "Salud",      notaCorte: 12.350, pond: { biologia: 0.2, quimica: 0.2, fisica: 0.1 } },
  { id: "psicologia-ugr",  nombre: "Psicología (UGR)",                        uni: "UGR",  rama: "Salud",      notaCorte: 11.500, pond: { biologia: 0.2, matematicas2: 0.2, matematicasccss: 0.2 } },
  { id: "veterinaria-uco", nombre: "Veterinaria (UCO)",                       uni: "UCO",  rama: "Salud",      notaCorte: 11.350, pond: { biologia: 0.2, quimica: 0.2, fisica: 0.1 } },
  { id: "biotec-ugr",      nombre: "Biotecnología (UGR)",                     uni: "UGR",  rama: "Ciencias",   notaCorte: 12.250, pond: { biologia: 0.2, quimica: 0.2, fisica: 0.1, matematicas2: 0.1 } },
  { id: "aero-us",         nombre: "Ingeniería Aeroespacial (US)",            uni: "US",   rama: "Ingeniería", notaCorte: 12.190, pond: { matematicas2: 0.2, fisica: 0.2, dibujo: 0.1, tecnologia: 0.2 } },
  { id: "informatica-ugr", nombre: "Ingeniería Informática (UGR)",            uni: "UGR",  rama: "Ingeniería", notaCorte: 10.500, pond: { matematicas2: 0.2, fisica: 0.2, tecnologia: 0.1 } },
  { id: "telecom-us",      nombre: "Ingeniería de Telecomunicación (US)",     uni: "US",   rama: "Ingeniería", notaCorte:  9.500, pond: { matematicas2: 0.2, fisica: 0.2, tecnologia: 0.2 } },
  { id: "ade-ugr",         nombre: "Administración y Dir. Empresas (UGR)",    uni: "UGR",  rama: "Sociales",   notaCorte:  9.700, pond: { matematicasccss: 0.2, matematicas2: 0.2, empresa: 0.2 } },
  { id: "derecho-us",      nombre: "Derecho (US)",                            uni: "US",   rama: "Sociales",   notaCorte:  8.500, pond: { latin2: 0.2, filosofia: 0.1, matematicasccss: 0.1 } },
  { id: "criminologia-upo", nombre: "Criminología (UPO)",                     uni: "UPO",  rama: "Sociales",   notaCorte: 10.500, pond: { biologia: 0.1, latin2: 0.1, filosofia: 0.1, matematicasccss: 0.1 } },

  // ===== PAÍS VASCO — UPV/EHU =====
  { id: "medicina-ehu",    nombre: "Medicina (UPV/EHU)",                      uni: "EHU",  rama: "Salud",      notaCorte: 13.302, pond: { biologia: 0.2, quimica: 0.2, fisica: 0.2, matematicas2: 0.2 } },
  { id: "enfermeria-ehu",  nombre: "Enfermería (UPV/EHU)",                    uni: "EHU",  rama: "Salud",      notaCorte: 12.000, pond: { biologia: 0.2, quimica: 0.2 } },
  { id: "biotec-ehu",      nombre: "Biotecnología (UPV/EHU)",                 uni: "EHU",  rama: "Ciencias",   notaCorte: 12.420, pond: { biologia: 0.2, quimica: 0.2, fisica: 0.1, matematicas2: 0.1 } },
  { id: "informatica-ehu", nombre: "Ingeniería Informática (UPV/EHU)",        uni: "EHU",  rama: "Ingeniería", notaCorte:  9.800, pond: { matematicas2: 0.2, fisica: 0.2, tecnologia: 0.1 } },
  { id: "ade-ehu",         nombre: "Administración y Dir. Empresas (UPV/EHU)", uni: "EHU", rama: "Sociales",   notaCorte:  9.500, pond: { matematicasccss: 0.2, matematicas2: 0.2, empresa: 0.2 } },

  // ===== GALICIA — USC, UDC, UVigo =====
  { id: "medicina-usc",    nombre: "Medicina (USC)",                          uni: "USC",  rama: "Salud",      notaCorte: 12.998, pond: { biologia: 0.2, quimica: 0.2, fisica: 0.2, matematicas2: 0.2 } },
  { id: "fisio-usc",       nombre: "Fisioterapia (USC)",                      uni: "USC",  rama: "Salud",      notaCorte: 11.700, pond: { biologia: 0.2, quimica: 0.2 } },
  { id: "veterinaria-usc", nombre: "Veterinaria (USC-Lugo)",                  uni: "USC",  rama: "Salud",      notaCorte: 11.450, pond: { biologia: 0.2, quimica: 0.2, fisica: 0.1 } },
  { id: "informatica-udc", nombre: "Ingeniería Informática (UDC)",            uni: "UDC",  rama: "Ingeniería", notaCorte:  9.000, pond: { matematicas2: 0.2, fisica: 0.2, tecnologia: 0.1 } },

  // ===== ARAGÓN — UNIZAR =====
  { id: "medicina-uz",     nombre: "Medicina (UNIZAR)",                       uni: "UNIZAR", rama: "Salud",    notaCorte: 12.870, pond: { biologia: 0.2, quimica: 0.2, fisica: 0.2 } },
  { id: "veterinaria-uz",  nombre: "Veterinaria (UNIZAR)",                    uni: "UNIZAR", rama: "Salud",    notaCorte: 11.300, pond: { biologia: 0.2, quimica: 0.2, fisica: 0.1 } },
  { id: "informatica-uz",  nombre: "Ingeniería Informática (UNIZAR)",         uni: "UNIZAR", rama: "Ingeniería", notaCorte: 9.500, pond: { matematicas2: 0.2, fisica: 0.2, tecnologia: 0.1 } },
  { id: "ade-uz",          nombre: "Administración y Dir. Empresas (UNIZAR)", uni: "UNIZAR", rama: "Sociales", notaCorte:  9.000, pond: { matematicasccss: 0.2, matematicas2: 0.2, empresa: 0.2 } },

  // ===== CASTILLA Y LEÓN — USAL, UVA, UBU, ULE =====
  { id: "medicina-usal",   nombre: "Medicina (USAL)",                         uni: "USAL", rama: "Salud",      notaCorte: 12.870, pond: { biologia: 0.2, quimica: 0.2, fisica: 0.2 } },
  { id: "medicina-uva",    nombre: "Medicina (UVa)",                          uni: "UVA",  rama: "Salud",      notaCorte: 12.860, pond: { biologia: 0.2, quimica: 0.2, fisica: 0.2 } },
  { id: "derecho-usal",    nombre: "Derecho (USAL)",                          uni: "USAL", rama: "Sociales",   notaCorte:  8.500, pond: { latin2: 0.2, filosofia: 0.1, matematicasccss: 0.1 } },
  { id: "filologia-usal",  nombre: "Filología Hispánica (USAL)",              uni: "USAL", rama: "Humanidades", notaCorte: 5.000, pond: { latin2: 0.2, filosofia: 0.2 } },

  // ===== ASTURIAS, CANTABRIA, NAVARRA, LA RIOJA =====
  { id: "medicina-uniovi", nombre: "Medicina (Univ. de Oviedo)",              uni: "UNIOVI", rama: "Salud",    notaCorte: 12.890, pond: { biologia: 0.2, quimica: 0.2, fisica: 0.2 } },
  { id: "medicina-unican", nombre: "Medicina (Univ. de Cantabria)",           uni: "UNICAN", rama: "Salud",    notaCorte: 12.910, pond: { biologia: 0.2, quimica: 0.2, fisica: 0.2 } },
  { id: "medicina-unavarra", nombre: "Medicina (UPNA)",                       uni: "UPNA", rama: "Salud",      notaCorte: 12.980, pond: { biologia: 0.2, quimica: 0.2, fisica: 0.2 } },
  { id: "medicina-unav",   nombre: "Medicina (Univ. de Navarra, privada)",    uni: "UNAV", rama: "Salud",      notaCorte: 12.000, pond: { biologia: 0.2, quimica: 0.2 } },
  { id: "ade-unav",        nombre: "Administración y Dir. Empresas (UNAV)",   uni: "UNAV", rama: "Sociales",   notaCorte:  9.500, pond: { matematicasccss: 0.2, matematicas2: 0.2, empresa: 0.2 } },

  // ===== CASTILLA-LA MANCHA, EXTREMADURA, ISLAS, OTRAS =====
  { id: "medicina-uclm",   nombre: "Medicina (UCLM)",                         uni: "UCLM", rama: "Salud",      notaCorte: 12.870, pond: { biologia: 0.2, quimica: 0.2, fisica: 0.2 } },
  { id: "medicina-uex",    nombre: "Medicina (UEx)",                          uni: "UEX",  rama: "Salud",      notaCorte: 12.860, pond: { biologia: 0.2, quimica: 0.2, fisica: 0.2 } },
  { id: "medicina-ull",    nombre: "Medicina (Univ. de La Laguna)",           uni: "ULL",  rama: "Salud",      notaCorte: 12.870, pond: { biologia: 0.2, quimica: 0.2, fisica: 0.2 } },
  { id: "medicina-ulpgc",  nombre: "Medicina (Univ. Las Palmas GC)",          uni: "ULPGC", rama: "Salud",     notaCorte: 12.850, pond: { biologia: 0.2, quimica: 0.2, fisica: 0.2 } },
  { id: "medicina-uib",    nombre: "Medicina (Univ. Illes Balears)",          uni: "UIB",  rama: "Salud",      notaCorte: 12.870, pond: { biologia: 0.2, quimica: 0.2, fisica: 0.2 } },

  // =====================================================================
  //  ===== DOBLES GRADOS (los más demandados de España) =====
  // =====================================================================
  { id: "doble-mat-fis-ucm",    nombre: "Doble Grado Matemáticas + Física (UCM)",         uni: "UCM",  rama: "Ciencias",   notaCorte: 13.310, pond: { matematicas2: 0.2, fisica: 0.2, quimica: 0.1 } },
  { id: "doble-mat-fis-uam",    nombre: "Doble Grado Matemáticas + Física (UAM)",         uni: "UAM",  rama: "Ciencias",   notaCorte: 13.498, pond: { matematicas2: 0.2, fisica: 0.2, quimica: 0.1 } },
  { id: "doble-mat-fis-ub",     nombre: "Doble Grado Matemáticas + Física (UB)",          uni: "UB",   rama: "Ciencias",   notaCorte: 13.546, pond: { matematicas2: 0.2, fisica: 0.2, quimica: 0.1 } },
  { id: "doble-mat-fis-uab",    nombre: "Doble Grado Matemáticas + Física (UAB)",         uni: "UAB",  rama: "Ciencias",   notaCorte: 13.572, pond: { matematicas2: 0.2, fisica: 0.2, quimica: 0.1 } },
  { id: "doble-mat-fis-usc",    nombre: "Doble Grado Matemáticas + Física (USC)",         uni: "USC",  rama: "Ciencias",   notaCorte: 13.420, pond: { matematicas2: 0.2, fisica: 0.2 } },
  { id: "doble-mat-fis-ehu",    nombre: "Doble Grado Matemáticas + Física (UPV/EHU)",     uni: "EHU",  rama: "Ciencias",   notaCorte: 13.470, pond: { matematicas2: 0.2, fisica: 0.2 } },
  { id: "doble-mat-info-uam",   nombre: "Doble Grado Matemáticas + Informática (UAM)",    uni: "UAM",  rama: "Ciencias",   notaCorte: 13.450, pond: { matematicas2: 0.2, fisica: 0.2, tecnologia: 0.1 } },
  { id: "doble-mat-info-ucm",   nombre: "Doble Grado Matemáticas + Ing. Informática (UCM)", uni: "UCM", rama: "Ciencias", notaCorte: 13.220, pond: { matematicas2: 0.2, fisica: 0.2, tecnologia: 0.1 } },
  { id: "doble-mat-economia-uc3m", nombre: "Doble Grado Matemáticas + Economía (UC3M)",   uni: "UC3M", rama: "Ciencias",   notaCorte: 13.120, pond: { matematicas2: 0.2, matematicasccss: 0.2, empresa: 0.2 } },
  { id: "doble-fis-mat-uc3m",   nombre: "Doble Grado Física + Matemáticas (UC3M)",        uni: "UC3M", rama: "Ciencias",   notaCorte: 13.030, pond: { matematicas2: 0.2, fisica: 0.2 } },
  { id: "doble-bio-bioq-uam",   nombre: "Doble Grado Biología + Bioquímica (UAM)",        uni: "UAM",  rama: "Ciencias",   notaCorte: 13.290, pond: { biologia: 0.2, quimica: 0.2 } },
  { id: "doble-biotec-bioq-uam", nombre: "Doble Grado Biotecnología + Bioquímica (UAM)",  uni: "UAM",  rama: "Ciencias",   notaCorte: 13.260, pond: { biologia: 0.2, quimica: 0.2, fisica: 0.1 } },
  { id: "doble-ing-fis-mat-uam", nombre: "Doble Grado Ing. Informática + Matemáticas (UAM)", uni: "UAM", rama: "Ciencias", notaCorte: 13.380, pond: { matematicas2: 0.2, fisica: 0.2, tecnologia: 0.1 } },
  { id: "doble-derecho-ade-uc3m", nombre: "Doble Grado Derecho + ADE (UC3M)",             uni: "UC3M", rama: "Sociales",   notaCorte: 12.880, pond: { matematicasccss: 0.2, matematicas2: 0.2, latin2: 0.2, empresa: 0.2 } },
  { id: "doble-derecho-ade-ucm", nombre: "Doble Grado Derecho + ADE (UCM)",               uni: "UCM",  rama: "Sociales",   notaCorte: 12.500, pond: { matematicasccss: 0.2, matematicas2: 0.2, latin2: 0.2, empresa: 0.2 } },
  { id: "doble-derecho-ade-uam", nombre: "Doble Grado Derecho + ADE (UAM)",               uni: "UAM",  rama: "Sociales",   notaCorte: 12.620, pond: { matematicasccss: 0.2, matematicas2: 0.2, latin2: 0.2, empresa: 0.2 } },
  { id: "doble-derecho-ade-um", nombre: "Doble Grado Derecho + ADE (UMU)",                uni: "UMU",  rama: "Sociales",   notaCorte: 11.500, pond: { matematicasccss: 0.2, matematicas2: 0.2, latin2: 0.2, empresa: 0.2 } },
  { id: "doble-derecho-ade-ub", nombre: "Doble Grado Derecho + ADE (UB)",                 uni: "UB",   rama: "Sociales",   notaCorte: 12.388, pond: { matematicasccss: 0.2, matematicas2: 0.2, latin2: 0.2, empresa: 0.2 } },
  { id: "doble-derecho-rrii-uc3m", nombre: "Doble Grado Derecho + Rel. Internacionales (UC3M)", uni: "UC3M", rama: "Sociales", notaCorte: 12.700, pond: { latin2: 0.2, matematicasccss: 0.2, geografia: 0.2 } },
  { id: "doble-derecho-cienciaspol-ucm", nombre: "Doble Grado Derecho + Ciencias Políticas (UCM)", uni: "UCM", rama: "Sociales", notaCorte: 12.180, pond: { latin2: 0.2, filosofia: 0.2, geografia: 0.2 } },
  { id: "doble-economia-derecho-upf", nombre: "Doble Grado Economía + Derecho (UPF)",     uni: "UPF",  rama: "Sociales",   notaCorte: 12.890, pond: { matematicasccss: 0.2, matematicas2: 0.2, empresa: 0.2, latin2: 0.2 } },
  { id: "doble-economia-rrii-uc3m", nombre: "Doble Grado Economía + Rel. Internacionales (UC3M)", uni: "UC3M", rama: "Sociales", notaCorte: 12.500, pond: { matematicasccss: 0.2, matematicas2: 0.2, geografia: 0.2 } },
  { id: "doble-ade-derecho-icade", nombre: "Doble Grado ADE + Derecho — E-3 (ICADE-Comillas)", uni: "ICADE", rama: "Sociales", notaCorte: 12.500, pond: { matematicasccss: 0.2, matematicas2: 0.2, latin2: 0.2, empresa: 0.2 } },
  { id: "doble-ade-rrii-icade", nombre: "Doble Grado ADE + Rel. Internacionales — E-4 (ICADE)", uni: "ICADE", rama: "Sociales", notaCorte: 12.300, pond: { matematicasccss: 0.2, matematicas2: 0.2, geografia: 0.2 } },
  { id: "doble-fil-periodismo-ucm", nombre: "Doble Grado Filosofía + Periodismo (UCM)",   uni: "UCM",  rama: "Humanidades", notaCorte: 11.700, pond: { latin2: 0.2, filosofia: 0.2 } },
  { id: "doble-publi-marketing-um", nombre: "Doble Grado Publicidad + Marketing (UMU)",   uni: "UMU",  rama: "Sociales",   notaCorte: 10.800, pond: { latin2: 0.2, empresa: 0.2, matematicasccss: 0.1 } },
  { id: "doble-info-ade-uc3m",  nombre: "Doble Grado Ing. Informática + ADE (UC3M)",      uni: "UC3M", rama: "Ingeniería", notaCorte: 12.870, pond: { matematicas2: 0.2, fisica: 0.2, empresa: 0.2 } },
  { id: "doble-info-ade-uam",   nombre: "Doble Grado Ing. Informática + ADE (UAM)",       uni: "UAM",  rama: "Ingeniería", notaCorte: 12.500, pond: { matematicas2: 0.2, fisica: 0.2, empresa: 0.2 } },
  { id: "doble-tele-ade-uc3m",  nombre: "Doble Grado Ing. Sist. Comunicaciones + ADE (UC3M)", uni: "UC3M", rama: "Ingeniería", notaCorte: 11.880, pond: { matematicas2: 0.2, fisica: 0.2, empresa: 0.2 } },
  { id: "doble-aero-mecan-upm", nombre: "Doble Grado Ing. Aeroespacial + Mecánica (UPM)", uni: "UPM",  rama: "Ingeniería", notaCorte: 12.770, pond: { matematicas2: 0.2, fisica: 0.2, dibujo: 0.1, tecnologia: 0.2 } },
  { id: "doble-info-mat-um",    nombre: "Doble Grado Ing. Informática + Matemáticas (UMU)", uni: "UMU", rama: "Ingeniería", notaCorte: 11.500, pond: { matematicas2: 0.2, fisica: 0.2, tecnologia: 0.1 } },
  { id: "doble-bio-quim-um",    nombre: "Doble Grado Biología + Bioquímica (UMU)",        uni: "UMU",  rama: "Ciencias",   notaCorte: 12.000, pond: { biologia: 0.2, quimica: 0.2 } },
  { id: "doble-magisterio-um",  nombre: "Doble Grado Ed. Infantil + Ed. Primaria (UMU)",  uni: "UMU",  rama: "Sociales",   notaCorte: 10.800, pond: { biologia: 0.1, matematicasccss: 0.1, geografia: 0.1, filosofia: 0.1, latin2: 0.1, dibujo: 0.1 } },
  { id: "doble-traduccion-derecho-ucm", nombre: "Doble Grado Traducción + Derecho (UCM)", uni: "UCM",  rama: "Humanidades", notaCorte: 12.200, pond: { latin2: 0.2, filosofia: 0.1 } },
  { id: "doble-historia-arte-um", nombre: "Doble Grado Historia + Historia del Arte (UMU)", uni: "UMU", rama: "Humanidades", notaCorte: 7.500, pond: { latin2: 0.2, filosofia: 0.2, geografia: 0.2 } },

  // ===== AMPLIACIÓN: dobles grados y singles que faltaban =====

  // ----- Sevilla (US) - dobles grados -----
  { id: "doble-historia-arte-us",    nombre: "Doble Grado Historia + Historia del Arte (US)",        uni: "US",   rama: "Humanidades", notaCorte: 11.500, pond: { latin2: 0.2, filosofia: 0.2, geografia: 0.2 } },
  { id: "doble-derecho-ade-us",      nombre: "Doble Grado Derecho + ADE (US)",                       uni: "US",   rama: "Sociales",    notaCorte: 12.300, pond: { matematicasccss: 0.2, empresa: 0.2, latin2: 0.1 } },
  { id: "doble-derecho-fihis-us",    nombre: "Doble Grado Derecho + Filología Hispánica (US)",       uni: "US",   rama: "Humanidades", notaCorte: 10.500, pond: { latin2: 0.2, filosofia: 0.2 } },
  { id: "doble-periodismo-comav-us", nombre: "Doble Grado Periodismo + Comunicación Audiovisual (US)", uni: "US", rama: "Sociales",    notaCorte: 12.000, pond: { latin2: 0.2, filosofia: 0.1 } },
  { id: "doble-mat-fis-us",          nombre: "Doble Grado Matemáticas + Física (US)",                uni: "US",   rama: "Ciencias",    notaCorte: 12.700, pond: { matematicas2: 0.2, fisica: 0.2, quimica: 0.1 } },
  { id: "doble-mat-est-us",          nombre: "Doble Grado Matemáticas + Estadística (US)",           uni: "US",   rama: "Ciencias",    notaCorte: 11.000, pond: { matematicas2: 0.2, fisica: 0.1 } },
  { id: "doble-bio-quim-us",         nombre: "Doble Grado Biología + Química (US)",                  uni: "US",   rama: "Ciencias",    notaCorte: 12.000, pond: { biologia: 0.2, quimica: 0.2, fisica: 0.1 } },
  { id: "doble-fis-quim-us",         nombre: "Doble Grado Física + Química (US)",                    uni: "US",   rama: "Ciencias",    notaCorte: 11.300, pond: { fisica: 0.2, quimica: 0.2, matematicas2: 0.2 } },
  { id: "doble-quim-iqi-us",         nombre: "Doble Grado Química + Ing. Química Industrial (US)",   uni: "US",   rama: "Ingeniería",  notaCorte: 11.500, pond: { quimica: 0.2, matematicas2: 0.2, fisica: 0.2 } },
  { id: "doble-aero-us",             nombre: "Doble Grado Ing. Aeroespacial + Mecánica (US)",        uni: "US",   rama: "Ingeniería",  notaCorte: 12.500, pond: { matematicas2: 0.2, fisica: 0.2, dibujo: 0.1, tecnologia: 0.1 } },
  { id: "doble-edu-frances-us",      nombre: "Doble Grado Ed. Primaria + Estudios Franceses (US)",   uni: "US",   rama: "Sociales",    notaCorte: 10.500, pond: { frances: 0.2, latin2: 0.1, filosofia: 0.1 } },
  { id: "doble-tur-finanzas-us",     nombre: "Doble Grado Turismo + Finanzas y Contabilidad (US)",   uni: "US",   rama: "Sociales",    notaCorte: 10.800, pond: { matematicasccss: 0.2, empresa: 0.2 } },
  { id: "doble-fihis-estu-arabes-us",nombre: "Doble Grado Filología Hispánica + Estudios Árabes (US)", uni: "US", rama: "Humanidades", notaCorte:  8.500, pond: { latin2: 0.2, filosofia: 0.2 } },

  // ----- Sevilla (US) y Pablo de Olavide - dobles relevantes -----
  { id: "doble-derecho-rrii-upo",    nombre: "Doble Grado Derecho + RR.II. (UPO)",                   uni: "UPO",  rama: "Sociales",    notaCorte: 11.700, pond: { latin2: 0.2, geografia: 0.2 } },
  { id: "doble-tasoc-eduso-upo",     nombre: "Doble Grado Trabajo Social + Ed. Social (UPO)",        uni: "UPO",  rama: "Sociales",    notaCorte:  9.300, pond: { filosofia: 0.1, latin2: 0.1, matematicasccss: 0.1 } },
  { id: "doble-derecho-criminol-upo",nombre: "Doble Grado Derecho + Criminología (UPO)",             uni: "UPO",  rama: "Sociales",    notaCorte: 11.000, pond: { latin2: 0.2, filosofia: 0.1 } },

  // ----- Granada (UGR) - dobles grados -----
  { id: "doble-derecho-ade-ugr",     nombre: "Doble Grado Derecho + ADE (UGR)",                      uni: "UGR",  rama: "Sociales",    notaCorte: 12.500, pond: { matematicasccss: 0.2, empresa: 0.2, latin2: 0.1 } },
  { id: "doble-derecho-ccpp-ugr",    nombre: "Doble Grado Derecho + Ciencias Políticas (UGR)",       uni: "UGR",  rama: "Sociales",    notaCorte: 11.500, pond: { latin2: 0.2, filosofia: 0.2 } },
  { id: "doble-mat-fis-ugr",         nombre: "Doble Grado Matemáticas + Física (UGR)",               uni: "UGR",  rama: "Ciencias",    notaCorte: 12.500, pond: { matematicas2: 0.2, fisica: 0.2, quimica: 0.1 } },
  { id: "doble-mat-info-ugr",        nombre: "Doble Grado Matemáticas + Ing. Informática (UGR)",     uni: "UGR",  rama: "Ciencias",    notaCorte: 12.000, pond: { matematicas2: 0.2, fisica: 0.1, tecnologia: 0.1 } },
  { id: "doble-historia-arte-ugr",   nombre: "Doble Grado Historia + Historia del Arte (UGR)",       uni: "UGR",  rama: "Humanidades", notaCorte:  9.500, pond: { latin2: 0.2, filosofia: 0.2, geografia: 0.2 } },
  { id: "doble-bio-quim-ugr",        nombre: "Doble Grado Biología + Química (UGR)",                 uni: "UGR",  rama: "Ciencias",    notaCorte: 11.800, pond: { biologia: 0.2, quimica: 0.2 } },
  { id: "doble-bioq-quim-ugr",       nombre: "Doble Grado Bioquímica + Química (UGR)",               uni: "UGR",  rama: "Ciencias",    notaCorte: 11.700, pond: { biologia: 0.2, quimica: 0.2 } },
  { id: "doble-bio-bioq-ugr",        nombre: "Doble Grado Biología + Bioquímica (UGR)",              uni: "UGR",  rama: "Ciencias",    notaCorte: 12.300, pond: { biologia: 0.2, quimica: 0.2 } },
  { id: "doble-edu-prim-frances-ugr",nombre: "Doble Grado Ed. Primaria + Estudios Franceses (UGR)",  uni: "UGR",  rama: "Sociales",    notaCorte: 10.800, pond: { frances: 0.2, latin2: 0.1, filosofia: 0.1 } },
  { id: "doble-edu-prim-ingles-ugr", nombre: "Doble Grado Ed. Primaria + Estudios Ingleses (UGR)",   uni: "UGR",  rama: "Sociales",    notaCorte: 11.000, pond: { latin2: 0.1, filosofia: 0.1 } },

  // ----- Málaga (UMA) - dobles -----
  { id: "doble-derecho-ade-uma",     nombre: "Doble Grado Derecho + ADE (UMA)",                      uni: "UMA",  rama: "Sociales",    notaCorte: 11.700, pond: { matematicasccss: 0.2, empresa: 0.2 } },
  { id: "doble-derecho-criminol-uma",nombre: "Doble Grado Derecho + Criminología (UMA)",             uni: "UMA",  rama: "Sociales",    notaCorte: 11.300, pond: { latin2: 0.2, filosofia: 0.1 } },
  { id: "doble-mat-info-uma",        nombre: "Doble Grado Matemáticas + Ing. Informática (UMA)",     uni: "UMA",  rama: "Ingeniería",  notaCorte: 11.700, pond: { matematicas2: 0.2, fisica: 0.1, tecnologia: 0.1 } },

  // ----- UCM - dobles que faltaban -----
  { id: "doble-derecho-ade-ucm",     nombre: "Doble Grado Derecho + ADE (UCM)",                      uni: "UCM",  rama: "Sociales",    notaCorte: 12.700, pond: { matematicasccss: 0.2, empresa: 0.2, latin2: 0.1 } },
  { id: "doble-derecho-ccpp-ucm",    nombre: "Doble Grado Derecho + Ciencias Políticas (UCM)",       uni: "UCM",  rama: "Sociales",    notaCorte: 12.000, pond: { latin2: 0.2, filosofia: 0.2 } },
  { id: "doble-historia-arte-ucm",   nombre: "Doble Grado Historia + Historia del Arte (UCM)",       uni: "UCM",  rama: "Humanidades", notaCorte: 10.500, pond: { latin2: 0.2, filosofia: 0.2, geografia: 0.2 } },
  { id: "doble-bio-bioq-ucm",        nombre: "Doble Grado Biología + Bioquímica (UCM)",              uni: "UCM",  rama: "Ciencias",    notaCorte: 12.500, pond: { biologia: 0.2, quimica: 0.2 } },
  { id: "doble-quim-bioq-ucm",       nombre: "Doble Grado Química + Bioquímica (UCM)",               uni: "UCM",  rama: "Ciencias",    notaCorte: 12.300, pond: { quimica: 0.2, biologia: 0.2 } },
  { id: "doble-mat-est-ucm",         nombre: "Doble Grado Matemáticas + Estadística (UCM)",          uni: "UCM",  rama: "Ciencias",    notaCorte: 12.000, pond: { matematicas2: 0.2, fisica: 0.1 } },

  // ----- UAM - dobles que faltaban -----
  { id: "doble-derecho-ccpp-uam",    nombre: "Doble Grado Derecho + Ciencias Políticas (UAM)",       uni: "UAM",  rama: "Sociales",    notaCorte: 12.300, pond: { latin2: 0.2, filosofia: 0.2 } },
  { id: "doble-filo-ccpp-uam",       nombre: "Doble Grado Filosofía + Ciencias Políticas (UAM)",     uni: "UAM",  rama: "Humanidades", notaCorte:  9.800, pond: { filosofia: 0.2, latin2: 0.2 } },
  { id: "doble-quim-bioq-uam",       nombre: "Doble Grado Química + Bioquímica (UAM)",               uni: "UAM",  rama: "Ciencias",    notaCorte: 12.300, pond: { quimica: 0.2, biologia: 0.2 } },
  { id: "doble-mat-est-uam",         nombre: "Doble Grado Matemáticas + Estadística (UAM)",          uni: "UAM",  rama: "Ciencias",    notaCorte: 11.800, pond: { matematicas2: 0.2, fisica: 0.1 } },

  // ----- UC3M - dobles que faltaban -----
  { id: "doble-ade-derecho-uc3m",    nombre: "Doble Grado ADE + Derecho (UC3M)",                     uni: "UC3M", rama: "Sociales",    notaCorte: 12.500, pond: { matematicasccss: 0.2, empresa: 0.2, latin2: 0.1 } },
  { id: "doble-eco-est-uc3m",        nombre: "Doble Grado Economía + Estadística (UC3M)",            uni: "UC3M", rama: "Sociales",    notaCorte: 11.700, pond: { matematicas2: 0.2, matematicasccss: 0.2 } },
  { id: "doble-info-est-uc3m",       nombre: "Doble Grado Ing. Informática + Estadística (UC3M)",    uni: "UC3M", rama: "Ingeniería",  notaCorte: 12.000, pond: { matematicas2: 0.2, fisica: 0.1, tecnologia: 0.1 } },
  { id: "doble-econ-rrii-uc3m",      nombre: "Doble Grado Economía + RR.II. (UC3M)",                 uni: "UC3M", rama: "Sociales",    notaCorte: 12.000, pond: { matematicas2: 0.2, matematicasccss: 0.2 } },

  // ----- Cataluña - dobles -----
  { id: "doble-derecho-ade-ub",      nombre: "Doble Grado Derecho + ADE (UB)",                       uni: "UB",   rama: "Sociales",    notaCorte: 12.500, pond: { matematicasccss: 0.2, empresa: 0.2, latin2: 0.1 } },
  { id: "doble-mat-fis-uab",         nombre: "Doble Grado Matemáticas + Física (UAB)",               uni: "UAB",  rama: "Ciencias",    notaCorte: 12.700, pond: { matematicas2: 0.2, fisica: 0.2 } },
  { id: "doble-mat-info-uab",        nombre: "Doble Grado Matemáticas + Ing. Informática (UAB)",     uni: "UAB",  rama: "Ingeniería",  notaCorte: 11.500, pond: { matematicas2: 0.2, fisica: 0.1, tecnologia: 0.1 } },
  { id: "doble-bio-bioq-uab",        nombre: "Doble Grado Biología + Bioquímica (UAB)",              uni: "UAB",  rama: "Ciencias",    notaCorte: 12.500, pond: { biologia: 0.2, quimica: 0.2 } },
  { id: "doble-fis-quim-ub",         nombre: "Doble Grado Física + Química (UB)",                    uni: "UB",   rama: "Ciencias",    notaCorte: 11.500, pond: { fisica: 0.2, quimica: 0.2, matematicas2: 0.2 } },
  { id: "doble-quim-iqi-ub",         nombre: "Doble Grado Química + Ing. Química (UB)",              uni: "UB",   rama: "Ingeniería",  notaCorte: 11.700, pond: { quimica: 0.2, matematicas2: 0.2, fisica: 0.2 } },

  // ----- Valencia (UV/UPV) - dobles -----
  { id: "doble-derecho-ade-uv",      nombre: "Doble Grado Derecho + ADE (UV)",                       uni: "UV",   rama: "Sociales",    notaCorte: 12.300, pond: { matematicasccss: 0.2, empresa: 0.2 } },
  { id: "doble-derecho-criminol-uv", nombre: "Doble Grado Derecho + Criminología (UV)",              uni: "UV",   rama: "Sociales",    notaCorte: 11.000, pond: { latin2: 0.2, filosofia: 0.1 } },
  { id: "doble-mat-fis-uv",          nombre: "Doble Grado Matemáticas + Física (UV)",                uni: "UV",   rama: "Ciencias",    notaCorte: 12.500, pond: { matematicas2: 0.2, fisica: 0.2 } },
  { id: "doble-bio-bioq-uv",         nombre: "Doble Grado Biología + Bioquímica (UV)",               uni: "UV",   rama: "Ciencias",    notaCorte: 12.300, pond: { biologia: 0.2, quimica: 0.2 } },
  { id: "doble-historia-arte-uv",    nombre: "Doble Grado Historia + Historia del Arte (UV)",        uni: "UV",   rama: "Humanidades", notaCorte:  9.500, pond: { latin2: 0.2, filosofia: 0.2, geografia: 0.2 } },

  // ----- País Vasco (EHU) - dobles -----
  { id: "doble-derecho-ade-ehu",     nombre: "Doble Grado Derecho + ADE (EHU)",                      uni: "EHU",  rama: "Sociales",    notaCorte: 12.000, pond: { matematicasccss: 0.2, empresa: 0.2 } },
  { id: "doble-historia-arte-ehu",   nombre: "Doble Grado Historia + Historia del Arte (EHU)",       uni: "EHU",  rama: "Humanidades", notaCorte:  8.500, pond: { latin2: 0.2, filosofia: 0.2, geografia: 0.2 } },
  { id: "doble-bio-bioq-ehu",        nombre: "Doble Grado Biología + Bioquímica (EHU)",              uni: "EHU",  rama: "Ciencias",    notaCorte: 12.000, pond: { biologia: 0.2, quimica: 0.2 } },

  // ----- Otros dobles destacados -----
  { id: "doble-derecho-ade-unizar",  nombre: "Doble Grado Derecho + ADE (UNIZAR)",                   uni: "UNIZAR", rama: "Sociales",  notaCorte: 11.500, pond: { matematicasccss: 0.2, empresa: 0.2 } },
  { id: "doble-mat-fis-usc",         nombre: "Doble Grado Matemáticas + Física (USC)",               uni: "USC",  rama: "Ciencias",    notaCorte: 12.000, pond: { matematicas2: 0.2, fisica: 0.2 } },
  { id: "doble-derecho-ade-usal",    nombre: "Doble Grado Derecho + ADE (USAL)",                     uni: "USAL", rama: "Sociales",    notaCorte: 11.500, pond: { matematicasccss: 0.2, empresa: 0.2 } },
  { id: "doble-historia-arte-usal",  nombre: "Doble Grado Historia + Historia del Arte (USAL)",      uni: "USAL", rama: "Humanidades", notaCorte:  8.500, pond: { latin2: 0.2, filosofia: 0.2, geografia: 0.2 } },
  { id: "doble-historia-arte-uva",   nombre: "Doble Grado Historia + Historia del Arte (UVa)",       uni: "UVa",  rama: "Humanidades", notaCorte:  8.000, pond: { latin2: 0.2, filosofia: 0.2, geografia: 0.2 } },
  { id: "doble-derecho-ade-uniovi",  nombre: "Doble Grado Derecho + ADE (UNIOVI)",                   uni: "UNIOVI", rama: "Sociales",  notaCorte: 10.500, pond: { matematicasccss: 0.2, empresa: 0.2 } },
  { id: "doble-derecho-ade-unican",  nombre: "Doble Grado Derecho + ADE (UNICAN)",                   uni: "UNICAN", rama: "Sociales",  notaCorte: 10.300, pond: { matematicasccss: 0.2, empresa: 0.2 } },
  { id: "doble-derecho-ade-uclm",    nombre: "Doble Grado Derecho + ADE (UCLM)",                     uni: "UCLM", rama: "Sociales",    notaCorte: 10.500, pond: { matematicasccss: 0.2, empresa: 0.2 } },
  { id: "doble-derecho-ade-uex",     nombre: "Doble Grado Derecho + ADE (UEx)",                      uni: "UEx",  rama: "Sociales",    notaCorte: 10.000, pond: { matematicasccss: 0.2, empresa: 0.2 } },
  { id: "doble-derecho-ade-ull",     nombre: "Doble Grado Derecho + ADE (ULL)",                      uni: "ULL",  rama: "Sociales",    notaCorte: 10.500, pond: { matematicasccss: 0.2, empresa: 0.2 } },
  { id: "doble-derecho-ade-uib",     nombre: "Doble Grado Derecho + ADE (UIB)",                      uni: "UIB",  rama: "Sociales",    notaCorte: 11.000, pond: { matematicasccss: 0.2, empresa: 0.2 } },
  { id: "doble-derecho-ccpp-usc",    nombre: "Doble Grado Derecho + Ciencias Políticas (USC)",       uni: "USC",  rama: "Sociales",    notaCorte: 10.700, pond: { latin2: 0.2, filosofia: 0.2 } },

  // ----- Singles que faltaban -----
  { id: "comav-us",                  nombre: "Comunicación Audiovisual (US)",                        uni: "US",   rama: "Sociales",    notaCorte: 10.700, pond: { latin2: 0.2, filosofia: 0.1 } },
  { id: "rrll-rrhh-us",              nombre: "Rel. Laborales y RR.HH. (US)",                         uni: "US",   rama: "Sociales",    notaCorte:  7.500, pond: { matematicasccss: 0.2, empresa: 0.2 } },
  { id: "edu-social-us",             nombre: "Educación Social (US)",                                uni: "US",   rama: "Sociales",    notaCorte:  9.000, pond: { filosofia: 0.1, latin2: 0.1, matematicasccss: 0.1 } },
  { id: "magisterio-prim-us",        nombre: "Educación Primaria (US)",                              uni: "US",   rama: "Sociales",    notaCorte:  9.700, pond: { matematicasccss: 0.1, latin2: 0.1, filosofia: 0.1, biologia: 0.1 } },
  { id: "logopedia-us",              nombre: "Logopedia (US)",                                       uni: "US",   rama: "Salud",       notaCorte: 10.500, pond: { biologia: 0.2, quimica: 0.1, filosofia: 0.1 } },
  { id: "podologia-us",              nombre: "Podología (US)",                                       uni: "US",   rama: "Salud",       notaCorte:  9.500, pond: { biologia: 0.2, quimica: 0.2, fisica: 0.1 } },
  { id: "trabajosocial-us",          nombre: "Trabajo Social (US)",                                  uni: "US",   rama: "Sociales",    notaCorte:  9.000, pond: { filosofia: 0.1, latin2: 0.1, matematicasccss: 0.1 } },
  { id: "geografia-us",              nombre: "Geografía y Gestión del Territorio (US)",              uni: "US",   rama: "Humanidades", notaCorte:  5.500, pond: { geografia: 0.2, latin2: 0.1, filosofia: 0.1 } },
  { id: "antropologia-us",           nombre: "Antropología Social y Cultural (US)",                  uni: "US",   rama: "Sociales",    notaCorte:  6.500, pond: { latin2: 0.1, filosofia: 0.2, geografia: 0.2 } },
  { id: "filosofia-us",              nombre: "Filosofía (US)",                                       uni: "US",   rama: "Humanidades", notaCorte:  5.500, pond: { filosofia: 0.2, latin2: 0.2 } },
];
