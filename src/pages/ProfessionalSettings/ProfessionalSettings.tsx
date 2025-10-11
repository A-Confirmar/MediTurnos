import React from 'react';
import { Settings } from 'lucide-react';
import { COLORS } from '../../const/colors';

const ProfessionalSettings: React.FC = () => {
  return (
    <div style={{ padding: '2rem', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <Settings size={32} color={COLORS.PRIMARY_CYAN} />
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: 'bold', 
          color: COLORS.PRIMARY_DARK,
          margin: 0
        }}>
          Configuración
        </h1>
      </div>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '3rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <Settings size={64} color={COLORS.PRIMARY_CYAN} style={{ margin: '0 auto 1rem' }} />
        <h2 style={{ color: COLORS.PRIMARY_DARK, marginBottom: '1rem' }}>
          Configuración de Cuenta
        </h2>
        <p style={{ color: '#6b7280' }}>
          Gestiona tus preferencias, notificaciones y ajustes de privacidad.
        </p>
        <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginTop: '1rem' }}>
          Próximamente disponible
        </p>
      </div>
    </div>
  );
};

export default ProfessionalSettings;


