import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles, ArrowRight, ShieldCheck, Palette, Truck, Wand2, MousePointerClick,
  PackageCheck, Star,
} from 'lucide-react';
import HelmetSVG from '../components/HelmetSVG';
import { BrandNav, BrandFooter, waLink } from '../components/CapaceteChrome';
import { MARCA, ESTILOS, CORES_BASE } from '../data/capacetes';
import useReveal from '../utils/useReveal';

const destaques = [
  { icon: ShieldCheck, titulo: 'Segurança certificada', desc: 'Cascos homologados, forro removível e fechamento de engate rápido.' },
  { icon: Palette, titulo: '100% personalizável', desc: 'Cor, viseira e grafismos do seu jeito — pré-visualize tudo ao vivo.' },
  { icon: Truck, titulo: 'Entrega para todo o Brasil', desc: 'Produção sob demanda e envio rastreado direto na sua porta.' },
];

const passos = [
  { icon: MousePointerClick, n: '01', titulo: 'Escolha a base', desc: 'Selecione o modelo e a cor do casco na paleta.' },
  { icon: Wand2, n: '02', titulo: 'Personalize', desc: 'Defina a viseira e adicione faixas, linhas ou chamas.' },
  { icon: PackageCheck, n: '03', titulo: 'Receba em casa', desc: 'Confirme o orçamento e nós produzimos o seu capacete.' },
];

