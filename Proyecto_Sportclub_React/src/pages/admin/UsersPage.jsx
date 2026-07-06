import React, { useState, useEffect } from "react";
import { Container, Table, Button, Modal, Form } from "react-bootstrap";
import { getUsers, deleteUser, createUser, updateUser } from "../../services/userService";
import Swal from "sweetalert2";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ full_name: "", email: "", password: "", role: "user" });

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      Swal.fire("Error", "No se pudieron cargar los usuarios", "error");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esta acción",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar"
    });

    if (result.isConfirmed) {
      try {
        await deleteUser(id);
        Swal.fire("Eliminado", "El usuario ha sido borrado.", "success");
        fetchUsers();
      } catch (error) {
        Swal.fire("Error", error.message, "error");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateUser(editingId, formData);
        Swal.fire("Éxito", "Usuario actualizado correctamente", "success");
      } else {
        await createUser(formData);
        Swal.fire("Éxito", "Usuario creado correctamente", "success");
      }
      setShowModal(false);
      fetchUsers();
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  const openCreate = () => {
    setFormData({ full_name: "", email: "", password: "", role: "user" });
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (user) => {
    setFormData({ full_name: user.full_name || "", email: user.email, password: "", role: user.role });
    setEditingId(user.id);
    setShowModal(true);
  };

  return (
    <Container className="bg-white p-4 rounded shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <p className="text-muted m-0">Administra los usuarios del sistema.</p>
        <Button variant="danger" onClick={openCreate} className="fw-semibold">
          + Nuevo Usuario
        </Button>
      </div>

      <Table striped bordered hover responsive className="align-middle">
        <thead className="table-danger">
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td className="fw-bold">{u.full_name}</td>
              <td>{u.email}</td>
              <td className="text-uppercase text-muted small fw-semibold">{u.role}</td>
              <td className="text-center">
                <Button variant="outline-danger" size="sm" className="me-2" onClick={() => openEdit(u)}>Editar</Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(u.id)}>Eliminar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)} backdrop="static">
        <Modal.Header closeButton className="bg-danger text-white">
          <Modal.Title>{editingId ? "Editar" : "Crear"} Usuario</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nombre completo</Form.Label>
              <Form.Control required value={formData.full_name} onChange={e => setFormData({ ...formData, full_name: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
            </Form.Group>
            {!editingId && (
              <Form.Group className="mb-3">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control required type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
              </Form.Group>
            )}
            <Form.Group className="mb-3">
              <Form.Label>Rol</Form.Label>
              <Form.Select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
                <option value="user">Usuario</option>
                <option value="coach">Entrenador</option>
                <option value="admin">Administrador</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button variant="danger" type="submit">Guardar</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default UsersPage;