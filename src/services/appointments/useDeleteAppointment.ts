
import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";
import { fetchServer } from "../fetchServer";

const cancelAppointmentEndpoint = () => '/cancelarTurno';

/**
 * Request para cancelar un turno
 */
export interface CancelAppointmentRequest {
  token: string;
  turnoId: number;
}

/**
 * Response del backend
 */
export interface CancelAppointmentResponse {
  message: string;
}

/**
 * Hook para cancelar un turno
 * Endpoint: PUT /cancelarTurno
 * Requiere: Token y turnoId
 */
export const useCancelAppointment = (): UseMutationResult<
  CancelAppointmentResponse,
  Error,
  CancelAppointmentRequest,
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation<CancelAppointmentResponse, Error, CancelAppointmentRequest, unknown>({
    mutationFn: async (payload: CancelAppointmentRequest) => {
      try {
        const result = await fetchServer({
          method: 'PUT',
          url: cancelAppointmentEndpoint(),
          data: {
            token: payload.token,
            turnoId: payload.turnoId
          },
          headers: {
            'Content-Type': 'application/json'
          },
        });
        return result;
      } catch (error) {
        console.error('❌ Error al cancelar turno:', error);
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidar la query de turnos del paciente para recargar la lista
      queryClient.invalidateQueries({ queryKey: ["patient-appointments"] });
    },
    onError: (error: Error) => {
      console.error('Error al cancelar turno:', error);
    },
  });
};

