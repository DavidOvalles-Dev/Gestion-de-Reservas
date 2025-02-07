import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert2";

const UpdateRoomForm = () => {
  const { roomId } = useParams();
  const [formData, setFormData] = useState({
    id: "",
    room_number: "",
    capacity: "",
    price: "",
    available: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      const apiUrl = `http://localhost:8012/sistema_de_reservas/API/index.php?action=getRoomById&id=${roomId}`;
      try {
        const response = await axios.get(apiUrl);
        console.log("API Response:", response.data);

        if (response.data.error) {
          console.error("responseDataError:", response.data.error);
          return;
        }

        const isAvailable = response.data.available === 1; // Determina el valor directamente.
        setFormData({
          ...response.data,
          available: isAvailable, // Usa el valor calculado directamente.
        });
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    if (roomId) {
      fetchRooms();
    }
  }, [roomId]);

  useEffect(() => {
    console.log("Updated Form Data:", formData);
  }, [formData]); // Observa cambios en formData

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Si el input es de tipo checkbox, usa 'checked' en lugar de 'value'
    const newValue = type === "checkbox" ? checked : value;

    setFormData({
      ...formData,
      [name]: newValue,
    });

    console.log("Event:", name, newValue); // Muestra el nombre del campo y su nuevo valor
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación básica
    if (!formData.room_number || !formData.capacity || !formData.price) {
      return;
    }

    if (formData.capacity < 1 || formData.capacity > 12) {
      swal.fire({
        icon: "error",
        title: "Error",
        text: "La capacidad debe estar entre 1 y 12 personas.",
      });
      return;
    }

    try {
      console.log("Form Data Submitted:", formData);
      const response = await axios.put(
        "http://localhost:8012/sistema_de_reservas/API/index.php?action=updateRoom",
        formData
      );
      console.log("API Response:", response);
      swal.fire({
        icon: "success",
        title: "Habitación Actualizada",
        text: "La habitación ha sido actualizada exitosamente.",
      });
      window.location.href = "/rooms";
    } catch (error) {
      console.error("Error updating room:", error);
      return swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error al actualizar la habitación.",
      });
    }
  };

  return (
    <>
      <div className="d-flex justify-content-center">
        <form onSubmit={handleSubmit}>
          <label className="form-label">
            Número de la Habitación:
            <input
              className="form-control"
              type="text"
              name="room_number"
              value={formData.room_number || ""}
              onChange={handleChange}
            />
          </label>
          <br />
          <label className="form-label">
            Capacidad:
            <input
              className="form-control"
              type="number"
              name="capacity"
              min={1}
              max={12}
              value={formData.capacity || ""}
              onChange={handleChange}
            />
          </label>
          <br />
          <label className="form-label">
            Precio:
            <input
              className="form-control"
              type="number"
              name="price"
              min={1}
              max={999}
              value={formData.price || ""}
              onChange={handleChange}
            />
          </label>
          <br />
          <label className="form-check form-switch form-check-lg">
            Disponible:
            <input
              className="form-check-input"
              type="checkbox"
              name="available"
              checked={formData.available}
              onChange={handleChange}
            />
          </label>
          <br />
          <button className="btn btn-success" type="submit">
            Actualizar Habitación
          </button>
          <button
            className="btn btn-secondary"
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

export default UpdateRoomForm;
