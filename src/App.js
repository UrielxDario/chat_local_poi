import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom"; 
import { useState } from "react";
import './App.css';

import { UserProvider } from "./UserContext";

import Recompensas from "./components/Recompensas";
import Login from "./components/Login";
import Register from "./components/Register";
import PerfilUsuario from "./components/PerfilUsuario";
import EditarUsuario from "./components/EditarUsuario";
import Chats from "./components/Chats";
import Tareas from "./components/Tareas";
import LlamadaVideo from "./components/Videollamada";
import VideoCall from './components/Videollamada';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (



  
<UserProvider>


     <Router>
      <Routes>
        {/* Login */}
        {/* Redirección desde "/" a "/login" */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Ruta para el Login */}
        <Route path="/login" element={<Login />} />
        
        
        {/*Recompensas */}
        <Route 
          path="/recompensas" 
          element={<Recompensas />} 
        />

        {/* Register */}
        <Route 
          path="/register" 
          element={<Register />} 
        />

         {/* PerfilUsuario */}
        
        <Route 
          path="/PerfilUsuario" 
          element={
            <PerfilUsuario 
              user={{
                avatar: "https://sm.ign.com/t/ign_latam/cover/h/harry-pott/harry-potter-the-series_eh1b.300.jpg",
                name: "Harry Potter",
                house: "Gryffindor",
                role: "Estudiante",
                bio: "Soy un Gryffindor, conocido por mi valentía y lealtad, siempre dispuesto a enfrentar lo imposible por aquellos que amo, y fui el único que logró sobrevivir al ataque de Lord Voldemort cuando era un bebé",
                rewards: ["Valentía", "Lealtad"]
              }} 
            />
          } 
        />

          {/* Editar Usuario */}
          <Route 
          path="/EditarUsuario" 
          element={<EditarUsuario />} 
        />
         
         {/* Chats */}
         <Route 
          path="/chats" 
          element={<Chats />} 
        />

          {/* Tareas */}
          <Route 
          path="/tareas" 
          element={<Tareas />} 
        />

          {/* VideoLLamada */}
          <Route 
          path="/videollamada" 
          element={<LlamadaVideo />} 
        />


        {/* Videollamada con Stream */}
        <Route 
        path="/stream-call/:callId" 
        element={<VideoCall />} />


      </Routes>
    </Router>
     </UserProvider>
  );
}

export default App;
