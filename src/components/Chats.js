import React from "react";
import { useRef } from "react";
import { ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import "tailwindcss/tailwind.css";

import hedwigImg from "../assets/imagenes/hedwing.jpg";
import dobbyImg from "../assets/imagenes/dobby.jpg";
import harryImg from "../assets/imagenes/HarryPotter.jpg";

//para la llamada
import socket from './socket';
import { useUser } from "../UserContext";
import axios from "axios";

//para la llamada ahora si bien
import { db } from '../firebase'; 
import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  onSnapshot,
  addDoc,
  deleteDoc 
} from 'firebase/firestore';

//Servidores stun para la llamada ahora si bien
const servers = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ],
  iceCandidatePoolSize: 10,
};



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
  const [usarEncriptacion, setUsarEncriptacion] = useState(false);

  const correoUsuario = localStorage.getItem("correo");

  const messagesEndRef = useRef(null);

  //Para la llamada
const [mostrarControlesVideo, setMostrarControlesVideo] = useState(false);





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
        await fetchChats();
        
      } else {
        alert("Error: " + (data.mensaje || "Algo salió mal al crear el chat."));
      }
    } catch (error) {
      console.error("Error al crear el chat:", error);
      alert("Ocurrió un error al intentar crear el chat. Detalles: " + error.message);
    }
  };

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
      setContacts([]);
    }
  } catch (error) {
    console.error('Error al cargar los chats:', error);
  }
  };

  // Cargar chats al montar el componente
  useEffect(() => {
    fetchChats();
  }, [correoUsuario]);


  useEffect(() => {
  const intervalo = setInterval(() => {
    if (selectedContact?.ID_Chat) {
      fetch(`https://poi-back-igd5.onrender.com/api/obtener-mensajes/${selectedContact.ID_Chat}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.mensajes) {
            setMessagesByChat((prevMessages) => ({
              ...prevMessages,
              [selectedContact.ID_Chat]: data.mensajes,
            }));
          }
        })
        .catch((err) => console.error("Error al obtener mensajes:", err));
    }
  }, 2000); // cada 2 segundos

  return () => clearInterval(intervalo); // Limpiar el intervalo al desmontar
}, [selectedContact]);

  
  
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
  
  useEffect(() => {
  if (messagesEndRef.current) {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }
}, [messagesByChat[selectedContact?.ID_Chat]]);

const claveSecreta = "clave-super-secreta"; // Puedes cambiarla por algo más seguro

const encriptarMensaje = (mensaje) => {
  return CryptoJS.AES.encrypt(mensaje, claveSecreta).toString();
};

const desencriptarMensaje = (mensajeEncriptado) => {
  try {
    const bytes = CryptoJS.AES.decrypt(mensajeEncriptado, claveSecreta);
    const texto = bytes.toString(CryptoJS.enc.Utf8);

    // Si la desencriptación falla, devuelve el mensaje original
    if (!texto) return mensajeEncriptado;

    return texto;
  } catch (e) {
    return mensajeEncriptado; // Por si no está encriptado
  }
};


  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedContact) return;
    const textoFinal = usarEncriptacion
    ? encriptarMensaje(messageText)
    : messageText;

    try {
      const response = await fetch("https://poi-back-igd5.onrender.com/send-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ID_Chat: selectedContact.ID_Chat,
          ID_Usuario: currentUser.ID_Usuario,
          TextoMensaje: textoFinal,
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
        console.log("Nuevo mensaje:", newMessage);
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

const mensajesActuales = selectedContact ? messagesByChat[selectedContact.ID_Chat] || [] : [];
  



////////PARA LA LLAMADA AHORA SI BIEN DE AQUI PA ABAJO

//para esconder o mostrar todo esto
////////PARA LA LLAMADA AHORA SI BIEN DE AQUI PA ABAJO
 const [callId, setCallId] = useState('');
  const [pc] = useState(new RTCPeerConnection(servers));
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const localStream = useRef(null);
  const remoteStream = useRef(new MediaStream());

  const startWebcam = async () => {
    localStream.current = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

    localStream.current.getTracks().forEach(track => {
      pc.addTrack(track, localStream.current);
    });

    pc.ontrack = (event) => {
      event.streams[0].getTracks().forEach(track => {
        remoteStream.current.addTrack(track);
      });
    };

    localVideoRef.current.srcObject = localStream.current;
    remoteVideoRef.current.srcObject = remoteStream.current;
  };

  const createCall = async () => {
    const callDoc = doc(collection(db, 'calls'));
    const offerCandidates = collection(callDoc, 'offerCandidates');
    const answerCandidates = collection(callDoc, 'answerCandidates');

    setCallId(callDoc.id);

    // ICE candidates
    pc.onicecandidate = async (event) => {
      if (event.candidate) {
        await addDoc(offerCandidates, event.candidate.toJSON());
      }
    };

    const offerDescription = await pc.createOffer();
    await pc.setLocalDescription(offerDescription);

    const offer = {
      sdp: offerDescription.sdp,
      type: offerDescription.type,
    };

    await setDoc(callDoc, { offer });

    // Listen for answer
    onSnapshot(callDoc, (snapshot) => {
      const data = snapshot.data();
      if (!pc.currentRemoteDescription && data?.answer) {
        const answerDescription = new RTCSessionDescription(data.answer);
        pc.setRemoteDescription(answerDescription);
      }
    });

    // Listen for remote ICE
    onSnapshot(answerCandidates, (snapshot) => {
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          const data = change.doc.data();
          pc.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    });
  };

  const answerCall = async () => {
    const callDoc = doc(db, 'calls', callId);
    const offerCandidates = collection(callDoc, 'offerCandidates');
    const answerCandidates = collection(callDoc, 'answerCandidates');

    pc.onicecandidate = async (event) => {
      if (event.candidate) {
        await addDoc(answerCandidates, event.candidate.toJSON());
      }
    };

    const callData = (await getDoc(callDoc)).data();

    const offerDescription = callData.offer;
    await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));

    const answerDescription = await pc.createAnswer();
    await pc.setLocalDescription(answerDescription);

    const answer = {
      type: answerDescription.type,
      sdp: answerDescription.sdp,
    };

    await updateDoc(callDoc, { answer });

    // Listen for remote ICE
    onSnapshot(offerCandidates, (snapshot) => {
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          const data = change.doc.data();
          pc.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    });
  };


  const colgarLlamada = async () => {
  // Detener cámara y micrófono
  if (localStream.current) {
    localStream.current.getTracks().forEach(track => track.stop());
    localStream.current = null;
  }

  // Limpiar los elementos de video
  if (localVideoRef.current) {
    localVideoRef.current.srcObject = null;
  }
  if (remoteVideoRef.current) {
    remoteVideoRef.current.srcObject = null;
  }

  // Cerrar la conexión WebRTC
  if (pc) {
    pc.close();
  }

  // Ocultar la modal
  setMostrarControlesVideo(false);

  // (Opcional) Borrar el documento de Firestore de la llamada
  if (callId) {
    const callDoc = doc(db, 'calls', callId);
    await deleteDoc(callDoc);
    setCallId('');
  }
};




  
////////PARA LA LLAMADA DE AQUI PA ARRIBA


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
            <li><Link className="dropdown-item" to="/PerfilUsuario">Mi Perfil</Link></li> 
            <li><a className="dropdown-item" href="#">Editar Perfil</a></li>
            <li><Link className="dropdown-item" to="/tareas"> Tareas</Link></li>
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
                <img src={`${contacts.img}`} className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 mr-4 border-2 border-yellow-300" alt={contacts.name} />
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
                    ? `${selectedContact.img}`
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


          <div className="py-6 px-20 overflow-y-auto h-3/4">{/* MENSAJES */}
           {mensajesActuales.map((message , index) => {
            console.log(message); // Esto debería mostrar el mensaje en consola
            return (
              <div key={index} className={`flex mb-12 ${message.sent ? "flex-row-reverse" : ""}`}>
                <img src={message.Avatar_Blob} className="w-10 h-10 rounded-full" alt="User avatar" />
                <div className="bg-white rounded-lg p-4 max-w-xs shadow">
                  <p>{desencriptarMensaje( message.TextoMensaje)}</p> {/* Asegúrate de que message.text no esté vacío */}
                </div>
              </div>  
            );
           })}
           <div ref={messagesEndRef} />
          </div>

          {/* MessageBar */}
          <div className="py-6 px-20 flex border-t">
            <div className="flex items-center w-full">
            <button
              className="bg-red-700 text-yellow-200 rounded px-4 py-2"
              onClick={() => setMostrarControlesVideo((prev) => !prev)}
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
              
              <label className="ml-4 text-sm text-gray-800">
              <input
                  type="checkbox"
                  checked={usarEncriptacion}
                  onChange={(e) => setUsarEncriptacion(e.target.checked)}
                  className="mr-2"
                />
                Encriptar mensaje
              </label>

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



      {/* VENTANA MODAL PARA VIDEOLLAMADA */}
    {mostrarControlesVideo && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-red-900 p-6 rounded-lg w-11/12 max-w-5xl relative">
      {/* Botón cerrar */}
      <button
        onClick={() => setMostrarControlesVideo(false)}
        className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl font-bold"
      >
        &times;
      </button>

      <h1 className="text-xl font-bold mb-4">Conexión a Espejos Mágicos</h1>

      <div className="flex gap-4 mb-4">
        <video
          ref={localVideoRef}
          autoPlay
          muted
          playsInline
          className="w-1/2 border rounded"
        />
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-1/2 border rounded"
        />
      </div>

      <div className="flex flex-wrap gap-4">
        <button
          onClick={startWebcam}
          className="bg-yellow-500 text-white px-4 py-2 rounded"
        >
          Revelar Espejo
        </button>
        <button
          onClick={createCall}
          className="bg-orange-500 text-white px-4 py-2 rounded"
        >
          Crear hechizo de conexión
        </button>
        <input
          value={callId}
          onChange={(e) => setCallId(e.target.value)}
          placeholder="Clave Encantada"
          className="border px-2 py-1 rounded"
        />
        <button
          onClick={answerCall}
          className="bg-gray-300 text-white px-4 py-2 rounded"
        >
          Responder llamado mágico
        </button>
        <button
          onClick={colgarLlamada}
          className="bg-red-400 text-white px-4 py-2 rounded"
        >
          Romper Hechizo
        </button>

      </div>
    </div>
  </div>
)}

    </div>

  );
};

export default ChatComponent;
