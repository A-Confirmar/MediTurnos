import React from 'react';
import { X, User, Mail, Calendar, Clock, FileText, DollarSign, Check } from 'lucide-react';
import { COLORS } from '../../const/colors';

interface AppointmentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: {
    turnoId: number;
    nombrePaciente: string;
    apellidoPaciente: string;
    emailPaciente?: string;
    fechaTurno: string;
    hora_inicio: string;
    hora_fin: string;
    estado: string;
    tipo: string;
  } | null;
  paymentStatus?: 'pagado' | 'pendiente' | null;
  onMarkAsPaid?: (turnoId: number) => void;
  isMarkingAsPaid?: boolean;
}

const AppointmentDetailsModal: React.FC<AppointmentDetailsModalProps> = ({
  isOpen,
  onClose,
  appointment,
  paymentStatus,
  onMarkAsPaid,
  isMarkingAsPaid
}) => {
  if (!isOpen || !appointment) return null;

  // Formatear fecha (el backend devuelve dd-mm-yyyy)
  const formatDate = (dateString: string) => {
    try {
      const [day, month, year] = dateString.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      return date.toLocaleDateString('es-ES', { 
        weekday: 'long', 
        day: 'numeric',
        month: 'long', 
        year: 'numeric' 
      });
    } catch {
      return dateString;
    }
  };

  // Color según el estado
  const getStatusColor = () => {
    switch (appointment.estado.toLowerCase()) {
      case 'confirmado':
        return { bg: '#d1fae5', color: '#065f46', text: 'Confirmado' };
      case 'pendiente':
        return { bg: '#fef3c7', color: '#92400e', text: 'Pendiente' };
      case 'realizado':
      case 'completado':
        return { bg: '#e0e7ff', color: '#3730a3', text: 'Realizado' };
      case 'cancelado':
        return { bg: '#fee2e2', color: '#991b1b', text: 'Cancelado' };
      default:
        return { bg: '#f3f4f6', color: '#1f2937', text: appointment.estado };
    }
  };

  const statusInfo = getStatusColor();

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          maxWidth: '500px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: COLORS.PRIMARY_LIGHT
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Calendar size={24} color={COLORS.PRIMARY_DARK} />
            <h2 style={{
              margin: 0,
              fontSize: '1.5rem',
              color: COLORS.PRIMARY_DARK,
              fontWeight: '600'
            }}>
              Detalle del Turno
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              color: '#6b7280',
              display: 'flex',
              alignItems: 'center',
              borderRadius: '6px',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '1.5rem' }}>
          {/* Estado */}
          <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
            <span style={{
              backgroundColor: statusInfo.bg,
              color: statusInfo.color,
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: '600',
              display: 'inline-block'
            }}>
              {statusInfo.text}
            </span>
          </div>

          {/* Información del Paciente */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '1rem',
              padding: '1rem',
              backgroundColor: '#f9fafb',
              borderRadius: '8px'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: COLORS.PRIMARY_CYAN,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <User size={24} color="white" />
              </div>
              <div>
                <p style={{
                  margin: 0,
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  fontWeight: '500'
                }}>
                  Paciente
                </p>
                <p style={{
                  margin: 0,
                  fontSize: '1.125rem',
                  color: '#111827',
                  fontWeight: '600'
                }}>
                  {appointment.nombrePaciente} {appointment.apellidoPaciente}
                </p>
              </div>
            </div>

            {/* Email (solo si existe) */}
            {appointment.emailPaciente && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem',
                borderBottom: '1px solid #e5e7eb'
              }}>
                <Mail size={18} color={COLORS.PRIMARY_CYAN} />
                <span style={{ fontSize: '0.95rem', color: '#4b5563' }}>
                  {appointment.emailPaciente}
                </span>
              </div>
            )}

            {/* Fecha */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <Calendar size={18} color={COLORS.PRIMARY_CYAN} />
              <div>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280' }}>
                  Fecha
                </p>
                <p style={{ margin: 0, fontSize: '0.95rem', color: '#111827', textTransform: 'capitalize' }}>
                  {formatDate(appointment.fechaTurno)}
                </p>
              </div>
            </div>

            {/* Horario */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <Clock size={18} color={COLORS.PRIMARY_CYAN} />
              <div>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280' }}>
                  Horario
                </p>
                <p style={{ margin: 0, fontSize: '0.95rem', color: '#111827', fontWeight: '500' }}>
                  {appointment.hora_inicio.substring(0, 5)} - {appointment.hora_fin.substring(0, 5)} hs
                </p>
              </div>
            </div>

            {/* Tipo de consulta */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.75rem',
              borderBottom: paymentStatus ? '1px solid #e5e7eb' : 'none'
            }}>
              <FileText size={18} color={COLORS.PRIMARY_CYAN} />
              <div>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280' }}>
                  Tipo de consulta
                </p>
                <p style={{ margin: 0, fontSize: '0.95rem', color: '#111827', textTransform: 'capitalize' }}>
                  {appointment.tipo}
                </p>
              </div>
            </div>

            {/* Estado de Pago */}
            {paymentStatus && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem'
              }}>
                <DollarSign size={18} color={COLORS.PRIMARY_CYAN} />
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280' }}>
                    Estado de Pago
                  </p>
                  <div style={{ 
                    marginTop: '0.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      backgroundColor: paymentStatus === 'pagado' ? '#d1fae5' : '#fef3c7',
                      color: paymentStatus === 'pagado' ? '#065f46' : '#92400e',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '12px',
                      fontSize: '0.875rem',
                      fontWeight: '600'
                    }}>
                      {paymentStatus === 'pagado' ? (
                        <>
                          <Check size={14} />
                          Pagado
                        </>
                      ) : (
                        <>
                          <DollarSign size={14} />
                          Pendiente
                        </>
                      )}
                    </span>
                  </div>
                </div>
                {/* Botón Marcar como Pagado */}
                {paymentStatus === 'pendiente' && onMarkAsPaid && (
                  <button
                    onClick={() => onMarkAsPaid(appointment.turnoId)}
                    disabled={isMarkingAsPaid}
                    style={{
                      backgroundColor: isMarkingAsPaid ? '#9ca3af' : '#10b981',
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '6px',
                      fontSize: '0.85rem',
                      fontWeight: '500',
                      cursor: isMarkingAsPaid ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      whiteSpace: 'nowrap',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      if (!isMarkingAsPaid) {
                        e.currentTarget.style.backgroundColor = '#059669';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isMarkingAsPaid) {
                        e.currentTarget.style.backgroundColor = '#10b981';
                      }
                    }}
                  >
                    <Check size={16} />
                    {isMarkingAsPaid ? 'Marcando...' : 'Marcar Pagado'}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* ID del Turno */}
          <div style={{
            backgroundColor: '#f9fafb',
            padding: '0.75rem',
            borderRadius: '6px',
            textAlign: 'center'
          }}>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280' }}>
              ID del Turno
            </p>
            <p style={{ margin: 0, fontSize: '0.875rem', color: '#111827', fontWeight: '600', fontFamily: 'monospace' }}>
              #{appointment.turnoId}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={onClose}
            style={{
              backgroundColor: COLORS.PRIMARY_MEDIUM,
              color: 'white',
              border: 'none',
              padding: '0.75rem 2rem',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = COLORS.PRIMARY_DARK;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = COLORS.PRIMARY_MEDIUM;
            }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetailsModal;
