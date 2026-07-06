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
    throw new Error(data.message || "Error al iniciar sesion");
  }

  return data;
}

// Guardar sesion en el almacenamiento local del navegador (localStorage)
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

// Verificar de forma rapida si existe una sesion activa
export function isAuthenticated() {
  return Boolean(getToken());
}

// Borrar el token y cerrar sesion de inmediato
export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

// Obtener el perfil actualizado directo desde el backend
export async function getMe() {
  const response = await fetch(`${API_URL}/me`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${getToken()}`
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Error al obtener el perfil");
  }

  return data;
}
