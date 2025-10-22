import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchServer } from '../fetchServer';
import { getAccessToken } from '../localstorage';

interface CreateReviewParams {
  turnoId: number;
  calificacion: number;
  comentario: string;
}

interface CreateReviewResponse {
  message: string;
  result: boolean;
}

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: CreateReviewParams) => {
      const token = await getAccessToken();
      
      const response = await fetchServer({
        method: 'POST',
        url: '/crearResenia',
        data: {
          token: token,
          turnoID: params.turnoId,      // turnoID con mayúscula ID
          puntaje: params.calificacion, // puntaje en lugar de calificacion
          comentario: params.comentario
        },
        headers: {
          'Content-Type': 'application/json'
        },
        useToken: true
      });

      return response as CreateReviewResponse;
    },
    onSuccess: () => {
      // Invalidar queries relacionadas para refrescar datos
      queryClient.invalidateQueries({ queryKey: ['patient-appointments'] });
      queryClient.invalidateQueries({ queryKey: ['myReviews'] });
    }
  });
};
