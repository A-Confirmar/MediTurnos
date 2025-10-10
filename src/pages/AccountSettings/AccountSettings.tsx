import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, User, Mail, Phone, Calendar, ArrowLeft, Save, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { ROUTES } from '../../const/routes';
import { COLORS } from '../../const/colors';
import { getUser, getAccessToken } from '../../services/localstorage';
import { useGetUser } from '../../services/auth/useGetUser';
import { useUpdateUser } from '../../services/auth/useUpdateUser';
import Header from '../../components/Header/Header';

const AccountSettings: React.FC = () => {
  const navigate = useNavigate();
  
  // Obtener datos del servidor
  const { data: serverUser, refetch } = useGetUser();
  
  // Hook para actualizar usuario
  const { mutateAsync: updateUser, isPending, isError, error } = useUpdateUser();
  
  // Usar datos del servidor si están disponibles, sino usar localStorage
  const localUser = getUser();
  const user = serverUser || localUser;

  // Estado del formulario
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthDate: '',
    password: '123456', // Password por defecto según el Swagger
  });

  // Estado para mensajes de éxito
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Función para convertir fecha del backend (DD-MM-YYYY) a formato input date (YYYY-MM-DD)
  const convertToInputDateFormat = (dateString: string): string => {
    if (!dateString) return '';
    
    // Si ya está en formato YYYY-MM-DD, retornar tal cual
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return dateString;
    }
    
    // Convertir DD-MM-YYYY a YYYY-MM-DD
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const [day, month, year] = parts;
      // Validar que sea una fecha válida
      if (year.length === 4) {
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
    }
    
    return '';
  };

  // Pre-cargar datos del usuario cuando estén disponibles
  useEffect(() => {
    if (user) {
      const birthDateValue = user?.birthDate || (user as any)?.fecha_nacimiento || '';
      const convertedDate = convertToInputDateFormat(birthDateValue);
      
      console.log('📅 Conversión de fecha:');
      console.log('  Backend:', birthDateValue);
      console.log('  Input date:', convertedDate);
      
      setFormData({
        firstName: user?.firstName || (user as any)?.nombre || user?.name || '',
        lastName: user?.lastName || (user as any)?.apellido || '',
        email: user?.email || '',
        phone: user?.phone || (user as any)?.telefono || '',
        birthDate: convertedDate,
        password: '123456', // Password por defecto según el Swagger
      });
    }
  }, [user]);

  // El backend ESPERA recibir fechas en formato YYYY-MM-DD (según Swagger: "2000-01-01")
  // Pero DEVUELVE fechas en formato DD-MM-YYYY ("11-11-1999")
  // Por lo tanto, no necesitamos convertir - el input ya está en el formato correcto YYYY-MM-DD

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Ocultar mensaje de éxito previo
      setShowSuccessMessage(false);

      // Obtener el token del localStorage
      const token = await getAccessToken();

      // Preparar datos en el formato que espera el backend (español)
      // Según el Swagger, el backend requiere: token, nombre, email, password, apellido, fecha_nacimiento (YYYY-MM-DD), telefono
      const updateData: any = {
        token: token,
        nombre: formData.firstName || '',
        email: formData.email || '',
        password: formData.password || '123456', // Password requerido por el backend
        apellido: formData.lastName || '',
        fecha_nacimiento: formData.birthDate || '', // Ya está en formato YYYY-MM-DD ✅
        telefono: formData.phone || '',
      };

      console.log('📤 Enviando datos al servidor:', updateData);
      console.log('📅 Formato de fecha enviado:', formData.birthDate, '(YYYY-MM-DD)');

      // Llamar al servicio de actualización
      await updateUser(updateData);

      // Mostrar mensaje de éxito
      setShowSuccessMessage(true);

      // Recargar datos del servidor después de actualizar
      setTimeout(() => {
        refetch();
      }, 1000);

      // Ocultar mensaje después de 5 segundos
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);

    } catch (error) {
      console.error('❌ Error al guardar cambios:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <Header />
      
      <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* Header con botón de regreso */}
          <div style={{ marginBottom: '2rem' }}>
            <button
              onClick={() => navigate(ROUTES.home)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'transparent',
                border: 'none',
                color: COLORS.PRIMARY_MEDIUM,
                fontSize: '0.9rem',
                cursor: 'pointer',
                padding: '0.5rem',
                marginBottom: '1rem'
              }}
            >
              <ArrowLeft size={20} />
              Volver al Inicio
            </button>
            
            <div style={{ 
              backgroundColor: 'white',
              padding: '1.5rem',
              borderRadius: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              borderLeft: `4px solid ${COLORS.PRIMARY_MEDIUM}`
            }}>
              <h1 style={{ 
                margin: 0,
                fontSize: '1.8rem',
                color: COLORS.PRIMARY_DARK,
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                <Settings size={28} />
                Configuración de la Cuenta
              </h1>
              <p style={{ 
                margin: '0.5rem 0 0 0',
                color: '#6b7280',
                fontSize: '0.95rem'
              }}>
                Administra tu información personal y preferencias
              </p>

              {/* Mensaje de éxito */}
              {showSuccessMessage && (
                <div style={{
                  marginTop: '1rem',
                  padding: '1rem',
                  backgroundColor: '#f0fdf4',
                  borderRadius: '6px',
                  border: '1px solid #86efac',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: '#15803d',
                  fontSize: '0.95rem',
                  fontWeight: '500'
                }}>
                  <CheckCircle size={20} />
                  ¡Datos actualizados correctamente!
                </div>
              )}

              {/* Mensaje de error */}
              {isError && (
                <div style={{
                  marginTop: '1rem',
                  padding: '1rem',
                  backgroundColor: '#fef2f2',
                  borderRadius: '6px',
                  border: '1px solid #fca5a5',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: '#dc2626',
                  fontSize: '0.95rem',
                  fontWeight: '500'
                }}>
                  <AlertCircle size={20} />
                  Error al actualizar: {(error as any)?.message || 'Intenta nuevamente'}
                </div>
              )}
            </div>
          </div>

          {/* Formulario de configuración */}
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <form onSubmit={handleSubmit}>
              {/* Información Personal */}
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ 
                  fontSize: '1.2rem',
                  color: '#111827',
                  marginBottom: '1rem',
                  paddingBottom: '0.5rem',
                  borderBottom: '2px solid #e5e7eb'
                }}>
                  Información Personal
                </h2>

                <div style={{ 
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '1rem',
                  marginBottom: '1rem'
                }}>
                  <div>
                    <label style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '0.5rem',
                      fontWeight: '500',
                      color: '#374151',
                      fontSize: '0.95rem'
                    }}>
                      <User size={16} />
                      Nombre
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Ingresa tu nombre"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '6px',
                        border: '1px solid #d1d5db',
                        fontSize: '0.95rem',
                        color: '#111827',
                        backgroundColor: '#ffffff'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '0.5rem',
                      fontWeight: '500',
                      color: '#374151',
                      fontSize: '0.95rem'
                    }}>
                      <User size={16} />
                      Apellido
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Ingresa tu apellido"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '6px',
                        border: '1px solid #d1d5db',
                        fontSize: '0.95rem',
                        color: '#111827',
                        backgroundColor: '#ffffff'
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginBottom: '0.5rem',
                    fontWeight: '500',
                    color: '#374151',
                    fontSize: '0.95rem'
                  }}>
                    <Mail size={16} />
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '6px',
                      border: '1px solid #d1d5db',
                      fontSize: '0.95rem',
                      backgroundColor: '#f9fafb',
                      color: '#6b7280'
                    }}
                    disabled
                  />
                  <p style={{ 
                    fontSize: '0.8rem',
                    color: '#6b7280',
                    margin: '0.25rem 0 0 0'
                  }}>
                    El correo electrónico no puede ser modificado
                  </p>
                </div>

                <div style={{ 
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '1rem'
                }}>
                  <div>
                    <label style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '0.5rem',
                      fontWeight: '500',
                      color: '#374151',
                      fontSize: '0.95rem'
                    }}>
                      <Phone size={16} />
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Ej: +54 9 11 1234-5678"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '6px',
                        border: '1px solid #d1d5db',
                        fontSize: '0.95rem',
                        color: '#111827',
                        backgroundColor: '#ffffff'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '0.5rem',
                      fontWeight: '500',
                      color: '#374151',
                      fontSize: '0.95rem'
                    }}>
                      <Calendar size={16} />
                      Fecha de Nacimiento
                    </label>
                    <input
                      type="date"
                      name="birthDate"
                      value={formData.birthDate}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '6px',
                        border: '1px solid #d1d5db',
                        fontSize: '0.95rem',
                        color: '#111827',
                        backgroundColor: '#ffffff'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Seguridad */}
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ 
                  fontSize: '1.2rem',
                  color: '#111827',
                  marginBottom: '1rem',
                  paddingBottom: '0.5rem',
                  borderBottom: '2px solid #e5e7eb'
                }}>
                  Seguridad
                </h2>

                <button
                  type="button"
                  style={{
                    backgroundColor: COLORS.PRIMARY_MEDIUM,
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '6px',
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = COLORS.PRIMARY_DARK;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = COLORS.PRIMARY_MEDIUM;
                  }}
                >
                  <Lock size={18} />
                  Cambiar Contraseña
                </button>
              </div>

              {/* Botón de guardar */}
              <div style={{ 
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '1rem',
                paddingTop: '1rem',
                borderTop: '2px solid #e5e7eb'
              }}>
                <button
                  type="button"
                  onClick={() => navigate(ROUTES.home)}
                  style={{
                    backgroundColor: 'white',
                    color: '#6b7280',
                    border: '1px solid #d1d5db',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '6px',
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  style={{
                    backgroundColor: isPending ? '#9ca3af' : '#16a34a',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '6px',
                    fontSize: '0.95rem',
                    fontWeight: '500',
                    cursor: isPending ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'background-color 0.2s',
                    opacity: isPending ? 0.7 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!isPending) {
                      e.currentTarget.style.backgroundColor = '#15803d';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isPending) {
                      e.currentTarget.style.backgroundColor = '#16a34a';
                    }
                  }}
                >
                  <Save size={18} />
                  {isPending ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;

