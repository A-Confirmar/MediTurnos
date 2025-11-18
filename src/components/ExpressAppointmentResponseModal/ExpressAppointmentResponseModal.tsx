import React, { useState, useEffect } from 'react';
import { X, Calendar, DollarSign, AlertCircle, CheckCircle } from 'lucide-react';
import { COLORS } from '../../const/colors';
import { useAceptarTurnoExpress } from '../../services/appointments/useAceptarTurnoExpress';
import type { TurnoExpressPendiente } from '../../services/appointments/useGetTurnosExpressPendientes';

interface ExpressAppointmentResponseModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: TurnoExpressPendiente | null;
  onSuccess?: () => void;
}

/**
 * Obtiene la próxima hora entera disponible
 * Si son las 18:45, retorna "19:00"
 * Si son las 18:00, retorna "18:00"
 */
const getNextAvailableHour = (): string => {
  const now = new Date();
  const currentMinutes = now.getMinutes();
  
  // Si ya estamos en una hora exacta, usamos esa
  if (currentMinutes === 0) {
    const hours = now.getHours().toString().padStart(2, '0');
    return `${hours}:00`;
  }
  
  // Si no, avanzamos a la próxima hora
  const nextHour = (now.getHours() + 1) % 24;
  return `${nextHour.toString().padStart(2, '0')}:00`;
};

/**
 * Suma una hora a un tiempo dado en formato HH:mm
 */
