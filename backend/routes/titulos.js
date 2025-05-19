const express = require('express');
const router = express.Router();
const db = require('../db');

// Obtener todos los títulos desbloqueados de un usuario a partir de su correo
router.post('/titulos-por-correo', (req, res) => {
  const { correoUsuario } = req.body;

  db.query('SELECT ID_Usuario FROM usuario WHERE Correo_usu = ?', [correoUsuario], (err, usuario) => {
    if (err) {
      console.error('Error al consultar el usuario:', err);
      return res.status(500).json({ error: 'Error al consultar el usuario' });
    }

    if (usuario.length === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    const idUsuario = usuario[0].ID_Usuario;

    db.query(
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

        res.json(titulos);
      }
    );
  });
});

// Obtener el título activo de un usuario
router.get('/titulo-activo/:idUsuario', async (req, res) => {
  const { idUsuario } = req.params;

  db.query(
    `
    SELECT t.ID_Titulo, t.Nombre_Titulo
    FROM titulo t
    JOIN titulo_usuario u ON t.ID_Titulo = u.ID_Titulo
    WHERE u.ID_Usuario = ?
  `,
    [idUsuario],
    (err, resultado) => {
      if (err) {
        console.error('Error al obtener título activo:', err);
        return res.status(500).json({ error: 'Error al obtener el título activo' });
      }

      res.json(resultado[0] || {});
    }
  );
});

// Cambiar el título activo de un usuario
router.post('/cambiar-titulo', (req, res) => {
  const { idUsuario, idTitulo } = req.body;

  db.query(
    `
    UPDATE usuario SET Titulo_Activo = ? WHERE ID_Usuario = ?
  `,
    [idTitulo, idUsuario],
    (err, result) => {
      if (err) {
        console.error('Error al cambiar el título activo:', err);
        return res.status(500).json({ error: 'Error al cambiar el título activo' });
      }

      res.json({ mensaje: 'Título actualizado correctamente' });
    }
  );
});

module.exports = router;