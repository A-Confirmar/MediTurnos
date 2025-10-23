import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchServer } from '../fetchServer';

interface DeleteReviewRequest {
  reseniaID: number;
}

interface DeleteReviewResponse {
  message: string;
  result: boolean;
}

export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteReviewResponse, Error, DeleteReviewRequest>({
    mutationFn: async (data: DeleteReviewRequest) => {
      const response = await fetchServer({
        method: 'DELETE',
        url: '/eliminarResenia',
        data: { reseniaID: data.reseniaID },
        useToken: true
      });
      return response;
    },
    onSuccess: () => {
      // Invalidar la query de todas las reseñas para refrescar la lista
      queryClient.invalidateQueries({ queryKey: ['all-reviews'] });
    }
  });
};
