import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Star, Calendar, Phone, Mail } from 'lucide-react';
import { COLORS } from '../../const/colors';
import { ROUTES } from '../../const/routes';
import { getUser } from '../../services/localstorage';
import type { ProfessionalSearchResult } from '../../services/professionals/useSearchProfessionals';

interface ProfessionalCardProps {
  professional: ProfessionalSearchResult;
}

const ProfessionalCard: React.FC<ProfessionalCardProps> = ({ professional }) => {
  const navigate = useNavigate();

  const handleBookAppointment = () => {
    // Verificar si el usuario está logueado
    const user = getUser();
    
    if (!user) {
      // Si NO está logueado, redirigir a login con redirect
      // Pasamos los datos del profesional como query params
      const params = new URLSearchParams({
        email: professional.email,
        nombre: professional.nombre,
        apellido: professional.apellido,
        especialidad: professional.especialidad,
        descripcion: professional.descripcion || '',
        localidad: professional.localidad || '',
        direccion: professional.direccion || '',
        telefono: professional.telefono || '',
        calificacion: professional.calificacion_promedio?.toString() || ''
      });
      const redirectUrl = `${ROUTES.bookAppointment}?${params.toString()}`;
      navigate(`${ROUTES.login}?redirect=${encodeURIComponent(redirectUrl)}`);
    } else {
      // Si SÍ está logueado, ir directo a reservar turno con todos los datos del profesional
      navigate(ROUTES.bookAppointment, { 
        state: { 
          professionalEmail: professional.email,
          professionalData: professional
        } 
      });
    }
  };

  return (
    <div style={{
      backgroundColor: COLORS.WHITE,
      borderRadius: '12px',
      padding: '1.5rem',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      border: '1px solid #e5e7eb',
      transition: 'all 0.2s',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
      e.currentTarget.style.transform = 'translateY(-2px)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
      e.currentTarget.style.transform = 'translateY(0)';
    }}
    >
      <div style={{ display: 'flex', gap: '1.5rem' }}>
        {/* Foto/Avatar del profesional */}
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          backgroundColor: COLORS.PRIMARY_CYAN,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem',
          fontWeight: '700',
          color: COLORS.PRIMARY_DARK,
          flexShrink: 0
        }}>
          {professional.nombre.charAt(0)}{professional.apellido.charAt(0)}
        </div>

        {/* Información del profesional */}
        <div style={{ flex: 1 }}>
          {/* Nombre y especialidad */}
          <div style={{ marginBottom: '0.75rem' }}>
            <h3 style={{
              margin: 0,
              fontSize: '1.25rem',
              fontWeight: '700',
              color: COLORS.PRIMARY_DARK,
              marginBottom: '0.25rem'
            }}>
              Dr. {professional.nombre} {professional.apellido}
            </h3>
            <p style={{
              margin: 0,
              fontSize: '1rem',
              color: COLORS.PRIMARY_MEDIUM,
              fontWeight: '600'
            }}>
              {professional.especialidad}
            </p>
          </div>

          {/* Calificación */}
          {professional.calificacion_promedio != null && professional.calificacion_promedio > 0 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.75rem'
            }}>
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={i < Math.floor(professional.calificacion_promedio || 0) ? '#fbbf24' : 'none'}
                    color="#fbbf24"
                  />
                ))}
              </div>
              <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#6b7280' }}>
                {Number(professional.calificacion_promedio).toFixed(1)}
              </span>
            </div>
          )}

          {/* Descripción */}
          {professional.descripcion && (
            <p style={{
              margin: '0 0 0.75rem 0',
              fontSize: '0.9rem',
              color: '#6b7280',
              lineHeight: '1.5',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              {professional.descripcion}
            </p>
          )}

          {/* Información de contacto */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1rem',
            fontSize: '0.85rem',
            color: '#6b7280'
          }}>
            {professional.localidad && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <MapPin size={16} />
                <span>{professional.localidad}</span>
              </div>
            )}
            {professional.direccion && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <MapPin size={16} />
                <span>{professional.direccion}</span>
              </div>
            )}
            {professional.telefono && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Phone size={16} />
                <span>{professional.telefono}</span>
              </div>
            )}
            {professional.email && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Mail size={16} />
                <span>{professional.email}</span>
              </div>
            )}
          </div>

          {/* Botón de reservar turno */}
          <button
            onClick={handleBookAppointment}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: COLORS.PRIMARY_MEDIUM,
              color: COLORS.WHITE,
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.95rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.PRIMARY_DARK}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = COLORS.PRIMARY_MEDIUM}
          >
            <Calendar size={18} />
            Reservar turno
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalCard;

