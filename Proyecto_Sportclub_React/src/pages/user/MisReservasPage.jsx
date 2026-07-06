import React from "react";
import { Container, Table, Button, Badge } from "react-bootstrap";

function MisReservasPage() {
  return (
    <Container className="bg-white p-4 rounded shadow-sm">
      <p className="text-muted mb-4">Revisa las clases que has reservado o cancela tu asistencia.</p>
      <Table hover responsive className="align-middle">
        <thead className="table-primary">
          <tr>
            <th>Deporte</th>
            <th>Coach</th>
            <th>Horario</th>
            <th>Estado</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="fw-bold">Yoga Integral</td>
            <td>María José (Coach)</td>
            <td>Martes - 18:00 PM</td>
            <td><Badge bg="success">Confirmada</Badge></td>
            <td className="text-center">
              {/* Aquí enlazarás tu función SweetAlert2 para cancelar con tu API */}
              <Button variant="outline-danger" size="sm">Cancelar Reserva</Button>
            </td>
          </tr>
        </tbody>
      </Table>
    </Container>
  );
}

export default MisReservasPage;