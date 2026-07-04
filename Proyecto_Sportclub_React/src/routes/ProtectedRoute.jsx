import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../services/authService";

function ProtectedRoute({ children }) {
  // Si no está autenticado, lo expulsa directo al login
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Si está logueado, lo deja pasar al componente hijo
  return children;
}

export default ProtectedRoute;