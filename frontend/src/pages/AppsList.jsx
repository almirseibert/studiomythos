import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import Logo from '../components/Logo';
import { PublicFooter } from '../components/SiteChrome';
import { apps } from '../data/apps';
import { MARCA } from '../data/capacetes';
import api from '../services/api';
import { urlDoProjeto } from '../services/sites';
import useReveal from '../utils/useReveal';

function EditorialCard({ eyebrow, title, subtitle, description, external, internal, href }) {
  const inner = (
    <>
      <div className="flex items-start justify-between mb-12">
        <span className="font-mono text-[11px] uppercase tracking-widest text-mute group-hover:text-paper/50">
          {eyebrow}
        </span>
        <ArrowUpRight size={18} className="text-mute group-hover:text-paper group-hover:rotate-12 transition-all" />
      </div>
      <h3 className="font-display text-[32px] md:text-[40px] leading-[1] tracking-tight mb-3">{title}</h3>
      {subtitle && (
        <p className="font-mono text-[11px] uppercase tracking-widest text-mute group-hover:text-paper/60 mb-3">{subtitle}</p>
      )}
      {description && (
        <p className="text-[15px] leading-[1.55] text-mute group-hover:text-paper/70 max-w-md">{description}</p>
      )}
    </>
  );
  const cls = 'reveal group bg-paper p-8 md:p-10 hover:bg-ink hover:text-paper transition-colors';
  if (internal) return <Link to={href} className={cls}>{inner}</Link>;
  return <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>{inner}</a>;
}

export default function AppsList() {
  const [projetos, setProjetos] = useState([]);
  useEffect(() => { document.title = 'Aplicativos · Studio Mythos'; }, []);
  useEffect(() => {
    api.get('/projetos').then((r) => setProjetos(r.data?.data || [])).catch(() => setProjetos([]));
  }, []);
  useReveal([projetos.length]);

  return (
    <div className="min-h-screen bg-paper font-sans text-ink antialiased selection:bg-ink selection:text-paper">
      <header className="fixed w-full top-0 z-50 bg-paper/95 backdrop-blur-sm border-b border-rule">
        <div className="container mx-auto px-6 md:px-10 h-16 md:h-20 flex justify-between items-center">
          <Link to="/" className="flex items-center"><Logo size={32} variant="dark" /></Link>
          <nav className="flex items-center gap-9">
            <Link to="/apps" className="text-[13px] font-medium text-ink/70 hover:text-ink transition-colors hidden sm:block">Aplicativos</Link>
            <a href="/#servicos" className="text-[13px] font-medium text-ink/70 hover:text-ink transition-colors hidden sm:block">Serviços</a>
            <a href="/#contato" className="inline-flex items-center gap-2 bg-ink text-paper px-5 py-2.5 text-[13px] font-semibold hover:bg-oxblood transition-colors">
              Iniciar projeto <ArrowRight size={14} />
            </a>
          </nav>
        </div>
      </header>

      <section className="bg-paper pt-32 md:pt-40 pb-16 md:pb-20 border-b border-rule">
        <div className="container mx-auto px-6 md:px-10">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-1">
              <span className="font-mono text-[11px] text-olive tracking-widest">§ 00</span>
            </div>
            <div className="col-span-12 md:col-span-11">
              <p className="font-mono text-[11px] text-mute uppercase tracking-[0.2em] mb-6">Central de Aplicativos</p>
              <h1 className="font-display font-light text-[44px] sm:text-[64px] md:text-[80px] leading-[0.95] tracking-[-0.035em] text-ink max-w-[14ch]">
                Aplicativos do<br /><span className="italic font-normal">Studio Mythos</span>.
              </h1>
              <p className="text-mute text-[17px] leading-[1.55] mt-10 max-w-xl">
                Centralizamos aqui tudo o que cada aplicativo precisa — descrição, política de privacidade, termos de uso e suporte — em um só lugar, prontos para publicação na Google Play e App Store.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 md:px-10 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-rule border border-rule">
          <EditorialCard internal href="/capacetes" eyebrow="Produto próprio · D2C"
            title={MARCA.nomeCompleto} subtitle="Capacetes personalizados"
            description={`${MARCA.tagline} Monte ao vivo, escolha cores, viseira e grafismos.`} />
          <EditorialCard href="/demos/veiculos/index.html" eyebrow="Demonstração · Landing"
            title="Mythos Veículos"
            description="Landing page imersiva para lançamento de veículo esportivo: hero em vídeo com scrub ao rolar, seções cinematográficas e métricas de performance." />
          <EditorialCard href="/yoga-mythos/index.html" eyebrow="Demonstração · Landing"
            title="Mythos Yoga"
            description="Landing page de captação de alunos para aulas de yoga: vídeos em destaque, depoimentos e chamadas diretas para agendamento via WhatsApp." />
          <EditorialCard internal href="/modelos/floricultura" eyebrow="Página exemplo · Scroll-driven"
            title="Mythos Floricultura"
            description="Landing imersiva controlada pelo scroll: a câmera atravessa um portal floral e emerge num jardim, com textos em efeito scramble e cards de vidro." />
          {projetos.map((p) => (
            <EditorialCard key={p.id} href={urlDoProjeto(p)} eyebrow="Projeto publicado"
              title={p.titulo} subtitle={p.subtitulo} description={p.descricao} />
          ))}
          {apps.map((app) => (
            <EditorialCard key={app.slug} internal href={`/apps/${app.slug}`}
              eyebrow={app.categoria} title={app.nome} description={app.tagline} />
          ))}
        </div>

        {apps.length === 0 && projetos.length === 0 && (
          <p className="text-center text-mute py-12 font-mono text-[12px] uppercase tracking-widest">Nenhum aplicativo publicado ainda.</p>
        )}
      </section>

      <PublicFooter />
    </div>
  );
}
