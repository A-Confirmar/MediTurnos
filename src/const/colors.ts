/**
 * Paleta de colores para MediTurnos
 * Colores principales del dominio para mantener consistencia en toda la aplicación
 */

export const COLORS = {
  // Colores principales
  PRIMARY_DARK: '#072769',      // Azul principal oscuro - para headers y elementos importantes
  PRIMARY_MEDIUM: '#075ba4',    // Azul principal medio - para botones principales
  PRIMARY_LIGHT: '#5080fd',     // Azul principal claro - para enlaces y acentos
  PRIMARY_CYAN: '#3dbdec',      // Azul cyan - para elementos destacados y notificaciones
  
  // Colores neutros
  BLACK: '#000000',             // Negro puro - para texto principal
  WHITE: '#ffffff',             // Blanco puro - para fondos y texto sobre colores oscuros
  DARK_SLATE: '#121c22',        // Gris muy oscuro - para texto secundario y bordes
  NAVY_DARK: '#1f2b5b',         // Azul marino oscuro - para elementos de navegación
} as const;

// Alias para facilitar el uso
export const THEME_COLORS = {
  primary: COLORS.PRIMARY_MEDIUM,
  primaryDark: COLORS.PRIMARY_DARK,
  primaryLight: COLORS.PRIMARY_LIGHT,
  accent: COLORS.PRIMARY_CYAN,
  text: COLORS.BLACK,
  textSecondary: COLORS.DARK_SLATE,
  background: COLORS.WHITE,
  surface: COLORS.WHITE,
  navy: COLORS.NAVY_DARK,
} as const;

// Para usar con Tailwind CSS (configuración futura)
export const TAILWIND_COLORS = {
  'primary-dark': COLORS.PRIMARY_DARK,
  'primary-medium': COLORS.PRIMARY_MEDIUM,
  'primary-light': COLORS.PRIMARY_LIGHT,
  'primary-cyan': COLORS.PRIMARY_CYAN,
  'dark-slate': COLORS.DARK_SLATE,
  'navy-dark': COLORS.NAVY_DARK,
} as const;
