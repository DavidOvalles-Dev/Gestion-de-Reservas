// src/utils/auth.js

export const isAuthenticated = () => {
  const token = localStorage.getItem("access_token");
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Math.floor(Date.now() / 1000);

    if (payload.exp < currentTime) return false; // El token ha expirado
    return true; // Token válido
  } catch (error) {
    return false; // Error al decodificar el token
  }
};

export const getUserRole = () => {
  const token = localStorage.getItem("access_token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role || "user"; // Devuelve el rol del usuario (o 'user' por defecto)
  } catch (error) {
    return null; // Error al decodificar el token
  }
};

export const getCurrentUser = () => {
  const token = localStorage.getItem("access_token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.username; // Devuelve los datos del usuario
  } catch (error) {
    console.log("Error al decodificar el token:", error);
    return null; // Error al decodificar el token
  }
};
