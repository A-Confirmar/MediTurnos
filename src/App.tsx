import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import { Login } from './pages/Login/Login';
import { RoleSelection } from './pages/RoleSelection/RoleSelection';
import { Register } from './pages/Register/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import { ROUTES } from './const/routes';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path={ROUTES.home} element={<Home />} />
        <Route path={ROUTES.login} element={<Login />} />
        <Route path={ROUTES.roleSelection} element={<RoleSelection />} />
        <Route path={ROUTES.register} element={<Register />} />
        <Route path={ROUTES.dashboard} element={<Dashboard />} />
        {/* Temporalmente redirigir rutas faltantes a Home */}
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;
