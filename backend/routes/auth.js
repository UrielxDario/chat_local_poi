const express = require("express");
const router = express.Router();
const db = require("../db");
const multer = require("multer");
const path = require("path");

const jwt = require('jsonwebtoken');



// Configurar multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, "avatar-" + uniqueSuffix + ext);  
  },
});
const upload = multer({ storage });



router.post("/verificar-correo", (req, res) => {
  const { Correo_Usu } = req.body;

  const sql = "SELECT * FROM Usuario WHERE Correo_Usu = ?";
  db.query(sql, [Correo_Usu], (err, results) => {
    if (err) {
      console.error("Error al verificar el correo:", err);
      return res.status(500).json({ error: "Error del servidor al verificar el correo." });
    }

    if (results.length > 0) {
      return res.status(200).json({ existe: true });
    } else {
      return res.status(200).json({ existe: false });
    }
  });
});




// Ruta para registrar usuario con imagen
router.post("/register", upload.single("avatar"), (req, res) => {
  console.log(req.body); 

  const {
    Username,
    Correo_Usu,
    Contra_Usu,
    FechaNacimiento_Usu,
    Casa_Usu,
    Rol_Usu,
    TextoBiografia_Usu,
  } = req.body;

  const Avatar_Usu = req.file ? `/uploads/${req.file.filename}` : null;

  const sql = `
    INSERT INTO Usuario 
    (Username, Correo_Usu, Contra_Usu, FechaNacimiento_Usu, Casa_Usu, Rol_Usu, Avatar_Usu, TextoBiografia_Usu) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      Username,
      Correo_Usu,
      Contra_Usu,
      FechaNacimiento_Usu,
      Casa_Usu,
      Rol_Usu,
      Avatar_Usu,
      TextoBiografia_Usu || "",
    ],
    (err, result) => {
      if (err) {
        console.error("Error al insertar:", err);
        res.status(500).json({ error: "Error al registrar usuario" });
      } else {
        res.status(200).json({ message: "Usuario registrado exitosamente" });
      }
    }
  );
});


// Ruta de login
router.post('/login', (req, res) => {
  console.log('Solicitud recibida', req.body);
  const { Correo_Usu, Contra_Usu } = req.body;

  const query = 'SELECT * FROM Usuario WHERE Correo_Usu = ?';
  db.query(query, [Correo_Usu], (err, results) => {
    if (err) {
      console.error('Error en la consulta:', err);
      return res.status(500).json({ mensaje: 'Error en el servidor.' });
    }

    if (results.length === 0) {
      return res.json({ acceso: 'correo', mensaje: 'Correo no encontrado.' });
    }

    const usuario = results[0]; 

    if (Contra_Usu !== usuario.Contra_Usu) {
      return res.json({ acceso: 'password', mensaje: 'Contraseña incorrecta.' });
    }

    const token = jwt.sign(
      { id: usuario.ID_Usuario, Correo_Usu: usuario.Correo_Usu },
      process.env.JWT_SECRET, 
      { expiresIn: '1h' } 
    );

    return res.json({ acceso: 'ok', mensaje: 'Inicio de sesión exitoso.', token });
  });
});



module.exports = router;
