import { useQuery } from '@tanstack/react-query';
import axiosInstance, { authorizeAxios } from '../AxiosInstance';
import type { GetPatientHistoryResponse } from '../../types/MedicalHistory';

/**
 * Hook para obtener la historia clínica de un paciente específico
 */
export const useGetPatientMedicalHistory = (pacienteMail: string | null) => {
  return useQuery({
    queryKey: ['medical-history', 'patient', pacienteMail],
    queryFn: async (): Promise<GetPatientHistoryResponse | null> => {
      if (!pacienteMail) {
        throw new Error('Email del paciente es requerido');
      }
      
      try {
        await authorizeAxios();
        const response = await axiosInstance.get<GetPatientHistoryResponse>(
          '/obtenerHistorialClinicoDelPaciente',
          {
            params: { pacienteMail }
          }
        );
        return response.data;
      } catch (error: any) {
        // Si el error es 404 o 500 indicando que no hay historia, retornar null en lugar de error
        if (error.response?.status === 404 || 
            error.response?.status === 500 ||
            error.response?.data?.message?.includes('No se encontró') ||
            error.response?.data?.message?.includes('no encontrado')) {
          return null;
        }
        // Para otros errores, lanzar la excepción
        throw error;
      }
    },
    enabled: !!pacienteMail, // Solo ejecutar si hay email
    staleTime: 1000 * 60 * 2, // 2 minutos
    gcTime: 1000 * 60 * 5, // 5 minutos
    retry: false, // No reintentar si hay error
  });
};

