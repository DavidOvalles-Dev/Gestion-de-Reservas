import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "../contexts/AuthContext.jsx";
import { isAuthenticated, getUserRole, getCurrentUser } from "../../utils/auth";

const ReservationList = () => {
  const [reservations, setReservations] = useState([]);
  const [rooms, setRooms] = useState([]);
  const { userRoleState } = React.useContext(AuthContext);
  const user = getCurrentUser();

  // Función para formatear la hora (de 24h a 12h con AM/PM)
  const formatTime = (time) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const parsedHours = parseInt(hours, 10);
    const ampm = parsedHours >= 12 ? "PM" : "AM";
    const formattedHours = parsedHours % 12 || 12; // Convierte 0 a 12
    return `${formattedHours}:${minutes} ${ampm}`;
  };

  // Obtener reservaciones
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8012/sistema_de_reservas/API/index.php?action=getReservations"
        );
        setReservations(response.data);

        // Verificar conflictos de reservaciones
        const checkReservationConflict = async (reservations) => {
          const currentDate = new Date();
          const currentTime =
            currentDate.getHours() + ":" + currentDate.getMinutes();
          const formattedDate = currentDate.toISOString().split("T")[0];
          const reservationsToCheck = reservations.filter(
            (res) =>
              res.start_date === formattedDate &&
              res.start_time <= currentTime &&
              res.end_time >= currentTime
          );
          for (const res of reservationsToCheck) {
            try {
              await axios.put(
                `http://localhost:8012/sistema_de_reservas/API/index.php?action=updateReservation&id=${res.id}`,
                {
                  status: "canceled",
                }
              );
            } catch (error) {
              console.error("Error updating reservation:", error);
            }
          }
        };
        checkReservationConflict(response.data);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Error al cargar las reservaciones.",
        });
      }
    };

    fetchReservations();
  }, []);

  // Obtener datos de las habitaciones
  useEffect(() => {
    if (reservations.length > 0) {
      const fetchRoomData = async () => {
        const roomData = [];
        for (const res of reservations) {
          try {
            const roomResponse = await axios.get(
              `http://localhost:8012/sistema_de_reservas/API/index.php?action=getRoomById&id=${res.room_id}`
            );
            roomData.push(roomResponse.data);
          } catch (error) {
            console.error("Error fetching room data:", error);
          }
        }
        setRooms(roomData);
      };
      fetchRoomData();
    }
  }, [reservations]);

  // Eliminar una reservación
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
        Swal.fire("Eliminado", "La reservación ha sido eliminada.", "success");
        setReservations(reservations.filter((res) => res.id !== id));
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Error al eliminar la reservación.",
        });
      }
    }
  };

  // Obtener el color del estado
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "text-warning";
      case "confirmed":
        return "text-success";
      case "canceled":
        return "text-secondary";
      default:
        return "";
    }
  };

  // Calcular el precio según la duración de la reserva
  const calculatePrice = (startDate, endDate, price) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const duration = Math.ceil((end - start) / (1000 * 3600 * 24)); // Días de diferencia
    return duration > 1 ? price * duration : price; // Multiplica el precio si la duración es mayor a un día
  };

  // Filtrar reservaciones para clientes
  const filteredReservations =
    userRoleState === "admin"
      ? reservations
      : reservations.filter((res) => res.user_name === user);

  return (
    <div className="container d-flex flex-column align-items-center p-4">
      <h1 className="text-center mb-4">Reservaciones</h1>
      {filteredReservations.length === 0 ? (
        <div className="text-center p-5 bg-light rounded shadow">
          <p className="fs-4">No tienes reservaciones actualmente.</p>
          <p className="fs-5">
            ¡Haz tu reserva aquí! 👉{" "}
            <Link to="/rooms" className="btn btn-primary btn-lg">
              Reservar Habitación
            </Link>
          </p>
        </div>
      ) : userRoleState === "admin" ? (
        <div className="table-responsive w-100">
          <table className="table table-dark table-hover">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Habitación</th>
                <th>Cliente</th>
                <th>Inicio</th>
                <th>Fin</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {filteredReservations.map((res, index) => {
                const room = rooms.find((room) => room.id === res.room_id);
                if (room) {
                  res.room_number = room.room_number;
                  res.price = room.price;
                }
                const finalPrice = res.price
                  ? `$${calculatePrice(
                      res.start_date,
                      res.end_date,
                      res.price
                    )}`
                  : "No disponible";

                return (
                  <tr key={res.id}>
                    <td>{index + 1}</td>
                    <td>{res.room_number || "Sin asignar"}</td>
                    <td>{res.user_name || "Sin cliente"}</td>
                    <td>{formatTime(res.start_time)}</td>
                    <td>{formatTime(res.end_time)}</td>
                    <td className={getStatusColor(res.status)}>{res.status}</td>
                    <td>
                      <div className="d-flex gap-3">
                        <Link
                          to={`/ReservationDetails/${res.id}`}
                          className="btn btn-primary"
                        >
                          Detalles
                        </Link>
                        <Link
                          to={`/edit-reservation/${res.id}`}
                          className="btn btn-warning"
                        >
                          Editar
                        </Link>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(res.id)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="table-responsive w-100">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Habitación</th>
                <th>Fecha de Inicio</th>
                <th>Fecha de Fin</th>
                <th>Hora de Inicio</th>
                <th>Hora de Fin</th>
                <th>Precio</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {filteredReservations.map((res, index) => {
                const room = rooms.find((room) => room.id === res.room_id);
                if (room) {
                  res.room_number = room.room_number;
                  res.price = room.price;
                }
                const finalPrice = res.price
                  ? `$${calculatePrice(
                      res.start_date,
                      res.end_date,
                      res.price
                    )}`
                  : "No disponible";

                return (
                  <tr key={res.id}>
                    <td>{index + 1}</td>
                    <td>{res.room_number || "Sin asignar"}</td>
                    <td>{res.start_date}</td>
                    <td>{res.end_date}</td>
                    <td>{formatTime(res.start_time)}</td>
                    <td>{formatTime(res.end_time)}</td>
                    <td>{finalPrice}</td>
                    <td className={getStatusColor(res.status)}>{res.status}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReservationList;
