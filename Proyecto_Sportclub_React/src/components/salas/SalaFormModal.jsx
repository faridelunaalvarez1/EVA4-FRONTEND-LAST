import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

function SalaFormModal({ show, handleClose, handleSave, selectedSala }) {
  const [formData, setFormData] = useState({
    nombre: "",
    capacidad: "",
    estado: "Activa"
  });

  useEffect(() => {
    if (selectedSala) {
      setFormData({
        nombre: selectedSala.nombre || "",
        capacidad: selectedSala.capacidad || "",
        estado: selectedSala.estado || "Activa"
      });
    } else {
      setFormData({ nombre: "", capacidad: "", estado: "Activa" });
    }
  }, [selectedSala, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleSave(formData);
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
            <Form.Control type="text" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Ej. Sala de Yoga" required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Capacidad Máxima</Form.Label>
            <Form.Control type="number" name="capacidad" value={formData.capacidad} onChange={handleChange} placeholder="Ej. 20" required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Estado</Form.Label>
            <Form.Select name="estado" value={formData.estado} onChange={handleChange}>
              <option value="Activa">Activa</option>
              <option value="Inactiva">Inactiva</option>
              <option value="Mantenimiento">Mantenimiento</option>
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