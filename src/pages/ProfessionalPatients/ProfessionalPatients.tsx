import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Mail, Phone, MapPin, Calendar, User, Ban, CheckCircle, Shield, FileText } from 'lucide-react';
import { COLORS } from '../../const/colors';
import { ROUTES } from '../../const/routes';
import { useGetLinkedPatients } from '../../services/professionals/useGetLinkedPatients';
import { useGetBlockedPatients } from '../../services/professionals/useGetBlockedPatients';
import { useBlockPatient } from '../../services/professionals/useBlockPatient';
import { useUnblockPatient } from '../../services/professionals/useUnblockPatient';
import BlockPatientModal from '../../components/BlockPatientModal/BlockPatientModal';
import NotificationModal from '../../components/NotificationModal/NotificationModal';

const ProfessionalPatients: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetLinkedPatients();
  const { data: blockedData } = useGetBlockedPatients();
  const { mutate: blockPatient, isPending: isBlocking } = useBlockPatient();
  const { mutate: unblockPatient, isPending: isUnblocking } = useUnblockPatient();
  
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<{
    email: string;
    name: string;
  } | null>(null);

  // Estados para el modal de notificación
  const [notification, setNotification] = useState<{
    isOpen: boolean;
    type: 'success' | 'error' | 'warning' | 'confirm';
    title: string;
    message: string;
    onConfirm?: () => void;
  }>({
    isOpen: false,
    type: 'success',
    title: '',
    message: ''
  });

  // Función para formatear la fecha de nacimiento (YYYY-MM-DD)
  const formatDate = (dateString: string) => {
    if (!dateString) return 'No especificada';
    
    try {
      // Si es un timestamp ISO (contiene 'T'), extraer solo la fecha
      if (dateString.includes('T')) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }
      
      // Si ya viene en formato YYYY-MM-DD, devolverlo tal cual
      if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return dateString;
      }
      
      // Si viene en otro formato, intentar convertirlo
      const [year, month, day] = dateString.split('-');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    } catch {
      return 'Fecha inválida';
    }
  };

  // Función para formatear la fecha del bloqueo (YYYY-MM-DD desde timestamp)
  const formatBlockDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      // Si es un timestamp ISO, extraer solo la fecha
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch {
      return dateString;
    }
  };

  // Función para calcular la edad
  const calculateAge = (dateString: string) => {
    if (!dateString) return null;
    const [year, month, day] = dateString.split('-');
    const birthDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Funciones para manejar bloqueo/desbloqueo
  const handleOpenBlockModal = (email: string, name: string) => {
    setSelectedPatient({ email, name });
    setBlockModalOpen(true);
  };

  const handleCloseBlockModal = () => {
    setBlockModalOpen(false);
    setSelectedPatient(null);
  };

  const handleConfirmBlock = (reason: string) => {
    if (!selectedPatient) return;
    
    blockPatient(
      { emailPaciente: selectedPatient.email, motivo: reason },
      {
        onSuccess: () => {
          handleCloseBlockModal();
          setNotification({
            isOpen: true,
            type: 'success',
            title: '¡Paciente bloqueado!',
            message: `${selectedPatient.name} ha sido bloqueado exitosamente.`
          });
        },
        onError: (error) => {
          setNotification({
            isOpen: true,
            type: 'error',
            title: 'Error al bloquear',
            message: error.message || 'No se pudo bloquear al paciente. Intente nuevamente.'
          });
        }
      }
    );
  };

  const handleUnblock = (email: string, name: string) => {
    setNotification({
      isOpen: true,
      type: 'confirm',
      title: '¿Desbloquear paciente?',
      message: `¿Está seguro que desea desbloquear a ${name}? Esta acción permitirá que el paciente vuelva a agendar turnos.`,
      onConfirm: () => {
        unblockPatient(
          { emailPaciente: email },
          {
            onSuccess: () => {
              setNotification({
                isOpen: true,
                type: 'success',
                title: '¡Paciente desbloqueado!',
                message: `${name} ha sido desbloqueado exitosamente.`
              });
            },
            onError: (error) => {
              setNotification({
                isOpen: true,
                type: 'error',
                title: 'Error al desbloquear',
                message: error.message || 'No se pudo desbloquear al paciente. Intente nuevamente.'
              });
            }
          }
        );
      }
    });
  };

  // Función helper para verificar si un paciente está bloqueado
  const isPatientBlocked = (email: string): boolean => {
    if (!blockedData?.bloqueados) return false;
    return blockedData.bloqueados.some(blocked => blocked.email === email);
  };

  // Función helper para obtener info del bloqueo
  const getBlockedInfo = (email: string) => {
    if (!blockedData?.bloqueados) return null;
    return blockedData.bloqueados.find(blocked => blocked.email === email);
  };

  // Formatear fecha de nacimiento para URL
  const formatBirthDateForUrl = (dateString: string) => {
    if (!dateString) return '';
    
    try {
      // Si es un timestamp ISO (contiene 'T'), extraer solo la fecha
      if (dateString.includes('T')) {
        return dateString.split('T')[0];
      }
      return dateString;
    } catch {
      return dateString;
    }
  };

  // Función para navegar a la historia clínica
  const handleViewHistory = (patient: any) => {
    const params = new URLSearchParams({
      email: patient.email,
      name: patient.nombre,
      lastName: patient.apellido,
      phone: patient.telefono,
      location: patient.localidad,
      birthDate: formatBirthDateForUrl(patient.fecha_nacimiento)
    });
    navigate(`${ROUTES.professionalPatientHistory}?${params.toString()}`);
  };

  return (
    <div style={{ padding: '2rem', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <Users size={32} color={COLORS.PRIMARY_CYAN} />
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: 'bold', 
          color: COLORS.PRIMARY_DARK,
          margin: 0
        }}>
          Mis Pacientes
        </h1>
      </div>

      {/* Estado de carga */}
      {isLoading && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '3rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <p style={{ color: COLORS.PRIMARY_DARK }}>Cargando pacientes...</p>
        </div>
      )}

      {/* Estado de error */}
      {error && (
        <div style={{
          backgroundColor: '#fee2e2',
          borderRadius: '12px',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <p style={{ color: '#991b1b', fontWeight: '600' }}>
            Error al cargar los pacientes
          </p>
          <p style={{ color: '#7f1d1d', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            {error.message}
          </p>
        </div>
      )}

      {/* Lista de pacientes */}
      {!isLoading && !error && data && (
        <>
          {data.data.length === 0 ? (
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '3rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <Users size={64} color={COLORS.PRIMARY_CYAN} style={{ margin: '0 auto 1rem' }} />
              <h2 style={{ color: COLORS.PRIMARY_DARK, marginBottom: '1rem' }}>
                No hay pacientes vinculados
              </h2>
              <p style={{ color: '#6b7280' }}>
                Aún no tienes pacientes con turnos asignados.
              </p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '1.5rem'
            }}>
              {data.data.map((patient, index) => {
                const age = calculateAge(patient.fecha_nacimiento);
                const isBlocked = isPatientBlocked(patient.email);
                const blockedInfo = getBlockedInfo(patient.email);
                
                return (
                  <div
                    key={`${patient.email}-${index}`}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '12px',
                      padding: '1.5rem',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      transition: 'all 0.2s',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    {/* Header con imagen y nombre */}
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '1rem',
                      marginBottom: '1rem',
                      paddingBottom: '1rem',
                      borderBottom: '1px solid #e5e7eb'
                    }}>
                      {patient.imagenPerfil ? (
                        <img 
                          src={patient.imagenPerfil} 
                          alt={`${patient.nombre} ${patient.apellido}`}
                          style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: `3px solid ${COLORS.PRIMARY_CYAN}`
                          }}
                        />
                      ) : (
                        <div style={{
                          width: '60px',
                          height: '60px',
                          borderRadius: '50%',
                          backgroundColor: COLORS.PRIMARY_LIGHT,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: `3px solid ${COLORS.PRIMARY_CYAN}`
                        }}>
                          <User size={32} color={COLORS.PRIMARY_DARK} />
                        </div>
                      )}
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                          <h3 style={{ 
                            color: COLORS.PRIMARY_DARK, 
                            fontWeight: 'bold',
                            fontSize: '1.1rem',
                            margin: 0
                          }}>
                            {patient.nombre} {patient.apellido}
                          </h3>
                          {/* Badge de bloqueado */}
                          {isPatientBlocked(patient.email) && (
                            <span style={{
                              backgroundColor: '#fee2e2',
                              color: '#991b1b',
                              padding: '0.25rem 0.5rem',
                              borderRadius: '4px',
                              fontSize: '0.75rem',
                              fontWeight: '600',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem'
                            }}>
                              <Shield size={12} />
                              BLOQUEADO
                            </span>
                          )}
                        </div>
                        {age && (
                          <p style={{ 
                            color: '#6b7280', 
                            fontSize: '0.875rem',
                            margin: 0
                          }}>
                            {age} años
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Información de contacto */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Mail size={18} color={COLORS.PRIMARY_CYAN} />
                        <span style={{ color: '#4b5563', fontSize: '0.9rem' }}>
                          {patient.email}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Phone size={18} color={COLORS.PRIMARY_CYAN} />
                        <span style={{ color: '#4b5563', fontSize: '0.9rem' }}>
                          {patient.telefono}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <MapPin size={18} color={COLORS.PRIMARY_CYAN} />
                        <span style={{ color: '#4b5563', fontSize: '0.9rem' }}>
                          {patient.localidad}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Calendar size={18} color={COLORS.PRIMARY_CYAN} />
                        <span style={{ color: '#4b5563', fontSize: '0.9rem' }}>
                          {formatDate(patient.fecha_nacimiento)}
                        </span>
                      </div>
                    </div>

                    {/* Información del bloqueo si está bloqueado */}
                    {isBlocked && blockedInfo && (
                      <div style={{
                        backgroundColor: '#fef2f2',
                        border: '1px solid #fecaca',
                        borderRadius: '6px',
                        padding: '0.75rem',
                        marginBottom: '1rem'
                      }}>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'flex-start', 
                          gap: '0.5rem',
                          marginBottom: '0.5rem'
                        }}>
                          <Shield size={16} color="#dc2626" style={{ marginTop: '0.125rem', flexShrink: 0 }} />
                          <div style={{ flex: 1 }}>
                            <p style={{ 
                              fontSize: '0.8rem', 
                              fontWeight: '600',
                              color: '#991b1b',
                              margin: '0 0 0.25rem 0'
                            }}>
                              Paciente bloqueado
                            </p>
                            {blockedInfo.motivo && (
                              <p style={{ 
                                fontSize: '0.75rem', 
                                color: '#7f1d1d',
                                margin: 0,
                                lineHeight: '1.4'
                              }}>
                                <strong>Motivo:</strong> {blockedInfo.motivo}
                              </p>
                            )}
                            {blockedInfo.fecha && (
                              <p style={{ 
                                fontSize: '0.7rem', 
                                color: '#991b1b',
                                margin: '0.25rem 0 0 0'
                              }}>
                                Fecha: {formatBlockDate(blockedInfo.fecha)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Botón de Historia Clínica */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewHistory(patient);
                      }}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        backgroundColor: COLORS.PRIMARY_MEDIUM,
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        transition: 'background-color 0.2s',
                        marginBottom: '0.75rem'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = COLORS.PRIMARY_DARK;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = COLORS.PRIMARY_MEDIUM;
                      }}
                    >
                      <FileText size={18} />
                      Ver Historia Clínica
                    </button>

                    {/* Botón de bloquear/desbloquear */}
                    {isPatientBlocked(patient.email) ? (
                      // Botón DESBLOQUEAR
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUnblock(patient.email, `${patient.nombre} ${patient.apellido}`);
                        }}
                        disabled={isBlocking || isUnblocking}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          backgroundColor: '#10b981',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '0.9rem',
                          fontWeight: '600',
                          cursor: isBlocking || isUnblocking ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem',
                          transition: 'background-color 0.2s',
                          opacity: isBlocking || isUnblocking ? 0.5 : 1
                        }}
                        onMouseEnter={(e) => {
                          if (!isBlocking && !isUnblocking) {
                            e.currentTarget.style.backgroundColor = '#059669';
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#10b981';
                        }}
                      >
                        <CheckCircle size={18} />
                        {isUnblocking ? 'Desbloqueando...' : 'Desbloquear Paciente'}
                      </button>
                    ) : (
                      // Botón BLOQUEAR
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenBlockModal(patient.email, `${patient.nombre} ${patient.apellido}`);
                        }}
                        disabled={isBlocking || isUnblocking}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          backgroundColor: '#dc2626',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '0.9rem',
                          fontWeight: '600',
                          cursor: isBlocking || isUnblocking ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem',
                          transition: 'background-color 0.2s',
                          opacity: isBlocking || isUnblocking ? 0.5 : 1
                        }}
                        onMouseEnter={(e) => {
                          if (!isBlocking && !isUnblocking) {
                            e.currentTarget.style.backgroundColor = '#b91c1c';
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#dc2626';
                        }}
                      >
                        <Ban size={18} />
                        {isBlocking ? 'Bloqueando...' : 'Bloquear Paciente'}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Contador de pacientes */}
          {data.data.length > 0 && (
            <div style={{
              marginTop: '2rem',
              textAlign: 'center',
              color: '#6b7280',
              fontSize: '0.875rem'
            }}>
              Total de pacientes vinculados: <strong style={{ color: COLORS.PRIMARY_DARK }}>
                {data.data.length}
              </strong>
            </div>
          )}
        </>
      )}

      {/* Modal de bloqueo */}
      <BlockPatientModal
        isOpen={blockModalOpen}
        patientName={selectedPatient?.name || ''}
        patientEmail={selectedPatient?.email || ''}
        onClose={handleCloseBlockModal}
        onConfirm={handleConfirmBlock}
        isLoading={isBlocking}
      />

      {/* Modal de notificaciones */}
      <NotificationModal
        isOpen={notification.isOpen}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        onClose={() => setNotification({ ...notification, isOpen: false })}
        onConfirm={notification.onConfirm}
        confirmText={notification.type === 'confirm' ? 'Desbloquear' : 'Aceptar'}
        cancelText="Cancelar"
      />
    </div>
  );
};

export default ProfessionalPatients;


