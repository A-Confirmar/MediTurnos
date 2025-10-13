/**
 * Tipos de usuario para MediTurnos
 */

export interface User {
  id?: string;
  email: string;
  // Campos en inglés (frontend)
  name?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  birthDate?: string;
  // Campos en español (backend)
  nombre?: string;
  apellido?: string;
  telefono?: string;
  fecha_nacimiento?: string;
  localidad?: string;
  direccion?: string;
  // Rol puede venir como objeto o string
  role?: UserRole | string;
  rol?: string;
  // Campos adicionales del backend
  especialidad?: string;
  descripcion?: string;
  calificacion_promedio?: number;
  calificacionPromedio?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserRole {
  id: string;
  name: string;
  permissions?: string[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
  message?: string;
  result?: boolean;
}

export interface RegisterCredentials {
  nombre: string;
  email: string;
  password: string;
  apellido: string;
  fecha_nacimiento: string; // formato: YYYY-MM-DD
  telefono: string;
  localidad: string;
  rol: 'paciente' | 'profesional';
  // Campos específicos para profesionales
  direccion?: string;
  especialidad?: string;
  descripcion?: string;
  calificacionPromedio?: number;
}

export interface RegisterResponse {
  message: string;
  result: boolean;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}
