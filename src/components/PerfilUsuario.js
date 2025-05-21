import "../styles/PerfilUsuario.css";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ChevronDown } from "lucide-react";

export default function PerfilUsuario() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  const correoUsuario = localStorage.getItem("correo");

  useEffect(() => {
    if (correoUsuario) {
      axios
        .post(`${process.env.REACT_APP_API_URL}/api/info-usuario-por-correo`, { correoUsuario })
        .then((response) => {
          console.log("Respuesta del backend:", response.data);
          setUsuario(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error al obtener la info del usuario:', error);
          setLoading(false);
        });
    }
  }, [correoUsuario]);

  return (
    <>
      {/* Barra de Navegación */}
      <nav className="navbar navbar-expand-lg navbar-dark shadow-sm">
        <h1 className="navbar-brand magic-title">
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
                        <li><Link className="dropdown-item" to="/chats"> Chats</Link></li>
                        <li><button className="dropdown-item text-danger" onClick={() => {localStorage.removeItem("correo"); 
                        navigate("/login"); }} > Cerrar Sesión </button> </li>
                      </ul>
                    )}
        </div>
      </nav>

      {/* Perfil del Usuario */}
      <div className="perfil-usuario">
        {loading ? (
          <div className="perfil-cargando">Cargando perfil...</div>
        ) : usuario ? (
          <div className="perfil-contenedor">
            <img className="perfil-avatar" src={usuario.avatar} alt="Avatar del usuario" />
            <h2 className="perfil-nombre">{usuario.username}</h2>

            <div className="perfil-recompensas">
              <h3 className="perfil-titulo">Títulos desbloqueados</h3>
              {usuario.titulos && usuario.titulos.length >0?(
                usuario.titulos.map((titulo, index) => (
                  <span key={index} className="perfil-recompensa">{titulo.Nombre_Titulo}</span>
                ))
              ) : (
                <p>Este usuario aún no ha desbloqueado títulos.</p>
              )}
            </div>
          </div>
        ) : (
          <div className="perfil-error">No se pudo cargar la información del usuario.</div>
        )}
      </div>
    </>
  );
}
