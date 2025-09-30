export interface BackButtonProps {
  /** Función personalizada de navegación. Si no se proporciona, navega a la página anterior */
  onClick?: () => void;
  /** Texto adicional para mostrar junto al icono */
  label?: string;
  /** Clases CSS adicionales */
  className?: string;
  /** Color del icono y texto */
  color?: string;
  /** Tamaño del icono */
  size?: 'sm' | 'md' | 'lg';
}
