import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const CreateReservationForm = () => {
  const [formData, setFormData] = useState({
    room_id: "",
    user_name: "",
    start_date: "",
    end_date: "",
    status: "pending",
    start_time: "",
    end_time: "",
  });
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "status") {
      console.log("Status:", value);
    }

    setFormData({
      ...formData,
      [name]: value,
    });

    console.log("Event:", name, value); // Muestra el nombre del campo y su nuevo valor
  };

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const roomsResponse = await axios.get(
          "http://localhost:8012/sistema_de_reservas/API/index.php?action=getRooms"
        );
        setRooms(roomsResponse.data);
        console.log("API Response (Habitaciones):", roomsResponse.data);
      } catch (error) {
        console.error("Error fetching rooms:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Error al cargar los datos necesarios.",
        });
      }
    };
    fetchRooms();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);

    // Validación básica en el frontend
    if (
      !formData.room_id ||
      !formData.user_name ||
      !formData.start_date ||
      !formData.end_date ||
      !formData.start_time ||
      !formData.end_time ||
      !formData.status
    ) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Por favor, llena todos los campos.",
      });
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8012/sistema_de_reservas/API/index.php?action=createReservation",
        formData
      );

      console.log("API Response:", response.data);

      // Verificar si la respuesta contiene un error
      if (response.data.error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: response.data.error,
        });
        return;
      }

      // Mostrar mensaje de éxito si no hay errores
      Swal.fire("Creado", "La reservación ha sido creada.", "success");
      navigate("/reservations");
    } catch (error) {
      // Manejar errores de red o del servidor
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error al crear la reservación.",
      });
    }
  };

  return (
    <div className="d-flex justify-content-center">
      <form
        className="row container d-flex justify-content-center"
        onSubmit={handleSubmit}
      >
        <h2 className="text-center">Crear Reservación</h2>

        {/* Campo para seleccionar la habitación */}
        <label className="form-label mb-4 col-12">
          Habitación:
          <select
            className="form-select"
            onChange={handleChange}
            value={formData.room_id || ""}
            name="room_id"
          >
            <option value="">Selecciona una habitación</option>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.room_number}
              </option>
            ))}
          </select>
        </label>
        <br />

        {/* Campo para el nombre del cliente */}
        <label className="form-label mb-4 col-12">
          Nombre del Cliente:
          <input
            className="form-control"
            name="user_name"
            value={formData.user_name || ""}
            type="text"
            onChange={handleChange}
          />
        </label>
        <br />

        {/* Campo para la fecha de inicio */}
        <label className="form-label col-6">
          Fecha de Inicio:
          <input
            className="form-control"
            name="start_date"
            value={formData.start_date || ""}
            type="date"
            onChange={handleChange}
          />
        </label>
        <br />

        {/* Campo para la fecha de fin */}
        <label className="form-label col-6">
          Fecha de Fin:
          <input
            className="form-control"
            name="end_date"
            value={formData.end_date || ""}
            type="date"
            onChange={handleChange}
          />
        </label>
        <br />

        {/* Campo para la hora de inicio */}
        <label className="form-label col-6">
          Hora de Inicio:
          <input
            className="form-control"
            name="start_time"
            value={formData.start_time || ""}
            type="time"
            onChange={handleChange}
          />
        </label>
        <br />

        {/* Campo para la hora de fin */}
        <label className="form-label mb-4 col-6">
          Hora de Fin:
          <input
            className="form-control"
            name="end_time"
            value={formData.end_time || ""}
            type="time"
            onChange={handleChange}
          />
        </label>
        <br />

        {/* Campo para el estado */}
        <label className="form-label mb-5">
          Estado:
          <select
            className="form-select"
            onChange={handleChange}
            name="status"
            value={formData.status || "pending"}
          >
            <option value="pending">Pendiente</option>
            <option value="confirmed">Confirmada</option>
            <option value="cancelled">Cancelada</option>
          </select>
        </label>
        <br />
        <div className="buttons row mb-5 d-flex justify-content-center">
          <button className="btn btn-success col-5" type="submit">
            Crear Reservación
          </button>
          <div className="col-2" />
          <button
            className="btn btn-secondary col-5"
            type="button"
            onClick={() => navigate("/reservations")}
          >
            Volver
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateReservationForm;
