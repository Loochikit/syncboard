# 🎨 SyncBoard - Pizarra Colaborativa en Tiempo Real

**SyncBoard** es una aplicación web full-stack que permite a múltiples usuarios dibujar de forma colaborativa en un lienzo compartido en tiempo real. 

Este proyecto fue diseñado para demostrar habilidades en **sistemas distribuidos en tiempo real**, **desarrollo full-stack** y **optimización de rendimiento de renderizado en el cliente**.

---

## 🚀 Características Clave

*   **Sincronización en Tiempo Real:** Comunicación bidireccional instantánea mediante **WebSockets** (Socket.io).
*   **Persistencia de Estado (Historial):** Los usuarios que se conectan tarde reciben automáticamente el historial de trazos del servidor, lo que les permite ver el lienzo tal y como está actualmente.
*   **Diseño Premium (UI/UX):** Interfaz oscura moderna utilizando técnicas de **Glassmorphism**, barra de herramientas flotante intuitiva y un selector dinámico de tamaño y color.
*   **Eficiencia Gráfica:** Dibujo fluido utilizando la API de **HTML5 Canvas** con configuraciones optimizadas de refresco (`lineCap = 'round'`).

---

## 🛠️ Tecnologías Utilizadas

*   **Backend:** Node.js, Express, Socket.io
*   **Frontend:** HTML5 (Canvas), CSS3 (Variables personalizadas, Backdrop-filter), JavaScript nativo (ES6)
*   **Protocolo:** WebSockets

---

## 💻 Instalación y Ejecución Local

Sigue estos pasos para correr el proyecto localmente en tu máquina:

1. **Clona este repositorio:**
   ```bash
   git clone https://github.com/TU_USUARIO/syncboard.git
   cd syncboard
   ```

2. **Instala las dependencias necesarias:**
   ```bash
   npm install
   ```

3. **Inicia el servidor:**
   ```bash
   node server.js
   ```

4. **Prueba la colaboración:**
   * Abre **[http://localhost:3000](http://localhost:3000)** en tu navegador.
   * Abre una segunda ventana de incógnito o en otro navegador y dibuja en tiempo real.

---

## 💡 Conceptos de Ingeniería de Software Demostrados

*   **Manejo de Conexiones Persistentes:** Creación de servidores WebSocket robustos para soportar conexiones activas.
*   **Manejo de Estado Compartido:** Sincronización de eventos a través de un modelo de retransmisión (*broadcasting*).
*   **Optimización del Ancho de Banda:** Emisión de coordenadas del vector de movimiento (X, Y) reduciendo al mínimo la carga de red en comparación con el envío de imágenes pesadas.
