# 📦 Mi PAU 2026 — Guía de exportación, instalación y publicación

Esta guía explica **cómo dejar la app accesible** para tu hija desde cualquier sitio: ordenador, móvil Android, iPhone/iPad, sin tienda de apps, con tienda, o en su propio dominio.

---

## 1. Estado actual de la app

Es una **PWA (Progressive Web App)** 100% del lado cliente:

- HTML/CSS/JS sin frameworks ni build → se sirve igual desde cualquier servidor estático.
- Datos en `localStorage` del navegador → sin servidor, sin cuentas, sin coste.
- Funciona offline gracias al `service worker` (`sw.js`).
- Manifest (`manifest.webmanifest`) → instalable como icono en escritorio/móvil.
- Tamaño total: **~250 KB** (sin contar CDNs de PDF.js/Mammoth que solo se cargan al subir un archivo).

> **Tu hija ya puede usarla simplemente abriendo `app/index.html`** haciendo doble clic, pero para aprovechar PWA, sincronización entre dispositivos e instalación, conviene servirla por HTTPS.

---

## 2. Opciones de despliegue (de más fácil a más profesional)

### 🥇 Opción A — Hosting estático gratuito (recomendado)

Sirve la carpeta `app/` por HTTPS. Funciona como **portal web** y como **app instalable** en Android/iOS. **Gratis**, sin tarjeta.

