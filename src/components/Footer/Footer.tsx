import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import { ROUTES } from '../../const/routes';
import iconoMediTurnos from '../../assets/icono-MediTurnos.png';

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    pacientes: [
      { label: 'Buscar Profesionales', route: ROUTES.searchProfessionals },
      { label: 'Mis Turnos', route: ROUTES.myAppointments },
      { label: 'Configuración', route: ROUTES.accountSettings },
    ],
    profesionales: [
      { label: 'Portal Profesional', route: ROUTES.professionalDashboard },
      { label: 'Gestión de Turnos', route: ROUTES.professionalAppointments },
      { label: 'Mis Pacientes', route: ROUTES.professionalPatients },
      { label: 'Disponibilidad', route: ROUTES.professionalAvailability },
    ],
    ayuda: [
      { label: 'Centro de Ayuda', route: '#' },
      { label: 'Preguntas Frecuentes', route: '#' },
      { label: 'Términos y Condiciones', route: '#' },
      { label: 'Política de Privacidad', route: '#' },
    ],
  };


  return (
    <footer className="bg-[#1e3a8a] text-white">
      {/* Contenido principal del footer */}
      <div className="max-w-[1400px] mx-auto px-8 py-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Columna 1: Información de la empresa */}
          <div>
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-1.5">
                <img 
                  src={iconoMediTurnos} 
                  alt="MediTurnos" 
                  className="w-full h-full object-contain"
                />
              </div>
              MediTurnos
            </h3>
            <p className="text-base leading-relaxed text-slate-300 mb-6">
              Conectamos pacientes con los mejores profesionales de la salud. 
              Tu bienestar es nuestra prioridad.
            </p>
            
            {/* Información de contacto */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Mail size={16} />
                <span>contacto@mediturnos.com</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <Phone size={16} />
                <span>+54 299 1234-5678</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-300">
                <MapPin size={16} />
                <span>Neuquén, Argentina</span>
              </div>
            </div>
          </div>

          {/* Columna 2: Para Pacientes */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-cyan-400">
              Para Pacientes
            </h4>
            <ul className="list-none p-0 m-0 space-y-3">
              {footerLinks.pacientes.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => navigate(link.route)}
                    className="bg-transparent border-0 outline-none text-slate-300 text-base cursor-pointer p-0 transition-colors duration-200 text-left no-underline hover:text-cyan-400 focus:outline-none focus:ring-0 active:outline-none"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 3: Para Profesionales */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-cyan-400">
              Para Profesionales
            </h4>
            <ul className="list-none p-0 m-0 space-y-3">
              {footerLinks.profesionales.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => navigate(link.route)}
                    className="bg-transparent border-0 outline-none text-slate-300 text-base cursor-pointer p-0 transition-colors duration-200 text-left no-underline hover:text-cyan-400 focus:outline-none focus:ring-0 active:outline-none"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 4: Ayuda y Legal */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-cyan-400">
              Ayuda y Legal
            </h4>
            <ul className="list-none p-0 m-0 space-y-3">
              {footerLinks.ayuda.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.route}
                    className="text-slate-300 text-base no-underline transition-colors duration-200 hover:text-cyan-400 focus:outline-none active:outline-none"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 text-center">
          <p className="m-0 text-sm text-slate-400">
            © {currentYear} MediTurnos. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
