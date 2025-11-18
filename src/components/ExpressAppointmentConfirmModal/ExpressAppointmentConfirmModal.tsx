import React, { useState } from 'react';
import { X, Calendar, Clock, DollarSign, User, AlertCircle, CheckCircle } from 'lucide-react';
import { COLORS } from '../../const/colors';
import { useConfirmarTurnoExpress } from '../../services/appointments/useConfirmarTurnoExpress';
import { useCancelAppointment } from '../../services/appointments/useDeleteAppointment';
import { getAccessToken } from '../../services/localstorage';

interface ExpressAppointmentData {
  id: number;
  nombreProfesional?: string;
  apellidoProfesional?: string;
  especialidad?: string;
  fecha?: string;
  inicio?: string;
  fin?: string;
  costo?: number;
  estado: string;
}

interface ExpressAppointmentConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: ExpressAppointmentData | null;
  onSuccess?: () => void;
}

const ExpressAppointmentConfirmModal: React.FC<ExpressAppointmentConfirmModalProps> = ({
  isOpen,
  onClose,
  appointment,
  onSuccess
}) => {
  const [error, setError] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);

  const confirmarExpressMutation = useConfirmarTurnoExpress();
  const rechazarMutation = useCancelAppointment();

  if (!isOpen || !appointment) return null;

  const handleConfirmar = async () => {
    setError('');
    setIsConfirming(true);

    try {
      await confirmarExpressMutation.mutateAsync({
        turnoId: appointment.id
      });

      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al confirmar el turno');
    } finally {
      setIsConfirming(false);
    }
  };

  const handleRechazar = async () => {
    setError('');

    if (!window.confirm('¿Estás seguro de rechazar esta propuesta de turno express?')) {
      return;
    }

    try {
      const token = await getAccessToken();
      if (!token) {
        setError('No se encontró token de autenticación');
        return;
      }

      await rechazarMutation.mutateAsync({
        token,
        turnoId: appointment.id
      });

      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al rechazar el turno');
    }
  };

  const formatDate = (dateString: string) => {
    // El formato viene como DD-MM-YYYY (ej: "18-11-2025")
    const [day, month, year] = dateString.split('-');
    
    // Crear fecha en formato que JavaScript entiende (YYYY, MM-1, DD)
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    
    return date.toLocaleDateString('es-AR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (time: string) => {
    // Si viene con segundos (HH:MM:SS), tomar solo HH:MM
    return time.substring(0, 5);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: COLORS.WHITE,
        borderRadius: '12px',
        padding: '2rem',
        maxWidth: '500px',
        width: '100%',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem'
        }}>
          <h2 style={{
            margin: 0,
            fontSize: '1.5rem',
            fontWeight: '700',
            color: COLORS.PRIMARY_DARK
          }}>
            Confirmar Turno Express
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              color: '#6b7280'
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Información destacada */}
        <div style={{
          backgroundColor: '#fef3c7',
          border: '2px solid #fbbf24',
          borderRadius: '8px',
          padding: '1rem',
          marginBottom: '1.5rem',
          textAlign: 'center'
        }}>
          <CheckCircle size={40} style={{ color: '#f59e0b', margin: '0 auto 0.5rem' }} />
          <p style={{
            margin: 0,
            fontSize: '1rem',
            fontWeight: '600',
            color: '#92400e'
          }}>
            ¡El profesional ha respondido tu solicitud!
          </p>
        </div>

        {/* Información del profesional */}
        <div style={{
          backgroundColor: '#f3f4f6',
          borderRadius: '8px',
          padding: '1.25rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              backgroundColor: '#e0e7ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #c7d2fe'
            }}>
              <User size={26} color="#6366f1" />
            </div>
            <div>
              <h3 style={{
                margin: 0,
                fontSize: '1.1rem',
                fontWeight: '700',
                color: COLORS.PRIMARY_DARK
              }}>
                {appointment.nombreProfesional} {appointment.apellidoProfesional}
              </h3>
              {appointment.especialidad && (
                <p style={{
                  margin: '0.25rem 0 0 0',
                  fontSize: '0.9rem',
                  color: COLORS.PRIMARY_MEDIUM,
                  fontWeight: '600'
                }}>
                  {appointment.especialidad}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Detalles del turno */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{
            margin: '0 0 1rem 0',
            fontSize: '1.1rem',
            fontWeight: '600',
            color: COLORS.PRIMARY_DARK
          }}>
            Detalles del Turno Propuesto
          </h3>

          {/* Fecha */}
          {appointment.fecha && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.875rem',
              backgroundColor: COLORS.WHITE,
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              marginBottom: '0.75rem'
            }}>
              <Calendar size={20} color={COLORS.PRIMARY_MEDIUM} />
              <div>
                <p style={{
                  margin: 0,
                  fontSize: '0.85rem',
                  color: '#6b7280',
                  fontWeight: '500'
                }}>
                  Fecha
                </p>
                <p style={{
                  margin: '0.15rem 0 0 0',
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: COLORS.PRIMARY_DARK,
                  textTransform: 'capitalize'
                }}>
                  {formatDate(appointment.fecha)}
                </p>
              </div>
            </div>
          )}

          {/* Horario */}
          {appointment.inicio && appointment.fin && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.875rem',
              backgroundColor: COLORS.WHITE,
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              marginBottom: '0.75rem'
            }}>
              <Clock size={20} color={COLORS.PRIMARY_MEDIUM} />
              <div>
                <p style={{
                  margin: 0,
                  fontSize: '0.85rem',
                  color: '#6b7280',
                  fontWeight: '500'
                }}>
                  Horario
                </p>
                <p style={{
                  margin: '0.15rem 0 0 0',
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: COLORS.PRIMARY_DARK
                }}>
                  {formatTime(appointment.inicio)} - {formatTime(appointment.fin)}
                </p>
              </div>
            </div>
          )}

          {/* Costo */}
          {appointment.costo != null && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.875rem',
              backgroundColor: '#dcfce7',
              border: '2px solid #86efac',
              borderRadius: '8px'
            }}>
              <DollarSign size={20} color="#16a34a" />
              <div>
                <p style={{
                  margin: 0,
                  fontSize: '0.85rem',
                  color: '#15803d',
                  fontWeight: '500'
                }}>
                  Costo
                </p>
                <p style={{
                  margin: '0.15rem 0 0 0',
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  color: '#15803d'
                }}>
                  ${appointment.costo.toLocaleString('es-AR')}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Información importante */}
        <div style={{
          backgroundColor: '#dbeafe',
          borderRadius: '8px',
          padding: '1rem',
          marginBottom: '1.5rem',
          display: 'flex',
          gap: '0.75rem'
        }}>
          <AlertCircle size={20} color={COLORS.PRIMARY_MEDIUM} style={{ flexShrink: 0, marginTop: '0.15rem' }} />
          <p style={{
            margin: 0,
            fontSize: '0.9rem',
            color: COLORS.PRIMARY_DARK,
            lineHeight: '1.5'
          }}>
            Al confirmar, el turno quedará agendado y se generará el pago pendiente. Recibirás un recordatorio antes de la consulta.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            backgroundColor: '#fef2f2',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1.5rem',
            display: 'flex',
            gap: '0.75rem',
            border: '1px solid #fca5a5'
          }}>
            <AlertCircle size={20} color="#dc2626" style={{ flexShrink: 0 }} />
            <p style={{
              margin: 0,
              fontSize: '0.9rem',
              color: '#dc2626'
            }}>
              {error}
            </p>
          </div>
        )}

        {/* Botones */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginTop: '2rem'
        }}>
          <button
            type="button"
            onClick={handleRechazar}
            disabled={rechazarMutation.isPending || isConfirming}
            style={{
              flex: 1,
              padding: '0.875rem',
              backgroundColor: '#fef2f2',
              color: '#dc2626',
              border: '1px solid #fca5a5',
              borderRadius: '8px',
              fontSize: '0.95rem',
              fontWeight: '600',
              cursor: rechazarMutation.isPending || isConfirming ? 'not-allowed' : 'pointer',
              opacity: rechazarMutation.isPending || isConfirming ? 0.6 : 1
            }}
          >
            {rechazarMutation.isPending ? 'Rechazando...' : 'Rechazar'}
          </button>
          <button
            type="button"
            onClick={handleConfirmar}
            disabled={confirmarExpressMutation.isPending || rechazarMutation.isPending}
            style={{
              flex: 1,
              padding: '0.875rem',
              backgroundColor: '#16a34a',
              color: COLORS.WHITE,
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.95rem',
              fontWeight: '600',
              cursor: confirmarExpressMutation.isPending || rechazarMutation.isPending ? 'not-allowed' : 'pointer',
              opacity: confirmarExpressMutation.isPending || rechazarMutation.isPending ? 0.6 : 1
            }}
          >
            {confirmarExpressMutation.isPending ? 'Confirmando...' : 'Confirmar Turno'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpressAppointmentConfirmModal;

