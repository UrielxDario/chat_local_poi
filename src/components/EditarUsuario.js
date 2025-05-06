import '../styles/EditarPerfil.css';
import React, { useState } from 'react';
import { ChevronDown } from "lucide-react";



const EditarPerfil = () => {
  const [formData, setFormData] = useState({
    avatar: 'https://sm.ign.com/t/ign_latam/cover/h/harry-pott/harry-potter-the-series_eh1b.300.jpg',
    username: 'Harry Potter',
    house: 'Gryffindor',
    role: '',
    bio: '',
    birthDate: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      avatar: URL.createObjectURL(file),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí podrías agregar la lógica para guardar los cambios, como hacer una llamada API con Node.js
    console.log('Datos guardados:', formData);
  };


    const [menuOpen, setMenuOpen] = useState(false);
  


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
        <h2>Editar Perfil</h2>
        
        {/* Avatar */}
        <div>
          <img
            src={formData.avatar || '/default-avatar.png'}
            alt="Avatar"
            className="perfil-avatar"
          />
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>

        {/* Formulario de Edición */}
        <form onSubmit={handleSubmit}>
          {/* Nombre de usuario */}
          <div>
            <label className="perfil-detalles">Nombre de Usuario</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          {/* Biografía */}
          <div>
            <label className="perfil-detalles">Biografía</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Escribe algo sobre ti"
            />
          </div>

          {/* Casa */}
          <div>
            <label className="perfil-detalles">Casa</label>
            <select
              name="house"
              value={formData.house}
              onChange={handleChange}
              required
            >
              <option value="Gryffindor">Gryffindor</option>
              <option value="Slitherin">Slytherin</option>
              <option value="Hufflepuff">Hufflepuff</option>
              <option value="Ravenclaw">Ravenclaw</option>
            </select>
          </div>

          {/* Rol */}
          <div>
            <label className="perfil-detalles">Rol</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="estudiante">Estudiante</option>
              <option value="maestro">Maestro</option>
              <option value="prefecto">Director</option>
            </select>
          </div>

          

          {/* Fecha de nacimiento */}
          <div>
            <label className="perfil-detalles">Fecha de Nacimiento</label>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
            />
          </div>

          {/* Botón de guardar */}
          <button type="submit" className="boton-magico">
            Guardar Cambios
          </button>
        </form>
      </div>
    </div>
    </>
  );
};

export default EditarPerfil;
