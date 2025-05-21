import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const PerfilUsuarioExterno = () => {
  const { nombre } = useParams();
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (nombre) {
      axios
        .post(`${process.env.REACT_APP_API_URL}/api/info-usuario-por-nombre`, { nombreUsuario: nombre })
        .then((response) => {
          setUsuario(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error al obtener la info del usuario:', error);
          setLoading(false);
        });
    }
  }, [nombre]);

  return (
    <>
      {/* Barra de Navegación */}
      <nav className="navbar navbar-expand-lg navbar-dark shadow-sm">
        <h1 className="navbar-brand magic-title">TheWizardingCircle</h1>
        <div className="dropdown">
          <button className="btn usuario-titulo boton-magico">Usuario</button>
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
              {usuario.titulos && usuario.titulos.length > 0 ? (
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
};

export default PerfilUsuarioExterno;
