import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getUser, getUserRole } from '../../services/localstorage';
import { ROUTES } from '../../const/routes';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'paciente' | 'profesional';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const user = getUser();
      const role = await getUserRole();

      // Verificar si hay usuario logueado
      if (!user) {
        setIsAuthorized(false);
        setIsChecking(false);
        return;
      }

      // Si no se requiere un rol específico, solo verificar que esté logueado
      if (!requiredRole) {
        setIsAuthorized(true);
        setIsChecking(false);
        return;
      }

      // Verificar el rol específico
      const userRole = role || user.rol;
      const authorized = userRole === requiredRole;
      
      setIsAuthorized(authorized);
      setIsChecking(false);
    };

    checkAuth();
  }, [requiredRole]);

  // Mostrar un loading mientras se verifica
  if (isChecking) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f9fafb'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid #e5e7eb',
            borderTop: '4px solid #0ea5e9',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }} />
          <p style={{ color: '#6b7280' }}>Verificando acceso...</p>
        </div>
      </div>
    );
  }

  // Si no está autorizado, redirigir al login
  if (!isAuthorized) {
    return <Navigate to={ROUTES.login} replace />;
  }

  // Si está autorizado, mostrar el contenido
  return <>{children}</>;
};

export default ProtectedRoute;


