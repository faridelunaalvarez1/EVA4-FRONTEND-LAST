import React, { useEffect, useState } from "react";
import { Container, Table, Button, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import DashboardLayout from "../../layouts/DashboardLayout";
import HorarioFormModal from "../../components/horarios/HorarioFormModal";
import { getHorarios, createHorario, updateHorario, deleteHorario } from "../../services/clubService";

function HorariosPage() {
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedHorario, setSelectedHorario] = useState(null);

  const loadData = async () => { setLoading(true); setHorarios(await getHorarios()); setLoading(false); };
  
  useEffect(() => { loadData(); }, []);

  const handleSave = async (formData) => {
    if (selectedHorario) await updateHorario(selectedHorario.id, formData); 
    else await createHorario(formData);
    setShowModal(false); 
    Swal.fire("Éxito", "Horario guardado", "success"); 
    loadData();
  };

  const handleDelete = async (horario) => {
    const res = await Swal.fire({ title: "¿Eliminar Horario?", icon: "warning", showCancelButton: true, confirmButtonColor: "#d33" });
    if (res.isConfirmed) { await deleteHorario(horario.id); Swal.fire("Eliminado", "", "success"); loadData(); }
  };

  return (
    <DashboardLayout role="admin" title="Gestión de Horarios">
      <Container className="bg-white p-4 rounded shadow-sm">
        <div className="d-flex justify-content-between mb-3">
          <p className="text-muted m-0">Administra los bloques de horarios del club.</p>
          <Button variant="danger" onClick={() => { setSelectedHorario(null); setShowModal(true); }}>+ Nuevo Horario</Button>
        </div>
        {loading ? <Spinner animation="border" variant="danger" /> : (
          <Table striped bordered hover responsive className="align-middle">
            <thead className="table-danger">
              <tr><th>Día</th><th>Inicio</th><th>Fin</th><th className="text-center">Acciones</th></tr>
            </thead>
            <tbody>
              {horarios.map(h => (
                <tr key={h.id}>
                  <td className="fw-bold">{h.dia}</td><td>{h.inicio}</td><td>{h.fin}</td>
                  <td className="text-center">
                    <Button variant="outline-danger" size="sm" className="me-2" onClick={() => { setSelectedHorario(h); setShowModal(true); }}>Editar</Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(h)}>Eliminar</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Container>
      <HorarioFormModal show={showModal} handleClose={() => setShowModal(false)} handleSave={handleSave} selectedHorario={selectedHorario} />
    </DashboardLayout>
  );
}

export default HorariosPage;