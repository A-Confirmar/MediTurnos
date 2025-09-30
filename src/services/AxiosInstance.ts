import axios from 'axios';
import { API_URL } from '../config';
import { getAccessToken, removeAccessToken, setUser } from './localstorage';
import { ROUTES } from '../const/routes';

console.log('🔧 Configurando AxiosInstance con baseURL:', API_URL);

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

console.log('✅ AxiosInstance creado con configuración:', {
  baseURL: API_URL,
  timeout: 10000
});

let tokenInterceptor: number | null = null; // Initialize with null

const authorizeAxios = async () => {
  const token = await getAccessToken();
  if (tokenInterceptor !== null) { // Check if interceptor exists
    axiosInstance.interceptors.request.eject(tokenInterceptor);
  }
  tokenInterceptor = axiosInstance.interceptors.request.use((config) => {
    if (token) { // Only add token if it exists
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  return;
};

const removeAuthorization = () => {
  if (tokenInterceptor !== null) { // Check if interceptor exists before ejecting
    axiosInstance.interceptors.request.eject(tokenInterceptor);
    tokenInterceptor = null; // Reset interceptor ID
  }
};

// Add response interceptor to handle 401 errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear authentication data
      removeAccessToken();
      setUser(null);

      // Only redirect if it's not a login request
      if (!error.config?.url?.includes('/login')) { // Ruta exacta del backend
        // Use window.location.href to ensure a clean redirect and clear any React state
        window.location.href = ROUTES.login;
      }
    }
    return Promise.reject(error);
  }
);

export { authorizeAxios, removeAuthorization };
export default axiosInstance;
