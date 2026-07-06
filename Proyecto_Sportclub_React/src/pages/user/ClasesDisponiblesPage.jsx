import React, { useEffect, useState } from "react";
import { Container, Table, Button, Badge, Spinner, Alert } from "react-bootstrap";
import Swal from "sweetalert2";
import { getClasesDisponibles, crearReserva } from "../../services/clubService";

function ClasesDisponiblesPage() {
  const [clases, setClases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarClases = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getClasesDisponibles();
      setClases(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("No se pudieron cargar las clases disponibles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarClases();
  }, []);

  const handleReservar = async (clase) => {
    const confirm = await Swal.fire({
      title: "¿Confirmar reserva?",
      text: `Vas a reservar: ${clase.sport_room?.sport?.name || "esta clase"}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, reservar",
      cancelButtonText: "Cancelar",
    });

    if (!confirm.isConfirmed) return;

    try {
      await crearReserva(clase.id);
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
              <th>Horario</th>
              <th>Sala</th>
              <th className="text-center">Reserva</th>
            </tr>
          </thead>
          <tbody>
            {clases.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-muted">
                  No hay clases disponibles por el momento.
                </td>
              </tr>
            )}
            {clases.map((clase) => (
              <tr key={clase.id}>
                <td className="fw-bold">{clase.sport_room?.sport?.name || "-"}</td>
                <td>{clase.sport_room?.coach?.full_name || "-"}</td>
                <td>{clase.start_time} - {clase.end_time}</td>
                <td>{clase.sport_room?.room?.name || "-"}</td>
                <td className="text-center">
                  <Button variant="primary" size="sm" onClick={() => handleReservar(clase)}>
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