import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Titulos_Usuario = ({ idUsuario }) => {
  const [titulos, setTitulos] = useState([]);
  const [tituloActivo, setTituloActivo] = useState(null);

  // Cargar títulos desbloqueados del usuario
  useEffect(() => {
    const fetchTitulos = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/titulos/${idUsuario}`);
        setTitulos(res.data);
      } catch (err) {
        console.error('Error cargando títulos:', err);
      }
    };

    const fetchTituloActivo = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/titulo-activo/${idUsuario}`);
        setTituloActivo(res.data);
      } catch (err) {
        console.error('Error cargando título activo:', err);
      }
    };

    fetchTitulos();
    fetchTituloActivo();
  }, [idUsuario]);

  // Cambiar título activo
  const cambiarTitulo = async (idTitulo) => {
    try {
      await axios.post('http://localhost:3001/api/cambiar-titulo', {
        idUsuario,
        idTitulo
      });
      setTituloActivo(titulos.find(t => t.ID_Titulo === idTitulo));
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
            <small className="text-gray-500">{titulo.Descripcion_Titulo}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Titulos_Usuario;