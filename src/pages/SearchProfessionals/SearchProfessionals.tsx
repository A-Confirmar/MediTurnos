import React, { useState, useMemo } from 'react';
import { Search as SearchIcon, AlertCircle } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import Header from '../../components/Header/Header';
import SearchFilters from '../../components/SearchFilters/SearchFilters';
import ProfessionalCard from '../../components/ProfessionalCard/ProfessionalCard';
import { 
  useSearchProfessionals, 
  filterProfessionals,
  type ProfessionalSearchResult 
} from '../../services/professionals/useSearchProfessionals';
import { COLORS } from '../../const/colors';

const SearchProfessionals: React.FC = () => {
  const [searchParams] = useSearchParams();
  
  // Leer parámetros iniciales de la URL
  const initialQuery = searchParams.get('query') || '';
  const initialLocalidad = searchParams.get('localidad') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchLocalidad, setSearchLocalidad] = useState(initialLocalidad);

  // Cargar TODOS los profesionales una vez (se mantiene en cache de React Query)
  const { data: allProfessionalsData, isLoading, error } = useSearchProfessionals();

  // Filtrar profesionales en el frontend usando useMemo para optimizar
  const filteredProfessionals = useMemo(() => {
    if (!allProfessionalsData?.data) return [];
    
    return filterProfessionals(
      allProfessionalsData.data,
      searchQuery,
      searchLocalidad
    );
  }, [allProfessionalsData?.data, searchQuery, searchLocalidad]);

  const handleSearch = (query: string, localidad: string) => {
    setSearchQuery(query);
    setSearchLocalidad(localidad);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <Header />
      
      <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header de la página */}
        <div style={{
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          <h1 style={{
            margin: '0 0 0.5rem 0',
            fontSize: '2.5rem',
            fontWeight: '700',
            color: COLORS.PRIMARY_DARK
          }}>
            Encontrá tu especialista y pedí turno
          </h1>
          <p style={{
            margin: 0,
            fontSize: '1.1rem',
            color: '#6b7280'
          }}>
            Conectamos pacientes con los mejores profesionales de la salud
          </p>
        </div>

        {/* Buscador con filtros */}
        <div style={{ marginBottom: '3rem' }}>
          <SearchFilters onSearch={handleSearch} isLoading={isLoading} />
        </div>

        {/* Resultados */}
        {isLoading ? (
          <div style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            backgroundColor: COLORS.WHITE,
            borderRadius: '12px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              border: `4px solid ${COLORS.PRIMARY_CYAN}`,
              borderTopColor: COLORS.PRIMARY_MEDIUM,
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem'
            }} />
            <p style={{
              margin: 0,
              fontSize: '1.1rem',
              fontWeight: '600',
              color: COLORS.PRIMARY_DARK
            }}>
              Cargando profesionales...
            </p>
            <style>{`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        ) : error ? (
          <div style={{
            padding: '2rem',
            backgroundColor: '#fef2f2',
            borderRadius: '12px',
            border: '2px solid #fca5a5',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            color: '#dc2626'
          }}>
            <AlertCircle size={32} />
            <div>
              <p style={{ margin: 0, fontWeight: '600', fontSize: '1.1rem' }}>
                Error al cargar profesionales
              </p>
              <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.95rem' }}>
                {error instanceof Error ? error.message : 'Por favor, intenta nuevamente'}
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Header de resultados */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}>
              <h2 style={{
                margin: 0,
                fontSize: '1.5rem',
                fontWeight: '700',
                color: COLORS.PRIMARY_DARK
              }}>
                {(searchQuery || searchLocalidad) ? 'Resultados de búsqueda' : 'Todos los profesionales'}
              </h2>
              <span style={{
                padding: '0.5rem 1rem',
                backgroundColor: COLORS.PRIMARY_CYAN,
                color: COLORS.PRIMARY_DARK,
                borderRadius: '20px',
                fontSize: '0.9rem',
                fontWeight: '600'
              }}>
                {filteredProfessionals.length} {filteredProfessionals.length === 1 ? 'profesional' : 'profesionales'} encontrado{filteredProfessionals.length === 1 ? '' : 's'}
              </span>
            </div>

            {/* Lista de profesionales */}
            {filteredProfessionals.length > 0 ? (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(500px, 1fr))',
                gap: '1.5rem'
              }}>
                {filteredProfessionals.map((professional: ProfessionalSearchResult, index: number) => (
                  <ProfessionalCard
                    key={professional.email || index}
                    professional={professional}
                  />
                ))}
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '4rem 2rem',
                backgroundColor: COLORS.WHITE,
                borderRadius: '12px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <SearchIcon size={64} style={{ color: '#9ca3af', margin: '0 auto 1rem' }} />
                <h3 style={{
                  margin: '0 0 0.5rem 0',
                  fontSize: '1.5rem',
                  fontWeight: '600',
                  color: COLORS.PRIMARY_DARK
                }}>
                  {(searchQuery || searchLocalidad) ? 'No se encontraron profesionales' : 'No hay profesionales disponibles'}
                </h3>
                <p style={{
                  margin: 0,
                  fontSize: '1rem',
                  color: '#6b7280'
                }}>
                  {(searchQuery || searchLocalidad) 
                    ? 'Intenta con otros términos de búsqueda o localidad' 
                    : 'Aún no hay profesionales registrados en el sistema'}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchProfessionals;

