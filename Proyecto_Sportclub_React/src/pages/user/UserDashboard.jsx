import React from "react";
import AppNavbar from "../../layouts/Navbar";

function UserDashboard() {
  return (
    <>
      <AppNavbar bgColor="#004085" />
      <div className="p-4 rounded shadow-sm" style={{ backgroundColor: "#cce5ff", borderLeft: "6px solid #004085" }}>
        <h2 style={{ color: "#004085" }}>Panel de Usuario</h2>
        <p style={{ color: "#004085" }}>Bienvenido a tu perfil personal de SportClub.</p>
      </div>
    </>
  );
}

export default UserDashboard;