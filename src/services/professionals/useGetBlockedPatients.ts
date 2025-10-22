import { useQuery } from '@tanstack/react-query';
import { fetchServer } from '../fetchServer';

interface BlockedPatient {
  ID?: number;
  nombre: string;
  apellido: string;
  email: string;
  fecha?: string;
  motivo?: string;
}

interface BlockedPatientsResponse {
  bloqueados: BlockedPatient[];
  message: string;
  result: boolean;
}

export const useGetBlockedPatients = () => {
  return useQuery<BlockedPatientsResponse, Error>({
    queryKey: ['blockedPatients'],
    queryFn: async () => {
      console.log('🔍 Obteniendo pacientes bloqueados...');
      const response = await fetchServer({
        method: 'GET',
        url: '/verBloqueados',
        useToken: true,
      });
      console.log('✅ Pacientes bloqueados obtenidos:', response);
      return response;
    },
    staleTime: 1000 * 60 * 5, // Cache por 5 minutos
  });
};
