// src/components/Home.jsx

import React from "react";
import { NavLink } from "react-router-dom";

const Home = () => {
  return (
    <>
      <h1 className="mt-3 text-center"> Sistema de Reservas</h1>
      <br />
      <div className="home-container d-flex justify-content-center">
        <div className="hero-section">
          <h1>Bienvenido a Flavor Haven Resort</h1>
          <p>
            Disfruta de una experiencia única y reserva tu estancia en nuestro
            exclusivo resort.
          </p>
          <p>
            ¡Haz tu reserva aquí! 👉{" "}
            <NavLink to="/rooms" className="btn btn-primary btn-lg">
              Habitaciones
            </NavLink>
          </p>
        </div>
      </div>
    </>
  );
};

export default Home;
