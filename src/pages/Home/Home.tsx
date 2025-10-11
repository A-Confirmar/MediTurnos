import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, Users, Stethoscope, Clock, Shield, MapPin } from 'lucide-react';
import Header from '../../components/Header/Header';
import Button from '../../components/Button/Button';
import { COLORS } from '../../const/colors';
import { ROUTES } from '../../const/routes';
import { getUser, getUserRole } from '../../services/localstorage';
import heroImage from '../../assets/coleccion-profesional-salud.png';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verificar si el usuario está autenticado y su rol
    const checkUserRole = async () => {
      const user = getUser();
      setIsAuthenticated(!!user);
      
      if (user) {
        const role = await getUserRole();
        const userRole = role || user.rol;
        
        // Si es profesional, redirigir a su dashboard
        if (userRole === 'profesional') {
          navigate(ROUTES.professionalDashboard, { replace: true });
        }
      }
    };
    
    checkUserRole();
  }, [navigate]);

  const especialidades = [
    'Cardiología', 'Dermatología', 'Ginecología', 'Pediatría', 
    'Psicología', 'Traumatología', 'Odontología', 'Oftalmología',
    'Neurología', 'Psiquiatría', 'Urología', 'Endocrinología'
  ];

  const beneficios = [
    {
      icon: <Search size={32} />,
      titulo: 'Encontrá tu especialista',
      descripcion: 'Miles de profesionales están disponibles para ayudarte'
    },
    {
      icon: <Calendar size={32} />,
      titulo: 'Reservá turno fácil',
      descripcion: 'Elegí el día y horario que mejor te convenga'
    },
    {
      icon: <Clock size={32} />,
      titulo: 'Recordatorios automáticos',
      descripcion: 'Te enviamos recordatorios para que no olvides tu cita'
    },
    {
      icon: <Shield size={32} />,
      titulo: 'Datos seguros',
      descripcion: 'Tu información está protegida y es confidencial'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section 
        className="relative py-20 px-4"
        style={{ 
          background: `linear-gradient(135deg, ${COLORS.PRIMARY_DARK} 0%, ${COLORS.PRIMARY_MEDIUM} 100%)` 
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Contenido Principal */}
            <div className="text-white">
              <h1 className="text-5xl font-bold mb-6 leading-tight">
                Encontrá tu especialista y pedí turno
              </h1>
              <p className="text-xl mb-8 opacity-90">
                Conectamos pacientes con los mejores profesionales de la salud
              </p>
              
              {/* Formulario de Búsqueda */}
              <div className="bg-white rounded-lg p-6 shadow-xl">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Especialidad o profesional
                    </label>
                    <div className="relative">
                      <Stethoscope className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="ej. Cardiología"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div className="md:col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ubicación
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="ej. Buenos Aires"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div className="md:col-span-1 flex items-end">
                    <Button
                      variant="default"
                      className="w-full py-2 text-sm font-medium"
                      onClick={() => {/* TODO: Implementar búsqueda */}}
                    >
                      <Search className="w-3 h-3 mr-1" />
                      Buscar
                    </Button>
                  </div>
                </div>
              </div>

              {/* Call to Action - Solo si NO está autenticado */}
              {!isAuthenticated && (
                <div className="flex flex-wrap gap-4 mt-8">
                  <Button
                    variant="light"
                    className="px-6 py-2"
                    onClick={() => navigate(ROUTES.roleSelection)}
                  >
                    Registrarse gratis
                  </Button>
                  <Button
                    variant="light"
                    className="px-6 py-2"
                    onClick={() => navigate(ROUTES.login)}
                  >
                    Iniciar sesión
                  </Button>
                </div>
              )}
            </div>

            {/* Ilustración/Imagen */}
            <div className="hidden lg:block">
              <div className="w-full h-96 flex items-center justify-center">
                <img 
                  src={heroImage} 
                  alt="Profesionales de la salud - MediTurnos"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Especialidades */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Especialidades disponibles
            </h2>
            <p className="text-lg text-gray-600">
              Encontrá el profesional que necesitás
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {especialidades.map((especialidad, index) => (
              <Button
                key={index}
                variant="light"
                className="p-4 text-center"
                onClick={() => {/* TODO: Implementar filtro por especialidad */}}
              >
                {especialidad}
              </Button>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Button variant="default" className="px-6 py-2">
              Ver todas las especialidades
            </Button>
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ¿Por qué elegir MediTurnos?
            </h2>
            <p className="text-lg text-gray-600">
              La forma más fácil y segura de gestionar tus turnos médicos
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {beneficios.map((beneficio, index) => (
              <div key={index} className="text-center">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: `${COLORS.PRIMARY_LIGHT}30` }}
                >
                  <div style={{ color: COLORS.PRIMARY_MEDIUM }}>
                    {beneficio.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {beneficio.titulo}
                </h3>
                <p className="text-gray-600">
                  {beneficio.descripcion}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Final - Solo si NO está autenticado */}
      {!isAuthenticated && (
        <section 
          className="py-16 px-4"
          style={{ backgroundColor: COLORS.NAVY_DARK }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              ¿Listo para comenzar?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Únete a miles de usuarios que ya confían en MediTurnos
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                variant="default"
                className="px-6 py-3 text-base font-semibold"
                onClick={() => navigate(ROUTES.roleSelection)}
              >
                <Users className="w-4 h-4 mr-2" />
                Registrarse
              </Button>
              <Button
                variant="light"
                className="px-6 py-3 text-base font-semibold"
                onClick={() => navigate(ROUTES.login)}
              >
                <Stethoscope className="w-4 h-4 mr-2" />
                Soy profesional
              </Button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;