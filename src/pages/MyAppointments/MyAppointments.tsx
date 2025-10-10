import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, MapPin, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { ROUTES } from '../../const/routes';
import { COLORS } from '../../const/colors';
import Header from '../../components/Header/Header';

const MyAppointments: React.FC = () => {
  const navigate = useNavigate();

  // Datos de ejemplo - luego vendrán de una API
  const appointments = [
    {
      id: 1,
      date: '2025-10-15',
      time: '10:00',
      doctor: 'Dr. Carlos Rodríguez',
      specialty: 'Cardiología',
      location: 'Consultorio Centro, Av. Corrientes 1234',
      status: 'confirmed'
    },
    {
      id: 2,
      date: '2025-10-22',
      time: '14:30',
      doctor: 'Dra. María López',
      specialty: 'Dermatología',
      location: 'Clínica San Miguel, Calle 50 #789',
      status: 'pending'
    },
    {
      id: 3,
      date: '2025-09-28',
      time: '09:00',
      doctor: 'Dr. Juan Pérez',
      specialty: 'Medicina General',
      location: 'Hospital Central',
      status: 'completed'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return { bg: '#d1fae5', color: '#065f46', text: 'Confirmado' };
      case 'pending':
        return { bg: '#fef3c7', color: '#92400e', text: 'Pendiente' };
      case 'completed':
        return { bg: '#e0e7ff', color: '#3730a3', text: 'Completado' };
      case 'cancelled':
        return { bg: '#fee2e2', color: '#991b1b', text: 'Cancelado' };
      default:
        return { bg: '#f3f4f6', color: '#1f2937', text: 'Desconocido' };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
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
                <Calendar size={28} />
                Mis Turnos
              </h1>
              <p style={{ 
                margin: '0.5rem 0 0 0',
                color: '#6b7280',
                fontSize: '0.95rem'
              }}>
                Gestiona todas tus citas médicas en un solo lugar
              </p>
            </div>
          </div>

          {/* Lista de turnos */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {appointments.map((appointment) => {
              const statusInfo = getStatusColor(appointment.status);
              return (
                <div
                  key={appointment.id}
                  style={{
                    backgroundColor: 'white',
                    padding: '1.5rem',
                    borderRadius: '8px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    gap: '1rem',
                    alignItems: 'start'
                  }}
                >
                  <div>
                    <div style={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      marginBottom: '0.75rem'
                    }}>
                      <h3 style={{ 
                        margin: 0,
                        fontSize: '1.2rem',
                        color: '#111827'
                      }}>
                        {appointment.specialty}
                      </h3>
                      <span style={{
                        backgroundColor: statusInfo.bg,
                        color: statusInfo.color,
                        padding: '0.25rem 0.75rem',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: '500'
                      }}>
                        {statusInfo.text}
                      </span>
                    </div>

                    <div style={{ 
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                      color: '#6b7280',
                      fontSize: '0.9rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <User size={16} />
                        <span>{appointment.doctor}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Calendar size={16} />
                        <span style={{ textTransform: 'capitalize' }}>
                          {formatDate(appointment.date)}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Clock size={16} />
                        <span>{appointment.time} hs</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <MapPin size={16} />
                        <span>{appointment.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Acciones */}
                  {appointment.status !== 'completed' && appointment.status !== 'cancelled' && (
                    <div style={{ 
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem'
                    }}>
                      {appointment.status === 'pending' && (
                        <button
                          style={{
                            backgroundColor: '#16a34a',
                            color: 'white',
                            border: 'none',
                            padding: '0.5rem 1rem',
                            borderRadius: '6px',
                            fontSize: '0.85rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          <CheckCircle size={16} />
                          Confirmar
                        </button>
                      )}
                      <button
                        style={{
                          backgroundColor: '#dc2626',
                          color: 'white',
                          border: 'none',
                          padding: '0.5rem 1rem',
                          borderRadius: '6px',
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        <XCircle size={16} />
                        Cancelar
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {appointments.length === 0 && (
            <div style={{
              backgroundColor: 'white',
              padding: '3rem',
              borderRadius: '8px',
              textAlign: 'center',
              color: '#6b7280'
            }}>
              <Calendar size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
              <p style={{ fontSize: '1.1rem' }}>No tenés turnos programados</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyAppointments;

