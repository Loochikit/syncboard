const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static('public'));

// Almacenar el historial de trazos
let drawingHistory = [];

// Escuchar conexiones de WebSockets
io.on('connection', (socket) => {
    console.log(`Nuevo usuario conectado: ${socket.id}`);

    // Enviar el historial de dibujos acumulado al nuevo usuario
    socket.emit('history', drawingHistory);

    // Cuando recibimos un evento de dibujo de un cliente
    socket.on('draw', (data) => {
        // Actualizamos el historial del servidor
        if (data.action === 'clear') {
            drawingHistory = [];
        } else {
            drawingHistory.push(data);
        }

        // Retransmitimos a TODOS los demás clientes conectados (excepto a quien lo envió)
        socket.broadcast.emit('draw', data);
    });

    // Cuando un usuario se desconecta
    socket.on('disconnect', () => {
        console.log(`Usuario desconectado: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor SyncBoard corriendo en http://localhost:${PORT}`);
});
