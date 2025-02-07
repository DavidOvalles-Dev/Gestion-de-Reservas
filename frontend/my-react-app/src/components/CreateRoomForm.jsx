import react, { useState, useEffect } from "react";
import axios from "axios";

const CreateRoomForm = () => {
  const [formData, setFormData] = useState({
    room_number: "",
    capacity: "",
    price: "",
    available: true,
  });

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
        "http://localhost:8012/sistema_de_reservas/API/index.php?action=createRoom",
        formData
      );
      console.log("API Response:", response.data);
    } catch (error) {
      console.error("Error creating room:", error);
      return (
        <div className="alert alert-danger" role="alert">
          Error creando la habitación
        </div>
      );
    }
  };

  return (
    <div className="d-flex justify-content-center">
      <form className="row" onSubmit={handleSubmit}>
        <label className="form-label mb-5">
          Numero de la Habitacion
          <input
            className="form-control"
            type="text"
            name="room_number"
            value={formData.room_number}
            onChange={handleChange}
          />
        </label>
        <br />
        <label className="form-label mb-5">
          Capacidad
          <input
            className="form-control"
            type="text"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
          />
        </label>
        <br />
        <label className="form-label mb-3">
          Precio
          <input
            className="form-control"
            type="input"
            name="price"
            checked={formData.price}
            onChange={handleChange}
          />
        </label>
        <br />
        <div className="checkbox d-flex ms-2 mb-3">
          <label className="form-check form-switch form-check-lg">
            Disponible
            <input
              className="form-check-input"
              type="checkbox"
              name="available"
              checked={formData.available}
              onChange={handleChange}
            />
          </label>
        </div>
        <br />
        <button className="btn btn-success" type="submit">
          Crear Habitacion
        </button>
      </form>
    </div>
  );
};

export default CreateRoomForm;
