import React, { useEffect, useState } from "react";
import { Container, Table, Button, Spinner, Alert } from "react-bootstrap";
import Swal from "sweetalert2";
import { getClasesDisponibles, crearReserva } from "../../services/clubService";

const DIAS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

function ClasesDisponiblesPage() {
  const [filas, setFilas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarClases = async () => {
    setLoading(true);
    setError(null);
    try {
      const asignaciones = await getClasesDisponibles();
      const lista = Array.isArray(asignaciones) ? asignaciones : [];

      // Cada asignación puede tener varios horarios (schedules).
      // Aplanamos: una fila por cada horario disponible.
      const filasAplanadas = [];
      lista.forEach((asignacion) => {
        const schedules = asignacion.schedules || [];
        schedules.forEach((sch) => {
          filasAplanadas.push({
            scheduleId: sch.id,
            sport: asignacion.sport?.name || "-",
            coach: asignacion.coach?.full_name || asignacion.coach?.email || "-",
            room: asignacion.room?.name || "-",
            day: DIAS[sch.day_of_week] ?? sch.day_of_week,
            start: sch.start_time,
            end: sch.end_time,
          });
        });
      });

      setFilas(filasAplanadas);
    } catch (err) {
      setError("No se pudieron cargar las clases disponibles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarClases();
  }, []);

  const handleReservar = async (fila) => {
    const confirm = await Swal.fire({
      title: "¿Confirmar reserva?",
      text: `Vas a reservar: ${fila.sport} (${fila.day} ${fila.start})`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, reservar",
      cancelButtonText: "Cancelar",
    });

    if (!confirm.isConfirmed) return;

    try {
      await crearReserva(fila.scheduleId);
      Swal.fire("¡Reservado!", "Tu cupo fue reservado con éxito.", "success");
      cargarClases();
    } catch (err) {
      Swal.fire("Error", "No se pudo reservar el cupo. Intenta de nuevo.", "error");
    }
  };

  return (
    <Container className="bg-white p-4 rounded shadow-sm">
      <p className="text-muted mb-4">Encuentra tu clase ideal y reserva tu cupo rápidamente.</p>

      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && (
        <Table hover responsive className="align-middle">
          <thead className="table-primary">
            <tr>
              <th>Deporte</th>
              <th>Coach</th>
              <th>Día</th>
              <th>Horario</th>
              <th>Sala</th>
              <th className="text-center">Reserva</th>
            </tr>
          </thead>
          <tbody>
            {filas.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-muted">
                  No hay clases disponibles con horario asignado por el momento.
                </td>
              </tr>
            )}
            {filas.map((fila) => (
              <tr key={fila.scheduleId}>
                <td className="fw-bold">{fila.sport}</td>
                <td>{fila.coach}</td>
                <td>{fila.day}</td>
                <td>{fila.start} - {fila.end}</td>
                <td>{fila.room}</td>
                <td className="text-center">
                  <Button variant="primary" size="sm" onClick={() => handleReservar(fila)}>
                    Reservar Cupo
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

export default ClasesDisponiblesPage;