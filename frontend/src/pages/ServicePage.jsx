import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, MessageCircle, Sparkles } from 'lucide-react';
import { PublicHeader, PublicFooter } from '../components/SiteChrome';
import { getServico, servicos } from '../data/servicos';
import { whatsappLink } from '../data/contato';

export default function ServicePage() {
  const { slug } = useParams();
  const servico = getServico(slug);

  useEffect(() => {
    document.title = servico ? `${servico.title} · Studio Mythos` : 'Serviço não encontrado · Studio Mythos';
    window.scrollTo(0, 0);
  }, [servico]);

  if (!servico) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col">
        <PublicHeader />
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24">
          <Sparkles size={48} className="text-slate-300 mb-4" />
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Serviço não encontrado</h1>
          <Link to="/#servicos" className="text-indigo-600 font-medium hover:underline">Ver todos os serviços</Link>
        </div>
        <PublicFooter />
      </div>
    );
  }

  const Icon = servico.icon;
  const grad = `linear-gradient(135deg, ${servico.cor}, #7C3AED)`;
  const wpp = whatsappLink(`Olá! Tenho interesse no serviço de ${servico.title} e gostaria de solicitar um orçamento.`);

  // Outros serviços para a navegação no rodapé da página
  const outros = servicos.filter((s) => s.slug !== servico.slug).slice(0, 6);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      <PublicHeader />

      {/* HERO */}
      <section className="relative overflow-hidden bg-obsidian text-white">
        <div className="absolute top-0 right-0 w-[420px] h-[420px] rounded-full blur-3xl opacity-30 pointer-events-none" style={{ background: grad }} />
        <div className="container mx-auto px-6 md:px-12 py-14 md:py-20 relative z-10">
          <Link to="/#servicos" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white mb-8 transition-colors">
            <ArrowLeft size={16} /> Serviços
          </Link>
          <div className="max-w-3xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-voltage shrink-0" style={{ background: grad }}>
                <Icon size={30} />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">{servico.categoria}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-5">{servico.title}</h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed mb-8">{servico.intro}</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href={wpp} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 bg-brand-gradient text-white font-bold px-7 py-3.5 rounded-full shadow-voltage hover:opacity-95 transition-all">
                <MessageCircle size={20} /> Solicite um orçamento
              </a>
              <Link to="/#contato" className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/15 text-white font-semibold px-7 py-3.5 rounded-full hover:bg-white/15 transition-all">
                Falar pelo formulário <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SOBRE O SERVIÇO */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-6 md:px-12 max-w-3xl">
          <span className="text-indigo-600 font-bold text-sm uppercase tracking-wider">O que é</span>
          <h2 className="text-2xl md:text-4xl font-bold text-slate-900 mt-3 mb-6 leading-tight">Sobre o serviço</h2>
          <div className="space-y-5">
            {servico.paragrafos.map((p, i) => (
              <p key={i} className="text-slate-600 text-lg leading-relaxed">{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* GALERIA / SHOWCASE */}
      <section className="py-16 md:py-20 bg-slate-50 border-y border-slate-100">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-3xl mb-12">
            <span className="text-indigo-600 font-bold text-sm uppercase tracking-wider">Na prática</span>
            <h2 className="text-2xl md:text-4xl font-bold text-slate-900 mt-3 leading-tight">Como esse serviço se traduz no seu negócio</h2>
          </div>
          <Galeria servico={servico} grad={grad} />
        </div>
      </section>

      {/* BENEFÍCIOS + ENTREGÁVEIS */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          <div>
            <span className="text-indigo-600 font-bold text-sm uppercase tracking-wider">Por que contratar</span>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mt-3 mb-6">Benefícios para você</h2>
            <ul className="space-y-3">
              {servico.beneficios.map((b, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5"><Check size={15} /></span>
                  <span className="text-slate-700">{b}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <span className="text-indigo-600 font-bold text-sm uppercase tracking-wider">O que está incluso</span>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mt-3 mb-6">O que entregamos</h2>
            <div className="space-y-3">
              {servico.entregaveis.map((e, i) => (
                <div key={i} className="flex items-start gap-3 bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <span className="text-xs font-bold text-white w-6 h-6 rounded-lg flex items-center justify-center shrink-0" style={{ background: grad }}>{i + 1}</span>
                  <span className="text-slate-700 text-sm">{e}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA ORÇAMENTO */}
      <section className="py-16 md:py-20 bg-obsidian text-white">
        <div className="container mx-auto px-6 md:px-12 max-w-4xl text-center">
          <h2 className="text-2xl md:text-4xl font-bold mb-4 leading-tight">Pronto para começar o seu projeto de {servico.title}?</h2>
          <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">Conte sua ideia e receba um orçamento sem compromisso. Respondemos rápido.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href={wpp} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 bg-brand-gradient text-white font-bold px-8 py-4 rounded-full shadow-voltage hover:opacity-95 transition-all">
              <MessageCircle size={20} /> Solicite um orçamento no WhatsApp
            </a>
            <Link to="/#contato" className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/15 text-white font-semibold px-8 py-4 rounded-full hover:bg-white/15 transition-all">
              Preencher formulário <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* OUTROS SERVIÇOS */}
      <section className="py-16 bg-slate-50 border-t border-slate-100">
        <div className="container mx-auto px-6 md:px-12">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Outros serviços</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {outros.map((s) => {
              const SIcon = s.icon;
              return (
                <Link key={s.slug} to={`/servicos/${s.slug}`} className="group bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md hover:-translate-y-0.5 transition-all text-center">
                  <span className="w-10 h-10 mx-auto rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2 group-hover:bg-brand-gradient group-hover:text-white transition-colors"><SIcon size={20} /></span>
                  <span className="text-xs font-semibold text-slate-700 leading-tight block">{s.title}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}

// Galeria visual: usa fotos reais (servico.imagens) se existirem; caso contrário,
// renderiza painéis ilustrativos no estilo da marca.
function Galeria({ servico, grad }) {
  if (servico.imagens?.length) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {servico.imagens.map((src, i) => (
          <img key={i} src={src} alt={`${servico.title} ${i + 1}`} className="rounded-2xl border border-slate-200 object-cover w-full aspect-[4/3]" />
        ))}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {servico.galeria.map((g, i) => {
        const GIcon = g.icon;
        return (
          <div key={i} className="relative overflow-hidden rounded-2xl border border-slate-200 aspect-[4/3] flex flex-col justify-end p-6 text-white shadow-lg" style={{ background: grad }}>
            <div className="absolute inset-0 opacity-10 flex items-center justify-center">
              <GIcon size={140} strokeWidth={1} />
            </div>
            <div className="absolute top-5 left-5 w-12 h-12 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
              <GIcon size={24} />
            </div>
            <div className="relative z-10">
              <p className="font-bold text-lg leading-tight">{g.titulo}</p>
              <p className="text-white/80 text-sm mt-1">{g.legenda}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
