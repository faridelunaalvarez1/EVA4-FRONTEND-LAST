import React from "react";
import { Container, Row, Col, Nav, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/authService";

function DashboardLayout({ children, role, title }) {
  const navigate = useNavigate();

  // Mapeo de colores según el rol usando clases de Bootstrap
  const sidebarColors = {
    admin: "bg-danger",   // Rojo
    coach: "bg-success",  // Verde
    user: "bg-primary"    // Azul
  };

  const bgColorClass = sidebarColors[role] || "bg-dark";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Container fluid className="vh-100 d-flex flex-column p-0">
      <Row className="flex-grow-1 m-0">
        {/* Sidebar */}
        <Col md={2} className={`${bgColorClass} text-white p-3 d-flex flex-column shadow-sm`}>
          <h4 className="text-center mb-4 mt-2 border-bottom pb-2">SportClub</h4>
          
          <Nav className="flex-column flex-grow-1 gap-2">
            {role === "admin" && (
              <>
                <Nav.Link className="text-white bg-opacity-25 bg-white rounded" onClick={() => navigate("/admin/dashboard")}>Inicio</Nav.Link>
                <Nav.Link className="text-white" onClick={() => navigate("/admin/users")}>Gestión de Usuarios</Nav.Link>
                <Nav.Link className="text-white" onClick={() => navigate("/admin/sports")}>Gestión de Deportes</Nav.Link>
                {/* Agrega aquí los enlaces a tus flujos de Admin */}
              </>
            )}
            {role === "coach" && (
              <>
                <Nav.Link className="text-white bg-opacity-25 bg-white rounded" onClick={() => navigate("/coach/dashboard")}>Inicio</Nav.Link>
                {/* Agrega aquí los enlaces a tus flujos de Coach */}
              </>
            )}
            {role === "user" && (
              <>
                <Nav.Link className="text-white bg-opacity-25 bg-white rounded" onClick={() => navigate("/user/dashboard")}>Inicio</Nav.Link>
                {/* Agrega aquí los enlaces a tus flujos de Usuario */}
              </>
            )}
          </Nav>

          <Button variant="outline-light" className="mt-auto w-100" onClick={handleLogout}>
            Cerrar sesión
          </Button>
        </Col>

        {/* Contenido Principal */}
        <Col md={10} className="p-4 bg-light overflow-auto">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="text-dark m-0 fw-bold">{title}</h2>
          </div>
          {/* Aquí se renderiza la página que envuelvas (UsersPage, SportsPage, etc.) */}
          {children}
        </Col>
      </Row>
    </Container>
  );
}

export default DashboardLayout;