import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

function AsignacionFormModal({ show, handleClose, handleSave, selectedAsignacion }) {
  const [formData, setFormData] = useState({ deporte: "", sala: "", coach: "" });

  useEffect(() => {
    if (selectedAsignacion) {
      setFormData(selectedAsignacion);
    } else {
      setFormData({ deporte: "", sala: "", coach: "" });
    }
  }, [selectedAsignacion, show]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    handleSave(formData);
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static">
      <Modal.Header closeButton className="bg-danger text-white">
        <Modal.Title>{selectedAsignacion ? "Editar Asignación" : "Nueva Asignación"}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={onSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Deporte</Form.Label>
            <Form.Control type="text" name="deporte" value={formData.deporte} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Sala</Form.Label>
            <Form.Control type="text" name="sala" value={formData.sala} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Coach</Form.Label>
            <Form.Control type="text" name="coach" value={formData.coach} onChange={handleChange} required />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
          <Button variant="danger" type="submit">Guardar</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default AsignacionFormModal;