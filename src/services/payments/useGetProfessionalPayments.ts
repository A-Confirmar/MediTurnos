import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { fetchServer } from '../fetchServer';
import type { GetPaymentsResponse } from '../../types/Payment';

/**
 * Hook para obtener los pagos de los turnos del profesional autenticado
 * Endpoint: GET /VerPagosProfesional
 * Requiere: Token (authMiddleware usa req.user.email automáticamente)
 */
export const useGetProfessionalPayments = (): UseQueryResult<GetPaymentsResponse, Error> => {
  return useQuery<GetPaymentsResponse, Error>({
    queryKey: ['professional-payments'],
    queryFn: async () => {
      try {
        const result = await fetchServer({
          method: 'GET',
          url: '/VerPagosProfesional',
          useToken: true,
        });

        return result;
      } catch (error) {
        console.error('❌ Error al obtener pagos del profesional:', error);
        throw error;
      }
    },
    staleTime: 30 * 1000, // 30 segundos
    gcTime: 5 * 60 * 1000, // 5 minutos
    retry: 1,
  });
};

