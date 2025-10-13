import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { fetchServer } from '../fetchServer';
import { getAccessToken } from '../localstorage';

const setAvailabilityEndpoint = () => '/establecerDisponibilidadProfesional';

/**
 * Estructura de horario para un día específico
 */
export interface TimeSlot {
  inicio: string; // Formato: "HH:mm" (ej: "08:15")
  fin: string;    // Formato: "HH:mm" (ej: "20:00")
}

/**
 * Estructura de disponibilidad por día de la semana
 */
export interface WeekAvailability {
  lunes?: TimeSlot[];
  martes?: TimeSlot[];
  miercoles?: TimeSlot[];
  jueves?: TimeSlot[];
  viernes?: TimeSlot[];
  sabado?: TimeSlot[];
  domingo?: TimeSlot[];
}

/**
 * Request para establecer disponibilidad
 */
export interface SetAvailabilityRequest {
  horarios: WeekAvailability;
}

/**
 * Response del backend
 */
export interface SetAvailabilityResponse {
  message: string;
  result: boolean;
}

/**
 * Hook para establecer la disponibilidad del profesional autenticado
 * Endpoint: POST /establecerDisponibilidadProfesional
 * Requiere: Token (automático)
 */
export const useSetAvailability = (): UseMutationResult<
  SetAvailabilityResponse,
  Error,
  SetAvailabilityRequest,
  unknown
> => {
  return useMutation<SetAvailabilityResponse, Error, SetAvailabilityRequest, unknown>({
    mutationFn: async (availabilityData: SetAvailabilityRequest) => {
      console.log('📅 Estableciendo disponibilidad profesional...');
      console.log('Datos a enviar:', JSON.stringify(availabilityData, null, 2));

      try {
        const token = await getAccessToken();
        
        console.log('🔑 Token obtenido:', token);
        console.log('🔑 Longitud del token:', token ? token.length : 0);
        
        if (!token) {
          console.error('❌ NO HAY TOKEN DISPONIBLE');
          throw new Error('Token no disponible. Por favor, inicia sesión nuevamente.');
        }

        const requestData = {
          token: token,
          horarios: availabilityData.horarios
        };
        
        console.log('📦 Request data completo:', JSON.stringify(requestData, null, 2));

        const result = await fetchServer({
          method: 'POST',
          url: setAvailabilityEndpoint(),
          data: requestData,
          headers: {
            'Content-Type': 'application/json'
          },
          useToken: false, // NO enviar en header, solo en body (líneas 11-12 del middleware)
        });

        console.log('✅ Disponibilidad establecida correctamente:', result);
        return result;
      } catch (error) {
        console.error('❌ Error al establecer disponibilidad:', error);
        throw error;
      }
    },
    onError: (error: Error) => {
      console.error('Error al establecer disponibilidad:', error);
    },
    onSuccess: (data) => {
      console.log('Disponibilidad guardada exitosamente:', data.message);
    }
  });
};

