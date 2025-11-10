import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { app } from "../../FirebaseConfig/FirebaseConfig";
import useRolUsuario from "../../Hooks/useRolUsuario";
import "./Navbar.css";

const Navbar = () => {
  const auth = getAuth(app);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const rol = useRolUsuario(user);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (usuario) => {
      setUser(usuario);
      setLoadingUser(false);
    });
    return () => unsub();
  }, [auth]);

const handleLogout = async () => {
  await signOut(auth);
  setUser(null); 
  navigate("/");
};


  if (loadingUser || rol === null) {
    return (
      <nav className="navbar-container">
        <div className="navbar-logo">
          <Link to="/" className="navbar-title">📰 NewsHub</Link>
        </div>
        <p className="navbar-loading">Cargando usuario...</p>
      </nav>
    );
  }

  return (
    <nav className="navbar-container">
      <div className="navbar-logo">
        <Link to="/" className="navbar-title">📰 NewsHub</Link>
      </div>

      <ul className="navbar-links">
        <li><Link to="/">Inicio</Link></li>

        {user && rol === "reportero" && (
          <li><Link to="/admin">Mis Noticias</Link></li>
        )}

        {user && rol === "editor" && (
          <li><Link to="/admin">Panel Editor</Link></li>
        )}

        {user && rol === "usuario" && (
          <li className="navbar-info"><span>Solo lectura</span></li>
        )}

        {!user && <li><Link to="/login">Login</Link></li>}

        {user && (
          <li>
            <button className="navbar-btn" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </li>
        )}
      </ul>

      {user && (
        <div className="navbar-user">
          <span>
            {user.email}{" "}
            {rol && (
              <strong>({rol})</strong>
            )}
          </span>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
