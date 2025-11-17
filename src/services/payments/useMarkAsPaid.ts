import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import { fetchServer } from '../fetchServer';
import type { MarkAsPaidRequest, MarkAsPaidResponse } from '../../types/Payment';

/**
 * Hook para marcar un turno como pagado
 * Endpoint: PUT /PagarTurno
 * Requiere: Token + turnoId en el body
 */
export const useMarkAsPaid = (): UseMutationResult<MarkAsPaidResponse, Error, MarkAsPaidRequest> => {
  const queryClient = useQueryClient();

  return useMutation<MarkAsPaidResponse, Error, MarkAsPaidRequest>({
    mutationFn: async (data: MarkAsPaidRequest) => {
      try {
        const result = await fetchServer({
          method: 'PUT',
          url: '/PagarTurno',
          useToken: true,
          body: data,
        });

        return result;
      } catch (error) {
        console.error('❌ Error al marcar turno como pagado:', error);
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidar las queries relacionadas para refrescar los datos
      queryClient.invalidateQueries({ queryKey: ['professional-payments'] });
      queryClient.invalidateQueries({ queryKey: ['patient-payments'] });
      queryClient.invalidateQueries({ queryKey: ['professional-appointments'] });
      queryClient.invalidateQueries({ queryKey: ['patient-appointments'] });
    },
  });
};

