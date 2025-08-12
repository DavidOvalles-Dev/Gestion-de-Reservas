import {useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert2";

const CreateRoomForm = () => {
  const [formData, setFormData] = useState({
    room_number: "",
    capacity: "",
    price: "",
    available: true,
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  useEffect(() => {
    console.log("Updated Form Data:", formData);
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost/Gestion-de-Reservas/API/index.php?action=createRoom",
        formData
      );
      console.log("API Response:", response.data);
      swal.fire({
        icon: "success",
        title: "Habitación Creada",
        text: "La habitación ha sido creada exitosamente.",
      });
      navigate("/rooms");
    } catch (error) {
      console.error("Error creating room:", error);
      return swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error al crear la habitación.",
      });
    }
  };

  return (
    <>
      <div
        className="bg-dark container-sm rounded p-4 shadow-lg border border-white"
        style={{
          maxWidth: "600px",
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          boxShadow: "0px 0px 10px rgba(255, 255, 255, 0.5)",
        }}
      >
        <h1 className="text-center text-white">Habitaciones</h1>
        <form className="row" onSubmit={handleSubmit}>
          <label className="form-label mb-4 text-white fs-5">
            Número de la Habitación
            <input
              className="form-control"
              type="text"
              name="room_number"
              value={formData.room_number}
              onChange={handleChange}
            />
          </label>
          <label className="form-label mb-4 text-white">
            Capacidad
            <input
              className="form-control"
              type="text"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
            />
          </label>
          <label className="form-label mb-4 text-white">
            Precio
            <input
              className="form-control"
              type="text"
              name="price"
              value={formData.price}
              onChange={handleChange}
            />
          </label>
          <div className="checkbox d-flex align-items-center gap-2 text-white">
            <label className="form-check-label">Disponible</label>
            <input
              className="form-check-input"
              type="checkbox"
              name="available"
              checked={formData.available}
              onChange={handleChange}
            />
          </div>
          <button
            className="btn btn-success mt-3 fs-2 w-150 mb-2"
            type="submit"
          >
            Crear Habitación
          </button>
          <button
            className="btn btn-secondary fs-2 fs-5"
            type="button"
            onClick={() => (window.location.href = "/rooms")}
          >
            Volver
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateRoomForm;
