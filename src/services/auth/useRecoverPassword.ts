import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { fetchServer } from '../fetchServer';

/**
 * Hook para enviar email de recuperación de contraseña
 * Endpoint: POST /enviarMailRecuperarClave
 * No requiere autenticación
 */

interface RecoverPasswordRequest {
  email: string;
}

interface RecoverPasswordResponse {
  message?: string;
  result?: boolean;
}

const getRecoverPasswordEndpoint = () => '/enviarMailRecuperarClave';

export const useRecoverPassword = (): UseMutationResult<
  RecoverPasswordResponse,
  Error,
  RecoverPasswordRequest,
  unknown
> => {
  return useMutation<RecoverPasswordResponse, Error, RecoverPasswordRequest, unknown>({
    mutationFn: async (data: RecoverPasswordRequest) => {
      console.log('📧 Enviando email de recuperación a:', data.email);

      try {
        const result = await fetchServer({
          method: 'POST',
          url: getRecoverPasswordEndpoint(),
          data: {
            email: data.email
          },
          headers: {
            'Content-Type': 'application/json'
          },
          useToken: false, // No requiere token
        });

        console.log('✅ Email de recuperación enviado:', result);
        return result;
      } catch (error) {
        console.error('❌ Error al enviar email de recuperación:', error);
        throw error;
      }
    },
    onError: (error: any) => {
      console.error('Error al enviar email de recuperación:', error);
    },
    onSuccess: (data) => {
      console.log('🎉 Email de recuperación enviado exitosamente!');
      console.log('📄 Respuesta:', data);
    }
  });
};

