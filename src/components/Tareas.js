import { useEffect, useState } from 'react';
import React from 'react';
import axios from 'axios';
import { ChevronDown } from "lucide-react";
import "../styles/Tareas.css";
import { TaskCreator } from './TaskCreator';
import { Link, useNavigate } from "react-router-dom";


export default function Tareas() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [taskItems, setTaskItems] = useState([]);
  const correo = localStorage.getItem("correo");
    


  useEffect(() => {

  if(!correo) return;
  
  axios.get(`${process.env.REACT_APP_API_URL}/api/tareas/${correo}`)
    .then(res => setTaskItems(res.data))
    .catch(err => console.error("Error al cargar tareas:", err));
}, [correo]);

function createNewTask(taskName) {
  axios.post(`${process.env.REACT_APP_API_URL}/api/tareas`, {
    correo: correo,
    Titulo_Tarea: taskName
  })
    .then(res => {
      setTaskItems([...taskItems, {
        ID_Tarea: res.data.id_tarea,
        Titulo_Tarea: taskName,
        Terminada: false
      }]);
    })
    .catch(err => console.error("Error al crear tarea:", err));
  }

  function toggleTaskStatus(taskId, currentStatus) {
  axios.put(`${process.env.REACT_APP_API_URL}/api/tareas/${taskId}`, {
    Terminada: !currentStatus
  })
    .then(() => {
      setTaskItems(taskItems.map(task =>
        task.ID_Tarea === taskId ? { ...task, Terminada: !currentStatus } : task
      ));
    })
    .catch(err => console.error("Error al actualizar tarea:", err));
}

  return (
    <div className="bg-dark-custom text-white min-vh-100">
      <nav className="navbar navbar-expand-lg navbar-dark shadow-sm">
        <h1 className="navbar-brand magic-title">TheWizardingCircle</h1>
        <div className="dropdown">
          <button className="btn usuario-titulo boton-magico" onClick={() => setMenuOpen(!menuOpen)}>
            Usuario <ChevronDown size={16} />
          </button>
          {menuOpen && (
            <ul className="dropdown-menu show position-absolute bg-light">
              <li><a className="dropdown-item" href="#">Mi Perfil</a></li>
              <li><a className="dropdown-item" href="#">Editar Perfil</a></li>
              <li><a className="dropdown-item" href="#">Tareas</a></li>
              <li><a className="dropdown-item" href="#">Recompensas</a></li>
              <li><a className="dropdown-item" ><Link to="/chats"> Chats</Link></a></li>
              <li><a className="dropdown-item text-danger" href="#">Cerrar Sesión</a></li>
            </ul>
          )}
        </div>
      </nav>

      <h1 className="navbar-brand magic-title">Lista de Tareas</h1>

      <TaskCreator createNewTask={createNewTask} />

      <table className="table text-white">
        <thead>
          <tr><th>Tarea</th><th>Hecha</th></tr>
        </thead>
        <tbody>
          {taskItems.map(task => (
            <tr key={task.ID_Tarea}>
              <td>{task.Titulo_Tarea}</td>
              <td>
                <input
                  type="checkbox"
                  checked={!!task.Terminada}
                  onChange={() => toggleTaskStatus(task.ID_Tarea, task.Terminada)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
