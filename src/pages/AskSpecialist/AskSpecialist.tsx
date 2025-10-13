import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Send, ArrowLeft } from 'lucide-react';
import { ROUTES } from '../../const/routes';
import { COLORS } from '../../const/colors';
import Header from '../../components/Header/Header';

const AskSpecialist: React.FC = () => {
  const navigate = useNavigate();

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
                <MessageCircle size={28} />
                Preguntá al Especialista
              </h1>
              <p style={{ 
                margin: '0.5rem 0 0 0',
                color: '#6b7280',
                fontSize: '0.95rem'
              }}>
                Enviá tus consultas médicas a nuestros profesionales de la salud
              </p>
            </div>
          </div>

          {/* Formulario de consulta */}
          <div style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <form onSubmit={(e) => e.preventDefault()}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#374151',
                  fontSize: '0.95rem'
                }}>
                  Especialidad
                </label>
                <select style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db',
                  fontSize: '0.95rem',
                  backgroundColor: 'white',
                  color: '#1f2937'
                }}>
                  <option value="">Seleccioná una especialidad</option>
                  <option value="cardiologia">Cardiología</option>
                  <option value="dermatologia">Dermatología</option>
                  <option value="ginecologia">Ginecología</option>
                  <option value="pediatria">Pediatría</option>
                  <option value="psicologia">Psicología</option>
                  <option value="traumatologia">Traumatología</option>
                  <option value="odontologia">Odontología</option>
                  <option value="oftalmologia">Oftalmología</option>
                </select>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#374151',
                  fontSize: '0.95rem'
                }}>
                  Asunto
                </label>
                <input
                  type="text"
                  placeholder="ej. Consulta sobre resultados de análisis"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '6px',
                    border: '1px solid #d1d5db',
                    fontSize: '0.95rem',
                    color: '#1f2937',
                    backgroundColor: 'white'
                  }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ 
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontWeight: '500',
                  color: '#374151',
                  fontSize: '0.95rem'
                }}>
                  Tu consulta
                </label>
                <textarea
                  placeholder="Describí tu consulta de forma clara y detallada..."
                  rows={8}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '6px',
                    border: '1px solid #d1d5db',
                    fontSize: '0.95rem',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    color: '#1f2937',
                    backgroundColor: 'white'
                  }}
                />
              </div>

              <div style={{
                backgroundColor: '#f0f9ff',
                padding: '1rem',
                borderRadius: '6px',
                marginBottom: '1.5rem',
                fontSize: '0.85rem',
                color: '#0c4a6e'
              }}>
                <strong>Importante:</strong> Esta consulta no reemplaza una visita médica presencial. 
                Para emergencias, dirigite al centro de salud más cercano o llamá al servicio de emergencias.
              </div>

              <button
                type="submit"
                style={{
                  backgroundColor: COLORS.PRIMARY_MEDIUM,
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 2rem',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  fontWeight: '500',
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
                <Send size={18} />
                Enviar consulta
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AskSpecialist;

