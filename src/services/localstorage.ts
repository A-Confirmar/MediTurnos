import type { User } from '../types/User';

/**
 * Servicios de localStorage para MediTurnos
 */

const ACCESS_TOKEN_KEY = 'mediTurnos_access_token';
const USER_DATA_KEY = 'mediTurnos_user_data';
const USER_ROLE_KEY = 'mediTurnos_user_role';

// Token de acceso
export const setAccessToken = (accessToken: string | null): void => {
  try {
    if (accessToken) {
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    } else {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
    }
  } catch (error) {
    console.error('Error al gestionar el token de acceso:', error);
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  try {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  } catch (error) {
    console.error('Error al obtener el token de acceso:', error);
    return null;
  }
};

export const removeAccessToken = (): void => {
  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  } catch (error) {
    console.error('Error al eliminar el token de acceso:', error);
  }
};

// Rol del usuario
export const setUserRole = (role: string | null): void => {
  try {
    if (role) {
      localStorage.setItem(USER_ROLE_KEY, role);
    } else {
      localStorage.removeItem(USER_ROLE_KEY);
    }
  } catch (error) {
    console.error('Error al gestionar el rol del usuario:', error);
  }
};

export const getUserRole = async (): Promise<string | null> => {
  try {
    return localStorage.getItem(USER_ROLE_KEY);
  } catch (error) {
    console.error('Error al obtener el rol del usuario:', error);
    return null;
  }
};

// Datos del usuario
export const setUser = (user: User | null): void => {
  try {
    if (user) {
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_DATA_KEY);
    }
  } catch (error) {
    console.error('Error al gestionar los datos del usuario:', error);
  }
};

export const getUser = (): User | null => {
  try {
    const userData = localStorage.getItem(USER_DATA_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error al obtener los datos del usuario:', error);
    return null;
  }
};

// Función para limpiar toda la sesión
export const clearSession = (): void => {
  try {
    removeAccessToken();
    setUser(null);
    setUserRole(null);
  } catch (error) {
    console.error('Error al limpiar la sesión:', error);
  }
};

// Funciones legacy para compatibilidad (mantenemos las mismas keys)
export const setUserData = setUser;
export const getUserData = getUser;
export const removeUserData = () => setUser(null);
