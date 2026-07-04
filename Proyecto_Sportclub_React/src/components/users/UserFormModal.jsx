import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

const initialForm = {
  full_name: "",
  email: "",
  role: "user",
  password: ""
};

function UserFormModal({ show, handleClose, handleSave, selectedUser }) {
  const [formData, setFormData] = useState(initialForm);

  // useEffect se ejecuta automáticamente cuando se abre el modal o cambia el usuario seleccionado
  useEffect(() => {
    if (selectedUser) {
      // Si hay un usuario seleccionado, cargamos sus datos para EDITAR
      setFormData({
        full_name: selectedUser.full_name || "",
        email: selectedUser.email || "",
        role: selectedUser.role || "user",
        password: "" // La contraseña se deja vacía al editar por seguridad
      });
    } else {
      // Si no hay seleccionado, limpiamos el formulario para un NUEVO usuario
      setFormData(initialForm);
    }
  }, [selectedUser, show]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    handleSave(formData);
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {selectedUser ? "Editar Usuario" : "Nuevo Usuario"}
        </Modal.Title>
      </Modal.Header>
      <Form onSubmit={onSubmit}>
        <Modal.Body>
          
          <Form.Group className="mb-3">
            <Form.Label>Nombre Completo</Form.Label>
            <Form.Control
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Correo Electrónico</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Solo pide contraseña si se está creando un usuario nuevo */}
          {!selectedUser && (
            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Form.Group>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Rol en SportClub</Form.Label>
            <Form.Select name="role" value={formData.role} onChange={handleChange}>
              <option value="user">Usuario</option>
              <option value="coach">Coach</option>
              <option value="admin">Administrador</option>
            </Form.Select>
          </Form.Group>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            Guardar
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default UserFormModal;