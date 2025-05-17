import { useEffect, useState } from 'react';
import React from 'react';
import axios from 'axios';
import { ChevronDown } from "lucide-react";
import "../styles/Tareas.css";
import { TaskCreator } from './TaskCreator';
import { Link, useNavigate } from "react-router-dom";


export default function Tareas() {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [taskItems, setTaskItems] = useState([]);
  const [correo, setCorreo] = useState(localStorage.getItem("correo") || "");
    
  useEffect(() => {
      const storedCorreo = localStorage.getItem("correo");
      if (storedCorreo) {
        setCorreo(storedCorreo);
        fetchTasks(storedCorreo)
      } else {
        navigate("/login"); // o tu ruta de inicio de sesión
      }
    }, []);

    

function fetchTasks(correo){
  if (!correo) {
    navigate("/login");  
    return;
  }
  
  axios.get(`${process.env.REACT_APP_API_URL}/api/tareas/${correo}`)
    .then(res => setTaskItems(res.data))
    .catch(err => console.error("Error al cargar tareas:", err));
}

 function createNewTask(taskName) {
    axios.post(`${process.env.REACT_APP_API_URL}/api/tareas`, {
      correo: correo,
      Titulo_Tarea: taskName
    })
      .then(() => fetchTasks(correo)) // <-- volver a cargar tareas desde el servidor
      .catch(err => console.error("Error al crear tarea:", err));
  }

  function toggleTaskStatus(taskId, currentStatus) {
    axios.put(`${process.env.REACT_APP_API_URL}/api/tareas/${taskId}`, {
      Terminada: !currentStatus
    })
      .then(() => fetchTasks(correo)) // <-- volver a cargar tareas actualizadas
      .catch(err => console.error("Error al actualizar tarea:", err));
  }

  function fetchIncompleteTasks() {
  axios.get(`${process.env.REACT_APP_API_URL}/api/tareas/${correo}`)
    .then(res => {
      const tareasPendientes = res.data.filter(task => !task.Terminada);
      setTaskItems(tareasPendientes);
    })
    .catch(err => console.error("Error al cargar tareas pendientes:", err));
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
              <li><button className="dropdown-item text-danger" onClick={() => {localStorage.removeItem("correo"); 
              navigate("/login"); }} > Cerrar Sesión </button> </li>
            </ul>
          )}
        </div>
      </nav>

      <h1 className="navbar-brand magic-title">Lista de Tareas</h1>

      <TaskCreator createNewTask={createNewTask} />
      
      <button className="btn btn-primary m-3" onClick={fetchIncompleteTasks}>
          Mostrar solo tareas pendientes
      </button>

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
