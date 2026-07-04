import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Unauthorized from "../pages/Unauthorized";
import UsersPage from "../pages/admin/UsersPage";
import SportsPage from "../pages/admin/SportsPage";

// Tableros por rol
import UserDashboard from "../pages/user/UserDashboard";
import CoachDashboard from "../pages/coach/CoachDashboard";
import AdminDashboard from "../pages/admin/AdminDashboard";

// Componentes de Seguridad
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route 
          path="/user/dashboard" 
          element={
            <RoleRoute allowedRoles={["user"]}><UserDashboard /></RoleRoute>
          } 
        />
        
        <Route 
          path="/coach/dashboard" 
          element={
            <RoleRoute allowedRoles={["coach"]}><CoachDashboard /></RoleRoute>
          } 
        />

        <Route 
          path="/admin/*" 
          element={
            <RoleRoute allowedRoles={["admin"]}>
              <Routes>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="users" element={<UsersPage />} />
                <Route path="sports" element={<SportsPage />} />
              </Routes>
            </RoleRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;