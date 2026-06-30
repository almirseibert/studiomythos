import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, DollarSign, FileText,
  Briefcase, Globe, LogOut, ShieldCheck, Radar, Inbox, Receipt, BookOpen, MessageSquare
} from 'lucide-react';
import { LogoMark } from './Logo';
import { getUser, isAdmin, logout } from '../services/auth';

const NavItem = ({ to, icon: Icon, label, active, accent }) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${
      active
        ? accent
          ? 'bg-red-600/90 text-white shadow-lg'
          : 'bg-brand-gradient text-white shadow-voltage'
        : 'text-slate-400 hover:bg-white/5 hover:text-white'
    }`}
  >
    <Icon size={19} /> {label}
  </Link>
);

export default function Sidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const usuario = getUser();
  const admin = isAdmin();
  const is = (p) => pathname === p || pathname.startsWith(p + '/');

  const sair = () => { logout(); navigate('/login'); };

  return (
    <aside className="w-64 bg-obsidian text-slate-300 flex flex-col hidden md:flex shadow-2xl z-20 shrink-0 border-r border-white/5">
      <div className="px-5 py-6 flex items-center gap-3 border-b border-white/5">
        <LogoMark size={38} />
        <div className="leading-none">
          <span className="text-lg font-extrabold text-white tracking-tight">Studio<span className="text-violet-400"> Mythos</span></span>
          <p className="text-[9px] font-semibold tracking-[0.25em] text-slate-500 mt-1">PAINEL INTERNO</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto custom-scrollbar">
        <p className="text-[10px] font-bold tracking-widest text-slate-600 px-3 pt-2 pb-1">OPERAÇÃO</p>
        <NavItem to="/dashboard" icon={LayoutDashboard} label="Início" active={is('/dashboard')} />
        <NavItem to="/prospeccao" icon={Radar} label="Prospecção no Mapa" active={is('/prospeccao')} />
        <NavItem to="/scripts-vendas" icon={BookOpen} label="Scripts de Vendas" active={is('/scripts-vendas')} />
        <NavItem to="/crm" icon={Briefcase} label="Funil de Vendas" active={is('/crm')} />
        <NavItem to="/clientes" icon={Users} label="Leads & Clientes" active={is('/clientes')} />

        <p className="text-[10px] font-bold tracking-widest text-slate-600 px-3 pt-4 pb-1">GESTÃO</p>
        <NavItem to="/financeiro" icon={DollarSign} label="Financeiro" active={is('/financeiro')} />
        <NavItem to="/relatorios" icon={FileText} label="Relatórios" active={is('/relatorios')} />
        {admin && <NavItem to="/usuarios" icon={ShieldCheck} label="Acessos" active={is('/usuarios')} accent />}

        {admin && (
          <>
            <p className="text-[10px] font-bold tracking-widest text-slate-600 px-3 pt-4 pb-1">ADMINISTRAÇÃO</p>
            <NavItem to="/admin" icon={Inbox} label="Administração" active={pathname === '/admin'} />
            <NavItem to="/admin/curriculos" icon={FileText} label="Currículos" active={is('/admin/curriculos')} />
            <NavItem to="/admin/orcamentos" icon={Receipt} label="Orçamentos" active={is('/admin/orcamentos')} />
            <NavItem to="/whatsapp" icon={MessageSquare} label="WhatsApp Bot" active={is('/whatsapp')} />
          </>
        )}
      </nav>

      <div className="p-3 border-t border-white/5 space-y-2">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5">
          <div className="w-9 h-9 rounded-full bg-brand-gradient flex items-center justify-center text-white font-bold text-sm uppercase">
            {(usuario.nome || 'U').charAt(0)}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{usuario.nome || 'Utilizador'}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wide">{admin ? 'Administrador' : 'Vendedor'}</p>
          </div>
        </div>
        <button onClick={() => navigate('/')} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors text-sm">
          <Globe size={18} /> Ver o Site
        </button>
        <button onClick={sair} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-red-400 transition-colors text-sm">
          <LogOut size={18} /> Sair do Sistema
        </button>
      </div>
    </aside>
  );
}
