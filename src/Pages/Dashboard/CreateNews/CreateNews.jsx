import React, { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../../FirebaseConfig/FirebaseConfig";
import { getAuth } from "firebase/auth";
import "./CreateNews.css";

const CreateNews = () => {
  const [titulo, setTitulo] = useState("");
  const [subtitulo, setSubtitulo] = useState("");
  const [noticia, setNoticia] = useState("");
  const [categoria, setCategoria] = useState("");
  const [imagen, setImagen] = useState("");
  const [estado, setEstado] = useState("Edición");
  const [mensaje, setMensaje] = useState("");
  const auth = getAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");
    const user = auth.currentUser;
    if (!user) return setMensaje("Debes iniciar sesión.");
    try {
      await addDoc(collection(db, "noticias"), {
        titulo,
        subtitulo,
        noticia,
        categoria,
        imagen,
        estado,
        autor: user.email,
        fecha: new Date().toLocaleDateString(),
        fechaCreacion: serverTimestamp(),
      });
      setMensaje("✅ Noticia creada con éxito.");
      setTitulo(""); setSubtitulo(""); setNoticia(""); setCategoria(""); setImagen("");
    } catch {
      setMensaje("❌ Error al guardar la noticia.");
    }
  };

  return (
    <div className="create-container">
      <h2>Crear Noticia</h2>
      <form onSubmit={handleSubmit} className="create-form">
        <input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Título" required />
        <input value={subtitulo} onChange={(e) => setSubtitulo(e.target.value)} placeholder="Subtítulo" required />
        <textarea value={noticia} onChange={(e) => setNoticia(e.target.value)} placeholder="Contenido..." required />
        <input value={categoria} onChange={(e) => setCategoria(e.target.value)} placeholder="Categoría" required />
        <input value={imagen} onChange={(e) => setImagen(e.target.value)} placeholder="URL de imagen" />
        <select value={estado} onChange={(e) => setEstado(e.target.value)}>
          <option>Edición</option>
          <option>Terminado</option>
          <option>Publicado</option>
        </select>
        <button type="submit">Guardar</button>
      </form>
      {mensaje && <p className="create-msg">{mensaje}</p>}
    </div>
  );
};

export default CreateNews;
