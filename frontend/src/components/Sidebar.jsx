import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, DollarSign, FileText,
  Briefcase, Globe, LogOut, ShieldCheck, Radar, Inbox, Receipt, MessageSquare, LayoutTemplate,
  ChevronDown, Compass, BarChart3, Settings, Gavel, ExternalLink
} from 'lucide-react';
import { LogoMark } from './Logo';
import { getUser, isAdmin, logout } from '../services/auth';

// O Painel de Licitações é outro sistema, noutro domínio e noutro banco — só o
// login é compartilhado: mesmos usuários, mesmo segredo de token. Por isso é um
// link de verdade, e não uma rota do React Router.
//
// O token NÃO viaja na URL de propósito. Levar a sessão daqui para lá exigiria
// pôr o JWT na query string, e query string entra em log de servidor, em
// histórico de navegador e no cabeçalho Referer. Quem clica faz login no outro
// painel com o mesmo e-mail e a mesma senha daqui.
const URL_LICITACOES =
  import.meta.env.VITE_LICITACOES_URL || 'https://licitacoes.studiomythos.com.br';

const NavItem = ({ to, icon: Icon, label, active, accent }) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm font-medium ${
      active
        ? accent
          ? 'bg-red-600/90 text-white shadow-lg'
          : 'bg-brand-gradient text-white shadow-voltage'
        : 'text-slate-400 hover:bg-white/5 hover:text-white'
    }`}
  >
    <Icon size={18} /> {label}
  </Link>
);

// Item que sai do painel. A seta indica isso antes do clique, e `noopener` é
// obrigatório com `target="_blank"`: sem ele a página aberta ganha acesso a
// `window.opener` e pode trocar o endereço desta aba por uma cópia da tela de
// login.
const NavItemExterno = ({ href, icon: Icon, label, descricao }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    title={descricao}
    className="flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-white"
  >
    <Icon size={18} />
    <span className="flex-1">{label}</span>
    <ExternalLink size={13} className="opacity-50" />
  </a>
);

// Grupo colapsável — reduz a extensão da sidebar agrupando os itens em menus/submenus.
const Grupo = ({ icon: Icon, titulo, aberto, onToggle, children }) => (
  <div>
    <button
      onClick={onToggle}
      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
    >
      <Icon size={17} />
      <span className="text-[11px] font-bold tracking-widest uppercase flex-1 text-left">{titulo}</span>
      <ChevronDown size={15} className={`transition-transform duration-200 ${aberto ? 'rotate-180' : ''}`} />
    </button>
    {aberto && <div className="mt-1 ml-3 pl-2 border-l border-white/10 space-y-1">{children}</div>}
  </div>
);

export default function Sidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const usuario = getUser();
  const admin = isAdmin();
  const is = (p) => pathname === p || pathname.startsWith(p + '/');

  // Cada grupo abre por padrão se contém a rota ativa (mantém contexto ao navegar).
  const emOperacao = ['/dashboard', '/prospeccao', '/crm', '/clientes'].some(is);
  const emGestao = ['/financeiro', '/relatorios', '/usuarios'].some(is);
  const emAdmin = ['/admin', '/whatsapp'].some(is);

  const [abertos, setAbertos] = useState({
    operacao: emOperacao || (!emGestao && !emAdmin),
    gestao: emGestao,
    admin: emAdmin,
  });
  const toggle = (k) => setAbertos((s) => ({ ...s, [k]: !s[k] }));

  const sair = () => { logout(); navigate('/login'); };

  return (
    <aside className="w-64 bg-obsidian text-slate-300 flex flex-col hidden md:flex shadow-2xl z-20 shrink-0 border-r border-white/5">
      <div className="px-5 py-6 flex items-center gap-3 border-b border-white/5">
        <LogoMark size={38} />
        <div className="leading-none">
          <span className="text-lg font-extrabold text-white tracking-tight">Studio<span className="text-emerald-400"> Mythos</span></span>
          <p className="text-[9px] font-semibold tracking-[0.25em] text-slate-500 mt-1">PAINEL INTERNO</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto custom-scrollbar">
        <Grupo icon={Compass} titulo="Operação" aberto={abertos.operacao} onToggle={() => toggle('operacao')}>
          <NavItem to="/dashboard" icon={LayoutDashboard} label="Início" active={is('/dashboard')} />
          <NavItem to="/prospeccao" icon={Radar} label="Prospecção no Mapa" active={is('/prospeccao')} />
          <NavItem to="/crm" icon={Briefcase} label="Funil de Vendas" active={is('/crm')} />
          <NavItem to="/clientes" icon={Users} label="Leads & Clientes" active={is('/clientes')} />
          <NavItemExterno
            href={URL_LICITACOES}
            icon={Gavel}
            label="Licitações"
            descricao="Abre o Painel de Licitações em outra aba. O login é o mesmo deste painel."
          />
        </Grupo>

        <Grupo icon={BarChart3} titulo="Gestão" aberto={abertos.gestao} onToggle={() => toggle('gestao')}>
          <NavItem to="/financeiro" icon={DollarSign} label="Financeiro" active={is('/financeiro')} />
          <NavItem to="/relatorios" icon={FileText} label="Relatórios" active={is('/relatorios')} />
          {admin && <NavItem to="/usuarios" icon={ShieldCheck} label="Acessos" active={is('/usuarios')} accent />}
        </Grupo>

        {admin && (
          <Grupo icon={Settings} titulo="Administração" aberto={abertos.admin} onToggle={() => toggle('admin')}>
            <NavItem to="/admin" icon={Inbox} label="Administração" active={pathname === '/admin'} />
            <NavItem to="/admin/curriculos" icon={FileText} label="Currículos" active={is('/admin/curriculos')} />
            <NavItem to="/admin/orcamentos" icon={Receipt} label="Orçamentos" active={is('/admin/orcamentos')} />
            <NavItem to="/admin/projetos" icon={LayoutTemplate} label="Projetos & Sites" active={is('/admin/projetos')} />
            <NavItem to="/whatsapp" icon={MessageSquare} label="WhatsApp Bot" active={is('/whatsapp')} />
          </Grupo>
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
