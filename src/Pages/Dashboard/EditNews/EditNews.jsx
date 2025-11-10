import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../../FirebaseConfig/FirebaseConfig";
import "./EditNews.css";

const EditNews = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [noticia, setNoticia] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  if (!id) {
    console.warn("⚠️ No se proporcionó ID en la URL de edición");
    return <Navigate to="/admin" replace />;
  }

  useEffect(() => {
    const cargar = async () => {
      try {
        const ref = doc(db, "noticias", id);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setNoticia({ id: snap.id, ...snap.data() });
        } else {
          console.warn("❌ No se encontró noticia con ese ID");
          setError("No se encontró la noticia.");
        }
      } catch (err) {
        console.error("Error cargando noticia:", err);
        setError("Error cargando noticia.");
      }
    };
    cargar();
  }, [id]);

  const handleChange = (e) =>
    setNoticia({ ...noticia, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const ref = doc(db, "noticias", id);
      await updateDoc(ref, noticia);
      setMensaje("✅ Noticia actualizada correctamente.");
      setTimeout(() => navigate("/admin"), 1500);
    } catch (err) {
      console.error("Error actualizando noticia:", err);
      setMensaje("❌ Error al guardar los cambios.");
    }
  };

  if (error) {
    return (
      <div className="edit-error">
        <h2>{error}</h2>
        <button onClick={() => navigate("/admin")}>Volver al panel</button>
      </div>
    );
  }

  if (!noticia) return <p className="edit-loading">Cargando noticia...</p>;

  return (
    <div className="edit-container">
      <h2>Editar Noticia</h2>
      <form onSubmit={handleSave} className="edit-form">
        <input
          name="titulo"
          value={noticia.titulo || ""}
          onChange={handleChange}
          placeholder="Título"
        />
        <input
          name="subtitulo"
          value={noticia.subtitulo || ""}
          onChange={handleChange}
          placeholder="Subtítulo"
        />
        <textarea
          name="noticia"
          value={noticia.noticia || ""}
          onChange={handleChange}
          placeholder="Contenido"
        />
        <input
          name="categoria"
          value={noticia.categoria || ""}
          onChange={handleChange}
          placeholder="Categoría"
        />
        <input
          name="imagen"
          value={noticia.imagen || ""}
          onChange={handleChange}
          placeholder="URL de la imagen"
        />

        <select
          name="estado"
          value={noticia.estado || "Edición"}
          onChange={handleChange}
        >
          <option value="Edición">Edición</option>
          <option value="Terminado">Terminado</option>
          <option value="Publicado">Publicado</option>
          <option value="Desactivado">Desactivado</option>
        </select>

        <button type="submit">Guardar Cambios</button>
      </form>

      {mensaje && <p className="edit-msg">{mensaje}</p>}
    </div>
  );
};

export default EditNews;
