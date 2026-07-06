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
      title: "Cancelar reserva?",
      text: "Esta accion no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Si, cancelar",
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

  const esCancelada = (status) => status === "cancelled" || status === "cancelada" || status === "cancelled_by_user";

  const renderEstado = (status) => {
    if (status === "active" || status === "confirmed" || status === "confirmada") {
      return <Badge bg="success">Activa</Badge>;
    }
    if (esCancelada(status)) {
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
              <th>Sala</th>
              <th>Coach</th>
              <th>Horario</th>
              <th>Estado</th>
              <th className="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reservas.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-muted">
                  No tienes reservas todavia.
                </td>
              </tr>
            )}
            {reservas.map((reserva) => {
              const sportRoom = reserva.classSchedule?.sportRoom;
              return (
                <tr key={reserva.id}>
                  <td className="fw-bold">{sportRoom?.sport?.name || "-"}</td>
                  <td>{sportRoom?.room?.name || "-"}</td>
                  <td>{sportRoom?.coach?.email || "-"}</td>
                  <td>
                    {reserva.classSchedule?.start_time} - {reserva.classSchedule?.end_time}
                  </td>
                  <td>{renderEstado(reserva.status)}</td>
                  <td className="text-center">
                    {!esCancelada(reserva.status) && (
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
              );
            })}
          </tbody>
        </Table>
      )}
    </Container>
  );
}

export default MisReservasPage;
