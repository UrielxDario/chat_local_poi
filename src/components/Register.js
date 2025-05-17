import { useState, useRef, useEffect } from "react";
import "../styles/Register.css";
import { Link, useNavigate  } from "react-router-dom";

import axios from "axios"; //Esto es para el servidor y probarlo de forma local


export default function Register() {
    const [usuario, setUsuario] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [fechaN, setFechaN] = useState("");
    const [correo, setCorreo] = useState("");
    const [house, setHouse] = useState("Gryffindor");
    const [role, setRole] = useState("estudiante");
    const [formData, setFormData] = useState({ avatar: null, avatarPreview: "" });


    const wrapperRef = useRef(null);
    const [scale, setScale] = useState(1);

    const navigate = useNavigate(); //Navegacion entre pantallas


    useEffect(() => {
      const handleResize = () => {
        const windowHeight = window.innerHeight;
        const boxHeight = wrapperRef.current?.offsetHeight || 0;
        const newScale = Math.min(1, windowHeight / boxHeight);
        setScale(newScale);
      };

      handleResize(); 
      window.addEventListener("resize", handleResize);

      return () => window.removeEventListener("resize", handleResize);
    }, []);


    const handleFileChange = (e) => {
      const file = e.target.files[0];
      setFormData({
        ...formData,
        avatar: URL.createObjectURL(file),
      });
    };

    //Para Subir el registro
    const handleRegister = async (e) => {
      e.preventDefault();
    
      // Validaciones
      if (!usuario || !correo || !password || !fechaN || !formData.avatar) {
        alert("¿Crees que puedes salirte con la tuya? Aún hay campos sin completar");
        return;
      }
    
      if (usuario.length < 4) {
        alert("Conjura un buen nombre, mayor a 4 caracteres");
        return;
      }
    
      if (!/^[A-Za-z0-9]{8,}$/.test(password)) {
        alert("Tu conjuro de seguridad es inservible Potter. Debe tener al menos 8 caracteres y solo contener letras y números.");
        return;
      }
    
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo) || !correo.endsWith(".com")) {
        alert("El ministerio de Magia no aceptaria ese correo. Debe tener un formato válido, contener '@' y terminar en '.com'.");
        return;
      }
    
      const fechaNacimiento = new Date(fechaN);
      const hoy = new Date();
      if (fechaNacimiento >= hoy) {
        alert("¿Usaste un giratiempo? No puedes venir del futuro, elige una fecha pasada");
        return;
      }


      const verificarCorreo = async () => {
        try {
          const respuesta = await axios.post(
            `${process.env.REACT_APP_API_URL}/api/auth/verificar-correo`,
            { Correo_Usu: correo }
          );
          return respuesta.data.existe;
        } catch (error) {
          console.error("Error al verificar correo:", error);
          return false; 
        }
      };

      const correoExiste = await verificarCorreo();
      if (correoExiste) {
        alert("¿Usaste Pocion Multijugos para pasarte por alguien mas?! Ese correo ya existe");
        return;
      }


    
      try {
        const formDataToSend = new FormData();
        formDataToSend.append("Username", usuario);
        formDataToSend.append("Correo_Usu", correo);
        formDataToSend.append("Contra_Usu", password);
        formDataToSend.append("FechaNacimiento_Usu", fechaN);
        formDataToSend.append("Casa_Usu", house);
        formDataToSend.append("Rol_Usu", role);
        formDataToSend.append("TextoBiografia_Usu", "");
        formDataToSend.append("avatar", formData.avatar); 
    
        const res = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/auth/register`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
    
        console.log(res.data);
        alert("¡Conjuro Realizado! Usuario registrado correctamente");
        navigate("/login");
    
      } catch (error) {
        if (error.response) {
          console.error("Respuesta del servidor:", error.response.data);
        } else if (error.request) {
          console.error("No hubo respuesta del servidor:", error.request);
        } else {
          console.error("Error al registrar:", error.message);
        }
    
        alert("Algo salió mal con tu registro. Intenta otra vez o consulta al Profesor Snape");
      }
    };
    
    
    

      
    
      return (
        <div class="login-container">
        <div
          className="scale-wrapper"
          ref={wrapperRef}
          style={{ transform: `scale(${scale})` }}
        >


        <div className="login-box">
            <h1 className="register-title">REGISTRO</h1>
            <h2 className="welcome-text">Estás a un paso de formar parte de:</h2>
            <h1 className="site-title">TheWizardingCircle</h1>
            <h2 className="welcome-text">Rellena la siguiente informacion:</h2>
        <form onSubmit={handleRegister}> 
        <input
            type="text"
            placeholder="Nombre de usuario"
            className="input-field"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />
          <input
            type="mail"
            placeholder="Correo"
            className="input-field"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />

          <input
            type="password"
            placeholder="Contraseña"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label className="select-label">Fecha de Nacimiento</label>
          <input
            type="date"
            placeholder="Fecha de Nacimiento"
            className="input-field"
            value={fechaN}
            onChange={(e) => setFechaN(e.target.value)}
          />
         
              {/* Casa */}
              <div>
                <label className="select-label">Casa</label>
                <select
                  className="input-select"
                  value={house}
                  onChange={(e) => setHouse(e.target.value)}
                  required
                >
                  <option value="Gryffindor">Gryffindor</option>
                  <option value="Slytherin">Slytherin</option>
                  <option value="Hufflepuff">Hufflepuff</option>
                  <option value="Ravenclaw">Ravenclaw</option>
                </select>
              </div>

              {/* Rol */}
              <div>
                <label className="select-label">Rol</label>
                <select
                  className="input-select"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                >
                  <option value="estudiante">Estudiante</option>
                  <option value="maestro">Maestro</option>
                </select>
              </div>
         
         {/* Avatar */}
         <div className="avatar-container">
         <label className="select-label">Avatar</label>
         <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const previewURL = URL.createObjectURL(file);
                setFormData({
                  ...formData,
                  avatar: file,
                  avatarPreview: previewURL,
                });
              }
            }}
          />


          <img
            src={formData.avatarPreview || '/default-avatar.png'}
            className="perfil-avatar"
          />

        </div>
         
                    {/*  <button type="reset" className="btn-register">Resetear</button> */}

                    <button type="submit" className="btn-register">Registrar</button>


            <div class="register-link">
                <p className="register-text">Ya tienes una cuenta?
                <Link to="/login">Login</Link>
                </p>
            </div>

        </form>

        </div>
        </div>

    </div>
      );

}