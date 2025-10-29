import React from 'react';
import { CheckCircle, X } from 'lucide-react';
import { COLORS } from '../../const/colors';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  title,
  message
}) => {
  if (!isOpen) return null;

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
          padding: '2rem',
          maxWidth: '400px',
          width: '100%',
          position: 'relative',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          animation: 'slideIn 0.3s ease-out'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#6b7280',
            padding: '0.25rem',
            borderRadius: '4px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f3f4f6';
            e.currentTarget.style.color = '#111827';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#6b7280';
          }}
        >
          <X size={20} />
        </button>

        {/* Ícono de éxito */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '1.5rem'
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#d1fae5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <CheckCircle size={40} color="#10b981" />
          </div>
        </div>

        {/* Título */}
        <h2
          style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: COLORS.PRIMARY_DARK,
            textAlign: 'center',
            marginBottom: '0.75rem'
          }}
        >
          {title}
        </h2>

        {/* Mensaje */}
        <p
          style={{
            fontSize: '1rem',
            color: '#6b7280',
            textAlign: 'center',
            marginBottom: '1.5rem',
            lineHeight: '1.5'
          }}
        >
          {message}
        </p>

        {/* Botón de aceptar */}
        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '0.75rem 1.5rem',
            backgroundColor: COLORS.PRIMARY_MEDIUM,
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = COLORS.PRIMARY_DARK;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = COLORS.PRIMARY_MEDIUM;
          }}
        >
          Aceptar
        </button>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default SuccessModal;
