// src/App.jsx
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
import Login from "./components/Login";
import Register from "./components/Register";
import Logout from "./components/Logout";
import { AuthProvider, AuthContext } from "./contexts/AuthContext.jsx";
import ReservationDetails from "./components/ReservationDetails"; // Importa el 
import PropTypes from "prop-types";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <NavBar />
          <br />
          <br />
          <Routes>
            {/* Ruta por defecto que redirige a /Home */}
            <Route path="/" element={<Navigate to="/Home" />} />
                  <Route
                    path="/create-reservation"
                    element={<CreateReservationForm />}
                  />
                  <Route
                    path="/create-reservation/:room_id"
                    element={<CreateReservationForm />}
                  />
                  <Route
                    path="/login"
                    element={
                    <ProtectedRoute onlyGuest>
                      <Login />
                    </ProtectedRoute>
                    }
                  />
                  <Route path="/logout" element={<Logout />} />
                  <Route
                    path="/Home"
                    element={
                    <ProtectedRoute>
                      <Home />
                    </ProtectedRoute>
                    }
                  />
                  <Route path="/Register" element={<Register />} />
                  <Route
                    path="/rooms"
                    element={
                    <ProtectedRoute>
                      <RoomList />
                    </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/reservations"
                    element={
                    <ProtectedRoute>
                      <ReservationList />
                    </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/create-room"
                    element={
                    <ProtectedRoute roleRequired="admin">
                      <CreateRoomForm />
                    </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/edit-room/:roomId"
                    element={
                    <ProtectedRoute roleRequired="admin">
                      <UpdateRoomForm />
                    </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/edit-reservation/:reservationId"
                    element={
                    <ProtectedRoute>
                      <UpdateReservationForm />
                    </ProtectedRoute>
                    }
                  />
                  {/* Nueva ruta para los detalles de la reservación */}
            <Route
              path="/ReservationDetails/:reservationId" // Asegúrate de que coincida con la URL
              element={
                <ProtectedRoute>
                  <ReservationDetails />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}


const ProtectedRoute = ({ children, roleRequired, onlyGuest }) => {
  const { isAuthenticatedState, userRoleState } = React.useContext(AuthContext);

  // Si es una ruta de solo invitados y el usuario ya está autenticado → mandar a Home
  if (onlyGuest && isAuthenticatedState) {
    return <Navigate to="/Home" replace />;
  }

  // Si es una ruta protegida normal y no está autenticado → mandar a Login
  if (!onlyGuest && !isAuthenticatedState) {
    return <Navigate to="/login" replace />;
  }

  // Si tiene restricción de rol y no cumple → mandar a Home
  if (roleRequired && userRoleState !== roleRequired) {
    return <Navigate to="/Home" replace />;
  }

  return children;
};


ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  roleRequired: PropTypes.string,
  onlyGuest: PropTypes.bool,
};

export default App;