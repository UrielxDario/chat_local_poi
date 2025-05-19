import "../styles/PerfilUsuario.css";
import React from 'react';
import { Wand, Star, Shield } from "lucide-react";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Titulos_Usuario from './Titulos_Usuario';

export default function PerfilUsuario ({user}) {
     const [menuOpen, setMenuOpen] = useState(false);
     //const correo = localStorage.getItem("correo");
      
  return (
    <>
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
      
    <div className="perfil-usuario">
       


      
    <div className="perfil-contenedor">
        <img className="perfil-avatar" src={user.avatar} alt="User Avatar" />
        <h2 className="perfil-nombre">{user.name}</h2>
        <p className="perfil-detalles">{user.house} - {user.role}</p>
        <p className="perfil-detalles">"{user.bio} "</p>

        <div className="perfil-recompensas">
        {user.rewards.map((reward, index) => (
            <span key={index} className="perfil-recompensa">{reward}</span>
        ))}

        <Titulos_Usuario />

        </div>

        <button className="perfil-boton-mensaje">Mandar Mensaje</button>

        <div className="perfil-logros">
        <h3>Logros Desbloqueados</h3>
        <div className="perfil-iconos">
            <Wand className="icono-logro" size={32} />
            <Star className="icono-logro" size={32} />
            <Shield className="icono-logro" size={32} />
        </div>
        </div>
    </div>
</div>
</>


  );
};

