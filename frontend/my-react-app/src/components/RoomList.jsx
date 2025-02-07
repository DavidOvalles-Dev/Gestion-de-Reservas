import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
const RoomList = () => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8012/sistema_de_reservas/API/index.php?action=getRooms"
        );
        setRooms(response.data);

        console.log("API Response:", response.data);
        console.log(rooms);
      } catch (error) {
        console.error("Error fetching rooms:", error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Error al cargar las habitaciones.",
        });
      }
    };

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
        setRooms(rooms.filter((room) => room.id !== id));
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
            <th>Numero de la Habitación</th>
            <th>Capacidad</th>
            <th>Precio</th>
            <th>Disponible</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room, index) => {
            if (room.available == 1) {
              room.available = true;
            }
            return (
              <tr key={room.id}>
                <td>{index + 1}</td>
                <td>{room.room_number}</td>
                <td>{room.capacity}</td>
                <td>{room.price}</td>
                <td>{room.available ? "Sí" : "No"}</td>
                <td>
                  <Link
                    to={`/edit-room/${room.id}`}
                    className="btn btn-secondary me-3"
                  >
                    Editar
                  </Link>
                  <button
                    className="btn btn-danger me-3"
                    onClick={() => handleDelete(room.id)}
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

export default RoomList;
