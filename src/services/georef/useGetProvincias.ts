import { useQuery } from '@tanstack/react-query';
import type { ProvinciasResponse } from './types';

const fetchProvincias = async (): Promise<ProvinciasResponse> => {
  const response = await fetch(
    'https://apis.datos.gob.ar/georef/api/provincias?campos=id,nombre&orden=nombre'
  );
  
  if (!response.ok) {
    throw new Error('Error al obtener provincias');
  }
  
  return response.json();
};

export const useGetProvincias = () => {
  return useQuery({
    queryKey: ['provincias'],
    queryFn: fetchProvincias,
    staleTime: 1000 * 60 * 60 * 24, // 24 horas (los datos no cambian frecuentemente)
    gcTime: 1000 * 60 * 60 * 24, // 24 horas en caché
  });
};
