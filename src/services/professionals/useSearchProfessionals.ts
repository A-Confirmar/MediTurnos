import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { fetchServer } from '../fetchServer';

const searchProfessionalsEndpoint = () => '/buscarProfesional';

/**
 * Datos de un profesional en los resultados de búsqueda
 */
export interface ProfessionalSearchResult {
  id?: number; // ID opcional - el backend actual no lo devuelve
  nombre: string;
  apellido: string;
  email: string;
  telefono?: string;
  especialidad: string;
  descripcion?: string;
  localidad?: string;
  direccion?: string;
  calificacion_promedio?: number;
  imagenUrl?: string; // URL de la foto de perfil
  valorConsulta?: number; // Tarifa consulta estándar
  valorConsultaExpress?: number; // Tarifa consulta express
}

/**
 * Filtros de búsqueda
 */
export interface SearchFilters {
  query?: string;        // Busca en nombre, apellido, especialidad
  especialidad?: string; // Filtro específico por especialidad
  localidad?: string;    // Filtro por localidad
}

/**
 * Response del backend
 * El backend devuelve: { message, result, data: array }
 */
export interface SearchProfessionalsResponse {
  message: string;
  result: boolean;
  data: ProfessionalSearchResult[];
}

/**
 * Hook para obtener TODOS los profesionales y filtrarlos en el frontend
 * Hace múltiples peticiones con diferentes letras para obtener todos los profesionales
 * y elimina duplicados
 */
export const useSearchProfessionals = (): UseQueryResult<SearchProfessionalsResponse, Error> => {
  return useQuery<SearchProfessionalsResponse, Error>({
    queryKey: ['all-professionals'],
    queryFn: async () => {
      console.log('🔍 Cargando todos los profesionales...');

      try {
        // Como el backend no tiene endpoint para "todos", hacemos búsquedas con vocales comunes
        // y combinamos los resultados eliminando duplicados
        const searchTerms = ['a', 'e', 'i', 'o', 'u', 'r', 't', 'n', 's', 'l'];
        const allResults: ProfessionalSearchResult[] = [];
        const seenEmails = new Set<string>();

        for (const term of searchTerms) {
          try {
            const result = await fetchServer({
              method: 'GET',
              url: searchProfessionalsEndpoint(),
              params: { leyenda: term },
              useToken: true,
            });

            // Agregar profesionales únicos (usar email como identificador único)
            if (result.data && Array.isArray(result.data)) {
              result.data.forEach((prof: ProfessionalSearchResult) => {
                if (!seenEmails.has(prof.email)) {
                  seenEmails.add(prof.email);
                  allResults.push(prof);
                }
              });
            }
          } catch (error) {
            // Si una búsqueda falla (404), continuamos con la siguiente
            console.log(`No se encontraron profesionales con "${term}"`);
          }
        }

        console.log(`✅ Total de profesionales únicos encontrados: ${allResults.length}`);
        
        return {
          message: "Profesionales encontrados",
          result: true,
          data: allResults
        };
      } catch (error) {
        console.error('❌ Error al cargar profesionales:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutos - mantiene los datos frescos
    gcTime: 10 * 60 * 1000, // 10 minutos - mantiene en cache
    retry: 1, // Solo 1 reintento porque ya hacemos múltiples búsquedas
  });
};

/**
 * Función auxiliar para filtrar profesionales en el frontend
 */
export const filterProfessionals = (
  professionals: ProfessionalSearchResult[],
  searchQuery: string,
  searchLocalidad: string
): ProfessionalSearchResult[] => {
  if (!searchQuery && !searchLocalidad) {
    return professionals;
  }

  return professionals.filter((prof) => {
    const matchesQuery = !searchQuery || 
      prof.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prof.apellido.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prof.especialidad.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (prof.descripcion?.toLowerCase().includes(searchQuery.toLowerCase()) || false);

    const matchesLocalidad = !searchLocalidad ||
      (prof.localidad?.toLowerCase().includes(searchLocalidad.toLowerCase()) || false);

    return matchesQuery && matchesLocalidad;
  });
};

