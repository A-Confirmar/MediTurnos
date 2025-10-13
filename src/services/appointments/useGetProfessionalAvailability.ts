import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { fetchServer } from '../fetchServer';
import { getUser } from '../localstorage';
import type { WeekAvailability } from '../auth/useSetAvailability';

const getAvailabilityEndpoint = () => '/obtenerDisponibilidadProfesional';

/**
 * Estructura de horario para un día específico
 */
export interface TimeSlot {
  inicio: string; // Formato: "HH:mm" (ej: "08:00")
  fin: string;    // Formato: "HH:mm" (ej: "12:00")
}

/**
 * Estructura de disponibilidad por día de la semana
 */
export interface ProfessionalAvailability {
  ID?: number;
  nombre?: string;
  dia_semana?: string;
  hora_inicio?: string;
  hora_fin?: string;
}

/**
 * Response del backend para disponibilidad
 */
export interface AvailabilityResponse {
  message: string;
  disponibilidad: ProfessionalAvailability[];
  result: boolean;
}

/**
 * Convierte la respuesta del backend (filas individuales) 
 * al formato WeekAvailability que usa el componente
 */
export const convertToWeekAvailability = (disponibilidad: ProfessionalAvailability[]): WeekAvailability => {
  const weekAvailability: WeekAvailability = {};


  disponibilidad.forEach((slot) => {
    if (!slot.dia_semana || !slot.hora_inicio || !slot.hora_fin) {
      console.warn('⚠️ Slot inválido (falta día o hora):', slot);
      return;
    }

    // Normalizar el nombre del día a minúsculas y sin acentos
    let day = slot.dia_semana.toLowerCase().trim();
    
    // Mapeo de días (por si vienen con mayúsculas o acentos)
    const dayMap: Record<string, keyof WeekAvailability> = {
      'lunes': 'lunes',
      'martes': 'martes',
      'miercoles': 'miercoles',
      'miércoles': 'miercoles',
      'jueves': 'jueves',
      'viernes': 'viernes',
      'sabado': 'sabado',
      'sábado': 'sabado',
      'domingo': 'domingo'
    };
    
    const normalizedDay = dayMap[day];
    
    if (!normalizedDay) {
      console.warn('⚠️ Día no reconocido:', slot.dia_semana);
      return;
    }

    // Convertir hora de formato HH:MM:SS a HH:MM (si viene con segundos)
    const formatTime = (time: string): string => {
      // Si viene como "09:00:00", convertir a "09:00"
      if (time.length > 5) {
        return time.substring(0, 5);
      }
      return time;
    };

    const inicio = formatTime(slot.hora_inicio);
    const fin = formatTime(slot.hora_fin);

    if (!weekAvailability[normalizedDay]) {
      weekAvailability[normalizedDay] = [];
    }

    weekAvailability[normalizedDay]!.push({
      inicio,
      fin
    });

  });
  return weekAvailability;
};

/**
 * Hook para obtener la disponibilidad del profesional autenticado
 * Endpoint: GET /obtenerDisponibilidadProfesional?email=professional@email.com
 * Requiere: Token (automático) + email como query param
 */
export const useGetProfessionalAvailability = (): UseQueryResult<AvailabilityResponse, Error> => {
  return useQuery<AvailabilityResponse, Error>({
    queryKey: ['professional-availability'],
    queryFn: async () => {

      try {
        // Obtener email del usuario logueado
        const user = getUser();
        const email = user?.email;

        if (!email) {
          throw new Error('No se pudo obtener el email del usuario');
        }


        const result = await fetchServer({
          method: 'GET',
          url: getAvailabilityEndpoint(),
          params: { email }, // Enviamos email como query param
          useToken: true,
        });

        return result;
      } catch (error) {
        console.error('❌ Error al obtener disponibilidad:', error);
        throw error;
      }
    },
    staleTime: 30 * 1000, // 30 segundos
    gcTime: 5 * 60 * 1000, // 5 minutos
    retry: 1,
  });
};

/**
 * Hook para obtener la disponibilidad de un profesional específico por email
 * Usado cuando un paciente quiere ver la disponibilidad de un profesional
 * Endpoint: GET /obtenerDisponibilidadProfesional?email=professional@email.com
 */
export const useGetProfessionalAvailabilityByEmail = (
  professionalEmail: string
): UseQueryResult<AvailabilityResponse, Error> => {
  return useQuery<AvailabilityResponse, Error>({
    queryKey: ['professional-availability', professionalEmail],
    queryFn: async () => {

      try {
        if (!professionalEmail) {
          throw new Error('Email del profesional no proporcionado');
        }

        const result = await fetchServer({
          method: 'GET',
          url: getAvailabilityEndpoint(),
          params: { email: professionalEmail }, // Email del profesional seleccionado
          useToken: true,
        });

        return result;
      } catch (error) {
        console.error('❌ Error al obtener disponibilidad:', error);
        throw error;
      }
    },
    enabled: !!professionalEmail, // Solo ejecutar si hay email
    staleTime: 30 * 1000, // 30 segundos
    gcTime: 5 * 60 * 1000, // 5 minutos
    retry: 1,
  });
};

