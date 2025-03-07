// src/components/NavBar.jsx

import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { isAuthenticated, getUserRole, getCurrentUser } from "../../utils/auth";
import Swal from "sweetalert2";

const NavBar = () => {
  const location = useLocation();
  const [isLogged, setIsLogged] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      setIsLogged(isAuthenticated());
      setUserRole(getUserRole());
      setUser(getCurrentUser());
    };
    checkAuth();
  }, [location]);

  const handleLogout = () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Cerrar sesión",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.reload();
      }
    });
  };
  {
    console.log("User:", user);
  }
  const isActive = (path) =>
    location.pathname === path ? "nav-link active" : "nav-link";

  return (
    <nav className="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          Flavor Haven
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarColor01"
          aria-controls="navbarColor01"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarColor01">
          {isLogged && user && userRole === "user" && (
            <>
              <ul className="navbar-nav me-auto">
                <li className="nav-item">
                  <NavLink to="/home" className={`${isActive("/home")} fs-5`}>
                    Home
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/rooms" className={`${isActive("/rooms")} fs-5`}>
                    Habitaciones
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/reservations"
                    className={`${isActive("/reservations")} fs-5`}
                  >
                    Mis Reservaciones
                  </NavLink>
                </li>
              </ul>
              <div className="d-flex ms-auto align-items-center">
                <span className="nav-link text-light me-3 fs-5">
                  Bienvenido, {user}!
                </span>
                <button
                  className="btn btn-link text-light fs-5"
                  onClick={handleLogout}
                >
                  Cerrar Sesión
                </button>
              </div>
            </>
          )}
          {isLogged && user && userRole === "admin" && (
            <>
              <ul className="navbar-nav me-auto">
                <li className="nav-item">
                  <NavLink to="/home" className={`${isActive("/home")} fs-5`}>
                    Home
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/create-room"
                    className={`${isActive("/create-room")} fs-5`}
                  >
                    Crear Habitación
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/rooms" className={`${isActive("/rooms")} fs-5`}>
                    Habitaciones
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/reservations"
                    className={`${isActive("/reservations")} fs-5`}
                  >
                    Reservaciones
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/create-reservation"
                    className={`${isActive("/create-reservation")} fs-5`}
                  >
                    Crear Reservación
                  </NavLink>
                </li>
              </ul>
              <div className="d-flex ms-auto align-items-center">
                <span className="nav-link text-light me-3 fs-5">
                  Bienvenido, {user}!
                </span>
                <button
                  className="btn btn-link text-light fs-5"
                  onClick={handleLogout}
                >
                  Cerrar Sesión
                </button>
              </div>
            </>
          )}
          {!isLogged && (
            <div className="loginPartial navbar-nav ms-auto">
              <li className="nav-item">
                <NavLink to="/login" className={isActive("/login")}>
                  Iniciar Sesión
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/register" className={isActive("/register")}>
                  Registrarse
                </NavLink>
              </li>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
