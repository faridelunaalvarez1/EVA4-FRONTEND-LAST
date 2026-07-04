import React from "react";
import { Navigate } from "react-router-dom";
import { getUser, isAuthenticated } from "../services/authService";

function RoleRoute({ children, allowedRoles }) {
  // Primero verifica si tiene una sesión activa
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const user = getUser();

  // Si el rol del usuario no está en la lista de roles permitidos, bloquea el acceso
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

export default RoleRoute;