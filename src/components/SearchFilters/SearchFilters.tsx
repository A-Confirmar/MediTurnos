import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { COLORS } from '../../const/colors';
import SpecialtyAutocomplete from '../SpecialtyAutocomplete/SpecialtyAutocomplete';
import LocationAutocomplete from '../LocationAutocomplete/LocationAutocomplete';

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
      <div className="grid grid-cols-1 md:grid-cols-[2fr_2fr_auto] gap-4 p-6 bg-white rounded-xl shadow-md items-end">
        {/* Autocomplete de especialidad */}
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
          <SpecialtyAutocomplete
            value={query}
            onChange={handleQueryChange}
            placeholder="Ej: Psicólogo, Cardiólogo..."
          />
        </div>

        {/* Autocomplete de ubicación */}
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
          <LocationAutocomplete
            value={localidad}
            onChange={handleLocalidadChange}
            placeholder="Ej: Neuquén, Buenos Aires..."
          />
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
            whiteSpace: 'nowrap',
            height: 'fit-content'
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
