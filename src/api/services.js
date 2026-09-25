import api from './axios';

// Obtener catálogo de servicios hospitalarios desde la BD
export const getServicios = async () => {
  const response = await api.get('/servicios');
  return response.data;
};

// Crear un nuevo servicio hospitalario
export const createServicio = async (servicioData) => {
  const response = await api.post('/servicios', servicioData);
  return response.data;
};