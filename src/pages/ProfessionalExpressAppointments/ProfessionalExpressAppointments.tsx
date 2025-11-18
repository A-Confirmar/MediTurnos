import React, { useState } from 'react';
import { Zap, User, Mail, Phone, Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import { COLORS } from '../../const/colors';
import { useGetTurnosExpressPendientes } from '../../services/appointments/useGetTurnosExpressPendientes';
import ExpressAppointmentResponseModal from '../../components/ExpressAppointmentResponseModal/ExpressAppointmentResponseModal';
import type { TurnoExpressPendiente } from '../../services/appointments/useGetTurnosExpressPendientes';

const ProfessionalExpressAppointments: React.FC = () => {
  const [selectedAppointment, setSelectedAppointment] = useState<TurnoExpressPendiente | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [processedTurnos, setProcessedTurnos] = useState<Set<number>>(new Set());

  const { data: turnosExpress, isLoading, error, refetch } = useGetTurnosExpressPendientes();

  const handleResponder = (turno: TurnoExpressPendiente) => {
    setSelectedAppointment(turno);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
  };

  const handleSuccess = () => {
    // Marcar este turno como procesado
    if (selectedAppointment) {
      setProcessedTurnos(prev => new Set([...prev, selectedAppointment.turnoId]));
    }
    // Refetch para actualizar la lista desde el backend
    refetch();
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
          <Zap size={32} color="#f59e0b" />
          <h1 style={{
            margin: 0,
            fontSize: '2rem',
            fontWeight: '700',
            color: COLORS.PRIMARY_DARK
          }}>
            Solicitudes de Turnos Express
          </h1>
        </div>
        <p style={{
          margin: 0,
          fontSize: '1rem',
          color: '#6b7280'
        }}>
          Gestiona las solicitudes urgentes de tus pacientes
        </p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          backgroundColor: COLORS.WHITE,
          borderRadius: '12px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: `4px solid ${COLORS.PRIMARY_CYAN}`,
            borderTopColor: COLORS.PRIMARY_MEDIUM,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }} />
          <p style={{
            margin: 0,
            fontSize: '1.1rem',
            fontWeight: '600',
            color: COLORS.PRIMARY_DARK
          }}>
            Cargando solicitudes...
          </p>
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div style={{
          padding: '2rem',
          backgroundColor: '#fef2f2',
          borderRadius: '12px',
          border: '2px solid #fca5a5',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          color: '#dc2626'
        }}>
          <AlertCircle size={32} />
          <div>
            <p style={{ margin: 0, fontWeight: '600', fontSize: '1.1rem' }}>
              Error al cargar solicitudes
            </p>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.95rem' }}>
              {error instanceof Error ? error.message : 'Por favor, intenta nuevamente'}
            </p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && turnosExpress?.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          backgroundColor: COLORS.WHITE,
          borderRadius: '12px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <CheckCircle size={64} style={{ color: '#10b981', margin: '0 auto 1rem' }} />
          <h3 style={{
            margin: '0 0 0.5rem 0',
            fontSize: '1.5rem',
            fontWeight: '600',
            color: COLORS.PRIMARY_DARK
          }}>
            No hay solicitudes pendientes
          </h3>
          <p style={{
            margin: 0,
            fontSize: '1rem',
            color: '#6b7280'
          }}>
            Cuando recibas una solicitud de turno express, aparecerá aquí
          </p>
        </div>
      )}

      {/* Lista de Solicitudes */}
      {!isLoading && !error && turnosExpress && turnosExpress.length > 0 && (
        <div style={{
          display: 'grid',
          gap: '1rem'
        }}>
          {turnosExpress.map((turno) => {
            const isProcessed = processedTurnos.has(turno.turnoId);
            
            return (
            <div
              key={turno.turnoId}
              style={{
                backgroundColor: COLORS.WHITE,
                borderRadius: '12px',
                padding: '1.25rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                borderLeft: `4px solid ${isProcessed ? '#10b981' : '#f59e0b'}`,
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1.5rem',
                flexWrap: 'wrap',
                opacity: isProcessed ? 0.7 : 1
              }}
            >
              {/* Información del paciente */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1rem'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: '#dbeafe',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <User size={24} color={COLORS.PRIMARY_MEDIUM} />
                </div>
                
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.25rem'
                  }}>
                    <h3 style={{
                      margin: 0,
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      color: COLORS.PRIMARY_DARK
                    }}>
                      {turno.nombrePaciente || turno.nombre_paciente || 'Paciente'} {turno.apellidoPaciente || turno.apellido_paciente || 'Ejemplar'}
                    </h3>
                    <span style={{
                      padding: '0.125rem 0.5rem',
                      backgroundColor: isProcessed ? '#d1fae5' : '#fef3c7',
                      color: isProcessed ? '#065f46' : '#92400e',
                      borderRadius: '6px',
                      fontSize: '0.7rem',
                      fontWeight: '600',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}>
                      {isProcessed ? (
                        <>
                          <CheckCircle size={10} />
                          PROPUESTA ENVIADA
                        </>
                      ) : (
                        <>
                          <Zap size={10} />
                          URGENTE
                        </>
                      )}
                    </span>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                    fontSize: '0.875rem',
                    color: '#6b7280'
                  }}>
                    {(turno.emailPaciente || turno.email_paciente) && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Mail size={14} />
                        <span>{turno.emailPaciente || turno.email_paciente}</span>
                      </div>
                    )}
                    {(turno.telefonoPaciente || turno.telefono_paciente) && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Phone size={14} />
                        <span>{turno.telefonoPaciente || turno.telefono_paciente}</span>
                      </div>
                    )}
                    {turno.createdAt && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Calendar size={14} />
                        <span>
                          {new Date(turno.createdAt).toLocaleDateString('es-AR', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Botón de responder */}
              <button
                onClick={() => !isProcessed && handleResponder(turno)}
                disabled={isProcessed}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: isProcessed ? '#9ca3af' : '#f59e0b',
                  color: COLORS.WHITE,
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  cursor: isProcessed ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'background-color 0.2s',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  opacity: isProcessed ? 0.6 : 1
                }}
                onMouseEnter={(e) => !isProcessed && (e.currentTarget.style.backgroundColor = '#d97706')}
                onMouseLeave={(e) => !isProcessed && (e.currentTarget.style.backgroundColor = '#f59e0b')}
              >
                {isProcessed ? (
                  <>
                    <CheckCircle size={18} />
                    Respondido
                  </>
                ) : (
                  <>
                    <Zap size={18} />
                    Responder
                  </>
                )}
              </button>
            </div>
            );
          })}
        </div>
      )}

      {/* Modal de respuesta */}
      <ExpressAppointmentResponseModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        appointment={selectedAppointment}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default ProfessionalExpressAppointments;

