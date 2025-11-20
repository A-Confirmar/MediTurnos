import { useQuery } from '@tanstack/react-query';
import { fetchServer } from '../fetchServer';
import { getUser } from '../localstorage';

export interface TurnoExpressPendiente {
  turnoId: number;
  emailPaciente?: string;
  email_paciente?: string;
  nombrePaciente?: string;
  nombre_paciente?: string;
  apellidoPaciente?: string;
  apellido_paciente?: string;
  telefonoPaciente?: string;
  telefono_paciente?: string;
  emailProfesional?: string;
  email_profesional?: string;
  fechaTurno?: string;
  fecha_turno?: string;
  hora_inicio?: string;
  hora_fin?: string;
  tipo: string;
  estado: string;
  expressAceptado?: boolean | number; // 1 (true) o 0 (false) desde la DB, o boolean
  token?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface GetTurnosExpressResponse {
  turnos: TurnoExpressPendiente[];
  message?: string;
  result?: boolean;
}

/**
 * Hook para obtener los turnos express pendientes de un profesional
 * Obtiene todos los turnos y filtra los de tipo 'express' en estado 'pendiente'
 */
export const useGetTurnosExpressPendientes = () => {
  const user = getUser();

  return useQuery<TurnoExpressPendiente[]>({
    queryKey: ['expressAppointments', 'pendientes', user?.email],
    queryFn: async () => {
      try {
        // Obtener todos los turnos del profesional
        const response = await fetchServer({
          method: 'GET',
          url: '/obtenerMisTurnos',
          useToken: true,
        }) as GetTurnosExpressResponse;
        
        if (!response.turnos || !Array.isArray(response.turnos)) {
          console.warn('⚠️ No se recibieron turnos o el formato es incorrecto');
          return [];
        }
        
        // Filtrar solo turnos de tipo 'express'
        // expressAceptado viene como 1 (true) o 0 (false) desde la base de datos
        const turnosExpress = response.turnos.filter((turno: TurnoExpressPendiente) => {
          const isExpress = turno.tipo?.toLowerCase() === 'express';
          // Excluir si expressAceptado es 1 (true) o true (booleano)
          const noAceptado = turno.expressAceptado !== 1 && turno.expressAceptado !== true;
          return isExpress && noAceptado;
        });
        return turnosExpress;
      } catch (error) {
        console.error('❌ Error al obtener turnos express:', error);
        // Re-lanzar el error para que React Query lo maneje
        throw error;
      }
    },
    enabled: !!user?.email, // Solo ejecutar si hay usuario logueado
    staleTime: 30 * 1000, // 30 segundos
    gcTime: 5 * 60 * 1000, // 5 minutos
    retry: 1,
  });
};

