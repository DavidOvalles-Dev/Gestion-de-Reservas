// src/components/Home.jsx

import { NavLink } from "react-router-dom";

const Home = () => {
  return (
    <>
      <h1 className="mt-3 text-center display-4"> Sistema de Reservas</h1>
      <br />
      <div className="home-container d-flex justify-content-center fs-4">
        <div className="hero-section">
          <h1>Bienvenido a Flavor Haven Resort</h1>
          <p>
            Disfruta de una experiencia única y reserva tu estancia en nuestro
            exclusivo resort.
          </p>
          <p>
            ¡Haz tu reserva aquí! 👉{" "}
            <NavLink to="/rooms" className="btn btn-primary btn-lg fs-4">
              Habitaciones
            </NavLink>
          </p>
        </div>
      </div>
    </>
  );
};

export default Home;
