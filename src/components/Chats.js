import React from "react";
import { ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "tailwindcss/tailwind.css";

import hedwigImg from "../assets/imagenes/hedwing.jpg";
import dobbyImg from "../assets/imagenes/dobby.jpg";
import harryImg from "../assets/imagenes/HarryPotter.jpg";

//para la llamada
import socket from './socket';
import { useUser } from "../UserContext";
import axios from "axios";



const dummycontacts = [
  { name: "Hedwig", img: hedwigImg },
  { name: "Dobby", img: dobbyImg },
];

const dummymessages = [
  {
    name: "Hedwig la Lechuza",
    img: hedwigImg,
    text: "Lorem ipsum dolor sit amet consectetur.",
    time: "09:55 am",
    sent: false,
  },
  {
    name: "Harry Potter",
    img: harryImg,
    text: "Lorem ipsum dolor sit amet consectetur.",
    time: "09:55 am",
    sent: true,
  },
];


const ChatComponent = () => {

  const navigate = useNavigate();

  //Para Cerrar Sesion
const cerrarSesion = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("correo");
  navigate("/"); 
};

  const [menuOpen, setMenuOpen] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [esGrupal, setEsGrupal] = useState(false);
  const [usuariosSeleccionados, setUsuariosSeleccionados] = useState([]);
  const [nombreGrupo, setNombreGrupo] = useState('');
  const [usuariosDisponibles, setUsuariosDisponibles] = useState([]);
  
  const [selectedContact, setSelectedContact] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);


  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState([]);
  const [messagesByChat, setMessagesByChat] = useState({});

  const correoUsuario = localStorage.getItem("correo");


  //Para la llamada
    const { user } = useUser(); // acceder al usuario global

  const [incomingCall, setIncomingCall] = useState(null);
  const [chatSeleccionado, setChatSeleccionado] = useState(null);
