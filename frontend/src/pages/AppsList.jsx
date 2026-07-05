import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Smartphone, ShieldCheck, FileText, LifeBuoy, Car, Sparkles, Gauge, MonitorPlay, Flower2, Heart, Video, MousePointer2, Wind, Globe } from 'lucide-react';
import { PublicHeader, PublicFooter } from '../components/SiteChrome';
import { apps } from '../data/apps';
import { MARCA } from '../data/capacetes';
import api from '../services/api';
import { urlDoProjeto } from '../services/sites';

export default function AppsList() {
  const [projetos, setProjetos] = useState([]);
  useEffect(() => { document.title = 'Aplicativos · Studio Mythos'; }, []);
  useEffect(() => {
    api.get('/projetos').then((r) => setProjetos(r.data?.data || [])).catch(() => setProjetos([]));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <PublicHeader />

      <section className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-6 md:px-12 py-16 md:py-20 text-center max-w-3xl">
          <span className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-oxblood/10 text-oxblood font-semibold text-xs uppercase tracking-wider mb-5">
            <Smartphone size={14} /> Central de Aplicativos
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-5 leading-tight">Aplicativos do <span className="text-transparent bg-clip-text bg-gradient-to-r from-oxblood to-blueprint">Studio Mythos</span></h1>
          <p className="text-lg text-slate-600 leading-relaxed">Centralizamos aqui tudo o que cada aplicativo precisa — descrição, política de privacidade, termos de uso e suporte — em um só lugar, prontos para publicação na Google Play e App Store.</p>
        </div>
      </section>

      <section className="container mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Destaque: marca de capacetes personalizados (sub-página) */}
          <Link to="/capacetes" className="group rounded-2xl p-6 text-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 md:col-span-2 lg:col-span-1" style={{ background: `linear-gradient(135deg, ${MARCA.cores.primaria}, ${MARCA.cores.escura})` }}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-extrabold text-2xl shadow-lg text-black" style={{ background: MARCA.cores.destaque }}>{MARCA.nome.charAt(0)}</div>
              <div>
                <h3 className="text-lg font-bold leading-tight">{MARCA.nomeCompleto}</h3>
                <p className="text-xs text-white/70">Capacetes personalizados</p>
              </div>
            </div>
            <p className="text-sm text-white/90 leading-relaxed mb-4 min-h-[40px]">{MARCA.tagline} Monte ao vivo, escolha cores, viseira e grafismos.</p>
            <span className="inline-flex items-center gap-1.5 font-semibold text-sm group-hover:gap-2.5 transition-all" style={{ color: MARCA.cores.destaque }}>
              Personalizar agora <ArrowRight size={16} />
            </span>
          </Link>
          {/* Destaque: página de demonstração — Mythos Veículos (site estático) */}
          <a href="/demos/veiculos/index.html" target="_blank" rel="noopener noreferrer" className="group relative overflow-hidden rounded-2xl p-6 text-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 md:col-span-2 lg:col-span-1" style={{ background: 'linear-gradient(135deg, #1A1A1D, #050505)' }}>
            <span className="pointer-events-none absolute -right-8 -top-8 w-32 h-32 rounded-full blur-2xl opacity-40" style={{ background: '#FF1E3C' }} />
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-extrabold text-2xl shadow-lg" style={{ background: 'linear-gradient(135deg, #FF1E3C, #7A1F2B)' }}>
                <Car size={26} />
              </div>
              <div>
                <h3 className="text-lg font-bold leading-tight">Mythos Veículos</h3>
                <p className="text-xs text-white/60">Página de demonstração · Landing page</p>
              </div>
            </div>
            <p className="text-sm text-white/85 leading-relaxed mb-4 min-h-[40px]">Landing page imersiva para lançamento de veículo esportivo: hero em vídeo com scrub ao rolar, seções cinematográficas, métricas de performance e visual dark com acento neon. Um exemplo real do que entregamos em sites de alto impacto.</p>
            <div className="flex flex-wrap gap-1.5 mb-5">
              <DarkBadge icon={MonitorPlay} label="Vídeo imersivo" />
              <DarkBadge icon={Sparkles} label="Animações" />
              <DarkBadge icon={Gauge} label="Alta performance" />
            </div>
            <span className="inline-flex items-center gap-1.5 font-semibold text-sm group-hover:gap-2.5 transition-all" style={{ color: '#FF1E3C' }}>
              Abrir demonstração <ArrowRight size={16} />
            </span>
          </a>
          {/* Destaque: página de demonstração — Yoga Patricia Pedotte (site estático) */}
          <a href="/yoga-patricia-pedotte/index.html" target="_blank" rel="noopener noreferrer" className="group relative overflow-hidden rounded-2xl p-6 text-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 md:col-span-2 lg:col-span-1" style={{ background: 'linear-gradient(135deg, #2E2A22, #14120E)' }}>
            <span className="pointer-events-none absolute -right-8 -top-8 w-32 h-32 rounded-full blur-2xl opacity-40" style={{ background: '#D98A3D' }} />
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-extrabold text-2xl shadow-lg" style={{ background: 'linear-gradient(135deg, #D98A3D, #7A5220)' }}>
                <Flower2 size={26} />
              </div>
              <div>
                <h3 className="text-lg font-bold leading-tight">Yoga Patricia Pedotte</h3>
                <p className="text-xs text-white/60">Página de demonstração · Landing page</p>
              </div>
            </div>
            <p className="text-sm text-white/85 leading-relaxed mb-4 min-h-[40px]">Landing page de captação de alunos para as aulas de yoga da Patricia Pedotte: vídeos em destaque, depoimentos e chamadas diretas para agendamento via WhatsApp, com foco em conversão.</p>
            <div className="flex flex-wrap gap-1.5 mb-5">
              <DarkBadge icon={Video} label="Vídeos em destaque" />
              <DarkBadge icon={Heart} label="Depoimentos" />
              <DarkBadge icon={MonitorPlay} label="CTA via WhatsApp" />
            </div>
            <span className="inline-flex items-center gap-1.5 font-semibold text-sm group-hover:gap-2.5 transition-all" style={{ color: '#D98A3D' }}>
              Abrir demonstração <ArrowRight size={16} />
            </span>
          </a>
          {/* Destaque: página modelo de demonstração — Floricultura (scroll-driven) */}
          <Link to="/modelos/floricultura" className="group relative overflow-hidden rounded-2xl p-6 text-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 md:col-span-2 lg:col-span-1" style={{ background: 'linear-gradient(135deg, #1F4A3A, #14342A)' }}>
            <span className="pointer-events-none absolute -right-8 -top-8 w-32 h-32 rounded-full blur-2xl opacity-40" style={{ background: '#E7B4C2' }} />
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg, #E7B4C2, #C9A24B)' }}>
                <Flower2 size={26} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold leading-tight">Mythos Floricultura</h3>
                <p className="text-xs text-white/60">Página exemplo · Scroll-driven</p>
              </div>
            </div>
            <p className="text-sm text-white/85 leading-relaxed mb-4 min-h-[40px]">Página exemplo de floricultura: landing imersiva controlada pelo scroll, onde a câmera atravessa um portal floral e emerge num jardim, com textos em efeito scramble, fotos reais e cards de vidro. Um modelo do que criamos para marcas que querem encantar.</p>
            <div className="flex flex-wrap gap-1.5 mb-5">
              <DarkBadge icon={MousePointer2} label="Scroll-driven" />
              <DarkBadge icon={Wind} label="Animações" />
              <DarkBadge icon={Sparkles} label="Estética editorial" />
            </div>
            <span className="inline-flex items-center gap-1.5 font-semibold text-sm group-hover:gap-2.5 transition-all" style={{ color: '#E7B4C2' }}>
              Abrir página modelo <ArrowRight size={16} />
            </span>
          </Link>
          {/* Projetos publicados pelo painel (dinâmicos, sem mexer no código) */}
          {projetos.map((p) => (
            <a key={p.id} href={urlDoProjeto(p)} target="_blank" rel="noopener noreferrer"
               className="group relative overflow-hidden rounded-2xl p-6 text-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
               style={{ background: `linear-gradient(135deg, ${p.cor || '#0D9488'}, ${p.cor_secundaria || '#0F4848'})` }}>
              <span className="pointer-events-none absolute -right-8 -top-8 w-32 h-32 rounded-full blur-2xl opacity-30 bg-white" />
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg bg-white/15">
                  <Globe size={26} className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold leading-tight">{p.titulo}</h3>
                  {p.subtitulo && <p className="text-xs text-white/70">{p.subtitulo}</p>}
                </div>
              </div>
              {p.descricao && <p className="text-sm text-white/85 leading-relaxed mb-4 min-h-[40px]">{p.descricao}</p>}
              <span className="inline-flex items-center gap-1.5 font-semibold text-sm group-hover:gap-2.5 transition-all text-white">
                Abrir <ArrowRight size={16} />
              </span>
            </a>
          ))}
          {apps.map((app) => (
            <Link key={app.slug} to={`/apps/${app.slug}`} className="group bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-extrabold text-2xl shadow-lg" style={{ background: `linear-gradient(135deg, ${app.cor}, #0F4848)` }}>
                  {app.inicial}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 leading-tight">{app.nome}</h3>
                  <p className="text-xs text-slate-500">{app.categoria}</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mb-4 min-h-[40px]">{app.tagline}</p>
              <div className="flex flex-wrap gap-1.5 mb-5">
                <Badge icon={ShieldCheck} label="Privacidade" />
                <Badge icon={FileText} label="Termos" />
                <Badge icon={LifeBuoy} label="Suporte" />
              </div>
              <span className="inline-flex items-center gap-1.5 text-oxblood font-semibold text-sm group-hover:gap-2.5 transition-all">
                Ver detalhes <ArrowRight size={16} />
              </span>
            </Link>
          ))}
        </div>

        {apps.length === 0 && (
          <p className="text-center text-slate-500 py-12">Nenhum aplicativo publicado ainda.</p>
        )}
      </section>

      <PublicFooter />
    </div>
  );
}

function Badge({ icon: Icon, label }) {
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
      <Icon size={12} /> {label}
    </span>
  );
}

function DarkBadge({ icon: Icon, label }) {
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-white/70 bg-white/10 px-2 py-1 rounded-md">
      <Icon size={12} /> {label}
    </span>
  );
}
