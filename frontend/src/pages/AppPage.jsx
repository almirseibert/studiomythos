import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, FileText, LifeBuoy, Info, Check, Mail, Phone, ExternalLink, Smartphone } from 'lucide-react';
import { PublicHeader, PublicFooter } from '../components/SiteChrome';
import { getApp, politicaPadrao, termosPadrao, STUDIO } from '../data/apps';

const secoes = [
  { id: 'sobre', label: 'Sobre', icon: Info },
  { id: 'privacidade', label: 'Privacidade', icon: ShieldCheck },
  { id: 'termos', label: 'Termos', icon: FileText },
  { id: 'suporte', label: 'Suporte', icon: LifeBuoy },
];

export default function AppPage() {
  const { slug } = useParams();
  const app = getApp(slug);

  useEffect(() => {
    document.title = app ? `${app.nome} · Studio Mythos` : 'App não encontrado · Studio Mythos';
  }, [app]);

  if (!app) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
        <PublicHeader />
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24">
          <Smartphone size={48} className="text-slate-300 mb-4" />
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Aplicativo não encontrado</h1>
          <Link to="/apps" className="text-indigo-600 font-medium hover:underline">Ver todos os aplicativos</Link>
        </div>
        <PublicFooter />
      </div>
    );
  }

  const politica = app.politicaPrivacidade || politicaPadrao(app);
  const termos = app.termos || termosPadrao(app);
  const grad = `linear-gradient(135deg, ${app.cor}, #7C3AED)`;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <PublicHeader />

      {/* Hero do app */}
      <section className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-6 md:px-12 py-10">
          <Link to="/apps" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-6"><ArrowLeft size={16} /> Aplicativos</Link>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-white font-extrabold text-4xl shadow-xl shrink-0" style={{ background: grad }}>{app.inicial}</div>
            <div className="flex-1">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{app.categoria}</span>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">{app.nome}</h1>
              <p className="text-slate-600 mt-1">{app.tagline}</p>
            </div>
            <div className="flex flex-col gap-2 w-full sm:w-auto">
              <StoreBadge label="Google Play" url={app.playStoreUrl} />
              <StoreBadge label="App Store" url={app.appStoreUrl} />
            </div>
          </div>
        </div>
        {/* nav de seções */}
        <div className="container mx-auto px-6 md:px-12">
          <nav className="flex gap-1 overflow-x-auto">
            {secoes.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="flex items-center gap-1.5 px-4 py-3 text-sm font-medium text-slate-600 hover:text-indigo-700 border-b-2 border-transparent hover:border-indigo-300 whitespace-nowrap transition-colors">
                <s.icon size={15} /> {s.label}
              </a>
            ))}
          </nav>
        </div>
      </section>

      <div className="container mx-auto px-6 md:px-12 py-12 max-w-4xl space-y-12">
        {/* SOBRE */}
        <section id="sobre" className="scroll-mt-24">
          <SectionTitle icon={Info} title="Sobre o aplicativo" />
          <p className="text-slate-600 leading-relaxed mb-6">{app.descricao}</p>
          {app.funcionalidades?.length > 0 && (
            <div className="grid sm:grid-cols-2 gap-3">
              {app.funcionalidades.map((f, i) => (
                <div key={i} className="flex items-start gap-2.5 bg-white border border-slate-200 rounded-xl p-3.5">
                  <Check size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-700">{f}</span>
                </div>
              ))}
            </div>
          )}
          {app.plataformas?.length > 0 && (
            <p className="text-xs text-slate-400 mt-4 uppercase tracking-wide">Disponível para: {app.plataformas.join(' · ')}</p>
          )}
        </section>

        {/* PRIVACIDADE */}
        <section id="privacidade" className="scroll-mt-24">
          <SectionTitle icon={ShieldCheck} title="Política de Privacidade" />
          <LegalBox texto={politica} />
        </section>

        {/* TERMOS */}
        <section id="termos" className="scroll-mt-24">
          <SectionTitle icon={FileText} title="Termos de Uso" />
          <LegalBox texto={termos} />
        </section>

        {/* SUPORTE */}
        <section id="suporte" className="scroll-mt-24">
          <SectionTitle icon={LifeBuoy} title="Suporte" />
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <p className="text-slate-600 mb-4">Precisa de ajuda com o {app.nome}? Fale com a nossa equipe:</p>
            <div className="space-y-2">
              <a href={`mailto:${app.suporte?.email || STUDIO.suporteEmail}`} className="flex items-center gap-2.5 text-slate-700 hover:text-indigo-700">
                <Mail size={18} className="text-slate-400" /> {app.suporte?.email || STUDIO.suporteEmail}
              </a>
              {app.suporte?.telefone && (
                <span className="flex items-center gap-2.5 text-slate-700"><Phone size={18} className="text-slate-400" /> {app.suporte.telefone}</span>
              )}
            </div>
          </div>
        </section>
      </div>

      <PublicFooter />
    </div>
  );
}

function SectionTitle({ icon: Icon, title }) {
  return (
    <h2 className="flex items-center gap-2.5 text-2xl font-bold text-slate-900 mb-4">
      <span className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center"><Icon size={20} /></span>
      {title}
    </h2>
  );
}

function LegalBox({ texto }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6">
      <pre className="whitespace-pre-wrap font-sans text-sm text-slate-600 leading-relaxed">{texto}</pre>
    </div>
  );
}

function StoreBadge({ label, url }) {
  const ativo = Boolean(url);
  const inner = (
    <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold whitespace-nowrap ${ativo ? 'bg-obsidian text-white border-obsidian hover:bg-slate-800' : 'bg-slate-100 text-slate-400 border-slate-200 cursor-default'}`}>
      <Smartphone size={16} /> {label}
      {ativo ? <ExternalLink size={13} /> : <span className="text-[10px] uppercase tracking-wide">em breve</span>}
    </div>
  );
  return ativo ? <a href={url} target="_blank" rel="noreferrer">{inner}</a> : inner;
}
