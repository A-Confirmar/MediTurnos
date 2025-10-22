import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { fetchServer } from '../fetchServer';

/**
 * Estructura de un turno del profesional (según el backend)
 */
export interface ProfessionalAppointment {
  turnoId: number;
  nombrePaciente: string;
  apellidoPaciente: string;
  emailPaciente?: string; // Opcional, el backend no lo devuelve por defecto
  fechaTurno: string; // "dd-mm-yyyy" (formato del backend)
  hora_inicio: string; // "09:00:00"
  hora_fin: string; // "10:00:00"
  estado: string; // "confirmado", "pendiente", "realizado", "cancelado"
  tipo: string; // "consulta", "control", etc.
}

/**
 * Response del backend para /obtenerMisTurnosConfirmados
 */
export interface ProfessionalAppointmentsResponse {
  message: string;
  result: boolean;
  turnos: ProfessionalAppointment[];
}

/**
 * Hook para obtener TODOS los turnos del profesional autenticado
 * Endpoint: GET /obtenerMisTurnos (devuelve todos: confirmados, pendientes, cancelados, realizados)
 * Requiere: Token (authMiddleware usa req.user.email automáticamente)
 */
export const useGetProfessionalAppointments = (): UseQueryResult<ProfessionalAppointmentsResponse, Error> => {
  return useQuery<ProfessionalAppointmentsResponse, Error>({
    queryKey: ['professional-appointments'],
    queryFn: async () => {
      try {
        const result = await fetchServer({
          method: 'GET',
          url: '/obtenerMisTurnos',
          useToken: true, // El middleware extrae el email del token automáticamente
        });

        return result;
      } catch (error) {
        console.error('❌ Error al obtener turnos del profesional:', error);
        throw error;
      }
    },
    staleTime: 30 * 1000, // 30 segundos
    gcTime: 5 * 60 * 1000, // 5 minutos
    retry: 1,
  });
};
