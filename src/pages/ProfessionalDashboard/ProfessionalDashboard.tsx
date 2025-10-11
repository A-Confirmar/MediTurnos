import React from 'react';
import {
  Calendar,
  Users,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { COLORS } from '../../const/colors';
import { getUser } from '../../services/localstorage';

const ProfessionalDashboard: React.FC = () => {
  const user = getUser();

  const getDisplayName = () => {
    if (user?.nombre || user?.firstName) {
      return user.nombre || user.firstName;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'Profesional';
  };

  // Datos de ejemplo - en producción vendrían de la API
  const stats = [
    {
      id: 'today-appointments',
      title: 'Turnos Hoy',
      value: '8',
      icon: <Calendar size={28} />,
      color: COLORS.PRIMARY_CYAN,
      bgColor: '#e0f2fe',
      change: '+2 vs ayer'
    },
    {
      id: 'total-patients',
      title: 'Pacientes Activos',
      value: '156',
      icon: <Users size={28} />,
      color: '#10b981',
      bgColor: '#d1fae5',
      change: '+12 este mes'
    },
    {
      id: 'completed',
      title: 'Completados',
      value: '45',
      icon: <CheckCircle2 size={28} />,
      color: '#8b5cf6',
      bgColor: '#ede9fe',
      change: 'Esta semana'
    },
    {
      id: 'rating',
      title: 'Calificación',
      value: '4.8',
      icon: <TrendingUp size={28} />,
      color: '#f59e0b',
      bgColor: '#fef3c7',
      change: '⭐ Excelente'
    }
  ];

  const upcomingAppointments = [
    {
      id: 1,
      time: '09:00',
      patient: 'María González',
      type: 'Consulta General',
      status: 'pending'
    },
    {
      id: 2,
      time: '10:30',
      patient: 'Juan Pérez',
      type: 'Seguimiento',
      status: 'pending'
    },
    {
      id: 3,
      time: '11:45',
      patient: 'Ana Martínez',
      type: 'Primera Consulta',
      status: 'pending'
    },
    {
      id: 4,
      time: '14:00',
      patient: 'Carlos Rodríguez',
      type: 'Control',
      status: 'pending'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'completed',
      message: 'Consulta completada con Pedro Sánchez',
      time: 'Hace 15 min'
    },
    {
      id: 2,
      type: 'new',
      message: 'Nuevo turno solicitado por Laura Torres',
      time: 'Hace 1 hora'
    },
    {
      id: 3,
      type: 'cancelled',
      message: 'Turno cancelado - Diego López',
      time: 'Hace 2 horas'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'completed':
        return <CheckCircle2 size={18} color="#10b981" />;
      case 'new':
        return <AlertCircle size={18} color={COLORS.PRIMARY_CYAN} />;
      case 'cancelled':
        return <XCircle size={18} color="#ef4444" />;
      default:
        return <Clock size={18} />;
    }
  };

  return (
    <div style={{ padding: '2rem', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: 'bold', 
          color: COLORS.PRIMARY_DARK,
          margin: '0 0 0.5rem 0'
        }}>
          ¡Bienvenido, Dr. {getDisplayName()}!
        </h1>
        <p style={{ 
          color: '#6b7280', 
          fontSize: '1rem',
          margin: 0
        }}>
          {new Date().toLocaleDateString('es-ES', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      {/* Tarjetas de estadísticas */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {stats.map((stat) => (
          <div
            key={stat.id}
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ 
                  color: '#6b7280', 
                  fontSize: '0.875rem',
                  margin: '0 0 0.5rem 0',
                  fontWeight: '500'
                }}>
                  {stat.title}
                </p>
                <h3 style={{ 
                  fontSize: '2rem', 
                  fontWeight: 'bold', 
                  color: COLORS.PRIMARY_DARK,
                  margin: '0 0 0.5rem 0'
                }}>
                  {stat.value}
                </h3>
                <p style={{ 
                  color: stat.color, 
                  fontSize: '0.75rem',
                  margin: 0,
                  fontWeight: '500'
                }}>
                  {stat.change}
                </p>
              </div>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '12px',
                backgroundColor: stat.bgColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: stat.color
              }}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Grid de dos columnas */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '1.5rem'
      }}>
        {/* Próximos turnos */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            marginBottom: '1.5rem'
          }}>
            <Calendar size={24} color={COLORS.PRIMARY_CYAN} />
            <h2 style={{ 
              fontSize: '1.25rem', 
              fontWeight: 'bold', 
              color: COLORS.PRIMARY_DARK,
              margin: 0
            }}>
              Próximos Turnos
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {upcomingAppointments.map((appointment) => (
              <div
                key={appointment.id}
                style={{
                  padding: '1rem',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  borderLeft: `4px solid ${COLORS.PRIMARY_CYAN}`,
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f0f9ff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#f9fafb';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ 
                      fontWeight: 'bold', 
                      color: COLORS.PRIMARY_DARK,
                      margin: '0 0 0.25rem 0',
                      fontSize: '1rem'
                    }}>
                      {appointment.patient}
                    </p>
                    <p style={{ 
                      color: '#6b7280', 
                      fontSize: '0.875rem',
                      margin: 0
                    }}>
                      {appointment.type}
                    </p>
                  </div>
                  <div style={{
                    backgroundColor: COLORS.PRIMARY_CYAN,
                    color: 'white',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    fontSize: '0.875rem'
                  }}>
                    {appointment.time}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            style={{
              width: '100%',
              marginTop: '1rem',
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
            Ver Todos los Turnos
          </button>
        </div>

        {/* Actividad reciente */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            marginBottom: '1.5rem'
          }}>
            <Clock size={24} color={COLORS.PRIMARY_CYAN} />
            <h2 style={{ 
              fontSize: '1.25rem', 
              fontWeight: 'bold', 
              color: COLORS.PRIMARY_DARK,
              margin: 0
            }}>
              Actividad Reciente
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                style={{
                  padding: '1rem',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'flex-start'
                }}
              >
                <div style={{ paddingTop: '0.25rem' }}>
                  {getActivityIcon(activity.type)}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ 
                    color: COLORS.PRIMARY_DARK,
                    margin: '0 0 0.25rem 0',
                    fontSize: '0.9rem'
                  }}>
                    {activity.message}
                  </p>
                  <p style={{ 
                    color: '#9ca3af', 
                    fontSize: '0.75rem',
                    margin: 0
                  }}>
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <button
            style={{
              width: '100%',
              marginTop: '1rem',
              padding: '0.75rem',
              backgroundColor: 'white',
              color: COLORS.PRIMARY_CYAN,
              border: `2px solid ${COLORS.PRIMARY_CYAN}`,
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = COLORS.PRIMARY_CYAN;
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'white';
              e.currentTarget.style.color = COLORS.PRIMARY_CYAN;
            }}
          >
            Ver Todas las Actividades
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalDashboard;


