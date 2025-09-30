import React from 'react';
import { useNavigate } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import { ChevronLeft } from 'lucide-react';
import type { BackButtonProps } from '../../types/BackButton';
import { COLORS } from '../../const/colors';

const BackButton: React.FC<BackButtonProps> = ({
  onClick,
  label = '',
  className = '',
  color = COLORS.PRIMARY_MEDIUM,
  size = 'md'
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(-1); // Navegar hacia atrás en el historial
    }
  };

  // Configuración de tamaños
  const getSizeConfig = (size: 'sm' | 'md' | 'lg') => {
    switch (size) {
      case 'sm':
        return {
          container: 'p-1',
          icon: 'w-4 h-4',
          text: 'text-sm'
        };
      case 'lg':
        return {
          container: 'p-3',
          icon: 'w-7 h-7',
          text: 'text-lg'
        };
      default: // md
        return {
          container: 'p-2',
          icon: 'w-5 h-5',
          text: 'text-base'
        };
    }
  };

  const sizeConfig = getSizeConfig(size);
  
  // Determinar si el color es claro (como blanco) para ajustar el hover
  const isLightColor = color === COLORS.WHITE || color === '#ffffff' || color === '#fff';
  
  const containerClasses = twMerge(
    'inline-flex items-center gap-2 cursor-pointer transition-all duration-200 ease-in-out rounded-lg',
    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
    // Hover diferente según el color
    isLightColor ? 'hover:bg-black hover:bg-opacity-10' : 'hover:bg-gray-100',
    sizeConfig.container,
    className
  );

  return (
    <button
      onClick={handleClick}
      className={containerClasses}
      aria-label={label || 'Volver atrás'}
    >
      {/* Icono de chevron hacia la izquierda con Lucide */}
      <ChevronLeft
        className={twMerge('transition-transform duration-200 hover:scale-110', sizeConfig.icon)}
        style={{ color }}
      />
      
      {/* Texto opcional */}
      {label && (
        <span
          className={twMerge('font-medium', sizeConfig.text)}
          style={{ color }}
        >
          {label}
        </span>
      )}
    </button>
  );
};

export default BackButton;
