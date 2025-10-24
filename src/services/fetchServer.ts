import axios, { AxiosError, type Method } from 'axios';
import axiosInstance, {
  authorizeAxios,
  removeAuthorization,
} from './AxiosInstance';

class FetchApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'FetchApiError';
    this.status = status;
    Object.setPrototypeOf(this, FetchApiError.prototype);
  }
}

interface Props {
  method: Method | undefined;
  url: string;
  headers?: Record<string, string>; // Changed from NonNullable<unknown>
  data?: NonNullable<unknown>;
  body?: FormData | NonNullable<unknown>; // Añadido para soportar FormData
  params?: URLSearchParams | Record<string, string>; // Added Record<string, string>
  useToken?: boolean;
  isFormData?: boolean; // Indicador de que es multipart/form-data
}

interface ErrorResponse {
  message: string;
}

export const fetchServer = async ({
  method,
  url,
  headers = {},
  data = {},
  body,
  params,
  useToken = false,
  isFormData = false,
}: Props) => {

  try {
    if (useToken) {
      await authorizeAxios();
    } else {
      await removeAuthorization();
    }

    // Preparar headers específicos para FormData
    const finalHeaders = isFormData 
      ? { ...headers } // No incluir Content-Type, axios lo detectará automáticamente
      : { 'Content-Type': 'application/json', ...headers };

    const response = await axiosInstance({
      method,
      url,
      data: body || data, // Usar body si está presente, sino usar data
      params,
      headers: finalHeaders,
    });
    return response.data;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      const axiosError = e as AxiosError;
      const responseData = axiosError.response?.data as ErrorResponse;

      // Manejar diferentes tipos de respuesta de error
      let errorMessage = 'Error de conexión. Verifica la URL del servidor.';

      const status = axiosError.response?.status;

      // PRIORIDAD 1: Mensaje específico del backend
      if (responseData?.message) {
        errorMessage = responseData.message;
      }
      // PRIORIDAD 2: Códigos de error específicos (solo si no hay mensaje del backend)
      else if (status === 401) {
        errorMessage = 'Credenciales inválidas. Verifica tu email y contraseña.';
      } else if (status === 404) {
        errorMessage = 'Endpoint no encontrado. Verifica la configuración del servidor.';
      } else if (status && status >= 500) {
        errorMessage = 'Error interno del servidor. Intenta más tarde.';
      } 
      // PRIORIDAD 3: Mensaje de axios (solo si no hay nada más)
      else if (axiosError.message) {
        errorMessage = axiosError.message;
      }

      console.error('💥 Error en fetchServer:', {
        status: status,
        message: errorMessage,
        originalError: axiosError.message,
        response: axiosError.response?.data,
        config: axiosError.config
      });

      throw new FetchApiError(
        status || 500,
        errorMessage
      );
    }
    console.error('💥 Error desconocido en fetchServer:', e);
    throw new FetchApiError(500, 'Error desconocido. Intenta de nuevo.');
  }
};
