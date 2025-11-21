import { useMemo } from 'react';
import { useSearchProfessionals } from './useSearchProfessionals';

/**
 * Hook que devuelve el conjunto de especialidades que tienen al menos un profesional
 * Útil para deshabilitar visualmente especialidades sin profesionales
 */
export const useGetActiveSpecialties = () => {
  const { data: professionalsData, isLoading, error } = useSearchProfessionals();

  const activeSpecialties = useMemo(() => {
    if (!professionalsData?.data) {
      return new Set<string>();
    }

    // Extraer especialidades únicas de los profesionales
    const specialties = new Set<string>();
    professionalsData.data.forEach(professional => {
      if (professional.especialidad) {
        specialties.add(professional.especialidad.trim());
      }
    });

    return specialties;
  }, [professionalsData]);

  return {
    activeSpecialties,
    isLoading,
    error,
    totalProfessionals: professionalsData?.data.length || 0
  };
};

