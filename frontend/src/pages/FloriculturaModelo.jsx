import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Flower2, Star, ArrowRight, ChevronDown, PlayCircle,
  Gift, CalendarHeart, Sparkles, Leaf, Truck, MessageCircle,
} from 'lucide-react';
import { PublicFooter } from '../components/SiteChrome';

/* ============================================================================
   PÁGINA MODELO — FLORICULTURA (scroll-driven)
   ----------------------------------------------------------------------------
   Adaptação do brief "hero-reverie" (referencias-design/hero-reverie/BRIEF.md)
   ao universo de uma floricultura, com a marca Studio Mythos.

   O hero é um "plano-sequência" controlado pelo SCROLL: a câmera atravessa um
   portal floral e emerge num jardim sob céu suave. Dois painéis de conteúdo
   surgem com efeito scramble + fade. Fontes: Fraunces (display) + Inter (labels).
   ========================================================================== */

// paleta floral (tokens locais, não mexem no tema global)
const C = {
  green: '#14342A',
  greenSoft: '#1F4A3A',
  sage: '#6B8F71',
  blush: '#E7B4C2',
  blushSoft: '#F3D9E0',
  cream: '#FBF6F0',
  terra: '#C86B52',
  gold: '#C9A24B',
};

// Imagens de biblioteca online (Unsplash) — URLs otimizadas por parâmetro
const U = (id, w = 1400) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`;
const IMG = {
  act1: U('photo-1519378058457-4c29a0a2efac', 1600),   // roseiral escuro (surround do portal)
  portal: U('photo-1490750967868-88aa4486c946', 1200), // céu + flores douradas (revelação)
  garden: U('photo-1465146344425-f00d5f5c8f07', 1800), // campo de papoulas (jardim / Ato 2)
  shop: U('photo-1487070183336-b863922373d4', 1600),   // ateliê / loja de flores
  buques: U('photo-1526047932273-341f2a7631f9', 800),
  assinatura: U('photo-1520763185298-1b434c919102', 800),
  eventos: U('photo-1508610048659-a06b669e3321', 800),
};

// interpola linearmente e "clampa" um segmento [a,b] do progresso p em 0..1
const seg = (p, a, b) => Math.max(0, Math.min(1, (p - a) / (b - a)));
const lerp = (a, b, t) => a + (b - a) * t;

/* ---- Texto com efeito "scramble-in" (embaralha e assenta) ---------------- */
function ScrambleText({ text, active, className, style, as: Tag = 'span' }) {
  const [out, setOut] = useState('');
  const glyphs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*';
  useEffect(() => {
    if (!active) { setOut(''); return; }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setOut(text); return; }
    let frame = 0;
    const total = 20;
    const id = setInterval(() => {
      frame += 1;
      const revealed = Math.floor((frame / total) * text.length);
      setOut(
        text.split('').map((c, i) =>
          c === ' ' ? ' ' : i < revealed ? c : glyphs[Math.floor(Math.random() * glyphs.length)]
        ).join('')
      );
      if (frame >= total) { setOut(text); clearInterval(id); }
    }, 42);
    return () => clearInterval(id);
  }, [active, text]);
  return <Tag className={className} style={style}>{out || ' '}</Tag>;
}

/* ---- Navbar transparente sobreposta ao hero (estilo da referência) ------- */
function FloralNavbar() {
  const left = ['Buquês', 'Assinaturas', 'Eventos'];
  const right = ['Ateliê', 'Blog', 'Contato'];
  const item = 'text-[11px] tracking-[0.22em] uppercase text-white/80 hover:text-white transition-colors';
  return (
    <nav className="fixed top-0 inset-x-0 z-40 px-5 md:px-10 py-5 flex items-center justify-between">
      <div className="hidden md:flex items-center gap-7">
        {left.map((l) => <a key={l} href="#servicos" className={item}>{l}</a>)}
      </div>
      <div className="flex items-center gap-2 text-white">
        <Star size={16} fill="currentColor" />
        <span className="text-[12px] tracking-[0.3em] uppercase font-medium">Mythos Floricultura</span>
      </div>
      <div className="hidden md:flex items-center gap-7">
        {right.map((l) => <a key={l} href="#contato" className={item}>{l}</a>)}
      </div>
    </nav>
  );
}

/* ---- Card de vidro (glassmorphism) do painel 1 --------------------------- */
function GlassCard({ icon: Icon, label, sub }) {
  return (
    <div
      className="rounded-2xl px-4 py-3 flex items-center gap-3 border border-white/25 backdrop-blur-md"
      style={{ background: 'rgba(255,255,255,0.12)' }}
    >
      <div className="w-9 h-9 rounded-full flex items-center justify-center bg-white/20 text-white shrink-0">
        <Icon size={18} />
      </div>
      <div className="leading-tight">
        <p className="text-white text-sm font-medium">{label}</p>
        {sub && <p className="text-white/70 text-[11px]">{sub}</p>}
      </div>
    </div>
  );
}

/* ---- Card pastel flutuante do painel 2 ----------------------------------- */
function PetalCard({ n, title, desc, tint }) {
  return (
    <div
      className="rounded-2xl p-5 w-[200px] shadow-xl anim-float"
      style={{ background: tint, animationDelay: `${n * 0.6}s` }}
    >
      <div className="flex items-center justify-between mb-6">
        <span className="text-[10px] tracking-widest uppercase" style={{ color: C.green }}>0{n}</span>
        <Flower2 size={16} style={{ color: C.green, opacity: 0.5 }} />
      </div>
      <h4 className="font-display text-xl mb-1" style={{ color: C.green }}>{title}</h4>
      <p className="text-[12px] leading-snug" style={{ color: '#4b5b4f' }}>{desc}</p>
    </div>
  );
}

export default function FloriculturaModelo() {
  const wrapRef = useRef(null);
  const [p, setP] = useState(0); // progresso do scroll no hero, 0..1

  useEffect(() => { document.title = 'Mythos Floricultura · Página exemplo — Studio Mythos'; }, []);

  // progresso de scroll (rAF-throttled)
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const el = wrapRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const range = rect.height - window.innerHeight;
        const prog = range > 0 ? Math.min(1, Math.max(0, -rect.top / range)) : 0;
        setP(prog);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // ---- mapeamento do progresso para as fases da animação ----
  const portalOpen = seg(p, 0.0, 0.45);              // 0 = fechado, 1 = aberto
  const through = seg(p, 0.45, 0.60);                // atravessar o portal
  const portalScale = lerp(0.35, 1, portalOpen) + through * 7; // cresce e "engole" a tela
  const act1Opacity = 1 - seg(p, 0.48, 0.60);
  const act2Opacity = seg(p, 0.5, 0.64);

  const panel1Opacity = seg(p, 0.16, 0.28) * (1 - seg(p, 0.46, 0.56));
  const panel1Y = lerp(24, 0, seg(p, 0.16, 0.30));
  const panel2Opacity = seg(p, 0.64, 0.78);
  const panel2Y = lerp(28, 0, seg(p, 0.64, 0.82));
  const cueOpacity = 1 - seg(p, 0.02, 0.12);

  const panel1Active = p > 0.16 && p < 0.5;
  const panel2Active = p > 0.62;

  return (
    <div className="bg-[#0d0d0d] text-white font-sans">
      {/* fontes já carregadas no index.css: Fraunces (display) + Inter (sans) */}
      <style>{`
        @keyframes petalfall {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 0; }
          10% { opacity: .9; }
          100% { transform: translateY(110vh) rotate(320deg); opacity: 0; }
        }
        .petal { position:absolute; top:0; will-change: transform; }
        @media (prefers-reduced-motion: reduce){ .petal{ display:none; } }
      `}</style>

      <FloralNavbar />

      {/* indicador de "página modelo" */}
      <div className="fixed bottom-4 left-4 z-40 text-[10px] tracking-widest uppercase text-white/40">
        Página exemplo · Studio Mythos
      </div>

      {/* ===================== HERO SCROLL-DRIVEN ===================== */}
      <section ref={wrapRef} style={{ height: '420vh', position: 'relative' }}>
        <div className="sticky top-0 h-screen overflow-hidden">

          {/* ---- ATO 2 (fundo): jardim sob céu suave (foto real) ---- */}
          <div className="absolute inset-0" style={{ opacity: act2Opacity }}>
            <div className="absolute inset-0 bg-cover bg-center"
                 style={{ backgroundImage: `url("${IMG.garden}")` }} />
            {/* véu para legibilidade do texto escuro do painel 2 */}
            <div className="absolute inset-0" style={{
              background: `linear-gradient(180deg, rgba(251,246,240,0.72) 0%, rgba(243,217,224,0.35) 34%, rgba(20,52,42,0.15) 70%, rgba(20,52,42,0.45) 100%)`,
            }} />
            {/* sol/brilho */}
            <div className="absolute left-1/2 top-[20%] -translate-x-1/2 w-64 h-64 rounded-full blur-3xl anim-glow"
                 style={{ background: 'rgba(255,244,224,0.6)' }} />
          </div>

          {/* ---- ATO 1: portal floral ---- */}
          <div className="absolute inset-0 flex items-center justify-center" style={{ opacity: act1Opacity }}>
            {/* foto de roseiral escurecida como surround */}
            <div className="absolute inset-0 bg-cover bg-center"
                 style={{ backgroundImage: `url("${IMG.act1}")` }} />
            <div className="absolute inset-0" style={{ background: `radial-gradient(120% 90% at 50% 50%, rgba(12,20,15,0.55) 0%, rgba(6,10,7,0.94) 78%)` }} />

            {/* o portal: abertura que revela o jardim ensolarado */}
            <div
              className="relative rounded-[50%_50%_48%_52%] overflow-hidden bg-cover bg-center"
              style={{
                width: 'min(56vw, 60vh)', height: 'min(72vh, 64vw)',
                backgroundImage: `url("${IMG.portal}")`,
                transform: `scale(${portalScale})`,
                transformOrigin: '50% 46%',
                boxShadow: '0 0 120px 24px rgba(0,0,0,0.6)',
                border: '2px solid rgba(255,255,255,0.18)',
              }}
            >
              <div className="absolute inset-0" style={{
                background: `linear-gradient(180deg, rgba(247,233,222,0.15) 0%, rgba(231,180,194,0.12) 55%, rgba(107,143,113,0.18) 100%)`,
              }} />
            </div>

            {/* moldura botânica ao redor do portal (folhas/flores) */}
            <div className="pointer-events-none absolute inset-0"
                 style={{ transform: `scale(${lerp(1.05, 1, portalOpen)})` }}>
              {Array.from({ length: 22 }).map((_, i) => {
                const ang = (i / 22) * Math.PI * 2;
                const rx = 46, ry = 44;
                const x = 50 + Math.cos(ang) * rx;
                const y = 48 + Math.sin(ang) * ry;
                const Icon = i % 3 === 0 ? Flower2 : Leaf;
                return (
                  <Icon key={i} size={i % 4 === 0 ? 40 : 26}
                    className="absolute anim-float"
                    style={{
                      left: `${x}%`, top: `${y}%`,
                      transform: `translate(-50%,-50%) rotate(${(ang * 180) / Math.PI + 90}deg)`,
                      color: [C.sage, C.blush, C.gold, '#4A6B5C'][i % 4],
                      opacity: 0.9, animationDelay: `${(i % 5) * 0.4}s`,
                    }} />
                );
              })}
            </div>
          </div>

          {/* pétalas caindo (sempre por cima) */}
          {Array.from({ length: 14 }).map((_, i) => (
            <span key={i} className="petal"
              style={{
                left: `${(i * 7.3) % 100}%`,
                animation: `petalfall ${7 + (i % 5)}s linear ${(i % 7) * 0.9}s infinite`,
              }}>
              <Flower2 size={12 + (i % 4) * 6} style={{ color: [C.blush, C.gold, '#fff'][i % 3], opacity: 0.8 }} />
            </span>
          ))}

          {/* ---- PAINEL 1 (sobre o portal) ---- */}
          <div className="absolute inset-0 flex items-center"
               style={{ opacity: panel1Opacity, transform: `translateY(${panel1Y}px)`, pointerEvents: 'none' }}>
            <div className="w-full px-6 md:px-16 grid md:grid-cols-2 gap-8 items-center">
              <div className="max-w-lg">
                <ScrambleText as="h1" text="FLORESÇA" active={panel1Active}
                  className="font-display leading-[0.95] text-white"
                  style={{ fontSize: 'clamp(44px, 8vw, 96px)', fontWeight: 400 }} />
                <ScrambleText as="span" text="além do comum" active={panel1Active}
                  className="block font-display italic text-white/90"
                  style={{ fontSize: 'clamp(30px, 5.5vw, 64px)', fontWeight: 300 }} />
                <p className="mt-5 text-white/75 text-sm md:text-base leading-relaxed max-w-sm">
                  Arranjos autorais que traduzem sentimentos em flores. Cada peça é
                  composta à mão, onde a natureza encontra o cuidado de um ateliê.
                </p>
              </div>
              <div className="hidden md:flex flex-col gap-3 items-end">
                <GlassCard icon={PlayCircle} label="Ver o ateliê" sub="Bastidores em vídeo" />
                <GlassCard icon={Sparkles} label="+1.200 arranjos" sub="entregues com amor" />
                <GlassCard icon={Truck} label="Entrega no mesmo dia" sub="capital e região" />
              </div>
            </div>
          </div>

          {/* ---- PAINEL 2 (sobre o jardim) ---- */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
               style={{ opacity: panel2Opacity, transform: `translateY(${panel2Y}px)`, pointerEvents: 'none' }}>
            <ScrambleText as="h2" text="FLORES QUE CONTAM HISTÓRIAS" active={panel2Active}
              className="font-display" style={{ color: C.green, fontSize: 'clamp(30px, 6vw, 76px)', fontWeight: 400 }} />
            <p className="mt-4 max-w-md text-sm md:text-base" style={{ color: C.green, opacity: 0.8 }}>
              Do buquê do dia à ambientação de um casamento — criamos com estética,
              técnica e flores sempre frescas.
            </p>
            <div className="mt-10 flex flex-wrap gap-4 justify-center" style={{ pointerEvents: 'auto' }}>
              <PetalCard n={1} title="Buquês" desc="Composições autorais para presentear e emocionar." tint="#F7D9E0" />
              <PetalCard n={2} title="Assinaturas" desc="Flores frescas na sua casa toda semana." tint="#FBF0D5" />
              <PetalCard n={3} title="Eventos" desc="Cenografia floral para momentos inesquecíveis." tint="#DCEBDA" />
            </div>
          </div>

          {/* indicador de scroll */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/80"
               style={{ opacity: cueOpacity }}>
            <span className="text-[10px] tracking-[0.3em] uppercase">Role para explorar</span>
            <ChevronDown size={18} className="animate-bounce" />
          </div>
        </div>
      </section>

      {/* ===================== CONTEÚDO NORMAL ABAIXO ===================== */}
      <main style={{ background: C.cream }} className="text-[#2a3a30]">
        {/* Serviços */}
        <section id="servicos" className="container mx-auto px-6 md:px-12 py-24">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[11px] tracking-[0.25em] uppercase" style={{ color: C.terra }}>O que fazemos</span>
            <h2 className="font-display text-4xl md:text-5xl mt-3" style={{ color: C.green }}>Um ateliê floral completo</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Gift, img: IMG.buques, t: 'Buquês & presentes', d: 'Arranjos para datas, homenagens e "só porque sim". Cartão escrito à mão incluso.' },
              { icon: CalendarHeart, img: IMG.assinatura, t: 'Assinatura de flores', d: 'Receba flores frescas em casa ou no escritório, na frequência que preferir.' },
              { icon: Sparkles, img: IMG.eventos, t: 'Casamentos & eventos', d: 'Projeto de cenografia floral, do conceito à montagem no dia.' },
            ].map((s) => (
              <div key={s.t} className="rounded-3xl overflow-hidden bg-white shadow-sm border border-black/5">
                <div className="h-44 bg-cover bg-center" style={{ backgroundImage: `url("${s.img}")` }} />
                <div className="p-8">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 -mt-16 relative bg-white shadow-md"
                       style={{ color: C.green }}><s.icon size={22} /></div>
                  <h3 className="font-display text-2xl mb-2" style={{ color: C.green }}>{s.t}</h3>
                  <p className="text-sm leading-relaxed text-[#4b5b4f]">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Faixa citação — foto do ateliê ao fundo */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${IMG.shop}")` }} />
          <div className="absolute inset-0" style={{ background: 'rgba(15,34,26,0.82)' }} />
          <div className="relative container mx-auto px-6 text-center max-w-3xl">
            <Flower2 size={30} className="mx-auto mb-6" style={{ color: C.blush }} />
            <p className="font-display italic text-2xl md:text-3xl leading-snug text-[#F7E9DE]">
              “Flores são a linguagem que dispensa palavras — e nós escrevemos poemas com elas.”
            </p>
          </div>
        </section>

        {/* CTA / contato */}
        <section id="contato" className="container mx-auto px-6 md:px-12 py-24 text-center">
          <h2 className="font-display text-4xl md:text-5xl mb-4" style={{ color: C.green }}>Vamos criar algo lindo?</h2>
          <p className="max-w-lg mx-auto mb-8 text-[#4b5b4f]">
            Conte a ocasião e nós cuidamos do resto. Atendimento personalizado pelo WhatsApp.
          </p>
          <a href="#" onClick={(e) => e.preventDefault()}
             className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-white font-medium"
             style={{ background: C.terra }}>
            <MessageCircle size={18} /> Falar com o ateliê <ArrowRight size={16} />
          </a>
          <p className="mt-10 text-xs tracking-widest uppercase" style={{ color: C.sage }}>
            <Link to="/apps" className="hover:underline">← Voltar à Central de Aplicativos</Link>
          </p>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
