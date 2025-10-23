import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchServer } from '../fetchServer';

interface ApproveReviewRequest {
  reseniaID: number;
}

interface ApproveReviewResponse {
  message: string;
  result: boolean;
}

export const useApproveReview = () => {
  const queryClient = useQueryClient();

  return useMutation<ApproveReviewResponse, Error, ApproveReviewRequest>({
    mutationFn: async (data: ApproveReviewRequest) => {
      const response = await fetchServer({
        method: 'PUT',
        url: '/aprobarResenia',
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
