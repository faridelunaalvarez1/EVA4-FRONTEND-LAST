import React from "react";
import { Container, Table, Button } from "react-bootstrap";
import DashboardLayout from "../../layouts/DashboardLayout";

function SalasPage() {
  return (
    <DashboardLayout role="admin" title="Gestión de Salas">
      <Container className="bg-white p-4 rounded shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <p className="text-muted m-0">Administra las instalaciones del club.</p>
          <Button variant="danger">
            <i className="bi bi-plus-circle me-2"></i>Nueva Sala
          </Button>
        </div>

        <Table striped bordered hover responsive className="align-middle">
          <thead className="table-danger">
            <tr>
              <th>ID</th>
              <th>Nombre de Sala</th>
              <th>Capacidad</th>
              <th>Estado</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {/* Ejemplo estático: Aquí mapearás los datos de tu API */}
            <tr>
              <td>1</td>
              <td>Sala de Musculación A</td>
              <td>30 personas</td>
              <td><span className="badge bg-success">Activa</span></td>
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

export default SalasPage;