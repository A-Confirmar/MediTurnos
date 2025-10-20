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
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [showAllSpecialties, setShowAllSpecialties] = useState(false);

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

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // Construir query params
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.append('query', searchQuery.trim());
    if (searchLocation.trim()) params.append('localidad', searchLocation.trim());
    
    // Navegar a búsqueda con parámetros
    const searchPath = params.toString() 
      ? `${ROUTES.searchProfessionals}?${params.toString()}`
      : ROUTES.searchProfessionals;
    
    navigate(searchPath);
  };

  const especialidades = [
    'Odontólogo', 'Ginecólogo', 'Psicólogo', 'Traumatólogo', 'Médico Clínico', 'Dermatólogo', 'Oftalmólogo', 'Otorrino', 'Pediatra', 'Cardiólogo', 'Cirujano General', 'Gastroenterólogo', 'Psiquiatra', 'Urólogo', 'Endocrinólogo', 'Neumonólogo', 'Neurólogo', 'Kinesiólogo', 'Nutricionista', 'Alergista', 'Fonoaudiólogo', 'Cirujano Plástico', 'Médico General y Familiar', 'Neurocirujano', 'Psicoanalista', 'Reumatólogo', 'Hematólogo', 'Obstetra', 'Cirujano Oral y Maxilofacial', 'Oncólogo', 'Radiólogo', 'Infectólogo', 'Nefrólogo', 'Patólogo', 'Analista Clínico', 'Cirujano Vascular', 'Neurofisiólogo', 'Sexólogo', 'Médico Deportólogo', 'Cirujano Cardiovascular', 'Cirujano Digestivo', 'Psicopedagogo', 'Homeópata', 'Geriatra', 'Cirujano Pediátrico', 'Flebólogo', 'Médico Forense', 'Cirujano Torácico', 'Osteópata', 'Médico Laboral', 'Genetista', 'Diabetólogo', 'Hepatólogo', 'Mastólogo', 'Terapeuta Complementario', 'Podólogo', 'Anestesista', 'Especialista en Terapia Intensiva', 'Quiropráctico', 'Bioquímico', 'Enfermero', 'Farmacólogo', 'Óptico', 'Psicomotricista', 'especialista en Toxicología', 'Radioterapeuta', 'Optometría', 'Protesista - Ortesista'
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
              <form onSubmit={handleSearch} className="bg-white rounded-lg p-6 shadow-xl">
                {/* Primera fila: Input de texto y Ubicación */}
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Especialidad o profesional
                    </label>
                    <div className="relative">
                      <Stethoscope className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="ej. Cardiología"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ubicación
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={searchLocation}
                        onChange={(e) => setSearchLocation(e.target.value)}
                        placeholder="ej. Buenos Aires"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Segunda fila: Select y Botón Buscar */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Seleccionar especialidad
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400 pointer-events-none z-10" />
                      <select
                        className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white appearance-none cursor-pointer"
                        style={{ 
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                          backgroundPosition: 'right 0.5rem center',
                          backgroundRepeat: 'no-repeat',
                          backgroundSize: '1.5em 1.5em'
                        }}
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                      >
                        <option value="">Seleccionar especialidad...</option>
                        {especialidades.map(especialidad => (
                          <option key={especialidad} value={especialidad}>{especialidad}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex items-end">
                    <button
                      type="submit"
                      style={{
                        padding: '0.75rem 2rem',
                        backgroundColor: COLORS.PRIMARY_MEDIUM,
                        color: COLORS.WHITE,
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        transition: 'background-color 0.2s',
                        whiteSpace: 'nowrap',
                        width: '100%',
                        justifyContent: 'center'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = COLORS.PRIMARY_DARK;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = COLORS.PRIMARY_MEDIUM;
                      }}
                    >
                      <Search size={20} />
                      Buscar
                    </button>
                  </div>
                </div>
              </form>

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
      <section className='py-16 px-6 bg-white'>
        <div className='max-w-7xl mx-auto'>
          <h2 className='text-4xl font-bold text-center mb-4 text-gray-800'>
            Especialidades Médicas
          </h2>
          <p className='text-center text-gray-600 mb-12 max-w-2xl mx-auto'>
            Encuentra el profesional que necesitas en nuestra amplia red de especialistas
          </p>
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8'>
            {especialidades.slice(0, showAllSpecialties ? especialidades.length : 12).map((especialidad) => (
              <Button
                key={especialidad}
                onClick={() => {
                  setSearchQuery(especialidad);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className='py-6 text-base font-medium hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg bg-white border-2 border-blue-100 hover:border-blue-500'
              >
                {especialidad}
              </Button>
            ))}
          </div>
          <div className='flex justify-center'>
            <Button
              onClick={() => setShowAllSpecialties(!showAllSpecialties)}
              className='px-8 py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300'
            >
              {showAllSpecialties ? 'Ver menos especialidades' : 'Ver todas las especialidades'}
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