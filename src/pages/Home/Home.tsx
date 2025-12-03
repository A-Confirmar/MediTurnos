import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, Users, Stethoscope, Clock, Shield } from 'lucide-react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import SpecialtyAutocomplete from '../../components/SpecialtyAutocomplete/SpecialtyAutocomplete';
import LocationAutocomplete from '../../components/LocationAutocomplete/LocationAutocomplete';
import { useGetActiveSpecialties } from '../../services/professionals/useGetActiveSpecialties';
import { ROUTES } from '../../const/routes';
import { getUser, getUserRole } from '../../services/localstorage';
import heroImage from '../../assets/equipo-profesional-salud.png';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [showAllSpecialties, setShowAllSpecialties] = useState(false);
  
  // Verificar autenticación ANTES de cargar especialidades
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

  // Obtener especialidades activas solo si está autenticado
  // Si no está autenticado, simplemente no cargamos el filtro (se mostrarán todas las especialidades)
  const { activeSpecialties, isLoading: loadingSpecialties } = useGetActiveSpecialties({ 
    enabled: isAuthenticated 
  });

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      {/* Hero Section Moderno */}
      <section className="relative bg-gradient-to-br from-[#072769] via-[#075ba4] to-[#1f2b5b] pb-40 overflow-hidden">
        {/* Decoración de fondo */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-20 right-0 w-96 h-96 bg-[#3dbdec]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#5080fd]/10 rounded-full blur-3xl"></div>
        </div>

        {/* Contenido */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Columna Izquierda - Texto y Buscador */}
            <div className="order-2 lg:order-1">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-4 border border-white/20">
                <Stethoscope size={16} />
                <span>Tu salud, nuestra prioridad</span>
              </div>

              {/* Título Principal */}
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
                Encontrá tu especialista
                <span className="block text-[#3dbdec] mt-2">en minutos</span>
              </h1>
              
              <p className="text-base md:text-lg text-gray-100 mb-6 leading-relaxed">
                Conectamos pacientes con los mejores profesionales de la salud. Simple, rápido y seguro.
              </p>
              
              {/* Formulario de Búsqueda - Card Flotante */}
              <form onSubmit={handleSearch} className="bg-white rounded-xl p-5 shadow-2xl backdrop-blur-lg">
                <div className="grid md:grid-cols-2 gap-3 mb-3">
                  {/* Autocomplete de Especialidad */}
                  <div className="text-left">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Search size={16} className="text-[#075ba4]" />
                      Especialidad
                    </label>
                    <SpecialtyAutocomplete
                      value={searchQuery}
                      onChange={setSearchQuery}
                      placeholder="ej. Psicólogo, Cardiólogo..."
                    />
                  </div>
                  
                  {/* Autocomplete de Ubicación */}
                  <div className="text-left">
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Users size={16} className="text-[#075ba4]" />
                      Ubicación
                    </label>
                    <LocationAutocomplete
                      value={searchLocation}
                      onChange={setSearchLocation}
                      placeholder="ej. Buenos Aires, Neuquén..."
                    />
                  </div>
                </div>

                {/* Botón de búsqueda */}
                <button
                  type="submit"
                  className="w-full py-3 px-6 bg-gradient-to-r from-[#075ba4] to-[#072769] hover:from-[#072769] hover:to-[#075ba4] text-white rounded-lg text-base font-bold cursor-pointer flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#3dbdec] focus:ring-offset-2"
                >
                  <Search size={20} />
                  Buscar ahora
                </button>
              </form>

              {/* Call to Action - Solo si NO está autenticado */}
              {!isAuthenticated && (
                <div className="flex flex-wrap gap-3 mt-6">
                  <button
                    onClick={() => navigate(ROUTES.roleSelection)}
                    className="px-8 py-3 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-lg font-semibold transition-all duration-200 border border-white/30 hover:border-white/50"
                  >
                    Registrarse gratis
                  </button>
                  <button
                    onClick={() => navigate(ROUTES.login)}
                    className="px-8 py-3 bg-white hover:bg-gray-50 text-[#072769] rounded-lg font-semibold transition-all duration-200 shadow-lg"
                  >
                    Iniciar sesión
                  </button>
                </div>
              )}
            </div>

            {/* Columna Derecha - Imagen */}
            <div className="order-1 lg:order-2 flex items-end justify-center lg:justify-end h-full overflow-hidden">
              <div className="relative w-full max-w-lg">
                {/* Círculo decorativo detrás */}
                <div className="absolute -inset-10 bg-white/5 rounded-full blur-3xl"></div>
                
                {/* Imagen - responsiva sin overflow en pantallas pequeñas */}
                <img 
                  src={heroImage} 
                  alt="Profesionales de la salud - MediTurnos"
                  className="relative z-10 w-full h-auto object-contain object-bottom drop-shadow-2xl 
                    scale-100 translate-x-0 translate-y-0
                    md:scale-125 md:translate-x-[30px]
                    lg:scale-150 lg:translate-x-[60px] lg:translate-y-[5px]
                    xl:scale-190 xl:translate-x-[120px] xl:translate-y-[10px]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Especialidades */}
      <section className='py-20 px-6 bg-gradient-to-b from-gray-50 to-white'>
        <div className='max-w-7xl mx-auto'>
          {/* Encabezado */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-[#075ba4]/10 text-[#075ba4] rounded-full text-sm font-semibold mb-4">
              Especialidades
            </span>
            <h2 className='text-4xl md:text-5xl font-extrabold text-gray-900 mb-4'>
              Encontrá el especialista ideal
            </h2>
            <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
              Más de 60 especialidades médicas disponibles para tu cuidado
            </p>
          </div>
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12'>
            {especialidades.slice(0, showAllSpecialties ? especialidades.length : 12).map((especialidad) => {
              // Si no está autenticado, todas las especialidades están "activas" (habilitadas)
              // Si está autenticado, solo las que tienen profesionales
              const isActive = !isAuthenticated || activeSpecialties.has(especialidad);
              
              return (
                <button
                  key={especialidad}
                  onClick={() => {
                    if (isActive) {
                      setSearchQuery(especialidad);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  disabled={!isActive && !loadingSpecialties}
                  className={`
                    group py-5 px-4 text-sm font-semibold rounded-xl border-2 transition-all duration-300
                    focus:outline-none relative overflow-hidden
                    ${isActive 
                      ? 'bg-white border-[#075ba4] text-[#075ba4] shadow-md cursor-pointer hover:bg-[#075ba4] hover:text-white hover:scale-105 hover:shadow-xl' 
                      : !loadingSpecialties 
                        ? 'bg-gray-50 border-gray-200 text-gray-400 opacity-50 cursor-not-allowed pointer-events-none' 
                        : 'bg-white border-[#075ba4] text-[#075ba4] cursor-wait animate-pulse'
                    }
                  `}
                >
                  <span className="relative z-10">{especialidad}</span>
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-[#075ba4] to-[#072769] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  )}
                </button>
              );
            })}
          </div>
          <div className='flex justify-center'>
            <button
              onClick={() => setShowAllSpecialties(!showAllSpecialties)}
              className='group px-8 py-4 text-base font-bold bg-gradient-to-r from-[#075ba4] to-[#072769] hover:from-[#072769] hover:to-[#075ba4] text-white rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#3dbdec] focus:ring-offset-2 flex items-center gap-2'
            >
              {showAllSpecialties ? (
                <>
                  Ver menos especialidades
                  <svg className="w-5 h-5 group-hover:translate-y-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </>
              ) : (
                <>
                  Ver todas las especialidades
                  <svg className="w-5 h-5 group-hover:translate-y-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-[#3dbdec]/10 text-[#3dbdec] rounded-full text-sm font-semibold mb-4">
              Beneficios
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              ¿Por qué elegir MediTurnos?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              La plataforma más completa para gestionar tu salud
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {beneficios.map((beneficio, index) => (
              <div 
                key={index} 
                className="group text-center p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-white hover:from-[#075ba4]/5 hover:to-[#3dbdec]/5 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border border-gray-100"
              >
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 bg-gradient-to-br from-[#075ba4]/10 to-[#3dbdec]/10 group-hover:from-[#075ba4]/20 group-hover:to-[#3dbdec]/20 transition-all duration-300 group-hover:scale-110">
                  <div className="text-[#075ba4] group-hover:scale-110 transition-transform duration-300">
                    {beneficio.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#075ba4] transition-colors">
                  {beneficio.titulo}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {beneficio.descripcion}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Final - Solo si NO está autenticado */}
      {!isAuthenticated && (
        <section className="relative py-20 px-4 overflow-hidden">
          {/* Fondo con gradiente */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#072769] via-[#075ba4] to-[#1f2b5b]"></div>
          
          {/* Decoración con círculos */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#3dbdec]/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#5080fd]/20 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
              ¿Listo para comenzar?
            </h2>
            <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto">
              Únete a <span className="text-[#3dbdec] font-bold">miles de usuarios</span> que ya confían en MediTurnos
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => navigate(ROUTES.roleSelection)}
                className="group px-8 py-4 bg-white hover:bg-gray-50 text-[#072769] rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center gap-2"
              >
                <Users className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Registrarse ahora
              </button>
              <button
                onClick={() => navigate(ROUTES.login)}
                className="group px-8 py-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white rounded-xl font-bold text-lg border-2 border-white/30 hover:border-white/50 transition-all duration-300 flex items-center gap-2"
              >
                <Stethoscope className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Soy profesional
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;