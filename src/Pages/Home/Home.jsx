import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../FirebaseConfig/FirebaseConfig";
import NewsCard from "../../Components/NewsCard/NewsCard";
import "./Home.css";

const Home = () => {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNoticias = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, "noticias"), where("estado", "==", "Publicado"));
        const snapshot = await getDocs(q);
        const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setNoticias(lista);
      } catch (err) {
        console.error("❌ Error cargando noticias:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNoticias();
  }, []);

  return (
    <div className="home-container">
      <div className="home-header-top">
        <img
          src="src\assets\Banner.png"  
          alt="Icono noticias"
          className="home-header-img"
        />
      </div>

      <h1 className="home-title">📰 Noticias Recientes</h1>

      {loading ? (
        <div className="home-loading">
          <div className="spinner"></div>
          <p>Cargando noticias...</p>
        </div>
      ) : noticias.length === 0 ? (
        <div className="home-empty">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4076/4076509.png"
            alt="Sin noticias"
            className="empty-icon"
          />
          <p>No hay noticias publicadas por el momento.</p>
        </div>
      ) : (
        <div className="home-grid">
          {noticias.map((n) => (
            <NewsCard key={n.id} noticia={n} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
