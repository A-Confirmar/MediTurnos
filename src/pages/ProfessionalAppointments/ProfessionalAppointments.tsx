import React from 'react';
import { FileText } from 'lucide-react';
import { COLORS } from '../../const/colors';

const ProfessionalAppointments: React.FC = () => {
  return (
    <div style={{ padding: '2rem', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <FileText size={32} color={COLORS.PRIMARY_CYAN} />
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: 'bold', 
          color: COLORS.PRIMARY_DARK,
          margin: 0
        }}>
          Mis Turnos
        </h1>
      </div>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '3rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <FileText size={64} color={COLORS.PRIMARY_CYAN} style={{ margin: '0 auto 1rem' }} />
        <h2 style={{ color: COLORS.PRIMARY_DARK, marginBottom: '1rem' }}>
          Gestión de Turnos
        </h2>
        <p style={{ color: '#6b7280' }}>
          Visualiza y gestiona todos los turnos que han reservado tus pacientes.
        </p>
        
        {/* Leyenda de estados de turnos */}
        <div style={{
          marginTop: '2rem',
          padding: '1.5rem',
          backgroundColor: '#f8fafc',
          borderRadius: '8px',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{
            fontSize: '1rem',
            fontWeight: '600',
            color: COLORS.PRIMARY_DARK,
            marginBottom: '1rem',
            textAlign: 'left'
          }}>
            Estados de Turnos
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            textAlign: 'left'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: '#f59e0b'
              }} />
              <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                Pendiente
              </span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: '#10b981'
              }} />
              <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                Confirmado
              </span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: '#ef4444'
              }} />
              <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                Cancelado
              </span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: '#6b7280'
              }} />
              <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                Completado
              </span>
            </div>
          </div>
          
          <div style={{
            marginTop: '1rem',
            padding: '0.75rem',
            backgroundColor: '#fef3c7',
            borderRadius: '6px',
            border: '1px solid #fde68a'
          }}>
            <p style={{
              fontSize: '0.8rem',
              color: '#92400e',
              margin: 0,
              fontStyle: 'italic'
            }}>
              💡 Los turnos se muestran automáticamente según su estado actual. 
              Puedes gestionar tu disponibilidad desde la sección "Disponibilidad".
            </p>
          </div>
        </div>
        
        <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginTop: '1rem' }}>
          Próximamente disponible
        </p>
      </div>
    </div>
  );
};

export default ProfessionalAppointments;
