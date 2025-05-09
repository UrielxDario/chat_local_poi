const express = require('express');
const cors = require('cors');
const db = require('./db'); 
const authRoutes = require("./routes/auth");
const rutasUsuarios = require("./routes/usuario"); 
const chatRoutes = require("./routes/chat"); 

require('dotenv').config();



const app = express();

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


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(` Servidor corriendo en el puerto ${PORT}`);
});
