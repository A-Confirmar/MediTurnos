import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { COLORS } from '../../const/colors';

interface BlockPatientModalProps {
  isOpen: boolean;
  patientName: string;
  patientEmail: string;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  isLoading?: boolean;
}

const BlockPatientModal: React.FC<BlockPatientModalProps> = ({
  isOpen,
  patientName,
  patientEmail,
  onClose,
  onConfirm,
  isLoading = false
}) => {
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reason.trim()) {
      onConfirm(reason.trim());
      setReason(''); // Limpiar después de enviar
    }
  };

  const handleClose = () => {
    setReason('');
    onClose();
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

        {/* Header con icono de advertencia */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#fee2e2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem'
            }}
          >
            <AlertTriangle size={32} color="#dc2626" />
          </div>
          <h2
            style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: COLORS.PRIMARY_DARK,
              margin: '0 0 0.5rem 0'
            }}
          >
            Bloquear Paciente
          </h2>
          <p style={{ color: '#6b7280', fontSize: '0.9rem', margin: 0 }}>
            {patientName}
          </p>
          <p style={{ color: '#9ca3af', fontSize: '0.85rem', margin: '0.25rem 0 0 0' }}>
            {patientEmail}
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              htmlFor="blockReason"
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: COLORS.PRIMARY_DARK,
                marginBottom: '0.5rem'
              }}
            >
              Motivo del bloqueo *
            </label>
            <textarea
              id="blockReason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ej: Incumplimiento de normas, comportamiento inadecuado..."
              required
              disabled={isLoading}
              rows={4}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '0.9rem',
                color: '#1f2937',
                resize: 'vertical',
                fontFamily: 'inherit',
                outline: 'none',
                transition: 'border-color 0.2s',
                backgroundColor: isLoading ? '#f3f4f6' : 'white'
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = COLORS.PRIMARY_CYAN)}
              onBlur={(e) => (e.currentTarget.style.borderColor = '#d1d5db')}
            />
            <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>
              Este motivo quedará registrado en el sistema
            </p>
          </div>

          {/* Botones */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              style={{
                backgroundColor: 'white',
                color: COLORS.PRIMARY_DARK,
                border: `2px solid ${COLORS.PRIMARY_DARK}`,
                padding: '0.75rem 1.5rem',
                borderRadius: '6px',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                opacity: isLoading ? 0.5 : 1
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!reason.trim() || isLoading}
              style={{
                backgroundColor: '#dc2626',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '6px',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: !reason.trim() || isLoading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                opacity: !reason.trim() || isLoading ? 0.5 : 1
              }}
              onMouseEnter={(e) => {
                if (reason.trim() && !isLoading) {
                  e.currentTarget.style.backgroundColor = '#b91c1c';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#dc2626';
              }}
            >
              {isLoading ? 'Bloqueando...' : 'Confirmar Bloqueo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlockPatientModal;
