import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import { Login } from './pages/Login/Login';
import { RoleSelection } from './pages/RoleSelection/RoleSelection';
import { Register } from './pages/Register/Register';
import RecoverPassword from './pages/RecoverPassword/RecoverPassword';
import ChangePassword from './pages/ChangePassword/ChangePassword';
import Dashboard from './pages/Dashboard/Dashboard';
import AskSpecialist from './pages/AskSpecialist/AskSpecialist';
import MyAppointments from './pages/MyAppointments/MyAppointments';
import BookAppointment from './pages/BookAppointment/BookAppointment';
import SearchProfessionals from './pages/SearchProfessionals/SearchProfessionals';
import AccountSettings from './pages/AccountSettings/AccountSettings';

// Componentes de profesionales
import ProfessionalLayout from './layouts/ProfessionalLayout';
import ProfessionalDashboard from './pages/ProfessionalDashboard/ProfessionalDashboard';
import ProfessionalCalendar from './pages/ProfessionalCalendar/ProfessionalCalendar';
import ProfessionalAppointments from './pages/ProfessionalAppointments/ProfessionalAppointments';
import ProfessionalPatients from './pages/ProfessionalPatients/ProfessionalPatients';
import ProfessionalMessages from './pages/ProfessionalMessages/ProfessionalMessages';
import ProfessionalStatistics from './pages/ProfessionalStatistics/ProfessionalStatistics';
import ProfessionalProfile from './pages/ProfessionalProfile/ProfessionalProfile';
import ProfessionalSettings from './pages/ProfessionalSettings/ProfessionalSettings';
import ProfessionalAvailability from './pages/ProfessionalAvailability/ProfessionalAvailability';

// Admin
import AdminLayout from './layouts/AdminLayout';
import AdminReviewModeration from './pages/AdminReviewModeration/AdminReviewModeration';

// Debug
import DebugSession from './pages/DebugSession/DebugSession';

import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import { ROUTES } from './const/routes';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path={ROUTES.home} element={<Home />} />
        <Route path={ROUTES.login} element={<Login />} />
        <Route path={ROUTES.roleSelection} element={<RoleSelection />} />
        <Route path={ROUTES.register} element={<Register />} />
        <Route path={ROUTES.recoverPassword} element={<RecoverPassword />} />
        <Route path={ROUTES.changePassword} element={<ChangePassword />} />
        
        {/* Rutas de pacientes */}
        <Route path={ROUTES.dashboard} element={<Dashboard />} />
        <Route path={ROUTES.searchProfessionals} element={<SearchProfessionals />} />
        <Route path={ROUTES.askSpecialist} element={<AskSpecialist />} />
        <Route path={ROUTES.myAppointments} element={<MyAppointments />} />
        <Route path={ROUTES.bookAppointment} element={<BookAppointment />} />
        <Route path={ROUTES.accountSettings} element={<AccountSettings />} />

        {/* Ruta de debug (temporal) */}
        <Route path="/debug-session" element={<DebugSession />} />

        {/* Rutas de profesionales con sidebar */}
        <Route
          path="/profesional/*"
          element={
            <ProtectedRoute requiredRole="profesional">
              <ProfessionalLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<ProfessionalDashboard />} />
          <Route path="agenda" element={<ProfessionalCalendar />} />
          <Route path="turnos" element={<ProfessionalAppointments />} />
          <Route path="pacientes" element={<ProfessionalPatients />} />
          <Route path="mensajes" element={<ProfessionalMessages />} />
          <Route path="estadisticas" element={<ProfessionalStatistics />} />
          <Route path="perfil" element={<ProfessionalProfile />} />
          <Route path="configuracion" element={<ProfessionalSettings />} />
          <Route path="disponibilidad" element={<ProfessionalAvailability />} />
        </Route>

        {/* Rutas de administración */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute requiredRole="administrador">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="moderacion-resenias" element={<AdminReviewModeration />} />
        </Route>

        {/* Ruta por defecto */}
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;
