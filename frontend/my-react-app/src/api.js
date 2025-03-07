import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8012/sistema_de_reservas/API/",
});

// Agregar el token JWT al encabezado Authorization
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");

  if (token && token !== "undefined") {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    localStorage.removeItem("access_token");
  }

  return config;
});

export default api;
