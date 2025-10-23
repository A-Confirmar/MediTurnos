import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { useGetProfessionalAppointments } from '../../services/appointments/useGetProfessionalAppointments';
import { useGetLinkedPatients } from '../../services/professionals/useGetLinkedPatients';

const ProfessionalDashboard: React.FC = () => {
  const user = getUser();
  const navigate = useNavigate();
  
  // Obtener datos reales del backend
  const { data: appointmentsData, isLoading: loadingAppointments } = useGetProfessionalAppointments();
  const { data: patientsData, isLoading: loadingPatients } = useGetLinkedPatients();
  
  // Calcular estadísticas en tiempo real
  const stats = useMemo(() => {
    const appointments = appointmentsData?.turnos || [];
    const patients = patientsData?.data || [];
    
    const today = new Date();
    const todayString = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;
    
    // Turnos de hoy
    const todayAppointments = appointments.filter(apt => apt.fechaTurno === todayString);
    
    // Turnos completados (esta semana)
    const completedThisWeek = appointments.filter(apt => {
      const aptState = apt.estado.toLowerCase();
      return aptState === 'realizado' || aptState === 'completado';
    }).length;
    
    // Total de pacientes activos
    const totalPatients = patients.length;
    
    return [
      {
        id: 'today-appointments',
        title: 'Turnos Hoy',
        value: todayAppointments.length.toString(),
        icon: <Calendar size={28} />,
        color: COLORS.PRIMARY_CYAN,
        bgColor: '#e0f2fe',
        change: `${todayAppointments.filter(a => a.estado.toLowerCase() === 'confirmado').length} confirmados`
      },
      {
        id: 'total-patients',
        title: 'Pacientes Activos',
        value: totalPatients.toString(),
        icon: <Users size={28} />,
        color: '#10b981',
        bgColor: '#d1fae5',
        change: 'Total vinculados'
      },
      {
        id: 'completed',
        title: 'Completados',
        value: completedThisWeek.toString(),
        icon: <CheckCircle2 size={28} />,
        color: '#8b5cf6',
        bgColor: '#ede9fe',
        change: 'Histórico'
      },
      {
        id: 'total-appointments',
        title: 'Total Turnos',
        value: appointments.length.toString(),
        icon: <TrendingUp size={28} />,
        color: '#f59e0b',
        bgColor: '#fef3c7',
        change: 'Todos los estados'
      }
    ];
  }, [appointmentsData, patientsData]);

  // Próximos turnos de hoy (limitado a 4 para mantener el layout compacto)
  const upcomingAppointments = useMemo(() => {
    const appointments = appointmentsData?.turnos || [];
    const today = new Date();
    const todayString = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;
    
    return appointments
      .filter(apt => {
        const isToday = apt.fechaTurno === todayString;
        const isConfirmed = apt.estado.toLowerCase() === 'confirmado';
        return isToday && isConfirmed;
      })
      .sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio))
      .slice(0, 4)
      .map(apt => ({
        id: apt.turnoId,
        time: apt.hora_inicio.substring(0, 5),
        patient: `${apt.nombrePaciente} ${apt.apellidoPaciente}`,
        type: apt.tipo.charAt(0).toUpperCase() + apt.tipo.slice(1),
        status: apt.estado
      }));
  }, [appointmentsData]);

  // Actividad reciente (últimos turnos - limitado a 3 para no romper el layout)
  const recentActivity = useMemo(() => {
    const appointments = appointmentsData?.turnos || [];
    
    return appointments
      .slice()
      .sort((a, b) => {
        // Ordenar por fecha descendente (más recientes primero)
        const [dayA, monthA, yearA] = a.fechaTurno.split('-');
        const [dayB, monthB, yearB] = b.fechaTurno.split('-');
        const dateA = new Date(parseInt(yearA), parseInt(monthA) - 1, parseInt(dayA));
        const dateB = new Date(parseInt(yearB), parseInt(monthB) - 1, parseInt(dayB));
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, 3)
      .map(apt => {
        const getActivityType = () => {
          const state = apt.estado.toLowerCase();
          if (state === 'realizado' || state === 'completado') return 'completed';
          if (state === 'cancelado') return 'cancelled';
          return 'new';
        };

        const getMessage = () => {
          const state = apt.estado.toLowerCase();
          const patientName = `${apt.nombrePaciente} ${apt.apellidoPaciente}`;
          if (state === 'realizado' || state === 'completado') {
            return `Consulta completada con ${patientName}`;
          }
          if (state === 'cancelado') {
            return `Turno cancelado - ${patientName}`;
          }
          return `Turno ${state} - ${patientName}`;
        };

        return {
          id: apt.turnoId,
          type: getActivityType(),
          message: getMessage(),
          time: apt.fechaTurno
        };
      });
  }, [appointmentsData]);

  const getDisplayName = () => {
    if (user?.nombre || user?.firstName) {
      return user.nombre || user.firstName;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'Profesional';
  };

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

  // Estado de carga
  if (loadingAppointments || loadingPatients) {
    return (
      <div style={{ 
        padding: '2rem', 
        backgroundColor: '#f9fafb', 
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '50px', 
            height: '50px', 
            border: `4px solid ${COLORS.PRIMARY_CYAN}`, 
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }} />
          <p style={{ color: COLORS.PRIMARY_DARK, fontSize: '1.1rem' }}>
            Cargando datos del dashboard...
          </p>
        </div>
      </div>
    );
  }

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
            {upcomingAppointments.length === 0 ? (
              <div style={{
                padding: '2rem',
                textAlign: 'center',
                color: '#6b7280',
                backgroundColor: '#f0f9ff',
                borderRadius: '8px'
              }}>
                <Clock size={32} style={{ margin: '0 auto 0.5rem', opacity: 0.5 }} />
                <p style={{ margin: 0 }}>No hay turnos confirmados para hoy</p>
              </div>
            ) : (
              upcomingAppointments.map((appointment) => (
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
              ))
            )}
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
            onClick={() => navigate('/profesional/agenda')}
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
            {recentActivity.length === 0 ? (
              <div style={{
                padding: '2rem',
                textAlign: 'center',
                color: '#6b7280',
                backgroundColor: '#f0f9ff',
                borderRadius: '8px'
              }}>
                <AlertCircle size={32} style={{ margin: '0 auto 0.5rem', opacity: 0.5 }} />
                <p style={{ margin: 0 }}>No hay actividad reciente</p>
              </div>
            ) : (
              recentActivity.map((activity) => (
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
              ))
            )}
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
            onClick={() => navigate('/profesional/turnos')}
          >
            Ver Todas las Actividades
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalDashboard;


