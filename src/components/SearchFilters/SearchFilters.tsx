import React, { useState } from 'react';
import { Search, MapPin, Stethoscope, Calendar } from 'lucide-react';
import { COLORS } from '../../const/colors';
import { ESPECIALIDADES } from '../../const/especialidades';

interface SearchFiltersProps {
  onSearch: (query: string, localidad: string) => void;
  isLoading?: boolean;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ onSearch, isLoading = false }) => {
  const [query, setQuery] = useState('');
  const [localidad, setLocalidad] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query, localidad);
  };

  const handleQueryChange = (value: string) => {
    setQuery(value);
    // Búsqueda instantánea en el frontend (sin esperar a submit)
    onSearch(value, localidad);
  };

  const handleLocalidadChange = (value: string) => {
    setLocalidad(value);
    // Búsqueda instantánea en el frontend (sin esperar a submit)
    onSearch(query, value);
  };

  return (
    <form onSubmit={handleSearch} style={{ width: '100%' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr auto',
        gap: '1rem',
        padding: '1.5rem',
        backgroundColor: COLORS.WHITE,
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        alignItems: 'end'
      }}>
        {/* Campo de búsqueda por especialidad/nombre */}
        <div>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '0.9rem',
            fontWeight: '600',
            color: COLORS.PRIMARY_DARK
          }}>
            Especialidad o profesional
          </label>
          <div style={{ position: 'relative' }}>
            <Stethoscope
              size={20}
              style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af'
              }}
            />
            <input
              type="text"
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              placeholder="Ej: Cardiología, Dr. Juan Pérez"
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 3rem',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '1rem',
                transition: 'border-color 0.2s',
                outline: 'none',
                color: '#1f2937',
                backgroundColor: COLORS.WHITE
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = COLORS.PRIMARY_MEDIUM}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
            />
          </div>
        </div>

        {/* Select de especialidades */}
        <div>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '0.9rem',
            fontWeight: '600',
            color: COLORS.PRIMARY_DARK
          }}>
            Seleccionar especialidad
          </label>
          <div style={{ position: 'relative' }}>
            <Calendar
              size={20}
              style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af',
                pointerEvents: 'none',
                zIndex: 1
              }}
            />
            <select
              style={{ 
                width: '100%',
                padding: '0.75rem 2.5rem 0.75rem 3rem',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '1rem',
                transition: 'border-color 0.2s',
                outline: 'none',
                color: '#1f2937',
                backgroundColor: COLORS.WHITE,
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                backgroundPosition: 'right 0.5rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.5em 1.5em'
              }}
              value={query}
              onChange={e => handleQueryChange(e.target.value)}
              onFocus={(e) => e.currentTarget.style.borderColor = COLORS.PRIMARY_MEDIUM}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
            >
              <option value="">Seleccionar especialidad...</option>
              {ESPECIALIDADES.map((especialidad) => (
                <option key={especialidad} value={especialidad}>{especialidad}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Campo de ubicación */}
        <div>
          <label style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '0.9rem',
            fontWeight: '600',
            color: COLORS.PRIMARY_DARK
          }}>
            Ubicación
          </label>
          <div style={{ position: 'relative' }}>
            <MapPin
              size={20}
              style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#9ca3af'
              }}
            />
            <input
              type="text"
              value={localidad}
              onChange={(e) => handleLocalidadChange(e.target.value)}
              placeholder="Ej: Neuquén, Buenos Aires"
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 3rem',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '1rem',
                transition: 'border-color 0.2s',
                outline: 'none',
                color: '#1f2937',
                backgroundColor: COLORS.WHITE
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = COLORS.PRIMARY_MEDIUM}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
            />
          </div>
        </div>

        {/* Botón de búsqueda */}
        <button
          type="submit"
          disabled={isLoading}
          style={{
            padding: '0.75rem 2rem',
            backgroundColor: isLoading ? '#9ca3af' : COLORS.PRIMARY_MEDIUM,
            color: COLORS.WHITE,
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'background-color 0.2s',
            whiteSpace: 'nowrap'
          }}
          onMouseEnter={(e) => {
            if (!isLoading) e.currentTarget.style.backgroundColor = COLORS.PRIMARY_DARK;
          }}
          onMouseLeave={(e) => {
            if (!isLoading) e.currentTarget.style.backgroundColor = COLORS.PRIMARY_MEDIUM;
          }}
        >
          <Search size={20} />
          {isLoading ? 'Buscando...' : 'Buscar'}
        </button>
      </div>
    </form>
  );
};

export default SearchFilters;
