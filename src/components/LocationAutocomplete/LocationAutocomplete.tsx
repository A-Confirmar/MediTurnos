import React, { useState, useRef, useEffect, useMemo } from 'react';
import { MapPin } from 'lucide-react';
import { PROVINCIAS, getAllLocalidades } from '../../const/argentinaDatos';
import { COLORS } from '../../const/colors';

interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({
  value,
  onChange,
  placeholder = "ej. Buenos Aires, Neuquén...",
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Obtener todas las localidades una sola vez
  const allLocalidades = useMemo(() => getAllLocalidades(), []);

  // Función para normalizar texto (remover acentos y convertir a minúsculas)
  const normalizeText = (text: string) => {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  };

  // Filtrar ubicaciones (provincias + localidades) basado en el input
  const filteredLocations = useMemo(() => {
    if (!value.trim()) return [];

    const normalizedQuery = normalizeText(value);
    const results: Array<{ type: 'provincia' | 'localidad'; nombre: string; provincia?: string }> = [];

    // Buscar en provincias
    PROVINCIAS.forEach(provincia => {
      if (normalizeText(provincia.nombre).includes(normalizedQuery)) {
        results.push({
          type: 'provincia',
          nombre: provincia.nombre
        });
      }
    });

    // Buscar en localidades
    allLocalidades.forEach(localidad => {
      if (normalizeText(localidad.nombre).includes(normalizedQuery)) {
        const provincia = PROVINCIAS.find(p => p.id === localidad.provinciaId);
        results.push({
          type: 'localidad',
          nombre: localidad.nombre,
          provincia: provincia?.nombre
        });
      }
    });

    // Limitar resultados y priorizar: primero provincias, luego localidades
    const provincias = results.filter(r => r.type === 'provincia').slice(0, 5);
    const localidades = results.filter(r => r.type === 'localidad').slice(0, 10);
    
    return [...provincias, ...localidades].slice(0, 10);
  }, [value, allLocalidades]);

  // Cerrar el dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll automático cuando se navega con teclado
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const highlightedElement = listRef.current.children[highlightedIndex] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth'
        });
      }
    }
  }, [highlightedIndex]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setIsOpen(true);
    setHighlightedIndex(-1);
  };

  const handleSelectLocation = (locationName: string) => {
    onChange(locationName);
    setIsOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen && filteredLocations.length > 0) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        setIsOpen(true);
      }
    }

    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredLocations.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : 0);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredLocations[highlightedIndex]) {
          handleSelectLocation(filteredLocations[highlightedIndex].nombre);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  // Resaltar el texto que coincide con la búsqueda
  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return <span>{text}</span>;
    
    const normalizedQuery = normalizeText(query);
    const normalizedText = normalizeText(text);
    
    const matchIndex = normalizedText.indexOf(normalizedQuery);
    
    if (matchIndex === -1) return <span>{text}</span>;
    
    const beforeMatch = text.substring(0, matchIndex);
    const matchedText = text.substring(matchIndex, matchIndex + query.length);
    const afterMatch = text.substring(matchIndex + query.length);
    
    return (
      <span>
        {beforeMatch}<strong style={{ 
          color: COLORS.PRIMARY_MEDIUM,
          fontWeight: '700'
        }}>{matchedText}</strong>{afterMatch}
      </span>
    );
  };

  return (
    <div ref={wrapperRef} style={{ position: 'relative', width: '100%' }} className={className}>
      <div style={{ position: 'relative' }}>
        <MapPin 
          size={20}
          style={{
            position: 'absolute',
            left: '0.75rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#9ca3af',
            pointerEvents: 'none',
            zIndex: 1
          }}
        />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          style={{
            width: '100%',
            padding: '0.75rem 1rem 0.75rem 2.5rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            outline: 'none',
            transition: 'all 0.2s',
            backgroundColor: '#fff',
            color: '#111827'
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = COLORS.PRIMARY_MEDIUM;
            e.currentTarget.style.boxShadow = `0 0 0 3px ${COLORS.PRIMARY_MEDIUM}20`;
            if (value.trim()) setIsOpen(true);
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = '#d1d5db';
            e.currentTarget.style.boxShadow = 'none';
          }}
        />
      </div>

      {/* Dropdown de sugerencias */}
      {isOpen && filteredLocations.length > 0 && (
        <ul
          ref={listRef}
          style={{
            position: 'absolute',
            top: 'calc(100% + 0.5rem)',
            left: 0,
            right: 0,
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
            maxHeight: '320px',
            overflowY: 'auto',
            zIndex: 50,
            margin: 0,
            padding: '0.5rem 0',
            listStyle: 'none'
          }}
        >
          {filteredLocations.map((location, index) => (
            <li
              key={`${location.type}-${location.nombre}-${index}`}
              onClick={() => handleSelectLocation(location.nombre)}
              onMouseEnter={() => setHighlightedIndex(index)}
              style={{
                padding: '0.75rem 1rem',
                cursor: 'pointer',
                transition: 'all 0.15s',
                backgroundColor: highlightedIndex === index ? COLORS.PRIMARY_CYAN : 'transparent',
                fontSize: '0.95rem',
                color: '#374151'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin 
                  size={16} 
                  style={{ 
                    color: highlightedIndex === index ? COLORS.PRIMARY_MEDIUM : '#9ca3af',
                    flexShrink: 0
                  }} 
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: location.type === 'provincia' ? '600' : '400' }}>
                    {highlightMatch(location.nombre, value)}
                  </div>
                  {location.type === 'localidad' && location.provincia && (
                    <div style={{ 
                      fontSize: '0.8rem', 
                      color: '#6b7280',
                      marginTop: '0.125rem'
                    }}>
                      {location.provincia}
                    </div>
                  )}
                </div>
                {location.type === 'provincia' && (
                  <span style={{
                    fontSize: '0.7rem',
                    padding: '0.125rem 0.5rem',
                    backgroundColor: '#dbeafe',
                    color: COLORS.PRIMARY_MEDIUM,
                    borderRadius: '0.25rem',
                    fontWeight: '600',
                    flexShrink: 0
                  }}>
                    Provincia
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Mensaje cuando no hay resultados */}
      {isOpen && value.trim() && filteredLocations.length === 0 && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 0.5rem)',
            left: 0,
            right: 0,
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
            zIndex: 50,
            padding: '1rem',
            textAlign: 'center',
            color: '#6b7280',
            fontSize: '0.9rem'
          }}
        >
          No se encontraron ubicaciones que coincidan con "{value}"
        </div>
      )}
    </div>
  );
};

export default LocationAutocomplete;

