import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, type FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { Calendar, Users, Stethoscope } from 'lucide-react';
import InputField from '../../components/InputField/InputField';
import { useLogin } from '../../services/auth/useLogin';
import { getAccessToken } from '../../services/localstorage';
import { ROUTES } from '../../const/routes';
import Button from '../../components/Button/Button';
import BackButton from '../../components/BackButton/BackButton';
import { COLORS } from '../../const/colors';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { mutateAsync, isPending, isError, error } = useLogin();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getAccessToken();
      if (token) {
        navigate(ROUTES.home);
      }
    };
    checkAuth();
  }, [navigate]);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Dirección de correo electrónico no válida')
      .required('El correo electrónico es obligatorio'),
    password: Yup.string()
      .min(6, 'Mínimo 6 caracteres')
      .max(128, 'Máximo 128 caracteres')
      .required('La contraseña es obligatoria'),
  });

  // Función para obtener mensaje de error específico según código HTTP
  const getErrorMessage = (error: any) => {
    const status = error?.response?.status || error?.status;
    
    switch (status) {
      case 404:
        return {
          title: 'Usuario no encontrado',
          message: 'No existe una cuenta con este correo electrónico. Verifica el email o regístrate.'
        };
      case 401:
        return {
          title: 'Credenciales inválidas', 
          message: 'La contraseña es incorrecta. Verifica tu contraseña e intenta nuevamente.'
        };
      case 500:
        return {
          title: 'Error del servidor',
          message: 'Problemas de conectividad. Intenta nuevamente en unos momentos.'
        };
      default:
        return {
          title: 'Error de autenticación',
          message: error?.message || 
                   error?.response?.data?.message || 
                   'Error inesperado. Verifica tus credenciales e intenta nuevamente.'
        };
    }
  };

  const onSubmitHandler = async (
    values: { email: string; password: string },
    { resetForm }: FormikHelpers<{ email: string; password: string }>
  ) => {
    try {
      const result = await mutateAsync(values);
      
      if (!result?.token) {
        return;
      }
      
      resetForm();
      navigate(ROUTES.home);
    } catch {
      // Error será manejado por React Query
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Panel izquierdo - Información de la marca */}
      <div 
        className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 relative"
        style={{ backgroundColor: COLORS.PRIMARY_DARK }}
      >
        {/* Botón de volver en la esquina superior izquierda */}
        <div className="absolute top-6 left-6">
          <BackButton 
            label="Volver"
            onClick={() => navigate(ROUTES.home)}
            size="md"
            color={COLORS.WHITE}
          />
        </div>
        
        <div className="text-center">
          <h1 
            className="text-4xl font-bold mb-6"
            style={{ color: COLORS.WHITE }}
          >
            MediTurnos
          </h1>
          <p 
            className="text-xl mb-8 leading-relaxed"
            style={{ color: COLORS.PRIMARY_CYAN }}
          >
            Tu plataforma de gestión de turnos médicos. 
            Simplifica la administración de citas y mejora la experiencia de tus pacientes.
          </p>
          <div className="flex justify-center space-x-6 text-sm">
            <div className="flex flex-col items-center">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center mb-2"
                style={{ backgroundColor: COLORS.PRIMARY_CYAN }}
              >
                <Calendar size={24} style={{ color: COLORS.NAVY_DARK }} />
              </div>
              <span style={{ color: COLORS.WHITE }}>Gestión de Turnos</span>
            </div>
            <div className="flex flex-col items-center">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center mb-2"
                style={{ backgroundColor: COLORS.PRIMARY_CYAN }}
              >
                <Users size={24} style={{ color: COLORS.NAVY_DARK }} />
              </div>
              <span style={{ color: COLORS.WHITE }}>Pacientes</span>
            </div>
            <div className="flex flex-col items-center">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center mb-2"
                style={{ backgroundColor: COLORS.PRIMARY_CYAN }}
              >
                <Stethoscope size={24} style={{ color: COLORS.NAVY_DARK }} />
              </div>
              <span style={{ color: COLORS.WHITE }}>Profesionales</span>
            </div>
          </div>
        </div>
      </div>

      {/* Panel derecho - Formulario de login */}
      <div 
        className="w-full lg:w-1/2 flex flex-col justify-center px-8 py-12 relative"
        style={{ backgroundColor: COLORS.WHITE }}
      >
        {/* Botón de volver visible solo en móviles */}
        <div className="lg:hidden absolute top-6 left-6">
          <BackButton 
            label="Volver"
            onClick={() => navigate(ROUTES.home)}
            size="md"
            color={COLORS.PRIMARY_MEDIUM}
          />
        </div>
        
        <div className="max-w-md mx-auto w-full">
          {/* Header del formulario */}
          <div className="text-center mb-8">
            <h2 
              className="text-3xl font-bold mb-2"
              style={{ color: COLORS.PRIMARY_DARK }}
            >
              Iniciar Sesión
            </h2>
            <p 
              className="text-lg"
              style={{ color: COLORS.DARK_SLATE }}
            >
              Accede a tu cuenta de MediTurnos
            </p>
          </div>

          {/* Formulario */}
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={validationSchema}
            onSubmit={onSubmitHandler}
          >
            {({ isSubmitting, handleSubmit }) => (
              <Form className="space-y-6">
                <InputField
                  label="Correo electrónico"
                  name="email"
                  type="email"
                  placeholder="Ingresa tu correo electrónico"
                  autoComplete="email"
                />
                <InputField
                  label="Contraseña"
                  name="password"
                  type="password"
                  placeholder="Ingresa tu contraseña"
                  autoComplete="current-password"
                />
                
                <Button
                  variant="default"
                  className="w-full py-3 text-lg font-semibold"
                  disabled={isSubmitting || isPending}
                  onClick={() => handleSubmit()}
                >
                  {isPending ? 'Iniciando sesión...' : 'Iniciar sesión'}
                </Button>

                {isError && (
                  <div 
                    className="p-4 rounded-lg border-l-4 text-sm"
                    style={{ 
                      backgroundColor: '#fef2f2', 
                      borderColor: '#f87171',
                      color: '#dc2626'
                    }}
                  >
                    <p className="font-medium">{getErrorMessage(error).title}</p>
                    <p>{getErrorMessage(error).message}</p>
                  </div>
                )}

                <div className="text-center">
                  <Link
                    to={ROUTES.recoverPassword}
                    className="text-sm font-medium hover:underline transition-colors duration-200"
                    style={{ color: COLORS.PRIMARY_MEDIUM }}
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>

              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};