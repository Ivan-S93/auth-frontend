import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
});

// Interceptor para inyectar el Bearer Token en CADA petición
api.interceptors.request.use(
  (config) => {
    // IMPORTANTE: Asegúrate que la clave sea exactamente 'token' o 'jwt_token' (según cómo lo guardas en Login)
    const token = localStorage.getItem('jwt_token'); 

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;