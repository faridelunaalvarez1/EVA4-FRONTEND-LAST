import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Páginas Públicas
import Login from "../pages/Login";
import Register from "../pages/Register";
import Unauthorized from "../pages/Unauthorized";

// Dashboards principales
import AdminDashboard from "../pages/admin/AdminDashboard";
import CoachDashboard from "../pages/coach/CoachDashboard";
import UserDashboard from "../pages/user/UserDashboard";

// Flujos de Admin (Base Obligatoria + Nuevos)
import UsersPage from "../pages/admin/UsersPage";
import SportsPage from "../pages/admin/SportsPage";
import SalasPage from "../pages/admin/SalasPage";
import AsignacionesPage from "../pages/admin/AsignacionesPage";
import HorariosPage from "../pages/admin/HorariosPage";

// Flujos de Coach
import MisClasesPage from "../pages/coach/MisClasesPage";

// Flujos de Usuario
import ClasesDisponiblesPage from "../pages/user/ClasesDisponiblesPage";
import MisReservasPage from "../pages/user/MisReservasPage";

// Componentes de Seguridad
import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Rutas de Usuario */}
        <Route 
          path="/user/*" 
          element={
            <RoleRoute allowedRoles={["user"]}>
              <Routes>
                <Route path="dashboard" element={<UserDashboard />} />
                {/* Flujo 6 y 7 apuntan a la misma vista que tiene el botón de reservar */}
                <Route path="clases-disponibles" element={<ClasesDisponiblesPage />} />
                <Route path="crear-reserva" element={<ClasesDisponiblesPage />} />
                {/* Flujo 8 */}
                <Route path="mis-reservas" element={<MisReservasPage />} />
              </Routes>
            </RoleRoute>
          } 
        />
        
        {/* Rutas de Coach */}
        <Route 
          path="/coach/*" 
          element={
            <RoleRoute allowedRoles={["coach"]}>
              <Routes>
                <Route path="dashboard" element={<CoachDashboard />} />
                {/* Flujo 4 y 5 apuntan a la vista unificada del Coach */}
                <Route path="clases" element={<MisClasesPage />} />
                <Route path="horario" element={<MisClasesPage />} />
              </Routes>
            </RoleRoute>
          } 
        />

        {/* Rutas de Admin */}
        <Route 
          path="/admin/*" 
          element={
            <RoleRoute allowedRoles={["admin"]}>
              <Routes>
                <Route path="dashboard" element={<AdminDashboard />} />
                {/* Base Obligatoria */}
                <Route path="users" element={<UsersPage />} />
                <Route path="sports" element={<SportsPage />} />
                {/* Flujos 1, 2 y 3 */}
                <Route path="salas" element={<SalasPage />} />
                <Route path="asignaciones" element={<AsignacionesPage />} />
                <Route path="horarios" element={<HorariosPage />} />
              </Routes>
            </RoleRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;