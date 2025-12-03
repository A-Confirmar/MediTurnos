import React, { useMemo, useState } from 'react';
import { Shield, Star, CheckCircle, XCircle, Clock, User, Calendar, AlertCircle } from 'lucide-react';
import { COLORS } from '../../const/colors';
import { useGetAllReviews, type Review } from '../../services/reviews/useGetAllReviews';
import { useApproveReview } from '../../services/reviews/useApproveReview';
import { useDeleteReview } from '../../services/reviews/useDeleteReview';

const AdminReviewModeration: React.FC = () => {
  const { data: reviewsData, isLoading } = useGetAllReviews();
  const approveReview = useApproveReview();
  const deleteReview = useDeleteReview();
  
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState<'approve' | 'delete' | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Organizar reseñas por estado
  const reviewsByStatus = useMemo(() => {
    const reviews = reviewsData?.reseñas || []; // CON Ñ
    
    const pending = reviews.filter(r => r.estado === 'oculto');
    const approved = reviews.filter(r => r.estado === 'visible');
    
    return {
      pending,
      approved
    };
  }, [reviewsData]);

  const stats = useMemo(() => {
    const reviews = reviewsData?.reseñas || []; // CON Ñ
    return {
      total: reviews.length,
      pending: reviewsByStatus.pending.length,
      approved: reviewsByStatus.approved.length
    };
  }, [reviewsData, reviewsByStatus]);

  const handleApprove = async (reseniaID: number) => {
    try {
      await approveReview.mutateAsync({ reseniaID });
      setShowConfirmModal(null);
      setSelectedReview(null);
    } catch (error) {
      console.error('Error al aprobar reseña:', error);
    }
  };

  const handleDelete = async (reseniaID: number) => {
    try {
      await deleteReview.mutateAsync({ reseniaID });
      setShowConfirmModal(null);
      setSelectedReview(null);
    } catch (error) {
      console.error('Error al eliminar reseña:', error);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div style={{ display: 'flex', gap: '0.25rem' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            fill={star <= rating ? '#fbbf24' : 'none'}
            color={star <= rating ? '#fbbf24' : '#d1d5db'}
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div style={{ 
        padding: '2rem', 
        backgroundColor: '#f9fafb', 
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '50px', 
            height: '50px', 
            border: `4px solid ${COLORS.PRIMARY_CYAN}`, 
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }} />
          <p style={{ color: COLORS.PRIMARY_DARK, fontSize: '1.1rem' }}>
            Cargando reseñas...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem',
            marginBottom: '0.5rem'
          }}>
            <Shield size={32} color={COLORS.PRIMARY_CYAN} />
            <h1 style={{ 
              fontSize: '2rem', 
              fontWeight: 'bold', 
              color: COLORS.PRIMARY_DARK,
              margin: 0
            }}>
              Moderación de Reseñas
            </h1>
          </div>
          <p style={{ color: '#6b7280', margin: 0 }}>
            Administra y modera las valoraciones de los pacientes
          </p>
        </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: '#e0f2fe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Star size={24} color={COLORS.PRIMARY_CYAN} />
            </div>
            <div>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>
                Total Reseñas
              </p>
              <p style={{ 
                fontSize: '1.5rem', 
                fontWeight: 'bold', 
                color: COLORS.PRIMARY_DARK,
                margin: 0
              }}>
                {stats.total}
              </p>
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: '#fef3c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Clock size={24} color="#f59e0b" />
            </div>
            <div>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>
                Pendientes
              </p>
              <p style={{ 
                fontSize: '1.5rem', 
                fontWeight: 'bold', 
                color: COLORS.PRIMARY_DARK,
                margin: 0
              }}>
                {stats.pending}
              </p>
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: '#d1fae5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CheckCircle size={24} color="#10b981" />
            </div>
            <div>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>
                Aprobadas
              </p>
              <p style={{ 
                fontSize: '1.5rem', 
                fontWeight: 'bold', 
                color: COLORS.PRIMARY_DARK,
                margin: 0
              }}>
                {stats.approved}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Columnas de reseñas tipo Kanban */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {(['pending', 'approved'] as const).map((status) => {
          const isPending = status === 'pending';
          const reviews = isPending ? reviewsByStatus.pending : reviewsByStatus.approved;
          const config = {
            title: isPending ? 'Pendientes de Aprobación' : 'Reseñas Aprobadas',
            icon: isPending ? <Clock size={24} /> : <CheckCircle size={24} />,
            color: isPending ? '#f59e0b' : '#10b981',
            bgColor: isPending ? '#fef3c7' : '#d1fae5',
            count: reviews.length
          };

          return (
            <div key={status} style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: 'column',
              maxHeight: '70vh'
            }}>
              {/* Column Header */}
              <div style={{
                padding: '1.25rem',
                borderBottom: '2px solid #e5e7eb',
                backgroundColor: config.bgColor,
                borderRadius: '12px 12px 0 0'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ color: config.color }}>
                    {config.icon}
                  </div>
                  <h2 style={{
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    color: config.color,
                    margin: 0
                  }}>
                    {config.title}
                  </h2>
                  <div style={{
                    marginLeft: 'auto',
                    backgroundColor: config.color,
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '999px',
                    fontSize: '0.875rem',
                    fontWeight: '600'
                  }}>
                    {config.count}
                  </div>
                </div>
              </div>

              {/* Reviews List */}
              <div style={{
                padding: '1rem',
                overflowY: 'auto',
                flex: 1
              }}>
                {reviews.length === 0 ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '2rem 1rem',
                    color: '#9ca3af'
                  }}>
                    <AlertCircle size={32} style={{ margin: '0 auto 0.5rem', opacity: 0.5 }} />
                    <p style={{ margin: 0, fontSize: '0.875rem' }}>
                      No hay reseñas {isPending ? 'pendientes' : 'aprobadas'}
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                    {reviews.map((review) => (
              <div
                key={review.ID}
                style={{
                  padding: '0.875rem',
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  border: isPending ? '2px solid #f59e0b' : '2px solid #10b981',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  transition: 'all 0.2s',
                  cursor: 'pointer'
                }}
                onClick={() => {
                  setSelectedReview(review);
                  setShowDetailModal(true);
                }}
              >
                {/* Header Compacto */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '0.5rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: 0 }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: COLORS.PRIMARY_CYAN,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      flexShrink: 0
                    }}>
                      <User size={16} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        fontWeight: '600',
                        color: COLORS.PRIMARY_DARK,
                        margin: 0,
                        fontSize: '0.875rem',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {review.nombrePaciente} {review.apellidoPaciente}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <Calendar size={12} color="#6b7280" />
                        <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>
                          {formatDate(review.fecha)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0, marginLeft: '0.5rem' }}>
                    {renderStars(review.puntaje)}
                  </div>
                </div>

                {/* Comment Compacto */}
                {review.comentario && (
                  <p style={{
                    color: '#4b5563',
                    fontSize: '0.8rem',
                    lineHeight: '1.4',
                    margin: '0 0 0.5rem 0',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {review.comentario}
                  </p>
                )}

                {/* Professional Info Compacto */}
                {review.nombreProfesional && (
                  <div style={{
                    fontSize: '0.75rem',
                    color: COLORS.PRIMARY_CYAN,
                    marginBottom: '0.5rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    Dr. {review.nombreProfesional} {review.apellidoProfesional}
                  </div>
                )}

                {/* Actions Compactos */}
                <div style={{
                  display: 'flex',
                  gap: '0.5rem',
                  justifyContent: 'flex-end'
                }}>
                  {isPending && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedReview(review);
                        setShowConfirmModal('approve');
                      }}
                      disabled={approveReview.isPending}
                      style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontWeight: '600',
                        fontSize: '0.875rem',
                        cursor: approveReview.isPending ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        opacity: approveReview.isPending ? 0.6 : 1,
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        if (!approveReview.isPending) {
                          e.currentTarget.style.backgroundColor = '#059669';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#10b981';
                      }}
                    >
                      <CheckCircle size={16} />
                      Aprobar
                    </button>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedReview(review);
                      setShowConfirmModal('delete');
                    }}
                    disabled={deleteReview.isPending}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontWeight: '600',
                      fontSize: '0.875rem',
                      cursor: deleteReview.isPending ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      opacity: deleteReview.isPending ? 0.6 : 1,
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      if (!deleteReview.isPending) {
                        e.currentTarget.style.backgroundColor = '#dc2626';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#ef4444';
                    }}
                  >
                    <XCircle size={16} />
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
            </div>
          );
        })}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedReview && (
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
          onClick={() => {
            setShowDetailModal(false);
            setSelectedReview(null);
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '2rem',
              maxWidth: '600px',
              width: '90%',
              maxHeight: '80vh',
              overflow: 'auto',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '1.5rem',
              paddingBottom: '1rem',
              borderBottom: '2px solid #f3f4f6'
            }}>
              <div>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: COLORS.PRIMARY_DARK,
                  margin: 0,
                  marginBottom: '0.5rem'
                }}>
                  Detalle de la Reseña
                </h3>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.375rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  backgroundColor: selectedReview.estado === 'oculto' ? '#fff7ed' : '#d1fae5',
                  color: selectedReview.estado === 'oculto' ? '#f59e0b' : '#10b981'
                }}>
                  {selectedReview.estado === 'oculto' ? (
                    <>
                      <Clock size={14} />
                      Pendiente
                    </>
                  ) : (
                    <>
                      <CheckCircle size={14} />
                      Aprobada
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Patient Info */}
            <div style={{
              backgroundColor: '#f9fafb',
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: COLORS.PRIMARY_LIGHT,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '1.25rem',
                  color: COLORS.PRIMARY_DARK
                }}>
                  {(selectedReview.nombrePaciente || '').charAt(0)}{(selectedReview.apellidoPaciente || '').charAt(0)}
                </div>
                <div>
                  <p style={{
                    fontWeight: '600',
                    color: COLORS.PRIMARY_DARK,
                    margin: 0,
                    fontSize: '1.125rem'
                  }}>
                    {selectedReview.nombrePaciente} {selectedReview.apellidoPaciente}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                    <Calendar size={14} color="#6b7280" />
                    <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                      {new Date(selectedReview.fecha).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stars */}
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                {renderStars(selectedReview.puntaje)}
                <span style={{
                  marginLeft: '0.5rem',
                  fontWeight: '600',
                  color: COLORS.PRIMARY_DARK,
                  fontSize: '1rem'
                }}>
                  {selectedReview.puntaje}/5
                </span>
              </div>
            </div>

            {/* Professional Info */}
            <div style={{
              padding: '1rem',
              backgroundColor: '#eff6ff',
              borderRadius: '8px',
              marginBottom: '1.5rem'
            }}>
              <p style={{
                fontWeight: '600',
                color: COLORS.PRIMARY_DARK,
                marginBottom: '0.5rem',
                fontSize: '0.875rem'
              }}>
                Profesional
              </p>
              <p style={{
                color: '#6b7280',
                margin: 0,
                fontSize: '0.95rem'
              }}>
                Dr/a. {selectedReview.nombreProfesional} {selectedReview.apellidoProfesional}
              </p>
            </div>

            {/* Full Comment */}
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{
                fontWeight: '600',
                color: COLORS.PRIMARY_DARK,
                marginBottom: '0.75rem',
                fontSize: '0.875rem'
              }}>
                Comentario
              </p>
              <p style={{
                color: '#374151',
                lineHeight: '1.6',
                margin: 0,
                fontSize: '1rem',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}>
                {selectedReview.comentario}
              </p>
            </div>

            {/* Actions */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'flex-end',
              paddingTop: '1rem',
              borderTop: '2px solid #f3f4f6'
            }}>
              {selectedReview.estado === 'oculto' && (
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setShowConfirmModal('approve');
                  }}
                  disabled={approveReview.isPending}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: approveReview.isPending ? 'not-allowed' : 'pointer',
                    opacity: approveReview.isPending ? 0.6 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.2s'
                  }}
                >
                  <CheckCircle size={18} />
                  Aprobar
                </button>
              )}

              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setShowConfirmModal('delete');
                }}
                disabled={deleteReview.isPending}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: deleteReview.isPending ? 'not-allowed' : 'pointer',
                  opacity: deleteReview.isPending ? 0.6 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s'
                }}
              >
                <XCircle size={18} />
                Eliminar
              </button>

              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedReview(null);
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: 'white',
                  color: '#6b7280',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && selectedReview && (
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
            zIndex: 1000
          }}
          onClick={() => {
            setShowConfirmModal(null);
            setSelectedReview(null);
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '2rem',
              maxWidth: '500px',
              width: '90%',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '1rem'
            }}>
              {showConfirmModal === 'approve' ? (
                <CheckCircle size={32} color="#10b981" />
              ) : (
                <XCircle size={32} color="#ef4444" />
              )}
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: COLORS.PRIMARY_DARK,
                margin: 0
              }}>
                {showConfirmModal === 'approve' ? 'Aprobar Reseña' : 'Eliminar Reseña'}
              </h3>
            </div>

            <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
              {showConfirmModal === 'approve' 
                ? '¿Estás seguro de que deseas aprobar esta reseña? Será visible públicamente.'
                : '¿Estás seguro de que deseas eliminar esta reseña? Esta acción no se puede deshacer.'}
            </p>

            <div style={{
              padding: '1rem',
              backgroundColor: '#f9fafb',
              borderRadius: '8px',
              marginBottom: '1.5rem'
            }}>
              <p style={{ fontWeight: '600', color: COLORS.PRIMARY_DARK, marginBottom: '0.5rem' }}>
                {selectedReview.nombrePaciente} {selectedReview.apellidoPaciente}
              </p>
              {renderStars(selectedReview.puntaje)}
              <p style={{ color: '#6b7280', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                "{selectedReview.comentario}"
              </p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  setShowConfirmModal(null);
                  setSelectedReview(null);
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: 'white',
                  color: '#6b7280',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Cancelar
              </button>

              <button
                onClick={() => {
                  if (showConfirmModal === 'approve') {
                    handleApprove(selectedReview.ID);
                  } else {
                    handleDelete(selectedReview.ID);
                  }
                }}
                disabled={approveReview.isPending || deleteReview.isPending}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: showConfirmModal === 'approve' ? '#10b981' : '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: (approveReview.isPending || deleteReview.isPending) ? 'not-allowed' : 'pointer',
                  opacity: (approveReview.isPending || deleteReview.isPending) ? 0.6 : 1,
                  transition: 'all 0.2s'
                }}
              >
                {showConfirmModal === 'approve' ? 'Aprobar' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default AdminReviewModeration;