const [receptorId, setReceptorId] = useState(null);
const [mensajes, setMensajes] = useState([]);


  
  
  useEffect(() => {
    if (mostrarModal) {
      const correoUsuario = localStorage.getItem("correo");
  
      fetch(`https://poi-back-igd5.onrender.com/api/usuarios-disponibles/${correoUsuario}?esGrupal=${esGrupal}`)
        .then((res) => res.json())
        .then((data) => {
          setUsuariosDisponibles(data);
        })
        .catch((error) => console.error("Error al obtener usuarios:", error));
    }
  }, [mostrarModal, esGrupal]);
  
  useEffect(() => {
    const correoUsuario = localStorage.getItem("correo");
    if (correoUsuario) {
      fetch(`https://poi-back-igd5.onrender.com/api/obtener-usuario/${correoUsuario}`)
  .then((res) => {
    if (res.ok) {
      return res.json(); // Solo procesar como JSON si la respuesta es exitosa
    } else {
      throw new Error('No se pudo obtener los datos del usuario');
    }
  })
  .then((data) => {
    if (data.usuario) {
      setCurrentUser(data.usuario);
      
    } else {
      console.error('Usuario no encontrado');
    }
  })
  .catch((error) => console.error('Error al obtener los datos del usuario:', error));
    }
  }, []);
  


  const usuariosDummy = [
    { id: 1, nombre: 'Harry Potter' },
    { id: 2, nombre: 'Hermione Granger' },
    { id: 3, nombre: 'Ron Weasley' },
    { id: 4, nombre: 'Luna Lovegood' },
  ];

  const toggleUsuario = (idUsuario) => {
    setUsuariosSeleccionados((prev) => {
      if (prev.includes(idUsuario)) {
        return prev.filter((id) => id !== idUsuario);
      } else {
        return esGrupal ? [...prev, idUsuario] : [idUsuario]; // Solo uno si es individual
      }
    });
  };
  

  const crearChat = async () => {
    if (!esGrupal && usuariosSeleccionados.length !== 1) {
      alert("Selecciona exactamente 1 usuario para un chat individual.");
      return;
    }
  
    if (esGrupal && (usuariosSeleccionados.length < 2 || nombreGrupo.trim() === "")) {
      alert("Para un grupo, selecciona al menos 2 usuarios y ponle nombre.");
      return;
    }
  
    try {
      const response = await fetch("https://poi-back-igd5.onrender.com/crear-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          esGrupal,
          usuarios: usuariosSeleccionados,
          nombreGrupo,
          correoUsuario: correoUsuario,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert(data.mensaje || "Chat creado con éxito.");
        setMostrarModal(false); // Cierra el modal al crear el chat
        setUsuariosSeleccionados([]);
        setNombreGrupo("");
        setEsGrupal(false);
        // Aquí puedes recargar la lista de chats si quieres
      } else {
        alert("Error: " + (data.mensaje || "Algo salió mal al crear el chat."));
      }
    } catch (error) {
      console.error("Error al crear el chat:", error);
      alert("Ocurrió un error al intentar crear el chat. Detalles: " + error.message);
    }
  };

  useEffect(() => {
    // Solicitar los chats al backend
    const fetchChats = async () => {
      try {
        const response = await fetch(`https://poi-back-igd5.onrender.com/obtener-chats?correoUsuario=${correoUsuario}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (data.chats) {
            setContacts(data.chats);
        } else {
          setContacts([]);  // Si no hay chats, la lista está vacía
        }
      } catch (error) {
        console.error('Error al cargar los chats:', error);
      }
    };

    fetchChats();
  }, [correoUsuario]);

  useEffect(() => {
    if (selectedContact?.ID_Chat) {
      // Si hay un contacto seleccionado y tiene un ID de chat válido, obtenemos los mensajes
      fetch(`https://poi-back-igd5.onrender.com/api/obtener-mensajes/${selectedContact.ID_Chat}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.mensajes) {
            setMessagesByChat((prevMessages) => ({
              ...prevMessages,
              [selectedContact.ID_Chat]: data.mensajes,
            }));
          } else {
            console.error('No se encontraron mensajes para este chat');
          }
        })
        .catch((err) => console.error("Error al obtener mensajes:", err));
    }
  }, [selectedContact]); 
  
  const mensajesActuales = selectedContact ? messagesByChat[selectedContact.ID_Chat] || [] : [];
  
  const handleSelectContact = async (contact) => {
    setSelectedContact(contact);
  
    if (!messagesByChat[contact.ID_Chat]) {
      try {
        const response = await fetch(`https://poi-back-igd5.onrender.com/obtener-mensajes/${contact.ID_Chat}`);
        const data = await response.json();
  
        if (response.ok) {
          setMessagesByChat(prev => ({
            ...prev,
            [contact.ID_Chat]: data.mensajes,  
          }));
        }
      } catch (error) {
        console.error("Error al obtener mensajes:", error);
      }
    }
  };
  

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedContact) return;
  
    try {
      const response = await fetch("https://poi-back-igd5.onrender.com/send-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ID_Chat: selectedContact.ID_Chat,
          ID_Usuario: currentUser.ID_Usuario,
          TextoMensaje: messageText,
        }),
      });
  
      const data = await response.json();
  
      if (data.success) {
        const newMessage = {
          id: data.messageId,
          sent: true,
          name: currentUser.Username,
          text: messageText,
          img: currentUser.avatar,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
  
        setMessagesByChat(prev => ({
          ...prev,
          [selectedContact.ID_Chat]: [...(prev[selectedContact.ID_Chat] || []), newMessage],
        }));
        setMessageText(""); // limpiar input
      }
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
    }
  };


  //Handle para la llamada
 const handleStartCall = () => {
  if (!chatSeleccionado || !receptorId) return;

  const callId = `llamada-${user.id}-${receptorId}-${Date.now()}`;

  socket.emit('startCall', {
    senderId: user.id,
    receiverId: receptorId,
    callId,
  });

  navigate(`/stream-call/${callId}`);
};



