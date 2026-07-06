const API_URL = "/api/sports";

function getToken() {
  return localStorage.getItem("token");
}

function getHeaders() {
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${getToken()}`
  };
}

export async function getSports() {
  const response = await fetch(API_URL, {
    method: "GET",
    headers: getHeaders()
  });
  if (!response.ok) throw new Error("Error al obtener deportes");
  return response.json();
}

export async function createSport(data) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error("Error al crear deporte");
  return response.json();
}

export async function updateSport(id, data) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  if (!response.ok) throw new Error("Error al actualizar deporte");
  return response.json();
}

export async function deleteSport(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getHeaders()
  });
  if (!response.ok) throw new Error("Error al eliminar deporte");
  return response.json();
}

export async function toggleSportStatus(id, status) {
  const response = await fetch(`${API_URL}/${id}/status`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify({ status })
  });
  if (!response.ok) throw new Error("Error al cambiar estado");
  return response.json();
}