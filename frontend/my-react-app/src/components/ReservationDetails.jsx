import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const ReservationDetails = () => {
  const { reservationId } = useParams(); // Obtén el ID de la reservación
  const [reservation, setReservation] = useState(null);
  const [room, setRoom] = useState(null); // Para almacenar los datos de la habitación
  const navigate = useNavigate();

  // Función para formatear la hora (de 24h a 12h con AM/PM)
  const formatTime = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const parsedHours = parseInt(hours, 10);
    const ampm = parsedHours >= 12 ? "PM" : "AM";
    const formattedHours = parsedHours % 12 || 12; // Convierte 0 a 12
    return `${formattedHours}:${minutes} ${ampm}`;
  };

  // Obtener los detalles de la reservación y la habitación asociada
  useEffect(() => {
    const fetchReservationAndRoom = async () => {
      try {
        const reservationResponse = await axios.get(
          `http://localhost/Gestion-de-Reservas/API/index.php?action=getReservationById&id=${reservationId}`
        );
        setReservation(reservationResponse.data);

        // Obtener los datos de la habitación
        const roomResponse = await axios.get(
          `http://localhost/Gestion-de-Reservas/API/index.php?action=getRoomById&id=${reservationResponse.data.room_id}`
        );
        setRoom(roomResponse.data);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Error al cargar los detalles de la reservación.",
          footer: `<p>${error.message}</p>`,
        });
      }
    };

    fetchReservationAndRoom();
  }, [reservationId]);

  if (!reservation || !room) {
    return <div className="text-center mt-5">Cargando...</div>;
  }

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div
        className="card p-4 shadow-lg align-items-center bg-dark-subtle text-dark"
        style={{ maxWidth: "600px", width: "100%" }}
      >
        <h2 className="text-center mt-3 mb-4">Detalles de la Reservación</h2>
        <div className="card-body">
          <div className="mb-3">
            <strong>ID:</strong> {reservation.id}
          </div>
          <div className="mb-3">
            <strong>Habitación:</strong> {room.room_number}
          </div>
          <div className="mb-3">
            <strong>Cliente:</strong> {reservation.user_name}
          </div>
          <div className="mb-3">
            <strong>Fecha de Inicio:</strong> {reservation.start_date}
          </div>
          <div className="mb-3">
            <strong>Fecha de Fin:</strong> {reservation.end_date}
          </div>
          <div className="mb-3">
            <strong>Hora de Inicio:</strong>{" "}
            {formatTime(reservation.start_time)}
          </div>
          <div className="mb-3">
            <strong>Hora de Fin:</strong> {formatTime(reservation.end_time)}
          </div>
          <div className="mb-3">
            <strong>Estado:</strong>{" "}
            <span
              className={`badge ${
                reservation.status === "pending"
                  ? "bg-warning"
                  : reservation.status === "confirmed"
                  ? "bg-success"
                  : "bg-secondary"
              }`}
            >
              {reservation.status}
            </span>
          </div>
          <div className="text-center">
            <button
              onClick={() => navigate("/reservations")}
              className="btn btn-secondary"
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationDetails;
