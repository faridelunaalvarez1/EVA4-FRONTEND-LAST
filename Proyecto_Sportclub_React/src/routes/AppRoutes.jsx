import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Unauthorized from "../pages/Unauthorized";
import RoleRoute from "./RoleRoute";
import DashboardLayout from "../layouts/DashboardLayout";
// Vistas de Admin
import AdminDashboard from "../pages/admin/AdminDashboard";
import UsersPage from "../pages/admin/UsersPage";
import SportsPage from "../pages/admin/SportsPage";
import SalasPage from "../pages/admin/SalasPage";
import AsignacionesPage from "../pages/admin/AsignacionesPage";
import HorariosPage from "../pages/admin/HorariosPage";
// Vistas de Coach
import CoachDashboard from "../pages/coach/CoachDashboard";
import MisClasesPage from "../pages/coach/MisClasesPage";
// Vistas de User
import UserDashboard from "../pages/user/UserDashboard";
import ClasesDisponiblesPage from "../pages/user/ClasesDisponiblesPage";
import MisReservasPage from "../pages/user/MisReservasPage";
// Vista compartida de Perfil
import PerfilPage from "../pages/PerfilPage";
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      {/* RUTAS DE ADMINISTRADOR (Anidadas en el Layout) */}
      <Route path="/admin" element={<RoleRoute allowedRoles={["admin"]}><DashboardLayout role="admin" /></RoleRoute>}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="sports" element={<SportsPage />} />
        <Route path="salas" element={<SalasPage />} />
        <Route path="asignaciones" element={<AsignacionesPage />} />
        <Route path="horarios" element={<HorariosPage />} />
        <Route path="perfil" element={<PerfilPage />} />
      </Route>
      {/* RUTAS DE COACH */}
      <Route path="/coach" element={<RoleRoute allowedRoles={["coach"]}><DashboardLayout role="coach" /></RoleRoute>}>
        <Route path="dashboard" element={<CoachDashboard />} />
        <Route path="clases" element={<MisClasesPage />} />
        <Route path="horario" element={<MisClasesPage />} />
        <Route path="perfil" element={<PerfilPage />} />
      </Route>
      {/* RUTAS DE USUARIO */}
      <Route path="/user" element={<RoleRoute allowedRoles={["user"]}><DashboardLayout role="user" /></RoleRoute>}>
        <Route path="dashboard" element={<UserDashboard />} />
        <Route path="clases-disponibles" element={<ClasesDisponiblesPage />} />
        <Route path="crear-reserva" element={<ClasesDisponiblesPage />} />
        <Route path="mis-reservas" element={<MisReservasPage />} />
        <Route path="perfil" element={<PerfilPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};
export default AppRoutes;
