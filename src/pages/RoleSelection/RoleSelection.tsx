import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle, Stethoscope } from 'lucide-react';
import { ROUTES } from '../../const/routes';
import { COLORS } from '../../const/colors';
import BackButton from '../../components/BackButton/BackButton';

export const RoleSelection: React.FC = () => {
  const navigate = useNavigate();

  const handleRoleSelection = (role: 'paciente' | 'profesional') => {
    navigate(ROUTES.register, { state: { role } });
  };

  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: COLORS.PRIMARY_DARK }}
    >
      {/* Botón de volver */}
      <div className="absolute top-6 left-6 z-10">
        <BackButton 
          label="Volver"
          onClick={() => navigate(ROUTES.home)}
          size="md"
          color={COLORS.WHITE}
        />
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-4xl w-full">
          {/* Header */}
          <div className="text-center mb-12">
            <h1
              className="text-4xl md:text-5xl font-bold mb-4"
              style={{ color: COLORS.WHITE }}
            >
              ¿Cómo deseas registrarte?
            </h1>
            <p
              className="text-xl md:text-2xl"
              style={{ color: COLORS.PRIMARY_CYAN }}
            >
              Selecciona el tipo de cuenta que necesitas
            </p>
          </div>

          {/* Opciones de rol */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Opción Paciente */}
            <button
              onClick={() => handleRoleSelection('paciente')}
              className="group relative overflow-hidden rounded-2xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              style={{ 
                backgroundColor: COLORS.WHITE,
                border: `3px solid ${COLORS.PRIMARY_CYAN}`
              }}
            >
              <div className="flex flex-col items-center text-center space-y-6">
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                  style={{ backgroundColor: COLORS.PRIMARY_CYAN }}
                >
                  <UserCircle 
                    size={48} 
                    style={{ color: COLORS.WHITE }}
                  />
                </div>
                
                <div>
                  <h3
                    className="text-2xl font-bold mb-2"
                    style={{ color: COLORS.PRIMARY_DARK }}
                  >
                    Paciente
                  </h3>
                  <p
                    className="text-base"
                    style={{ color: COLORS.DARK_SLATE }}
                  >
                    Registrate para gestionar tus turnos médicos,
                    consultar profesionales y acceder a tu historial clínico.
                  </p>
                </div>

                <div
                  className="w-full py-3 rounded-lg font-semibold transition-all duration-300 group-hover:shadow-lg"
                  style={{ 
                    backgroundColor: COLORS.PRIMARY_MEDIUM,
                    color: COLORS.WHITE
                  }}
                >
                  Soy Paciente
                </div>
              </div>
            </button>

            {/* Opción Profesional */}
            <button
              onClick={() => handleRoleSelection('profesional')}
              className="group relative overflow-hidden rounded-2xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              style={{ 
                backgroundColor: COLORS.WHITE,
                border: `3px solid ${COLORS.PRIMARY_CYAN}`
              }}
            >
              <div className="flex flex-col items-center text-center space-y-6">
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                  style={{ backgroundColor: COLORS.PRIMARY_CYAN }}
                >
                  <Stethoscope 
                    size={48} 
                    style={{ color: COLORS.WHITE }}
                  />
                </div>
                
                <div>
                  <h3
                    className="text-2xl font-bold mb-2"
                    style={{ color: COLORS.PRIMARY_DARK }}
                  >
                    Profesional
                  </h3>
                  <p
                    className="text-base"
                    style={{ color: COLORS.DARK_SLATE }}
                  >
                    Registrate como profesional de la salud para gestionar
                    tu agenda, atender pacientes y administrar consultas.
                  </p>
                </div>

                <div
                  className="w-full py-3 rounded-lg font-semibold transition-all duration-300 group-hover:shadow-lg"
                  style={{ 
                    backgroundColor: COLORS.PRIMARY_MEDIUM,
                    color: COLORS.WHITE
                  }}
                >
                  Soy Profesional
                </div>
              </div>
            </button>
          </div>

          {/* Footer */}
          <div className="text-center mt-12">
            <p
              className="text-sm"
              style={{ color: COLORS.PRIMARY_CYAN }}
            >
              ¿Ya tienes cuenta?{' '}
              <button
                onClick={() => navigate(ROUTES.login)}
                className="font-semibold hover:underline transition-all duration-200"
                style={{ color: COLORS.WHITE }}
              >
                Iniciar sesión
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

