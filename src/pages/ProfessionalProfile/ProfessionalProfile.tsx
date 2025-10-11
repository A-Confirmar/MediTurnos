import React from 'react';
import { UserCircle } from 'lucide-react';
import { COLORS } from '../../const/colors';
import { getUser } from '../../services/localstorage';

const ProfessionalProfile: React.FC = () => {
  const user = getUser();

  const getFullName = () => {
    if (user?.nombre && user?.apellido) {
      return `${user.nombre} ${user.apellido}`;
    }
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.email || 'Profesional';
  };

  return (
    <div style={{ padding: '2rem', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <UserCircle size={32} color={COLORS.PRIMARY_CYAN} />
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: 'bold', 
          color: COLORS.PRIMARY_DARK,
          margin: 0
        }}>
          Mi Perfil
        </h1>
      </div>

      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '2rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        maxWidth: '800px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem' }}>
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            backgroundColor: COLORS.PRIMARY_CYAN,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <UserCircle size={64} color="white" />
          </div>
          <div>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: 'bold', 
              color: COLORS.PRIMARY_DARK,
              margin: '0 0 0.5rem 0'
            }}>
              Dr. {getFullName()}
            </h2>
            <p style={{ color: '#6b7280', margin: 0 }}>
              {user?.especialidad || 'Profesional de la salud'}
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gap: '1rem' }}>
          <div style={{ 
            padding: '1rem', 
            backgroundColor: '#f9fafb', 
            borderRadius: '8px' 
          }}>
            <p style={{ 
              color: '#6b7280', 
              fontSize: '0.875rem', 
              margin: '0 0 0.25rem 0',
              fontWeight: '500'
            }}>
              Email
            </p>
            <p style={{ 
              color: COLORS.PRIMARY_DARK, 
              margin: 0,
              fontSize: '1rem'
            }}>
              {user?.email}
            </p>
          </div>

          {user?.telefono && (
            <div style={{ 
              padding: '1rem', 
              backgroundColor: '#f9fafb', 
              borderRadius: '8px' 
            }}>
              <p style={{ 
                color: '#6b7280', 
                fontSize: '0.875rem', 
                margin: '0 0 0.25rem 0',
                fontWeight: '500'
              }}>
                Teléfono
              </p>
              <p style={{ 
                color: COLORS.PRIMARY_DARK, 
                margin: 0,
                fontSize: '1rem'
              }}>
                {user.telefono}
              </p>
            </div>
          )}

          {user?.descripcion && (
            <div style={{ 
              padding: '1rem', 
              backgroundColor: '#f9fafb', 
              borderRadius: '8px' 
            }}>
              <p style={{ 
                color: '#6b7280', 
                fontSize: '0.875rem', 
                margin: '0 0 0.25rem 0',
                fontWeight: '500'
              }}>
                Descripción
              </p>
              <p style={{ 
                color: COLORS.PRIMARY_DARK, 
                margin: 0,
                fontSize: '1rem'
              }}>
                {user.descripcion}
              </p>
            </div>
          )}
        </div>

        <button
          style={{
            marginTop: '2rem',
            width: '100%',
            padding: '0.75rem',
            backgroundColor: COLORS.PRIMARY_CYAN,
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'opacity 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.9';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1';
          }}
        >
          Editar Perfil
        </button>
      </div>
    </div>
  );
};

export default ProfessionalProfile;


