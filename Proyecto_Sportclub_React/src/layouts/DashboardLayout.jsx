import React from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import { logout } from "../services/authService";

const DashboardLayout = ({ role }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getRoleColor = () => {
    if (role === "admin") return "bg-red-800";
    if (role === "coach") return "bg-blue-800";
    return "bg-green-700";
  };

  const getRoleLinks = () => {
    if (role === "admin") return [
      { path: "/admin/dashboard", label: "Inicio Admin" },
      { path: "/admin/users", label: "Gestión de Usuarios" },
      { path: "/admin/sports", label: "Gestión Deportes" },
      { path: "/admin/salas", label: "Gestión Salas" },
      { path: "/admin/asignaciones", label: "Asignaciones" },
      { path: "/admin/horarios", label: "Horarios" }
    ];
    if (role === "coach") return [
      { path: "/coach/dashboard", label: "Inicio Coach" },
      { path: "/coach/clases", label: "Mis Clases" }
    ];
    return [
      { path: "/user/dashboard", label: "Inicio Usuario" },
      { path: "/user/clases-disponibles", label: "Clases Disponibles" },
      { path: "/user/mis-reservas", label: "Mis Reservas" }
    ];
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <aside className={`w-64 text-white flex flex-col shadow-xl ${getRoleColor()}`}>
        <div className="p-6 text-center border-b border-white/20">
          <h2 className="text-2xl font-bold tracking-wider">SportClub</h2>
          <div className="text-xs font-semibold uppercase mt-1 opacity-75">Panel de {role}</div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {getRoleLinks().map((link) => (
            <Link key={link.path} to={link.path} className="block px-4 py-3 rounded-lg hover:bg-white/20 transition-all font-medium">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/20">
          <button onClick={handleLogout} className="w-full bg-black/30 hover:bg-black/50 py-3 rounded-lg text-white font-bold transition-all shadow-md">
            Cerrar Sesión
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-8 bg-gray-50">
        <div className="bg-white rounded-xl shadow-sm p-6 min-h-full border border-gray-100 relative">
          <Outlet /> 
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;