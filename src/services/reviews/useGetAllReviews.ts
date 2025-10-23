import { useQuery } from '@tanstack/react-query';
import { fetchServer } from '../fetchServer';

export interface Review {
  ID: number;
  turno_ID: number;
  puntaje: number;
  comentario: string;
  fecha: string;
  estado: 'oculto' | 'visible';
  nombrePaciente?: string;
  apellidoPaciente?: string;
  nombreProfesional?: string;
  apellidoProfesional?: string;
  especialidad?: string;
}

interface AllReviewsResponse {
  message: string;
  reseñas: Review[]; // CON Ñ
  result: boolean;
}

export const useGetAllReviews = () => {
  return useQuery<AllReviewsResponse>({
    queryKey: ['all-reviews'],
    queryFn: async () => {
      const response = await fetchServer({
        method: 'GET',
        url: '/verTodasLasResenias',
        useToken: true
      });
      
      const cleanResponse = JSON.parse(JSON.stringify(response));
      return cleanResponse;
    },
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5
  });
};
