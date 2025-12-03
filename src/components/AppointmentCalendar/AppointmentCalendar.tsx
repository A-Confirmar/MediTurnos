import React, { useState, useMemo } from 'react';
import { Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { COLORS } from '../../const/colors';
import type { ProfessionalAvailability } from '../../services/appointments/useGetProfessionalAvailability';

interface AppointmentCalendarProps {
  availability: ProfessionalAvailability[];
  onSelectSlot: (date: string, startTime: string, endTime: string) => void;
  selectedSlot?: { date: string; startTime: string; endTime: string } | null;
  reservedSlots?: { date: string; startTime: string; endTime: string }[];
}

const DAYS_DISPLAY: Record<string, string> = {
  'lunes': 'Lun',
  'martes': 'Mar',
  'miercoles': 'Mié',
  'jueves': 'Jue',
  'viernes': 'Vie',
  'sabado': 'Sáb',
  'domingo': 'Dom'
};

const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({
  availability,
  onSelectSlot,
  selectedSlot,
  reservedSlots = []
}) => {
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);

  // Generar días de la semana desde hoy
  const weekDays = useMemo(() => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() + (currentWeekOffset * 7));

    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      return date;
    });
  }, [currentWeekOffset]);

  // Obtener horarios disponibles para una fecha específica
  const getAvailableSlots = (date: Date): ProfessionalAvailability[] => {
    const dayOfWeek = date.getDay(); // 0 = domingo, 1 = lunes, etc.
    
    // Mapear día de semana a nombre en español
    const dayNames = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
    const dayName = dayNames[dayOfWeek];

    // Filtrar disponibilidad por día
    return availability.filter(slot => 
      slot.dia_semana?.toLowerCase() === dayName.toLowerCase()
    );
  };

  // Formatear fecha para mostrar
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  // Formatear fecha para enviar al backend
  const formatDateForBackend = (date: Date): string => {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
  };

  // Verificar si una fecha ya pasó
  const isPastDate = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  // Verificar si un horario ya pasó (para el día actual)
  const isPastTime = (date: Date, time: string): boolean => {
    const now = new Date();
    const today = new Date();
    
    // Comparar fechas por día, mes y año
    const isToday = (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
    
    // Si no es hoy, no es pasado
    if (!isToday) {
      return false;
    }
    
    // Si es hoy, verificar si la hora ya pasó
    const [hours, minutes] = time.split(':').map(Number);
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    // Comparar horas y minutos directamente
    if (currentHour > hours) {
      return true;
    }
    if (currentHour === hours && currentMinute >= minutes) {
      return true;
    }
    
    return false;
  };

  // Verificar si un slot está seleccionado
  const isSlotSelected = (date: Date, startTime: string): boolean => {
    if (!selectedSlot) return false;
    return (
      selectedSlot.date === formatDateForBackend(date) &&
      selectedSlot.startTime === startTime
    );
  };

  const handlePreviousWeek = () => {
    if (currentWeekOffset > 0) {
      setCurrentWeekOffset(currentWeekOffset - 1);
    }
  };

  const handleNextWeek = () => {
    setCurrentWeekOffset(currentWeekOffset + 1);
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Header del calendario */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.5rem',
        padding: '1rem',
        backgroundColor: COLORS.WHITE,
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <button
          type="button"
          onClick={handlePreviousWeek}
          disabled={currentWeekOffset === 0}
          style={{
            padding: '0.5rem',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: currentWeekOffset === 0 ? 'not-allowed' : 'pointer',
            color: currentWeekOffset === 0 ? '#9ca3af' : COLORS.PRIMARY_MEDIUM,
            opacity: currentWeekOffset === 0 ? 0.5 : 1
          }}
        >
          <ChevronLeft size={24} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar size={20} style={{ color: COLORS.PRIMARY_MEDIUM }} />
          <span style={{ fontWeight: '600', fontSize: '1rem', color: COLORS.PRIMARY_DARK }}>
            {weekDays[0] && `${formatDate(weekDays[0])} - ${formatDate(weekDays[6])}`}
          </span>
        </div>

        <button
          type="button"
          onClick={handleNextWeek}
          style={{
            padding: '0.5rem',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: COLORS.PRIMARY_MEDIUM
          }}
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Grid de días */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {weekDays.map((date, index) => {
          const slots = getAvailableSlots(date);
          const past = isPastDate(date);
          
          // Filtrar slots que ya pasaron
          const availableSlots = slots.filter(slot => !isPastTime(date, slot.hora_inicio || ''));

          return (
            <div
              key={index}
              style={{
                backgroundColor: COLORS.WHITE,
                borderRadius: '8px',
                padding: '1rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                border: '2px solid transparent'
              }}
            >
              {/* Encabezado del día */}
              <div style={{
                textAlign: 'center',
                marginBottom: '0.75rem',
                paddingBottom: '0.75rem',
                borderBottom: '1px solid #e5e7eb'
              }}>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#6b7280',
                  fontWeight: '500',
                  textTransform: 'uppercase',
                  marginBottom: '0.25rem'
                }}>
                  {DAYS_DISPLAY[['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'][date.getDay()]] || 'N/A'}
                </div>
                <div style={{
                  fontSize: '1.25rem',
                  fontWeight: '700',
                  color: past ? '#9ca3af' : COLORS.PRIMARY_DARK
                }}>
                  {date.getDate()}
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#6b7280'
                }}>
                  {date.toLocaleDateString('es-ES', { month: 'short' })}
                </div>
              </div>

              {/* Horarios disponibles */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                maxHeight: '300px',
                overflowY: 'auto'
              }}>
                {past ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '0.75rem',
                    fontSize: '0.85rem',
                    color: '#9ca3af',
                    fontStyle: 'italic'
                  }}>
                    Fecha pasada
                  </div>
                ) : availableSlots.length === 0 ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '0.75rem',
                    fontSize: '0.85rem',
                    color: '#9ca3af',
                    fontStyle: 'italic'
                  }}>
                    Sin horarios
                  </div>
                ) : (
                  availableSlots.map((slot, slotIndex) => {
                    const selected = isSlotSelected(date, slot.hora_inicio || '');
                    const isReserved = reservedSlots.some(
                      r => r.date === formatDateForBackend(date) && r.startTime === slot.hora_inicio
                    );
                    return (
                      <button
                        key={slotIndex}
                        type="button"
                        onClick={() => {
                          if (!isReserved && slot.hora_inicio && slot.hora_fin) {
                            onSelectSlot(
                              formatDateForBackend(date),
                              slot.hora_inicio,
                              slot.hora_fin
                            );
                          }
                        }}
                        disabled={isReserved}
                        style={{
                          padding: '0.5rem',
                          borderRadius: '6px',
                          border: selected ? `2px solid ${COLORS.PRIMARY_MEDIUM}` : '1px solid #e5e7eb',
                          backgroundColor: isReserved ? '#f3f4f6' : (selected ? COLORS.PRIMARY_LIGHT : COLORS.WHITE),
                          color: isReserved ? '#9ca3af' : (selected ? COLORS.WHITE : COLORS.PRIMARY_DARK),
                          fontSize: '0.85rem',
                          fontWeight: selected ? '600' : '500',
                          cursor: isReserved ? 'not-allowed' : 'pointer',
                          transition: 'all 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.25rem',
                          opacity: isReserved ? 0.7 : 1
                        }}
                        onMouseEnter={(e) => {
                          if (!selected && !isReserved) {
                            e.currentTarget.style.backgroundColor = '#f3f4f6';
                            e.currentTarget.style.borderColor = COLORS.PRIMARY_MEDIUM;
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!selected && !isReserved) {
                            e.currentTarget.style.backgroundColor = COLORS.WHITE;
                            e.currentTarget.style.borderColor = '#e5e7eb';
                          }
                        }}
                      >
                        <Clock size={14} />
                        {slot.hora_inicio}
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AppointmentCalendar;

