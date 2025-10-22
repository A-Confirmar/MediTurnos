import { useQuery } from '@tanstack/react-query';
import { fetchServer } from '../fetchServer';

interface ProfessionalWhoBlockedMe {
  ID?: number;
  nombre: string;
  apellido: string;
  email: string;
  motivo?: string;
  fecha?: string;
}

interface BlockedByProfessionalsResponse {
  bloqueados: ProfessionalWhoBlockedMe[];
  message: string;
  result: boolean;
}

export const useGetProfessionalsWhoBlockedMe = () => {
  return useQuery<BlockedByProfessionalsResponse, Error>({
    queryKey: ['professionalsWhoBlockedMe'],
    queryFn: async () => {
      console.log('🔍 Obteniendo profesionales que me tienen bloqueado...');
      const response = await fetchServer({
        method: 'GET',
        url: '/verProfesionalesQueMeTienenBloqueado',
        useToken: true,
      });
      console.log('✅ Profesionales que me bloquearon obtenidos:', response);
      return response;
    },
    staleTime: 1000 * 60 * 5, // Cache por 5 minutos
  });
};
