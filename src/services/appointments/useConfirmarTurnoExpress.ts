import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../AxiosInstance';

interface ConfirmarTurnoExpressRequest {
  turnoId: number; // ID del turno a confirmar
}

interface ConfirmarTurnoExpressResponse {
  message: string;
  result: boolean;
}

/**
 * Hook para que el paciente confirme un turno express
 * PUT /confirmarTurnoExpress
 * Confirma el turno tipo 'express' (debe estar en estado 'pendiente')
 * genera el pago en estado 'pendiente' y programa el recordatorio
 */
export const useConfirmarTurnoExpress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ConfirmarTurnoExpressRequest): Promise<ConfirmarTurnoExpressResponse> => {
      const response = await axiosInstance.put('/confirmarTurnoExpress', data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidar queries de turnos del paciente
      queryClient.invalidateQueries({ queryKey: ['patientAppointments'] });
      queryClient.invalidateQueries({ queryKey: ['expressAppointments'] });
    },
  });
};



