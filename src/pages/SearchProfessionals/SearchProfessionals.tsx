import React, { useState, useMemo } from 'react';
import { Search as SearchIcon, AlertCircle, LogIn } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header';
import SearchFilters from '../../components/SearchFilters/SearchFilters';
import ProfessionalCard from '../../components/ProfessionalCard/ProfessionalCard';
import { 
  useSearchProfessionals, 
  filterProfessionals,
  type ProfessionalSearchResult 
} from '../../services/professionals/useSearchProfessionals';
import { COLORS } from '../../const/colors';
import { getUser } from '../../services/localstorage';
import { ROUTES } from '../../const/routes';

const SearchProfessionals: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Verificar si el usuario está autenticado
  const user = getUser();
  const isAuthenticated = !!user;
  
  // Leer parámetros iniciales de la URL
  const initialQuery = searchParams.get('query') || '';
  const initialLocalidad = searchParams.get('localidad') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchLocalidad, setSearchLocalidad] = useState(initialLocalidad);

  // Cargar TODOS los profesionales solo si está autenticado
  const { data: allProfessionalsData, isLoading, error } = useSearchProfessionals({ 
    enabled: isAuthenticated 
  });

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
        {!isAuthenticated ? (
          // Usuario no autenticado - mostrar mensaje para iniciar sesión
          <div style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            backgroundColor: COLORS.WHITE,
            borderRadius: '12px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <LogIn size={64} style={{ color: COLORS.PRIMARY_CYAN, margin: '0 auto 1rem' }} />
            <h3 style={{
              margin: '0 0 1rem 0',
              fontSize: '1.5rem',
              fontWeight: '600',
              color: COLORS.PRIMARY_DARK
            }}>
              Inicia sesión para buscar profesionales
            </h3>
            <p style={{
              margin: '0 0 2rem 0',
              fontSize: '1rem',
              color: '#6b7280',
              maxWidth: '500px',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}>
              Para buscar y reservar turnos con profesionales de la salud, necesitas tener una cuenta
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => navigate(ROUTES.login)}
                style={{
                  padding: '0.75rem 2rem',
                  backgroundColor: COLORS.PRIMARY_MEDIUM,
                  color: COLORS.WHITE,
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = COLORS.PRIMARY_DARK;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = COLORS.PRIMARY_MEDIUM;
                }}
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => navigate(ROUTES.roleSelection)}
                style={{
                  padding: '0.75rem 2rem',
                  backgroundColor: 'white',
                  color: COLORS.PRIMARY_MEDIUM,
                  border: `2px solid ${COLORS.PRIMARY_MEDIUM}`,
                  borderRadius: '8px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = COLORS.PRIMARY_MEDIUM;
                  e.currentTarget.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.color = COLORS.PRIMARY_MEDIUM;
                }}
              >
                Registrarse
              </button>
            </div>
          </div>
        ) : isLoading ? (
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
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
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

