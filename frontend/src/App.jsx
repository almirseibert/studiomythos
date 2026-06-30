import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';

import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import KanbanCRM from './pages/KanbanCRM';
import ClientesList from './pages/ClientesList';
import Financeiro from './pages/Financeiro';
import Relatorios from './pages/Relatorios';
import UsuariosAdmin from './pages/UsuariosAdmin';
import Prospeccao from './pages/Prospeccao';
import LeadDetail from './pages/LeadDetail';
import AppsList from './pages/AppsList';
import AppPage from './pages/AppPage';
import ServicePage from './pages/ServicePage';
import Capacetes from './pages/Capacetes';
import PersonalizarCapacete from './pages/PersonalizarCapacete';
import TrabalheConosco from './pages/TrabalheConosco';
import CadastroCurriculo from './pages/CadastroCurriculo';
import ExclusaoConta from './pages/ExclusaoConta';
import Administracao from './pages/Administracao';
import AdminCurriculos from './pages/AdminCurriculos';
import AdminOrcamentos from './pages/AdminOrcamentos';
import ScriptsVendas from './pages/ScriptsVendas';
import WhatsApp from './pages/WhatsApp';
import { isAuthenticated } from './services/auth';

function Protegida({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/apps" element={<AppsList />} />
        <Route path="/apps/:slug" element={<AppPage />} />
        <Route path="/servicos/:slug" element={<ServicePage />} />
        <Route path="/capacetes" element={<Capacetes />} />
        <Route path="/capacetes/personalizar" element={<PersonalizarCapacete />} />
        <Route path="/trabalhe-conosco" element={<TrabalheConosco />} />
        <Route path="/trabalhe-conosco/cadastro" element={<CadastroCurriculo />} />
        <Route path="/apps/exclusao-conta" element={<ExclusaoConta />} />

        <Route path="/dashboard" element={<Protegida><Dashboard /></Protegida>} />
        <Route path="/prospeccao" element={<Protegida><Prospeccao /></Protegida>} />
        <Route path="/scripts-vendas" element={<Protegida><ScriptsVendas /></Protegida>} />
        <Route path="/crm" element={<Protegida><KanbanCRM /></Protegida>} />
        <Route path="/clientes" element={<Protegida><ClientesList /></Protegida>} />
        <Route path="/leads/:id" element={<Protegida><LeadDetail /></Protegida>} />
        <Route path="/financeiro" element={<Protegida><Financeiro /></Protegida>} />
        <Route path="/relatorios" element={<Protegida><Relatorios /></Protegida>} />
        <Route path="/usuarios" element={<Protegida><UsuariosAdmin /></Protegida>} />
        <Route path="/admin" element={<Protegida><Administracao /></Protegida>} />
        <Route path="/admin/curriculos" element={<Protegida><AdminCurriculos /></Protegida>} />
        <Route path="/admin/orcamentos" element={<Protegida><AdminOrcamentos /></Protegida>} />
        <Route path="/whatsapp" element={<Protegida><WhatsApp /></Protegida>} />

        <Route path="*" element={
          <div className="h-screen flex flex-col items-center justify-center bg-obsidian text-white">
            <h1 className="text-5xl font-extrabold mb-3">404</h1>
            <p className="text-slate-400 mb-6">Página não encontrada.</p>
            <Link to="/" className="text-violet-400 hover:underline font-medium">Voltar ao Início</Link>
          </div>
        } />
      </Routes>
    </Router>
  );
}
