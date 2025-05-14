import { useState } from "react";
import "../styles/Login.css";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!correo || !password) {
      alert("Necesitas una contraseña y un correo para entrar a Hogwarts");
      return;
    }

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
        Correo_Usu: correo,
        Contra_Usu: password,
      });

      const { acceso, mensaje } = res.data;

      if (acceso === "ok") {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("correo", correo);
        navigate("/Chats");
      } else if (acceso === "correo") {
        alert("Ese correo no aparece ni en el mapa del merodeador");
      } else if (acceso === "password") {
        alert("Fue un hechizo mal lanzado. La contraseña no coincide");
      }

    } catch (error) {
      console.error("Error al intentar iniciar sesión:", error);
      alert("Un Dementor se ha cruzado en el camino... inténtalo de nuevo.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="welcome-text">Bienvenido a</h2>
        <h1 className="site-title">TheWizardingCircle</h1>
        <p className="slogan">"Juro solemnemente que mis chats no son buenos"</p>
        <h3 className="login-title">Iniciar Sesión</h3>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Correo de usuario"
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

          <p className="btn-login">
            <button type="submit" className="link-button">Iniciar Sesión</button>
          </p>
        </form>

        <p className="register-text">¿No tienes una cuenta?</p>

        <Link to="/register" className="btn-register no-underline">
          Registrarse
        </Link>
      </div>
    </div>
  );
}
