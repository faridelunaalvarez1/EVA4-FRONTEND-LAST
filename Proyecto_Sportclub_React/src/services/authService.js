const API_URL = "/api/auth";

// Login contra el backend
export async function loginUser(credentials) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al iniciar sesión");
  }

  return data;
}

// Guardar sesión en el almacenamiento local del navegador (localStorage)
export function saveSession(token, user) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
}

// Obtener el token guardado
export function getToken() {
  return localStorage.getItem("token");
}

// Obtener los datos del usuario actual descifrando el JSON
export function getUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

// Verificar de forma rápida si existe una sesión activa
export function isAuthenticated() {
  return Boolean(getToken());
}

// Borrar el token y cerrar sesión de inmediato
export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}