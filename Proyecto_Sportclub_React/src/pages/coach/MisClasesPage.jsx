import React, { useEffect, useState } from "react";
import { Container, Table, Button, Spinner, Alert } from "react-bootstrap";
import Swal from "sweetalert2";
import { getMisClasesCoach } from "../../services/clubService";

const DIAS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

function MisClasesPage() {
  const [filas, setFilas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarClases = async () => {
    setLoading(true);
    setError(null);
    try {
      const asignaciones = await getMisClasesCoach();
      const lista = Array.isArray(asignaciones) ? asignaciones : [];

      // Cada asignación puede tener varios horarios (schedules).
      // Aplanamos: una fila por cada horario.
      const filasAplanadas = [];
      lista.forEach((asignacion) => {
        const schedules = asignacion.schedules || [];
        if (schedules.length === 0) {
          // Asignación sin horario todavía: la mostramos igual, sin día/hora.
          filasAplanadas.push({
            key: `asig-${asignacion.id}`,
            sport: asignacion.sport?.name || "-",
            room: asignacion.room?.name || "-",
            day: "-",
            start: null,
            end: null,
          });
        } else {
          schedules.forEach((sch) => {
            filasAplanadas.push({
              key: `sch-${sch.id}`,
              sport: asignacion.sport?.name || "-",
              room: asignacion.room?.name || "-",
              day: DIAS[sch.day_of_week] ?? sch.day_of_week,
              start: sch.start_time,
              end: sch.end_time,
            });
          });
        }
      });

      setFilas(filasAplanadas);
    } catch (err) {
      setError("No se pudieron cargar tus clases.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarClases();
  }, []);

  const handleVerAlumnos = () => {
    Swal.fire("Función no disponible aún", "La vista de alumnos inscritos está en desarrollo.", "info");
  };

  return (
    <Container className="bg-white p-4 rounded shadow-sm">
      <p className="text-muted mb-4">Revisa las clases que tienes asignadas y los alumnos inscritos.</p>

      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && (
        <Table striped bordered hover responsive className="align-middle">
          <thead className="table-success">
            <tr>
              <th>Deporte</th>
              <th>Sala Asignada</th>
              <th>Día y Hora</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filas.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center text-muted">
                  No tienes clases asignadas por el momento.
                </td>
              </tr>
            )}
            {filas.map((fila) => (
              <tr key={fila.key}>
                <td className="fw-bold">{fila.sport}</td>
                <td>{fila.room}</td>
                <td>
                  {fila.start ? `${fila.day} - ${fila.start} a ${fila.end}` : "Sin horario asignado"}
                </td>
                <td className="text-center">
                  <Button variant="success" size="sm" onClick={handleVerAlumnos}>
                    Ver Alumnos
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}

export default MisClasesPage;