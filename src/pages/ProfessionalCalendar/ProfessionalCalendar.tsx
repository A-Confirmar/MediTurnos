import React, { useState, useMemo } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, AlertCircle } from 'lucide-react';
import { COLORS } from '../../const/colors';
import { useGetProfessionalAppointments, type ProfessionalAppointment } from '../../services/appointments/useGetProfessionalAppointments';
import AppointmentDetailsModal from '../../components/AppointmentDetailsModal/AppointmentDetailsModal';

const ProfessionalCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState<ProfessionalAppointment | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Obtener turnos del backend
  const { data: appointmentsData, isLoading, error } = useGetProfessionalAppointments();
  const appointments = appointmentsData?.turnos || [];

  // Obtener el mes y año actual
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Nombres de los meses
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  // Nombres de los días
  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  // Generar los días del calendario
  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const prevLastDay = new Date(currentYear, currentMonth, 0);

    const firstDayIndex = firstDay.getDay();
    const lastDayDate = lastDay.getDate();
    const prevLastDayDate = prevLastDay.getDate();

    const days = [];

    // Días del mes anterior
    for (let x = firstDayIndex; x > 0; x--) {
      days.push({
        day: prevLastDayDate - x + 1,
        isCurrentMonth: false,
        date: new Date(currentYear, currentMonth - 1, prevLastDayDate - x + 1)
      });
    }

    // Días del mes actual
    for (let i = 1; i <= lastDayDate; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        date: new Date(currentYear, currentMonth, i)
      });
    }

    // Días del mes siguiente
    const remainingDays = 7 - ((days.length) % 7);
    if (remainingDays < 7) {
      for (let j = 1; j <= remainingDays; j++) {
        days.push({
          day: j,
          isCurrentMonth: false,
          date: new Date(currentYear, currentMonth + 1, j)
        });
      }
    }

    return days;
  }, [currentMonth, currentYear]);

  // Función para obtener los turnos de un día específico
  const getAppointmentsForDay = (date: Date) => {
    // El backend devuelve fechas en formato dd-mm-yyyy
    const dateString = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
    return appointments.filter(apt => apt.fechaTurno === dateString);
  };

  // Función para cambiar de mes
  const changeMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  // Función para ir al mes actual
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Función para abrir el modal con los detalles del turno
  const handleAppointmentClick = (appointment: ProfessionalAppointment) => {
    setSelectedAppointment(appointment);
    setModalOpen(true);
  };

  // Verificar si es el día de hoy
  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  return (
    <div style={{ padding: '2rem', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <CalendarIcon size={32} color={COLORS.PRIMARY_CYAN} />
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: 'bold', 
            color: COLORS.PRIMARY_DARK,
            margin: 0
          }}>
            Mi Agenda
          </h1>
        </div>
        <button
          onClick={goToToday}
          style={{
            backgroundColor: COLORS.PRIMARY_MEDIUM,
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            fontSize: '0.95rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = COLORS.PRIMARY_DARK;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = COLORS.PRIMARY_MEDIUM;
          }}
        >
          <CalendarIcon size={18} />
          Ir a Hoy
        </button>
      </div>

      {/* Loading State */}
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
            Cargando tu agenda...
          </p>
        </div>
      )}

      {/* Error State */}
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
              Error al cargar la agenda
            </h3>
            <p style={{ margin: 0, color: '#7f1d1d', fontSize: '0.9rem' }}>
              {error instanceof Error ? error.message : 'Ocurrió un error desconocido'}
            </p>
          </div>
        </div>
      )}

      {/* Calendar */}
      {!isLoading && !error && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          {/* Month Navigation */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '2rem'
          }}>
            <button
              onClick={() => changeMonth('prev')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.5rem',
                color: COLORS.PRIMARY_MEDIUM,
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
              <ChevronLeft size={24} />
            </button>

            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              color: COLORS.PRIMARY_DARK,
              margin: 0
            }}>
              {monthNames[currentMonth]} {currentYear}
            </h2>

            <button
              onClick={() => changeMonth('next')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '0.5rem',
                color: COLORS.PRIMARY_MEDIUM,
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
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Day Names */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '0.5rem',
            marginBottom: '1rem'
          }}>
            {dayNames.map(day => (
              <div
                key={day}
                style={{
                  textAlign: 'center',
                  padding: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#6b7280'
                }}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '0.5rem'
          }}>
            {calendarDays.map((dayObj, index) => {
              const dayAppointments = getAppointmentsForDay(dayObj.date);
              const isTodayDay = isToday(dayObj.date);

              return (
                <div
                  key={index}
                  style={{
                    minHeight: '100px',
                    maxHeight: '150px', // Limitar altura máxima
                    padding: '0.5rem',
                    border: `1px solid ${isTodayDay ? COLORS.PRIMARY_MEDIUM : '#e5e7eb'}`,
                    borderRadius: '8px',
                    backgroundColor: dayObj.isCurrentMonth ? 'white' : '#f9fafb',
                    opacity: dayObj.isCurrentMonth ? 1 : 0.5,
                    position: 'relative',
                    transition: 'all 0.2s',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  {/* Day Number */}
                  <div style={{
                    fontSize: '0.875rem',
                    fontWeight: isTodayDay ? '700' : '500',
                    color: isTodayDay ? COLORS.PRIMARY_MEDIUM : (dayObj.isCurrentMonth ? '#111827' : '#9ca3af'),
                    marginBottom: '0.5rem',
                    flexShrink: 0 // No se encoge
                  }}>
                    {dayObj.day}
                  </div>

                  {/* Appointments con scroll */}
                  {dayAppointments.length > 0 && (
                    <div style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: '0.25rem',
                      overflowY: 'auto', // Scroll vertical si hay muchos
                      overflowX: 'hidden',
                      flex: 1, // Ocupa el espacio disponible
                      paddingRight: '0.25rem'
                    }}>
                      {dayAppointments.map(apt => {
                        // Determinar color según el estado
                        const getAppointmentColor = () => {
                          switch (apt.estado.toLowerCase()) {
                            case 'confirmado':
                              return { bg: '#dbeafe', color: '#1e40af' };
                            case 'realizado':
                            case 'completado':
                              return { bg: '#d1fae5', color: '#065f46' };
                            case 'cancelado':
                              return { bg: '#fee2e2', color: '#991b1b' };
                            default:
                              return { bg: '#f3f4f6', color: '#4b5563' };
                          }
                        };
                        
                        const colors = getAppointmentColor();
                        
                        return (
                          <button
                            key={apt.turnoId}
                            onClick={() => handleAppointmentClick(apt)}
                            style={{
                              backgroundColor: colors.bg,
                              border: 'none',
                              borderRadius: '4px',
                              padding: '0.25rem 0.5rem',
                              fontSize: '0.75rem',
                              color: colors.color,
                              cursor: 'pointer',
                              textAlign: 'left',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem',
                              transition: 'transform 0.2s'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'scale(1.02)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'scale(1)';
                            }}
                          >
                            <Clock size={10} />
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {apt.hora_inicio.substring(0, 5)} {apt.nombrePaciente}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div style={{
            marginTop: '2rem',
            padding: '1rem',
            backgroundColor: '#f9fafb',
            borderRadius: '8px',
            display: 'flex',
            gap: '2rem',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '16px',
                height: '16px',
                backgroundColor: '#dbeafe',
                borderRadius: '4px'
              }} />
              <span style={{ fontSize: '0.875rem', color: '#4b5563' }}>
                Confirmado
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '16px',
                height: '16px',
                backgroundColor: '#d1fae5',
                borderRadius: '4px'
              }} />
              <span style={{ fontSize: '0.875rem', color: '#4b5563' }}>
                Realizado
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '16px',
                height: '16px',
                backgroundColor: '#fee2e2',
                borderRadius: '4px'
              }} />
              <span style={{ fontSize: '0.875rem', color: '#4b5563' }}>
                Cancelado
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '16px',
                height: '16px',
                border: `2px solid ${COLORS.PRIMARY_MEDIUM}`,
                borderRadius: '4px'
              }} />
              <span style={{ fontSize: '0.875rem', color: '#4b5563' }}>
                Hoy
              </span>
            </div>
          </div>

          {/* Statistics */}
          <div style={{
            marginTop: '2rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            <div style={{
              padding: '1rem',
              backgroundColor: '#f0f9ff',
              borderRadius: '8px',
              border: '1px solid #bae6fd'
            }}>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#0369a1', fontWeight: '500' }}>
                Total de turnos
              </p>
              <p style={{ margin: '0.5rem 0 0 0', fontSize: '2rem', fontWeight: '700', color: '#0c4a6e' }}>
                {appointments.length}
              </p>
            </div>
            <div style={{
              padding: '1rem',
              backgroundColor: '#dbeafe',
              borderRadius: '8px',
              border: '1px solid #93c5fd'
            }}>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#1e40af', fontWeight: '500' }}>
                Confirmados
              </p>
              <p style={{ margin: '0.5rem 0 0 0', fontSize: '2rem', fontWeight: '700', color: '#1e3a8a' }}>
                {appointments.filter(apt => apt.estado.toLowerCase() === 'confirmado').length}
              </p>
            </div>
            <div style={{
              padding: '1rem',
              backgroundColor: '#dcfce7',
              borderRadius: '8px',
              border: '1px solid #86efac'
            }}>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#15803d', fontWeight: '500' }}>
                Realizados
              </p>
              <p style={{ margin: '0.5rem 0 0 0', fontSize: '2rem', fontWeight: '700', color: '#14532d' }}>
                {appointments.filter(apt => apt.estado.toLowerCase() === 'realizado' || apt.estado.toLowerCase() === 'completado').length}
              </p>
            </div>
            <div style={{
              padding: '1rem',
              backgroundColor: '#fee2e2',
              borderRadius: '8px',
              border: '1px solid #fecaca'
            }}>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#991b1b', fontWeight: '500' }}>
                Cancelados
              </p>
              <p style={{ margin: '0.5rem 0 0 0', fontSize: '2rem', fontWeight: '700', color: '#7f1d1d' }}>
                {appointments.filter(apt => apt.estado.toLowerCase() === 'cancelado').length}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modal de detalles */}
      <AppointmentDetailsModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        appointment={selectedAppointment}
      />
    </div>
  );
};

export default ProfessionalCalendar;
