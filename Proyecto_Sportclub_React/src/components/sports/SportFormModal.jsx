import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

const initialForm = {
  name: "",
  objective: "",
  duration: "",
  status: true,
};

function SportFormModal({ show, handleClose, handleSave, selectedSport }) {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (selectedSport) {
      setFormData(selectedSport);
    } else {
      setFormData(initialForm);
    }
    setErrors({});
  }, [selectedSport, show]);

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nombre obligatorio.";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "El nombre debe tener al menos 3 caracteres.";
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/.test(formData.name.trim())) {
      newErrors.name = "El nombre solo puede contener letras.";
    }

    if (!formData.objective.trim()) {
      newErrors.objective = "Objetivo obligatorio.";
    } else if (formData.objective.trim().length < 10) {
      newErrors.objective = "El objetivo debe tener al menos 10 caracteres.";
    } else if (/^\d+$/.test(formData.objective.trim())) {
      newErrors.objective = "El objetivo no puede ser solo números.";
    }

    if (!formData.duration) {
      newErrors.duration = "Duración obligatoria.";
    } else if (Number(formData.duration) < 1) {
      newErrors.duration = "La duración debe ser mayor a 0.";
    } else if (Number(formData.duration) > 300) {
      newErrors.duration = "La duración no puede superar 300 minutos.";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    handleSave({ ...formData, duration: Number(formData.duration) });
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{selectedSport ? "Editar Deporte" : "Nuevo Deporte"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              name="name"
              value={formData.name}
              onChange={handleChange}
              isInvalid={!!errors.name}
            />
            <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Objetivo</Form.Label>
            <Form.Control
              as="textarea"
              name="objective"
              value={formData.objective}
              onChange={handleChange}
              isInvalid={!!errors.objective}
            />
            <Form.Control.Feedback type="invalid">{errors.objective}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Duración (minutos)</Form.Label>
            <Form.Control
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              isInvalid={!!errors.duration}
            />
            <Form.Control.Feedback type="invalid">{errors.duration}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Check
              type="switch"
              label={formData.status ? "Activo" : "Inactivo"}
              checked={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
        <Button variant="primary" onClick={handleSubmit}>Guardar</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default SportFormModal;