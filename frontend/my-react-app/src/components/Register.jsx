import React, { useState, useContext } from "react";
import api from "../api";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext.jsx";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      console.log("Registrando usuario...");
      await api.post(
        "?action=register",
        JSON.stringify({ username, password }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("Registro exitoso. Iniciando sesión...");

      // Ahora intentamos iniciar sesión automáticamente
      const loginResponse = await api.post(
        "http://localhost:8012/sistema_de_reservas/API/index.php?action=login",
        JSON.stringify({ username, password }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (
        !loginResponse.data ||
        typeof loginResponse.data.access_token !== "string" ||
        typeof loginResponse.data.refresh_token !== "string"
      ) {
        throw new Error("La respuesta del servidor no contiene tokens válidos");
      }

      const { access_token, refresh_token } = loginResponse.data;
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);
      login();

      Swal.fire({
        icon: "success",
        title: "Registro exitoso",
        text: "Bienvenido a la plataforma",
      });
      navigate("/Home", { replace: true });
    } catch (error) {
      console.error("Error en el proceso:", error);
      let errorMessage = "Error al registrarse";
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      Swal.fire({ icon: "error", title: "Oops...", text: errorMessage });
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center">
      <form
        className="p-4 border rounded shadow w-50"
        onSubmit={handleRegister}
      >
        <h1 className="text-center mb-4">Registrate</h1>
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
        <label htmlFor="password" className="form-label d-block">
          Contraseña:
          <input
            type="password"
            id="password"
            name="password"
            autoComplete="new-password"
            required
            className="form-control mb-3"
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button type="submit" className="btn btn-primary w-100">
          Registrarse
        </button>
      </form>
    </div>
  );
};

export default Register;
