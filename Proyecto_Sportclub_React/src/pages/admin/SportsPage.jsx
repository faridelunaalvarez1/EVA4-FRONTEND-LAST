import React, { useEffect, useState } from "react";
import { Badge, Button, Card, Form, Spinner, Table } from "react-bootstrap";
import Swal from "sweetalert2";
import SportFormModal from "../../components/sports/SportFormModal";
import { createSport, deleteSport, getSports, toggleSportStatus, updateSport } from "../../services/sportService";

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

function SportsPage() {
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedSport, setSelectedSport] = useState(null);

  const loadSports = async () => {
    try {
      setLoading(true);
      const data = await getSports();
      setSports(data.data || data);
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSports();
  }, []);

  const openCreateModal = () => {
    setSelectedSport(null);
    setShowModal(true);
  };

  const openEditModal = (sport) => {
    setSelectedSport(sport);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedSport(null);
  };

  const handleSave = async (formData) => {
    try {
      if (selectedSport) {
        await updateSport(selectedSport.id, formData);
        Swal.fire("Actualizado", "Deporte actualizado correctamente", "success");
      } else {
        await createSport(formData);
        Swal.fire("Creado", "Deporte creado correctamente", "success");
      }
      closeModal();
      loadSports();
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  const handleDelete = async (sport) => {
    const result = await Swal.fire({
      title: "¿Está seguro de eliminar este deporte?",
      text: `Se eliminará "${sport.name}"`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33",
    });
    if (result.isConfirmed) {
      try {
        await deleteSport(sport.id);
        Swal.fire("Eliminado", "Deporte eliminado correctamente", "success");
        loadSports();
      } catch (error) {
        Swal.fire("Error", error.message, "error");
      }
    }
  };

  const handleToggleStatus = async (sport) => {
    try {
      await toggleSportStatus(sport.id, !sport.status);
      loadSports();
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  return (
    <Card className="shadow-sm border-0 rounded-3 mt-4">
      <Card.Header className="bg-white d-flex justify-content-between align-items-center py-3">
        <h4 className="mb-0 fw-bold text-dark">Gestión de Deportes</h4>
        <div className="d-flex gap-2">
          <Button variant="outline-secondary" onClick={loadSports}>Refrescar</Button>
          <Button variant="primary" onClick={openCreateModal}>+ Nuevo Deporte</Button>
        </div>
      </Card.Header>
      <Card.Body className="p-4">
        {loading ? (
          <div className="text-center p-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 text-muted">Cargando deportes...</p>
          </div>
        ) : (
          <Table responsive striped bordered hover className="align-middle">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Objetivo</th>
                <th>Duración</th>
                <th>Estado</th>
                <th>Fecha de creación</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {sports.map((sport) => (
                <tr key={sport.id}>
                  <td>{sport.id}</td>
                  <td className="fw-semibold">{sport.name}</td>
                  <td>{sport.objective}</td>
                  <td>{sport.duration} min</td>
                  <td>
                    <Form.Check
                      type="switch"
                      checked={sport.status}
                      onChange={() => handleToggleStatus(sport)}
                      label={sport.status ? "Activo" : "Inactivo"}
                    />
                  </td>
                  <td>{formatDate(sport.created_at)}</td>
                  <td>
                    <Button variant="warning" size="sm" className="me-2" onClick={() => openEditModal(sport)}>
                      Editar
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(sport)}>
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
      <SportFormModal
        show={showModal}
        handleClose={closeModal}
        handleSave={handleSave}
        selectedSport={selectedSport}
      />
    </Card>
  );
}

export default SportsPage;