import axios from 'axios';
import { getToken, logout } from './auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Injeta o token em cada requisição
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Uploads (FormData): remove o Content-Type padrão (application/json) para o
  // browser definir automaticamente multipart/form-data com o boundary correto.
  // Sem isso o multer não consegue ler os campos nem o arquivo (erro 400).
  if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  return config;
});

// Se o token expirar (401), reencaminha para o login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401 && !error.config.url.includes('/auth/login')) {
      logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
