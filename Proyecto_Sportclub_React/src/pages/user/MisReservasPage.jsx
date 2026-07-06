import React, { useEffect, useState } from "react";
import { Container, Table, Button, Badge, Spinner, Alert } from "react-bootstrap";
import Swal from "sweetalert2";
import { getMisReservas, cancelarReserva } from "../../services/clubService";

function MisReservasPage() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarReservas = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMisReservas();
      setReservas(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("No se pudieron cargar tus reservas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarReservas();
  }, []);

  const handleCancelar = async (reserva) => {
    const confirm = await Swal.fire({
      title: "¿Cancelar reserva?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, cancelar",
      cancelButtonText: "Volver",
    });

    if (!confirm.isConfirmed) return;

    try {
      await cancelarReserva(reserva.id);
      Swal.fire("Cancelada", "Tu reserva fue cancelada.", "success");
      cargarReservas();
    } catch (err) {
      Swal.fire("Error", "No se pudo cancelar la reserva. Intenta de nuevo.", "error");
    }
  };

  const renderEstado = (status) => {
    if (status === "confirmed" || status === "confirmada") {
      return <Badge bg="success">Confirmada</Badge>;
    }
    if (status === "cancelled" || status === "cancelada") {
      return <Badge bg="secondary">Cancelada</Badge>;
    }
    return <Badge bg="warning">{status}</Badge>;
  };

  return (
    <Container className="bg-white p-4 rounded shadow-sm">
      <p className="text-muted mb-4">Revisa las clases que has reservado o cancela tu asistencia.</p>

      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && (
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
            {reservas.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-muted">
                  No tienes reservas todavía.
                </td>
              </tr>
            )}
            {reservas.map((reserva) => (
              <tr key={reserva.id}>
                <td className="fw-bold">
                  {reserva.class_schedule?.sport_room?.sport?.name || "-"}
                </td>
                <td>{reserva.class_schedule?.sport_room?.coach?.full_name || "-"}</td>
                <td>
                  {reserva.class_schedule?.start_time} - {reserva.class_schedule?.end_time}
                </td>
                <td>{renderEstado(reserva.status)}</td>
                <td className="text-center">
                  {reserva.status !== "cancelled" && reserva.status !== "cancelada" && (
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleCancelar(reserva)}
                    >
                      Cancelar Reserva
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
}

export default MisReservasPage;