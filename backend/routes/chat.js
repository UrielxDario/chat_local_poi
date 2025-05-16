const express = require('express');
const router = express.Router();
const conexion = require('../db'); // Tu conexión a MySQL

// Crear chat
router.post('/crear-chat', async (req, res) => {
  const { usuarios, correoUsuario } = req.body;

  try {
    // 1. Obtener ID del usuario actual por correo
    const [usuarioActual] = await conexion.promise().query(
      "SELECT ID_Usuario FROM usuario WHERE Correo_usu = ?",
      [correoUsuario]
    );

    if (usuarioActual.length === 0) {
      return res.status(400).json({ mensaje: "Usuario no encontrado" });
    }

    const idActual = usuarioActual[0].ID_Usuario;
    const idOtro = usuarios[0];

    // 2. Verificar si ya existe un chat 1 a 1 entre estos dos usuarios
    const [chatsExistentes] = await conexion.promise().query(`
      SELECT c.ID_Chat
      FROM chat c
      JOIN chat_usuario p1 ON c.ID_Chat = p1.ID_Chat
      JOIN chat_usuario p2 ON c.ID_Chat = p2.ID_Chat
      WHERE c.EsGrupo = 0
        AND p1.ID_Usuario = ?
        AND p2.ID_Usuario = ?
      GROUP BY c.ID_Chat
      HAVING COUNT(*) = 2
    `, [idActual, idOtro]);

    if (chatsExistentes.length > 0) {
      return res.status(200).json({ mensaje: "Ya existe un chat con este usuario" });
    }

    // 3. Crear el nuevo chat (1 a 1)
    const [nuevoChat] = await conexion.promise().query(
      "INSERT INTO chat (EsGrupo, Fecha_Creacion) VALUES (0, NOW())"
    );

    const idNuevoChat = nuevoChat.insertId;

    // 4. Insertar ambos usuarios como participantes
    await conexion.promise().query(
      "INSERT INTO chat_usuario (ID_Chat, ID_Usuario) VALUES (?, ?), (?, ?)",
      [idNuevoChat, idActual, idNuevoChat, idOtro]
    );

    return res.status(200).json({ mensaje: "Chat creado exitosamente", ID_Chat: idNuevoChat });

  } catch (error) {
    console.error("Error al crear chat:", error);
    return res.status(500).json({ mensaje: "Error interno del servidor" });
  }
});

// Obtener chats
router.get('/obtener-chats', async (req, res) => {
  const { correoUsuario } = req.query;

  try {
    // Obtener ID del usuario actual por correo
    const [usuarioActual] = await conexion.promise().query(
      "SELECT ID_Usuario FROM usuario WHERE Correo_usu = ?",
      [correoUsuario]
    );

    if (usuarioActual.length === 0) {
      return res.status(400).json({ mensaje: "Usuario no encontrado" });
    }

    const idActual = usuarioActual[0].ID_Usuario;

    // Obtener chats donde el usuario es participante
    const [chats] = await conexion.promise().query(`
        SELECT c.ID_Chat, u.Username, u.Avatar_usu
        FROM chat c
        JOIN chat_usuario cu ON c.ID_Chat = cu.ID_Chat
        JOIN usuario u ON cu.ID_Usuario = u.ID_Usuario
        WHERE cu.ID_Usuario != ? AND c.ID_Chat IN (
            SELECT ID_Chat
            FROM chat_usuario
            WHERE ID_Usuario = ?
        )
        ORDER BY c.Fecha_Creacion DESC
    `, [idActual,idActual]);

    if (chats.length === 0) {
      return res.status(200).json({ mensaje: "No tienes chats disponibles", chats: [] });
    }

    // Formatear los chats con la última información relevante
    const formattedChats = chats.map(chat => ({
      ID_Chat: chat.ID_Chat,
       receiver: {//Este receiver se lo agregue para la videollamada
          name: chat.Username,
          img: chat.Avatar_usu,
          // Puedes incluir más campos si lo deseas
        },
      name: chat.Username, // Aquí debes asegurarte que estás obteniendo el nombre correctamente
      img: chat.Avatar_usu, // Y la imagen del usuario
      lastMessage: 'Último mensaje...', // Agrega lógica para obtener el último mensaje de cada chat
      lastMessageTime: 'hora'   // Agrega lógica para mostrar la hora del último mensaje
    }));

    return res.status(200).json({ chats: formattedChats });

  } catch (error) {
    console.error('Error al obtener chats:', error);
    return res.status(500).json({ mensaje: 'Error al obtener los chats' });
  }
});

