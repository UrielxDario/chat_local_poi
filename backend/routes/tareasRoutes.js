const express = require('express');
const router = express.Router();
const db = require('../db'); // tu conexión MySQL

// Obtener tareas por correo
router.get('/:correo', (req, res) => {
  const correo = req.params.correo;

  const getUserQuery = 'SELECT ID_Usuario FROM usuario WHERE Correo_usu = ?';
  db.query(getUserQuery, [correo], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al buscar usuario' });
    if (results.length === 0) return res.status(404).json({ error: 'usuario no encontrado' });

    const userId = results[0].ID_Usuario;

    const getTasksQuery = 'SELECT * FROM Tarea WHERE ID_Usuario = ? AND Terminada = 0';
    db.query(getTasksQuery, [userId], (err, tareas) => {
      if (err) return res.status(500).json({ error: 'Error al obtener tareas' });
      res.json(tareas);
    });
  });
});

// Crear nueva tarea
router.post('/', (req, res) => {
  const { correo, Titulo_Tarea } = req.body;
  if (!correo || !Titulo_Tarea) return res.status(400).json({ error: 'Faltan datos requeridos' });

  const getUserQuery = 'SELECT ID_Usuario FROM usuario WHERE Correo_usu = ?';
  db.query(getUserQuery, [correo], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al buscar usuario' });
    if (results.length === 0) return res.status(404).json({ error: 'usuario no encontrado' });

    const userId = results[0].ID_Usuario;

    const insertQuery = 'INSERT INTO Tarea (ID_Usuario, Titulo_Tarea) VALUES (?, ?)';
    db.query(insertQuery, [userId, Titulo_Tarea], (err, result) => {
      if (err) return res.status(500).json({ error: 'Error al guardar la tarea' });
      res.json({ success: true, id_tarea: result.insertId });
    });
  });
});

// Actualizar tarea (terminada o no)
router.put('/:id', (req, res) => {
  const tareaId = req.params.id;
  const { Terminada } = req.body;

  const updateQuery = 'UPDATE Tarea SET Terminada = ? WHERE ID_Tarea = ?';
  db.query(updateQuery, [Terminada, tareaId], (err) => {
    if (err) return res.status(500).json({ error: 'Error al actualizar tarea' });
    res.json({ success: true });
  });
});

// Eliminar una tarea (opcional)
router.delete('/:id', (req, res) => {
  const tareaId = req.params.id;
  const deleteQuery = 'DELETE FROM Tarea WHERE ID_Tarea = ?';
  db.query(deleteQuery, [tareaId], (err) => {
    if (err) return res.status(500).json({ error: 'Error al eliminar tarea' });
    res.json({ success: true });
  });
});

module.exports = router;
