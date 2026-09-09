import api from './axios';

// Obtener todos los usuarios registrados
export const getUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

// Crear un nuevo usuario enviando la estructura que espera tu backend
export const createUser = async (userData) => {
  const response = await api.post('/users', userData);  
  return response.data;
};

// Alternar estado activo/inactivo (Soft Delete)
export const toggleUserStatus = async (userId, active) => {  // recibe el id del usuario y el nuevo estado activo (true/false)
  const response = await api.patch(`/users/${userId}/status`, { active });
  return response.data;
};