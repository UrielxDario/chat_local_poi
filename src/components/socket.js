// src/socket.js
import { io } from 'socket.io-client';

// Conéctate al backend de Render (o local si estás probando localmente)
const socket = io('https://chat-local-poi.onrender.com', {
  transports: ['websocket'], // ayuda en entornos como Render
  reconnection: true,
});

export default socket;
