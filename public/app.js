const socket = io(); // Conecta al servidor de Socket.io automáticamente

const canvas = document.getElementById('whiteboard');
const ctx = canvas.getContext('2d');

// Ajustar el canvas al tamaño de la pantalla
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas(); // Llamada inicial

// Variables de estado
let isDrawing = false;
let currentMode = 'pencil'; // 'pencil' o 'eraser'
let currentColor = '#00f0ff';
let currentSize = 5;

// Variables para guardar la posición anterior del cursor
let lastX = 0;
let lastY = 0;

// Referencias a elementos UI
const colorPicker = document.getElementById('color-picker');
const sizeSlider = document.getElementById('size-slider');
const btnPencil = document.getElementById('btn-pencil');
const btnEraser = document.getElementById('btn-eraser');
const btnClear = document.getElementById('btn-clear');
const statusDot = document.getElementById('status-dot');
const statusText = document.getElementById('status-text');

// Eventos de estado de conexión
socket.on('connect', () => {
    statusDot.classList.add('connected');
    statusText.innerText = 'En Línea';
});
socket.on('disconnect', () => {
    statusDot.classList.remove('connected');
    statusText.innerText = 'Desconectado';
});

// Cambiar color
colorPicker.addEventListener('input', (e) => {
    currentColor = e.target.value;
});

// Cambiar tamaño
sizeSlider.addEventListener('input', (e) => {
    currentSize = e.target.value;
});

// Herramienta Lápiz
btnPencil.addEventListener('click', () => {
    currentMode = 'pencil';
    btnPencil.classList.add('active');
    btnEraser.classList.remove('active');
});

// Herramienta Borrador
btnEraser.addEventListener('click', () => {
    currentMode = 'eraser';
    btnEraser.classList.add('active');
    btnPencil.classList.remove('active');
});

// Botón Limpiar Todo
btnClear.addEventListener('click', () => {
    // Limpiamos localmente
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Emitimos el evento de limpieza al servidor
    socket.emit('draw', { action: 'clear' });
});

// Funciones principales de dibujo
function startDrawing(e) {
    isDrawing = true;
    [lastX, lastY] = [e.clientX, e.clientY];
}

function stopDrawing() {
    isDrawing = false;
    ctx.beginPath(); // Resetea el camino para que no conecte trazos separados
}

function draw(e) {
    if (!isDrawing) return;

    // Calcular color final dependiendo si es borrador o lápiz
    // El borrador pinta del color de fondo
    const strokeColor = currentMode === 'eraser' ? '#1e293b' : currentColor;

    // Dibujar localmente
    drawLine(lastX, lastY, e.clientX, e.clientY, strokeColor, currentSize);

    // Emitir coordenadas al servidor a través de WebSockets
    socket.emit('draw', {
        action: 'line',
        x0: lastX,
        y0: lastY,
        x1: e.clientX,
        y1: e.clientY,
        color: strokeColor,
        size: currentSize
    });

    [lastX, lastY] = [e.clientX, e.clientY];
}

// Función auxiliar para trazar una línea en el canvas
function drawLine(x0, y0, x1, y1, color, size) {
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.closePath();
}

// Eventos de Mouse
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

// Escuchar dibujos provenientes de otros usuarios (desde el servidor)
socket.on('draw', (data) => {
    if (data.action === 'line') {
        drawLine(data.x0, data.y0, data.x1, data.y1, data.color, data.size);
    } else if (data.action === 'clear') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
});

// Cuando nos conectamos, el servidor nos enviará el historial existente
socket.on('history', (historyArray) => {
    historyArray.forEach(data => {
        if (data.action === 'line') {
            drawLine(data.x0, data.y0, data.x1, data.y1, data.color, data.size);
        }
    });
});
