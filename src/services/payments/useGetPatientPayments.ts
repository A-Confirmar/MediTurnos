import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { fetchServer } from '../fetchServer';
import type { GetPaymentsResponse } from '../../types/Payment';

/**
 * Hook para obtener los pagos del paciente autenticado
 * Endpoint: GET /VerPagos
 * Requiere: Token (authMiddleware usa req.user.email automáticamente)
 */
export const useGetPatientPayments = (): UseQueryResult<GetPaymentsResponse, Error> => {
  return useQuery<GetPaymentsResponse, Error>({
    queryKey: ['patient-payments'],
    queryFn: async () => {
      try {
        const result = await fetchServer({
          method: 'GET',
          url: '/VerPagos',
          useToken: true,
        });

        return result;
      } catch (error) {
        console.error('❌ Error al obtener pagos del paciente:', error);
        throw error;
      }
    },
    staleTime: 30 * 1000, // 30 segundos
    gcTime: 5 * 60 * 1000, // 5 minutos
    retry: 1,
  });
};