router.get("/obtener-usuario/:correoUsuario", (req, res) => {
    const correoUsuario = req.params.correoUsuario;  // Cambié correoUsuario por Correo_Usu
  
    const sql = "SELECT * FROM usuario WHERE Correo_Usu = ?";
    conexion.promise().query(sql, [correoUsuario], (err, results) => {
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
      const [mensajes] = await conexion.promise().query(`
        SELECT 
          m.ID_Mensaje,
          m.TextoMensaje,
          m.HoraFecha_Mensaje,
          u.Username,
          u.Avatar_usu,
          u.ID_Usuario
        FROM mensaje m
        JOIN usuario u ON m.ID_Usuario = u.ID_Usuario
        WHERE m.ID_Chat = ?
        ORDER BY m.HoraFecha_Mensaje ASC
      `, [idChat]);
  
      return res.status(200).json({ mensajes });
    } catch (error) {
      console.error("Error al obtener mensajes:", error);
      return res.status(500).json({ error: "Error al obtener los mensajes" });
    }
  });

  router.post("/get-or-create-chat", async (req, res) => {
    const { emailCliente, idVendedor } = req.body;
  
    try {
      const [cliente] = await conexion.promise().query("SELECT ID_Usuario FROM usuario WHERE Correo_Usu = ?", [emailCliente]);
      const idCliente = cliente[0].ID_Usuario;
  
      // Buscar chat existente
      const [chatExistente] = await conexion.promise().query(`
        SELECT * FROM chat WHERE ID_Cliente = ? AND ID_Vendedor = ?
      `, [idCliente, idVendedor]);
  
      if (chatExistente.length > 0) {
        return res.json(chatExistente[0]);
      }
  
      // Crear nuevo chat si no existe
      const [nuevoChat] = await conexion.promise().query(`
        INSERT INTO chat (ID_Cliente, ID_Vendedor, FechaInicio)
        VALUES (?, ?, NOW())
      `, [idCliente, idVendedor]);
  
      const [chatCreado] = await conexion.promise().query(`
        SELECT * FROM chat WHERE ID_Chat = ?
      `, [nuevoChat.insertId]);
  
      return res.json(chatCreado[0]);
    } catch (err) {
      console.error("Error al obtener o crear chat:", err);
      res.status(500).send("Error del servidor");
    }
  });

// Ruta para enviar un mensaje
router.post("/send-message", (req, res) => {
    const { ID_Chat, ID_Usuario, TextoMensaje } = req.body;
  
    const sql = `
      INSERT INTO mensaje (ID_Chat, ID_Usuario, TextoMensaje)
      VALUES (?, ?, ?)
    `;
  
    conexion.query(sql, [ID_Chat, ID_Usuario, TextoMensaje], (err, result) => {
      if (err) {
        console.error("Error al enviar mensaje:", err);
        return res.status(500).json({ error: "Error al enviar mensaje" });
      }
  
    const messageId = result.insertId;
    const sqlGetMessage = `SELECT * FROM mensaje WHERE ID_Mensaje = ?`;
    conexion.query(sqlGetMessage, [messageId], (err, rows) => {
      if (err) {
        console.error("Error al obtener mensaje:", err);
        return res.status(500).json({ error: "Error al obtener mensaje" });
      }
      return res.status(200).json({ success: true, message: rows[0] });
    });
  });
});

module.exports = router;
