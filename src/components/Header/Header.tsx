import React from 'react';
import { useNavigate } from 'react-router-dom';
import mediTurnosLogo from '../../assets/icono-MediTurnos.png';
import { COLORS } from '../../const/colors';
import { ROUTES } from '../../const/routes';
import Button from '../Button/Button';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate(ROUTES.login);
  };

  const handleRegister = () => {
    navigate(ROUTES.register);
  };

  return (
    <header 
      className="shadow-lg border-b-2"
      style={{ 
        backgroundColor: COLORS.WHITE,
        borderBottomColor: COLORS.PRIMARY_CYAN
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo y Nombre */}
          <div className="flex items-center space-x-3">
            <img 
              src={mediTurnosLogo} 
              alt="MediTurnos Logo" 
              className="h-12 w-12 object-contain"
            />
            <h1 
              className="text-3xl font-bold tracking-wide"
              style={{ color: COLORS.PRIMARY_DARK }}
            >
              MediTurnos
            </h1>
          </div>

          {/* Botones de navegación */}
          <div className="flex items-center space-x-4">
            <Button 
              variant="light"
              onClick={handleLogin}
              className="px-6 py-2"
            >
              Login
            </Button>
            <Button 
              variant="default"
              onClick={handleRegister}
              className="px-6 py-2"
            >
              Registrarse
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;