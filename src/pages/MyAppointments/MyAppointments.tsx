// Tipo para error de Axios
interface AxiosError {
  response?: {
    data?: {
      message?: string;
    };
  };
}
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Calendar, Clock, User, ArrowLeft, XCircle, AlertCircle, Star, DollarSign, CheckCircle } from 'lucide-react';
import { ROUTES } from '../../const/routes';
import { COLORS } from '../../const/colors';
import Header from '../../components/Header/Header';
import RatingModal from '../../components/RatingModal/RatingModal';
import NotificationModal from '../../components/NotificationModal/NotificationModal';
import { useGetPatientAppointments } from '../../services/appointments/useGetPatientAppointments';
import { useCancelAppointment } from '../../services/appointments/useDeleteAppointment';
import { useCreateReview } from '../../services/reviews/useCreateReview';
import { useGetPatientPayments } from '../../services/payments/useGetPatientPayments';
import { getAccessToken } from '../../services/localstorage';

const MyAppointments: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<{
    turnoId: number;
    professionalName: string;
  } | null>(null);

  // Estado para rastrear qué turnos ya tienen reseña
  const [appointmentsWithReviews, setAppointmentsWithReviews] = useState<Set<number>>(new Set());

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
  
  // Obtener turnos del backend
  const { data: appointmentsData, isLoading, error } = useGetPatientAppointments();
  
  // Obtener pagos del paciente
  const { data: paymentsData } = useGetPatientPayments();
  
  // Hook para eliminar turno
  const { mutate: cancelAppointment, isPending: isCancelling } = useCancelAppointment();
  
  // Hook para crear reseña
  const { mutate: createReview, isPending: isSubmittingReview } = useCreateReview();

  // Función para obtener el estado de pago de un turno
  const getPaymentStatus = (turnoId: number): 'pagado' | 'pendiente' | null => {
    // El backend devuelve los pagos directamente en paymentsData, no en paymentsData.pagos
    const pagos = paymentsData?.pagos || (paymentsData as any);
    
    if (!pagos || !Array.isArray(pagos)) return null;
    
    const payment = pagos.find((p: any) => p.turnoId === turnoId || p.turno_ID === turnoId);
    
    // El backend puede devolver 'estado' o 'estadoPago'
    if (payment) {
      return payment.estado || payment.estadoPago || null;
    }
    
    return null;
  };

  // Función para manejar la eliminación de turno (paso 1: mostrar confirmación)
  const handleCancelAppointment = async (turnoId: number) => {
    setNotification({
      isOpen: true,
      type: 'confirm',
      title: '¿Cancelar turno?',
      message: '¿Estás seguro de que querés cancelar este turno? Esta acción no se puede deshacer.',
      onConfirm: () => confirmCancelAppointment(turnoId)
    });
  };

  // Función para confirmar y ejecutar la cancelación del turno
  const confirmCancelAppointment = async (turnoId: number) => {
    // Cerrar el modal de confirmación
    setNotification({ ...notification, isOpen: false });
    
    try {
      const token = await getAccessToken();
      if (!token) {
        setNotification({
          isOpen: true,
          type: 'error',
          title: 'Error de autenticación',
          message: 'No se encontró el token de sesión. Por favor, iniciá sesión nuevamente.'
        });
        return;
      }
      
      setDeletingId(turnoId);
      cancelAppointment(
        { token, turnoId },
        {
          onSuccess: () => {
            setNotification({
              isOpen: true,
              type: 'success',
              title: '¡Turno cancelado!',
              message: 'El turno fue cancelado exitosamente.'
            });
            setDeletingId(null);
          },
          onError: (error: unknown) => {
            console.error('Error al cancelar turno:', error);
            let errorMessage = 'Error al cancelar el turno';
            if (typeof error === 'object' && error !== null) {
              const axiosError = error as AxiosError;
              if (axiosError.response?.data?.message) {
                errorMessage = axiosError.response.data.message;
              }
            }
            setNotification({
              isOpen: true,
              type: 'error',
              title: 'Error al cancelar',
              message: errorMessage
            });
            setDeletingId(null);
          },
        }
      );
    } catch (error) {
      console.error('Error:', error);
      setNotification({
        isOpen: true,
        type: 'error',
        title: 'Error inesperado',
        message: 'Ocurrió un error al intentar cancelar el turno. Por favor, intentá nuevamente.'
      });
      setDeletingId(null);
    }
  };

  // Función para abrir el modal de calificación
  const handleOpenRatingModal = async (turnoId: number, professionalName: string, tieneResena?: boolean) => {
    // Validación 1: Si tieneResena viene del backend (cuando esté implementado)
    if (tieneResena === true) {
      console.warn(`⚠️ Intento de calificar turno ${turnoId} que ya tiene reseña (según backend)`);
      setNotification({
        isOpen: true,
        type: 'warning',
        title: 'Ya calificado',
        message: 'Este turno ya tiene una calificación. No es posible calificar nuevamente.'
      });
      return;
    }

    // Validación 2: Verificar en el estado local (precargado)
    if (appointmentsWithReviews.has(turnoId)) {
      console.warn(`⚠️ Turno ${turnoId} ya tiene reseña (según verificación local)`);
      setNotification({
        isOpen: true,
        type: 'warning',
        title: 'Ya calificado',
        message: 'Este turno ya tiene una calificación. No es posible calificar nuevamente.'
      });
      return;
    }

    // Si no tiene reseña, abrir el modal
    setSelectedAppointment({
      turnoId,
      professionalName
    });
    setRatingModalOpen(true);
  };

  // Función para cerrar el modal de calificación
  const handleCloseRatingModal = () => {
    setRatingModalOpen(false);
    setSelectedAppointment(null);
  };

  // Función para enviar la calificación
  const handleSubmitRating = (rating: number, comment: string) => {
    if (!selectedAppointment) return;

    createReview(
      {
        turnoId: selectedAppointment.turnoId,
        calificacion: rating,
        comentario: comment
      },
      {
        onSuccess: () => {
          // Agregar el turno al Set de reseñas
          if (selectedAppointment) {
            setAppointmentsWithReviews(prev => new Set(prev).add(selectedAppointment.turnoId));
          }
          
          // Invalidar queries para actualizar la lista de turnos (tieneResena se actualizará)
          queryClient.invalidateQueries({ queryKey: ['patient-appointments'] });
          
          setNotification({
            isOpen: true,
            type: 'success',
            title: '¡Gracias por tu calificación!',
            message: 'Tu opinión nos ayuda a mejorar el servicio y ayuda a otros pacientes a elegir al profesional adecuado.'
          });
          handleCloseRatingModal();
        },
        onError: (error: unknown) => {
          console.error('Error al enviar calificación:', error);
          let errorMessage = 'Error al enviar la calificación';
          if (typeof error === 'object' && error !== null) {
            const axiosError = error as AxiosError;
            if (axiosError.response?.data?.message) {
              errorMessage = axiosError.response.data.message;
            }
          }
          setNotification({
            isOpen: true,
            type: 'error',
            title: 'Error al enviar calificación',
            message: errorMessage
          });
        }
      }
    );
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmado':
        return { bg: '#d1fae5', color: '#065f46', text: 'Confirmado' };
      case 'pendiente':
        return { bg: '#fef3c7', color: '#92400e', text: 'Pendiente' };
      case 'completado':
      case 'realizado':
        return { bg: '#e0e7ff', color: '#3730a3', text: 'Realizado' };
      case 'cancelado':
        return { bg: '#fee2e2', color: '#991b1b', text: 'Cancelado' };
      default:
        return { bg: '#f3f4f6', color: '#1f2937', text: status };
    }
  };

  // Convertir fecha de DD-MM-YYYY a formato legible
  const formatDate = (dateString: string) => {
    const [day, month, year] = dateString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return date.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Formatear hora de HH:MM:SS a HH:MM
  const formatTime = (time: string) => {
    return time.substring(0, 5); // Toma solo HH:MM
  };

  // Función para convertir fecha DD-MM-YYYY a timestamp para ordenar
  const dateToTimestamp = (dateString: string, timeString: string = '00:00:00') => {
    const [day, month, year] = dateString.split('-');
    const [hours, minutes] = timeString.split(':');
    return new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hours || '0'),
      parseInt(minutes || '0')
    ).getTime();
  };

  // Obtener los turnos (o array vacío si aún no hay datos)
  const appointments = React.useMemo(() => appointmentsData?.turnos || [], [appointmentsData]);

  // Verificar qué turnos tienen reseña (solo para turnos completados/realizados)
  React.useEffect(() => {
    const checkReviews = async () => {
      const token = await getAccessToken();
      if (!token || appointments.length === 0) return;

      // Filtrar solo turnos completados/realizados
      const completedAppointments = appointments.filter(apt => 
        apt.estado.toLowerCase() === 'completado' || 
        apt.estado.toLowerCase() === 'realizado'
      );

      if (completedAppointments.length === 0) return;

      // Verificar cada turno
      const reviewPromises = completedAppointments.map(async (apt) => {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/tieneResenia?idTurno=${apt.turnoId}`,
            {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }
          );
          const data = await response.json();
          return { turnoId: apt.turnoId, hasReview: data.result === true };
        } catch (error) {
          console.error(`Error verificando reseña para turno ${apt.turnoId}:`, error);
          return { turnoId: apt.turnoId, hasReview: false };
        }
      });

      const results = await Promise.all(reviewPromises);
      
      // Actualizar el Set con los IDs que tienen reseña
      const newSet = new Set<number>();
      results.forEach(({ turnoId, hasReview }) => {
        if (hasReview) {
          newSet.add(turnoId);
        }
      });
      
      setAppointmentsWithReviews(newSet);
    };

    checkReviews();
  }, [appointments]);

  // Ordenar turnos: 
  // 1. Confirmados (fecha más cercana primero)
  // 2. Completados/Realizados (fecha más cercana primero)
  // 3. Cancelados (fecha más cercana primero)
  const sortedAppointments = [...appointments].sort((a, b) => {
    const statusOrder = { 
      'confirmado': 1, 
      'completado': 2, 
      'realizado': 2, 
      'cancelado': 3, 
      'pendiente': 4 
    };
    const statusA = a.estado.toLowerCase();
    const statusB = b.estado.toLowerCase();
    
    // Primero ordenar por tipo de estado
    const orderA = statusOrder[statusA as keyof typeof statusOrder] || 99;
    const orderB = statusOrder[statusB as keyof typeof statusOrder] || 99;
    
    if (orderA !== orderB) {
      return orderA - orderB;
    }
    
    // Si son del mismo estado, ordenar por fecha (más cercana primero)
    const dateA = dateToTimestamp(a.fechaTurno, a.hora_inicio);
    const dateB = dateToTimestamp(b.fechaTurno, b.hora_inicio);
    
    return dateA - dateB;
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <Header />
      
      <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          {/* Header con botón de regreso */}
          <div style={{ marginBottom: '2rem' }}>
            <button
              onClick={() => navigate(ROUTES.home)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'transparent',
                border: 'none',
                color: COLORS.PRIMARY_MEDIUM,
                fontSize: '0.9rem',
                cursor: 'pointer',
                padding: '0.5rem',
                marginBottom: '1rem'
              }}
            >
              <ArrowLeft size={20} />
              Volver al Inicio
            </button>
            
            <div style={{ 
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              borderLeft: `4px solid ${COLORS.PRIMARY_MEDIUM}`
            }}>
              <h1 style={{ 
                margin: 0,
                fontSize: '1.8rem',
                color: COLORS.PRIMARY_DARK,
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <Calendar size={28} />
                Mis Turnos
              </h1>
              <p style={{ 
                margin: '0.5rem 0 0 0',
                color: '#6b7280',
                fontSize: '0.95rem'
              }}>
                Gestiona todas tus citas médicas en un solo lugar
              </p>
            </div>
          </div>

          {/* Estado de carga */}
          {isLoading && (
            <div style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              backgroundColor: '#fff',
              borderRadius: '12px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                border: '4px solid #e5e7eb',
                borderTopColor: COLORS.PRIMARY_MEDIUM,
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 1rem'
              }} />
              <p style={{ margin: 0, fontSize: '1rem', color: '#6b7280' }}>
                Cargando tus turnos...
              </p>
            </div>
          )}

          {/* Estado de error */}
          {error && (
            <div style={{
              backgroundColor: '#fee2e2',
              border: '1px solid #fecaca',
              borderRadius: '12px',
              padding: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <AlertCircle size={24} color="#dc2626" />
              <div>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#991b1b', fontSize: '1rem', fontWeight: '600' }}>
                  Error al cargar los turnos
                </h3>
                <p style={{ margin: 0, color: '#7f1d1d', fontSize: '0.9rem' }}>
                  {error instanceof Error ? error.message : 'Ocurrió un error desconocido'}
                </p>
              </div>
            </div>
          )}

          {/* Lista de turnos o mensaje de "sin turnos" */}
          {!isLoading && !error && (
            <>
              {sortedAppointments.length === 0 ? (
                <div style={{
                  backgroundColor: 'white',
                  padding: '3rem',
                  borderRadius: '8px',
                  textAlign: 'center',
                  color: '#6b7280',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                  <Calendar size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                  <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>No tenés turnos programados</p>
                  <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem', color: '#9ca3af' }}>
                    Buscá profesionales y agendá tu primera consulta
                  </p>
                  <button
                    onClick={() => navigate(ROUTES.searchProfessionals)}
                    style={{
                      backgroundColor: COLORS.PRIMARY_MEDIUM,
                      color: 'white',
                      border: 'none',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '8px',
                      fontSize: '0.95rem',
                      fontWeight: '500',
                      cursor: 'pointer'
                    }}
                  >
                    Buscar Profesionales
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {sortedAppointments.map((appointment) => {
                    const statusInfo = getStatusColor(appointment.estado);
                    const paymentStatus = getPaymentStatus(appointment.turnoId);
                    
                    return (
                      <div
                        key={appointment.turnoId}
                        style={{
                          backgroundColor: 'white',
                          padding: '1.5rem',
                          borderRadius: '8px',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                          display: 'grid',
                          gridTemplateColumns: '1fr auto',
                          gap: '1rem',
                          alignItems: 'start'
                        }}
                      >
                        <div>
                          <div style={{ 
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            marginBottom: '0.75rem',
                            flexWrap: 'wrap'
                          }}>
                            <h3 style={{ 
                              margin: 0,
                              fontSize: '1.2rem',
                              color: '#111827'
                            }}>
                              {appointment.nombreProfesional} {appointment.apellidoProfesional}
                            </h3>
                            <span style={{
                              backgroundColor: statusInfo.bg,
                              color: statusInfo.color,
                              padding: '0.25rem 0.75rem',
                              borderRadius: '12px',
                              fontSize: '0.75rem',
                              fontWeight: '500'
                            }}>
                              {statusInfo.text}
                            </span>
                            
                            {/* Badge de estado de pago */}
                            {paymentStatus && (
                              <span style={{
                                backgroundColor: paymentStatus === 'pagado' ? '#d1fae5' : '#fef3c7',
                                color: paymentStatus === 'pagado' ? '#065f46' : '#92400e',
                                padding: '0.25rem 0.75rem',
                                borderRadius: '12px',
                                fontSize: '0.75rem',
                                fontWeight: '500',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem'
                              }}>
                                {paymentStatus === 'pagado' ? (
                                  <>
                                    <CheckCircle size={12} />
                                    Pagado
                                  </>
                                ) : (
                                  <>
                                    <DollarSign size={12} />
                                    Pendiente de Pago
                                  </>
                                )}
                              </span>
                            )}
                          </div>

                          <div style={{ 
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.5rem',
                            color: '#6b7280',
                            fontSize: '0.9rem'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <User size={16} />
                              <span>{appointment.tipo.charAt(0).toUpperCase() + appointment.tipo.slice(1)}</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <Calendar size={16} />
                              <span style={{ textTransform: 'capitalize' }}>
                                {formatDate(appointment.fechaTurno)}
                              </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <Clock size={16} />
                              <span>{formatTime(appointment.hora_inicio)} - {formatTime(appointment.hora_fin)} hs</span>
                            </div>
                          </div>
                        </div>

                        {/* Acciones */}
                        <div>
                          {/* Botón cancelar - solo para turnos pendientes o confirmados */}
                          {(appointment.estado.toLowerCase() === 'pendiente' || 
                            appointment.estado.toLowerCase() === 'confirmado') && (
                            <button
                              onClick={() => handleCancelAppointment(appointment.turnoId)}
                              disabled={deletingId === appointment.turnoId || isCancelling}
                              style={{
                                backgroundColor: deletingId === appointment.turnoId ? '#9ca3af' : '#dc2626',
                                color: 'white',
                                border: 'none',
                                padding: '0.5rem 1rem',
                                borderRadius: '6px',
                                fontSize: '0.85rem',
                                cursor: deletingId === appointment.turnoId ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                whiteSpace: 'nowrap',
                                opacity: deletingId === appointment.turnoId ? 0.7 : 1
                              }}
                            >
                              <XCircle size={16} />
                              {deletingId === appointment.turnoId ? 'Cancelando...' : 'Cancelar'}
                            </button>
                          )}

                          {/* Botón/Badge calificar - solo para turnos completados/realizados */}
                          {(appointment.estado.toLowerCase() === 'completado' || 
                            appointment.estado.toLowerCase() === 'realizado') && (
                            <>
                              {(appointment.tieneResena || appointmentsWithReviews.has(appointment.turnoId)) ? (
                                // Badge "Ya calificado"
                                <div style={{
                                  backgroundColor: '#e0e7ff',
                                  color: '#3730a3',
                                  border: '2px solid #c7d2fe',
                                  padding: '0.5rem 1rem',
                                  borderRadius: '6px',
                                  fontSize: '0.85rem',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.5rem',
                                  whiteSpace: 'nowrap',
                                  fontWeight: '600'
                                }}>
                                  <Star size={16} fill="#3730a3" />
                                  Ya calificado
                                </div>
                              ) : (
                                // Botón "Calificar"
                                <button
                                  onClick={() => handleOpenRatingModal(
                                    appointment.turnoId,
                                    `${appointment.nombreProfesional} ${appointment.apellidoProfesional}`,
                                    appointment.tieneResena
                                  )}
                                  style={{
                                    backgroundColor: COLORS.PRIMARY_MEDIUM,
                                    color: 'white',
                                    border: 'none',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '6px',
                                    fontSize: '0.85rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    whiteSpace: 'nowrap',
                                    transition: 'background-color 0.2s'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = COLORS.PRIMARY_DARK;
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = COLORS.PRIMARY_MEDIUM;
                                  }}
                                >
                                  <Star size={16} />
                                  Calificar
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal de calificación */}
      <RatingModal
        isOpen={ratingModalOpen}
        onClose={handleCloseRatingModal}
        onSubmit={handleSubmitRating}
        professionalName={selectedAppointment?.professionalName || ''}
        isSubmitting={isSubmittingReview}
      />

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

export default MyAppointments;
