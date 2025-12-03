import React, { useMemo, useState } from 'react';
import { Calendar, Clock, User, FileText, CheckCircle2, XCircle, AlertCircle, DollarSign, Check } from 'lucide-react';
import { COLORS } from '../../const/colors';
import { useGetProfessionalAppointments } from '../../services/appointments/useGetProfessionalAppointments';
import { useGetProfessionalPayments } from '../../services/payments/useGetProfessionalPayments';
import { useMarkAsPaid } from '../../services/payments/useMarkAsPaid';
import AppointmentDetailsModal from '../../components/AppointmentDetailsModal/AppointmentDetailsModal';
import NotificationModal from '../../components/NotificationModal/NotificationModal';
import type { ProfessionalAppointment } from '../../services/appointments/useGetProfessionalAppointments';

const ProfessionalAppointments: React.FC = () => {
  const { data: appointmentsData, isLoading } = useGetProfessionalAppointments();
  const { data: paymentsData } = useGetProfessionalPayments();
  const { mutate: markAsPaid, isPending: isMarkingAsPaid } = useMarkAsPaid();
  
  const [selectedAppointment, setSelectedAppointment] = useState<ProfessionalAppointment | null>(null);
  const [selectedAppointmentPaymentStatus, setSelectedAppointmentPaymentStatus] = useState<'pagado' | 'pendiente' | null>(null);
  
  // Estado para el modal de notificación
  const [notification, setNotification] = useState<{
    isOpen: boolean;
    type: 'success' | 'error' | 'warning' | 'confirm';
    title: string;
    message: string;
    onConfirm?: () => void;
  }>({
    isOpen: false,
    type: 'success',
    title: '',
    message: ''
  });

  // Función para obtener el estado de pago de un turno
  const getPaymentStatus = (turnoId: number): 'pagado' | 'pendiente' | null => {
    // El backend devuelve los pagos directamente en paymentsData, no en paymentsData.pagos
    const pagos = paymentsData?.pagos || (paymentsData as any);
    
    if (!pagos || !Array.isArray(pagos)) {
      return null;
    }
    
    const payment = pagos.find((p: any) => p.turnoId === turnoId || p.turno_ID === turnoId);
    
    // El backend puede devolver 'estado' o 'estadoPago'
    if (payment) {
      return payment.estado || payment.estadoPago || null;
    }
    
    return null;
  };

  // Función para manejar el marcado como pagado
  const handleMarkAsPaid = (turnoId: number) => {
    setNotification({
      isOpen: true,
      type: 'confirm',
      title: '¿Confirmar pago?',
      message: '¿Estás seguro de que querés marcar este turno como pagado?',
      onConfirm: () => confirmMarkAsPaid(turnoId)
    });
  };

  // Confirmar y ejecutar el marcado como pagado
  const confirmMarkAsPaid = (turnoId: number) => {
    setNotification({ ...notification, isOpen: false });
    
    markAsPaid(
      { turnoId },
      {
        onSuccess: () => {
          setNotification({
            isOpen: true,
            type: 'success',
            title: '¡Pago confirmado!',
            message: 'El turno fue marcado como pagado exitosamente.'
          });
          // Actualizar el estado local del pago del turno seleccionado
          if (selectedAppointment && selectedAppointment.turnoId === turnoId) {
            setSelectedAppointmentPaymentStatus('pagado');
          }
        },
        onError: (error: any) => {
          console.error('Error al marcar como pagado:', error);
          let errorMessage = 'Error al marcar el turno como pagado';
          if (error?.response?.data?.message) {
            errorMessage = error.response.data.message;
          }
          setNotification({
            isOpen: true,
            type: 'error',
            title: 'Error',
            message: errorMessage
          });
        }
      }
    );
  };

  // Actualizar el estado de pago cuando se selecciona un turno
  React.useEffect(() => {
    if (selectedAppointment) {
      const paymentStatus = getPaymentStatus(selectedAppointment.turnoId);
      setSelectedAppointmentPaymentStatus(paymentStatus);
    }
  }, [selectedAppointment, paymentsData]);

  // Función para parsear fecha del backend (formato: "dd-mm-yyyy")
  const parseAppointmentDate = (appointment: ProfessionalAppointment): Date => {
    const [day, month, year] = appointment.fechaTurno.split('-');
    const [hour, minute] = appointment.hora_inicio.split(':');
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute));
  };

  // Función para ordenar turnos por proximidad a la fecha actual
  const sortByProximityToNow = (appointments: ProfessionalAppointment[]): ProfessionalAppointment[] => {
    const now = new Date();
    
    return [...appointments].sort((a, b) => {
      const dateA = parseAppointmentDate(a);
      const dateB = parseAppointmentDate(b);
      
      // Calcular diferencia absoluta en milisegundos desde ahora
      const diffA = Math.abs(now.getTime() - dateA.getTime());
      const diffB = Math.abs(now.getTime() - dateB.getTime());
      
      // Ordenar por diferencia: más cercano primero
      return diffA - diffB;
    });
  };

  // Organizar turnos por estado y ordenar por proximidad
  const appointmentsByStatus = useMemo(() => {
    const appointments = appointmentsData?.turnos || [];
    
    const confirmados = appointments.filter(apt => apt.estado.toLowerCase() === 'confirmado');
    const realizados = appointments.filter(apt => {
      const state = apt.estado.toLowerCase();
      return state === 'realizado' || state === 'completado';
    });
    const cancelados = appointments.filter(apt => apt.estado.toLowerCase() === 'cancelado');
    
    return {
      confirmado: sortByProximityToNow(confirmados),
      realizado: sortByProximityToNow(realizados),
      cancelado: sortByProximityToNow(cancelados)
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
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
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
                    {appointments.map((appointment) => {
                      const paymentStatus = getPaymentStatus(appointment.turnoId);
                      
                      return (
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

                          {/* Type and Payment Status */}
                          <div style={{
                            marginTop: '0.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            flexWrap: 'wrap'
                          }}>
                            <div style={{
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
                            
                            {/* Payment Status Badge */}
                            {paymentStatus && (
                              <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                padding: '0.25rem 0.75rem',
                                backgroundColor: paymentStatus === 'pagado' ? '#d1fae5' : '#fef3c7',
                                color: paymentStatus === 'pagado' ? '#065f46' : '#92400e',
                                borderRadius: '999px',
                                fontSize: '0.75rem',
                                fontWeight: '500'
                              }}>
                                {paymentStatus === 'pagado' ? (
                                  <>
                                    <Check size={12} />
                                    Pagado
                                  </>
                                ) : (
                                  <>
                                    <DollarSign size={12} />
                                    Pendiente
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
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
          paymentStatus={selectedAppointmentPaymentStatus}
          onMarkAsPaid={handleMarkAsPaid}
          isMarkingAsPaid={isMarkingAsPaid}
        />
      )}

      {/* Modal de notificación */}
      <NotificationModal
        isOpen={notification.isOpen}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        onClose={() => setNotification({ ...notification, isOpen: false })}
        onConfirm={notification.onConfirm}
      />
    </div>
  );
};

export default ProfessionalAppointments;
