/**
 * Constantes de rutas para la aplicación MediTurnos
 */

export const ROUTES = {
  // Rutas públicas
  home: '/',
  login: '/login',
  roleSelection: '/role-selection',
  register: '/register',
  recoverPassword: '/recover-password',
  changePassword: '/cambiarClave',
  
  // Rutas protegidas
  dashboard: '/dashboard',
  appointments: '/appointments',
  patients: '/patients',
  doctors: '/doctors',
  profile: '/profile',
  settings: '/settings',
  
  // Rutas de pacientes
  myAppointments: '/mis-turnos',
  askSpecialist: '/pregunta-especialista',
  accountSettings: '/configuracion-cuenta',
  
  // Rutas de administración
  admin: '/admin',
  adminUsers: '/admin/users',
  adminReports: '/admin/reports',
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RouteValue = typeof ROUTES[RouteKey];
