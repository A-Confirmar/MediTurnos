import React, { useState, useMemo } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import AvailabilityScheduler from '../../components/AvailabilityScheduler/AvailabilityScheduler';
import { useSetAvailability, type WeekAvailability } from '../../services/auth/useSetAvailability';
import { useGetProfessionalAvailability, convertToWeekAvailability } from '../../services/appointments/useGetProfessionalAvailability';

const ProfessionalAvailability: React.FC = () => {
  const { mutateAsync: setAvailability, isPending, isError, error, isSuccess } = useSetAvailability();
  const { data: availabilityData, isLoading: loadingAvailability } = useGetProfessionalAvailability();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Convertir los datos del backend al formato del componente
  const initialAvailability = useMemo(() => {
    if (!availabilityData?.disponibilidad) {
      console.log('⚠️ No hay datos de disponibilidad');
      return {};
    }
    
    console.log('📥 Datos crudos del backend:', availabilityData.disponibilidad);
    const converted = convertToWeekAvailability(availabilityData.disponibilidad);
    console.log('📦 Disponibilidad convertida para el componente:', converted);
    
    // Log detallado de cada día
    Object.entries(converted).forEach(([day, slots]) => {
      console.log(`📅 ${day}:`, slots);
    });
    
    return converted;
  }, [availabilityData]);

  const handleSave = async (availability: WeekAvailability) => {
    try {
      console.log('💾 Guardando disponibilidad:', availability);
      
      await setAvailability({ horarios: availability });
      
      // Mostrar mensaje de éxito
      setShowSuccessMessage(true);
      
      // Ocultar mensaje después de 5 segundos
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
      
      // Scroll al top para ver el mensaje
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Error al guardar disponibilidad:', err);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
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
            color: '#15803d',
            fontSize: '1rem',
            fontWeight: '500',
            animation: 'slideDown 0.3s ease-out'
          }}>
            <CheckCircle size={24} />
            <div>
              <p style={{ margin: 0, fontWeight: '600' }}>¡Disponibilidad guardada correctamente!</p>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', fontWeight: '400' }}>
                Tus horarios de atención han sido actualizados.
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
            color: '#dc2626',
            fontSize: '1rem',
            fontWeight: '500'
          }}>
            <AlertCircle size={24} />
            <div>
              <p style={{ margin: 0, fontWeight: '600' }}>Error al guardar disponibilidad</p>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', fontWeight: '400' }}>
                {error instanceof Error ? error.message : 'Por favor, intenta nuevamente'}
              </p>
            </div>
          </div>
        )}

        {/* Mostrar loading mientras carga la disponibilidad */}
        {loadingAvailability ? (
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
              borderTopColor: '#3b82f6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem'
            }} />
            <p style={{ margin: 0, fontSize: '1rem', color: '#6b7280' }}>
              Cargando tu disponibilidad...
            </p>
          </div>
        ) : (
          /* Componente principal con disponibilidad cargada */
          <AvailabilityScheduler
            initialAvailability={initialAvailability}
            onSave={handleSave}
            isLoading={isPending}
          />
        )}
      </div>

      {/* Estilos para animaciones */}
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ProfessionalAvailability;

