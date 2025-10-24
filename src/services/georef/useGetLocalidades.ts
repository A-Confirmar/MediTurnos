import { useQuery } from '@tanstack/react-query';
import type { LocalidadesResponse } from './types';

const fetchLocalidades = async (provinciaId: string): Promise<LocalidadesResponse> => {
  const response = await fetch(
    `https://apis.datos.gob.ar/georef/api/localidades?provincia=${provinciaId}&campos=id,nombre&max=1000&orden=nombre`
  );
  
  if (!response.ok) {
    throw new Error('Error al obtener localidades');
  }
  
  return response.json();
};

export const useGetLocalidades = (provinciaId: string) => {
  return useQuery({
    queryKey: ['localidades', provinciaId],
    queryFn: () => fetchLocalidades(provinciaId),
    enabled: !!provinciaId, // Solo ejecutar si hay provincia seleccionada
    staleTime: 1000 * 60 * 60 * 24, // 24 horas
    gcTime: 1000 * 60 * 60 * 24, // 24 horas en caché
  });
};
