import React from "react";
import { NavLink, useLocation } from "react-router-dom";

/**
 * NavBar component renders a responsive navigation bar.
 *
 * @component
 * @returns {JSX.Element} A dynamic navigation bar with active class highlighting.
 */
const NavBar = () => {
  const location = useLocation(); // Obtener la ruta actual

  // Clases dinámicas para marcar el enlace activo
  const isActive = (path) =>
    location.pathname === path ? "nav-link active" : "nav-link";

  return (
    <nav className="navbar navbar-expand-lg bg-light" data-bs-theme="light">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          Navbar
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarColor03"
          aria-controls="navbarColor03"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarColor03">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <NavLink to="/home" className={isActive("/home")}>
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/create-room" className={isActive("/create-room")}>
                Crear habitacion
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/rooms" className={isActive("/rooms")}>
                Habitaciones
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/reservations" className={isActive("/reservations")}>
                Reservaciones
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/create-reservation"
                className={isActive("/create-reservation")}
              >
                Crear reservacion
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
