import { useQuery } from '@tanstack/react-query';
import type { ProvinciasResponse } from './types';
import { PROVINCIAS } from '../../const/argentinaDatos';

const fetchProvincias = async (): Promise<ProvinciasResponse> => {
  // Usar datos locales - más rápido y confiable
  return Promise.resolve({
    provincias: PROVINCIAS,
    cantidad: PROVINCIAS.length,
    total: PROVINCIAS.length,
    inicio: 0,
    parametros: {}
  });

  /* Fallback a API externa (comentado - descomentar si se quiere usar como respaldo)
  try {
    const response = await fetch(
      'https://apis.datos.gob.ar/georef/api/provincias?campos=id,nombre&orden=nombre'
    );
    
    if (!response.ok) {
      throw new Error('Error al obtener provincias');
    }
    
    return response.json();
  } catch (error) {
    // Si la API falla, usar datos locales
    return {
      provincias: PROVINCIAS,
      cantidad: PROVINCIAS.length,
      total: PROVINCIAS.length,
      inicio: 0,
      parametros: {}
    };
  }
  */
};

export const useGetProvincias = () => {
  return useQuery({
    queryKey: ['provincias'],
    queryFn: fetchProvincias,
    staleTime: 1000 * 60 * 60 * 24, // 24 horas (los datos no cambian frecuentemente)
    gcTime: 1000 * 60 * 60 * 24, // 24 horas en caché
  });
};
