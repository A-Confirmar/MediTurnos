import { useQuery } from '@tanstack/react-query';
import { fetchServer } from '../fetchServer';

export interface ProfessionalReview {
  ID: number;
  turno_ID: number;
  profesional_ID: number;
  puntaje: number;
  comentario: string;
  estado: 'oculto' | 'visible';
  fecha: string;
}

interface ProfessionalReviewsResponse {
  message: string;
  data: ProfessionalReview[];
  result: boolean;
}

/**
 * Hook para obtener las reseñas de un profesional específico
 * Endpoint: GET /verReseniasDeProfesional
 * Este endpoint NO requiere permisos de admin
 */
export const useGetProfessionalReviews = (profesionalMail: string | undefined) => {
  return useQuery<ProfessionalReviewsResponse>({
    queryKey: ['professional-reviews', profesionalMail],
    queryFn: async () => {
      if (!profesionalMail) {
        throw new Error('profesionalMail es requerido');
      }

      const response = await fetchServer({
        method: 'GET',
        url: '/verReseniasDeProfesional',
        params: { profesionalMail },
        useToken: true
      });
      
      return response;
    },
    enabled: !!profesionalMail, // Solo ejecutar si hay profesionalMail
    staleTime: 1000 * 60, // 1 minuto
    gcTime: 1000 * 60 * 5 // 5 minutos en caché
  });
};
