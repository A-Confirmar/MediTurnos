import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Formik, Form, type FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { UserPlus, Shield, Zap } from 'lucide-react';
import InputField from '../../components/InputField/InputField';
import { useRegister } from '../../services/auth/useRegister';
import { getAccessToken } from '../../services/localstorage';
import { ROUTES } from '../../const/routes';
import Button from '../../components/Button/Button';
import BackButton from '../../components/BackButton/BackButton';
import { COLORS } from '../../const/colors';
import type { RegisterCredentials } from '../../types/User';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mutateAsync, isPending, isError, error } = useRegister();

  // Obtener el rol del state de navegación
  const role = (location.state as { role?: 'paciente' | 'profesional' })?.role;

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getAccessToken();
      if (token) {
        navigate(ROUTES.dashboard);
      }
    };
    checkAuth();
  }, [navigate]);

  // Si no hay rol seleccionado, redirigir a la selección de rol
  useEffect(() => {
    if (!role) {
      navigate(ROUTES.roleSelection);
    }
  }, [role, navigate]);

  // Validación base para todos los usuarios
  const baseValidationSchema = {
    nombre: Yup.string()
      .min(2, 'Mínimo 2 caracteres')
      .max(50, 'Máximo 50 caracteres')
      .matches(
        /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s-]+$/,
        'Solo se permiten letras, espacios y guiones'
      )
      .required('El nombre es obligatorio'),
    apellido: Yup.string()
      .min(2, 'Mínimo 2 caracteres')
      .max(50, 'Máximo 50 caracteres')
      .matches(
        /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s-]+$/,
        'Solo se permiten letras, espacios y guiones'
      )
      .required('El apellido es obligatorio'),
    email: Yup.string()
      .email('Dirección de correo electrónico no válida')
      .required('El correo electrónico es obligatorio'),
    password: Yup.string()
      .min(6, 'Mínimo 6 caracteres')
      .max(128, 'Máximo 128 caracteres')
      .required('La contraseña es obligatoria'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Las contraseñas deben coincidir')
      .required('Confirma tu contraseña'),
    fecha_nacimiento: Yup.date()
      .max(new Date(), 'La fecha no puede ser futura')
      .min(new Date(1900, 0, 1), 'Fecha no válida')
      .test('age-check', 'Debe ser mayor de 13 años', function(value) {
        if (!value) return false;
        const today = new Date();
        const birthDate = new Date(value);
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          return age - 1 >= 13;
        }
        return age >= 13;
      })
      .required('La fecha de nacimiento es obligatoria'),
    telefono: Yup.string()
      .matches(
        /^[\d\s-+()]+$/,
        'Solo se permiten números, espacios, guiones y paréntesis'
      )
      .test('phone-length', 'Debe tener entre 8 y 15 dígitos', function(value) {
        if (!value) return false;
        const digitsOnly = value.replace(/\D/g, '');
        return digitsOnly.length >= 8 && digitsOnly.length <= 15;
      })
      .required('El teléfono es obligatorio'),
  };

  // Validación adicional para profesionales
  const professionalValidationSchema = {
    ...baseValidationSchema,
    especialidad: Yup.string()
      .min(3, 'Mínimo 3 caracteres')
      .max(100, 'Máximo 100 caracteres')
      .required('La especialidad es obligatoria para profesionales'),
    descripcion: Yup.string()
      .min(10, 'Mínimo 10 caracteres')
      .max(500, 'Máximo 500 caracteres')
      .required('La descripción es obligatoria para profesionales'),
    calificacionPromedio: Yup.number()
      .min(0, 'La calificación mínima es 0')
      .max(5, 'La calificación máxima es 5')
      .optional(),
  };

  const validationSchema = Yup.object(
    role === 'profesional' ? professionalValidationSchema : baseValidationSchema
  );

  // Función para obtener mensaje de error específico según código HTTP
  const getErrorMessage = (error: any) => {
    const status = error?.response?.status || error?.status;
    const errorMessage = error?.message || error?.response?.data?.message || '';
    
    switch (status) {
      case 409:
        return {
          title: 'Email ya registrado',
          message: 'Ya existe una cuenta con este correo electrónico. Intenta iniciar sesión.'
        };
      case 400:
        // Verificar si es específicamente por email duplicado
        if (errorMessage.toLowerCase().includes('email') && 
            (errorMessage.toLowerCase().includes('uso') || 
             errorMessage.toLowerCase().includes('existe') ||
             errorMessage.toLowerCase().includes('duplicado'))) {
          return {
            title: 'Email ya registrado',
            message: 'Este correo electrónico ya está en uso. Intenta con otro email o inicia sesión.'
          };
        }
        // Para otros errores 400
        return {
          title: 'Datos inválidos',
          message: errorMessage || 'Algunos datos no son válidos. Verifica la información e intenta nuevamente.'
        };
      case 500:
        return {
          title: 'Error del servidor',
          message: 'Problemas de conectividad. Intenta nuevamente en unos momentos.'
        };
      default:
        return {
          title: 'Error de registro',
          message: errorMessage || 'Error al crear la cuenta. Intenta de nuevo.'
        };
    }
  };

  const onSubmitHandler = async (
    values: RegisterCredentials & { confirmPassword: string },
    { resetForm }: FormikHelpers<RegisterCredentials & { confirmPassword: string }>
  ) => {
    try {
      // Excluir confirmPassword antes de enviar
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...registerData } = values;
      
      // Asegurar que el rol esté incluido en los datos
      const dataWithRole = {
        ...registerData,
        rol: role!,
      };
      
      const result = await mutateAsync(dataWithRole);

      if (result.result) {
        resetForm();
        navigate(ROUTES.login);
      }
    } catch {
      // Error será manejado por React Query
    }
  };

  // No renderizar nada si no hay rol
  if (!role) {
    return null;
  }

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
            onClick={() => navigate(ROUTES.roleSelection)}
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
            {role === 'profesional' 
              ? 'Únete como profesional de la salud y gestiona tu agenda de manera eficiente.'
              : 'Únete a nuestra plataforma de gestión de turnos médicos y gestiona tus citas de manera eficiente.'}
          </p>
          <div className="flex justify-center space-x-6 text-sm">
            <div className="flex flex-col items-center">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-2"
                style={{ backgroundColor: COLORS.PRIMARY_CYAN }}
              >
                <UserPlus size={24} style={{ color: COLORS.NAVY_DARK }} />
              </div>
              <span style={{ color: COLORS.WHITE }}>Registro Fácil</span>
            </div>
            <div className="flex flex-col items-center">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-2"
                style={{ backgroundColor: COLORS.PRIMARY_CYAN }}
              >
                <Shield size={24} style={{ color: COLORS.NAVY_DARK }} />
              </div>
              <span style={{ color: COLORS.WHITE }}>Seguro</span>
            </div>
            <div className="flex flex-col items-center">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-2"
                style={{ backgroundColor: COLORS.PRIMARY_CYAN }}
              >
                <Zap size={24} style={{ color: COLORS.NAVY_DARK }} />
              </div>
              <span style={{ color: COLORS.WHITE }}>Acceso Inmediato</span>
            </div>
          </div>
        </div>
      </div>

      {/* Panel derecho - Formulario de registro */}
      <div
        className="w-full lg:w-1/2 flex flex-col justify-center px-8 py-12 relative"
        style={{ backgroundColor: COLORS.WHITE }}
      >
        {/* Botón de volver visible solo en móviles */}
        <div className="lg:hidden absolute top-6 left-6">
          <BackButton 
            label="Volver"
            onClick={() => navigate(ROUTES.roleSelection)}
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
              Crear Cuenta {role === 'profesional' ? 'Profesional' : 'Paciente'}
            </h2>
            <p
              className="text-lg"
              style={{ color: COLORS.DARK_SLATE }}
            >
              Completa tus datos para registrarte como {role}
            </p>
          </div>

          {/* Formulario */}
          <Formik
            initialValues={{
              nombre: '',
              apellido: '',
              email: '',
              password: '',
              confirmPassword: '',
              fecha_nacimiento: '',
              telefono: '',
              rol: role,
              // Campos adicionales para profesionales
              ...(role === 'profesional' && {
                especialidad: '',
                descripcion: '',
                calificacionPromedio: 4.5,
              })
            }}
            validationSchema={validationSchema}
            onSubmit={onSubmitHandler}
          >
            {({ isSubmitting, handleSubmit }) => (
              <Form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    label="Nombre"
                    name="nombre"
                    type="text"
                    placeholder="Tu nombre"
                    autoComplete="given-name"
                  />
                  <InputField
                    label="Apellido"
                    name="apellido"
                    type="text"
                    placeholder="Tu apellido"
                    autoComplete="family-name"
                  />
                </div>

                <InputField
                  label="Correo electrónico"
                  name="email"
                  type="email"
                  placeholder="tu@email.com"
                  autoComplete="email"
                />

                <InputField
                  label="Contraseña"
                  name="password"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  autoComplete="new-password"
                />

                <InputField
                  label="Confirmar contraseña"
                  name="confirmPassword"
                  type="password"
                  placeholder="Repite tu contraseña"
                  autoComplete="new-password"
                />

                <InputField
                  label="Fecha de nacimiento"
                  name="fecha_nacimiento"
                  type="date"
                  autoComplete="bday"
                />

                <InputField
                  label="Teléfono"
                  name="telefono"
                  type="tel"
                  placeholder="Ej: 2995555555"
                  autoComplete="tel"
                />

                {/* Campos adicionales para profesionales */}
                {role === 'profesional' && (
                  <>
                    <InputField
                      label="Especialidad"
                      name="especialidad"
                      type="text"
                      placeholder="Ej: Cardiología"
                    />

                    <div className="space-y-2">
                      <label
                        htmlFor="descripcion"
                        className="block text-sm font-medium"
                        style={{ color: COLORS.PRIMARY_DARK }}
                      >
                        Descripción profesional
                      </label>
                      <InputField
                        label=""
                        name="descripcion"
                        type="textarea"
                        placeholder="Cuéntanos sobre tu experiencia y áreas de especialización..."
                      />
                    </div>
                  </>
                )}

                <Button
                  variant="default"
                  className="w-full py-3 text-lg font-semibold mt-6"
                  disabled={isSubmitting || isPending}
                  onClick={() => handleSubmit()}
                >
                  {isPending ? 'Creando cuenta...' : 'Crear cuenta'}
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

                <div className="text-center mt-6">
                  <span className="text-sm" style={{ color: COLORS.DARK_SLATE }}>
                    ¿Ya tienes cuenta?{' '}
                  </span>
                  <Link
                    to={ROUTES.login}
                    className="text-sm font-medium hover:underline transition-colors duration-200"
                    style={{ color: COLORS.PRIMARY_MEDIUM }}
                  >
                    Iniciar sesión
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
