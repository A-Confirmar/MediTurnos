import React from 'react';
import { Star, X } from 'lucide-react';
import { COLORS } from '../../const/colors';

interface ViewReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  professionalName: string;
  rating: number;
  comment: string;
  date?: string;
}

const ViewReviewModal: React.FC<ViewReviewModalProps> = ({
  isOpen,
  onClose,
  professionalName,
  rating,
  comment,
  date
}) => {
  if (!isOpen) return null;

  // Formatear fecha si existe
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      });
    } catch {
      return '';
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          maxWidth: '500px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{
            margin: 0,
            fontSize: '1.5rem',
            color: COLORS.PRIMARY_DARK,
            fontWeight: '600'
          }}>
            Tu calificación
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              color: '#6b7280',
              display: 'flex',
              alignItems: 'center',
              borderRadius: '6px',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '1.5rem' }}>
          {/* Profesional */}
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{
              margin: '0 0 0.5rem 0',
              fontSize: '0.875rem',
              color: '#6b7280',
              fontWeight: '500'
            }}>
              Profesional
            </p>
            <p style={{
              margin: 0,
              fontSize: '1.125rem',
              color: '#111827',
              fontWeight: '600'
            }}>
              {professionalName}
            </p>
          </div>

          {/* Rating */}
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{
              margin: '0 0 0.75rem 0',
              fontSize: '0.875rem',
              color: '#6b7280',
              fontWeight: '500'
            }}>
              Calificación
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={32}
                  fill={star <= rating ? '#fbbf24' : 'none'}
                  color={star <= rating ? '#fbbf24' : '#d1d5db'}
                  style={{ transition: 'all 0.2s' }}
                />
              ))}
              <span style={{
                marginLeft: '0.5rem',
                fontSize: '1.5rem',
                fontWeight: '700',
                color: COLORS.PRIMARY_DARK
              }}>
                {rating}/5
              </span>
            </div>
          </div>

          {/* Comment */}
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{
              margin: '0 0 0.75rem 0',
              fontSize: '0.875rem',
              color: '#6b7280',
              fontWeight: '500'
            }}>
              Comentario
            </p>
            <div style={{
              backgroundColor: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '1rem',
              minHeight: '100px',
              fontSize: '0.95rem',
              color: '#374151',
              lineHeight: '1.6'
            }}>
              {comment || 'Sin comentario'}
            </div>
          </div>

          {/* Date */}
          {date && (
            <div style={{
              padding: '0.75rem',
              backgroundColor: '#f0f9ff',
              border: '1px solid #bae6fd',
              borderRadius: '8px',
              fontSize: '0.875rem',
              color: '#0369a1',
              textAlign: 'center'
            }}>
              Calificado el {formatDate(date)}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid #e5e7eb',
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={onClose}
            style={{
              backgroundColor: COLORS.PRIMARY_MEDIUM,
              color: 'white',
              border: 'none',
              padding: '0.75rem 2rem',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = COLORS.PRIMARY_DARK;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = COLORS.PRIMARY_MEDIUM;
            }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewReviewModal;
