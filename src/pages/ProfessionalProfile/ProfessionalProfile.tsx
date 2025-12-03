import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, FileText, DollarSign, Calendar } from 'lucide-react';
import { COLORS } from '../../const/colors';
import { getUser } from '../../services/localstorage';
import { useGetUser } from '../../services/auth/useGetUser';
import { ROUTES } from '../../const/routes';

const ProfessionalProfile: React.FC = () => {
  // Obtener datos del servidor
  const { data: serverUser } = useGetUser();
  
  // Usar datos del servidor si están disponibles, sino usar localStorage
  const localUser = getUser();
  const user = serverUser || localUser;
  
  const navigate = useNavigate();

  const getFullName = () => {
    if (user?.nombre && user?.apellido) {
      return `${user.nombre} ${user.apellido}`;
    }
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.email || 'Profesional';
  };

  const formatDate = (dateString: string): string => {
    try {
      // Si la fecha viene en formato DD-MM-YYYY
      if (dateString.includes('-') && dateString.split('-')[0].length <= 2) {
        const [day, month, year] = dateString.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        return date.toLocaleDateString('es-AR', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
      }
      // Si la fecha viene en formato ISO o YYYY-MM-DD
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('es-AR', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
      }
      return dateString;
    } catch {
      return dateString;
    }
  };

  const handleEditProfile = () => {
    navigate(ROUTES.professionalSettings);
  };

  return (
    <div style={{ padding: '2rem', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <User size={32} color={COLORS.PRIMARY_CYAN} />
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
        maxWidth: '1200px'
      }}>
        {/* Foto de perfil y nombre */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem' }}>
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            backgroundColor: '#e0e7ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '3px solid #c7d2fe',
            overflow: 'hidden',
            flexShrink: 0,
            position: 'relative'
          }}>
            {user?.imagenUrl ? (
              <img 
                src={user.imagenUrl} 
                alt={getFullName()}
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  objectPosition: 'center',
                  display: 'block'
                }}
              />
            ) : (
              <User size={64} color="#9ca3af" />
            )}
          </div>
          <div>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: 'bold', 
              color: COLORS.PRIMARY_DARK,
              margin: '0 0 0.5rem 0'
            }}>
              {getFullName()}
            </h2>
            <p style={{ 
              color: COLORS.PRIMARY_MEDIUM, 
              margin: 0,
              fontSize: '1.1rem',
              fontWeight: '600'
            }}>
              {user?.especialidad || 'Profesional de la salud'}
            </p>
          </div>
        </div>

        {/* Información del profesional en 2 columnas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Email */}
          <div style={{ 
            padding: '1rem', 
            backgroundColor: '#f9fafb', 
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <Mail size={20} color={COLORS.PRIMARY_CYAN} />
            <div style={{ flex: 1 }}>
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
          </div>

          {/* Teléfono */}
          {user?.telefono && (
            <div style={{ 
              padding: '1rem', 
              backgroundColor: '#f9fafb', 
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <Phone size={20} color={COLORS.PRIMARY_CYAN} />
              <div style={{ flex: 1 }}>
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
            </div>
          )}

          {/* Fecha de nacimiento */}
          {user?.fecha_nacimiento && (
            <div style={{ 
              padding: '1rem', 
              backgroundColor: '#f9fafb', 
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <Calendar size={20} color={COLORS.PRIMARY_CYAN} />
              <div style={{ flex: 1 }}>
                <p style={{ 
                  color: '#6b7280', 
                  fontSize: '0.875rem', 
                  margin: '0 0 0.25rem 0',
                  fontWeight: '500'
                }}>
                  Fecha de Nacimiento
                </p>
                <p style={{ 
                  color: COLORS.PRIMARY_DARK, 
                  margin: 0,
                  fontSize: '1rem'
                }}>
                  {formatDate(user.fecha_nacimiento)}
                </p>
              </div>
            </div>
          )}

          {/* Localidad */}
          {user?.localidad && (
            <div style={{ 
              padding: '1rem', 
              backgroundColor: '#f9fafb', 
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <MapPin size={20} color={COLORS.PRIMARY_CYAN} />
              <div style={{ flex: 1 }}>
                <p style={{ 
                  color: '#6b7280', 
                  fontSize: '0.875rem', 
                  margin: '0 0 0.25rem 0',
                  fontWeight: '500'
                }}>
                  Localidad
                </p>
                <p style={{ 
                  color: COLORS.PRIMARY_DARK, 
                  margin: 0,
                  fontSize: '1rem'
                }}>
                  {user.localidad}
                </p>
              </div>
            </div>
          )}

          {/* Dirección */}
          {user?.direccion && (
            <div style={{ 
              padding: '1rem', 
              backgroundColor: '#f9fafb', 
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              <MapPin size={20} color={COLORS.PRIMARY_CYAN} />
              <div style={{ flex: 1 }}>
                <p style={{ 
                  color: '#6b7280', 
                  fontSize: '0.875rem', 
                  margin: '0 0 0.25rem 0',
                  fontWeight: '500'
                }}>
                  Dirección
                </p>
                <p style={{ 
                  color: COLORS.PRIMARY_DARK, 
                  margin: 0,
                  fontSize: '1rem'
                }}>
                  {user.direccion}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Descripción - Ocupa todo el ancho */}
        {user?.descripcion && (
          <div style={{ 
            padding: '1rem', 
            backgroundColor: '#f9fafb', 
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
            marginBottom: '1.5rem'
          }}>
            <FileText size={20} color={COLORS.PRIMARY_CYAN} style={{ marginTop: '0.25rem' }} />
            <div style={{ flex: 1 }}>
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
                fontSize: '1rem',
                lineHeight: '1.5'
              }}>
                {user.descripcion}
              </p>
            </div>
          </div>
        )}

        {/* Tarifas de consulta */}
        {(user?.valorConsulta != null || user?.valorConsultaExpress != null) && (
          <div style={{
            padding: '1.5rem',
            backgroundColor: '#e0f2fe',
            borderRadius: '12px',
            marginBottom: '1.5rem',
            border: '2px solid #bae6fd'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              marginBottom: '1rem'
            }}>
              <DollarSign size={24} color={COLORS.PRIMARY_MEDIUM} />
              <h3 style={{ 
                margin: 0, 
                fontSize: '1.1rem', 
                fontWeight: '700',
                color: COLORS.PRIMARY_DARK
              }}>
                Tarifas de Consulta
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {user?.valorConsulta != null && user.valorConsulta > 0 && (
                <div style={{
                  backgroundColor: 'white',
                  padding: '1rem',
                  borderRadius: '8px',
                  border: '1px solid #bae6fd'
                }}>
                  <p style={{ 
                    color: '#6b7280', 
                    fontSize: '0.875rem', 
                    margin: '0 0 0.25rem 0',
                    fontWeight: '500'
                  }}>
                    Consulta Estándar
                  </p>
                  <p style={{ 
                    color: COLORS.PRIMARY_MEDIUM, 
                    margin: 0,
                    fontSize: '1.5rem',
                    fontWeight: '700'
                  }}>
                    ${user.valorConsulta.toLocaleString('es-AR')}
                  </p>
                </div>
              )}
              {user?.valorConsultaExpress != null && user.valorConsultaExpress > 0 && (
                <div style={{
                  backgroundColor: 'white',
                  padding: '1rem',
                  borderRadius: '8px',
                  border: '1px solid #bae6fd'
                }}>
                  <p style={{ 
                    color: '#6b7280', 
                    fontSize: '0.875rem', 
                    margin: '0 0 0.25rem 0',
                    fontWeight: '500'
                  }}>
                    Consulta Express
                  </p>
                  <p style={{ 
                    color: COLORS.PRIMARY_MEDIUM, 
                    margin: 0,
                    fontSize: '1.5rem',
                    fontWeight: '700'
                  }}>
                    ${user.valorConsultaExpress.toLocaleString('es-AR')}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Botón editar perfil */}
        <button
          onClick={handleEditProfile}
          style={{
            width: '100%',
            padding: '0.875rem',
            backgroundColor: COLORS.PRIMARY_CYAN,
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'all 0.2s',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = COLORS.PRIMARY_MEDIUM;
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = COLORS.PRIMARY_CYAN;
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
          }}
        >
          Editar Perfil
        </button>
      </div>
    </div>
  );
};

export default ProfessionalProfile;


