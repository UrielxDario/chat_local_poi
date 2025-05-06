import { useState } from "react";
import { ChevronDown } from "lucide-react";
import '../styles/Recompensas.css';

export default function Recompensas() {
  const [menuOpen, setMenuOpen] = useState(false);

  const tareas = [
    { nombre: "Crea 5 chats", progreso: 3, total: 5, recompensa: "Marco para Avatar", imagen: require('../assets/imagenes/MarcoAvatarSeBusca.jpg') },
    { nombre: "Manda 50 mensajes", progreso: 10, total: 50, recompensa: "Color de mensajes", imagen: require('../assets/imagenes/ColorTextoDorado.jpg') },
    { nombre: "Cambia tu foto de perfil", progreso: 1, total: 1, recompensa: "Fondo para chats", imagen: require('../assets/imagenes/FondoChatCasas.jpg'), completado: true },
  ];

  return (
    <div className=" bg-dark-custom text-white min-vh-100">
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



      {/* Recompensas */}
      <div className="container py-5">
        <h2 className="text-center mb-4 text-light">Recompensas Magicas</h2>
        <div className="row">
          {tareas.map((tarea, index) => (
            <div key={index} className="col-md-6 mb-4">
              <div className="card p-3 bg-gradient border-0">
                <div className="d-flex align-items-center">
                  <div className="flex-grow-1">
                    <h5 className="card-title text-warning tarea-titulo">{tarea.nombre}</h5>
                    <p className="recompensa-texto">{tarea.recompensa}</p>

                    {!tarea.completado ? (
                      <div className="progreso-barra mt-2">
                        <div className="progreso-avance" role="progressbar" style={{ width: `${(tarea.progreso / tarea.total) * 100}%` }}></div>
                      </div>
                    ) : (
                      <button className="mt-2 rounded-pill boton-recompensa">Reclamar Recompensa</button>
                    )}
                    { }
                    <p className="medidor-recompensa">Tienes {tarea.progreso} de {tarea.total}</p>

                  </div>
                  <div className="text-center ms-3">
                    <img src={tarea.imagen} alt="Recompensa" className="recompensa-imagen" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
