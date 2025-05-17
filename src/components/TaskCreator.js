import { useState } from 'react';

export const TaskCreator = ({ createNewTask }) => {
  const [newTaskName, setNewTaskName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTaskName.trim()) {
      createNewTask(newTaskName);
      setNewTaskName("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-creator-form">
      <input
        type="text"
        placeholder="Ingresa una nueva tarea"
        value={newTaskName}
        onChange={(e) => setNewTaskName(e.target.value)}
      />
      <button style="background-color: rgba(222, 219, 3, 0.7);" type="submit">Guardar tarea</button>
    </form>
  );
};