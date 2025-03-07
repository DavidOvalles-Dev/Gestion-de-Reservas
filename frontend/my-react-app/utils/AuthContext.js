import React, { createContext, useState, useEffect } from "react";
import { isAuthenticated, getUserRole } from "../utils/auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticatedState, setIsAuthenticatedState] = useState(false);
  const [userRoleState, setUserRoleState] = useState(null);

  useEffect(() => {
    // Verificar autenticación al cargar la aplicación
    const checkAuth = () => {
      a;
      setIsAuthenticatedState(isAuthenticated());
      setUserRoleState(getUserRole());
    };

    checkAuth();
  }, []);

  // Función para actualizar el estado después de iniciar sesión
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
      value={{
        isAuthenticated: isAuthenticatedState,
        userRole: userRoleState,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
