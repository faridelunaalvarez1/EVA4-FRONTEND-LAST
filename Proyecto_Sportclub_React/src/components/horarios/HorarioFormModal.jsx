import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

function HorarioFormModal({ show, handleClose, handleSave, selectedHorario }) {
  const [formData, setFormData] = useState({ dia: "Lunes", inicio: "", fin: "" });

  useEffect(() => {
    if (selectedHorario) setFormData(selectedHorario);
    else setFormData({ dia: "Lunes", inicio: "", fin: "" });
  }, [selectedHorario, show]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const onSubmit = (e) => { 
    e.preventDefault(); 
    handleSave(formData); 
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static">
      <Modal.Header closeButton className="bg-danger text-white">
        <Modal.Title>{selectedHorario ? "Editar Horario" : "Nuevo Horario"}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={onSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Día</Form.Label>
            <Form.Select name="dia" value={formData.dia} onChange={handleChange}>
              <option>Lunes</option>
              <option>Martes</option>
              <option>Miércoles</option>
              <option>Jueves</option>
              <option>Viernes</option>
              <option>Sábado</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Hora Inicio</Form.Label>
            <Form.Control type="time" name="inicio" value={formData.inicio} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Hora Fin</Form.Label>
            <Form.Control type="time" name="fin" value={formData.fin} onChange={handleChange} required />
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

export default HorarioFormModal;