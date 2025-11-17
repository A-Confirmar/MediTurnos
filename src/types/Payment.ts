/**
 * Tipos para sistema de pagos
 */

export interface Payment {
  id?: number;
  turno_ID: number;
  estado: 'pagado' | 'pendiente';
  fecha?: string;
  monto?: number;
}

export interface PatientPayment extends Payment {
  turnoId: number;
  nombreProfesional?: string;
  apellidoProfesional?: string;
  fechaTurno?: string;
  hora_inicio?: string;
  hora_fin?: string;
}

export interface ProfessionalPayment extends Payment {
  turnoId: number;
  nombrePaciente?: string;
  apellidoPaciente?: string;
  fechaTurno?: string;
  hora_inicio?: string;
  hora_fin?: string;
}

export interface GetPaymentsResponse {
  message: string;
  result: boolean;
  pagos?: PatientPayment[] | ProfessionalPayment[];
}

export interface MarkAsPaidRequest {
  turnoId: number;
}

export interface MarkAsPaidResponse {
  message: string;
  result: boolean;
}

