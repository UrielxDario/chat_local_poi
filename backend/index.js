const express = require('express');
const cors = require('cors');
const db = require('./db'); 
const authRoutes = require("./routes/auth");
const rutasUsuarios = require("./routes/usuario"); 
const chatRoutes = require("./routes/chat"); 
<<<<<<< Updated upstream
const tareasRoutes = require('./routes/tareasRoutes');
=======
const titulosRoutes = require("./routes/titulos");
>>>>>>> Stashed changes

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
const usersConnected = {}; // userId: socket.id

io.on('connection', (socket) => {
  console.log('🟢 Usuario conectado:', socket.id);

  // Al conectarse, el frontend debe enviar su userId
  socket.on('registerUser', (userId) => {
    usersConnected[userId] = socket.id;
    console.log(`📌 Usuario ${userId} registrado con socket ID ${socket.id}`);
  });

  socket.on('startCall', ({ senderId, receiverId, callId }) => {
    const receiverSocketId = usersConnected[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit(`incomingCall-${receiverId}`, { senderId, callId });
      console.log(`📞 Emitiendo llamada a ${receiverId} en socket ${receiverSocketId}`);
    } else {
      console.log(`⚠️ Usuario ${receiverId} no está conectado`);
    }
  });

  socket.on('disconnect', () => {
    // Limpia los usuarios desconectados
    for (const [userId, sId] of Object.entries(usersConnected)) {
      if (sId === socket.id) {
        delete usersConnected[userId];
        console.log(`🔴 Usuario ${userId} desconectado`);
        break;
      }
    }
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

app.use('/api/tareas', tareasRoutes);

app.use("/api", rutasUsuarios);

app.use(chatRoutes);

<<<<<<< Updated upstream
process.on('SIGINT', () => {
  db.end((err) => {
    if (err) {
      console.error('❌ Error al cerrar el pool de conexiones:', err);
    } else {
      console.log('✅ Pool de conexiones cerrado correctamente.');
    }
    process.exit();
  });
});
=======
app.use("/api", titulosRoutes);

>>>>>>> Stashed changes

//aqui abajo cambie app.listen por server.listen para lo del socket.io de actualizacion en tiempo real
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(` Servidor corriendo en el puerto ${PORT}`);
});