const addOneHour = (time: string): string => {
  const [hours, minutes] = time.split(':').map(Number);
  const nextHour = (hours + 1) % 24;
  return `${nextHour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

const ExpressAppointmentResponseModal: React.FC<ExpressAppointmentResponseModalProps> = ({
  isOpen,
  onClose,
  appointment,
  onSuccess
}) => {
  const [fecha, setFecha] = useState('');
  const [inicio, setInicio] = useState('');
  const [fin, setFin] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const aceptarExpressMutation = useAceptarTurnoExpress();

  // Setear valores por defecto cuando se abre el modal
  useEffect(() => {
    if (isOpen && appointment) {
      // Fecha actual en formato YYYY-MM-DD
      const today = new Date().toISOString().split('T')[0];
      setFecha(today);
      
      // Próxima hora entera disponible
      const nextHour = getNextAvailableHour();
      setInicio(nextHour);
      
      // Una hora después
      const endHour = addOneHour(nextHour);
      setFin(endHour);
      
      // Limpiar estados
      setError('');
      setIsSuccess(false);
    }
  }, [isOpen, appointment]);

  if (!isOpen || !appointment) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (!fecha || !inicio || !fin) {
      setError('Todos los campos son obligatorios');
      return;
    }

    // Validar que la fecha no sea pasada
    // Comparar solo las fechas (YYYY-MM-DD) como strings para evitar problemas de zona horaria
    const today = new Date().toISOString().split('T')[0];
    
    if (fecha < today) {
      setError('La fecha no puede ser anterior a hoy');
      return;
    }

    // Validar que hora inicio sea menor que hora fin
    if (inicio >= fin) {
      setError('La hora de inicio debe ser menor a la hora de fin');
      return;
    }

    // Validar formato de horas (HH:mm)
    const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(inicio) || !timeRegex.test(fin)) {
      setError('Las horas deben estar en formato HH:mm (ej: 09:00)');
      return;
    }

    // Validar que sea en horario laboral razonable (7am - 10pm)
    const inicioHora = parseInt(inicio.split(':')[0]);
    const finHora = parseInt(fin.split(':')[0]);
    if (inicioHora < 7 || finHora > 22) {
      setError('El horario debe estar entre las 07:00 y las 22:00');
      return;
    }

    try {
      await aceptarExpressMutation.mutateAsync({
        token: appointment.token || '',
        turnoId: appointment.turnoId,
        fecha,
        inicio,
        fin
      });

      // Mostrar mensaje de éxito
      setIsSuccess(true);
      
      // Esperar 2 segundos antes de cerrar
      setTimeout(() => {
        // Limpiar formulario
        setFecha('');
        setInicio('');
        setFin('');
        setIsSuccess(false);
        
        if (onSuccess) onSuccess();
        onClose();
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al responder la solicitud');
    }
  };

  const handleClose = () => {
    setFecha('');
    setInicio('');
    setFin('');
    setError('');
    setIsSuccess(false);
    onClose();
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
            Responder Solicitud Express
          </h2>
          <button
            onClick={handleClose}
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

        {/* Vista de éxito */}
        {isSuccess ? (
          <div style={{
            textAlign: 'center',
            padding: '3rem 1rem'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: '#d1fae5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem'
            }}>
              <CheckCircle size={48} color="#10b981" />
            </div>
            <h3 style={{
              margin: '0 0 0.75rem 0',
              fontSize: '1.5rem',
              fontWeight: '700',
              color: COLORS.PRIMARY_DARK
            }}>
              ¡Propuesta Enviada!
            </h3>
            <p style={{
              margin: 0,
              fontSize: '1rem',
              color: '#6b7280',
              lineHeight: '1.5'
            }}>
              El paciente recibirá un correo con tu propuesta de turno.<br />
              Deberá confirmar para que se registre en tu agenda.
            </p>
          </div>
        ) : (
          <>
            {/* Información del paciente */}
        <div style={{
          backgroundColor: '#f3f4f6',
          borderRadius: '8px',
          padding: '1rem',
          marginBottom: '1.5rem'
        }}>
          <h3 style={{
            margin: '0 0 0.75rem 0',
            fontSize: '1rem',
            fontWeight: '600',
            color: COLORS.PRIMARY_DARK
          }}>
            Datos del Paciente
          </h3>
          <div style={{ fontSize: '0.95rem', color: '#4b5563' }}>
            <p style={{ margin: '0.25rem 0' }}>
              <strong>Nombre:</strong> {appointment.nombrePaciente || appointment.nombre_paciente || 'Paciente'} {appointment.apellidoPaciente || appointment.apellido_paciente || 'Ejemplar'}
            </p>
            {(appointment.emailPaciente || appointment.email_paciente) && (
              <p style={{ margin: '0.25rem 0' }}>
                <strong>Email:</strong> {appointment.emailPaciente || appointment.email_paciente}
              </p>
            )}
            {(appointment.telefonoPaciente || appointment.telefono_paciente) && (
              <p style={{ margin: '0.25rem 0' }}>
                <strong>Teléfono:</strong> {appointment.telefonoPaciente || appointment.telefono_paciente}
              </p>
            )}
            {appointment.createdAt && (
              <p style={{ margin: '0.25rem 0' }}>
                <strong>Solicitado:</strong> {new Date(appointment.createdAt).toLocaleDateString('es-AR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            )}
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          {/* Fecha */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.5rem',
              fontSize: '0.95rem',
              fontWeight: '600',
              color: COLORS.PRIMARY_DARK
            }}>
              <Calendar size={18} />
              Fecha del Turno
            </label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              required
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '0.95rem',
                color: '#1f2937',
                backgroundColor: COLORS.WHITE,
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Horario */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-end',
            gap: '0.75rem',
            marginBottom: '1.25rem'
          }}>
            <div style={{ flex: 1 }}>
              <label style={{
                display: 'block',
                fontSize: '0.85rem',
                color: '#6b7280',
                marginBottom: '0.25rem',
                fontWeight: '400'
              }}>
                Inicio
              </label>
              <input
                type="time"
                value={inicio}
                onChange={(e) => setInicio(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '0.95rem',
                  color: '#1f2937',
                  backgroundColor: COLORS.WHITE
                }}
              />
            </div>
            
            <div style={{ color: '#9ca3af', paddingBottom: '0.5rem' }}>—</div>
            
            <div style={{ flex: 1 }}>
              <label style={{
                display: 'block',
                fontSize: '0.85rem',
                color: '#6b7280',
                marginBottom: '0.25rem',
                fontWeight: '400'
              }}>
                Fin
              </label>
              <input
                type="time"
                value={fin}
                onChange={(e) => setFin(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '0.95rem',
                  color: '#1f2937',
                  backgroundColor: COLORS.WHITE
                }}
              />
            </div>
          </div>

          {/* Información sobre el costo */}
          <div style={{
            backgroundColor: '#dbeafe',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1.5rem',
            display: 'flex',
            gap: '0.75rem'
          }}>
            <DollarSign size={20} color={COLORS.PRIMARY_MEDIUM} style={{ flexShrink: 0 }} />
            <p style={{
              margin: 0,
              fontSize: '0.9rem',
              color: COLORS.PRIMARY_DARK,
              lineHeight: '1.5'
            }}>
              El costo del turno express será enviado al paciente según tu tarifa configurada en tu perfil.
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
              onClick={handleClose}
              style={{
                flex: 1,
                padding: '0.75rem',
                backgroundColor: '#f3f4f6',
                color: '#4b5563',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.95rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={aceptarExpressMutation.isPending}
              style={{
                flex: 1,
                padding: '0.75rem',
                backgroundColor: COLORS.PRIMARY_MEDIUM,
                color: COLORS.WHITE,
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.95rem',
                fontWeight: '600',
                cursor: aceptarExpressMutation.isPending ? 'not-allowed' : 'pointer',
                opacity: aceptarExpressMutation.isPending ? 0.6 : 1
              }}
            >
              {aceptarExpressMutation.isPending ? 'Enviando...' : 'Enviar Propuesta'}
            </button>
          </div>
        </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ExpressAppointmentResponseModal;

