import React, { useState, useRef, useEffect } from 'react';
import { Stethoscope } from 'lucide-react';
import { ESPECIALIDADES } from '../../const/especialidades';
import { COLORS } from '../../const/colors';

interface SpecialtyAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const SpecialtyAutocomplete: React.FC<SpecialtyAutocompleteProps> = ({
  value,
  onChange,
  placeholder = "ej. Cardiología",
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Función para normalizar texto (remover acentos y convertir a minúsculas)
  const normalizeText = (text: string) => {
    return text
      .normalize('NFD') // Descomponer caracteres acentuados
      .replace(/[\u0300-\u036f]/g, '') // Remover marcas diacríticas
      .toLowerCase();
  };

  // Filtrar especialidades basado en el input (ignorando acentos y mayúsculas)
  const filteredSpecialties = value.trim()
    ? ESPECIALIDADES.filter(specialty =>
        normalizeText(specialty).includes(normalizeText(value))
      ).slice(0, 10) // Limitar a 10 resultados
    : [];

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

  const handleSelectSpecialty = (specialty: string) => {
    onChange(specialty);
    setIsOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen && filteredSpecialties.length > 0) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        setIsOpen(true);
      }
    }

    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredSpecialties.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : 0);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredSpecialties[highlightedIndex]) {
          handleSelectSpecialty(filteredSpecialties[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  // Resaltar el texto que coincide con la búsqueda (ignorando acentos y mayúsculas)
  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return <span>{text}</span>;
    
    // Normalizar query para búsqueda
    const normalizedQuery = normalizeText(query);
    const normalizedText = normalizeText(text);
    
    // Encontrar la posición de la coincidencia en el texto normalizado
    const matchIndex = normalizedText.indexOf(normalizedQuery);
    
    if (matchIndex === -1) return <span>{text}</span>;
    
    // Extraer las partes del texto original (con acentos)
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
        <Stethoscope 
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
      {isOpen && filteredSpecialties.length > 0 && (
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
            maxHeight: '300px',
            overflowY: 'auto',
            zIndex: 50,
            margin: 0,
            padding: '0.5rem 0',
            listStyle: 'none'
          }}
        >
          {filteredSpecialties.map((specialty, index) => (
            <li
              key={specialty}
              onClick={() => handleSelectSpecialty(specialty)}
              onMouseEnter={() => setHighlightedIndex(index)}
              style={{
                padding: '0.75rem 1rem',
                cursor: 'pointer',
                transition: 'all 0.15s',
                backgroundColor: highlightedIndex === index ? COLORS.PRIMARY_CYAN : 'transparent',
                fontSize: '0.95rem',
                color: '#374151',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Stethoscope 
                size={16} 
                style={{ 
                  color: highlightedIndex === index ? COLORS.PRIMARY_MEDIUM : '#9ca3af',
                  flexShrink: 0
                }} 
              />
              {highlightMatch(specialty, value)}
            </li>
          ))}
        </ul>
      )}

      {/* Mensaje cuando no hay resultados */}
      {isOpen && value.trim() && filteredSpecialties.length === 0 && (
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
          No se encontraron especialidades que coincidan con "{value}"
        </div>
      )}
    </div>
  );
};

export default SpecialtyAutocomplete;