export default function Capacetes() {
  useEffect(() => { document.title = `${MARCA.nomeCompleto} · Capacetes Personalizados`; }, []);
  useReveal();

  // Hero: capacete que troca de estilo automaticamente
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % ESTILOS.length), 2600);
    return () => clearInterval(t);
  }, []);
  const estilo = ESTILOS[i];

  return (
    <div className="min-h-screen bg-black font-sans text-white selection:bg-yellow-400 selection:text-black">
      <BrandNav />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 anim-gradient opacity-30 pointer-events-none"
          style={{ background: `radial-gradient(circle at 30% 30%, ${MARCA.cores.primaria}, transparent 55%), radial-gradient(circle at 75% 60%, ${MARCA.cores.destaque}, transparent 50%)` }}
        />
        <div className="absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full blur-3xl anim-glow pointer-events-none" style={{ background: MARCA.cores.primaria, opacity: 0.25 }} />
        <div className="container mx-auto px-6 md:px-10 relative z-10 pt-16 pb-20 md:pt-24 md:pb-28 grid lg:grid-cols-2 gap-10 items-center">
          <div className="anim-fade-in">
            <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/10 border border-white/15 text-xs font-semibold uppercase tracking-wider mb-6">
              <Sparkles size={14} style={{ color: MARCA.cores.destaque }} /> Capacetes sob medida
            </span>
            <h1 className="text-4xl md:text-6xl font-black leading-[1.04] mb-5">
              {MARCA.tagline.split(',')[0]},<br />
              <span className="text-transparent bg-clip-text anim-gradient" style={{ backgroundImage: `linear-gradient(90deg, ${MARCA.cores.primaria}, ${MARCA.cores.destaque}, ${MARCA.cores.primaria})` }}>
                {MARCA.tagline.split(',').slice(1).join(',').trim() || 'do seu jeito.'}
              </span>
            </h1>
            <p className="text-slate-300 text-lg max-w-xl mb-8 leading-relaxed">{MARCA.descricao}</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/capacetes/personalizar"
                className="px-8 py-4 rounded-full font-bold text-lg text-black flex items-center justify-center gap-2 shadow-2xl hover:scale-[1.03] transition-transform"
                style={{ background: `linear-gradient(135deg, ${MARCA.cores.destaque}, #fbbf24)` }}
              >
                <Sparkles size={20} /> Personalizar Agora
              </Link>
              <a href="#modelos" className="px-8 py-4 rounded-full font-bold text-lg border border-white/20 hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                Ver estilos
              </a>
            </div>
          </div>

          {/* preview animado */}
          <div className="relative">
            <div className="anim-float">
              <HelmetSVG
                corBase={estilo.corBase}
                viseira={estilo.viseira}
                grafismo={estilo.grafismo}
                corGrafismo={estilo.corGrafismo}
                className="w-full max-w-xl mx-auto drop-shadow-2xl transition-all duration-700"
              />
            </div>
            <div className="text-center mt-2">
              <span className="inline-flex items-center gap-2 text-sm text-slate-300 bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
                Estilo <strong className="text-white">{estilo.nome}</strong>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* DESTAQUES */}
      <section className="py-16 border-y border-white/10 bg-zinc-950">
        <div className="container mx-auto px-6 md:px-10 grid md:grid-cols-3 gap-6">
          {destaques.map((d, k) => (
            <div key={k} className="reveal bg-white/5 border border-white/10 rounded-2xl p-7" style={{ transitionDelay: `${k * 90}ms` }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: `${MARCA.cores.primaria}22`, color: MARCA.cores.destaque }}>
                <d.icon size={24} />
              </div>
              <h3 className="font-bold text-lg mb-1.5">{d.titulo}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{d.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* GALERIA DE ESTILOS */}
      <section id="modelos" className="py-20 bg-black">
        <div className="container mx-auto px-6 md:px-10">
          <div className="max-w-2xl mb-12 reveal">
            <span className="font-bold text-xs uppercase tracking-wider" style={{ color: MARCA.cores.destaque }}>Inspiração</span>
            <h2 className="text-3xl md:text-5xl font-black mt-3 mb-3">Estilos que já fizeram sucesso</h2>
            <p className="text-slate-400 text-lg">Comece de um destes ou crie o seu do zero. Tudo é editável no customizador.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ESTILOS.map((e, k) => (
              <Link
                key={e.nome}
                to="/capacetes/personalizar"
                className="reveal group bg-gradient-to-b from-white/5 to-transparent border border-white/10 rounded-3xl p-6 hover:border-white/30 transition-all hover:-translate-y-1"
                style={{ transitionDelay: `${(k % 3) * 80}ms` }}
              >
                <div className="bg-black/40 rounded-2xl mb-4 overflow-hidden">
                  <HelmetSVG corBase={e.corBase} viseira={e.viseira} grafismo={e.grafismo} corGrafismo={e.corGrafismo} className="w-full group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-lg">{e.nome}</h3>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold group-hover:gap-2 transition-all" style={{ color: MARCA.cores.destaque }}>
                    Usar <ArrowRight size={15} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* PALETA (teaser) */}
      <section className="py-16 bg-zinc-950 border-y border-white/10">
        <div className="container mx-auto px-6 md:px-10 text-center reveal">
          <h2 className="text-2xl md:text-3xl font-black mb-2">Mais de {CORES_BASE.length} cores na palma da mão</h2>
          <p className="text-slate-400 mb-7">Escolha a base perfeita — e combine com a viseira e o grafismo que quiser.</p>
          <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
            {CORES_BASE.map((c) => (
              <span key={c.id} title={c.nome} className="w-10 h-10 rounded-full border-2 border-white/20 shadow-lg" style={{ background: c.hex }} />
            ))}
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como" className="py-20 bg-black">
        <div className="container mx-auto px-6 md:px-10">
          <div className="max-w-2xl mb-12 reveal">
            <span className="font-bold text-xs uppercase tracking-wider" style={{ color: MARCA.cores.destaque }}>Simples assim</span>
            <h2 className="text-3xl md:text-5xl font-black mt-3">Do sonho à pista em 3 passos</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {passos.map((p, k) => (
              <div key={p.n} className="reveal relative bg-white/5 border border-white/10 rounded-2xl p-7 overflow-hidden" style={{ transitionDelay: `${k * 90}ms` }}>
                <span className="absolute top-3 right-5 text-5xl font-black text-white/5">{p.n}</span>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-black" style={{ background: MARCA.cores.destaque }}>
                  <p.icon size={22} />
                </div>
                <h3 className="font-bold text-lg mb-1.5">{p.titulo}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20" style={{ background: `linear-gradient(135deg, ${MARCA.cores.primaria}, ${MARCA.cores.escura})` }}>
        <div className="container mx-auto px-6 md:px-10 text-center reveal">
          <Star className="mx-auto mb-4" size={32} style={{ color: MARCA.cores.destaque }} />
          <h2 className="text-3xl md:text-5xl font-black mb-4 max-w-3xl mx-auto leading-tight">Pronto para criar o capacete dos seus sonhos?</h2>
          <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">Monte ao vivo, veja o preço na hora e solicite o seu orçamento sem compromisso.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/capacetes/personalizar" className="px-8 py-4 rounded-full font-bold text-lg bg-white text-black hover:scale-[1.03] transition-transform flex items-center justify-center gap-2">
              <Sparkles size={20} /> Personalizar Agora
            </Link>
            <a href={waLink('Olá! Quero um capacete personalizado.')} target="_blank" rel="noreferrer" className="px-8 py-4 rounded-full font-bold text-lg border border-white/40 hover:bg-white/10 transition-colors">
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </section>

      <BrandFooter />
    </div>
  );
}
