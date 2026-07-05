import React from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import UsersPage from "./UsersPage";

function AdminDashboard() {
  return (
    <DashboardLayout role="admin" title="Panel de Administración">
      <p className="text-muted mb-4">
        Bienvenido a la sección exclusiva para administradores de SportClub.
      </p>
      
      {/* Tu tabla de usuarios se verá perfectamente integrada aquí */}
      <UsersPage />
    </DashboardLayout>
  );
}

export default AdminDashboard;