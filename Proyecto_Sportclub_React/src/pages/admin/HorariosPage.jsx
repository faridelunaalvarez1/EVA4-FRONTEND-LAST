import React from "react";
import { Container, Table, Button } from "react-bootstrap";
import DashboardLayout from "../../layouts/DashboardLayout";

function HorariosPage() {
  return (
    <DashboardLayout role="admin" title="Gestión de Horarios">
      <Container className="bg-white p-4 rounded shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <p className="text-muted m-0">Administra los bloques de horarios del club.</p>
          <Button variant="danger">
            <i className="bi bi-plus-circle me-2"></i>Nuevo Horario
          </Button>
        </div>

        <Table striped bordered hover responsive className="align-middle">
          <thead className="table-danger">
            <tr>
              <th>ID</th>
              <th>Día de la semana</th>
              <th>Hora de Inicio</th>
              <th>Hora de Fin</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td className="fw-bold">Lunes</td>
              <td>08:00 AM</td>
              <td>09:00 AM</td>
              <td className="text-center">
                <Button variant="outline-danger" size="sm" className="me-2">Editar</Button>
                <Button variant="danger" size="sm">Eliminar</Button>
              </td>
            </tr>
          </tbody>
        </Table>
      </Container>
    </DashboardLayout>
  );
}

export default HorariosPage;