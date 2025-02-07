import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import RoomList from "./components/RoomList";
import NavBar from "./components/NavBar";
import CreateRoomForm from "./components/CreateRoomForm";
import UpdateRoomForm from "./components/UpdateRoomForm";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import ReservationList from "./components/ReservationList";
import UpdateReservationForm from "./components/UpdateReservationForm";
import CreateReservationForm from "./components/CreateReservationForm";
import Home from "./components/Home";

function App() {
  return (
    <Router>
      <div className="App">
        <NavBar />
        <h1 className="mt-3 text-center"> Sistema de Reservas</h1>
        <hr />
        <Routes>
          {/* Ruta por defecto que redirige a /Home */}
          <Route path="/" element={<Navigate to="/Home" />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/rooms" element={<RoomList />} />
          <Route path="/reservations" element={<ReservationList />} />
          <Route path="/create-room" element={<CreateRoomForm />} />
          <Route
            path="/create-reservation"
            element={<CreateReservationForm />}
          />
          <Route path="/edit-room/:roomId" element={<UpdateRoomForm />} />
          <Route
            path="/edit-reservation/:reservationId"
            element={<UpdateReservationForm />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
