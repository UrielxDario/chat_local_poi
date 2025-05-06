import "../styles/Videollamada.css";

export default function LlamadaVideo() {
  return (
    <div className="contenedor-llamada">
      <div className="video-principal">
        <video className="video-llamada" autoPlay muted>
          {}
        </video>
      </div>
      <div className="contenedor-video-propio">
        <video className="video-propio" autoPlay muted>
          {}
        </video>
      </div>
      <button className="btn-colgar">📞</button>
    </div>
  );
}
