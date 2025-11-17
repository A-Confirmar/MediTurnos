import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance, { authorizeAxios } from '../AxiosInstance';
import type { UpdateMedicalHistoryRequest, MedicalHistoryResponse } from '../../types/MedicalHistory';

/**
 * Hook para actualizar una historia clínica existente
 */
export const useUpdateMedicalHistory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateMedicalHistoryRequest): Promise<MedicalHistoryResponse> => {
      await authorizeAxios();
      const response = await axiosInstance.put<MedicalHistoryResponse>(
        '/actualizarHistorialClinicoDelPaciente',
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

