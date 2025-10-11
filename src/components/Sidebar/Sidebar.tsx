import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  MessageSquare,
  Users,
  FileText,
  BarChart3,
  Settings,
  UserCircle,
  LogOut,
  Stethoscope
} from 'lucide-react';
import { COLORS } from '../../const/colors';
import { ROUTES } from '../../const/routes';
import { getUser, clearSession } from '../../services/localstorage';

interface SidebarProps {
  isCollapsed?: boolean;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();

  const menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard size={22} />,
      path: ROUTES.professionalDashboard
    },
    {
      id: 'calendar',
      label: 'Agenda',
      icon: <Calendar size={22} />,
      path: ROUTES.professionalCalendar
    },
    {
      id: 'appointments',
      label: 'Turnos',
      icon: <FileText size={22} />,
      path: ROUTES.professionalAppointments
    },
    {
      id: 'patients',
      label: 'Pacientes',
      icon: <Users size={22} />,
      path: ROUTES.professionalPatients
    },
    {
      id: 'messages',
      label: 'Mensajes',
      icon: <MessageSquare size={22} />,
      path: ROUTES.professionalMessages
    },
    {
      id: 'statistics',
      label: 'Estadísticas',
      icon: <BarChart3 size={22} />,
      path: ROUTES.professionalStatistics
    }
  ];

  const handleLogout = () => {
    clearSession();
    navigate(ROUTES.login);
  };

  const isActive = (path: string) => location.pathname === path;

  const getDisplayName = () => {
    if (user?.nombre || user?.firstName) {
      return user.nombre || user.firstName;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'Profesional';
  };

  const getSpecialty = () => {
    return user?.especialidad || 'Profesional de la salud';
  };

  return (
    <div
      style={{
        width: isCollapsed ? '80px' : '280px',
        height: '100vh',
        backgroundColor: COLORS.PRIMARY_DARK,
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        left: 0,
        top: 0,
        transition: 'width 0.3s ease',
        boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
        zIndex: 1000
      }}
    >
      {/* Header con logo */}
      <div
        style={{
          padding: '1.5rem',
          borderBottom: `1px solid ${COLORS.PRIMARY_MEDIUM}`,
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            backgroundColor: COLORS.PRIMARY_CYAN,
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Stethoscope size={24} color={COLORS.WHITE} />
        </div>
        {!isCollapsed && (
          <div>
            <h1 style={{ 
              color: COLORS.WHITE, 
              fontSize: '1.25rem', 
              fontWeight: 'bold',
              margin: 0
            }}>
              MediTurnos
            </h1>
            <p style={{ 
              color: COLORS.PRIMARY_CYAN, 
              fontSize: '0.75rem',
              margin: 0
            }}>
              Profesional
            </p>
          </div>
        )}
      </div>

      {/* Perfil del usuario */}
      <div
        style={{
          padding: '1.5rem',
          borderBottom: `1px solid ${COLORS.PRIMARY_MEDIUM}`,
          cursor: 'pointer',
          transition: 'background-color 0.2s'
        }}
        onClick={() => navigate(ROUTES.professionalProfile)}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: COLORS.PRIMARY_CYAN,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <UserCircle size={28} color={COLORS.WHITE} />
          </div>
          {!isCollapsed && (
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <p style={{ 
                color: COLORS.WHITE, 
                fontSize: '0.95rem',
                fontWeight: '600',
                margin: 0,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                Dr. {getDisplayName()}
              </p>
              <p style={{ 
                color: COLORS.PRIMARY_CYAN, 
                fontSize: '0.8rem',
                margin: 0,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {getSpecialty()}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Menú de navegación */}
      <nav style={{ flex: 1, padding: '1rem 0', overflowY: 'auto' }}>
        {menuItems.map((item) => {
          const active = isActive(item.path);
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              style={{
                width: '100%',
                padding: isCollapsed ? '1rem' : '1rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                backgroundColor: active ? COLORS.PRIMARY_MEDIUM : 'transparent',
                color: active ? COLORS.WHITE : COLORS.PRIMARY_CYAN,
                border: 'none',
                borderLeft: active ? `4px solid ${COLORS.PRIMARY_CYAN}` : '4px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontSize: '0.95rem',
                fontWeight: active ? '600' : '400',
                justifyContent: isCollapsed ? 'center' : 'flex-start'
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.color = COLORS.WHITE;
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = COLORS.PRIMARY_CYAN;
                }
              }}
            >
              {item.icon}
              {!isCollapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Footer con configuración y logout */}
      <div style={{ borderTop: `1px solid ${COLORS.PRIMARY_MEDIUM}` }}>
        <button
          onClick={() => navigate(ROUTES.professionalSettings)}
          style={{
            width: '100%',
            padding: isCollapsed ? '1rem' : '1rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            backgroundColor: 'transparent',
            color: COLORS.PRIMARY_CYAN,
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s',
            fontSize: '0.95rem',
            justifyContent: isCollapsed ? 'center' : 'flex-start'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
            e.currentTarget.style.color = COLORS.WHITE;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = COLORS.PRIMARY_CYAN;
          }}
        >
          <Settings size={22} />
          {!isCollapsed && <span>Configuración</span>}
        </button>

        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            padding: isCollapsed ? '1rem' : '1rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            backgroundColor: 'transparent',
            color: '#ef4444',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s',
            fontSize: '0.95rem',
            fontWeight: '500',
            justifyContent: isCollapsed ? 'center' : 'flex-start'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <LogOut size={22} />
          {!isCollapsed && <span>Cerrar Sesión</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;


