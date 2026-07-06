const API_URL = "/api";

// Función auxiliar para obtener los encabezados (headers)
const getHeaders = () => {
  const token = localStorage.getItem("token"); 
  return {
    "Content-Type": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {})
  };
};

// Función auxiliar para gestionar respuestas y errores
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Error en la conexión con la API");
  }
  // Si la respuesta es exitosa pero vacía (ej. al eliminar un registro)
  if (response.status === 204 || response.headers.get("content-length") === "0") {
    return true;
  }
  
  const json = await response.json();
  // Retorna directamente el arreglo de datos
  return json.data || json; 
};

// ==========================================
// FLUJO 1: SALAS (Admin)
// ==========================================
export const getSalas = async () => {
  const res = await fetch(`${API_URL}/rooms`, { headers: getHeaders() });
  return handleResponse(res);
};
export const createSala = async (data) => {
  const res = await fetch(`${API_URL}/rooms`, { method: "POST", headers: getHeaders(), body: JSON.stringify(data) });
  return handleResponse(res);
};
export const updateSala = async (id, data) => {
  const res = await fetch(`${API_URL}/rooms/${id}`, { method: "PUT", headers: getHeaders(), body: JSON.stringify(data) });
  return handleResponse(res);
};
export const deleteSala = async (id) => {
  const res = await fetch(`${API_URL}/rooms/${id}`, { method: "DELETE", headers: getHeaders() });
  return handleResponse(res);
};

// ==========================================
// FLUJO 2: ASIGNACIONES (Admin)
// ==========================================
export const getAsignaciones = async () => {
  const res = await fetch(`${API_URL}/sport-rooms`, { headers: getHeaders() });
  return handleResponse(res);
};
export const createAsignacion = async (data) => {
  const res = await fetch(`${API_URL}/sport-rooms`, { method: "POST", headers: getHeaders(), body: JSON.stringify(data) });
  return handleResponse(res);
};
export const updateAsignacion = async (id, data) => {
  const res = await fetch(`${API_URL}/sport-rooms/${id}`, { method: "PUT", headers: getHeaders(), body: JSON.stringify(data) });
  return handleResponse(res);
};
export const deleteAsignacion = async (id) => {
  const res = await fetch(`${API_URL}/sport-rooms/${id}`, { method: "DELETE", headers: getHeaders() });
  return handleResponse(res);
};

// ==========================================
// FLUJO 3: HORARIOS (Admin)
// ==========================================
export const getHorarios = async () => {
  const res = await fetch(`${API_URL}/class-schedules`, { headers: getHeaders() });
  return handleResponse(res);
};
export const createHorario = async (data) => {
  const res = await fetch(`${API_URL}/class-schedules`, { method: "POST", headers: getHeaders(), body: JSON.stringify(data) });
  return handleResponse(res);
};
export const updateHorario = async (id, data) => {
  const res = await fetch(`${API_URL}/class-schedules/${id}`, { method: "PUT", headers: getHeaders(), body: JSON.stringify(data) });
  return handleResponse(res);
};
export const deleteHorario = async (id) => {
  const res = await fetch(`${API_URL}/class-schedules/${id}`, { method: "DELETE", headers: getHeaders() });
  return handleResponse(res);
};

// ==========================================
// FLUJOS 4 Y 5: MIS CLASES (Coach)
// ==========================================
export const getMisClasesCoach = async () => {
  const res = await fetch(`${API_URL}/coach/my-classes`, { headers: getHeaders() });
  return handleResponse(res);
};

// ==========================================
// FLUJOS 6 Y 7: CLASES DISPONIBLES Y RESERVAR (Usuario)
// ==========================================
export const getClasesDisponibles = async () => {
  const res = await fetch(`${API_URL}/member/classes`, { headers: getHeaders() });
  return handleResponse(res);
};
export const crearReserva = async (classScheduleId) => {
  const res = await fetch(`${API_URL}/reservations`, { method: "POST", headers: getHeaders(), body: JSON.stringify({ class_schedule_id: classScheduleId }) });
  return handleResponse(res);
};

// ==========================================
// FLUJO 8: MIS RESERVAS Y CANCELAR (Usuario)
// ==========================================
export const getMisReservas = async () => {
  const res = await fetch(`${API_URL}/reservations`, { headers: getHeaders() });
  return handleResponse(res);
};
export const cancelarReserva = async (reservaId) => {
  const res = await fetch(`${API_URL}/reservations/${reservaId}/cancel`, { method: "PATCH", headers: getHeaders() });
  return handleResponse(res);
};