useEffect(() => {
  if (!user?.id) return;

  // Registrar al usuario al conectar
  socket.emit("registerUser", user.id);

  // Escuchar llamadas entrantes
  socket.on(`incomingCall-${user.id}`, ({ senderId, callId }) => {
    setIncomingCall({ sender: senderId, callId });
  });

  return () => {
    socket.off(`incomingCall-${user.id}`);
  };
}, [user]);

//Handle para seleccionar el chat y su id del otro usuario
const handleSelectChat = async (chat) => {
  try {
    // Cargar mensajes
    const mensajesRes = await axios.get(`/api/obtener-mensajes/${chat.ID_Chat}`);
    setMensajes(mensajesRes.data.mensajes);
    setChatSeleccionado(chat);

    // Cargar receptor
    const receptorRes = await axios.get(`/api/obtener-receptor/${chat.ID_Chat}/${user.correo}`);
    setReceptorId(receptorRes.data.receptorId);

  } catch (error) {
    console.error("Error al cargar el chat o receptor:", error);
  }
};









  return (
    <div>
    {/* Barra de navegación */}
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
            <li onClick={cerrarSesion} className="dropdown-item text-danger" style={{ cursor: "pointer" }}>
  Cerrar Sesión
</li>
          </ul>
        )}
      </div>
    </nav>

    <section className="h-screen flex overflow-hidden">
      

      <div className="bg-red-800 w-3/12 p-6">{/* CONTACTOS */}
        <h3 className="text-2xl mb-8 text-white">Chat en línea</h3>

        {/* Nuevo Chat Boton */}
        <div className="flex overflow-auto w-full mb-8">
          <button
          onClick={() => setMostrarModal(true)}
          className="ml-auto bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded"
        >
          Nuevo Chat
        </button>
        </div>

        {/* Lista de contactos */}
        <div className="overflow-auto h-4/6">
          {contacts.length === 0 ? (
            <p>No tienes chats disponibles</p>
          ) : (
            contacts.map((contacts, index) => (
              <div key={index} className="flex bg-red-900 rounded-lg p-4 mb-4 hover:bg-red-800 transition-colors duration-200" onClick={() => handleSelectContact(contacts)}>
                <img src={`https://poi-back-igd5.onrender.com${contacts.img}`} className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 mr-4 border-2 border-yellow-300" alt={contacts.name} />
                <div className="w-full overflow-hidden">
                  <div className="flex mb-1">
                    <a className="flex-grow text-yellow-200 hover:text-yellow-400 transition-colors duration-200 font-medium cursor-pointer">{contacts.name}</a>
                    <small className="font-light text-gray-300">{contacts.lastMessageTime}</small>
                  </div>
                  <small className="overflow-ellipsis overflow-hidden whitespace-nowrap block font-light text-gray-300">
                    {contacts.lastMessage}
                  </small>
                </div>
              </div>
            ))
          )}
        </div>
    </div>

      <div className="bg-yellow-200 w-9/12">{/* CHAT */}
      <div className="px-20 py-6 border-b">{/* HEADER */}
        <div className="flex">
          <div className="flex flex-grow">
            <div className="relative w-12 h-12 mr-4">
              <img
                src={
                  selectedContact
                    ? `https://poi-back-igd5.onrender.com${selectedContact.img}`
                    : ''
                }
                
                className="rounded-full w-12 h-12 object-cover"
              />
              <div className="absolute bg-green-300 p-1 rounded-full bottom-0 right-0 border-gray-800 border-2"></div>
            </div>
            <div className="self-center">
              <p className="font-medium">
                {selectedContact ? selectedContact.name : "Selecciona un contacto"}
              </p>
              
            </div>
          </div>
        </div>
      </div>


          <div className="py-6 px-20 overflow-auto h-3/4">{/* MENSAJES */}
          {mensajesActuales.map((messagesByChat , index) => {
            console.log(messagesByChat); // Esto debería mostrar el mensaje en consola
            return (
              <div key={index} className={`flex mb-12 ${messagesByChat.sent ? "flex-row-reverse" : ""}`}>
                <img src={`https://poi-back-igd5.onrender.com${messagesByChat.Avatar_usu}`} className="w-10 h-10 rounded-full" alt="User avatar" />
                <div className="bg-white rounded-lg p-4 max-w-xs shadow">
                  <p>{messagesByChat.TextoMensaje}</p> {/* Asegúrate de que message.text no esté vacío */}
                </div>
              </div>
            );
          })}
          </div>

          {/* MessageBar */}
          <div className="py-6 px-20 flex border-t">
            <div className="flex items-center w-full">
             <button
                className="bg-red-700 text-yellow-200 rounded px-4 py-2"
                onClick={handleStartCall}
              >
                <i className="fas fa-phone-alt"></i>
              </button>


              <button className="bg-red-700 text-yellow-200 rounded px-4 py-2 ml-4 mr-4">
                <i className="fas fa-paperclip"></i>
              </button>

              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="px-4 py-2 border-gray-100 w-full focus:outline-none font-light ml-4"
                placeholder="Escribe tu mensaje..."
              />

              <button
                className="bg-red-700 text-yellow-200 rounded px-4 py-2 ml-4"
                onClick={handleSendMessage}
              >
                Enviar
              </button>
            </div>
          </div>

      </div>
    </section>


      {/* VENTANA MODAL PARA NUEVO CHAT */}

    {mostrarModal && (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-yellow-500 rounded-xl shadow-lg w-full max-w-lg p-6 relative">
          <h2 className="text-2xl font-bold mb-4">Crear Nuevo Chat</h2>

          {/* Check grupal */}
          <div className="mb-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={esGrupal}
                onChange={(e) => {
                  setEsGrupal(e.target.checked);
                  setUsuariosSeleccionados([]); // Reiniciar selección
                }}
              />
              <span>¿El Chat será Grupal?</span>
            </label>
          </div>

          {/* Input nombre del grupo */}
          {esGrupal && (
            <div className="mb-4">
              <label className="block font-semibold mb-1">Nombre del Grupo:</label>
              <input
                type="text"
                value={nombreGrupo}
                onChange={(e) => setNombreGrupo(e.target.value)}
                className="w-full px-4 py-2 border rounded"
                placeholder="Ej: La Orden Del Fénix"
              />
            </div>
          )}

          {/* Lista de usuarios */}
          <div className="mb-4 max-h-48 overflow-y-auto border rounded p-2">
            {usuariosDisponibles.map((usuario) => (
              <label key={usuario.ID_Usuario} className="flex items-center space-x-2 mb-2">
                <input
                  type="checkbox"
                  checked={usuariosSeleccionados.includes(usuario.ID_Usuario)}
                  onChange={() => toggleUsuario(usuario.ID_Usuario)}
                  disabled={!esGrupal && usuariosSeleccionados.length === 1 && !usuariosSeleccionados.includes(usuario.ID_Usuario)}
                />
                <span>{usuario.Username}</span>
              </label>
            ))}

          </div>

          {/* Botones */}
          <div className="flex justify-end mt-4 space-x-4">
            <button
              onClick={() => setMostrarModal(false)}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            >
              Cerrar
            </button>
            <button
              onClick={crearChat}
              className="px-4 py-2 rounded bg-red-800 hover:bg-yellow-700 text-black font-semibold"
              disabled={!esGrupal && usuariosSeleccionados.length !== 1}
            >
              Crear
            </button>
          </div>
        </div>
      </div>
    )}




   {/* Notificacion llamada entrante */}
      {incomingCall && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md text-center">
            <p className="mb-4 font-semibold">
              📞 {incomingCall.sender} un alma se quiere comunicar contigo...
            </p>
            <div className="flex justify-center space-x-4">
              <button
                className="bg-green-600 text-white px-4 py-2 rounded"
                onClick={() => {
                  navigate(`/stream-call/${incomingCall.callId}`);
                  setIncomingCall(null);
                }}
              >
                Aceptar
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded"
                onClick={() => setIncomingCall(null)}
              >
                Rechazar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>

  );
};

export default ChatComponent;
