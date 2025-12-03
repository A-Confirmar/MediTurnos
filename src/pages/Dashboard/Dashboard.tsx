import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, Stethoscope, Hand, CheckCircle2 } from 'lucide-react';
import { getUser, clearSession } from '../../services/localstorage';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = getUser();

  // Función para obtener el nombre a mostrar
  const getDisplayName = () => {
    // Prioridad 1: nombre en español (backend)
    if (user?.nombre) {
      return user.nombre;
    }
    // Prioridad 2: firstName en inglés (por compatibilidad)
    if (user?.firstName) {
      return user.firstName;
    }
    // Prioridad 3: name genérico
    if (user?.name) {
      return user.name;
    }
    // Último recurso: email
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'Usuario';
  };

  // Función para obtener nombre completo del backend
  const getFullName = () => {
    // Prioridad 1: nombre y apellido en español (backend)
    if (user?.nombre && user?.apellido) {
      return `${user.nombre} ${user.apellido}`;
    }
    // Prioridad 2: firstName y lastName en inglés (por compatibilidad)
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return null;
  };

  const handleLogout = () => {
    clearSession();
    navigate('/login');
  };
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#ffffff',
      padding: '2rem',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <header style={{ 
          backgroundColor: '#072769', 
          color: 'white',
          padding: '1rem 2rem',
          borderRadius: '8px',
          marginBottom: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{ margin: 0, fontSize: '1.5rem' }}>
            Dashboard MediTurnos
          </h1>
          <button 
            onClick={handleLogout}
            style={{
              color: 'white',
              backgroundColor: 'transparent',
              border: '1px solid white',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            Cerrar Sesión
          </button>
        </header>

        {/* Bienvenida con datos del usuario */}
        <div style={{
          backgroundColor: '#f0fdf4',
          border: '1px solid #22c55e',
          borderLeft: '4px solid #22c55e',
          padding: '1.5rem',
          borderRadius: '8px',
          marginBottom: '2rem'
        }}>
          <h2 style={{ 
            color: '#16a34a', 
            margin: '0 0 1rem 0',
            fontSize: '1.2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Hand size={24} />
            ¡Bienvenido {getDisplayName()}!
          </h2>
          <div style={{ fontSize: '0.9rem', color: '#15803d' }}>
            <p><strong>Usuario:</strong> {user?.email || 'Usuario'}</p>
            {getFullName() && (
              <p><strong>Nombre:</strong> {getFullName()}</p>
            )}
            <p><strong>Sesión:</strong> Activa desde {new Date().toLocaleDateString('es-ES', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
            <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
              <strong>Estado:</strong> 
              <CheckCircle2 size={16} style={{ color: '#16a34a' }} />
              Conectado
            </p>
          </div>
        </div>

        {/* Tarjetas de funcionalidades */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div style={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: '#075ba4', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={20} />
              Gestión de Turnos
            </h3>
            <p style={{ color: '#6b7280', margin: 0, fontSize: '0.9rem' }}>
              Administra y organiza todas las citas médicas
            </p>
          </div>

          <div style={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: '#075ba4', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={20} />
              Pacientes
            </h3>
            <p style={{ color: '#6b7280', margin: 0, fontSize: '0.9rem' }}>
              Gestiona la información de los pacientes
            </p>
          </div>

          <div style={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '1.5rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: '#075ba4', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Stethoscope size={20} />
              Profesionales
            </h3>
            <p style={{ color: '#6b7280', margin: 0, fontSize: '0.9rem' }}>
              Administra el equipo médico
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;