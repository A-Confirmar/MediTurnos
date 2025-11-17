import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FileText, User, Calendar, Mail, Phone, MapPin, Edit, Trash2, Save, X, Plus, Download } from 'lucide-react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { COLORS } from '../../const/colors';
import { ROUTES } from '../../const/routes';
import BackButton from '../../components/BackButton/BackButton';
import NotificationModal from '../../components/NotificationModal/NotificationModal';
import MedicalHistoryPDF from '../../components/MedicalHistoryPDF/MedicalHistoryPDF';
import { useGetPatientMedicalHistory } from '../../services/medicalHistory/useGetPatientMedicalHistory';
import { useCreateMedicalHistory } from '../../services/medicalHistory/useCreateMedicalHistory';
import { useUpdateMedicalHistory } from '../../services/medicalHistory/useUpdateMedicalHistory';
import { useDeleteMedicalHistory } from '../../services/medicalHistory/useDeleteMedicalHistory';
import { getUser } from '../../services/localstorage';

// Validación con Yup
const medicalHistorySchema = Yup.object().shape({
  diagnostico: Yup.string()
    .required('El diagnóstico es obligatorio')
    .min(10, 'El diagnóstico debe tener al menos 10 caracteres'),
  tratamiento: Yup.string()
    .required('El tratamiento es obligatorio')
    .min(10, 'El tratamiento debe tener al menos 10 caracteres'),
  evolucion: Yup.string().nullable(),
});

