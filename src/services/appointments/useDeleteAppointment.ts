import { useMutation, useQueryClient, type UseMutationResult } from "@tanstack/react-query";
import { fetchServer } from "../fetchServer";

const deleteAppointmentEndpoint = () => '/eliminarTurno';

/**
 * Request para eliminar un turno
 */
export interface DeleteAppointmentRequest {
  token: string;
  turnoId: number;
}

/**
 * Response del backend
 */
export interface DeleteAppointmentResponse {
  message: string;
}

/**
 * Hook para eliminar un turno
 * Endpoint: DELETE /eliminarTurno
 * Requiere: Token y turnoId
 */
export const useDeleteAppointment = (): UseMutationResult<
  DeleteAppointmentResponse,
  Error,
  DeleteAppointmentRequest,
  unknown
> => {
  const queryClient = useQueryClient();

  return useMutation<DeleteAppointmentResponse, Error, DeleteAppointmentRequest, unknown>({
    mutationFn: async (payload: DeleteAppointmentRequest) => {

      try {
        const result = await fetchServer({
          method: 'DELETE',
          url: deleteAppointmentEndpoint(),
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
        console.error('❌ Error al eliminar turno:', error);
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidar la query de turnos del paciente para recargar la lista
      queryClient.invalidateQueries({ queryKey: ["patient-appointments"] });
    },
    onError: (error: Error) => {
      console.error('Error al eliminar turno:', error);
    },
  });
};

