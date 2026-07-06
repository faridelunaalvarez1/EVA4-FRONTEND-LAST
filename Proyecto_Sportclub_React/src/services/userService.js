const API_URL = "/api/users";

function getToken() {
  return localStorage.getItem("token");
}

function getHeaders() {
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${getToken()}`
  };
}

function construirMensajeError(data, mensajePorDefecto) {
  if (data && data.errors && typeof data.errors === "object") {
    const detalles = Object.values(data.errors).filter(Boolean);
    if (detalles.length > 0) {
      return detalles.join(" ");
    }
  }
  return (data && data.message) || mensajePorDefecto;
}

// Listar usuarios (GET)
export async function getUsers() {
  const response = await fetch(API_URL, {
    method: "GET",
    headers: getHeaders()
  });
  if (!response.ok) {
    throw new Error("Error al obtener usuarios");
  }
  return response.json();
}

// Crear usuario (POST)
export async function createUser(userData) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(userData)
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(construirMensajeError(data, "Error al crear usuario"));
  }
  return data;
}

// Editar usuario (PUT)
export async function updateUser(id, userData) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(userData)
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(construirMensajeError(data, "Error al actualizar usuario"));
  }
  return data;
}

// Eliminar usuario (DELETE)
export async function deleteUser(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getHeaders()
  });
  if (!response.ok) {
    throw new Error("Error al eliminar usuario");
  }
  return true;
}
