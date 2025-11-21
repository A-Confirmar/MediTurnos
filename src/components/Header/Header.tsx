import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import mediTurnosLogo from '../../assets/icono-MediTurnos.png';
import { COLORS } from '../../const/colors';
import { ROUTES } from '../../const/routes';
import Button from '../Button/Button';
import { getUser, getUserRole, clearSession } from '../../services/localstorage';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(getUser());
  const [userRole, setUserRole] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Actualizar usuario cuando cambie
    setUser(getUser());
    
    // Obtener rol de usuario
    const fetchRole = async () => {
      const role = await getUserRole();
      setUserRole(role);
    };
    fetchRole();
  }, []);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const handleLogin = () => {
    navigate(ROUTES.login);
  };

  const handleRegister = () => {
    navigate(ROUTES.register);
  };

  const handleLogout = () => {
    clearSession();
    setUser(null);
    setUserRole(null);
    setShowDropdown(false);
    navigate(ROUTES.home);
    // Recargar la página para actualizar el estado
    window.location.reload();
  };

  const getDisplayName = () => {
    // Prioridad 1: nombre en español (backend)
    if (user?.nombre) {
      return user.nombre;
    }
    // Prioridad 2: firstName en inglés (por compatibilidad)
    if (user?.firstName) {
      return user.firstName;
    }
    // Prioridad 3: name genérico
    if (user?.name) {
      return user.name;
    }
    // Último recurso: email
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'Usuario';
  };

  // Validación: mostrar opciones de paciente si NO es profesional
  const isNotProfessional = userRole !== 'profesional';
  const isAuthenticated = !!user;

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
          <div 
            className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate(ROUTES.home)}
          >
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
          <div className="flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                {/* Bienvenida */}
                <span 
                  className="text-sm font-medium"
                  style={{ color: COLORS.PRIMARY_DARK }}
                >
                  Bienvenido, <strong>{getDisplayName()}</strong>
                </span>

                {/* Dropdown Mi Cuenta */}
                <div ref={dropdownRef} className="relative">
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center space-x-1 text-sm font-medium hover:opacity-80 transition-opacity"
                    style={{ color: COLORS.PRIMARY_DARK }}
                  >
                    <span>Mi cuenta</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {/* Dropdown Menu */}
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[220px] z-50">
                      <button
                        onClick={() => {
                          setShowDropdown(false);
                          navigate(ROUTES.accountSettings);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Configuración de la cuenta
                      </button>

                      {isNotProfessional && (
                        <>
                          <button
                            onClick={() => {
                              setShowDropdown(false);
                              navigate(ROUTES.myAppointments);
                            }}
                            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            Mis citas
                          </button>
                        </>
                      )}

                      {/* Opción de Moderar Reseñas - Solo para administradores */}
                      {userRole === 'administrador' && (
                        <button
                          onClick={() => {
                            setShowDropdown(false);
                            navigate(ROUTES.adminReviewModeration);
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-cyan-50 transition-colors"
                          style={{ color: COLORS.PRIMARY_CYAN }}
                        >
                          🛡️ Moderar Reseñas
                        </button>
                      )}

                      <div className="border-t border-gray-200 my-1"></div>

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Cerrar sesión
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;