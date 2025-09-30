import React from 'react';
import { twMerge } from 'tailwind-merge';
import type { ButtonProps, ButtonVariant } from '../../types/Button';
import { COLORS } from '../../const/colors';

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'default',
  className = '',
  disabled,
  type = 'button',
}) => {
  const isDisabled = variant === 'disabled' || disabled;
  
  // Configuración usando colores de MediTurnos + Tailwind CSS
  const getVariantStyles = (variant: ButtonVariant) => {
    const baseClasses = 'px-4 py-2 rounded-lg font-semibold transition-all duration-200 ease-in-out cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    switch (variant) {
      case 'default':
        return {
          className: `${baseClasses} text-white hover:shadow-lg transform hover:scale-105 focus:ring-blue-500`,
          style: {
            backgroundColor: COLORS.PRIMARY_MEDIUM,
          },
          hoverStyle: {
            backgroundColor: COLORS.PRIMARY_DARK,
          }
        };
        
      case 'outline':
        return {
          className: `${baseClasses} bg-transparent border-2 hover:shadow-md transform hover:scale-105 focus:ring-blue-500`,
          style: {
            borderColor: COLORS.PRIMARY_MEDIUM,
            color: COLORS.PRIMARY_MEDIUM,
          },
          hoverStyle: {
            backgroundColor: COLORS.PRIMARY_MEDIUM,
            color: COLORS.WHITE,
          }
        };
        
      case 'light':
        return {
          className: `${baseClasses} border hover:shadow-md transform hover:scale-105 focus:ring-blue-500`,
          style: {
            backgroundColor: COLORS.WHITE,
            color: COLORS.PRIMARY_MEDIUM,
            borderColor: '#e5e7eb',
          },
          hoverStyle: {
            backgroundColor: COLORS.PRIMARY_LIGHT,
            color: COLORS.WHITE,
          }
        };
        
      case 'dark':
        return {
          className: `${baseClasses} text-white hover:shadow-lg transform hover:scale-105 focus:ring-gray-500`,
          style: {
            backgroundColor: COLORS.NAVY_DARK,
          },
          hoverStyle: {
            backgroundColor: COLORS.DARK_SLATE,
          }
        };
        
      case 'ghost':
        return {
          className: `${baseClasses} bg-transparent hover:shadow-sm transform hover:scale-105 focus:ring-gray-500`,
          style: {
            color: COLORS.DARK_SLATE,
          },
          hoverStyle: {
            backgroundColor: '#f3f4f6',
          }
        };
        
      case 'danger':
        return {
          className: `${baseClasses} bg-red-500 text-white hover:bg-red-600 hover:shadow-lg transform hover:scale-105 focus:ring-red-500`,
          style: {},
          hoverStyle: {}
        };
        
      case 'disabled':
        return {
          className: `${baseClasses} bg-gray-300 text-gray-500 cursor-not-allowed opacity-50`,
          style: {},
          hoverStyle: {}
        };
        
      default:
        return {
          className: `${baseClasses} text-white hover:shadow-lg transform hover:scale-105 focus:ring-blue-500`,
          style: {
            backgroundColor: COLORS.PRIMARY_MEDIUM,
          },
          hoverStyle: {
            backgroundColor: COLORS.PRIMARY_DARK,
          }
        };
    }
  };

  const variantConfig = getVariantStyles(variant);
  const mergedClassName = twMerge(variantConfig.className, className);

  return (
    <button 
      onClick={onClick} 
      disabled={isDisabled} 
      className={mergedClassName}
      style={variantConfig.style}
      type={type}
      onMouseEnter={(e) => {
        if (!isDisabled && Object.keys(variantConfig.hoverStyle).length > 0) {
          Object.assign(e.currentTarget.style, variantConfig.hoverStyle);
        }
      }}
      onMouseLeave={(e) => {
        if (!isDisabled) {
          Object.assign(e.currentTarget.style, variantConfig.style);
        }
      }}
    >
      {children}
    </button>
  );
};

export default Button;