import { useQuery } from '@tanstack/react-query';
import axiosInstance, { authorizeAxios } from '../AxiosInstance';
import type { GetMedicalHistoriesResponse } from '../../types/MedicalHistory';

/**
 * Hook para obtener todos los historiales clínicos del profesional autenticado
 */
export const useGetAllMedicalHistories = () => {
  return useQuery({
    queryKey: ['medical-histories', 'all'],
    queryFn: async (): Promise<GetMedicalHistoriesResponse> => {
      await authorizeAxios();
      const response = await axiosInstance.get<GetMedicalHistoriesResponse>(
        '/obtenerTodosMisHistorialesClinicos'
      );
      return response.data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutos
    gcTime: 1000 * 60 * 5, // 5 minutos
  });
};

