import React from 'react';
import { MessageSquare } from 'lucide-react';
import { COLORS } from '../../const/colors';

const ProfessionalMessages: React.FC = () => {
  return (
    <div style={{ padding: '2rem', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <MessageSquare size={32} color={COLORS.PRIMARY_CYAN} />
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: 'bold', 
          color: COLORS.PRIMARY_DARK,
          margin: 0
        }}>
          Mensajes
        </h1>
      </div>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '3rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <MessageSquare size={64} color={COLORS.PRIMARY_CYAN} style={{ margin: '0 auto 1rem' }} />
        <h2 style={{ color: COLORS.PRIMARY_DARK, marginBottom: '1rem' }}>
          Centro de Mensajes
        </h2>
        <p style={{ color: '#6b7280' }}>
          Comunícate con tus pacientes de manera segura y privada.
        </p>
        <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginTop: '1rem' }}>
          Próximamente disponible
        </p>
      </div>
    </div>
  );
};

export default ProfessionalMessages;


