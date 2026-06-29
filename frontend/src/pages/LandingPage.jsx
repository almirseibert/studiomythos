import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Menu, X, ChevronRight, ArrowRight, Code, Compass, Rocket, TrendingUp,
  PenTool as Pen, Phone, Mail, MessageCircle, Smartphone,
} from 'lucide-react';
import Logo, { LogoMark } from '../components/Logo';
import { PublicFooter } from '../components/SiteChrome';
import { apps } from '../data/apps';
import { servicos } from '../data/servicos';
import { MARCA } from '../data/capacetes';
import { CONTATO, whatsappLink } from '../data/contato';

const metodologia = [
  { icon: Compass, n: '01', title: 'Descoberta', desc: 'Entendemos o negócio, os objetivos e o público antes de qualquer linha de código.' },
  { icon: Pen, n: '02', title: 'Design', desc: 'Prototipamos a experiência e a identidade visual com foco em conversão.' },
  { icon: Code, n: '03', title: 'Desenvolvimento', desc: 'Construímos com tecnologia de ponta, testando e validando a cada etapa.' },
  { icon: Rocket, n: '04', title: 'Lançamento', desc: 'Publicamos, integramos e deixamos tudo pronto para escalar.' },
  { icon: TrendingUp, n: '05', title: 'Crescimento', desc: 'Acompanhamos resultados e otimizamos continuamente.' },
];

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [form, setForm] = useState({ nome: '', email: '', mensagem: '' });

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const enviarOrcamento = (e) => {
    e.preventDefault();
    const msg = `Olá! Gostaria de solicitar um orçamento.\n\nNome: ${form.nome || '-'}\nE-mail: ${form.email || '-'}\n\n${form.mensagem || ''}`.trim();
    window.open(whatsappLink(msg), '_blank');
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 selection:bg-indigo-600 selection:text-white">
      {/* NAV */}
      <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-100' : 'bg-transparent'}`}>
        <div className="container mx-auto px-6 md:px-12 h-16 md:h-20 flex justify-between items-center">
          <button onClick={() => scrollTo('hero')} className="flex items-center"><Logo size={36} variant="dark" /></button>
          <nav className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollTo('servicos')} className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Serviços</button>
            <Link to="/apps" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Aplicativos</Link>
            <Link to="/capacetes" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Capacetes</Link>
            <button onClick={() => scrollTo('metodologia')} className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Como trabalhamos</button>
            <button onClick={() => scrollTo('contato')} className="flex items-center gap-1.5 bg-obsidian text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-slate-800 transition-colors">
              Falar com especialista <ChevronRight size={16} />
            </button>
          </nav>
          <button className="md:hidden text-slate-900" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>{mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}</button>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 shadow-lg flex flex-col p-6 gap-4">
            <button onClick={() => scrollTo('servicos')} className="text-left font-medium text-slate-700 text-lg">Serviços</button>
            <Link to="/apps" className="text-left font-medium text-slate-700 text-lg">Aplicativos</Link>
            <Link to="/capacetes" className="text-left font-medium text-slate-700 text-lg">Capacetes</Link>
            <button onClick={() => scrollTo('metodologia')} className="text-left font-medium text-slate-700 text-lg">Como trabalhamos</button>
            <button onClick={() => scrollTo('contato')} className="bg-obsidian text-white px-5 py-3 rounded-xl font-medium mt-2">Falar com especialista</button>
          </div>
        )}
      </header>

      {/* HERO */}
      <section id="hero" className="relative pt-36 pb-20 md:pt-48 md:pb-28 overflow-hidden">
        <div className="absolute top-10 right-0 w-[480px] h-[480px] bg-indigo-100 rounded-full blur-3xl opacity-60 -translate-y-1/4 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[380px] h-[380px] bg-violet-100 rounded-full blur-3xl opacity-50 -translate-x-1/4 pointer-events-none" />
        <div className="container mx-auto px-6 md:px-12 relative z-10 text-center max-w-4xl">
          <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-slate-100 text-slate-700 font-semibold text-xs uppercase tracking-wider mb-6">
            <LogoMark size={16} glow={false} /> Software House & Agência Digital
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-[1.05] mb-7">
            Produtos digitais que fazem seu negócio <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600">crescer</span>.
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Sites, e-commerce, aplicativos, CRM e marketing de performance. Da ideia ao lançamento, com tecnologia de ponta e foco em resultado.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button onClick={() => scrollTo('contato')} className="w-full sm:w-auto px-8 py-4 bg-obsidian text-white rounded-full font-bold text-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-900/10">
              Falar com especialista <ArrowRight size={20} />
            </button>
            <button onClick={() => scrollTo('servicos')} className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-200 text-slate-800 rounded-full font-bold text-lg hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
              Ver serviços
            </button>
          </div>
          <div className="mt-16 grid grid-cols-3 gap-6 max-w-2xl mx-auto">
            <Stat valor="Sob medida" label="Cada projeto é único" />
            <Stat valor="100%" label="Foco em resultado" />
            <Stat valor="Full-service" label="Da ideia ao lançamento" />
          </div>
        </div>
      </section>

      {/* SERVIÇOS */}
      <section id="servicos" className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-3xl mb-14">
            <span className="text-indigo-600 font-bold text-sm uppercase tracking-wider">O que fazemos</span>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mt-3 mb-4 leading-tight">Tudo o que sua marca precisa para vender no digital</h2>
            <p className="text-slate-600 text-lg">Um time full-service para tirar ideias do papel e escalar resultados. Clique em um serviço para ver detalhes, exemplos e pedir um orçamento.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {servicos.map((s) => (
              <Link
                key={s.slug}
                to={`/servicos/${s.slug}`}
                className="bg-white rounded-2xl p-7 border border-slate-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-indigo-200 group flex flex-col"
              >
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-5 bg-indigo-50 text-indigo-600 group-hover:bg-brand-gradient group-hover:text-white transition-colors">
                  <s.icon size={26} />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{s.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed flex-1">{s.resumo}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-indigo-600 font-semibold text-sm group-hover:gap-2.5 transition-all">
                  Saiba mais <ArrowRight size={16} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* METODOLOGIA */}
      <section id="metodologia" className="py-24 bg-white">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-3xl mb-14">
            <span className="text-indigo-600 font-bold text-sm uppercase tracking-wider">Como trabalhamos</span>
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mt-3 leading-tight">Um processo claro, do briefing ao crescimento</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {metodologia.map((m, i) => (
              <div key={i} className="bg-slate-50 rounded-2xl p-6 border border-slate-200 relative overflow-hidden">
                <span className="absolute top-3 right-4 text-4xl font-black text-slate-200">{m.n}</span>
                <div className="w-12 h-12 bg-brand-gradient text-white rounded-xl flex items-center justify-center mb-4 relative z-10 shadow-voltage"><m.icon size={22} /></div>
                <h3 className="font-bold text-slate-900 mb-1.5 relative z-10">{m.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed relative z-10">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTATO */}
      <section id="contato" className="py-24 bg-obsidian text-white">
        <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">Vamos construir o próximo projeto juntos?</h2>
            <p className="text-slate-400 text-lg mb-8">Conte sua ideia para a nossa equipe. Desenhamos a melhor solução para o seu negócio.</p>
            <div className="space-y-4">
              <a href={`mailto:${CONTATO.email}`} className="flex items-center gap-4 text-slate-300 hover:text-white transition-colors">
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-cyan-400"><Mail size={20} /></div>
                <div><p className="text-sm text-slate-500">E-mail</p><p className="font-medium">{CONTATO.email}</p></div>
              </a>
              <a href={whatsappLink('Olá! Gostaria de falar com a equipe do Studio Mythos.')} target="_blank" rel="noreferrer" className="flex items-center gap-4 text-slate-300 hover:text-white transition-colors">
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-cyan-400"><Phone size={20} /></div>
                <div><p className="text-sm text-slate-500">Telefone / WhatsApp</p><p className="font-medium">{CONTATO.whatsappDisplay}</p></div>
              </a>
            </div>
          </div>
          <div className="bg-white/5 rounded-3xl p-8 shadow-2xl border border-white/10">
            <h3 className="text-2xl font-bold mb-6">Solicite um orçamento</h3>
            <form className="space-y-4" onSubmit={enviarOrcamento}>
              <input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} type="text" placeholder="Nome completo" className="w-full bg-obsidian border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500" />
              <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" placeholder="E-mail corporativo" className="w-full bg-obsidian border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500" />
              <textarea value={form.mensagem} onChange={(e) => setForm({ ...form, mensagem: e.target.value })} rows={3} placeholder="Conte sobre o seu projeto" className="w-full bg-obsidian border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 resize-none" />
              <button type="submit" className="w-full bg-brand-gradient text-white font-bold py-4 rounded-xl shadow-voltage hover:opacity-95 transition-all flex items-center justify-center gap-2">
                <MessageCircle size={20} /> Enviar pelo WhatsApp
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* APLICATIVOS — compacto, no final da página */}
      <section id="aplicativos" className="py-16 bg-white border-t border-slate-100">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-indigo-600 font-bold text-xs uppercase tracking-wider">Nossos aplicativos</span>
              <h2 className="text-2xl font-bold text-slate-900 mt-2">Apps publicados pelo Studio Mythos</h2>
            </div>
            <Link to="/apps" className="shrink-0 inline-flex items-center gap-2 text-indigo-600 font-semibold text-sm hover:gap-3 transition-all">Ver todos <ArrowRight size={16} /></Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/capacetes" className="group rounded-xl border p-4 hover:shadow-md hover:-translate-y-0.5 transition-all text-white" style={{ background: `linear-gradient(135deg, ${MARCA.cores.primaria}, ${MARCA.cores.escura})`, borderColor: 'transparent' }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center font-extrabold text-base shadow mb-3 text-black" style={{ background: MARCA.cores.destaque }}>{MARCA.nome.charAt(0)}</div>
              <h3 className="font-bold text-sm leading-tight">{MARCA.nomeCompleto}</h3>
              <p className="text-[11px] text-white/70 mt-0.5">Capacetes personalizados</p>
              <p className="text-xs text-white/90 mt-2 leading-snug line-clamp-2">Monte o capacete dos seus sonhos e personalize ao vivo.</p>
            </Link>
            {apps.map((app) => (
              <Link key={app.slug} to={`/apps/${app.slug}`} className="group bg-slate-50 rounded-xl border border-slate-200 p-4 hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-extrabold text-base shadow mb-3" style={{ background: `linear-gradient(135deg, ${app.cor}, #7C3AED)` }}>{app.inicial}</div>
                <h3 className="font-bold text-slate-900 text-sm leading-tight">{app.nome}</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">{app.categoria}</p>
                <p className="text-xs text-slate-600 mt-2 leading-snug line-clamp-2">{app.tagline}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}

function Stat({ valor, label }) {
  return (
    <div className="text-center">
      <p className="text-2xl md:text-3xl font-extrabold text-slate-900">{valor}</p>
      <p className="text-xs md:text-sm text-slate-500 mt-1">{label}</p>
    </div>
  );
}
