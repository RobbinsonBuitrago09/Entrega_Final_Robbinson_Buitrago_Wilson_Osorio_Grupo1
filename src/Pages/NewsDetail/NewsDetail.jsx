import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../FirebaseConfig/FirebaseConfig";
import "./NewsDetail.css";

const NewsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [noticia, setNoticia] = useState(null);

  useEffect(() => {
    const fetchNoticia = async () => {
      try {
        const ref = doc(db, "noticias", id);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setNoticia(snap.data());
        }
      } catch (err) {
        console.error("Error cargando la noticia:", err);
      }
    };
    fetchNoticia();
  }, [id]);

  if (!noticia) return <p className="newsdetail-loading">Cargando noticia...</p>;

  return (
    <div className="newsdetail-container">
      <button className="newsdetail-back" onClick={() => navigate("/")}>
        ← Volver
      </button>

      <img
        src={noticia.imagen}
        alt={noticia.titulo}
        className="newsdetail-img"
      />

      <h1 className="newsdetail-title">{noticia.titulo}</h1>
      <h3 className="newsdetail-subtitle">{noticia.subtitulo}</h3>
      <p className="newsdetail-body">{noticia.noticia}</p>

      <div className="newsdetail-meta">
        <span>📅 {noticia.fecha}</span>
        <span>✍️ {noticia.autor}</span>
        <span>🏷️ {noticia.categoria}</span>
      </div>
    </div>
  );
};

export default NewsDetail;
