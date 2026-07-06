import React, { useEffect, useState } from "react";
import { Container, Table, Spinner, Alert, Badge } from "react-bootstrap";
import { getMisClasesCoach } from "../../services/clubService";

const DIAS = ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"];

function MiHorarioPage() {
  const [horarioPorDia, setHorarioPorDia] = useState({});
  const [sinHorario, setSinHorario] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarHorario = async () => {
    setLoading(true);
    setError(null);
    try {
      const asignaciones = await getMisClasesCoach();
      const lista = Array.isArray(asignaciones) ? asignaciones : [];

      const agrupado = {};
      const pendientes = [];

      lista.forEach((asignacion) => {
        const schedules = asignacion.schedules || [];

        if (schedules.length === 0) {
          pendientes.push({
            key: `asig-${asignacion.id}`,
            sport: asignacion.sport?.name || "-",
            room: asignacion.room?.name || "-",
          });
          return;
        }

        schedules.forEach((sch) => {
          const dia = DIAS[sch.day_of_week] ?? `Dia ${sch.day_of_week}`;
          if (!agrupado[dia]) {
            agrupado[dia] = [];
          }
          agrupado[dia].push({
            key: `sch-${sch.id}`,
            sport: asignacion.sport?.name || "-",
            room: asignacion.room?.name || "-",
            start: sch.start_time,
            end: sch.end_time,
          });
        });
      });

      // Ordenar cada dia por hora de inicio
      Object.keys(agrupado).forEach((dia) => {
        agrupado[dia].sort((a, b) => (a.start || "").localeCompare(b.start || ""));
      });

      setHorarioPorDia(agrupado);
      setSinHorario(pendientes);
    } catch (err) {
      setError("No se pudo cargar tu horario.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarHorario();
  }, []);

  // Orden fijo de dias empezando el Lunes, para que se vea como semana
  const ordenSemana = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"];
  const diasConClases = ordenSemana.filter((dia) => horarioPorDia[dia]);

  return (
    <Container className="bg-white p-4 rounded shadow-sm">
      <p className="text-muted mb-4">Consulta tu horario semanal de clases asignadas.</p>

      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && (
        <>
          {diasConClases.length === 0 && sinHorario.length === 0 && (
            <Alert variant="secondary">Aun no tienes horarios asignados.</Alert>
          )}

          {diasConClases.map((dia) => (
            <div key={dia} className="mb-4">
              <h5 className="fw-bold text-success border-bottom pb-2">{dia}</h5>
              <Table striped bordered hover responsive className="align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Hora</th>
                    <th>Deporte</th>
                    <th>Sala</th>
                  </tr>
                </thead>
                <tbody>
                  {horarioPorDia[dia].map((clase) => (
                    <tr key={clase.key}>
                      <td>
                        <Badge bg="success">{clase.start} - {clase.end}</Badge>
                      </td>
                      <td className="fw-bold">{clase.sport}</td>
                      <td>{clase.room}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ))}

          {sinHorario.length > 0 && (
            <div className="mt-4">
              <h5 className="fw-bold text-muted border-bottom pb-2">Sin horario asignado</h5>
              <Table striped bordered hover responsive className="align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Deporte</th>
                    <th>Sala</th>
                  </tr>
                </thead>
                <tbody>
                  {sinHorario.map((item) => (
                    <tr key={item.key}>
                      <td className="fw-bold">{item.sport}</td>
                      <td>{item.room}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </>
      )}
    </Container>
  );
}

export default MiHorarioPage;
