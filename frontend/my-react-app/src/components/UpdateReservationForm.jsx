import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const UpdateReservationForm = () => {
  const { reservationId } = useParams();
  const [formData, setFormData] = useState({
    id: "",
    room_id: "",
    user_name: "",
    start_date: "", // Fecha y hora combinadas
    end_date: "", // Fecha y hora combinadas
    status: "",
  });
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReservationAndRooms = async () => {
      try {
        const reservationResponse = await axios.get(
          `http://localhost:8012/sistema_de_reservas/API/index.php?action=getReservationById&id=${reservationId}`
        );
        console.log("API Response (Reservación):", reservationResponse.data);

        if (reservationResponse.data.error) {
          console.error("responseDataError:", reservationResponse.data.error);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Error al cargar los datos de la reservación.",
          });
          return;
        }

        // Asignar los datos directamente sin separar fecha y hora
        setFormData(reservationResponse.data);

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

    if (reservationId) {
      fetchReservationAndRooms();
    }
  }, [reservationId]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
    console.log("Event:", name, value); // Muestra el nombre del campo y su nuevo valor
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);

    // Validación básica
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
      const updateData = {
        ...formData,
        id: reservationId,
      };
      console.log("Form Data Submitted:", updateData);

      const response = await axios.put(
        "http://localhost:8012/sistema_de_reservas/API/index.php?action=updateReservation",
        updateData
      );

      console.log("API Response:", response.data);

      Swal.fire(
        "Actualizado",
        "La reservación ha sido actualizada.",
        "success"
      );
      navigate("/reservations");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error al actualizar la reservación.",
      });
    }
  };

  return (
    <div className="d-flex justify-content-center">
      <form className="container row" onSubmit={handleSubmit}>
        <h2 className="text-center">Editar Reservación</h2>

        {/* Campo para seleccionar la habitación */}
        <label className="form-label mb-3">
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
        <label className="form-label mb-3">
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

        <label className="form-label col-6 mb-3">
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
            value={formData.status || ""}
          >
            <option value="pending">Pendiente</option>
            <option value="confirmed">Confirmada</option>
            <option value="cancelled">Cancelada</option>
          </select>
        </label>
        <br />
        <div className="buttons row mb-5 d-flex justify-content-center">
          <button className="btn btn-success ms-4 col-5" type="submit">
            Actualizar Reservación
          </button>
          <div className="col-1" />
          <button
            className="btn btn-secondary  col-5"
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

export default UpdateReservationForm;
