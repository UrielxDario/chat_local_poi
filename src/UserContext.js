// src/context/UserContext.js
import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Cargar user desde localStorage al iniciar
  useEffect(() => {
    const id = localStorage.getItem("id_usuario");
    const correo = localStorage.getItem("correo");

    if (id && correo) {
      setUser({ id, correo });
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useUser = () => useContext(UserContext);
