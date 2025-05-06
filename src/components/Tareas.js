import { useState } from 'react';
import React from 'react'
import { ChevronDown } from "lucide-react";
import "../styles/Tareas.css";
import { TaskCreator } from './TaskCreator';



export default function Tareas() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [TaskItems, setTaskItems] = useState([
    { name: 'mi primer tarea', done: false },
    { name: 'mi segunda tarea', done: false },
    { name: 'mi tercera tarea', done: false },
  ])


  function createNewTask(taskName) {
    if (!TaskItems.find(task => task.name === taskName)) {
      setTaskItems([...TaskItems, { name: taskName, done: false }])
    }
  }


  return (
    <div className=" bg-dark-custom text-white min-vh-100">
      <div >

        {/* Barra de Navegación */}
        <nav className="navbar navbar-expand-lg navbar-dark shadow-sm">
          <h1 className="navbar-brand magic-title" >
            TheWizardingCircle
          </h1>
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
                <li><a className="dropdown-item text-danger" href="#">Cerrar Sesión</a></li>
              </ul>
            )}
          </div>
        </nav>

        <h1 className="navbar-brand magic-title">Lista de Tareas</h1>

        <TaskCreator createNewTask={createNewTask} />

        <table>
          <thead>
            <tr class="encabezado">Tareas por hacer:</tr>

          </thead>
          <tbody>
            {
              TaskItems.map(task => (
                <tr key={task.name}>
                  <td>
                    {task.name}
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}
