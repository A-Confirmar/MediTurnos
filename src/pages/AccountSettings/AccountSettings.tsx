import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, User, Mail, Phone, Calendar, ArrowLeft, Save, Lock, CheckCircle, AlertCircle, MapPin } from 'lucide-react';
import { ROUTES } from '../../const/routes';
import { COLORS } from '../../const/colors';
import { getUser, getAccessToken } from '../../services/localstorage';
import { useGetUser } from '../../services/auth/useGetUser';
import { useUpdateUser } from '../../services/auth/useUpdateUser';
import { useGetProvincias } from '../../services/georef/useGetProvincias';
import { useGetLocalidades } from '../../services/georef/useGetLocalidades';
import { useGetCountryInfo } from '../../services/georef/useGetCountryInfo';
import SuccessModal from '../../components/SuccessModal/SuccessModal';
import Header from '../../components/Header/Header';

const AccountSettings: React.FC = () => {
  const navigate = useNavigate();
  
  // Obtener datos del servidor
  const { data: serverUser, refetch } = useGetUser();
  
  // Hook para actualizar usuario
  const { mutateAsync: updateUser, isPending, isError, error } = useUpdateUser();
  
  // Hooks para georef API
  const { data: provinciasData } = useGetProvincias();
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState<string>('');
  const { data: localidadesData, isLoading: loadingLocalidades } = useGetLocalidades(provinciaSeleccionada);
  
  // Hook para info del país
  const [paisSeleccionado, setPaisSeleccionado] = useState<string>('AR');
  const { data: paisInfo } = useGetCountryInfo(paisSeleccionado);
  
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
    localidad: '',
    password: '123456', // Password por defecto según el Swagger
  });

  // Estado para mensajes de éxito
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Estado para errores de validación
  const [fieldErrors, setFieldErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    birthDate?: string;
    localidad?: string;
  }>({});

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
    if (user && user.email) {
      // El backend devuelve campos en ESPAÑOL: nombre, apellido, telefono, fecha_nacimiento
      // Priorizar campos en español del backend sobre campos generados en el frontend
      const birthDateValue = user?.fecha_nacimiento || user?.birthDate || '';
      const convertedDate = convertToInputDateFormat(birthDateValue);
      
      // Extraer el teléfono completo
      const fullPhone = user?.telefono || user?.phone || '';
      
      // Intentar detectar el código de país del teléfono
      let phoneWithoutCode = fullPhone;
      let detectedCountry = 'AR';
      
      if (fullPhone.startsWith('54')) {
        detectedCountry = 'AR';
        phoneWithoutCode = fullPhone.substring(2);
      } else if (fullPhone.startsWith('55')) {
        detectedCountry = 'BR';
        phoneWithoutCode = fullPhone.substring(2);
      } else if (fullPhone.startsWith('56')) {
        detectedCountry = 'CL';
        phoneWithoutCode = fullPhone.substring(2);
      } else if (fullPhone.startsWith('598')) {
        detectedCountry = 'UY';
        phoneWithoutCode = fullPhone.substring(3);
      } else if (fullPhone.startsWith('595')) {
        detectedCountry = 'PY';
        phoneWithoutCode = fullPhone.substring(3);
      }
      
      setPaisSeleccionado(detectedCountry);
      
      setFormData(prev => {
        const newData = {
          // Priorizar campos en ESPAÑOL (backend) sobre inglés (frontend/fallback)
          firstName: user?.nombre || user?.firstName || user?.name || '',
          lastName: user?.apellido || user?.lastName || '',
          email: user?.email || '',
          phone: phoneWithoutCode,
          birthDate: convertedDate,
          localidad: user?.localidad || '',
          password: '123456', // Password por defecto según el Swagger
        };
        
        // Solo actualizar si los datos son diferentes
        if (JSON.stringify(prev) !== JSON.stringify(newData)) {
          return newData;
        }
        return prev;
      });
    }
  }, [user]);

  // Detectar provincia basándose en la localidad guardada
  useEffect(() => {
    if (formData.localidad && provinciasData?.provincias && !provinciaSeleccionada) {
      // Buscar la provincia que contiene esta localidad
      const buscarProvincia = async () => {
        try {
          // Buscar en todas las provincias
          for (const provincia of provinciasData.provincias) {
            const response = await fetch(
              `https://apis.datos.gob.ar/georef/api/localidades?provincia=${provincia.id}&nombre=${formData.localidad}&exacto=true&max=1`
            );
            const data = await response.json();
            
            if (data.localidades && data.localidades.length > 0) {
              setProvinciaSeleccionada(provincia.id);
              break;
            }
          }
        } catch (error) {
          console.error('Error al buscar provincia:', error);
        }
      };
      
      buscarProvincia();
    }
  }, [formData.localidad, provinciasData, provinciaSeleccionada]);

  // El backend ESPERA recibir fechas en formato YYYY-MM-DD (según Swagger: "2000-01-01")
  // Pero DEVUELVE fechas en formato DD-MM-YYYY ("11-11-1999")
  // Por lo tanto, no necesitamos convertir - el input ya está en el formato correcto YYYY-MM-DD

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Resetear errores previos
    setFieldErrors({});
    
    // Ocultar mensaje de éxito previo
    setShowSuccessMessage(false);

    // Validaciones de campos requeridos
    const errors: typeof fieldErrors = {};
    
    if (!formData.firstName || !formData.firstName.trim()) {
      errors.firstName = 'El nombre es obligatorio';
    }

    if (!formData.lastName || !formData.lastName.trim()) {
      errors.lastName = 'El apellido es obligatorio';
    }

    if (!formData.email || !formData.email.trim()) {
      errors.email = 'El correo electrónico es obligatorio';
    }

    if (!formData.phone || !formData.phone.trim()) {
      errors.phone = 'El teléfono es obligatorio';
    }

    if (!formData.birthDate) {
      errors.birthDate = 'La fecha de nacimiento es obligatoria';
    }

    if (!formData.localidad || formData.localidad.trim() === '') {
      errors.localidad = 'La localidad es obligatoria';
    }

    // Si hay errores, actualizar estado y no continuar
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    
    try {
      // Obtener el token del localStorage
      const token = await getAccessToken();

      // Obtener el código de país del teléfono
      let phoneCode = '54'; // Default Argentina
      if (paisInfo?.data) {
        const countryData = Object.values(paisInfo.data)[0];
        const code = (countryData as { sPhoneCode?: string })?.sPhoneCode || '+54';
        phoneCode = code.replace('+', ''); // Quitar el símbolo +
      }

      // Concatenar código de país + número de teléfono
      const fullPhone = phoneCode + (formData.phone || '');

      // Preparar datos en el formato que espera el backend (español)
      // Según el Swagger, el backend requiere: token, nombre, email, password, apellido, fecha_nacimiento (YYYY-MM-DD), telefono, localidad
      const updateData: {
        token?: string;
        nombre: string;
        email: string;
        password: string;
        apellido: string;
        fecha_nacimiento: string;
        telefono: string;
        localidad: string;
      } = {
        token: token || undefined,
        nombre: formData.firstName || '',
        email: formData.email || '',
        password: formData.password || '123456', // Password requerido por el backend
        apellido: formData.lastName || '',
        fecha_nacimiento: formData.birthDate || '', // Ya está en formato YYYY-MM-DD ✅
        telefono: fullPhone,
        localidad: formData.localidad || '',
      };

      console.log('📤 Enviando datos al servidor:', updateData);
      console.log('📞 Teléfono completo enviado:', fullPhone, '(código:', phoneCode, '+ número:', formData.phone, ')');
      console.log('📅 Formato de fecha enviado:', formData.birthDate, '(YYYY-MM-DD)');

      // Llamar al servicio de actualización
      await updateUser(updateData);

      // Mostrar modal de éxito
      setShowSuccessModal(true);

      // Recargar datos del servidor después de actualizar
      setTimeout(() => {
        refetch();
      }, 1000);

    } catch (error) {
      console.error('❌ Error al guardar cambios:', error);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
                  Error al actualizar: {error instanceof Error ? error.message : 'Intenta nuevamente'}
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
                        border: fieldErrors.firstName ? '2px solid #ef4444' : '1px solid #d1d5db',
                        fontSize: '0.95rem',
                        color: '#111827',
                        backgroundColor: '#ffffff'
                      }}
                    />
                    {fieldErrors.firstName && (
                      <div style={{
                        color: '#ef4444',
                        fontSize: '0.875rem',
                        marginTop: '0.5rem'
                      }}>
                        {fieldErrors.firstName}
                      </div>
                    )}
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
                        border: fieldErrors.lastName ? '2px solid #ef4444' : '1px solid #d1d5db',
                        fontSize: '0.95rem',
                        color: '#111827',
                        backgroundColor: '#ffffff'
                      }}
                    />
                    {fieldErrors.lastName && (
                      <div style={{
                        color: '#ef4444',
                        fontSize: '0.875rem',
                        marginTop: '0.5rem'
                      }}>
                        {fieldErrors.lastName}
                      </div>
                    )}
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
                      border: fieldErrors.email ? '2px solid #ef4444' : '1px solid #d1d5db',
                      fontSize: '0.95rem',
                      backgroundColor: '#f9fafb',
                      color: '#6b7280'
                    }}
                    disabled
                  />
                  {fieldErrors.email && (
                    <div style={{
                      color: '#ef4444',
                      fontSize: '0.875rem',
                      marginTop: '0.5rem'
                    }}>
                      {fieldErrors.email}
                    </div>
                  )}
                  <p style={{ 
                    fontSize: '0.8rem',
                    color: '#6b7280',
                    margin: '0.25rem 0 0 0'
                  }}>
                    El correo electrónico no puede ser modificado
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {/* Selector de país */}
                      <div style={{ position: 'relative', minWidth: '100px', width: '100px' }}>
                        <select
                          value={paisSeleccionado}
                          onChange={(e) => setPaisSeleccionado(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '0.75rem 0.5rem',
                            paddingLeft: '2.5rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '0.95rem',
                            color: '#111827',
                            backgroundColor: 'white',
                            cursor: 'pointer',
                            outline: 'none',
                          }}
                        >
                          <option value="AR">ARG</option>
                          <option value="BR">BRA</option>
                          <option value="CL">CHL</option>
                          <option value="UY">URY</option>
                          <option value="PY">PRY</option>
                        </select>
                        
                        {/* Bandera del país */}
                        {(() => {
                          if (!paisInfo?.data) return null;
                          const countryData = Object.values(paisInfo.data)[0];
                          const flagUrl = (countryData as { sCountryFlag?: string })?.sCountryFlag;
                          
                          if (!flagUrl) return null;
                          
                          return (
                            <img 
                              src={flagUrl} 
                              alt="Bandera"
                              style={{
                                position: 'absolute',
                                left: '0.5rem',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                width: '24px',
                                height: '18px',
                                objectFit: 'cover',
                                pointerEvents: 'none',
                                borderRadius: '2px',
                                border: '1px solid #e5e7eb'
                              }}
                            />
                          );
                        })()}
                      </div>

                      {/* Input de teléfono */}
                      <div style={{ flex: 1, position: 'relative' }}>
                        {/* Código del país */}
                        {(() => {
                          if (!paisInfo?.data) return null;
                          const countryData = Object.values(paisInfo.data)[0];
                          const phoneCode = (countryData as { sPhoneCode?: string })?.sPhoneCode;
                          
                          if (!phoneCode) return null;
                          
                          return (
                            <span style={{
                              position: 'absolute',
                              left: '1rem',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              fontSize: '0.95rem',
                              fontWeight: '500',
                              color: '#374151',
                              pointerEvents: 'none',
                              zIndex: 10
                            }}>
                              {phoneCode}
                            </span>
                          );
                        })()}
                        
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="2995555555"
                          style={{
                            width: '100%',
                            padding: '0.75rem 1rem',
                            paddingLeft: paisInfo?.data && Object.values(paisInfo.data)[0] ? '4rem' : '1rem',
                            borderRadius: '6px',
                            border: fieldErrors.phone ? '2px solid #ef4444' : '1px solid #d1d5db',
                            fontSize: '0.95rem',
                            color: '#111827',
                            backgroundColor: '#ffffff'
                          }}
                        />
                      </div>
                    </div>
                    {fieldErrors.phone && (
                      <div style={{
                        color: '#ef4444',
                        fontSize: '0.875rem',
                        marginTop: '0.5rem'
                      }}>
                        {fieldErrors.phone}
                      </div>
                    )}
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
                        border: fieldErrors.birthDate ? '2px solid #ef4444' : '1px solid #d1d5db',
                        fontSize: '0.95rem',
                        color: '#111827',
                        backgroundColor: '#ffffff'
                      }}
                    />
                    {fieldErrors.birthDate && (
                      <div style={{
                        color: '#ef4444',
                        fontSize: '0.875rem',
                        marginTop: '0.5rem'
                      }}>
                        {fieldErrors.birthDate}
                      </div>
                    )}
                  </div>

                  {/* Provincia */}
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
                      <MapPin size={16} />
                      Provincia
                    </label>
                    <select
                      value={provinciaSeleccionada}
                      onChange={(e) => {
                        setProvinciaSeleccionada(e.target.value);
                        setFormData({ ...formData, localidad: '' }); // Limpiar localidad al cambiar provincia
                      }}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '6px',
                        border: '1px solid #d1d5db',
                        fontSize: '0.95rem',
                        color: '#111827',
                        backgroundColor: '#ffffff',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="">-- Seleccione una provincia --</option>
                      {provinciasData?.provincias.map((provincia) => (
                        <option key={provincia.id} value={provincia.id}>
                          {provincia.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Localidad */}
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
                      <MapPin size={16} />
                      Localidad
                    </label>
                    <select
                      name="localidad"
                      value={formData.localidad}
                      onChange={handleChange}
                      disabled={!provinciaSeleccionada || loadingLocalidades}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '6px',
                        border: fieldErrors.localidad ? '2px solid #ef4444' : '1px solid #d1d5db',
                        fontSize: '0.95rem',
                        color: '#111827',
                        backgroundColor: (!provinciaSeleccionada || loadingLocalidades) ? '#f9fafb' : '#ffffff',
                        cursor: (!provinciaSeleccionada || loadingLocalidades) ? 'not-allowed' : 'pointer',
                        opacity: (!provinciaSeleccionada || loadingLocalidades) ? 0.6 : 1
                      }}
                    >
                      <option value="">
                        {loadingLocalidades ? '-- Cargando localidades... --' : '-- Seleccione una localidad --'}
                      </option>
                      {localidadesData?.localidades.map((localidad) => (
                        <option key={localidad.id} value={localidad.nombre}>
                          {localidad.nombre}
                        </option>
                      ))}
                    </select>
                    {fieldErrors.localidad && (
                      <div style={{
                        color: '#ef4444',
                        fontSize: '0.875rem',
                        marginTop: '0.5rem'
                      }}>
                        {fieldErrors.localidad}
                      </div>
                    )}
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
                  onClick={() => navigate(ROUTES.changePassword)}
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

      {/* Modal de éxito */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleCloseSuccessModal}
        title="¡Actualización Exitosa!"
        message="Tus datos han sido actualizados correctamente."
      />
    </div>
  );
};

export default AccountSettings;

