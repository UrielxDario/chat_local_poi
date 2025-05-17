import { useEffect, useState } from 'react';
import React from 'react';
import axios from 'axios';
import { ChevronDown } from "lucide-react";
import "../styles/Tareas.css";
import { TaskCreator } from './TaskCreator';
import { Link, useNavigate } from "react-router-dom";


export default function Tareas() {
  const [tareas, setTareas] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const correo = localStorage.getItem("correo");
  
  const obtenerTareas = () => {
    axios.get(`https://poi-back-igd5.onrender.com/api/tareas/${correo}`)
      .then(response => setTareas(response.data))
      .catch(error => console.error("Error al obtener tareas:", error));
  };

  useEffect(() => {
    obtenerTareas();
  }, []);  

  const filtrarIncompletas = () => {
    setTareas(tareas.filter(tarea => !tarea.Terminada));
  };

  

function createNewTask(taskName) {
  axios.post(`https://poi-back-igd5.onrender.com/api/tareas`, {
      correo: correo,
      Titulo_Tarea: taskName
    })
      .then(res => {
        // Si el backend responde con la tarea completa
        setTareas(prev => [...prev, res.data]);
        // Si no, puedes hacer otro GET o agregarla manualmente
      })
      .catch(err => console.error("Error al crear tarea:", err));
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
              <li> <Link className="dropdown-item" to="/chats">Chats</Link></li>
              <li><a className="dropdown-item text-danger" href="#">Cerrar Sesión</a></li>
            </ul>
          )}
        </div>
      </nav>

      <h1 className="navbar-brand magic-title">Lista de Tareas</h1>

      <TaskCreator createNewTask={createNewTask} />

      <div className="container py-4">
        <h1 className="magic-title">Lista de Tareas</h1>

        <TaskCreator createNewTask={createNewTask} />

        <div className="contenedor-tareas mt-4">
          <h2>Mis tareas</h2>
          <div className="botones mb-3">
            <button className="btn btn-light me-2" onClick={obtenerTareas}>🔄 Refrescar</button>
            <button className="btn btn-outline-warning" onClick={filtrarIncompletas}>❌ Solo incompletas</button>
          </div>

          <ul className="lista-tareas list-group">
            {tareas.map((tarea, index) => (
              <li key={index} className={`list-group-item ${tarea.Terminada ? 'list-group-item-success' : 'list-group-item-danger'}`}>
                {tarea.Titulo_Tarea}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}


