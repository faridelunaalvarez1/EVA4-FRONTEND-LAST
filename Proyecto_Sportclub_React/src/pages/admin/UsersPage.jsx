import React, { useEffect, useState } from "react";
import { Badge, Button, Card, Spinner, Table } from "react-bootstrap";
import Swal from "sweetalert2";
import UserFormModal from "../../components/users/UserFormModal";
import { createUser, deleteUser, getUsers, updateUser } from "../../services/userService";

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Carga automática de datos desde el backend (Read)
  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      // Si el backend devuelve un objeto con un arreglo adentro, usamos data.data
      setUsers(data.data || data);
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const openCreateModal = () => {
    setSelectedUser(null);
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  // Manejar creación (Create) o actualización (Update)
  const handleSave = async (formData) => {
    try {
      if (selectedUser) {
        await updateUser(selectedUser.id, formData);
        Swal.fire("Actualizado", "Usuario actualizado correctamente", "success");
      } else {
        await createUser(formData);
        Swal.fire("Creado", "Usuario creado correctamente", "success");
      }
      closeModal();
      loadUsers(); // Refresca la tabla automáticamente sin recargar el navegador
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  // Manejar eliminación con confirmación de SweetAlert2 (Delete)
  const handleDelete = async (user) => {
    const result = await Swal.fire({
      title: "¿Eliminar usuario?",
      text: `Esta acción eliminará a ${user.full_name || user.name || "este usuario"}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#d33"
    });

    if (result.isConfirmed) {
      try {
        await deleteUser(user.id);
        Swal.fire("Eliminado", "Usuario eliminado correctamente", "success");
        loadUsers();
      } catch (error) {
        Swal.fire("Error", error.message, "error");
      }
    }
  };

  return (
    <Card className="shadow-sm border-0 rounded-3 mt-4">
      <Card.Header className="bg-white d-flex justify-content-between align-items-center py-3">
        <h4 className="mb-0 fw-bold text-dark">Gestión de Usuarios</h4>
        <Button variant="primary" onClick={openCreateModal} className="fw-semibold">
          + Nuevo Usuario
        </Button>
      </Card.Header>
      <Card.Body className="p-4">
        {loading ? (
          <div className="text-center p-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 text-muted">Cargando usuarios de SportClub...</p>
          </div>
        ) : (
          <Table responsive striped bordered hover className="align-middle">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td className="fw-semibold">{user.full_name || user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <Badge bg={user.role === "admin" ? "success" : user.role === "coach" ? "warning" : "info"}>
                      {user.role === "admin" ? "Administrador" : user.role === "coach" ? "Coach" : "Usuario"}
                    </Badge>
                  </td>
                  <td>
                    <Button variant="warning" size="sm" className="me-2 fw-medium" onClick={() => openEditModal(user)}>
                      Editar
                    </Button>
                    <Button variant="danger" size="sm" className="fw-medium" onClick={() => handleDelete(user)}>
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>

      <UserFormModal
        show={showModal}
        handleClose={closeModal}
        handleSave={handleSave}
        selectedUser={selectedUser}
      />
    </Card>
  );
}

export default UsersPage;