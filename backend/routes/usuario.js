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

  // Obtener información básica del usuario (ID, username, avatar) y sus títulos a partir del correo
router.post('/info-usuario-por-correo', (req, res) => {
  const { correoUsuario } = req.body;

  connection.query(
    'SELECT ID_Usuario, Username, Avatar_Blob FROM usuario WHERE Correo_usu = ?',
    [correoUsuario],
    (err, usuario) => {
      if (err) {
        console.error('Error al consultar el usuario:', err);
        return res.status(500).json({ error: 'Error al consultar el usuario' });
      }

      if (usuario.length === 0) {
        return res.status(404).json({ mensaje: 'Usuario no encontrado' });
      }

      const usuarioInfo = usuario[0];
      const idUsuario = usuarioInfo.ID_Usuario;

      connection.query(
        `
        SELECT t.ID_Titulo, t.Nombre_Titulo
        FROM titulo t
        JOIN titulo_usuario ut ON t.ID_Titulo = ut.ID_Titulo
        WHERE ut.ID_Usuario = ?
        `,
        [idUsuario],
        (err2, titulos) => {
          if (err2) {
            console.error('Error al obtener títulos:', err2);
            return res.status(500).json({ error: 'Error al obtener títulos del usuario' });
          }

          let avatarBase64 = null;
          if (usuarioInfo.Avatar_Blob) {
            const base64Image = usuarioInfo.Avatar_Blob.toString('base64');
            avatarBase64 = `data:image/png;base64,${base64Image}`;
          }

          res.json({
            idUsuario: usuarioInfo.ID_Usuario,
            username: usuarioInfo.Username,
            avatar: avatarBase64,
            titulos: titulos
          });
        }
      );
    }
  );
});



module.exports = router;
