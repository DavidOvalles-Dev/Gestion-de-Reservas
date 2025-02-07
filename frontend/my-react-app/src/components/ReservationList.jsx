import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const ReservationList = () => {
  const [reservations, setReservations] = useState([]);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8012/sistema_de_reservas/API/index.php?action=getReservations"
        );
        setReservations(response.data);

        console.log("API Response for reservations:", response.data);
      } catch (error) {
        console.error("Error fetching reservations:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Error al cargar las habitaciones.",
        });
      }
    };

    fetchReservations();
  }, []);

  useEffect(() => {
    if (reservations.length > 0) {
      const roomData = [];
      reservations.forEach(async (res) => {
        console.log("Reservation encontrada:", res);

        const roomResponse = await axios.get(
          `http://localhost:8012/sistema_de_reservas/API/index.php?action=getRoomById&id=${res.room_id}`
        );
        roomData.push(roomResponse.data);
      });
      setRooms(roomData);
      console.log("API Response for rooms:", roomData);
    }
  }, [reservations]);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (result.isConfirmed) {
      try {
        await axios.delete(
          `http://localhost:8012/sistema_de_reservas/API/index.php?action=deleteReservation&id=${id}`
        );
        Swal.fire("Eliminado", "La habitación ha sido eliminada.", "success");
        setReservations(reservations.filter((room) => room.id !== id));
      } catch (error) {
        console.error("Error deleting room:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Error al eliminar la habitación.",
        });
      }
    }
  };

  return (
    <div className=" container d-flex flex-column align-items-center">
      <h1>Habitaciones disponibles</h1>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>#</th>
            <th>Habitación</th>
            <th>Cliente</th>
            <th>Fecha de Inicio</th>
            <th>Fecha de Fin</th>
            <th>Hora de Inicio</th>
            <th>Hora de Fin</th>
            <th>Estado</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((res, index) => {
            const room = rooms.find((room) => room.id === res.room_id);
            if (room) {
              res.room_number = room.room_number;
            }
            return (
              <tr key={res.id}>
                <td>{index + 1}</td>
                {console.log("room number:", res.room_number)}
                <td>{res.room_number || "Sin reserva"}</td>
                {console.log("user name:", res.user_name)}
                <td>{res.user_name || "Sin reserva"}</td>
                <td>{res.start_date}</td>
                <td>{res.end_date}</td>
                <td>{res.status}</td>
                <td>{res.start_time}</td>
                <td>{res.end_time}</td>
                <td>
                  <Link
                    to={`/edit-reservation/${res.id}`}
                    className="btn btn-secondary me-3"
                  >
                    Editar
                  </Link>
                  <button
                    className="btn btn-danger me-3"
                    onClick={() => handleDelete(res.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ReservationList;

// console.log(
//   "room nomber:",
//   res.room_number,
//   "client name:",
//   res.client_name
// );
