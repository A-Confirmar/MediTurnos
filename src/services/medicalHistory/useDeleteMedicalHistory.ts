import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance, { authorizeAxios } from '../AxiosInstance';
import type { DeleteMedicalHistoryRequest, MedicalHistoryResponse } from '../../types/MedicalHistory';

/**
 * Hook para eliminar una historia clínica
 */
export const useDeleteMedicalHistory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: DeleteMedicalHistoryRequest): Promise<MedicalHistoryResponse> => {
      await authorizeAxios();
      const response = await axiosInstance.delete<MedicalHistoryResponse>(
        '/eliminarHistorialClinico',
        { data }
      );
      return response.data;
    },
    onSuccess: () => {
      // Invalidar todas las queries de historiales
      queryClient.invalidateQueries({ queryKey: ['medical-histories'] });
      queryClient.invalidateQueries({ queryKey: ['medical-history'] });
    },
  });
};