const ProfessionalPatientHistory: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Obtener datos del paciente desde la URL
  const patientEmail = searchParams.get('email');
  const patientName = searchParams.get('name');
  const patientLastName = searchParams.get('lastName');
  const patientPhone = searchParams.get('phone');
  const patientLocation = searchParams.get('location');
  const patientBirthDate = searchParams.get('birthDate');

  const [isEditing, setIsEditing] = useState(false);
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

  // Hooks de datos
  const { data: historyData, isLoading, error } = useGetPatientMedicalHistory(patientEmail);
  const { mutate: createHistory, isPending: isCreating } = useCreateMedicalHistory();
  const { mutate: updateHistory, isPending: isUpdating } = useUpdateMedicalHistory();
  const { mutate: deleteHistory, isPending: isDeleting } = useDeleteMedicalHistory();

  // Si historyData es null, significa que no hay historia clínica aún (no es un error)
  const existingHistory = historyData?.historial;
  const hasHistory = !!existingHistory;
  const noHistoryYet = !isLoading && !error && historyData === null;

  // Formatear fecha de nacimiento (extraer solo YYYY-MM-DD)
  const formatBirthDate = (dateString: string | null) => {
    if (!dateString) return null;
    
    try {
      // Si es un timestamp ISO (contiene 'T'), extraer solo la fecha
      if (dateString.includes('T')) {
        return dateString.split('T')[0];
      }
      
      // Si ya viene en formato YYYY-MM-DD, devolverlo tal cual
      if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return dateString;
      }
      
      return dateString;
    } catch {
      return dateString;
    }
  };

  // Calcular edad
  const calculateAge = (dateString: string | null) => {
    if (!dateString) return null;
    
    // Formatear la fecha primero
    const formattedDate = formatBirthDate(dateString);
    if (!formattedDate) return null;
    
    const [year, month, day] = formattedDate.split('-');
    const birthDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Formatear fecha de última actualización (puede venir en formato DD-MM-YYYY desde el backend)
  const formatLastUpdateDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'No disponible';
    
    try {
      // Si viene en formato DD-MM-YYYY (ej: "17-11-2025")
      if (dateString.match(/^\d{2}-\d{2}-\d{4}$/)) {
        const [day, month, year] = dateString.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        return date.toLocaleDateString('es-AR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      }
      
      // Si viene en formato ISO o timestamp
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('es-AR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      }
      
      return dateString;
    } catch {
      return dateString;
    }
  };

  // Validar que tenemos el email del paciente
  if (!patientEmail) {
    return (
      <div style={{ padding: '2rem' }}>
        <BackButton onClick={() => navigate(ROUTES.professionalPatients)} />
        <div style={{
          backgroundColor: '#fee2e2',
          borderRadius: '12px',
          padding: '2rem',
          marginTop: '2rem',
          textAlign: 'center'
        }}>
          <p style={{ color: '#991b1b', fontWeight: '600' }}>
            Error: No se especificó el paciente
          </p>
        </div>
      </div>
    );
  }

  // Manejar envío del formulario
  const handleSubmit = (values: any) => {
    if (!patientEmail) return;

    const requestData = {
      pacienteMail: patientEmail,
      diagnostico: values.diagnostico.trim(),
      tratamiento: values.tratamiento.trim(),
      // Al crear: enviar valor predeterminado
      // Al editar: enviar el valor del formulario (nunca null, siempre string)
      evolucion: hasHistory ? (values.evolucion?.trim() || 'Sin evolución registrada') : 'Completar este campo',
    };

    if (hasHistory) {
      // Actualizar historia existente
      updateHistory(requestData, {
        onSuccess: () => {
          setIsEditing(false);
          setNotification({
            isOpen: true,
            type: 'success',
            title: '¡Historia actualizada!',
            message: 'La historia clínica se actualizó correctamente.'
          });
        },
        onError: (error: any) => {
          const errorMessage = error.response?.data?.message || error.message || 'No se pudo actualizar la historia clínica.';
          
          setNotification({
            isOpen: true,
            type: 'error',
            title: 'Error al actualizar',
            message: errorMessage
          });
        }
      });
    } else {
      // Crear nueva historia
      createHistory(requestData, {
        onSuccess: () => {
          setIsEditing(false);
          setNotification({
            isOpen: true,
            type: 'success',
            title: '¡Historia creada!',
            message: 'La historia clínica se creó correctamente.'
          });
        },
        onError: (error: any) => {
          const errorMessage = error.response?.data?.message || error.message || 'No se pudo crear la historia clínica.';
          
          setNotification({
            isOpen: true,
            type: 'error',
            title: 'Error al crear',
            message: errorMessage
          });
        }
      });
    }
  };

  // Manejar eliminación
  const handleDelete = () => {
    if (!existingHistory?.ID && !existingHistory?.historialID) return;

    const historialID = existingHistory.ID || existingHistory.historialID;

    setNotification({
      isOpen: true,
      type: 'confirm',
      title: '¿Eliminar historia clínica?',
      message: '¿Está seguro que desea eliminar esta historia clínica? Esta acción no se puede deshacer.',
      onConfirm: () => {
        deleteHistory(
          { historialID: historialID! },
          {
            onSuccess: () => {
              setNotification({
                isOpen: true,
                type: 'success',
                title: '¡Historia eliminada!',
                message: 'La historia clínica se eliminó correctamente.'
              });
              setIsEditing(false);
            },
            onError: (error: any) => {
              setNotification({
                isOpen: true,
                type: 'error',
                title: 'Error al eliminar',
                message: error.message || 'No se pudo eliminar la historia clínica.'
              });
            }
          }
        );
      }
    });
  };

  const age = calculateAge(patientBirthDate);

  // Obtener datos del profesional para el PDF
  const currentUser = getUser();
  const professionalData = {
    name: currentUser?.nombre ? `${currentUser.nombre} ${currentUser.apellido || ''}`.trim() : 'Profesional',
    specialty: currentUser?.especialidad || 'Especialidad no especificada',
  };

  return (
    <div style={{ padding: '2rem', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <BackButton onClick={() => navigate(ROUTES.professionalPatients)} />

      {/* Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginTop: '2rem',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <FileText size={32} color={COLORS.PRIMARY_CYAN} />
          <h1 style={{ 
            fontSize: '2rem', 
            fontWeight: 'bold', 
            color: COLORS.PRIMARY_DARK,
            margin: 0
          }}>
            Historia Clínica
          </h1>
        </div>
      </div>

      {/* Datos del Paciente */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '2rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ 
          fontSize: '1.25rem', 
          fontWeight: 'bold', 
          color: COLORS.PRIMARY_DARK,
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <User size={24} color={COLORS.PRIMARY_CYAN} />
          Datos del Paciente
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          <div>
            <strong style={{ color: COLORS.PRIMARY_DARK }}>Nombre:</strong>
            <p style={{ margin: '0.25rem 0 0 0', color: '#4b5563' }}>
              {patientName} {patientLastName}
            </p>
          </div>
          {age && (
            <div>
              <strong style={{ color: COLORS.PRIMARY_DARK }}>Edad:</strong>
              <p style={{ margin: '0.25rem 0 0 0', color: '#4b5563' }}>{age} años</p>
            </div>
          )}
          {patientEmail && (
            <div>
              <strong style={{ color: COLORS.PRIMARY_DARK }}>Email:</strong>
              <p style={{ margin: '0.25rem 0 0 0', color: '#4b5563', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={16} color={COLORS.PRIMARY_CYAN} />
                {patientEmail}
              </p>
            </div>
          )}
          {patientPhone && (
            <div>
              <strong style={{ color: COLORS.PRIMARY_DARK }}>Teléfono:</strong>
              <p style={{ margin: '0.25rem 0 0 0', color: '#4b5563', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={16} color={COLORS.PRIMARY_CYAN} />
                {patientPhone}
              </p>
            </div>
          )}
          {patientLocation && (
            <div>
              <strong style={{ color: COLORS.PRIMARY_DARK }}>Localidad:</strong>
              <p style={{ margin: '0.25rem 0 0 0', color: '#4b5563', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={16} color={COLORS.PRIMARY_CYAN} />
                {patientLocation}
              </p>
            </div>
          )}
          {patientBirthDate && (
            <div>
              <strong style={{ color: COLORS.PRIMARY_DARK }}>Fecha de Nacimiento:</strong>
              <p style={{ margin: '0.25rem 0 0 0', color: '#4b5563', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={16} color={COLORS.PRIMARY_CYAN} />
                {formatBirthDate(patientBirthDate)}
              </p>
            </div>
          )}
        </div>
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
          <p style={{ color: COLORS.PRIMARY_DARK }}>Cargando historia clínica...</p>
        </div>
      )}

      {/* Estado de error - Solo mostrar si hay un error real (no cuando no existe historia) */}
      {error && !noHistoryYet && (
        <div style={{
          backgroundColor: '#fee2e2',
          borderRadius: '12px',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <p style={{ color: '#991b1b', fontWeight: '600' }}>
            Error al cargar la historia clínica
          </p>
          <p style={{ color: '#7f1d1d', fontSize: '0.875rem', marginTop: '0.5rem' }}>
            {error.message}
          </p>
        </div>
      )}

      {/* Mensaje informativo cuando no hay historia clínica */}
      {noHistoryYet && (
        <div style={{
          backgroundColor: '#dbeafe',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          border: '1px solid #93c5fd',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <FileText size={24} color={COLORS.PRIMARY_MEDIUM} />
          <div>
            <p style={{ color: COLORS.PRIMARY_DARK, fontWeight: '600', margin: 0 }}>
              Este paciente aún no tiene historia clínica
            </p>
            <p style={{ color: '#1e40af', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>
              Complete el formulario a continuación para crear su primera historia clínica.
            </p>
          </div>
        </div>
      )}

      {/* Formulario de Historia Clínica */}
      {!isLoading && !error && (
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '2rem'
          }}>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: 'bold', 
              color: COLORS.PRIMARY_DARK,
              margin: 0
            }}>
              {hasHistory ? 'Historia Clínica Registrada' : 'Crear Nueva Historia Clínica'}
            </h2>
            
            {/* Botones de acción */}
            {hasHistory && !isEditing && (
              <div style={{ display: 'flex', gap: '1rem' }}>
                {/* Botón Descargar PDF */}
                <PDFDownloadLink
                  document={
                    <MedicalHistoryPDF
                      patient={{
                        name: patientName || '',
                        lastName: patientLastName || '',
                        age: age || undefined,
                        email: patientEmail || '',
                        phone: patientPhone || undefined,
                        location: patientLocation || undefined,
                        birthDate: formatBirthDate(patientBirthDate) || undefined,
                      }}
                      history={{
                        diagnostico: existingHistory?.diagnostico || '',
                        tratamiento: existingHistory?.tratamiento || '',
                        evolucion: existingHistory?.evolucion || '',
                        fecha_ultima_actualizacion: existingHistory?.fecha_ultima_actualizacion,
                      }}
                      professional={professionalData}
                    />
                  }
                  fileName={`historia-clinica-${patientLastName}-${patientName}.pdf`}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'background-color 0.2s',
                    textDecoration: 'none'
                  }}
                >
                  {({ loading }) => (
                    <>
                      <Download size={18} />
                      {loading ? 'Generando PDF...' : 'Descargar PDF'}
                    </>
                  )}
                </PDFDownloadLink>

                <button
                  onClick={() => setIsEditing(true)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: COLORS.PRIMARY_MEDIUM,
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    fontWeight: '600',
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
                  <Edit size={18} />
                  Editar
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#dc2626',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    cursor: isDeleting ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'background-color 0.2s',
                    opacity: isDeleting ? 0.5 : 1
                  }}
                  onMouseEnter={(e) => {
                    if (!isDeleting) {
                      e.currentTarget.style.backgroundColor = '#b91c1c';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#dc2626';
                  }}
                >
                  <Trash2 size={18} />
                  {isDeleting ? 'Eliminando...' : 'Eliminar'}
                </button>
              </div>
            )}
          </div>

          <Formik
            initialValues={{
              diagnostico: existingHistory?.diagnostico || '',
              tratamiento: existingHistory?.tratamiento || '',
              // Si la evolución es el valor por defecto, mostrar campo vacío
              evolucion: (existingHistory?.evolucion === 'Completar este campo' || existingHistory?.evolucion === 'Sin evolución registrada') 
                ? '' 
                : (existingHistory?.evolucion || ''),
            }}
            validationSchema={medicalHistorySchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ isValid, dirty }) => (
              <Form>
                {/* Diagnóstico */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ 
                    display: 'block', 
                    fontWeight: '600', 
                    color: COLORS.PRIMARY_DARK,
                    marginBottom: '0.5rem'
                  }}>
                    Diagnóstico <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <Field
                    as="textarea"
                    name="diagnostico"
                    disabled={hasHistory && !isEditing}
                    placeholder="Ingrese el diagnóstico del paciente..."
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '1rem',
                      minHeight: '100px',
                      resize: 'vertical',
                      backgroundColor: (hasHistory && !isEditing) ? '#f3f4f6' : 'white',
                      color: '#1f2937'
                    }}
                  />
                  <ErrorMessage name="diagnostico">
                    {msg => <div style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '0.25rem' }}>{msg}</div>}
                  </ErrorMessage>
                </div>

                {/* Tratamiento */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ 
                    display: 'block', 
                    fontWeight: '600', 
                    color: COLORS.PRIMARY_DARK,
                    marginBottom: '0.5rem'
                  }}>
                    Tratamiento <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <Field
                    as="textarea"
                    name="tratamiento"
                    disabled={hasHistory && !isEditing}
                    placeholder="Ingrese el tratamiento recomendado..."
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '1rem',
                      minHeight: '100px',
                      resize: 'vertical',
                      backgroundColor: (hasHistory && !isEditing) ? '#f3f4f6' : 'white',
                      color: '#1f2937'
                    }}
                  />
                  <ErrorMessage name="tratamiento">
                    {msg => <div style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '0.25rem' }}>{msg}</div>}
                  </ErrorMessage>
                </div>

                {/* Evolución - Solo mostrar si ya existe historia */}
                {hasHistory && (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ 
                      display: 'block', 
                      fontWeight: '600', 
                      color: COLORS.PRIMARY_DARK,
                      marginBottom: '0.5rem'
                    }}>
                      Evolución
                    </label>
                    <Field
                      as="textarea"
                      name="evolucion"
                      disabled={!isEditing}
                      placeholder=""
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '1rem',
                        minHeight: '120px',
                        resize: 'vertical',
                        backgroundColor: !isEditing ? '#f3f4f6' : 'white',
                        color: '#1f2937'
                      }}
                    />
                    <ErrorMessage name="evolucion">
                      {msg => <div style={{ color: '#dc2626', fontSize: '0.875rem', marginTop: '0.25rem' }}>{msg}</div>}
                    </ErrorMessage>
                  </div>
                )}

                {/* Botones de acción en modo edición */}
                {(isEditing || !hasHistory) && (
                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
                    {hasHistory && (
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        style={{
                          padding: '0.75rem 1.5rem',
                          backgroundColor: '#6b7280',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '0.9rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#4b5563';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#6b7280';
                        }}
                      >
                        <X size={18} />
                        Cancelar
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={!isValid || (!hasHistory && !dirty) || isCreating || isUpdating}
                      style={{
                        padding: '0.75rem 1.5rem',
                        backgroundColor: (isValid && (dirty || hasHistory)) ? '#10b981' : '#9ca3af',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        cursor: (isValid && (dirty || hasHistory) && !isCreating && !isUpdating) ? 'pointer' : 'not-allowed',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        if (isValid && (dirty || hasHistory) && !isCreating && !isUpdating) {
                          e.currentTarget.style.backgroundColor = '#059669';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (isValid && (dirty || hasHistory)) {
                          e.currentTarget.style.backgroundColor = '#10b981';
                        } else {
                          e.currentTarget.style.backgroundColor = '#9ca3af';
                        }
                      }}
                    >
                      {hasHistory ? <Save size={18} /> : <Plus size={18} />}
                      {isCreating || isUpdating ? 'Guardando...' : hasHistory ? 'Guardar Cambios' : 'Crear Historia Clínica'}
                    </button>
                  </div>
                )}
              </Form>
            )}
          </Formik>

          {/* Información adicional */}
          {hasHistory && existingHistory?.fecha_ultima_actualizacion && (
            <div style={{
              marginTop: '2rem',
              paddingTop: '1rem',
              borderTop: '1px solid #e5e7eb',
              fontSize: '0.875rem',
              color: '#6b7280'
            }}>
              <strong>Última actualización:</strong> {formatLastUpdateDate(existingHistory.fecha_ultima_actualizacion)}
            </div>
          )}
        </div>
      )}

      {/* Modal de notificaciones */}
      <NotificationModal
        isOpen={notification.isOpen}
        type={notification.type}
        title={notification.title}
        message={notification.message}
        onClose={() => setNotification({ ...notification, isOpen: false })}
        onConfirm={notification.onConfirm}
        confirmText={notification.type === 'confirm' ? 'Eliminar' : 'Aceptar'}
        cancelText="Cancelar"
      />
    </div>
  );
};

export default ProfessionalPatientHistory;

