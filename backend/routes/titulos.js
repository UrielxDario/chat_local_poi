const express = require('express');
const router = express.Router();
const db = require('../db');

// Obtener todos los títulos desbloqueados de un usuario
router.get('/titulos/:idUsuario', async (req, res) => {
  const { idUsuario } = req.params;
  try {
    const [titulos] = await db.query(`
      SELECT t.ID_Titulo, t.Nombre_Titulo, t.Descripcion_Titulo
      FROM titulo t
      JOIN usuario_titulo ut ON t.ID_Titulo = ut.ID_Titulo
      WHERE ut.ID_Usuario = ?
    `, [idUsuario]);
    res.json(titulos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener títulos del usuario' });
  }
});

// Obtener el título activo de un usuario
router.get('/titulo-activo/:idUsuario', async (req, res) => {
  const { idUsuario } = req.params;
  try {
    const [resultado] = await db.query(`
      SELECT t.ID_Titulo, t.Nombre_Titulo, t.Descripcion_Titulo
      FROM titulo t
      JOIN usuario u ON t.ID_Titulo = u.Titulo_Activo
      WHERE u.ID_Usuario = ?
    `, [idUsuario]);
    res.json(resultado[0] || {});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener el título activo' });
  }
});

// Cambiar el título activo de un usuario
router.post('/cambiar-titulo', async (req, res) => {
  const { idUsuario, idTitulo } = req.body;
  try {
    await db.query(`
      UPDATE usuario SET Titulo_Activo = ? WHERE ID_Usuario = ?
    `, [idTitulo, idUsuario]);
    res.json({ mensaje: 'Título actualizado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al cambiar el título activo' });
  }
});

module.exports = router;