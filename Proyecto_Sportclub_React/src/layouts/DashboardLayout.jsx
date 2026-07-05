import React from "react";
import { Container, Row, Col, Nav, Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "../services/authService";

function DashboardLayout({ children, role, title }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Mapeo de colores según el rol usando clases de Bootstrap
  const sidebarColors = {
    admin: "bg-danger",
    coach: "bg-success",
    user: "bg-primary"
  };

  const bgColorClass = sidebarColors[role] || "bg-dark";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Función para darle el fondo blanco transparente al enlace activo
  const getLinkClass = (path) => {
    return location.pathname === path 
      ? "text-white bg-opacity-25 bg-white rounded fw-bold" 
      : "text-white";
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
                <Nav.Link className={getLinkClass("/admin/dashboard")} onClick={() => navigate("/admin/dashboard")}>Inicio</Nav.Link>
                <Nav.Link className={getLinkClass("/admin/users")} onClick={() => navigate("/admin/users")}>Gestión de Usuarios</Nav.Link>
                <Nav.Link className={getLinkClass("/admin/sports")} onClick={() => navigate("/admin/sports")}>Gestión de Deportes</Nav.Link>
                <Nav.Link className={getLinkClass("/admin/salas")} onClick={() => navigate("/admin/salas")}>Gestión de Salas</Nav.Link>
                <Nav.Link className={getLinkClass("/admin/asignaciones")} onClick={() => navigate("/admin/asignaciones")}>Gestión de Asignaciones</Nav.Link>
                <Nav.Link className={getLinkClass("/admin/horarios")} onClick={() => navigate("/admin/horarios")}>Gestión de Horarios</Nav.Link>
              </>
            )}
            
            {role === "coach" && (
              <>
                <Nav.Link className={getLinkClass("/coach/dashboard")} onClick={() => navigate("/coach/dashboard")}>Inicio</Nav.Link>
                <Nav.Link className={getLinkClass("/coach/clases")} onClick={() => navigate("/coach/clases")}>Mis Clases</Nav.Link>
                <Nav.Link className={getLinkClass("/coach/horario")} onClick={() => navigate("/coach/horario")}>Mi Horario</Nav.Link>
              </>
            )}
            
            {role === "user" && (
              <>
                <Nav.Link className={getLinkClass("/user/dashboard")} onClick={() => navigate("/user/dashboard")}>Inicio</Nav.Link>
                <Nav.Link className={getLinkClass("/user/clases-disponibles")} onClick={() => navigate("/user/clases-disponibles")}>Clases Disponibles</Nav.Link>
                <Nav.Link className={getLinkClass("/user/crear-reserva")} onClick={() => navigate("/user/crear-reserva")}>Crear Reserva</Nav.Link>
                <Nav.Link className={getLinkClass("/user/mis-reservas")} onClick={() => navigate("/user/mis-reservas")}>Mis Reservas</Nav.Link>
              </>
            )}
          </Nav>

          <Button variant="outline-light" className="mt-auto w-100 fw-bold" onClick={handleLogout}>
            Cerrar sesión
          </Button>
        </Col>

        {/* Contenido Principal */}
        <Col md={10} className="p-4 bg-light overflow-auto">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="text-dark m-0 fw-bold">{title}</h2>
          </div>
          {children}
        </Col>
      </Row>
    </Container>
  );
}

export default DashboardLayout;