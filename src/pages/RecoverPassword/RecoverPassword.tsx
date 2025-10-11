import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, type FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import InputField from '../../components/InputField/InputField';
import { useRecoverPassword } from '../../services/auth/useRecoverPassword';
import { ROUTES } from '../../const/routes';
import Button from '../../components/Button/Button';
import { COLORS } from '../../const/colors';

export const RecoverPassword: React.FC = () => {
  const navigate = useNavigate();
  const { mutateAsync, isPending, isError, error, isSuccess } = useRecoverPassword();
  const [emailSent, setEmailSent] = useState(false);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Dirección de correo electrónico no válida')
      .required('El correo electrónico es obligatorio'),
  });

  const onSubmitHandler = async (
    values: { email: string },
    { setSubmitting }: FormikHelpers<{ email: string }>
  ) => {
    try {
      await mutateAsync({ email: values.email });
      setEmailSent(true);
      setSubmitting(false);
    } catch {
      setSubmitting(false);
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
          {/* Botón de volver */}
          <button
            onClick={() => navigate(ROUTES.login)}
            className="flex items-center gap-2 mb-6 text-sm font-medium hover:opacity-80 transition-opacity"
            style={{ color: COLORS.PRIMARY_MEDIUM }}
          >
            <ArrowLeft size={18} />
            Volver al inicio de sesión
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: COLORS.PRIMARY_CYAN }}
            >
              <Mail size={32} style={{ color: COLORS.PRIMARY_DARK }} />
            </div>
            <h1 
              className="text-3xl font-bold mb-2"
              style={{ color: COLORS.PRIMARY_DARK }}
            >
              Recuperar Contraseña
            </h1>
            <p 
              className="text-base"
              style={{ color: COLORS.DARK_SLATE }}
            >
              {emailSent 
                ? '¡Revisa tu correo electrónico!' 
                : 'Ingresa tu email y te enviaremos instrucciones'}
            </p>
          </div>

          {/* Mensaje de éxito */}
          {isSuccess && emailSent && (
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
                <p className="font-semibold mb-1">Correo enviado exitosamente</p>
                <p className="text-sm">
                  Hemos enviado un correo a tu dirección de email con instrucciones para recuperar tu contraseña.
                  Por favor, revisa tu bandeja de entrada y sigue los pasos indicados.
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
                <p className="font-semibold mb-1">Error al enviar el correo</p>
                <p className="text-sm">
                  {error instanceof Error ? error.message : 'No se pudo enviar el correo de recuperación. Por favor, verifica tu email e intenta nuevamente.'}
                </p>
              </div>
            </div>
          )}

          {/* Formulario */}
          {!emailSent && (
            <Formik
              initialValues={{ email: '' }}
              validationSchema={validationSchema}
              onSubmit={onSubmitHandler}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-6">
                  <InputField
                    label="Correo electrónico"
                    name="email"
                    type="email"
                    placeholder="Ingresa tu correo electrónico"
                    autoComplete="email"
                  />
                  
                  <Button
                    variant="default"
                    className="w-full py-3 text-base font-semibold"
                    disabled={isSubmitting || isPending}
                    type="submit"
                  >
                    {isPending ? 'Enviando...' : 'Enviar correo de recuperación'}
                  </Button>

                  <div className="text-center pt-4 border-t" style={{ borderColor: '#e5e7eb' }}>
                    <p className="text-sm" style={{ color: COLORS.DARK_SLATE }}>
                      ¿Recordaste tu contraseña?{' '}
                      <Link
                        to={ROUTES.login}
                        className="font-medium hover:underline transition-colors"
                        style={{ color: COLORS.PRIMARY_MEDIUM }}
                      >
                        Iniciar sesión
                      </Link>
                    </p>
                  </div>
                </Form>
              )}
            </Formik>
          )}

          {/* Opciones después de enviar el email */}
          {emailSent && (
            <div className="space-y-4">
              <Button
                variant="default"
                className="w-full py-3 text-base font-semibold"
                onClick={() => navigate(ROUTES.login)}
              >
                Volver al inicio de sesión
              </Button>

              <button
                onClick={() => setEmailSent(false)}
                className="w-full py-3 text-base font-medium hover:opacity-80 transition-opacity"
                style={{ color: COLORS.PRIMARY_MEDIUM }}
              >
                Enviar otro correo
              </button>
            </div>
          )}
        </div>

        {/* Información adicional */}
        <div 
          className="mt-6 text-center text-sm"
          style={{ color: COLORS.DARK_SLATE }}
        >
          <p>Si no recibes el correo en unos minutos, revisa tu carpeta de spam.</p>
        </div>
      </div>
    </div>
  );
};

export default RecoverPassword;

