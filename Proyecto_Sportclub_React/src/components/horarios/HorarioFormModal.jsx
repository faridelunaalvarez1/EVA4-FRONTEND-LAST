import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { getAsignaciones } from "../../services/clubService";

const DIAS = [
  { value: 0, label: "Domingo" },
  { value: 1, label: "Lunes" },
  { value: 2, label: "Martes" },
  { value: 3, label: "Miércoles" },
  { value: 4, label: "Jueves" },
  { value: 5, label: "Viernes" },
  { value: 6, label: "Sábado" }
];

function HorarioFormModal({ show, handleClose, handleSave, selectedHorario }) {
  const [formData, setFormData] = useState({ sport_room_id: "", day_of_week: 1, start_time: "", end_time: "" });
  const [asignaciones, setAsignaciones] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  useEffect(() => {
    if (!show) return;
    const loadOptions = async () => {
      setLoadingOptions(true);
      try {
        const data = await getAsignaciones();
        setAsignaciones(data.data || data);
      } catch (error) {
        console.error("Error cargando asignaciones", error);
      } finally {
        setLoadingOptions(false);
      }
    };
    loadOptions();
  }, [show]);

  useEffect(() => {
    if (selectedHorario) {
      setFormData({
        sport_room_id: selectedHorario.sport_room_id || selectedHorario.sport_room?.id || "",
        day_of_week: selectedHorario.day_of_week ?? 1,
        start_time: selectedHorario.start_time || "",
        end_time: selectedHorario.end_time || ""
      });
    } else {
      setFormData({ sport_room_id: "", day_of_week: 1, start_time: "", end_time: "" });
    }
  }, [selectedHorario, show]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    handleSave({
      sport_room_id: Number(formData.sport_room_id),
      day_of_week: Number(formData.day_of_week),
      start_time: formData.start_time,
      end_time: formData.end_time
    });
  };

  const describirAsignacion = (a) => {
    const deporte = a.sport?.name || "Deporte";
    const sala = a.room?.name || "Sala";
    const coach = a.coach?.full_name || "Coach";
    return `${deporte} - ${sala} - ${coach}`;
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static">
      <Modal.Header closeButton className="bg-danger text-white">
        <Modal.Title>{selectedHorario ? "Editar Horario" : "Nuevo Horario"}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={onSubmit}>
        <Modal.Body>
          {loadingOptions ? (
            <div className="text-center p-3">
              <Spinner animation="border" variant="danger" />
            </div>
          ) : (
            <Form.Group className="mb-3">
              <Form.Label>Asignación (Deporte - Sala - Coach)</Form.Label>
              <Form.Select name="sport_room_id" value={formData.sport_room_id} onChange={handleChange} required>
                <option value="">Seleccione una asignación</option>
                {asignaciones.map(a => (
                  <option key={a.id} value={a.id}>{describirAsignacion(a)}</option>
                ))}
              </Form.Select>
            </Form.Group>
          )}
          <Form.Group className="mb-3">
            <Form.Label>Día</Form.Label>
            <Form.Select name="day_of_week" value={formData.day_of_week} onChange={handleChange}>
              {DIAS.map(d => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Hora Inicio</Form.Label>
            <Form.Control type="time" name="start_time" value={formData.start_time} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Hora Fin</Form.Label>
            <Form.Control type="time" name="end_time" value={formData.end_time} onChange={handleChange} required />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
          <Button variant="danger" type="submit" disabled={loadingOptions}>Guardar</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default HorarioFormModal;