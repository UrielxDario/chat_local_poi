import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Titulos_Usuario = () => {
  const [titulos, setTitulos] = useState([]);
  const [tituloActivo, setTituloActivo] = useState(null);
  const [idUsuario, setIdUsuario] = useState(null);
  const correo = localStorage.getItem("correo");
  
  // Cargar títulos y título activo
  useEffect(() => {
    const fetchDatos = async () => {
      try {
        // Paso 1: Obtener los títulos desbloqueados del usuario (POST)
        const titulosRes = await axios.post(`${process.env.REACT_APP_API_URL}/api/titulos-por-correo`, {
          correoUsuario: correo
        });
        setTitulos(titulosRes.data);

        // Paso 2: Obtener ID del usuario (del mismo resultado)
        if (titulosRes.data.length > 0) {
          const idUsu = titulosRes.data[0].ID_Usuario || titulosRes.data[0].idUsuario; // por si viene incluido
          setIdUsuario(idUsu);

          // Paso 3: Obtener título activo
          const tituloActivoRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/titulo-activo/${idUsu}`);
          setTituloActivo(tituloActivoRes.data);
        }
      } catch (err) {
        console.error('Error al cargar datos del usuario:', err);
      }
    };

    fetchDatos();
  }, [correo]);

  // Cambiar título activo
  const cambiarTitulo = async (idTitulo) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/cambiar-titulo`, {
        idUsuario,
        idTitulo
      });

      const nuevoActivo = titulos.find(t => t.ID_Titulo === idTitulo);
      if (nuevoActivo) {
        setTituloActivo(nuevoActivo);
      }
    } catch (err) {
      console.error('Error al cambiar título:', err);
    }
  };


  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Tus títulos desbloqueados</h2>
      <ul className="space-y-2">
        {titulos.map((titulo) => (
          <li
            key={titulo.ID_Titulo}
            className={`p-2 rounded cursor-pointer border ${
              tituloActivo?.ID_Titulo === titulo.ID_Titulo
                ? 'bg-blue-100 border-blue-500 font-semibold'
                : 'hover:bg-gray-100 border-gray-300'
            }`}
            onClick={() => cambiarTitulo(titulo.ID_Titulo)}
          >
            <p>{titulo.Nombre_Titulo}</p>
            
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Titulos_Usuario;