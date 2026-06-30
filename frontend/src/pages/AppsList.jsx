import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Smartphone, ShieldCheck, FileText, LifeBuoy } from 'lucide-react';
import { PublicHeader, PublicFooter } from '../components/SiteChrome';
import { apps } from '../data/apps';
import { MARCA } from '../data/capacetes';

export default function AppsList() {
  useEffect(() => { document.title = 'Aplicativos · Studio Mythos'; }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <PublicHeader />

      <section className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-6 md:px-12 py-16 md:py-20 text-center max-w-3xl">
          <span className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-indigo-50 text-indigo-700 font-semibold text-xs uppercase tracking-wider mb-5">
            <Smartphone size={14} /> Central de Aplicativos
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-5 leading-tight">Aplicativos do <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Studio Mythos</span></h1>
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
          {apps.map((app) => (
            <Link key={app.slug} to={`/apps/${app.slug}`} className="group bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-extrabold text-2xl shadow-lg" style={{ background: `linear-gradient(135deg, ${app.cor}, #7C3AED)` }}>
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
              <span className="inline-flex items-center gap-1.5 text-indigo-600 font-semibold text-sm group-hover:gap-2.5 transition-all">
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
