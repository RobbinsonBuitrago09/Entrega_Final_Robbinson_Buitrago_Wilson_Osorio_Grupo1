import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { app, db } from "../../FirebaseConfig/FirebaseConfig";
import { Link } from "react-router-dom";
import useRolUsuario from "../../Hooks/useRolUsuario";
import "./Dashboard.css";

const Dashboard = () => {
  const [noticias, setNoticias] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth(app);
  const rol = useRolUsuario(user);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (usuario) => setUser(usuario));
    return () => unsub();
  }, [auth]);

  useEffect(() => {
    const obtenerNoticias = async () => {
      if (!user || !rol) return;
      setLoading(true);

      try {
        let q;
        if (rol === "editor") {
          q = collection(db, "noticias");
        } else if (rol === "reportero") {
          q = query(collection(db, "noticias"), where("autor", "==", user.email));
        } else {
          setLoading(false);
          return;
        }

        const snapshot = await getDocs(q);
        const lista = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNoticias(lista);
      } finally {
        setLoading(false);
      }
    };

    obtenerNoticias();
  }, [user, rol]);

  const cambiarEstado = async (id, nuevoEstado) => {
    if (rol === "usuario") {
      return alert("No tienes permisos para cambiar estados.");
    }

    if (rol === "reportero" && !["Edición", "Terminado"].includes(nuevoEstado)) {
      return alert("Solo puedes cambiar a 'Edición' o 'Terminado'.");
    }

    if (rol === "editor" && !["Publicado", "Desactivado"].includes(nuevoEstado)) {
      return alert("Solo puedes cambiar a 'Publicado' o 'Desactivado'.");
    }

    await updateDoc(doc(db, "noticias", id), { estado: nuevoEstado });
    setNoticias((prev) =>
      prev.map((n) => (n.id === id ? { ...n, estado: nuevoEstado } : n))
    );
  };

  const eliminarNoticia = async (id, titulo) => {
    if (rol !== "editor") return alert("Solo los editores pueden eliminar.");
    if (!window.confirm(`¿Eliminar "${titulo}"?`)) return;
    await deleteDoc(doc(db, "noticias", id));
    setNoticias((prev) => prev.filter((n) => n.id !== id));
  };

  if (loading) return <p className="dashboard-loading">Cargando...</p>;

  if (rol === "usuario") {
    return (
      <div className="dashboard-container">
        <h1 className="dashboard-title">Acceso Restringido 🚫</h1>
        <p className="dashboard-msg">
          Tu cuenta no tiene permisos para acceder al panel de administración.
          Solo los <strong>reporteros</strong> y <strong>editores</strong> pueden gestionar noticias.
        </p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Panel de Administración</h1>

      {user && (
        <p className="dashboard-user">
          Rol: <strong>{rol}</strong> — {user.email}
        </p>
      )}

      {rol === "reportero" && (
        <Link to="/admin/crear" className="dashboard-btn-create">
          + Nueva Noticia
        </Link>
      )}

      <div className="dashboard-list">
        {noticias.map((n) => (
          <div className="dashboard-card" key={n.id}>
            <img src={n.imagen} alt={n.titulo} className="dashboard-img" />
            <div className="dashboard-info">
              <h3>{n.titulo}</h3>
              <p>{n.subtitulo}</p>
              <span
                className={`estado estado-${(n.estado || "Desconocido").toLowerCase()}`}
              >
                {n.estado || "Sin estado"}
              </span>

              <div className="dashboard-actions">
                <Link to={`/admin/editar/${n.id}`} className="btn-edit">
                  ✏️ Editar
                </Link>

                {rol === "reportero" && (
                  <>
                    <button
                      onClick={() => cambiarEstado(n.id, "Edición")}
                      className="btn-editing"
                    >
                      📝 En Edición
                    </button>
                    <button
                      onClick={() => cambiarEstado(n.id, "Terminado")}
                      className="btn-finish"
                    >
                      ✅ Terminado
                    </button>
                  </>
                )}

                {rol === "editor" && (
                  <>
                    <button
                      onClick={() => cambiarEstado(n.id, "Publicado")}
                      className="btn-publish"
                    >
                      📢 Publicar
                    </button>
                    <button
                      onClick={() => cambiarEstado(n.id, "Desactivado")}
                      className="btn-disable"
                    >
                      🚫 Desactivar
                    </button>
                    <button
                      onClick={() => eliminarNoticia(n.id, n.titulo)}
                      className="btn-delete"
                    >
                      ❌ Eliminar
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
