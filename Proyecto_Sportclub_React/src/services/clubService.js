// src/services/clubService.js
// Simulamos las peticiones CRUD. Cambia las URLs "/api/..." por las de tu backend real.

export const getAsignaciones = async () => [{ id: 1, deporte: "Crossfit", sala: "Sala 1", coach: "Juan Pérez" }];
export const createAsignacion = async (data) => data;
export const updateAsignacion = async (id, data) => data;
export const deleteAsignacion = async (id) => true;

export const getHorarios = async () => [{ id: 1, dia: "Lunes", inicio: "08:00", fin: "09:00" }];
export const createHorario = async (data) => data;
export const updateHorario = async (id, data) => data;
export const deleteHorario = async (id) => true;

export const getClasesDisponibles = async () => [{ id: 1, deporte: "Yoga", coach: "María", horario: "Martes 18:00", cupos: 5 }];
export const crearReserva = async (claseId) => true;

export const getMisReservas = async () => [{ id: 1, deporte: "Yoga", coach: "María", horario: "Martes 18:00", estado: "Confirmada" }];
export const cancelarReserva = async (reservaId) => true;

export const getMisClasesCoach = async () => [{ id: 1, deporte: "Crossfit", sala: "Sala 1", horario: "Lunes 08:00", inscritos: 10, capacidad: 20 }];