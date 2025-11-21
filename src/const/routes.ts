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
  searchProfessionals: '/buscar-profesionales',
  myAppointments: '/mis-turnos',
  bookAppointment: '/reservar-turno',
  accountSettings: '/configuracion-cuenta',
  
  // Rutas de profesionales
  professionalDashboard: '/profesional/dashboard',
  professionalCalendar: '/profesional/agenda',
  professionalAppointments: '/profesional/turnos',
  professionalExpressAppointments: '/profesional/turnos-express',
  professionalPatients: '/profesional/pacientes',
  professionalPatientHistory: '/profesional/historia-clinica',
  professionalMessages: '/profesional/mensajes',
  professionalStatistics: '/profesional/estadisticas',
  professionalProfile: '/profesional/perfil',
  professionalSettings: '/profesional/configuracion',
  professionalAvailability: '/profesional/disponibilidad',
  
  // Rutas de administración
  admin: '/admin',
  adminUsers: '/admin/users',
  adminReports: '/admin/reports',
  adminReviewModeration: '/admin/moderacion-resenias',
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RouteValue = typeof ROUTES[RouteKey];
