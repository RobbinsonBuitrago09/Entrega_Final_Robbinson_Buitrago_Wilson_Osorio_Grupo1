import React from "react";
import { Link } from "react-router-dom";
import "./NewsCard.css";

const NewsCard = ({ noticia }) => {
  return (
    <div className="newscard-container">
      <img
        src={noticia.imagen || "https://cdn-icons-png.flaticon.com/512/4076/4076549.png"}
        alt={noticia.titulo || "Noticia sin título"}
        className="newscard-img"
      />

      <div className="newscard-body">
        <h3>{noticia.titulo || "Sin título"}</h3>
        <p>{noticia.subtitulo || "Sin descripción disponible."}</p>

        <span className="newscard-meta">
          {noticia.categoria || "General"} • {noticia.fecha || "Sin fecha"}
        </span>

        <Link to={`/noticia/${noticia.id}`} className="newscard-btn">
          Leer más →
        </Link>
      </div>
    </div>
  );
};

export default NewsCard;
