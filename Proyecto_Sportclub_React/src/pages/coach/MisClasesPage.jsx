import React from "react";
import { Container, Table, Button } from "react-bootstrap";

function MisClasesPage() {
  return (
    <Container className="bg-white p-4 rounded shadow-sm">
      <p className="text-muted mb-4">Revisa las clases que tienes asignadas y los alumnos inscritos.</p>
      <Table striped bordered hover responsive className="align-middle">
        <thead className="table-success">
          <tr>
            <th>Deporte</th>
            <th>Sala Asignada</th>
            <th>Día y Hora</th>
            <th>Inscritos / Capacidad</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="fw-bold">Crossfit</td>
            <td>Sala 2 - Funcional</td>
            <td>Lunes - 10:00 AM</td>
            <td>15 / 20</td>
            <td className="text-center">
              <Button variant="success" size="sm">Ver Alumnos</Button>
            </td>
          </tr>
        </tbody>
      </Table>
    </Container>
  );
}

export default MisClasesPage;