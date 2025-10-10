import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { fetchServer } from '../fetchServer';

/**
 * Hook para actualizar los datos del usuario autenticado
 * Endpoint: PUT /update
 * Requiere: Token en headers (automático con useToken: true)
 */

interface UpdateUserRequest {
  token?: string;
  nombre?: string;
  email?: string;
  password?: string;
  apellido?: string;
  fecha_nacimiento?: string; // formato: DD-MM-YYYY
  telefono?: string;
}

interface UpdateUserResponse {
  nuevoToken?: string;
  message?: string;
  result?: boolean;
}

const getUpdateEndpoint = () => '/update';

export const useUpdateUser = (): UseMutationResult<
  UpdateUserResponse,
  Error,
  UpdateUserRequest,
  unknown
> => {
  return useMutation<UpdateUserResponse, Error, UpdateUserRequest, unknown>({
    mutationFn: async (userData: UpdateUserRequest) => {
      console.log('🔄 Actualizando datos del usuario...', userData);

      try {
        const result = await fetchServer({
          method: 'PUT',
          url: getUpdateEndpoint(),
          data: userData,
          headers: {
            'Content-Type': 'application/json'
          },
          useToken: true, // Requiere token
        });

        console.log('✅ Usuario actualizado:', result);

        // Si el backend devuelve un nuevo token, actualizar localStorage
        if (result.nuevoToken) {
          console.log('🔑 Nuevo token recibido, actualizando...');
          // Aquí podrías actualizar el token si fuera necesario
          // await setAccessToken(result.nuevoToken);
        }

        return result;
      } catch (error) {
        console.error('❌ Error al actualizar usuario:', error);
        throw error;
      }
    },
    onError: (error: any) => {
      console.error('Error al actualizar usuario:', error);
    },
    onSuccess: (data) => {
      console.log('🎉 Usuario actualizado exitosamente!');
      console.log('📄 Respuesta:', data);
    }
  });
};

