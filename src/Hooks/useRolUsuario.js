import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../FirebaseConfig/FirebaseConfig";

const useRolUsuario = (user) => {
  const [rol, setRol] = useState(null);

  useEffect(() => {
    const obtenerRol = async () => {
     
      if (!user) {
        setRol("usuario");
        return;
      }

      try {
        console.log("%c[useRolUsuario]", "color:#7c3aed;font-weight:bold;", "Buscando rol de:", user.email, "UID:", user.uid);

        const ref = doc(db, "usuarios", user.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();
          console.log("%c✅ Rol encontrado:", "color:#16a34a;font-weight:bold;", data.rol);
          setRol(data.rol || "usuario");
        } else {
          console.warn("%c⚠️ No se encontró documento de usuario en Firestore", "color:#facc15;font-weight:bold;");
          setRol("usuario");
        }
      } catch (err) {
        console.error("❌ Error leyendo rol:", err);
        setRol("usuario");
      }
    };

    obtenerRol();
  }, [user]);

  return rol;
};

export default useRolUsuario;
