/**
 * Tipos para Historia Clínica
 */

export interface MedicalHistory {
  ID?: number;
  historialID?: number;
  paciente_ID?: number;
  paciente_email?: string;
  pacienteMail?: string;
  profesional_email?: string;
  profesional_ID?: string;
  fecha_ultima_actualizacion?: string;
  diagnostico: string;
  tratamiento: string;
  evolucion?: string | null;
}

export interface CreateMedicalHistoryRequest {
  pacienteMail: string;
  diagnostico: string;
  tratamiento: string;
  evolucion?: string | null;
}

export interface UpdateMedicalHistoryRequest {
  pacienteMail: string;
  diagnostico?: string;
  tratamiento?: string;
  evolucion?: string;
}

export interface DeleteMedicalHistoryRequest {
  historialID: number;
}

export interface MedicalHistoryResponse {
  message: string;
  result: boolean;
  historial?: MedicalHistory;
}

export interface GetMedicalHistoriesResponse {
  message: string;
  result: boolean;
  historiales?: MedicalHistory[];
}

export interface GetPatientHistoryResponse {
  message: string;
  result: boolean;
  historial?: MedicalHistory;
}

