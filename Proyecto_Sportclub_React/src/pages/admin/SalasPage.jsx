import React, { useEffect, useState } from "react";
import { Badge, Button, Card, Spinner, Table, Container } from "react-bootstrap";
import Swal from "sweetalert2";
import DashboardLayout from "../../layouts/DashboardLayout";
import SalaFormModal from "../../components/salas/SalaFormModal"; // Crearemos este modal ahora
// IMPORTANTE: Deberás tener un servicio creado para las salas, similar a userService.js
import { getSalas, createSala, updateSala, deleteSala } from "../../services/salaService"; 

function SalasPage() {
  const [salas, setSalas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedSala, setSelectedSala] = useState(null);

  const loadSalas = async () => {
    try {
      setLoading(true);
      const data = await getSalas();
      setSalas(data.data || data); // Depende de cómo venga tu API
    } catch (error) {
      Swal.fire("Error", "No se pudieron cargar las salas", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSalas();
  }, []);

  const openCreateModal = () => {
    setSelectedSala(null);
    setShowModal(true);
  };

  const openEditModal = (sala) => {
    setSelectedSala(sala);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedSala(null);
  };

  const handleSave = async (formData) => {
    try {
      if (selectedSala) {
        await updateSala(selectedSala.id, formData);
        Swal.fire("Actualizada", "Sala actualizada correctamente", "success");
      } else {
        await createSala(formData);
        Swal.fire("Creada", "Sala creada correctamente", "success");
      }
      closeModal();
      loadSalas(); // Actualización automática de la interfaz
    } catch (error) {
      Swal.fire("Error", "Ocurrió un problema al guardar", "error");
    }
  };

  const handleDelete = async (sala) => {
    const result = await Swal.fire({
      title: "¿Eliminar sala?",
      text: `Esta acción eliminará la sala ${sala.nombre}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33"
    });

    if (result.isConfirmed) {
      try {
        await deleteSala(sala.id);
        Swal.fire("Eliminada", "Sala eliminada correctamente", "success");
        loadSalas();
      } catch (error) {
        Swal.fire("Error", "No se pudo eliminar la sala", "error");
      }
    }
  };

  return (
    <DashboardLayout role="admin" title="Gestión de Salas">
      <Container className="bg-white p-4 rounded shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <p className="text-muted m-0">Administra las instalaciones del club.</p>
          <Button variant="danger" onClick={openCreateModal} className="fw-semibold">
            <i className="bi bi-plus-circle me-2"></i>+ Nueva Sala
          </Button>
        </div>

        {loading ? (
          <div className="text-center p-5">
            <Spinner animation="border" variant="danger" />
            <p className="mt-2 text-muted">Cargando salas...</p>
          </div>
        ) : (
          <Table striped bordered hover responsive className="align-middle">
            <thead className="table-danger">
              <tr>
                <th>ID</th>
                <th>Nombre de Sala</th>
                <th>Capacidad</th>
                <th>Estado</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {salas.map((sala) => (
                <tr key={sala.id}>
                  <td>{sala.id}</td>
                  <td className="fw-bold">{sala.nombre}</td>
                  <td>{sala.capacidad} personas</td>
                  <td>
                    <Badge bg={sala.estado === "Activa" ? "success" : "secondary"}>
                      {sala.estado}
                    </Badge>
                  </td>
                  <td className="text-center">
                    <Button variant="outline-danger" size="sm" className="me-2" onClick={() => openEditModal(sala)}>
                      Editar
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(sala)}>
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
              {salas.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center text-muted py-4">No hay salas registradas.</td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
      </Container>

      {/* Aquí renderizamos wujuu */}
      <SalaFormModal
        show={showModal}
        handleClose={closeModal}
        handleSave={handleSave}
        selectedSala={selectedSala}
      />
    </DashboardLayout>
  );
}

export default SalasPage;