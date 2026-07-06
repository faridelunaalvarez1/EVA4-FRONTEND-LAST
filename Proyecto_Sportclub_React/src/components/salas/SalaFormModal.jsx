import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

function SalaFormModal({ show, handleClose, handleSave, selectedSala }) {
  const [formData, setFormData] = useState({
    name: "",
    capacity: "",
    status: true
  });

  useEffect(() => {
    if (selectedSala) {
      setFormData({
        name: selectedSala.name || "",
        capacity: selectedSala.capacity || "",
        status: selectedSala.status !== undefined ? selectedSala.status : true
      });
    } else {
      setFormData({ name: "", capacity: "", status: true });
    }
  }, [selectedSala, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "status") {
      setFormData({ ...formData, status: value === "true" });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleSave({ ...formData, capacity: Number(formData.capacity) });
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static">
      <Modal.Header closeButton className="bg-danger text-white">
        <Modal.Title>{selectedSala ? "Editar Sala" : "Nueva Sala"}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={onSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Nombre de la Sala</Form.Label>
            <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Ej. Sala de Yoga" required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Capacidad Máxima</Form.Label>
            <Form.Control type="number" name="capacity" value={formData.capacity} onChange={handleChange} placeholder="Ej. 20" required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Estado</Form.Label>
            <Form.Select name="status" value={String(formData.status)} onChange={handleChange}>
              <option value="true">Activa</option>
              <option value="false">Inactiva</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
          <Button variant="danger" type="submit">Guardar Sala</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default SalaFormModal;