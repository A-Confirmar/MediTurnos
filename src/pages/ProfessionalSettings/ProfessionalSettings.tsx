import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, User, Mail, Phone, Calendar, ArrowLeft, Save, Lock, CheckCircle, MapPin, Briefcase, FileText, DollarSign, Camera, Upload } from 'lucide-react';
import { ROUTES } from '../../const/routes';
import { COLORS } from '../../const/colors';
import { getUser, getAccessToken } from '../../services/localstorage';
import { useGetUser } from '../../services/auth/useGetUser';
import { useUpdateUser } from '../../services/auth/useUpdateUser';
import { useUploadProfileImage } from '../../services/professionals/useUploadProfileImage';
import { useUpdateConsultationFees } from '../../services/professionals/useUpdateConsultationFees';
import { useGetProvincias } from '../../services/georef/useGetProvincias';
import { useGetLocalidades } from '../../services/georef/useGetLocalidades';
import { useGetCountryInfo } from '../../services/georef/useGetCountryInfo';
import { ESPECIALIDADES } from '../../const/especialidades';
import SuccessModal from '../../components/SuccessModal/SuccessModal';
import Header from '../../components/Header/Header';

const ProfessionalSettings: React.FC = () => {
  const navigate = useNavigate();
  
  // Obtener datos del servidor
  const { data: serverUser, refetch } = useGetUser();
  
  // Hooks para actualización
  const { mutateAsync: updateUser, isPending: isUpdating } = useUpdateUser();
  const { mutateAsync: uploadImage, isPending: isUploadingImage } = useUploadProfileImage();
  const { mutateAsync: updateFees, isPending: isUpdatingFees } = useUpdateConsultationFees();
  
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

  // Ref para el input de archivo
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Estado del formulario
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthDate: '',
    localidad: '',
    direccion: '',
    especialidad: '',
    descripcion: '',
  });

  // Estado para tarifas
  const [fees, setFees] = useState({
    valorConsulta: 0,
    valorConsultaExpress: 0,
  });

  // Estado para mensajes de éxito
  const [showSuccessMessage, setShowSuccessMessage] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  // Estado para errores de validación
  const [fieldErrors, setFieldErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    birthDate?: string;
    localidad?: string;
    especialidad?: string;
    direccion?: string;
  }>({});

  // Función para convertir fecha del backend (DD-MM-YYYY) a formato input date (YYYY-MM-DD)
  const convertToInputDateFormat = (dateString: string): string => {
    if (!dateString) return '';
    
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return dateString;
    }
    
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const [day, month, year] = parts;
      if (year.length === 4) {
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
    }
    
    return '';
  };

  // Pre-cargar datos del usuario
  useEffect(() => {
    if (user && user.email) {
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
          firstName: user?.nombre || user?.firstName || user?.name || '',
          lastName: user?.apellido || user?.lastName || '',
          email: user?.email || '',
          phone: phoneWithoutCode,
          birthDate: convertedDate,
          localidad: user?.localidad || '',
          direccion: user?.direccion || '',
          especialidad: user?.especialidad || '',
          descripcion: user?.descripcion || '',
        };
        
        if (JSON.stringify(prev) !== JSON.stringify(newData)) {
          return newData;
        }
        return prev;
      });

      // Cargar imagen de perfil si existe
      if (user?.imagenUrl) {
        setProfileImageUrl(user.imagenUrl);
      }

      // Cargar tarifas si existen
      if (user?.valorConsulta !== undefined || user?.valorConsultaExpress !== undefined) {
        setFees({
          valorConsulta: user?.valorConsulta || 0,
          valorConsultaExpress: user?.valorConsultaExpress || 0,
        });
      }
    }
  }, [user]);

  // Detectar provincia basándose en la localidad guardada
  useEffect(() => {
    if (formData.localidad && provinciasData?.provincias && !provinciaSeleccionada) {
      const buscarProvincia = async () => {
        try {
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

  const handleSubmitBasicInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Resetear errores previos
    setFieldErrors({});
    
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

    if (!formData.especialidad || formData.especialidad.trim() === '') {
      errors.especialidad = 'La especialidad es obligatoria';
    }

    if (!formData.direccion || formData.direccion.trim() === '') {
      errors.direccion = 'La dirección del consultorio es obligatoria';
    }

    // Si hay errores, actualizar estado y no continuar
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    
    try {
      setShowSuccessMessage(null);

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

      // Datos básicos obligatorios para todos los usuarios
      const updateData: {
        token?: string;
        nombre: string;
        email: string;
        apellido: string;
        fecha_nacimiento: string;
        telefono: string;
        localidad: string;
        // Campos adicionales para profesionales
        especialidad?: string;
        descripcion?: string;
        direccion?: string;
      } = {
        token: token || undefined,
        nombre: formData.firstName || '',
        email: formData.email || '',
        apellido: formData.lastName || '',
        fecha_nacimiento: formData.birthDate || '',
        telefono: fullPhone,
        localidad: formData.localidad || '',
        // Agregar campos profesionales (el backend los valida si es profesional)
        especialidad: formData.especialidad || '',
        descripcion: formData.descripcion || '',
        direccion: formData.direccion || '',
      };

      console.log('📞 Teléfono completo enviado:', fullPhone, '(código:', phoneCode, '+ número:', formData.phone, ')');

      await updateUser(updateData);

      // Mostrar modal de éxito
      setShowSuccessModal(true);

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar que sea una imagen PNG
    if (!file.type.includes('png')) {
      alert('Por favor selecciona una imagen en formato PNG');
      return;
    }

    try {
      const response = await uploadImage(file);
      setProfileImageUrl(response.imagenUrl);
      
      // Invalidar la query del usuario para que se actualice con la nueva imagen
      await refetch();
      
      setShowSuccessMessage('Foto de perfil actualizada correctamente');
      
      setTimeout(() => {
        setShowSuccessMessage(null);
      }, 5000);
    } catch (error) {
      console.error('Error al subir imagen:', error);
      alert('Error al subir la imagen. Intenta nuevamente.');
    }
  };

  const handleSubmitFees = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setShowSuccessMessage(null);

      await updateFees({
        valorConsulta: fees.valorConsulta,
        valorConsultaExpress: fees.valorConsultaExpress,
      });

      setShowSuccessMessage('Tarifas actualizadas correctamente');

      setTimeout(() => {
        setShowSuccessMessage(null);
      }, 5000);

    } catch (error) {
      console.error('❌ Error al actualizar tarifas:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <Header />
      
      <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          {/* Header con botón de regreso */}
          <div style={{ marginBottom: '2rem' }}>
            <button
              onClick={() => navigate(ROUTES.professionalDashboard)}
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
              Volver al Dashboard
            </button>
            
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <Settings size={32} color={COLORS.PRIMARY_CYAN} />
              <h1 style={{ 
                fontSize: '2rem', 
                fontWeight: 'bold', 
                color: COLORS.PRIMARY_DARK,
                margin: 0
              }}>
                Configuración del Perfil
              </h1>
            </div>
            <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>
              Administra tu información personal y profesional
            </p>
          </div>

          {/* Modal de éxito */}
          {showSuccessMessage && (
            <>
              {/* Overlay oscuro */}
              <div 
                onClick={() => setShowSuccessMessage(null)}
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  zIndex: 9998,
                  animation: 'fadeIn 0.3s ease-out'
                }}
              />
              
              {/* Modal centrado */}
              <div style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '2.5rem',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                zIndex: 9999,
                minWidth: '400px',
                maxWidth: '500px',
                animation: 'slideIn 0.3s ease-out',
                textAlign: 'center'
              }}>
                {/* Ícono de éxito */}
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  backgroundColor: '#d1fae5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem',
                  animation: 'scaleIn 0.5s ease-out'
                }}>
                  <CheckCircle size={48} color="#10b981" strokeWidth={2.5} />
                </div>

                {/* Título */}
                <h3 style={{
                  margin: '0 0 0.75rem 0',
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: COLORS.PRIMARY_DARK
                }}>
                  ¡Éxito!
                </h3>

                {/* Mensaje */}
                <p style={{
                  margin: '0 0 2rem 0',
                  fontSize: '1rem',
                  color: '#6b7280',
                  lineHeight: '1.5'
                }}>
                  {showSuccessMessage}
                </p>

                {/* Botón cerrar */}
                <button
                  onClick={() => setShowSuccessMessage(null)}
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    backgroundColor: COLORS.PRIMARY_MEDIUM,
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.PRIMARY_DARK}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = COLORS.PRIMARY_MEDIUM}
                >
                  Continuar
                </button>
              </div>
            </>
          )}

          {/* Foto de Perfil */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '2rem',
            marginBottom: '2rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ 
              fontSize: '1.5rem',
              color: '#111827',
              marginBottom: '1.5rem',
              paddingBottom: '0.75rem',
              borderBottom: '2px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Camera size={24} color={COLORS.PRIMARY_CYAN} />
              Foto de Perfil
            </h2>

            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
              {/* Preview de la imagen */}
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
                {profileImageUrl ? (
                  <img 
                    src={profileImageUrl} 
                    alt="Perfil" 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                      objectPosition: 'center',
                      display: 'block'
                    }} 
                  />
                ) : (
                  <User size={50} color="#9ca3af" strokeWidth={1.5} />
                )}
              </div>

              {/* Botón de carga */}
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingImage}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: COLORS.PRIMARY_MEDIUM,
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: isUploadingImage ? 'not-allowed' : 'pointer',
                    opacity: isUploadingImage ? 0.6 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.2s'
                  }}
                >
                  <Upload size={18} />
                  {isUploadingImage ? 'Subiendo...' : 'Subir foto (PNG)'}
                </button>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                  Solo archivos PNG. Máximo 5MB.
                </p>
              </div>
            </div>
          </div>

          {/* Formulario de información básica */}
          <form onSubmit={handleSubmitBasicInfo} style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '2rem',
            marginBottom: '2rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ 
              fontSize: '1.5rem',
              color: '#111827',
              marginBottom: '1.5rem',
              paddingBottom: '0.75rem',
              borderBottom: '2px solid #e5e7eb'
            }}>
              Información Personal
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
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
                  <Mail size={16} />
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '6px',
                    border: fieldErrors.email ? '2px solid #ef4444' : '1px solid #d1d5db',
                    fontSize: '0.95rem',
                    color: '#111827',
                    backgroundColor: '#f9fafb',
                    cursor: 'not-allowed'
                  }}
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
                <p style={{ color: '#6b7280', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                  El correo electrónico no puede ser modificado
                </p>
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
                    setFormData({ ...formData, localidad: '' });
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

              {/* Dirección del consultorio */}
              <div style={{ gridColumn: '1 / -1' }}>
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
                  Dirección del Consultorio
                </label>
                <input
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  placeholder="Ej: Av. Argentina 123, Piso 2"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '6px',
                    border: fieldErrors.direccion ? '2px solid #ef4444' : '1px solid #d1d5db',
                    fontSize: '0.95rem',
                    color: '#111827',
                    backgroundColor: '#ffffff'
                  }}
                />
                {fieldErrors.direccion && (
                  <div style={{
                    color: '#ef4444',
                    fontSize: '0.875rem',
                    marginTop: '0.5rem'
                  }}>
                    {fieldErrors.direccion}
                  </div>
                )}
              </div>
            </div>

            <h3 style={{ 
              fontSize: '1.25rem',
              color: '#111827',
              marginBottom: '1.5rem',
              paddingBottom: '0.75rem',
              borderBottom: '2px solid #e5e7eb'
            }}>
              Información Profesional
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
              {/* Especialidad */}
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
                  <Briefcase size={16} />
                  Especialidad
                </label>
                <select
                  name="especialidad"
                  value={formData.especialidad}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '6px',
                    border: fieldErrors.especialidad ? '2px solid #ef4444' : '1px solid #d1d5db',
                    fontSize: '0.95rem',
                    color: formData.especialidad ? '#111827' : '#9ca3af',
                    backgroundColor: '#ffffff',
                    cursor: 'pointer'
                  }}
                >
                  <option value="">-- Seleccione una especialidad --</option>
                  {ESPECIALIDADES.map((especialidad) => (
                    <option key={especialidad} value={especialidad}>
                      {especialidad}
                    </option>
                  ))}
                </select>
                {fieldErrors.especialidad && (
                  <div style={{
                    color: '#ef4444',
                    fontSize: '0.875rem',
                    marginTop: '0.5rem'
                  }}>
                    {fieldErrors.especialidad}
                  </div>
                )}
              </div>

              {/* Descripción */}
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#374151',
                  fontSize: '0.95rem'
                }}>
                  <FileText size={16} />
                  Descripción Profesional
                </label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Cuéntanos sobre tu experiencia, áreas de especialización y enfoque profesional..."
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '6px',
                    border: '1px solid #d1d5db',
                    fontSize: '0.95rem',
                    color: '#111827',
                    backgroundColor: '#ffffff',
                    fontFamily: 'inherit',
                    resize: 'vertical'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button
                type="submit"
                disabled={isUpdating}
                style={{
                  padding: '0.75rem 2rem',
                  backgroundColor: COLORS.PRIMARY_MEDIUM,
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: isUpdating ? 'not-allowed' : 'pointer',
                  opacity: isUpdating ? 0.6 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s'
                }}
              >
                <Save size={18} />
                {isUpdating ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </form>

          {/* Tarifas de Consulta */}
          <form onSubmit={handleSubmitFees} style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '2rem',
            marginBottom: '2rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ 
              fontSize: '1.5rem',
              color: '#111827',
              marginBottom: '1.5rem',
              paddingBottom: '0.75rem',
              borderBottom: '2px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <DollarSign size={24} color={COLORS.PRIMARY_CYAN} />
              Tarifas de Consulta
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
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
                  <DollarSign size={16} />
                  Consulta Estándar (ARS)
                </label>
                <input
                  type="number"
                  value={fees.valorConsulta}
                  onChange={(e) => setFees({ ...fees, valorConsulta: Number(e.target.value) })}
                  min="0"
                  step="100"
                  placeholder="0"
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
                  <DollarSign size={16} />
                  Consulta Express (ARS)
                </label>
                <input
                  type="number"
                  value={fees.valorConsultaExpress}
                  onChange={(e) => setFees({ ...fees, valorConsultaExpress: Number(e.target.value) })}
                  min="0"
                  step="100"
                  placeholder="0"
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

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button
                type="submit"
                disabled={isUpdatingFees}
                style={{
                  padding: '0.75rem 2rem',
                  backgroundColor: COLORS.PRIMARY_MEDIUM,
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: isUpdatingFees ? 'not-allowed' : 'pointer',
                  opacity: isUpdatingFees ? 0.6 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s'
                }}
              >
                <Save size={18} />
                {isUpdatingFees ? 'Guardando...' : 'Actualizar Tarifas'}
              </button>
            </div>
          </form>

          {/* Seguridad */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '2rem',
            marginBottom: '2rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ 
              fontSize: '1.5rem',
              color: '#111827',
              marginBottom: '1.5rem',
              paddingBottom: '0.75rem',
              borderBottom: '2px solid #e5e7eb'
            }}>
              Seguridad
            </h2>

            <button
              type="button"
              onClick={() => navigate(ROUTES.changePassword)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: 'white',
                color: COLORS.PRIMARY_MEDIUM,
                border: `2px solid ${COLORS.PRIMARY_MEDIUM}`,
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = COLORS.PRIMARY_MEDIUM;
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.color = COLORS.PRIMARY_MEDIUM;
              }}
            >
              <Lock size={18} />
              Cambiar Contraseña
            </button>
          </div>
        </div>
      </div>

      {/* Estilos para animaciones del modal */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translate(-50%, -45%);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%);
          }
        }

        @keyframes scaleIn {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>

      {/* Modal de éxito */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={handleCloseSuccessModal}
        title="¡Actualización Exitosa!"
        message="Tus datos profesionales han sido actualizados correctamente."
      />
    </div>
  );
};

export default ProfessionalSettings;
