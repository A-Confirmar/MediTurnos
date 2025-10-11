import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Formik, Form, type FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { Lock, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import InputField from '../../components/InputField/InputField';
import { useChangePassword } from '../../services/auth/useChangePassword';
import { ROUTES } from '../../const/routes';
import Button from '../../components/Button/Button';
import { COLORS } from '../../const/colors';

export const ChangePassword: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { mutateAsync, isPending, isError, error, isSuccess } = useChangePassword();
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Obtener el token de la URL
  const token = searchParams.get('token');

  useEffect(() => {
    // Si no hay token, redirigir a recuperar contraseña
    if (!token) {
      navigate(ROUTES.recoverPassword);
    }
  }, [token, navigate]);

  const validationSchema = Yup.object({
    newPassword: Yup.string()
      .min(6, 'Mínimo 6 caracteres')
      .max(128, 'Máximo 128 caracteres')
      .required('La nueva contraseña es obligatoria'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword')], 'Las contraseñas deben coincidir')
      .required('Confirma tu nueva contraseña'),
  });

  const onSubmitHandler = async (
    values: { newPassword: string; confirmPassword: string },
    { setSubmitting }: FormikHelpers<{ newPassword: string; confirmPassword: string }>
  ) => {
    if (!token) {
      return;
    }

    try {
      await mutateAsync({
        token: token,
        newPassword: values.newPassword
      });
      setPasswordChanged(true);
      setSubmitting(false);
    } catch {
      setSubmitting(false);
    }
  };

  // Función para obtener mensaje de error específico
  const getErrorMessage = (error: Error & { response?: { status?: number; data?: { message?: string } }; status?: number }) => {
    const status = error?.response?.status || error?.status;
    
    switch (status) {
      case 400:
        return 'Token inválido o expirado. Solicita un nuevo correo de recuperación.';
      case 404:
        return 'Token no encontrado. Verifica el enlace o solicita uno nuevo.';
      case 500:
        return 'Error del servidor. Intenta nuevamente en unos momentos.';
      default:
        return error?.message || 
               error?.response?.data?.message || 
               'Error al cambiar la contraseña. Intenta nuevamente.';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#f9fafb' }}>
      <div className="max-w-md w-full">
        {/* Card */}
        <div 
          className="rounded-lg shadow-lg p-8"
          style={{ backgroundColor: COLORS.WHITE }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: COLORS.PRIMARY_CYAN }}
            >
              <Lock size={32} style={{ color: COLORS.PRIMARY_DARK }} />
            </div>
            <h1 
              className="text-3xl font-bold mb-2"
              style={{ color: COLORS.PRIMARY_DARK }}
            >
              {passwordChanged ? '¡Contraseña actualizada!' : 'Cambiar Contraseña'}
            </h1>
            <p 
              className="text-base"
              style={{ color: COLORS.DARK_SLATE }}
            >
              {passwordChanged 
                ? 'Tu contraseña ha sido cambiada exitosamente' 
                : 'Ingresa tu nueva contraseña'}
            </p>
          </div>

          {/* Mensaje de éxito */}
          {isSuccess && passwordChanged && (
            <div 
              className="mb-6 p-4 rounded-lg border flex items-start gap-3"
              style={{ 
                backgroundColor: '#f0fdf4', 
                borderColor: '#86efac',
                color: '#15803d'
              }}
            >
              <CheckCircle size={20} className="flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-1">Contraseña actualizada</p>
                <p className="text-sm">
                  Ya puedes iniciar sesión con tu nueva contraseña.
                </p>
              </div>
            </div>
          )}

          {/* Mensaje de error */}
          {isError && (
            <div 
              className="mb-6 p-4 rounded-lg border flex items-start gap-3"
              style={{ 
                backgroundColor: '#fef2f2', 
                borderColor: '#fca5a5',
                color: '#dc2626'
              }}
            >
              <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-1">Error al cambiar contraseña</p>
                <p className="text-sm">
                  {getErrorMessage(error)}
                </p>
              </div>
            </div>
          )}

          {/* Formulario */}
          {!passwordChanged && token && (
            <Formik
              initialValues={{ newPassword: '', confirmPassword: '' }}
              validationSchema={validationSchema}
              onSubmit={onSubmitHandler}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-6">
                  {/* Nueva contraseña */}
                  <div className="relative">
                    <InputField
                      label="Nueva contraseña"
                      name="newPassword"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Mínimo 6 caracteres"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-[42px] text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                  {/* Confirmar contraseña */}
                  <div className="relative">
                    <InputField
                      label="Confirmar nueva contraseña"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Repite tu nueva contraseña"
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-[42px] text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>

                  {/* Requisitos de contraseña */}
                  <div 
                    className="p-3 rounded-lg text-sm"
                    style={{ 
                      backgroundColor: '#f0f9ff',
                      color: '#0c4a6e'
                    }}
                  >
                    <p className="font-medium mb-1">Requisitos de la contraseña:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>Mínimo 6 caracteres</li>
                      <li>Máximo 128 caracteres</li>
                      <li>Debe ser diferente a tu contraseña anterior</li>
                    </ul>
                  </div>
                  
                  <Button
                    variant="default"
                    className="w-full py-3 text-base font-semibold"
                    disabled={isSubmitting || isPending}
                    type="submit"
                  >
                    {isPending ? 'Cambiando contraseña...' : 'Cambiar contraseña'}
                  </Button>
                </Form>
              )}
            </Formik>
          )}

          {/* Botón para ir al login después de cambiar contraseña */}
          {passwordChanged && (
            <div className="space-y-4">
              <Button
                variant="default"
                className="w-full py-3 text-base font-semibold"
                onClick={() => navigate(ROUTES.login)}
              >
                Ir al inicio de sesión
              </Button>
            </div>
          )}

          {/* Enlace para solicitar nuevo correo */}
          {!passwordChanged && (
            <div className="text-center pt-4 border-t" style={{ borderColor: '#e5e7eb' }}>
              <p className="text-sm" style={{ color: COLORS.DARK_SLATE }}>
                ¿El enlace expiró?{' '}
                <button
                  onClick={() => navigate(ROUTES.recoverPassword)}
                  className="font-medium hover:underline transition-colors"
                  style={{ color: COLORS.PRIMARY_MEDIUM }}
                >
                  Solicitar nuevo correo
                </button>
              </p>
            </div>
          )}
        </div>

        {/* Información adicional */}
        <div 
          className="mt-6 text-center text-sm"
          style={{ color: COLORS.DARK_SLATE }}
        >
          <p>Por tu seguridad, este enlace expira después de un tiempo.</p>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;

