import React from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  // Función para cerrar sesión
  const handleLogout = () => {
    // Eliminar tokens del localStorage
    localStorage.removeItem("access_token");
    localStorage.removeItem(
      "rearámetro 'replace' evita que el usuario retroceda con el botón defresh_token"
    );

    // Redirigir al usuario a la página de inicio de sesión
    navigate("/login", { replace: true }); // El pl navegador
  };

  // Ejecutar el cierre de sesión automáticamente cuando se carga el componente
  React.useEffect(() => {
    handleLogout();
  }, []);

  return null; // No necesitas mostrar nada en este componente
};

export default Logout;
