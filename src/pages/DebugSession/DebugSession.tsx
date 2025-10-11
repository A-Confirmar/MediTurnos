import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, getUserRole, getAccessToken, clearSession } from '../../services/localstorage';
import { ROUTES } from '../../const/routes';
import { COLORS } from '../../const/colors';

const DebugSession: React.FC = () => {
  const navigate = useNavigate();
  const [sessionData, setSessionData] = useState({
    user: null as any,
    role: null as string | null,
    token: null as string | null
  });

  useEffect(() => {
    const loadSessionData = async () => {
      const user = getUser();
      const role = await getUserRole();
      const token = await getAccessToken();
      
      setSessionData({ user, role, token });
    };
    
    loadSessionData();
  }, []);

  const handleClearSession = () => {
    clearSession();
    navigate(ROUTES.login);
  };

  const handleNavigateToProfessional = () => {
    navigate(ROUTES.professionalDashboard);
  };

  return (
    <div style={{ 
      padding: '2rem', 
      backgroundColor: '#f9fafb', 
      minHeight: '100vh',
      fontFamily: 'monospace'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: 'bold', 
          color: COLORS.PRIMARY_DARK,
          marginBottom: '2rem'
        }}>
          🔍 Debug de Sesión
        </h1>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '1rem'
        }}>
          <h2 style={{ 
            fontSize: '1.25rem', 
            fontWeight: 'bold', 
            color: COLORS.PRIMARY_DARK,
            marginBottom: '1rem'
          }}>
            📋 Datos de LocalStorage
          </h2>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ 
              fontSize: '1rem', 
              fontWeight: 'bold', 
              color: COLORS.PRIMARY_MEDIUM,
              marginBottom: '0.5rem'
            }}>
              🔑 Token:
            </h3>
            <pre style={{
              backgroundColor: '#f3f4f6',
              padding: '1rem',
              borderRadius: '8px',
              overflow: 'auto',
              fontSize: '0.875rem'
            }}>
              {sessionData.token ? `${sessionData.token.substring(0, 50)}...` : 'No hay token'}
            </pre>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ 
              fontSize: '1rem', 
              fontWeight: 'bold', 
              color: COLORS.PRIMARY_MEDIUM,
              marginBottom: '0.5rem'
            }}>
              🎭 Rol:
            </h3>
            <pre style={{
              backgroundColor: '#f3f4f6',
              padding: '1rem',
              borderRadius: '8px',
              overflow: 'auto',
              fontSize: '0.875rem'
            }}>
              {sessionData.role || 'No hay rol guardado'}
            </pre>
            <div style={{
              marginTop: '0.5rem',
              padding: '0.5rem',
              borderRadius: '6px',
              backgroundColor: sessionData.role === 'profesional' ? '#d1fae5' : '#fef3c7',
              color: sessionData.role === 'profesional' ? '#065f46' : '#92400e'
            }}>
              {sessionData.role === 'profesional' && '✅ Rol de PROFESIONAL detectado'}
              {sessionData.role === 'paciente' && '⚠️ Rol de PACIENTE detectado'}
              {!sessionData.role && '❌ No se detectó ningún rol'}
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ 
              fontSize: '1rem', 
              fontWeight: 'bold', 
              color: COLORS.PRIMARY_MEDIUM,
              marginBottom: '0.5rem'
            }}>
              👤 Usuario:
            </h3>
            <pre style={{
              backgroundColor: '#f3f4f6',
              padding: '1rem',
              borderRadius: '8px',
              overflow: 'auto',
              fontSize: '0.875rem',
              maxHeight: '300px'
            }}>
              {JSON.stringify(sessionData.user, null, 2) || 'No hay usuario'}
            </pre>
            {sessionData.user?.rol && (
              <div style={{
                marginTop: '0.5rem',
                padding: '0.5rem',
                borderRadius: '6px',
                backgroundColor: '#e0f2fe',
                color: '#0c4a6e'
              }}>
                📌 Rol en objeto usuario: <strong>{sessionData.user.rol}</strong>
              </div>
            )}
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '1rem'
        }}>
          <button
            onClick={handleNavigateToProfessional}
            style={{
              padding: '1rem',
              backgroundColor: COLORS.PRIMARY_CYAN,
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            Ir a Dashboard Profesional
          </button>

          <button
            onClick={() => navigate(ROUTES.home)}
            style={{
              padding: '1rem',
              backgroundColor: COLORS.PRIMARY_MEDIUM,
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            Ir a Home
          </button>

          <button
            onClick={handleClearSession}
            style={{
              padding: '1rem',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            Cerrar Sesión
          </button>
        </div>

        <div style={{
          backgroundColor: '#fef3c7',
          border: '1px solid #f59e0b',
          borderRadius: '8px',
          padding: '1rem',
          marginTop: '2rem'
        }}>
          <h3 style={{ 
            fontSize: '1rem', 
            fontWeight: 'bold', 
            color: '#92400e',
            marginBottom: '0.5rem'
          }}>
            💡 Diagnóstico:
          </h3>
          <ul style={{ 
            margin: 0, 
            paddingLeft: '1.5rem',
            color: '#78350f'
          }}>
            {!sessionData.token && <li>❌ No hay token de autenticación</li>}
            {sessionData.token && <li>✅ Token de autenticación presente</li>}
            
            {!sessionData.role && !sessionData.user?.rol && (
              <li>❌ No se encontró rol en localStorage ni en el objeto usuario</li>
            )}
            {sessionData.role === 'profesional' && (
              <li>✅ Rol de profesional encontrado en localStorage</li>
            )}
            {sessionData.user?.rol === 'profesional' && (
              <li>✅ Rol de profesional encontrado en objeto usuario</li>
            )}
            
            {sessionData.role === 'paciente' && (
              <li>⚠️ Rol de paciente encontrado - debería ser profesional</li>
            )}
          </ul>
        </div>

        <div style={{
          backgroundColor: '#e0f2fe',
          border: '1px solid #0ea5e9',
          borderRadius: '8px',
          padding: '1rem',
          marginTop: '1rem'
        }}>
          <h3 style={{ 
            fontSize: '1rem', 
            fontWeight: 'bold', 
            color: '#0c4a6e',
            marginBottom: '0.5rem'
          }}>
            🔧 Soluciones:
          </h3>
          <ol style={{ 
            margin: 0, 
            paddingLeft: '1.5rem',
            color: '#075985'
          }}>
            <li>Si no hay rol guardado, cierra sesión y vuelve a iniciar sesión</li>
            <li>Si ves "paciente" pero te registraste como profesional, verifica el backend</li>
            <li>Si todo parece correcto pero no funciona, limpia el localStorage del navegador</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default DebugSession;


