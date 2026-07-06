import React from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import { logout } from "../services/authService";

const DashboardLayout = ({ role }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getRoleStyle = () => {
    if (role === "admin") return { backgroundColor: "#a12a2a" };
    if (role === "coach") return { backgroundColor: "#1e5aa8" };
    return { backgroundColor: "#1a7a4c" };
  };

  const getContentBg = () => {
    if (role === "admin") return "#f7e9e9";
    if (role === "coach") return "#e8eef6";
    return "#e8f3ec";
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
    <div className="d-flex vh-100">
      <aside className="text-white d-flex flex-column shadow" style={{ width: "260px", ...getRoleStyle() }}>
        <div className="p-4 text-center border-bottom border-light border-opacity-25">
          <h2 className="fw-bold mb-1">SportClub</h2>
          <div className="small text-uppercase opacity-75">Panel de {role}</div>
        </div>

        <nav className="flex-grow-1 p-3 overflow-auto">
          {getRoleLinks().map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="d-block text-white text-decoration-none px-3 py-2 mb-1 rounded"
              style={{ transition: "background-color 0.2s" }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.15)"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-top border-light border-opacity-25">
          <button
            onClick={handleLogout}
            className="btn w-100 fw-bold text-white"
            style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
          >
            Cerrar Sesión
          </button>
        </div>
      </aside>

      <main className="flex-grow-1 overflow-auto p-4" style={{ backgroundColor: getContentBg() }}>
        <div className="rounded shadow-sm p-4" style={{ minHeight: "100%", backgroundColor: getContentBg() }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;