import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, ArrowLeft, XCircle, AlertCircle } from 'lucide-react';
import { ROUTES } from '../../const/routes';
import { COLORS } from '../../const/colors';
import Header from '../../components/Header/Header';
import { useGetPatientAppointments } from '../../services/appointments/useGetPatientAppointments';
import { useDeleteAppointment } from '../../services/appointments/useDeleteAppointment';
import { getAccessToken } from '../../services/localstorage';

const MyAppointments: React.FC = () => {
  const navigate = useNavigate();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  
  // Obtener turnos del backend
  const { data: appointmentsData, isLoading, error } = useGetPatientAppointments();
  
  // Hook para eliminar turno
  const { mutate: deleteAppointment, isPending: isDeleting } = useDeleteAppointment();

  // Función para manejar la eliminación de turno
  const handleDeleteAppointment = async (turnoId: number) => {
    const confirmed = window.confirm('¿Estás seguro de que querés cancelar este turno?');
    
    if (!confirmed) return;

    try {
      const token = await getAccessToken();
      
      if (!token) {
        alert('No se encontró el token de sesión');
        return;
      }

      setDeletingId(turnoId);

      deleteAppointment(
        { token, turnoId },
        {
          onSuccess: () => {
            alert('Turno cancelado exitosamente');
            setDeletingId(null);
          },
          onError: (error: any) => {
            console.error('Error al cancelar turno:', error);
            alert(error?.response?.data?.message || 'Error al cancelar el turno');
            setDeletingId(null);
          },
        }
      );
    } catch (error) {
      console.error('Error:', error);
      alert('Error al cancelar el turno');
      setDeletingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmado':
        return { bg: '#d1fae5', color: '#065f46', text: 'Confirmado' };
      case 'pendiente':
        return { bg: '#fef3c7', color: '#92400e', text: 'Pendiente' };
      case 'completado':
        return { bg: '#e0e7ff', color: '#3730a3', text: 'Completado' };
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

  // Obtener los turnos (o array vacío si aún no hay datos)
  const appointments = appointmentsData?.turnos || [];

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
              {appointments.length === 0 ? (
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
                  {appointments.map((appointment) => {
                    const statusInfo = getStatusColor(appointment.estado);
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
                            marginBottom: '0.75rem'
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

                        {/* Acciones - solo para turnos pendientes o confirmados */}
                        {(appointment.estado.toLowerCase() === 'pendiente' || 
                          appointment.estado.toLowerCase() === 'confirmado') && (
                          <div>
                            <button
                              onClick={() => handleDeleteAppointment(appointment.turnoId)}
                              disabled={deletingId === appointment.turnoId || isDeleting}
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
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyAppointments;
