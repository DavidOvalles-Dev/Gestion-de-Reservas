// src/components/ReservationForm.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { isAuthenticated, getUserRole, getCurrentUser } from "../../utils/auth"; // Importar funciones de autenticación
import { useNavigate } from "react-router-dom";

const ReservationForm = () => {
  const navigate = useNavigate();
  const { room_id } = useParams();
  const [habitacion, setHabitacion] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [formData, setFormData] = useState({
    room_id: room_id || "",
    user_name: "",
    start_date: new Date().toISOString().split("T")[0], // Fecha actual por defecto
    end_date: "",
    status: "pending",
    start_time: new Date(
      new Date().getTime() - new Date().getTimezoneOffset() * 60000
    )
      .toISOString()
      .substring(11, 16), // Hora actual por defecto
    end_time: "",
    price: 0,
  });

  // Estado del usuario
  const [isLogged, setIsLogged] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Función para verificar autenticación y obtener información del usuario
    const checkAuth = async () => {
      setIsLogged(isAuthenticated());
      setUserRole(getUserRole());
      const currentUser = getCurrentUser();
      setUser(currentUser);
      setFormData((prevData) => ({ ...prevData, user_name: currentUser })); // Autocompletar el nombre del usuario
    };

    checkAuth();

    // Si hay un room_id en la URL, cargar la habitación específica
    if (room_id) {
      const fetchRoomById = async () => {
        try {
          const response = await axios.get(
            `http://localhost:8012/sistema_de_reservas/API/index.php?action=getRoomById&id=${room_id}`
          );
          console.log("Room Data:", response.data);
          setHabitacion(response.data);
          setFormData((prevData) => ({ ...prevData, ...response.data })); // Actualizar formData con los datos de la habitación
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Error al cargar los datos de la habitación.",
          });
        }
      };
      fetchRoomById();
    }

    // Cargar todas las habitaciones si no hay room_id en la URL
    const fetchRooms = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8012/sistema_de_reservas/API/index.php?action=getRooms"
        );
        setRooms(response.data);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Error al cargar las habitaciones.",
        });
      }
    };

    if (!room_id) {
      fetchRooms();
    }
  }, [room_id]);

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Combinar fecha y hora de inicio y fin
    const startDateTime = new Date(
      `${formData.start_date}T${formData.start_time}`
    );
    const endDateTime = new Date(`${formData.end_date}T${formData.end_time}`);

    // Calcular la diferencia en milisegundos
    const timeDifference = endDateTime - startDateTime;

    // Calcular la diferencia en horas
    const hoursDifference = timeDifference / (1000 * 60 * 60);

    // Calcular el número de días (redondeado hacia arriba)
    const priceMultiplier = Math.ceil(hoursDifference / 24);

    // Obtener el precio base de la habitación (precio por día)
    const basePrice = habitacion?.price || 0; // Valor predeterminado si no hay precio

    // Calcular el precio total (precio base * número de días)
    const updatedPrice = basePrice * priceMultiplier;

    // Crear un nuevo objeto con el precio actualizado
    const updatedFormData = { ...formData, price: updatedPrice };

    console.log("Datos del formulario antes del submit:", updatedFormData);

    // Validación básica en el frontend
    if (
      !updatedFormData.room_id ||
      !updatedFormData.user_name ||
      !updatedFormData.start_date ||
      !updatedFormData.end_date ||
      !updatedFormData.start_time ||
      !updatedFormData.end_time ||
      !updatedFormData.status
    ) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Por favor, llena todos los campos.",
      });
      return;
    } else if (updatedPrice === 0) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Por favor, selecciona un dia como minimo en la reserva.",
      });
    }

    const result = await Swal.fire({
      title: "Confirmar Reservación",
      text: `Esta reservación será de ${updatedPrice} USD. ¿Deseas continuar?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, continuar",
      cancelButtonText: "No, cancelar",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8012/sistema_de_reservas/API/index.php?action=createReservation",
        updatedFormData // Enviar el objeto actualizado
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
    <div
      className="bg-dark container-sm rounded p-4 shadow-lg border border-white"
      style={{
        maxWidth: "600px",
        backdropFilter: "blur(10px)",
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        boxShadow: "0px 0px 10px rgba(255, 255, 255, 0.5)",
      }}
    >
      <h1 className="text-center text-white">Reservaciones</h1>
      <form onSubmit={handleSubmit} className="row">
        {!isLogged && (
          <div className="alert alert-danger" role="alert">
            No tienes permisos para acceder a esta página.
          </div>
        )}

        {isLogged && (
          <>
            <label className="form-label mb-4 text-white">
              Habitación:
              {room_id ? (
                <input
                  className="form-control"
                  value={`Habitación: ${habitacion?.room_number || ""}`}
                  disabled
                />
              ) : (
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
              )}
            </label>

            <label className="form-label mb-4 text-white">
              Nombre del Cliente:
              <input
                className="form-control"
                name="user_name"
                value={userRole === "user" ? user : formData.user_name || ""}
                type="text"
                onChange={handleChange}
                disabled={userRole === "user"}
              />
            </label>

            <label className="form-label mb-4 text-white">
              Fecha de Inicio:
              <input
                className="form-control"
                name="start_date"
                value={formData.start_date || ""}
                type="date"
                onChange={handleChange}
              />
            </label>
            <label className="form-label mb-4 text-white">
              Fecha de Fin:
              <input
                className="form-control"
                name="end_date"
                value={formData.end_date || ""}
                type="date"
                onChange={handleChange}
              />
            </label>

            <label className="form-label mb-4 text-white">
              Hora de Inicio:
              <input
                className="form-control"
                name="start_time"
                value={formData.start_time || ""}
                type="time"
                onChange={handleChange}
              />
            </label>
            <label className="form-label mb-4 text-white">
              Hora de Fin:
              <input
                className="form-control"
                name="end_time"
                value={formData.end_time || ""}
                type="time"
                onChange={handleChange}
              />
            </label>

            {userRole === "admin" && (
              <label className="form-label mb-4 text-white">
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
            )}

            <button
              className="btn btn-success mt-3 fs-2 w-100 mb-2"
              type="submit"
            >
              Crear Reservación
            </button>
            <button
              className="btn btn-secondary fs-2 fs-5"
              type="button"
              onClick={() => (window.location.href = "/rooms")}
            >
              Volver
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default ReservationForm;