| Servicio | URL final | Pasos | Notas |
|---|---|---|---|
| **GitHub Pages** | `https://usuario.github.io/mi-pau` | 1. Crea repo público<br>2. Sube carpeta `app/`<br>3. Settings → Pages → branch `main` /docs o /root | Ideal si ya usas GitHub. Gratis para siempre. |
| **Netlify Drop** | `https://nombre.netlify.app` | 1. Ve a [app.netlify.com/drop](https://app.netlify.com/drop)<br>2. Arrastra la carpeta `app/`<br>3. Listo en 30 s | Sin login para empezar. Permite dominio propio. |
| **Vercel** | `https://nombre.vercel.app` | 1. `npx vercel` desde la carpeta<br>2. O sube el repo a github.com y conecta | Build muy rápido. CDN global. |
| **Cloudflare Pages** | `https://nombre.pages.dev` | Conecta repo Git | Mejor rendimiento mundial. |
| **Firebase Hosting** | `https://nombre.web.app` | `firebase init hosting` + `firebase deploy` | Si planeas añadir backend Google. |

**Recomendación:** GitHub Pages o Netlify para empezar. Tu hija escanea un QR con la URL y la añade al móvil.

---

### 🥈 Opción B — Servidor propio / dominio personalizado

Si quieres una URL tipo `https://pau.tucasa.es`:

1. Compra un dominio (Namecheap, IONOS, OVH ≈ 10 €/año).
2. Apunta el DNS a Netlify/Cloudflare/Vercel (todos permiten dominio custom gratis con HTTPS automático).
3. O monta nginx/Apache en un VPS y copia la carpeta `app/` a `/var/www/html/`.

**Configuración nginx mínima:**
```nginx
server {
  listen 443 ssl http2;
  server_name pau.tucasa.es;
  root /var/www/pau;
  index index.html;
  location / { try_files $uri $uri/ /index.html; }
  # Headers PWA
  location /sw.js { add_header Cache-Control "no-cache"; }
  location /manifest.webmanifest { add_header Content-Type "application/manifest+json"; }
}
```

---

### 🥉 Opción C — Sólo local (USB / red WiFi de casa)

Sin internet, dentro de tu red doméstica:

```powershell
# En Windows, desde la carpeta app/
python -m http.server 8080
# o con Node:
npx serve -p 8080
```

Tu hija accede desde el móvil a `http://IP-DE-TU-PC:8080` mientras esté en la misma WiFi.
**Limitación:** sin HTTPS no funciona el service worker → no hay modo offline ni instalación PWA real, pero la app sí funciona.

---

## 3. Instalación como app

Una vez la app está servida por HTTPS (opciones A o B):

### 📱 Android (Chrome / Edge / Samsung Internet)

1. Tu hija abre la URL.
2. Aparece un banner **"Añadir a pantalla de inicio"** automático (o desde el menú ⋮ → "Instalar app").
3. Queda como icono nativo. Se abre en pantalla completa, sin barra del navegador.
4. Funciona offline.

### 🍎 iPhone / iPad (Safari, **obligatorio** — Chrome iOS no lo soporta)

1. Abre la URL en **Safari**.
2. Botón **Compartir** ⬆️ → **"Añadir a pantalla de inicio"**.
3. Aparece el icono. Funciona como app nativa.
4. ⚠️ Limitaciones de iOS:
   - Las **notificaciones push** solo funcionan a partir de iOS 16.4 y solo si la PWA está instalada.
   - El reconocimiento de voz funciona pero requiere permisos adicionales.
   - El almacenamiento puede borrarse si no se usa la app durante semanas.

### 💻 Escritorio (Chrome / Edge / Brave)

1. Abre la URL.
2. Icono ⊕ a la derecha de la barra de direcciones → "Instalar".
3. Queda en el menú de inicio de Windows / Launchpad de Mac.

---

## 4. Sincronización entre dispositivos

La app guarda todo en `localStorage` (no hay backend). Para llevar los datos del PC al móvil:

### Método 1: QR (recomendado)
1. En el PC: botón **⬇️ (Exportar)** → se abre el modal con un **código QR**.
2. En el móvil: instala la app, abre **⬇️**, sección "Importar", **escanea el QR** con la cámara y pega el código.
3. Los datos se clonan en segundos (si caben en QR; si no, usa código texto).

### Método 2: Código de texto
- Copiar/pegar el blob base64 entre dispositivos (email, WhatsApp).

### Método 3: Archivo JSON
- "Descargar JSON" → guardar en Drive/iCloud → importar en el otro dispositivo.

---

## 5. Convertir en app nativa real (Google Play / App Store)

Si **necesitas** publicar en las tiendas (no es obligatorio para una PWA):

### 🤖 Android — Trusted Web Activity (TWA)

La forma oficial recomendada por Google:

1. **PWABuilder.com** (gratis):
   - Mete tu URL pública.
   - Pulsa "Package for stores" → **Android**.
   - Descarga el `.aab` ya firmado.
2. Sube a Google Play Console (cuenta única, **25 USD pago único**).
3. Tu hija descarga la app real desde Play Store.

Internamente la app es la misma PWA pero envuelta en un contenedor Chrome. Las actualizaciones del web son automáticas.

**Alternativa:** Capacitor (Ionic) si quieres acceso a APIs nativas (geolocalización avanzada, contactos, etc.).
```bash
npm install -g @capacitor/cli
npx cap init "Mi PAU" com.tucasa.pau --web-dir=app
npx cap add android
npx cap copy
npx cap open android   # abre Android Studio para compilar APK/AAB
```

### 🍎 iOS — App Store

Más caro y más burocrático:

1. **PWABuilder** → "Package for stores" → **iOS** → descarga proyecto Xcode.
2. Cuenta de desarrollador Apple (**99 USD/año**).
3. Compilar en macOS con Xcode (no se puede desde Windows directamente).
4. Subir a App Store Connect → revisión de Apple (1–7 días).
5. Apple suele rechazar PWAs envueltas que no aporten **funciones nativas reales** — añade al menos: notificaciones push, deep links, modo offline garantizado, integración con Calendario o Health.

> 🔥 **Si solo es para tu hija**, **NO publiques en App Store**. Que la instale como PWA desde Safari es 99% igual y gratis.

---

## 6. Backup de los datos del estudio

| Frecuencia | Método | Cómo |
|---|---|---|
| Diaria automática | LocalStorage del navegador | Ya pasa solo (mientras no borre caché) |
| Semanal manual | Descargar JSON | Botón ⬇️ → "📥 Descargar JSON" → guarda en Drive |
| Antes de actualizar app | Exportar JSON | Igual que arriba |
| Cambio de dispositivo | QR / Código | Sección 4 |

⚠️ **Importante:** si tu hija borra el historial de Safari/Chrome con la opción "borrar caché y datos de sitios", **se pierden los datos**. Hazle exportar JSON cada semana.

---

## 7. Resumen rápido (qué te recomiendo)

Para el caso de tu hija (uso personal, hasta junio 2026):

1. **Sube `app/` a GitHub Pages** (15 minutos):
   ```powershell
   cd "c:\Users\d.zaplana\Proyectos IA\Estudio_Carmen\app"
   git init
   git add .
   git commit -m "Mi PAU 2026"
   gh repo create mi-pau --public --source=. --push
   gh repo edit --enable-pages
   # O activa Pages a mano en Settings → Pages → main / root
   ```
   URL final: `https://TU_USUARIO.github.io/mi-pau/`

2. **Pásale la URL por WhatsApp** y dile que la añada a pantalla de inicio.

3. **Cada domingo**, que pulse ⬇️ → "Descargar JSON" y guarde el archivo en Drive (backup).

4. **Si necesita verlo en clase sin internet** y la red del insti es horrible, el service worker ya cachea todo después de la primera carga, así que funcionará sin datos móviles.

5. **App nativa solo si te apetece** — no aporta nada útil para este uso.

---

## 8. Estructura final del proyecto

```
app/
├── index.html              # Entry point (única página)
├── manifest.webmanifest    # Metadatos PWA
├── sw.js                   # Service Worker (offline)
├── README.md
├── css/
│   └── style.css
└── js/
    ├── data.js             # PAU 2026 Murcia, materias, modalidades
    ├── exams.js            # Banco de exámenes oficiales
    ├── flashcards.js       # SM-2 / mazos
    ├── tests.js            # Preguntas test
    ├── grados.js           # 258+ grados España
    ├── logros.js           # Gamificación
    ├── ia.js               # Multi-provider LLM (OpenAI/Anthropic/Gemini/Groq/OpenRouter)
    ├── adjuntos.js         # PDF/DOCX/imágenes en apuntes
    ├── extras.js           # Simulacro, foco, voz, gráficas, sync, repaso, banco FC
    └── app.js              # Lógica principal + UI
```

---

## 9. Costes resumidos

| Cosa | Coste |
|---|---|
| Usar la app local (doble clic) | **0 €** |
| Hospedar en GitHub Pages / Netlify / Vercel | **0 €** |
| Dominio propio | ~10 €/año (opcional) |
| Publicar en Google Play | 25 € pago único |
| Publicar en App Store | 99 € / año |
| API de IA (OpenAI / Anthropic / Gemini) | Consumo, ~5 € cubre todo el curso |
| API de IA gratis (Groq / OpenRouter free tier) | **0 €** |

---

## 10. Roadmap futuro (opcional)

Si en algún momento quieres ir más allá:

- **Backend ligero** → Supabase (gratis hasta cierto uso): cuentas, sync automático nube, sin perder datos al limpiar navegador.
- **Notificaciones push reales** → Firebase Cloud Messaging.
- **Estadísticas familiares** → mini panel para que veas su progreso desde tu móvil.
- **Modo grupo** → invitar a sus amigas a hacer simulacros juntas.

Pero todo eso es ya construir un producto. Para tu hija, **lo que tienes ahora ya es suficiente y mejor que cualquier app comercial**. 🎓

---

**Última revisión:** abril 2026
