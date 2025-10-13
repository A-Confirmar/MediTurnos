import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Clock, Save, AlertCircle } from 'lucide-react';
import { COLORS } from '../../const/colors';
import type { WeekAvailability } from '../../services/auth/useSetAvailability';

interface AvailabilitySchedulerProps {
  initialAvailability?: WeekAvailability;
  onSave: (availability: WeekAvailability) => void;
  isLoading?: boolean;
}

const daysOfWeek = [
  { key: 'lunes', label: 'Lunes' },
  { key: 'martes', label: 'Martes' },
  { key: 'miercoles', label: 'Miércoles' },
  { key: 'jueves', label: 'Jueves' },
  { key: 'viernes', label: 'Viernes' },
  { key: 'sabado', label: 'Sábado' },
  { key: 'domingo', label: 'Domingo' },
] as const;

type DayKey = typeof daysOfWeek[number]['key'];

const AvailabilityScheduler: React.FC<AvailabilitySchedulerProps> = ({
  initialAvailability = {},
  onSave,
  isLoading = false,
}) => {
  const [availability, setAvailability] = useState<WeekAvailability>(initialAvailability);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Actualizar el estado cuando cambie initialAvailability (cuando lleguen datos del backend)
  useEffect(() => {
    console.log('🔄 useEffect: initialAvailability cambió:', initialAvailability);
    setAvailability(initialAvailability);
  }, [initialAvailability]);

  // Agregar un nuevo bloque horario a un día
  const addTimeSlot = (day: DayKey) => {
    setAvailability(prev => ({
      ...prev,
      [day]: [...(prev[day] || []), { inicio: '09:00', fin: '18:00' }]
    }));
  };

  // Eliminar un bloque horario
  const removeTimeSlot = (day: DayKey, index: number) => {
    setAvailability(prev => {
      const daySlots = prev[day] || [];
      const newSlots = daySlots.filter((_, i) => i !== index);
      return {
        ...prev,
        [day]: newSlots.length > 0 ? newSlots : undefined
      };
    });
  };

  // Actualizar un horario específico
  const updateTimeSlot = (day: DayKey, index: number, field: 'inicio' | 'fin', value: string) => {
    setAvailability(prev => {
      const daySlots = [...(prev[day] || [])];
      daySlots[index] = { ...daySlots[index], [field]: value };
      return { ...prev, [day]: daySlots };
    });
    
    // Limpiar error si existe
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[`${day}-${index}`];
      return newErrors;
    });
  };

  // Validar horarios antes de guardar
  const validateAvailability = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    Object.entries(availability).forEach(([day, slots]) => {
      if (!slots || slots.length === 0) return;

      slots.forEach((slot: { inicio: string; fin: string }, index: number) => {
        if (slot.inicio >= slot.fin) {
          newErrors[`${day}-${index}`] = 'La hora de inicio debe ser menor que la de fin';
          isValid = false;
        }
      });
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSave = () => {
    if (validateAvailability()) {
      onSave(availability);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        marginBottom: '2rem',
        padding: '1.5rem',
        backgroundColor: COLORS.WHITE,
        borderRadius: '8px',
        borderLeft: `4px solid ${COLORS.PRIMARY_MEDIUM}`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <Clock size={24} style={{ color: COLORS.PRIMARY_MEDIUM }} />
          <h2 style={{ margin: 0, fontSize: '1.5rem', color: COLORS.PRIMARY_DARK }}>
            Configurar Disponibilidad
          </h2>
        </div>
        <p style={{ margin: 0, color: '#6b7280', fontSize: '0.95rem' }}>
          Establece tus horarios de atención para cada día de la semana. Puedes agregar múltiples bloques horarios por día.
        </p>
      </div>

      {/* Días de la semana */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {daysOfWeek.map(({ key, label }) => {
          const daySlots = availability[key] || [];
          const hasSlots = daySlots.length > 0;

          return (
            <div
              key={key}
              style={{
                backgroundColor: COLORS.WHITE,
                padding: '1.5rem',
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                border: hasSlots ? `2px solid ${COLORS.PRIMARY_LIGHT}` : '2px solid #e5e7eb'
              }}
            >
              {/* Encabezado del día */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: daySlots.length > 0 ? '1rem' : 0
              }}>
                <h3 style={{
                  margin: 0,
                  fontSize: '1.1rem',
                  color: COLORS.PRIMARY_DARK,
                  fontWeight: '600'
                }}>
                  {label}
                </h3>
                <button
                  type="button"
                  onClick={() => addTimeSlot(key)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    backgroundColor: COLORS.PRIMARY_MEDIUM,
                    color: COLORS.WHITE,
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.PRIMARY_DARK}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = COLORS.PRIMARY_MEDIUM}
                >
                  <Plus size={16} />
                  Agregar horario
                </button>
              </div>

              {/* Bloques horarios */}
              {daySlots.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {daySlots.map((slot, index) => (
                    <div key={index}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        padding: '0.75rem',
                        backgroundColor: '#f9fafb',
                        borderRadius: '6px'
                      }}>
                        {/* Hora inicio */}
                        <div style={{ flex: 1 }}>
                          <label style={{
                            display: 'block',
                            fontSize: '0.85rem',
                            color: '#6b7280',
                            marginBottom: '0.25rem'
                          }}>
                            Inicio
                          </label>
                          <input
                            type="time"
                            value={slot.inicio}
                            onChange={(e) => updateTimeSlot(key, index, 'inicio', e.target.value)}
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

                        {/* Separador */}
                        <div style={{ color: '#9ca3af', paddingTop: '1.5rem' }}>—</div>

                        {/* Hora fin */}
                        <div style={{ flex: 1 }}>
                          <label style={{
                            display: 'block',
                            fontSize: '0.85rem',
                            color: '#6b7280',
                            marginBottom: '0.25rem'
                          }}>
                            Fin
                          </label>
                          <input
                            type="time"
                            value={slot.fin}
                            onChange={(e) => updateTimeSlot(key, index, 'fin', e.target.value)}
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

                        {/* Botón eliminar */}
                        <button
                          type="button"
                          onClick={() => removeTimeSlot(key, index)}
                          style={{
                            padding: '0.5rem',
                            backgroundColor: '#fee2e2',
                            color: '#dc2626',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            marginTop: '1.5rem',
                            transition: 'background-color 0.2s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fecaca'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
                          title="Eliminar horario"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      {/* Error de validación */}
                      {errors[`${key}-${index}`] && (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          marginTop: '0.5rem',
                          padding: '0.5rem',
                          backgroundColor: '#fef2f2',
                          borderRadius: '4px',
                          color: '#dc2626',
                          fontSize: '0.85rem'
                        }}>
                          <AlertCircle size={16} />
                          {errors[`${key}-${index}`]}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Mensaje cuando no hay horarios */}
              {daySlots.length === 0 && (
                <p style={{
                  margin: '0.75rem 0 0 0',
                  color: '#9ca3af',
                  fontSize: '0.9rem',
                  fontStyle: 'italic'
                }}>
                  Sin horarios configurados
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Botón guardar */}
      <div style={{
        marginTop: '2rem',
        padding: '1.5rem',
        backgroundColor: COLORS.WHITE,
        borderRadius: '8px',
        display: 'flex',
        justifyContent: 'flex-end'
      }}>
        <button
          type="button"
          onClick={handleSave}
          disabled={isLoading}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 2rem',
            backgroundColor: isLoading ? '#9ca3af' : '#16a34a',
            color: COLORS.WHITE,
            border: 'none',
            borderRadius: '6px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => {
            if (!isLoading) e.currentTarget.style.backgroundColor = '#15803d';
          }}
          onMouseLeave={(e) => {
            if (!isLoading) e.currentTarget.style.backgroundColor = '#16a34a';
          }}
        >
          <Save size={20} />
          {isLoading ? 'Guardando...' : 'Guardar Disponibilidad'}
        </button>
      </div>
    </div>
  );
};

export default AvailabilityScheduler;

