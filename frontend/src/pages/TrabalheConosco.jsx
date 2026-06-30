import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  X, ArrowRight, Rocket, Heart, GraduationCap, Users, Coffee, TrendingUp,
  Sparkles, FileText,
} from 'lucide-react';
import { BrandNav, BrandFooter } from '../components/CapaceteChrome';
import { MARCA } from '../data/capacetes';
import useReveal from '../utils/useReveal';

const beneficios = [
  { icon: TrendingUp, titulo: 'Crescimento real', desc: 'Plano de carreira, mentoria e desafios de verdade no mundo das duas rodas.' },
  { icon: Coffee, titulo: 'Flexibilidade', desc: 'Ambiente que respeita a sua rotina e o seu ritmo.' },
  { icon: GraduationCap, titulo: 'Aprendizado contínuo', desc: 'Incentivo a cursos, certificações e troca constante de conhecimento.' },
  { icon: Heart, titulo: 'Paixão por moto', desc: 'Time apaixonado por capacetes, customização e cultura motociclista.' },
];

const areas = [
  'Produção & Pintura de capacetes',
  'Design & Artes / Grafismos',
  'Atendimento & Vendas',
  'Marketing & Conteúdo',
  'Logística & Expedição',
  'Administrativo & Financeiro',
];

export default function TrabalheConosco() {
  const [popup, setPopup] = useState(false);
  useEffect(() => { document.title = `Trabalhe Conosco · ${MARCA.nomeCompleto}`; }, []);
  useReveal();

  useEffect(() => {
    const t = setTimeout(() => setPopup(true), 900);
    return () => clearTimeout(t);
  }, []);

  const grad = `linear-gradient(135deg, ${MARCA.cores.primaria}, ${MARCA.cores.destaque})`;

  return (
    <div className="min-h-screen bg-black font-sans text-white selection:bg-yellow-400 selection:text-black">
      <BrandNav />

      {/* POPUP de boas-vindas -> leva ao cadastro */}
      {popup && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm anim-fade-in" onClick={() => setPopup(false)}>
          <div className="relative bg-zinc-900 border border-white/10 rounded-3xl max-w-md w-full p-8 shadow-2xl anim-pop-in" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setPopup(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><X size={22} /></button>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-black mb-5" style={{ background: grad }}><Sparkles size={26} /></div>
            <h3 className="text-2xl font-black mb-2">Bora fazer parte do time?</h3>
            <p className="text-slate-300 mb-6">A {MARCA.nomeCompleto} está sempre de olho em gente boa. Cadastre seu currículo em poucos minutos — leva menos tempo do que dar partida na moto. 🏍️</p>
            <Link to="/trabalhe-conosco/cadastro" className="w-full text-black font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:opacity-95 transition" style={{ background: grad }}>
              <FileText size={18} /> Cadastrar meu currículo
            </Link>
            <button onClick={() => setPopup(false)} className="w-full text-center text-sm text-slate-400 mt-3 hover:text-white">Agora não</button>
          </div>
        </div>
      )}

      {/* HERO */}
      <section className="relative pt-16 pb-24 overflow-hidden">
        <div className="absolute top-0 right-0 w-[480px] h-[480px] rounded-full blur-3xl anim-glow pointer-events-none" style={{ background: MARCA.cores.primaria, opacity: 0.25 }} />
        <div className="container mx-auto px-6 md:px-12 relative z-10 text-center max-w-3xl">
          <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/10 border border-white/15 text-xs font-semibold uppercase tracking-wider mb-6">
            <Rocket size={14} style={{ color: MARCA.cores.destaque }} /> Carreiras · {MARCA.nomeCompleto}
          </span>
          <h1 className="text-4xl md:text-6xl font-black leading-[1.05] mb-6">
            Acelere sua carreira <span className="text-transparent bg-clip-text" style={{ backgroundImage: grad }}>com a gente</span>
          </h1>
          <p className="text-slate-300 text-lg mb-9 max-w-2xl mx-auto">Na {MARCA.nomeCompleto} a gente cria capacetes que são a cara de cada motociclista. Se você curte moto e quer evoluir rápido, seu lugar é aqui.</p>
          <Link to="/trabalhe-conosco/cadastro" className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-lg text-black hover:opacity-95 transition" style={{ background: grad }}>
            <FileText size={20} /> Cadastrar currículo <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <section className="py-20 bg-zinc-950 border-y border-white/10">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-2xl mb-12 reveal">
            <span className="font-bold text-xs uppercase tracking-wider" style={{ color: MARCA.cores.destaque }}>Por que aqui</span>
            <h2 className="text-3xl md:text-4xl font-black mt-3">Um lugar feito para você crescer</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {beneficios.map((b, k) => (
              <div key={k} className="reveal bg-white/5 border border-white/10 rounded-2xl p-6" style={{ transitionDelay: `${k * 80}ms` }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: `${MARCA.cores.primaria}22`, color: MARCA.cores.destaque }}><b.icon size={24} /></div>
                <h3 className="font-bold mb-1.5">{b.titulo}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ÁREAS */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-6 md:px-12 grid lg:grid-cols-2 gap-10 items-center">
          <div className="reveal">
            <span className="font-bold text-xs uppercase tracking-wider" style={{ color: MARCA.cores.destaque }}>Áreas</span>
            <h2 className="text-3xl md:text-4xl font-black mt-3 mb-4">Talentos de todas as áreas</h2>
            <p className="text-slate-400 mb-6">Mesmo sem uma vaga aberta agora, cadastre seu currículo: montamos nosso banco de talentos e chamamos quando surgir a oportunidade certa.</p>
            <Link to="/trabalhe-conosco/cadastro" className="inline-flex items-center gap-2 font-bold hover:gap-3 transition-all" style={{ color: MARCA.cores.destaque }}>Quero me cadastrar <ArrowRight size={18} /></Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {areas.map((a, k) => (
              <div key={k} className="reveal flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3.5" style={{ transitionDelay: `${k * 60}ms` }}>
                <Users size={18} className="shrink-0" style={{ color: MARCA.cores.destaque }} />
                <span className="text-sm font-medium text-slate-200">{a}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20" style={{ background: `linear-gradient(135deg, ${MARCA.cores.primaria}, ${MARCA.cores.escura})` }}>
        <div className="container mx-auto px-6 md:px-12 text-center reveal">
          <h2 className="text-3xl md:text-5xl font-black mb-4">Seu próximo capítulo começa aqui</h2>
          <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">Leva poucos minutos. Capriche no currículo — a gente lê todos. 😉</p>
          <Link to="/trabalhe-conosco/cadastro" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:scale-[1.03] transition-transform">
            <FileText size={20} /> Cadastrar meu currículo
          </Link>
        </div>
      </section>

      <BrandFooter />
    </div>
  );
}
