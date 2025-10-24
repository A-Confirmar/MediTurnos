import React, { useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { CheckCircle, AlertCircle, Calendar as CalendarIcon, User as UserIcon, ArrowLeft, MapPin, Star, Phone, Mail, ShieldX } from 'lucide-react';
import AppointmentCalendar from '../../components/AppointmentCalendar/AppointmentCalendar';
import { useGetProfessionalAvailabilityByEmail } from '../../services/appointments/useGetProfessionalAvailability';
import { useCreateAppointment } from '../../services/appointments/useCreateAppointment';
import { useGetProfessionalsWhoBlockedMe } from '../../services/appointments/useGetProfessionalsWhoBlockedMe';
import { ROUTES } from '../../const/routes';
import { COLORS } from '../../const/colors';
import Header from '../../components/Header/Header';
import { useGetPatientAppointments } from '../../services/appointments/useGetPatientAppointments';
import type { User } from '../../types/User';

const BookAppointment: React.FC = () => {
  // Obtener los turnos reservados del paciente
  const { data: patientAppointmentsData } = useGetPatientAppointments();
  
  // Obtener profesionales que me tienen bloqueado
  const { data: blockedByData } = useGetProfessionalsWhoBlockedMe();

  // Construir lista de horarios reservados por fecha y hora
  // Normalizar fecha a YYYY-MM-DD para comparación con el calendario
  const reservedSlots = patientAppointmentsData?.turnos?.map(turno => {
    // fechaTurno viene como DD-MM-YYYY
    const [day, month, year] = turno.fechaTurno.split('-');
    const normalizedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    return {
      date: normalizedDate,
      startTime: turno.hora_inicio,
      endTime: turno.hora_fin
    };
  }) || [];
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  // Obtener datos del profesional desde:
  // 1. State de navegación (si viene desde la tarjeta)
  // 2. Query params (si viene desde login redirect)
  const stateData = location.state as { 
    professionalEmail?: string; 
  professionalData?: User
  } || {};
  
  const emailFromState = stateData.professionalEmail || '';
  const professionalDataFromState = stateData.professionalData || null;
  
  const emailFromQuery = searchParams.get('email') || '';
  
  // Construir datos del profesional desde query params si no vienen del state
  const professionalDataFromQuery = emailFromQuery ? {
    email: emailFromQuery,
    nombre: searchParams.get('nombre') || '',
    apellido: searchParams.get('apellido') || '',
    especialidad: searchParams.get('especialidad') || '',
    descripcion: searchParams.get('descripcion') || '',
    localidad: searchParams.get('localidad') || '',
    direccion: searchParams.get('direccion') || '',
    telefono: searchParams.get('telefono') || '',
    calificacion_promedio: parseFloat(searchParams.get('calificacion') || '0')
  } : null;
  
  const professionalEmail = emailFromState || emailFromQuery;
  const professionalData = professionalDataFromState || professionalDataFromQuery;
  
  // Función helper para verificar si el profesional me tiene bloqueado
  const isBlockedByProfessional = (email: string): boolean => {
    if (!blockedByData?.bloqueados) return false;
    return blockedByData.bloqueados.some(blocked => blocked.email === email);
  };

  // Obtener información del bloqueo
  const getBlockedInfo = (email: string) => {
    if (!blockedByData?.bloqueados) return null;
    return blockedByData.bloqueados.find(blocked => blocked.email === email);
  };

  // Verificar si estoy bloqueado por este profesional
  const isBlocked = isBlockedByProfessional(professionalEmail);
  const blockedInfo = getBlockedInfo(professionalEmail);
  
  // Mostrar calendario directamente si tenemos el email del profesional Y no estoy bloqueado
  const showCalendar = !!professionalEmail && !isBlocked;
  
  // Estado para el turno seleccionado
  const [selectedSlot, setSelectedSlot] = useState<{
    date: string;
    startTime: string;
    endTime: string;
  } | null>(null);

  // Obtener disponibilidad del profesional seleccionado (usando su email)
  const { data: availabilityData, isLoading: loadingAvailability, error: availabilityError } = 
    useGetProfessionalAvailabilityByEmail(professionalEmail);

  // Crear turno
  const { mutateAsync: createAppointment, isPending, isError, error, isSuccess } = 
    useCreateAppointment();

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);


  const handleSelectSlot = (date: string, startTime: string, endTime: string) => {
    setSelectedSlot({ date, startTime, endTime });
  };

  const handleConfirmAppointment = async () => {
    if (!selectedSlot) return;

    try {
      await createAppointment({
        emailProfesional: professionalEmail,
        fecha: selectedSlot.date,
        hora_inicio: selectedSlot.startTime,
        hora_fin: selectedSlot.endTime,
        estado: 'confirmado',
        tipo: 'consulta' // Tipo fijo por defecto
      });

      // Mostrar mensaje de éxito
      setShowSuccessMessage(true);
      
      // Limpiar selección
      setSelectedSlot(null);
      
      // Scroll al top
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Redirigir después de 3 segundos
      setTimeout(() => {
        navigate(ROUTES.myAppointments);
      }, 3000);
    } catch (err) {
      console.error('Error al confirmar turno:', err);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <Header />
      
      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Botón volver */}
        <button
          onClick={() => navigate(ROUTES.home)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1.5rem',
            padding: '0.5rem 1rem',
            backgroundColor: 'transparent',
            border: 'none',
            color: COLORS.PRIMARY_MEDIUM,
            fontSize: '0.95rem',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          <ArrowLeft size={20} />
          Volver al inicio
        </button>

        {/* Mensaje de bloqueo */}
        {isBlocked && professionalData && (
          <div style={{
            marginBottom: '2rem',
            padding: '2rem',
            backgroundColor: '#fef2f2',
            borderRadius: '12px',
            border: '2px solid #fca5a5',
            textAlign: 'center'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: '#fee2e2',
              border: '3px solid #dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem'
            }}>
              <ShieldX size={40} color="#dc2626" />
            </div>
            
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#991b1b',
              margin: '0 0 0.75rem 0'
            }}>
              No puedes agendar turnos con este profesional
            </h2>
            
            <p style={{
              color: '#7f1d1d',
              fontSize: '1rem',
              margin: '0 0 1rem 0',
              lineHeight: '1.5'
            }}>
              <strong>{professionalData.nombre} {professionalData.apellido}</strong> ha bloqueado tu acceso para agendar turnos.
            </p>

            {blockedInfo?.motivo && (
              <div style={{
                backgroundColor: '#fff',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid #fecaca',
                marginBottom: '1rem'
              }}>
                <p style={{
                  color: '#7f1d1d',
                  fontSize: '0.9rem',
                  margin: 0,
                  lineHeight: '1.4'
                }}>
                  <strong>Motivo:</strong> {blockedInfo.motivo}
                </p>
              </div>
            )}

            <button
              onClick={() => navigate(ROUTES.searchProfessionals)}
              style={{
                backgroundColor: COLORS.PRIMARY_MEDIUM,
                color: 'white',
                border: 'none',
                padding: '0.75rem 2rem',
                borderRadius: '6px',
                fontSize: '0.9rem',
                fontWeight: '600',
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
              Buscar otro profesional
            </button>
          </div>
        )}

        {/* Mensajes de estado */}
        {showSuccessMessage && isSuccess && (
          <div style={{
            marginBottom: '2rem',
            padding: '1rem 1.5rem',
            backgroundColor: '#f0fdf4',
            borderRadius: '8px',
            border: '2px solid #86efac',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            color: '#15803d'
          }}>
            <CheckCircle size={24} />
            <div>
              <p style={{ margin: 0, fontWeight: '600', fontSize: '1rem' }}>
                ¡Turno reservado exitosamente!
              </p>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
                Redirigiendo a tus turnos...
              </p>
            </div>
          </div>
        )}

        {isError && (
          <div style={{
            marginBottom: '2rem',
            padding: '1rem 1.5rem',
            backgroundColor: '#fef2f2',
            borderRadius: '8px',
            border: '2px solid #fca5a5',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            color: '#dc2626'
          }}>
            <AlertCircle size={24} />
            <div>
              <p style={{ margin: 0, fontWeight: '600' }}>Error al reservar turno</p>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>
                {error instanceof Error ? error.message : 'Por favor, intenta nuevamente'}
              </p>
            </div>
          </div>
        )}

        {/* Header */}
        <div style={{
          backgroundColor: COLORS.WHITE,
          padding: '2rem',
          borderRadius: '8px',
          marginBottom: '2rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          borderLeft: `4px solid ${COLORS.PRIMARY_MEDIUM}`
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <CalendarIcon size={28} style={{ color: COLORS.PRIMARY_MEDIUM }} />
            <h1 style={{ margin: 0, fontSize: '1.75rem', color: COLORS.PRIMARY_DARK, fontWeight: '700' }}>
              Reservar Turno
            </h1>
          </div>
          <p style={{ margin: 0, color: '#6b7280', fontSize: '1rem' }}>
            Selecciona el horario que mejor se adapte a tus necesidades
          </p>
        </div>


        {/* Mensaje si no hay profesional seleccionado */}
        {!showCalendar && (
          <div style={{
            backgroundColor: '#fef3c7',
            padding: '1.5rem',
            borderRadius: '8px',
            marginBottom: '2rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #fde68a',
            textAlign: 'center'
          }}>
            <AlertCircle size={24} style={{ color: '#f59e0b', margin: '0 auto 0.5rem' }} />
            <p style={{ margin: 0, color: '#92400e', fontWeight: '600' }}>
              No se encontró el profesional seleccionado
            </p>
            <p style={{ margin: '0.5rem 0 0 0', color: '#92400e', fontSize: '0.9rem' }}>
              Por favor, selecciona un profesional desde la página principal
            </p>
          </div>
        )}


        {/* Calendario */}
        {showCalendar && (
          <div>
            {loadingAvailability ? (
              <div style={{
                textAlign: 'center',
                padding: '3rem',
                backgroundColor: COLORS.WHITE,
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <p style={{ color: '#6b7280', fontSize: '1rem' }}>Cargando disponibilidad...</p>
              </div>
            ) : availabilityError ? (
              <div style={{
                padding: '2rem',
                backgroundColor: '#fef2f2',
                borderRadius: '8px',
                border: '1px solid #fca5a5',
                color: '#dc2626',
                textAlign: 'center'
              }}>
                <AlertCircle size={32} style={{ margin: '0 auto 1rem' }} />
                <p style={{ margin: 0, fontWeight: '600' }}>Error al cargar disponibilidad</p>
                <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>
                  {availabilityError instanceof Error ? availabilityError.message : 'Intenta nuevamente'}
                </p>
              </div>
            ) : availabilityData?.disponibilidad && availabilityData.disponibilidad.length > 0 ? (
              <>
                <AppointmentCalendar
                  availability={availabilityData.disponibilidad}
                  onSelectSlot={handleSelectSlot}
                  selectedSlot={selectedSlot}
                  reservedSlots={reservedSlots}
                />

                {/* Botón confirmar */}
                {selectedSlot && (
                  <div style={{
                    marginTop: '2rem',
                    padding: '1.5rem',
                    backgroundColor: COLORS.WHITE,
                    borderRadius: '8px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: '#6b7280' }}>
                        Turno seleccionado:
                      </p>
                      <p style={{ margin: '0.25rem 0 0 0', fontSize: '1.1rem', fontWeight: '600', color: COLORS.PRIMARY_DARK }}>
                        {selectedSlot.date} - {selectedSlot.startTime} a {selectedSlot.endTime}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleConfirmAppointment}
                      disabled={isPending}
                      style={{
                        padding: '0.75rem 2rem',
                        backgroundColor: isPending ? '#9ca3af' : '#16a34a',
                        color: COLORS.WHITE,
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: isPending ? 'not-allowed' : 'pointer',
                        transition: 'background-color 0.2s'
                      }}
                    >
                      {isPending ? 'Confirmando...' : 'Confirmar Turno'}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '3rem',
                backgroundColor: COLORS.WHITE,
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <CalendarIcon size={48} style={{ color: '#9ca3af', margin: '0 auto 1rem' }} />
                <p style={{ color: '#6b7280', fontSize: '1rem', fontWeight: '500' }}>
                  Este profesional aún no ha configurado su disponibilidad
                </p>
              </div>
            )}
          </div>
        )}

        {/* Información del profesional */}
        {showCalendar && professionalData && (
          <div style={{
            backgroundColor: COLORS.WHITE,
            padding: '1.5rem',
            borderRadius: '8px',
            marginTop: '2rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{
              margin: '0 0 1rem 0',
              fontSize: '1.25rem',
              fontWeight: '700',
              color: COLORS.PRIMARY_DARK,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <UserIcon size={20} />
              Información del Profesional
            </h3>
            
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              {/* Avatar con imagen por defecto */}
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: professionalData.imagenUrl ? 'transparent' : '#f3f4f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                border: '2px solid #e5e7eb',
                overflow: 'hidden'
              }}>
                {professionalData.imagenUrl ? (
                  <img 
                    src={professionalData.imagenUrl} 
                    alt={`${professionalData.nombre} ${professionalData.apellido}`}
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover' 
                    }}
                  />
                ) : (
                  <UserIcon size={40} color="#9ca3af" strokeWidth={1.5} />
                )}
              </div>

              {/* Información */}
              <div style={{ flex: 1 }}>
                <h4 style={{
                  margin: '0 0 0.5rem 0',
                  fontSize: '1.1rem',
                  fontWeight: '700',
                  color: COLORS.PRIMARY_DARK
                }}>
                  {professionalData.nombre} {professionalData.apellido}
                </h4>
                
                <p style={{
                  margin: '0 0 0.75rem 0',
                  fontSize: '1rem',
                  color: COLORS.PRIMARY_MEDIUM,
                  fontWeight: '600'
                }}>
                  {professionalData.especialidad}
                </p>

                {/* Calificación */}
                {professionalData.calificacion_promedio && professionalData.calificacion_promedio > 0 && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.75rem'
                  }}>
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          fill={i < Math.floor(professionalData.calificacion_promedio || 0) ? '#fbbf24' : 'none'}
                          color="#fbbf24"
                        />
                      ))}
                    </div>
                    <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#6b7280' }}>
                      {Number(professionalData.calificacion_promedio).toFixed(1)}
                    </span>
                  </div>
                )}

                {/* Descripción */}
                {professionalData.descripcion && (
                  <p style={{
                    margin: '0 0 0.75rem 0',
                    fontSize: '0.9rem',
                    color: '#6b7280',
                    lineHeight: '1.5'
                  }}>
                    {professionalData.descripcion}
                  </p>
                )}

                {/* Tarifas de consulta */}
                {(professionalData.valorConsulta != null || professionalData.valorConsultaExpress != null) && (
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                    marginBottom: '0.75rem'
                  }}>
                    {professionalData.valorConsulta != null && professionalData.valorConsulta > 0 && (
                      <div style={{
                        backgroundColor: '#e0f2fe',
                        color: COLORS.PRIMARY_MEDIUM,
                        padding: '0.35rem 0.75rem',
                        borderRadius: '0.5rem',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem'
                      }}>
                        <span>Consulta: ${professionalData.valorConsulta.toLocaleString('es-AR')}</span>
                      </div>
                    )}
                    {professionalData.valorConsultaExpress != null && professionalData.valorConsultaExpress > 0 && (
                      <div style={{
                        backgroundColor: '#dbeafe',
                        color: COLORS.PRIMARY_MEDIUM,
                        padding: '0.35rem 0.75rem',
                        borderRadius: '0.5rem',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem'
                      }}>
                        <span>Express: ${professionalData.valorConsultaExpress.toLocaleString('es-AR')}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Información de contacto */}
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  fontSize: '0.85rem',
                  color: '#6b7280'
                }}>
                  {professionalData.localidad && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <MapPin size={16} />
                      <span>{professionalData.localidad}</span>
                    </div>
                  )}
                  {professionalData.direccion && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <MapPin size={16} />
                      <span>{professionalData.direccion}</span>
                    </div>
                  )}
                  {professionalData.telefono && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Phone size={16} />
                      <span>{professionalData.telefono}</span>
                    </div>
                  )}
                  {professionalData.email && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Mail size={16} />
                      <span>{professionalData.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookAppointment;

