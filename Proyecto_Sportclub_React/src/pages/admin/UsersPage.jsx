import React, { useState, useEffect } from "react";
import { getUsers, deleteUser, createUser, updateUser } from "../../services/userService";
import Swal from "sweetalert2";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "user" });

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
    setFormData({ name: "", email: "", password: "", role: "user" });
    setEditingId(null);
    setShowModal(true);
  };

  const openEdit = (user) => {
    setFormData({ name: user.name || user.nombre, email: user.email, password: "", role: user.role || user.rol });
    setEditingId(user.id || user._id);
    setShowModal(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Gestión de Usuarios</h2>
        <button onClick={openCreate} className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 font-bold">
          + Nuevo Usuario
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="w-full text-left bg-white">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="p-3">Nombre</th>
              <th className="p-3">Email</th>
              <th className="p-3">Rol</th>
              <th className="p-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id || u._id} className="border-b hover:bg-gray-50">
                <td className="p-3">{u.name || u.nombre}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3 uppercase text-sm font-semibold text-gray-600">{u.role || u.rol}</td>
                <td className="p-3 flex justify-center gap-2">
                  <button onClick={() => openEdit(u)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Editar</button>
                  <button onClick={() => handleDelete(u.id || u._id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
            <h3 className="text-xl font-bold mb-4">{editingId ? "Editar" : "Crear"} Usuario</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input required placeholder="Nombre" className="w-full p-2 border rounded" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <input required type="email" placeholder="Email" className="w-full p-2 border rounded" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              {!editingId && <input required type="password" placeholder="Contraseña" className="w-full p-2 border rounded" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />}
              <select className="w-full p-2 border rounded" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                <option value="user">Usuario</option>
                <option value="coach">Entrenador</option>
                <option value="admin">Administrador</option>
              </select>
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" onClick={() => setShowModal(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancelar</button>
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded font-bold">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;