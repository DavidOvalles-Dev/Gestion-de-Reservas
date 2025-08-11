// src/components/Login.jsx

import React, { useState } from "react";
import api from "../api";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext.jsx"; // Importar AuthContext

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = React.useContext(AuthContext); // Obtener la función 'login'

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("", { username, password }, {
      params: { action: "login" }
      });


      console.log("Ruta:", response.config.url);

      console.log("API Response:", response.data); // Depuración

      if (
        !response.data ||
        typeof response.data.access_token !== "string" ||
        typeof response.data.refresh_token !== "string"
      ) {
        throw new Error("La respuesta del servidor no contiene tokens válidos");
      }

      const { access_token, refresh_token } = response.data;

      // Guardar tokens en localStorage
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);

      // Actualizar el estado global
      login(); // Llama a la función 'login' del contexto

      // Redirigir al usuario a /Home
      navigate("/Home", { replace: true });
    } catch (error) {
      console.error("Error logging in:", error);

      // Mostrar mensaje de error específico
      let errorMessage = "Error al iniciar sesión";
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error; // Usar el mensaje de error del backend
      }

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: errorMessage,
      });
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center ">
      <form className="p-4 border rounded shadow w-50" onSubmit={handleLogin}>
        <h1 className="text-center mb-4">Iniciar Sesión</h1>

        {/* Campo para el nombre de usuario */}
        <label htmlFor="username" className="form-label d-block">
          Nombre de Usuario:
          <input
            type="text"
            id="username"
            name="username"
            autoComplete="username"
            required
            className="form-control mb-3"
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>

        {/* Campo para la contraseña */}
        <label htmlFor="password" className="form-label d-block">
          Contraseña:
          <input
            type="password"
            id="password"
            name="password"
            autoComplete="new-password" // Evitar advertencias de Chrome
            required
            className="form-control mb-3"
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        {/* Botón de inicio de sesión */}
        <button type="submit" className="btn btn-primary w-100">
          Iniciar Sesión
        </button>
      </form>
    </div>
  );
};

export default Login;
