import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, Users, Stethoscope, Clock, Shield } from 'lucide-react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import Button from '../../components/Button/Button';
import SpecialtyAutocomplete from '../../components/SpecialtyAutocomplete/SpecialtyAutocomplete';
import LocationAutocomplete from '../../components/LocationAutocomplete/LocationAutocomplete';
import { useGetActiveSpecialties } from '../../services/professionals/useGetActiveSpecialties';
import { ROUTES } from '../../const/routes';
import { getUser, getUserRole } from '../../services/localstorage';
import heroImage from '../../assets/coleccion-profesional-salud.png';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [showAllSpecialties, setShowAllSpecialties] = useState(false);
  
  // Obtener especialidades activas (con profesionales)
  const { activeSpecialties, isLoading: loadingSpecialties } = useGetActiveSpecialties();

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
        className="relative py-20 px-4 bg-gradient-to-br from-[#072769] to-[#075ba4]"
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
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Autocomplete de Especialidad */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Especialidad o profesional
                    </label>
                    <SpecialtyAutocomplete
                      value={searchQuery}
                      onChange={setSearchQuery}
                      placeholder="ej. Psicólogo, Cardiólogo..."
                    />
                  </div>
                  
                  {/* Autocomplete de Ubicación */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
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
                <div className="mt-4">
                  <button
                    type="submit"
                    className="w-full py-3 px-8 bg-[#075ba4] hover:bg-[#072769] text-white rounded-lg text-base font-semibold cursor-pointer flex items-center justify-center gap-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#075ba4] focus:ring-offset-2"
                  >
                    <Search size={20} />
                    Buscar profesionales
                  </button>
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
            {especialidades.slice(0, showAllSpecialties ? especialidades.length : 12).map((especialidad) => {
              const isActive = activeSpecialties.has(especialidad);
              
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
                    py-6 px-4 text-base font-medium rounded-lg border-2 transition-all duration-300
                    focus:outline-none
                    ${isActive 
                      ? 'bg-[#075ba4] border-[#075ba4] text-white shadow-sm cursor-pointer hover:bg-[#072769] hover:border-[#072769] hover:scale-105 hover:shadow-lg' 
                      : !loadingSpecialties 
                        ? 'bg-gray-100 border-gray-200 text-gray-400 opacity-60 cursor-not-allowed pointer-events-none' 
                        : 'bg-[#075ba4] border-[#075ba4] text-white cursor-wait'
                    }
                  `}
                >
                  {especialidad}
                </button>
              );
            })}
          </div>
          <div className='flex justify-center'>
            <button
              onClick={() => setShowAllSpecialties(!showAllSpecialties)}
              className='px-8 py-4 text-lg font-semibold bg-[#075ba4] hover:bg-[#072769] text-white rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#075ba4] focus:ring-offset-2'
            >
              {showAllSpecialties ? 'Ver menos especialidades' : 'Ver todas las especialidades'}
            </button>
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
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-[#5080fd]/20">
                  <div className="text-[#075ba4]">
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
          className="py-16 px-4 bg-[#1f2b5b]"
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

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;