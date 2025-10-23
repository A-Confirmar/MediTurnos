import React, { useMemo, useState } from 'react';
import { Calendar, Clock, User, FileText, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { COLORS } from '../../const/colors';
import { useGetProfessionalAppointments } from '../../services/appointments/useGetProfessionalAppointments';
import AppointmentDetailsModal from '../../components/AppointmentDetailsModal/AppointmentDetailsModal';
import type { ProfessionalAppointment } from '../../services/appointments/useGetProfessionalAppointments';

const ProfessionalAppointments: React.FC = () => {
  const { data: appointmentsData, isLoading } = useGetProfessionalAppointments();
  const [selectedAppointment, setSelectedAppointment] = useState<ProfessionalAppointment | null>(null);

  // Organizar turnos por estado
  const appointmentsByStatus = useMemo(() => {
    const appointments = appointmentsData?.turnos || [];
    
    return {
      confirmado: appointments.filter(apt => apt.estado.toLowerCase() === 'confirmado'),
      realizado: appointments.filter(apt => {
        const state = apt.estado.toLowerCase();
        return state === 'realizado' || state === 'completado';
      }),
      cancelado: appointments.filter(apt => apt.estado.toLowerCase() === 'cancelado')
    };
  }, [appointmentsData]);

  const getColumnConfig = (status: 'confirmado' | 'realizado' | 'cancelado') => {
    const configs = {
      confirmado: {
        title: 'Confirmados',
        icon: <CheckCircle2 size={24} />,
        color: COLORS.PRIMARY_CYAN,
        bgColor: '#e0f2fe',
        count: appointmentsByStatus.confirmado.length
      },
      realizado: {
        title: 'Realizados',
        icon: <CheckCircle2 size={24} />,
        color: '#10b981',
        bgColor: '#d1fae5',
        count: appointmentsByStatus.realizado.length
      },
      cancelado: {
        title: 'Cancelados',
        icon: <XCircle size={24} />,
        color: '#ef4444',
        bgColor: '#fee2e2',
        count: appointmentsByStatus.cancelado.length
      }
    };
    return configs[status];
  };

  if (isLoading) {
    return (
      <div style={{ 
        padding: '2rem', 
        backgroundColor: '#f9fafb', 
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '50px', 
            height: '50px', 
            border: `4px solid ${COLORS.PRIMARY_CYAN}`, 
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }} />
          <p style={{ color: COLORS.PRIMARY_DARK, fontSize: '1.1rem' }}>
            Cargando turnos...
          </p>
        </div>
      </div>
    );
  }

  const totalAppointments = appointmentsByStatus.confirmado.length + 
                           appointmentsByStatus.realizado.length + 
                           appointmentsByStatus.cancelado.length;

  return (
    <div style={{ padding: '2rem', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '1rem',
          marginBottom: '0.5rem'
        }}>
          <FileText size={32} color={COLORS.PRIMARY_CYAN} />
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: 'bold', 
            color: COLORS.PRIMARY_DARK,
            margin: 0
          }}>
            Gestión de Turnos
          </h1>
        </div>
        <p style={{ color: '#6b7280', margin: 0 }}>
          Total: {totalAppointments} turnos
        </p>
      </div>

      {/* Columnas de turnos tipo Kanban */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '1.5rem'
      }}>
        {(['confirmado', 'realizado', 'cancelado'] as const).map((status) => {
          const config = getColumnConfig(status);
          const appointments = appointmentsByStatus[status];

          return (
            <div key={status} style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: 'column',
              maxHeight: '80vh'
            }}>
              {/* Column Header */}
              <div style={{
                padding: '1.25rem',
                borderBottom: '2px solid #e5e7eb',
                backgroundColor: config.bgColor,
                borderRadius: '12px 12px 0 0'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ color: config.color }}>
                    {config.icon}
                  </div>
                  <h2 style={{
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    color: config.color,
                    margin: 0
                  }}>
                    {config.title}
                  </h2>
                  <div style={{
                    marginLeft: 'auto',
                    backgroundColor: config.color,
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '999px',
                    fontSize: '0.875rem',
                    fontWeight: '600'
                  }}>
                    {config.count}
                  </div>
                </div>
              </div>

              {/* Appointments List */}
              <div style={{
                padding: '1rem',
                overflowY: 'auto',
                flex: 1
              }}>
                {appointments.length === 0 ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '2rem 1rem',
                    color: '#9ca3af'
                  }}>
                    <AlertCircle size={32} style={{ margin: '0 auto 0.5rem', opacity: 0.5 }} />
                    <p style={{ margin: 0, fontSize: '0.875rem' }}>
                      No hay turnos {config.title.toLowerCase()}
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {appointments.map((appointment) => (
                      <div
                        key={appointment.turnoId}
                        style={{
                          padding: '1rem',
                          backgroundColor: '#f9fafb',
                          borderRadius: '8px',
                          borderLeft: `4px solid ${config.color}`,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onClick={() => setSelectedAppointment(appointment)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = config.bgColor;
                          e.currentTarget.style.transform = 'translateX(4px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#f9fafb';
                          e.currentTarget.style.transform = 'translateX(0)';
                        }}
                      >
                        {/* Patient Name */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          marginBottom: '0.5rem'
                        }}>
                          <User size={16} color={config.color} />
                          <p style={{
                            fontWeight: '600',
                            color: COLORS.PRIMARY_DARK,
                            margin: 0,
                            fontSize: '0.95rem'
                          }}>
                            {appointment.nombrePaciente} {appointment.apellidoPaciente}
                          </p>
                        </div>

                        {/* Date */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          marginBottom: '0.25rem'
                        }}>
                          <Calendar size={14} color="#6b7280" />
                          <p style={{
                            color: '#6b7280',
                            margin: 0,
                            fontSize: '0.8rem'
                          }}>
                            {appointment.fechaTurno}
                          </p>
                        </div>

                        {/* Time */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          marginBottom: '0.25rem'
                        }}>
                          <Clock size={14} color="#6b7280" />
                          <p style={{
                            color: '#6b7280',
                            margin: 0,
                            fontSize: '0.8rem'
                          }}>
                            {appointment.hora_inicio.substring(0, 5)} - {appointment.hora_fin.substring(0, 5)}
                          </p>
                        </div>

                        {/* Type */}
                        <div style={{
                          marginTop: '0.5rem',
                          display: 'inline-block',
                          padding: '0.25rem 0.75rem',
                          backgroundColor: 'white',
                          borderRadius: '999px',
                          fontSize: '0.75rem',
                          fontWeight: '500',
                          color: config.color,
                          border: `1px solid ${config.color}`
                        }}>
                          {appointment.tipo.charAt(0).toUpperCase() + appointment.tipo.slice(1)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de detalles */}
      {selectedAppointment && (
        <AppointmentDetailsModal
          isOpen={true}
          appointment={selectedAppointment}
          onClose={() => setSelectedAppointment(null)}
        />
      )}
    </div>
  );
};

export default ProfessionalAppointments;
