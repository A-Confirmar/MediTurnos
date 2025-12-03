import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { fetchServer } from '../fetchServer';

const getPatientAppointmentsEndpoint = () => '/buscarTurno';

/**
 * Estructura de un turno del paciente (según el backend)
 */
export interface PatientAppointment {
  turnoId: number;
  nombrePaciente: string;
  apellidoPaciente: string;
  fechaTurno: string; // DD-MM-YYYY (formateado por el backend)
  hora_inicio: string; // HH:MM:SS
  hora_fin: string; // HH:MM:SS
  estado: string; // 'pendiente' | 'confirmado' | 'completado' | 'cancelado' | 'realizado'
  tipo: string; // 'consulta' | 'control' | 'urgencia'
  nombreProfesional: string;
  apellidoProfesional: string;
  emailProfesional?: string; // Email del profesional (si está disponible en el backend)
  tieneResena?: boolean; // Indica si el turno ya tiene una reseña
  costo?: number; // Costo del turno (para turnos express)
}

/**
 * Response del backend
 */
export interface PatientAppointmentsResponse {
  message: string;
  result: boolean;
  turnos: PatientAppointment[];
}

/**
 * Hook para obtener los turnos del paciente autenticado
 * Endpoint: GET /buscarTurno
 * Requiere: Token (authMiddleware usa req.user.email automáticamente)
 */
export const useGetPatientAppointments = (): UseQueryResult<PatientAppointmentsResponse, Error> => {
  return useQuery<PatientAppointmentsResponse, Error>({
    queryKey: ['patient-appointments'],
    queryFn: async () => {

      try {
        const result = await fetchServer({
          method: 'GET',
          url: getPatientAppointmentsEndpoint(),
          useToken: true, // El middleware extrae el email del token automáticamente
        });

        return result;
      } catch (error) {
        console.error('❌ Error al obtener turnos:', error);
        throw error;
      }
    },
    staleTime: 30 * 1000, // 30 segundos
    gcTime: 5 * 60 * 1000, // 5 minutos
    retry: 1,
  });
};

