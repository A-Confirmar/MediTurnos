import { useQuery } from '@tanstack/react-query';
import { fetchServer } from '../fetchServer';

interface Review {
  id: number;
  puntaje: number;
  comentario: string;
  fecha: string;
  turnoId: number;
}

interface GetReviewResponse {
  message: string;
  result: boolean;
  resena?: Review;
}

/**
 * Hook para obtener la reseña de un turno específico
 * Endpoint: GET /obtenerResenia?idTurno=X
 */
export const useGetReview = (turnoId: number | null) => {
  return useQuery<GetReviewResponse, Error>({
    queryKey: ['review', turnoId],
    queryFn: async () => {
      if (!turnoId) {
        throw new Error('ID de turno no proporcionado');
      }

      try {
        const result = await fetchServer({
          method: 'GET',
          url: `/obtenerResenia?idTurno=${turnoId}`,
          useToken: true,
        });

        return result;
      } catch (error) {
        console.error('❌ Error al obtener reseña:', error);
        throw error;
      }
    },
    enabled: !!turnoId, // Solo ejecutar si hay un turnoId
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
};
