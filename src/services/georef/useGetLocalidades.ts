import { useQuery } from '@tanstack/react-query';
import type { LocalidadesResponse } from './types';
import { getLocalidadesByProvincia, PROVINCIAS } from '../../const/argentinaDatos';

const fetchLocalidades = async (provinciaId: string): Promise<LocalidadesResponse> => {
  // Usar datos locales - más rápido y confiable
  const localidades = getLocalidadesByProvincia(provinciaId);
  const provincia = PROVINCIAS.find(p => p.id === provinciaId);

  // Convertir al formato esperado por la API
  const localidadesConProvincia = localidades.map(loc => ({
    id: loc.id,
    nombre: loc.nombre,
    provincia: {
      id: provinciaId,
      nombre: provincia?.nombre || ''
    }
  }));

  return Promise.resolve({
    localidades: localidadesConProvincia,
    cantidad: localidades.length,
    total: localidades.length,
    inicio: 0,
    parametros: {}
  });

  /* Fallback a API externa (comentado - descomentar si se quiere usar como respaldo)
  try {
    const response = await fetch(
      `https://apis.datos.gob.ar/georef/api/localidades?provincia=${provinciaId}&campos=id,nombre&max=1000&orden=nombre`
    );
    
    if (!response.ok) {
      throw new Error('Error al obtener localidades');
    }
    
    return response.json();
  } catch (error) {
    // Si la API falla, usar datos locales
    const localidades = getLocalidadesByProvincia(provinciaId);
    const provincia = PROVINCIAS.find(p => p.id === provinciaId);
    
    const localidadesConProvincia = localidades.map(loc => ({
      id: loc.id,
      nombre: loc.nombre,
      provincia: {
        id: provinciaId,
        nombre: provincia?.nombre || ''
      }
    }));

    return {
      localidades: localidadesConProvincia,
      cantidad: localidades.length,
      total: localidades.length,
      inicio: 0,
      parametros: {}
    };
  }
  */
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
