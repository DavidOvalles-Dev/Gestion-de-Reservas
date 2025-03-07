// src/components/UserProfile.jsx

import React, { useEffect, useState } from "react";
import { getUserInfo, isAuthenticated } from "../../utils/auth"; // Importar funciones de autenticación

const UserProfile = () => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    // Verificar si el usuario está autenticado
    if (!isAuthenticated()) {
      setUserInfo({ error: "No estás autenticado" });
      return;
    }

    // Obtener información del usuario desde el token
    const info = getUserInfo();
    if (info) {
      setUserInfo(info);
    } else {
      setUserInfo({ error: "No se pudo obtener la información del usuario" });
    }
  }, []);

  if (userInfo?.error) {
    return <div>{userInfo.error}</div>;
  }

  return (
    <div className="container">
      <h1>Perfil del Usuario</h1>
      <p>
        <strong>ID del Usuario:</strong> {userInfo?.user_id}
      </p>
      <p>
        <strong>Rol:</strong> {userInfo?.role || "Usuario normal"}
      </p>
      {/* Aquí puedes agregar más campos según lo que almacenes en el token */}
    </div>
  );
};

export default UserProfile;
