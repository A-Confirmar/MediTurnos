import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance, { authorizeAxios } from '../AxiosInstance';
import type { CreateMedicalHistoryRequest, MedicalHistoryResponse } from '../../types/MedicalHistory';

/**
 * Hook para crear una nueva historia clínica
 */
export const useCreateMedicalHistory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateMedicalHistoryRequest): Promise<MedicalHistoryResponse> => {
      await authorizeAxios();
      const response = await axiosInstance.post<MedicalHistoryResponse>(
        '/nuevoHistorialClinico',
        data
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['medical-histories'] });
      queryClient.invalidateQueries({ queryKey: ['medical-history', 'patient', variables.pacienteMail] });
    },
  });
};

