import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { getSports } from "../../services/sportService";
import { getUsers } from "../../services/userService";
import { getSalas } from "../../services/clubService";

function AsignacionFormModal({ show, handleClose, handleSave, selectedAsignacion }) {
  const [formData, setFormData] = useState({ sport_id: "", room_id: "", coach_id: "" });
  const [sports, setSports] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  useEffect(() => {
    if (!show) return;
    const loadOptions = async () => {
      setLoadingOptions(true);
      try {
        const sportsData = await getSports();
        const roomsData = await getSalas();
        const usersData = await getUsers();

        setSports(sportsData.data || sportsData);
        setRooms(roomsData.data || roomsData);

        const allUsers = usersData.data || usersData;
        setCoaches(allUsers.filter(u => u.role === "coach"));
      } catch (error) {
        console.error("Error cargando opciones", error);
      } finally {
        setLoadingOptions(false);
      }
    };
    loadOptions();
  }, [show]);

  useEffect(() => {
    if (selectedAsignacion) {
      setFormData({
        sport_id: selectedAsignacion.sport_id || selectedAsignacion.sport?.id || "",
        room_id: selectedAsignacion.room_id || selectedAsignacion.room?.id || "",
        coach_id: selectedAsignacion.coach_id || selectedAsignacion.coach?.id || ""
      });
    } else {
      setFormData({ sport_id: "", room_id: "", coach_id: "" });
    }
  }, [selectedAsignacion, show]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    handleSave({
      sport_id: Number(formData.sport_id),
      room_id: Number(formData.room_id),
      coach_id: Number(formData.coach_id)
    });
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static">
      <Modal.Header closeButton className="bg-danger text-white">
        <Modal.Title>{selectedAsignacion ? "Editar Asignación" : "Nueva Asignación"}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={onSubmit}>
        <Modal.Body>
          {loadingOptions ? (
            <div className="text-center p-3">
              <Spinner animation="border" variant="danger" />
            </div>
          ) : (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Deporte</Form.Label>
                <Form.Select name="sport_id" value={formData.sport_id} onChange={handleChange} required>
                  <option value="">Seleccione un deporte</option>
                  {sports.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Sala</Form.Label>
                <Form.Select name="room_id" value={formData.room_id} onChange={handleChange} required>
                  <option value="">Seleccione una sala</option>
                  {rooms.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Coach</Form.Label>
                <Form.Select name="coach_id" value={formData.coach_id} onChange={handleChange} required>
                  <option value="">Seleccione un coach</option>
                  {coaches.map(c => (
                    <option key={c.id} value={c.id}>{c.full_name}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
          <Button variant="danger" type="submit" disabled={loadingOptions}>Guardar</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default AsignacionFormModal;