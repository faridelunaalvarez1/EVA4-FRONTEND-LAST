import React from "react";
import { Container, Table, Button } from "react-bootstrap";
import DashboardLayout from "../../layouts/DashboardLayout";

function AsignacionesPage() {
  return (
    <DashboardLayout role="admin" title="Gestión de Asignaciones">
      <Container className="bg-white p-4 rounded shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <p className="text-muted m-0">Asigna deportes y coaches a las salas disponibles.</p>
          <Button variant="danger">
            <i className="bi bi-plus-circle me-2"></i>Nueva Asignación
          </Button>
        </div>

        <Table striped bordered hover responsive className="align-middle">
          <thead className="table-danger">
            <tr>
              <th>ID</th>
              <th>Deporte</th>
              <th>Sala</th>
              <th>Coach Asignado</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td className="fw-bold">Crossfit</td>
              <td>Sala 2 - Funcional</td>
              <td>Juan Pérez</td>
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

export default AsignacionesPage;