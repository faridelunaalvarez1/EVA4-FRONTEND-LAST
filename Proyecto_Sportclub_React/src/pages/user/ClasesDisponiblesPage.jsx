import React from "react";
import { Container, Table, Button, Badge } from "react-bootstrap";
import DashboardLayout from "../../layouts/DashboardLayout";

function ClasesDisponiblesPage() {
  return (
    <DashboardLayout role="user" title="Clases Disponibles">
      <Container className="bg-white p-4 rounded shadow-sm">
        <p className="text-muted mb-4">Encuentra tu clase ideal y reserva tu cupo rápidamente.</p>

        <Table hover responsive className="align-middle">
          <thead className="table-primary">
            <tr>
              <th>Deporte</th>
              <th>Coach</th>
              <th>Horario</th>
              <th>Disponibilidad</th>
              <th className="text-center">Reserva</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="fw-bold">Yoga Integral</td>
              <td>María José (Coach)</td>
              <td>Martes - 18:00 PM</td>
              <td><Badge bg="info">5 cupos libres</Badge></td>
              <td className="text-center">
                {/* Aquí enlazarás tu función SweetAlert2 para confirmar la reserva */}
                <Button variant="primary" size="sm">Reservar Cupo</Button>
              </td>
            </tr>
          </tbody>
        </Table>
      </Container>
    </DashboardLayout>
  );
}

export default ClasesDisponiblesPage;