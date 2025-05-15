const express = require('express');
const cors = require('cors');
const db = require('./db'); 
const authRoutes = require("./routes/auth");
const rutasUsuarios = require("./routes/usuario"); 
const chatRoutes = require("./routes/chat"); 
const tokenRoute = require('./routes/token');


require('dotenv').config();



const app = express();
//Esto, desde aqui hasta lo de "Usuario desconectado" y sus llaves, son las  lineas que agregue para el socket y actualizar en tiempo real 
const http = require('http'); // Usamos http para socket.io
const server = http.createServer(app);

const { Server } = require('socket.io');
const io = new Server(server, {
  cors: {
    origin: 'https://chat-local-poi.onrender.com', //si no funciona asi, quito la direccion y solo pongo '*'
    methods: ['GET', 'POST'],
  }
});

// === SOCKET.IO ===
io.on('connection', (socket) => {
  console.log('🟢 Usuario conectado vía Socket.IO:', socket.id);

  // Evento personalizado: inicio de llamada
  socket.on('startCall', ({ senderId, receiverId, callId }) => {
    console.log(`📞 Llamada de ${senderId} a ${receiverId}, ID: ${callId}`);
    io.emit(`incomingCall-${receiverId}`, { senderId, callId });
  });

  socket.on('disconnect', () => {
    console.log('🔴 Usuario desconectado:', socket.id);
  });
});





//Middlewares
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});


// Rutas de prueba

app.use("/api/auth", authRoutes);

app.use("/api", rutasUsuarios);

app.use(chatRoutes);

app.use('/api/token', tokenRoute);


//aqui abajo cambie app.listen por server.listen para lo del socket.io de actualizacion en tiempo real
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(` Servidor corriendo en el puerto ${PORT}`);
});
