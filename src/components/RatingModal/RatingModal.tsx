import React, { useState } from 'react';
import { Star, X } from 'lucide-react';
import { COLORS } from '../../const/colors';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
  professionalName: string;
  isSubmitting: boolean;
}

const RatingModal: React.FC<RatingModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  professionalName,
  isSubmitting
}) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Por favor, selecciona una calificación');
      return;
    }
    onSubmit(rating, comment);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setRating(0);
      setHoveredRating(0);
      setComment('');
      onClose();
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
      onClick={handleClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '2rem',
          maxWidth: '500px',
          width: '100%',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón cerrar */}
        <button
          onClick={handleClose}
          disabled={isSubmitting}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            color: '#6b7280',
            padding: '0.5rem'
          }}
        >
          <X size={24} />
        </button>

        {/* Header */}
        <h2 style={{
          margin: '0 0 0.5rem 0',
          fontSize: '1.5rem',
          fontWeight: '700',
          color: COLORS.PRIMARY_DARK
        }}>
          Calificar profesional
        </h2>
        <p style={{
          margin: '0 0 1.5rem 0',
          color: '#6b7280',
          fontSize: '0.95rem'
        }}>
          ¿Cómo fue tu experiencia con {professionalName}?
        </p>

        <form onSubmit={handleSubmit}>
          {/* Estrellas */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.75rem',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: '#374151'
            }}>
              Calificación
            </label>
            <div style={{
              display: 'flex',
              gap: '0.5rem',
              justifyContent: 'center',
              padding: '1rem 0'
            }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  disabled={isSubmitting}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    padding: '0.25rem',
                    transition: 'transform 0.2s'
                  }}
                >
                  <Star
                    size={40}
                    fill={(hoveredRating || rating) >= star ? '#fbbf24' : 'none'}
                    color={(hoveredRating || rating) >= star ? '#fbbf24' : '#d1d5db'}
                    style={{
                      transition: 'all 0.2s'
                    }}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p style={{
                textAlign: 'center',
                color: COLORS.PRIMARY_MEDIUM,
                fontSize: '0.9rem',
                fontWeight: '600',
                margin: '0.5rem 0 0 0'
              }}>
                {rating === 1 && 'Muy malo'}
                {rating === 2 && 'Malo'}
                {rating === 3 && 'Regular'}
                {rating === 4 && 'Bueno'}
                {rating === 5 && 'Excelente'}
              </p>
            )}
          </div>

          {/* Comentario */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: '#374151'
            }}>
              Comentario (opcional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Comparte tu experiencia con este profesional..."
              disabled={isSubmitting}
              rows={4}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '0.95rem',
                resize: 'vertical',
                fontFamily: 'inherit',
                outline: 'none',
                transition: 'border-color 0.2s',
                backgroundColor: isSubmitting ? '#f9fafb' : 'white',
                color: '#1f2937'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = COLORS.PRIMARY_MEDIUM}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
            />
          </div>

          {/* Botones */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'flex-end'
          }}>
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: 'transparent',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '0.95rem',
                fontWeight: '600',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                color: '#6b7280',
                transition: 'all 0.2s'
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || rating === 0}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: (isSubmitting || rating === 0) ? '#9ca3af' : COLORS.PRIMARY_MEDIUM,
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.95rem',
                fontWeight: '600',
                cursor: (isSubmitting || rating === 0) ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {isSubmitting ? 'Enviando...' : 'Enviar calificación'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RatingModal;
