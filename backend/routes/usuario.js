// Importa tu modelo o base de datos
const express = require("express");
const router = express.Router();
const connection = require('../db'); 

// Ruta para obtener usuarios con los que NO hay un chat privado
router.get("/usuarios-disponibles/:correo", (req, res) => {
  const correo = req.params.correo;
  const esGrupal = req.query.esGrupal === 'true'; 

  const obtenerIDUsuario = `SELECT ID_Usuario FROM usuario WHERE Correo_Usu = ?`;

  connection.query(obtenerIDUsuario, [correo], (err, result) => {
    if (err) {
      console.error("Error al obtener ID del usuario:", err);
      return res.status(500).json({ error: "Error interno" });
    }

    if (result.length === 0) {
      return res.status(404).json({ error: "usuario no encontrado" });
    }

    const idUsuario = result[0].ID_Usuario;

    if (esGrupal) {
      const queryGrupal = `
        SELECT ID_Usuario, Username
        FROM usuario
        WHERE ID_Usuario != ?;
      `;

      connection.query(queryGrupal, [idUsuario], (error, results) => {
        if (error) {
          console.error("Error al obtener usuarios grupales:", error);
          return res.status(500).json({ error: "Error al obtener usuarios" });
        }

        res.json(results);
      });

    } else {
      const queryPrivado = `
        SELECT U.ID_Usuario, U.Username
        FROM usuario U
        WHERE U.ID_Usuario != ?
          AND NOT EXISTS (
            SELECT 1
            FROM chat C
            JOIN chat_usuario CU1 ON C.ID_Chat = CU1.ID_Chat
            JOIN chat_usuario CU2 ON C.ID_Chat = CU2.ID_Chat
            WHERE C.EsGrupo = FALSE
              AND CU1.ID_Usuario = ?
              AND CU2.ID_Usuario = U.ID_Usuario
              AND CU1.ID_Usuario != CU2.ID_Usuario
          );
      `;

      connection.query(queryPrivado, [idUsuario, idUsuario], (error, results) => {
        if (error) {
          console.error("Error al obtener usuarios privados:", error);
          return res.status(500).json({ error: "Error al obtener usuarios" });
        }

        res.json(results);
      });
    }
  });
});

router.get("/obtener-usuario/:correoUsuario", (req, res) => {
    const correoUsuario = req.params.correoUsuario;  // Cambié correoUsuario por Correo_Usu
  
    const sql = "SELECT * FROM usuario WHERE Correo_Usu = ?";
    connection.query(sql, [correoUsuario], (err, results) => {
      if (err) {
        console.error("Error al verificar el correo:", err);
        return res.status(500).json({ error: "Error del servidor al verificar el correo." });
      }
  
      if (results.length > 0) {
        return res.status(200).json({ existe: true, usuario: results[0] });  // Devuelves el usuario si existe
      } else {
        return res.status(200).json({ existe: false });
      }
    });
});

router.get('/obtener-mensajes/:idChat', async (req, res) => {
    const { idChat } = req.params;
  
    try {
      const [mensajesRaw] = await connection.promise().query(`
        SELECT 
          m.ID_Mensaje,
          m.TextoMensaje,
          m.HoraFecha_Mensaje,
          u.Username,
          u.Avatar_Blob,
          u.ID_Usuario
        FROM mensaje m
        JOIN usuario u ON m.ID_Usuario = u.ID_Usuario
        WHERE m.ID_Chat = ?
        ORDER BY m.HoraFecha_Mensaje ASC
      `, [idChat]);
        
      const mensajes = mensajesRaw.map(mensaje => ({
      ...mensaje,
      Avatar_Blob: mensaje.Avatar_Blob 
        ? `data:image/jpeg;base64,${Buffer.from(mensaje.Avatar_Blob).toString('base64')}`
        : null
      }));
      
      return res.status(200).json({ mensajes });
    } catch (error) {
      console.error("Error al obtener mensajes:", error);
      return res.status(500).json({ error: "Error al obtener los mensajes" });
    }
  });

module.exports = router;
