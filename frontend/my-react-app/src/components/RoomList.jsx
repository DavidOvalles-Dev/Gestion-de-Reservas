// src/components/RoomList.jsx
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "../contexts/AuthContext.jsx";
import { isAuthenticated, getUserRole, getCurrentUser } from "../../utils/auth";

const RoomList = () => {
  const navigate = useNavigate();
  const { userRoleState } = useContext(AuthContext); // Obtener el rol del usuario

  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState(null);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const checkAuth = () => {
      setIsLogged(isAuthenticated());
      setUser(getCurrentUser());
    };

    const fetchRooms = async () => {
      try {
        const response = await axios.get(
          "http://localhost/Gestion-de-Reservas/API/index.php?action=getRooms"
        );
        setRooms(response.data);
        console.log("API Response:", response.data);
      } catch (error) {
        console.error("Error fetching rooms:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Error al cargar las habitaciones.",
        });
      }
    };

    checkAuth();
    fetchRooms();
  }, []);

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
          `http://localhost:8012/sistema_de_reservas/API/index.php?action=deleteRoom&id=${id}`
        );
        Swal.fire("Eliminado", "La habitación ha sido eliminada.", "success");
        setRooms((prevRooms) => prevRooms.filter((room) => room.id !== id));
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

  const reserva = (room) => {
    if (room.available === 1) {
      navigate(`/create-reservation/${room.id}`);
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "La habitación no está disponible.",
      });
    }
  };

  const changeAvailability = async (id, currentAvailability) => {
    const newAvailability =
      currentAvailability === 1 || currentAvailability === true ? 0 : 1;

    const confirmation = await Swal.fire({
      title: `¿Quieres cambiar la habitación a ${
        newAvailability ? "DISPONIBLE" : "NO DISPONIBLE"
      }?`,
      text: "Esta acción cambiará el estado de disponibilidad.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, cambiar",
      cancelButtonText: "Cancelar",
    });

    if (!confirmation.isConfirmed) return; // Si cancela, no hace nada

    try {
      await axios.put(
        `http://localhost:8012/sistema_de_reservas/API/index.php?action=changeAvailability&id=${id}`,
        { available: newAvailability },
        { headers: { "Content-Type": "application/json" } }
      );

      // ✅ 🔥 Mostrar alerta de éxito con el mensaje correcto
      Swal.fire({
        icon: "success",
        title: "Disponibilidad actualizada",
        text: `La habitación ahora está ${
          newAvailability ? "DISPONIBLE" : "NO DISPONIBLE"
        }.`,
      });

      // Volver a cargar las habitaciones sin hacer otra petición al servidor
      setRooms((prevRooms) =>
        prevRooms.map((room) =>
          room.id === id ? { ...room, available: newAvailability } : room
        )
      );
    } catch (error) {
      console.error(
        "Error cambiando disponibilidad:",
        error.response ? error.response.data : error
      );
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Error al cambiar la disponibilidad de la habitación.",
      });
    }
  };

  return (
    <div className="container  d-flex flex-column align-items-center">
      <h1>Habitaciones disponibles</h1>
      <table className="table table-dark table-bordered ">
        <thead>
          <tr>
            <th>#</th>
            <th>Número de la Habitación</th>
            <th>Capacidad</th>
            <th>Precio</th>
            <th>Disponible</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room, index) => (
            <tr key={room.id}>
              <td>{index + 1}</td>
              <td>{room.room_number}</td>
              <td>{room.capacity}</td>
              <td>{room.price}</td>
              <td>
                <span
                  className={
                    room.available === 1 ? "text-success" : "text-warning"
                  }
                >
                  {room.available === 1 ? "Sí" : "No"}
                </span>
              </td>
              <td>
                {userRoleState === "admin" && (
                  <>
                    <Link
                      to={`/edit-room/${room.id}`}
                      className="btn btn-secondary me-3 fs-5"
                    >
                      Editar
                    </Link>
                    <button
                      className="btn   btn-danger me-3 fs-5"
                      onClick={() => handleDelete(room.id)}
                    >
                      Eliminar
                    </button>
                    <button
                      onClick={() =>
                        changeAvailability(room.id, room.available)
                      }
                      className={
                        room.available
                          ? "btn btn-warning fs-5"
                          : "btn btn-success fs-5"
                      }
                    >
                      {room.available
                        ? "Cambiar a no disponible"
                        : "Cambiar a disponible"}
                    </button>
                  </>
                )}
                {userRoleState === "user" && (
                  <button
                    onClick={() => reserva(room)}
                    className="btn btn-primary"
                  >
                    Reservar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RoomList;
