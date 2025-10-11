import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import { getUser, getUserRole } from '../services/localstorage';
import { ROUTES } from '../const/routes';

const ProfessionalLayout: React.FC = () => {
  const navigate = useNavigate();
  const [isCollapsed] = React.useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const user = getUser();
      const role = await getUserRole();

      // Si no hay usuario o no es profesional, redirigir al login
      if (!user || (role !== 'profesional' && user.rol !== 'profesional')) {
        navigate(ROUTES.login, { replace: true });
      }
    };

    checkAuth();
  }, [navigate]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Sidebar isCollapsed={isCollapsed} />
      
      <main
        style={{
          marginLeft: isCollapsed ? '80px' : '280px',
          flex: 1,
          transition: 'margin-left 0.3s ease',
          overflow: 'auto'
        }}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default ProfessionalLayout;

