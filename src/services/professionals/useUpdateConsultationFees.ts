import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { fetchServer } from '../fetchServer';

interface UpdateConsultationFeesRequest {
  token: string;
  valorConsulta: number;
  valorConsultaExpress: number;
}

interface UpdateConsultationFeesResponse {
  message: string;
  result: boolean;
}

const updateConsultationFees = async (
  data: UpdateConsultationFeesRequest
): Promise<UpdateConsultationFeesResponse> => {
  const response = await fetchServer({
    url: '/ActualizarValorConsultas',
    method: 'PUT',
    body: data,
    useToken: true,
  }) as UpdateConsultationFeesResponse;

  return response;
};

export const useUpdateConsultationFees = (): UseMutationResult<
  UpdateConsultationFeesResponse,
  Error,
  Omit<UpdateConsultationFeesRequest, 'token'>,
  unknown
> => {
  return useMutation({
    mutationFn: async (data: Omit<UpdateConsultationFeesRequest, 'token'>) => {
      // El token se agrega automáticamente en fetchServer con useToken: true
      // Pero el backend espera el token en el body
      const token = localStorage.getItem('token') || '';
      return updateConsultationFees({ ...data, token });
    },
    onSuccess: () => {
      console.log('✅ Tarifas de consulta actualizadas exitosamente');
    },
    onError: (error) => {
      console.error('❌ Error al actualizar tarifas:', error);
    },
  });
};
