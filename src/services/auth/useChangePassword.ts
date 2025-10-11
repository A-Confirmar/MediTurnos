import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { fetchServer } from '../fetchServer';

/**
 * Hook para cambiar la contraseña usando el token de recuperación
 * Endpoint: POST /cambiarClave
 * No requiere autenticación (usa token del email)
 */

interface ChangePasswordRequest {
  token: string;
  newPassword: string;
}

interface ChangePasswordResponse {
  message?: string;
  result?: boolean;
}

const getChangePasswordEndpoint = () => '/cambiarClave';

export const useChangePassword = (): UseMutationResult<
  ChangePasswordResponse,
  Error,
  ChangePasswordRequest,
  unknown
> => {
  return useMutation<ChangePasswordResponse, Error, ChangePasswordRequest, unknown>({
    mutationFn: async (data: ChangePasswordRequest) => {
      console.log('🔐 Cambiando contraseña con token...');

      try {
        const result = await fetchServer({
          method: 'POST',
          url: getChangePasswordEndpoint(),
          data: {
            token: data.token,
            newPassword: data.newPassword
          },
          headers: {
            'Content-Type': 'application/json'
          },
          useToken: false, // No requiere autenticación, usa el token del email
        });

        console.log('✅ Contraseña cambiada exitosamente:', result);
        return result;
      } catch (error) {
        console.error('❌ Error al cambiar contraseña:', error);
        throw error;
      }
    },
    onError: (error: Error) => {
      console.error('Error al cambiar contraseña:', error);
    },
    onSuccess: (data) => {
      console.log('🎉 Contraseña actualizada exitosamente!');
      console.log('📄 Respuesta:', data);
    }
  });
};

