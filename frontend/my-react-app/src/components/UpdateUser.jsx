import React, { useState } from "react";
import api from "../api";
import Swal from "sweetalert2";

const UpdateUser = () => {
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [messaje, setMessaje] = useState("");

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put("?action=update-user", {
        username: newUsername || undefined,
        password: newPassword || undefined,
      });
      setMessaje(response.data);
      Swal.fire("Actualizado", "Usuario actualizado correctamente", "success");
    } catch (error) {
      console.error("Error updating user:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error al actualizar el usuario.",
      });
    }
  };

  return (
    <div>
      <h1>Actualizar Datos</h1>
      <form onSubmit={handleUpdate}>
        <label>
          Nuevo Nombre de Usuario:
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
          />
        </label>
        <br />
        <label>
          Nueva Contraseña:
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Actualizar</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default UpdateUser;
