import React from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';
import { COLORS } from '../../const/colors';

interface NotificationModalProps {
  isOpen: boolean;
  type: 'success' | 'error' | 'warning' | 'confirm';
  title: string;
  message: string;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  type,
  title,
  message,
  onClose,
  onConfirm,
  confirmText = 'Aceptar',
  cancelText = 'Cancelar'
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={48} color="#10b981" />;
      case 'error':
        return <XCircle size={48} color="#dc2626" />;
      case 'warning':
      case 'confirm':
        return <AlertCircle size={48} color="#f59e0b" />;
      default:
        return null;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return { bg: '#d1fae5', border: '#10b981' };
      case 'error':
        return { bg: '#fee2e2', border: '#dc2626' };
      case 'warning':
      case 'confirm':
        return { bg: '#fef3c7', border: '#f59e0b' };
      default:
        return { bg: '#f3f4f6', border: '#6b7280' };
    }
  };

  const colors = getColors();

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
      onClick={type === 'confirm' ? undefined : onClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '2rem',
          maxWidth: '450px',
          width: '100%',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón cerrar (solo si no es confirmación) */}
        {type !== 'confirm' && (
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              color: '#6b7280',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = COLORS.PRIMARY_DARK)}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#6b7280')}
          >
            <X size={24} />
          </button>
        )}

        {/* Contenido */}
        <div style={{ textAlign: 'center' }}>
          {/* Icono con fondo de color */}
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: colors.bg,
              border: `3px solid ${colors.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem'
            }}
          >
            {getIcon()}
          </div>

          {/* Título */}
          <h2
            style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: COLORS.PRIMARY_DARK,
              margin: '0 0 0.75rem 0'
            }}
          >
            {title}
          </h2>

          {/* Mensaje */}
          <p
            style={{
              color: '#6b7280',
              fontSize: '1rem',
              margin: '0 0 2rem 0',
              lineHeight: '1.5'
            }}
          >
            {message}
          </p>

          {/* Botones */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            {type === 'confirm' ? (
              <>
                <button
                  onClick={onClose}
                  style={{
                    backgroundColor: 'white',
                    color: COLORS.PRIMARY_DARK,
                    border: `2px solid ${COLORS.PRIMARY_DARK}`,
                    padding: '0.75rem 1.5rem',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    minWidth: '120px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                  }}
                >
                  {cancelText}
                </button>
                <button
                  onClick={() => {
                    onConfirm?.();
                    onClose();
                  }}
                  style={{
                    backgroundColor: COLORS.PRIMARY_MEDIUM,
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    minWidth: '120px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = COLORS.PRIMARY_DARK;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = COLORS.PRIMARY_MEDIUM;
                  }}
                >
                  {confirmText}
                </button>
              </>
            ) : (
              <button
                onClick={onClose}
                style={{
                  backgroundColor: COLORS.PRIMARY_MEDIUM,
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 2rem',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  minWidth: '120px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = COLORS.PRIMARY_DARK;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = COLORS.PRIMARY_MEDIUM;
                }}
              >
                {confirmText}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
