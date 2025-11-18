import { useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../AxiosInstance';

interface AceptarTurnoExpressRequest {
  token: string; // Token del turno express (viene en el email)
  turnoId: number; // ID del turno a aceptar
  inicio: string; // Horario inicio formato "HH:mm"
  fin: string; // Horario fin formato "HH:mm"
  fecha: string; // Fecha formato "YYYY-MM-DD"
}

interface AceptarTurnoExpressResponse {
  message: string;
  result: boolean;
}

/**
 * Hook para que el profesional acepte/responda una solicitud de turno express
 * PUT /aceptarTurnoExpress
 * Actualiza el horario del turno propuesto por el profesional
 * y el turno queda a la espera de respuesta del paciente
 */
export const useAceptarTurnoExpress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AceptarTurnoExpressRequest): Promise<AceptarTurnoExpressResponse> => {
      const response = await axiosInstance.put('/aceptarTurnoExpress', data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidar las queries de turnos para actualizar la lista
      queryClient.invalidateQueries({ queryKey: ['professionalAppointments'] });
      queryClient.invalidateQueries({ queryKey: ['expressAppointments'] });
    },
  });
};



