import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import UsersPage from "./UsersPage";
import AppNavbar from "../../layouts/Navbar";

function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <>
      <AppNavbar bgColor="#721c24" />
      <div className="p-4 rounded shadow-sm" style={{ backgroundColor: "#f8d7da", borderLeft: "6px solid #721c24" }}>
        <h2 style={{ color: "#721c24" }}>Panel de Administración</h2>
        <p style={{ color: "#721c24" }}>Bienvenido a la sección exclusiva para administradores de SportClub.</p>
        <div className="mb-4">
          <Button variant="danger" onClick={() => navigate("/admin/sports")}>
            Gestión de Deportes
          </Button>
        </div>
        <UsersPage />
      </div>
    </>
  );
}

export default AdminDashboard;