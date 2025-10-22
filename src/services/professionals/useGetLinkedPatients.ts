import { useQuery } from '@tanstack/react-query';
import { fetchServer } from '../fetchServer';

interface LinkedPatient {
  nombre: string;
  apellido: string;
  email: string;
  fecha_nacimiento: string;
  telefono: string;
  localidad: string;
  imagenPerfil?: string;
}

interface LinkedPatientsResponse {
  message: string;
  data: LinkedPatient[];
  result: boolean;
}

export const useGetLinkedPatients = () => {
  return useQuery<LinkedPatientsResponse, Error>({
    queryKey: ['linkedPatients'],
    queryFn: async () => {
      console.log('🔍 Obteniendo pacientes vinculados...');
      const response = await fetchServer({
        method: 'GET',
        url: '/obtenerListaDePacientesVinculados',
        useToken: true,
      });
      console.log('✅ Pacientes vinculados obtenidos:', response);
      return response;
    },
    staleTime: 1000 * 60 * 5, // Cache por 5 minutos
  });
};
