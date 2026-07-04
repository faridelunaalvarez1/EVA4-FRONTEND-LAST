import React from "react";
import AppNavbar from "../../layouts/Navbar";

function CoachDashboard() {
  return (
    <>
      <AppNavbar bgColor="#155724" />
      <div className="p-4 rounded shadow-sm" style={{ backgroundColor: "#d4edda", borderLeft: "6px solid #28a745" }}>
        <h2 style={{ color: "#155724" }}>Panel del Coach</h2>
        <p style={{ color: "#155724" }}>Bienvenido a la sección de entrenadores y rutinas de SportClub.</p>
      </div>
    </>
  );
}

export default CoachDashboard;