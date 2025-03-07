// src/contexts/AuthContext.jsx

import React, { createContext, useState, useEffect } from "react";
import { isAuthenticated, getUserRole } from "../../utils/auth"; // Ajusta la ruta según tu proyecto

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticatedState, setIsAuthenticatedState] = useState(false);
  const [userRoleState, setUserRoleState] = useState(null);

  // Verificar autenticación al cargar la aplicación
  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticatedState(isAuthenticated());
      setUserRoleState(getUserRole());
    };

    checkAuth();
  }, []);

  // Función para iniciar sesión
  const login = () => {
    setIsAuthenticatedState(true);
    setUserRoleState(getUserRole());
  };

  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setIsAuthenticatedState(false);
    setUserRoleState(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticatedState, userRoleState, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
