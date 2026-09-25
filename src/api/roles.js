import api from './axios';

// Obtener catálogo de roles desde la BD
export const getRoles = async () => {
  const response = await api.get('/roles');
  return response.data;
};

// Crear un nuevo rol en el catálogo
export const createRole = async (roleData) => {
  const response = await api.post('/roles', roleData);
  return response.data;
};