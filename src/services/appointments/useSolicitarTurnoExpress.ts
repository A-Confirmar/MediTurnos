import { useMutation } from '@tanstack/react-query';
import axiosInstance from '../AxiosInstance';

interface SolicitarTurnoExpressRequest {
  emailProfesional: string;
}

interface SolicitarTurnoExpressResponse {
  message: string;
  result: boolean;
  turnoId: number;
}

/**
 * Hook para solicitar un turno express
 * POST /solicitarNuevoTurnoExpress
 * Crea un nuevo turno tipo express y notifica al profesional
 */
export const useSolicitarTurnoExpress = () => {
  return useMutation({
    mutationFn: async (data: SolicitarTurnoExpressRequest): Promise<SolicitarTurnoExpressResponse> => {
      const response = await axiosInstance.post('/solicitarNuevoTurnoExpress', data);
      return response.data;
    },
  });
};



