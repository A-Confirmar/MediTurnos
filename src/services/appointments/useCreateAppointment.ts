import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import { fetchServer } from '../fetchServer';
import { getAccessToken } from '../localstorage';

const createAppointmentEndpoint = () => '/nuevoTurno';

/**
 * Request para crear un turno
 */
export interface CreateAppointmentRequest {
  emailProfesional: string;
  fecha: string;        // Formato: "YYYY-MM-DD" (ej: "2025-10-03")
  hora_inicio: string;  // Formato: "HH:mm" (ej: "09:30")
  hora_fin: string;     // Formato: "HH:mm" (ej: "10:00")
  estado: string;       // "pendiente", "confirmado", "cancelado"
  tipo: string;         // "consulta", "control", etc.
}

/**
 * Response del backend
 */
export interface CreateAppointmentResponse {
  message: string;
  result: boolean;
  turnoid?: number;
}

/**
 * Hook para crear un nuevo turno
 * Endpoint: POST /nuevoTurno
 * Requiere: Token (automático)
 */
export const useCreateAppointment = (): UseMutationResult<
  CreateAppointmentResponse,
  Error,
  CreateAppointmentRequest,
  unknown
> => {
  const queryClient = useQueryClient();
  
  return useMutation<CreateAppointmentResponse, Error, CreateAppointmentRequest, unknown>({
    mutationFn: async (appointmentData: CreateAppointmentRequest) => {

      try {
        const token = await getAccessToken();

        const result = await fetchServer({
          method: 'POST',
          url: createAppointmentEndpoint(),
          data: {
            token: token,
            emailProfesional: appointmentData.emailProfesional,
            fecha: appointmentData.fecha,
            hora_inicio: appointmentData.hora_inicio,
            hora_fin: appointmentData.hora_fin,
            estado: appointmentData.estado,
            tipo: appointmentData.tipo
          },
          headers: {
            'Content-Type': 'application/json'
          },
          useToken: true,
        });

        return result;
      } catch (error) {
        console.error('❌ Error al crear turno:', error);
        throw error;
      }
    },
    onError: (error: Error) => {
      console.error('Error al crear turno:', error);
    },
    onSuccess: () => {
      // Invalidar queries de disponibilidad para que se actualicen los horarios
      queryClient.invalidateQueries({ queryKey: ['professional-availability'] });
      queryClient.invalidateQueries({ queryKey: ['patient-appointments'] });
    }
  });
};

