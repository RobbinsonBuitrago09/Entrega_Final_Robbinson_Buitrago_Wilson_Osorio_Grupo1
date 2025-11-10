import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "../../FirebaseConfig/FirebaseConfig";
import useRolUsuario from "../../Hooks/useRolUsuario";

const ProtectedRoute = ({ children, rolesAllowed = ["reportero", "editor"] }) => {
  const auth = getAuth(app);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const rol = useRolUsuario(user);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (usuario) => {
      if (usuario) {
        console.log("%c[Auth]", "color:#38bdf8;", "Usuario logueado:", usuario.email);
      } else {
        console.log("%c[Auth]", "color:#f87171;", "No hay sesión activa");
      }
      setUser(usuario);
      setAuthLoading(false);
    });
    return () => unsub();
  }, [auth]);

  if (authLoading || rol === null) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <p>🔄 Verificando permisos...</p>
      </div>
    );
  }

  if (!user) {
    console.warn("🔒 No hay sesión, redirigiendo a /login");
    return <Navigate to="/login" replace />;
  }

  if (rol === "usuario" && rolesAllowed.includes("reportero")) {
    console.log("⏳ Rol todavía sincronizándose con Firestore...");
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <p>⏳ Cargando datos de usuario...</p>
      </div>
    );
  }

  if (!rolesAllowed.includes(rol)) {
    console.warn(`🚫 Acceso denegado a ${user.email} con rol: ${rol}`);
    return <Navigate to="/" replace />;
  }

  console.log(`✅ Acceso permitido a ${user.email} con rol: ${rol}`);
  return children;
};

export default ProtectedRoute;
