import React, { useEffect, useState } from "react";
import { Container, Table, Button, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import AsignacionFormModal from "../../components/asignaciones/AsignacionesFormModal";
import { getAsignaciones, createAsignacion, updateAsignacion, deleteAsignacion } from "../../services/clubService";

function AsignacionesPage() {
  const [asignaciones, setAsignaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedAsignacion, setSelectedAsignacion] = useState(null);

  const loadData = async () => {
    setLoading(true);
    const data = await getAsignaciones();
    setAsignaciones(data.data || data);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const handleSave = async (formData) => {
    if (selectedAsignacion) await updateAsignacion(selectedAsignacion.id, formData);
    else await createAsignacion(formData);
    setShowModal(false);
    Swal.fire("Éxito", "Asignación guardada", "success");
    loadData();
  };

  const handleDelete = async (asig) => {
    const result = await Swal.fire({ title: "¿Eliminar?", text: `Se borrará la asignación de ${asig.deporte}`, icon: "warning", showCancelButton: true, confirmButtonColor: "#d33", confirmButtonText: "Sí, eliminar" });
    if (result.isConfirmed) {
      await deleteAsignacion(asig.id);
      Swal.fire("Eliminado", "", "success");
      loadData();
    }
  };

  return (
    <Container className="bg-white p-4 rounded shadow-sm">
      <div className="d-flex justify-content-between mb-3">
        <p className="text-muted m-0">Asigna deportes y coaches a las salas.</p>
        <Button variant="danger" onClick={() => { setSelectedAsignacion(null); setShowModal(true); }}>+ Nueva Asignación</Button>
      </div>
      {loading ? <Spinner animation="border" variant="danger" /> : (
        <Table striped bordered hover responsive className="align-middle">
          <thead className="table-danger">
            <tr><th>ID</th><th>Deporte</th><th>Sala</th><th>Coach</th><th className="text-center">Acciones</th></tr>
          </thead>
          <tbody>
            {asignaciones.map(a => (
              <tr key={a.id}>
                <td>{a.id}</td><td className="fw-bold">{a.deporte}</td><td>{a.sala}</td><td>{a.coach}</td>
                <td className="text-center">
                  <Button variant="outline-danger" size="sm" className="me-2" onClick={() => { setSelectedAsignacion(a); setShowModal(true); }}>Editar</Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(a)}>Eliminar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <AsignacionFormModal show={showModal} handleClose={() => setShowModal(false)} handleSave={handleSave} selectedAsignacion={selectedAsignacion} />
    </Container>
  );
}

export default AsignacionesPage;