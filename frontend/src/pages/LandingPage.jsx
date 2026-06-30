import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ArrowRight, ArrowUpRight, Plus, Minus, Mail, Phone } from 'lucide-react';
import Logo from '../components/Logo';
import { PublicFooter } from '../components/SiteChrome';
import { apps } from '../data/apps';
import { servicos } from '../data/servicos';
import { MARCA } from '../data/capacetes';
import { CONTATO, whatsappLink } from '../data/contato';

const metodologia = [
  { n: '01', title: 'Descoberta', desc: 'Antes de qualquer linha de código, escutamos. Mapeamos negócio, público e o problema real a ser resolvido.' },
  { n: '02', title: 'Design', desc: 'Prototipamos a experiência e a identidade visual. Cada decisão é discutida antes de virar interface.' },
  { n: '03', title: 'Desenvolvimento', desc: 'Construímos com stack atual, em ciclos curtos. Você acompanha o que está sendo feito a cada semana.' },
  { n: '04', title: 'Lançamento', desc: 'Publicamos, integramos e instrumentamos. Nada vai pro ar sem métrica de acompanhamento.' },
  { n: '05', title: 'Crescimento', desc: 'O ar é só o começo. Acompanhamos resultado e iteramos com base no que os dados mostram.' },
];

const stack = [
  { grupo: 'Frontend', itens: ['React', 'Next.js', 'TypeScript', 'Tailwind', 'Vite'] },
  { grupo: 'Backend', itens: ['Node.js', 'Python', 'PostgreSQL', 'Prisma', 'REST + GraphQL'] },
  { grupo: 'Mobile', itens: ['React Native', 'Expo', 'iOS', 'Android'] },
  { grupo: 'IA / Automação', itens: ['OpenAI', 'Anthropic', 'LangChain', 'n8n', 'Vector DB'] },
  { grupo: 'Infra', itens: ['AWS', 'Vercel', 'Cloudflare', 'Docker', 'GitHub Actions'] },
  { grupo: 'Dados', itens: ['BigQuery', 'Metabase', 'Mixpanel', 'GA4', 'GTM'] },
];

const faq = [
  {
    q: 'Quanto custa um projeto com vocês?',
    a: 'Depende do escopo. Um site institucional bem feito não tem o mesmo custo de um app com painel administrativo e integrações. Em geral trabalhamos com orçamento fechado por projeto, apresentado em até 3 dias úteis após a conversa inicial. Sem surpresa no meio do caminho.',
  },
  {
    q: 'Quanto tempo demora?',
    a: 'Sites e landing pages: 3 a 6 semanas. E-commerce: 6 a 10 semanas. Aplicativos e plataformas: 8 a 16 semanas, dependendo da complexidade. Prazo entra no contrato — não é estimativa otimista.',
  },
  {
    q: 'Vocês trabalham com NDA?',
    a: 'Sim. Antes de qualquer detalhamento de ideia, assinamos NDA mútuo. O seu projeto é seu — não usamos partes dele em outros clientes nem em portfólio sem autorização explícita.',
  },
  {
    q: 'E se eu já tenho designer ou parte do produto pronto?',
    a: 'Melhor ainda. Trabalhamos integrados ao seu time, com handoff via Figma, repositório compartilhado e cerimônia leve. Não exigimos refazer o que já existe e funciona.',
  },
  {
    q: 'Após o lançamento, vocês somem?',
    a: 'Não. Oferecemos contrato de manutenção mensal (correções, pequenas evoluções, monitoramento) ou pacotes de evolução por sprint. Mantemos o código vivo enquanto seu produto estiver no ar.',
  },
  {
    q: 'Vocês também usam IA pra acelerar o trabalho?',
    a: 'Usamos onde faz sentido — geração de boilerplate, testes, revisão de copy. O design, a arquitetura e as decisões de produto continuam sendo humanas. É o oposto de gerar uma landing por prompt e entregar.',
  },
];

const servicosDestaque = servicos.slice(0, 6);

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const [form, setForm] = useState({ nome: '', email: '', mensagem: '' });

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          observer.unobserve(e.target);
        }
      }),
      { threshold: 0.1 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
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

  const nav = [
    { label: 'Serviços', action: () => scrollTo('servicos') },
    { label: 'Trabalhos', action: () => scrollTo('trabalhos') },
    { label: 'Método', action: () => scrollTo('metodologia') },
    { label: 'Perguntas', action: () => scrollTo('faq') },
  ];

  return (
    <div className="min-h-screen bg-paper font-sans text-ink antialiased selection:bg-ink selection:text-paper">

      {/* ── NAV ── */}
      <header className={`fixed w-full top-0 z-50 transition-colors duration-300 ${
        isScrolled ? 'bg-paper/95 backdrop-blur-sm border-b border-rule' : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-6 md:px-10 h-16 md:h-20 flex justify-between items-center">
          <button onClick={() => scrollTo('hero')} className="flex items-center">
            <Logo size={32} variant="dark" />
          </button>
          <nav className="hidden md:flex items-center gap-9">
            {nav.map((item) => (
              <button
                key={item.label}
                onClick={item.action}
                className="text-[13px] font-medium text-ink/70 hover:text-ink transition-colors"
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => scrollTo('contato')}
              className="inline-flex items-center gap-2 bg-ink text-paper px-5 py-2.5 text-[13px] font-semibold hover:bg-oxblood transition-colors"
            >
              Iniciar projeto <ArrowRight size={14} />
            </button>
          </nav>
          <button
            className="md:hidden text-ink"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden bg-paper border-t border-rule flex flex-col p-6 gap-4">
            {nav.map((item) => (
              <button key={item.label} onClick={item.action} className="text-left font-medium text-ink">{item.label}</button>
            ))}
            <button onClick={() => scrollTo('contato')} className="bg-ink text-paper px-5 py-3 font-semibold mt-2">
              Iniciar projeto
            </button>
          </div>
        )}
      </header>

      {/* ── HERO ── */}
      <section id="hero" className="relative bg-paper pt-32 md:pt-40 pb-24 md:pb-32 border-b border-rule">
        <div className="container mx-auto px-6 md:px-10">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-1">
              <span className="font-mono text-[11px] text-olive tracking-widest">§ 01</span>
            </div>
            <div className="col-span-12 md:col-span-11">
              <div className="flex items-center gap-3 mb-10 font-mono text-[11px] text-mute uppercase tracking-[0.2em]">
                <span>Studio Mythos</span>
                <span className="w-8 h-px bg-rule" />
                <span>Desde 2023</span>
              </div>

              <h1 className="font-display font-light text-[44px] sm:text-[64px] md:text-[88px] lg:text-[112px] leading-[0.95] tracking-[-0.035em] text-ink max-w-[16ch]">
                Software feito com<br />
                <span className="italic font-normal">paciência</span>,<br />
                não com prompt.
              </h1>

              <div className="grid grid-cols-12 gap-6 mt-14 md:mt-20">
                <div className="col-span-12 md:col-start-1 md:col-span-5">
                  <p className="text-mute text-[17px] leading-[1.55] font-normal max-w-md">
                    Somos um estúdio full-service de produto digital. Sites, e-commerce, aplicativos, plataformas internas e marketing — construídos com a profundidade de quem mora no problema antes de propor solução.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 mt-8">
                    <button
                      onClick={() => scrollTo('contato')}
                      className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-ink text-paper font-semibold text-[14px] hover:bg-oxblood transition-colors"
                    >
                      Iniciar um projeto <ArrowRight size={15} />
                    </button>
                    <button
                      onClick={() => scrollTo('servicos')}
                      className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-ink text-ink font-semibold text-[14px] hover:bg-ink hover:text-paper transition-colors"
                    >
                      O que fazemos
                    </button>
                  </div>
                </div>

                <div className="col-span-12 md:col-start-8 md:col-span-5">
                  <div className="border-t-2 border-blueprint pt-5 relative">
                    <span className="absolute -top-[7px] left-0 w-3 h-3 bg-blueprint" />
                    <span className="absolute -top-[7px] right-0 w-3 h-3 bg-blueprint" />
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-mono text-[11px] text-blueprint uppercase tracking-widest">Em uma frase</p>
                      <p className="font-mono text-[10px] text-blueprint/60">Fig. 01</p>
                    </div>
                    <p className="font-display text-[22px] leading-[1.25] text-ink">
                      Cada projeto é desenhado, escrito e construído por pessoas que entendem o seu negócio — não por um modelo que adivinha o que talvez você queira ouvir.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MANIFESTO ── */}
      <section id="manifesto" className="bg-paper-warm py-24 md:py-32 border-b border-rule">
        <div className="container mx-auto px-6 md:px-10">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-1 reveal">
              <span className="font-mono text-[11px] text-olive tracking-widest">§ 02</span>
            </div>
            <div className="col-span-12 md:col-span-3 reveal">
              <p className="font-mono text-[11px] text-mute uppercase tracking-widest mb-2">Manifesto</p>
              <h2 className="font-display font-normal text-[28px] leading-[1.05] tracking-tight text-ink">
                Como pensamos.
              </h2>
            </div>
            <div className="col-span-12 md:col-start-6 md:col-span-7 space-y-7 text-[18px] leading-[1.65] text-ink/85 font-normal reveal">
              <p className="font-display text-[22px] leading-[1.4] text-ink">
                <span className="font-bold text-[42px] float-left leading-[0.9] mr-3 mt-1 font-display">A</span>
                grande maioria do que se vende como "produto digital" hoje é template repintado. Tela atrás de tela com a mesma estrutura, o mesmo gradiente, o mesmo botão flutuante. Funciona, mas não diz nada.
              </p>
              <p>
                Acreditamos no oposto: que produto digital é instrumento de negócio. Que cada decisão de interface — uma cor, uma palavra, a ordem das seções — devolve ou destrói confiança. Que velocidade sem clareza é só pressa.
              </p>
              <p>
                Por isso trabalhamos em escopo fechado, com prazo no contrato, em ciclos curtos com você dentro. Sem caixa-preta. Sem entrega no apagar das luzes. Sem terceirizar a parte difícil pra um modelo de linguagem.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVIÇOS ── */}
      <section id="servicos" className="bg-paper py-24 md:py-32 border-b border-rule">
        <div className="container mx-auto px-6 md:px-10">
          <div className="grid grid-cols-12 gap-6 mb-16 md:mb-20">
            <div className="col-span-12 md:col-span-1 reveal">
              <span className="font-mono text-[11px] text-olive tracking-widest">§ 03</span>
            </div>
            <div className="col-span-12 md:col-span-7 reveal">
              <p className="font-mono text-[11px] text-mute uppercase tracking-widest mb-3">Serviços</p>
              <h2 className="font-display font-normal text-[40px] md:text-[56px] leading-[1] tracking-[-0.02em] text-ink">
                O que entregamos.
              </h2>
            </div>
            <div className="col-span-12 md:col-start-9 md:col-span-4 flex md:items-end reveal">
              <p className="text-mute text-[15px] leading-[1.6]">
                Seis frentes principais. Cada uma tem página própria com escopo, entregáveis e exemplos detalhados.
              </p>
            </div>
          </div>

          <div className="border-t border-ink">
            {servicosDestaque.map((s, i) => (
              <Link
                key={s.slug}
                to={`/servicos/${s.slug}`}
                className="reveal group block border-b border-rule py-8 md:py-10 transition-colors hover:bg-ink hover:text-paper"
              >
                <div className="grid grid-cols-12 gap-6 items-center px-2 md:px-4">
                  <div className="col-span-2 md:col-span-1">
                    <span className="font-mono text-[12px] text-mute group-hover:text-paper/60 tracking-widest">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="col-span-10 md:col-span-4">
                    <h3 className="font-display text-[26px] md:text-[32px] leading-[1.05] tracking-tight">
                      {s.title}
                    </h3>
                  </div>
                  <div className="col-span-12 md:col-span-5">
                    <p className="text-[15px] leading-[1.55] text-mute group-hover:text-paper/70">
                      {s.resumo}
                    </p>
                  </div>
                  <div className="col-span-12 md:col-span-2 flex md:justify-end">
                    <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-mute group-hover:text-paper transition-colors">
                      Ver <ArrowUpRight size={14} className="group-hover:rotate-12 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {servicos.length > 6 && (
            <div className="mt-10 reveal">
              <Link
                to="/servicos"
                className="inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-widest text-ink border-b border-ink pb-1 hover:text-oxblood hover:border-oxblood transition-colors"
              >
                Ver os {servicos.length} serviços <ArrowRight size={14} />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── METODOLOGIA ── */}
      <section id="metodologia" className="bg-ink-warm text-paper py-24 md:py-32">
        <div className="container mx-auto px-6 md:px-10">
          <div className="grid grid-cols-12 gap-6 mb-16 md:mb-20">
            <div className="col-span-12 md:col-span-1 reveal">
              <span className="font-mono text-[11px] text-olive-light tracking-widest">§ 04</span>
            </div>
            <div className="col-span-12 md:col-span-7 reveal">
              <p className="font-mono text-[11px] text-paper/40 uppercase tracking-widest mb-3">Método</p>
              <h2 className="font-display font-normal text-[40px] md:text-[56px] leading-[1] tracking-[-0.02em] text-paper">
                Cinco passos.<br />
                <span className="italic text-paper/60">Sem mistério.</span>
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-px bg-paper/15 border border-paper/15">
            {metodologia.map((m, i) => (
              <div
                key={i}
                className="reveal bg-ink-warm p-7 md:p-8 flex flex-col"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <span className="font-mono text-[11px] text-oxblood tracking-widest mb-8">{m.n}</span>
                <h3 className="font-display text-[22px] leading-[1.1] mb-4 tracking-tight">{m.title}</h3>
                <p className="text-paper/55 text-[13.5px] leading-[1.6]">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRABALHOS ── */}
      <section id="trabalhos" className="bg-sand py-24 md:py-32 border-b border-rule">
        <div className="container mx-auto px-6 md:px-10">
          <div className="grid grid-cols-12 gap-6 mb-16">
            <div className="col-span-12 md:col-span-1 reveal">
              <span className="font-mono text-[11px] text-olive tracking-widest">§ 05</span>
            </div>
            <div className="col-span-12 md:col-span-7 reveal">
              <p className="font-mono text-[11px] text-mute uppercase tracking-widest mb-3">Trabalhos próprios</p>
              <h2 className="font-display font-normal text-[40px] md:text-[56px] leading-[1] tracking-[-0.02em] text-ink">
                Produtos que mantemos<br />
                <span className="italic">no ar.</span>
              </h2>
            </div>
            <div className="col-span-12 md:col-start-9 md:col-span-4 flex md:items-end reveal">
              <p className="text-mute text-[15px] leading-[1.6]">
                Não vendemos só serviço — operamos nossos próprios produtos. O que mostramos abaixo está publicado e em uso real.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-rule border border-rule">
            <Link
              to="/capacetes"
              className="reveal group bg-paper p-8 md:p-10 hover:bg-ink hover:text-paper transition-colors"
            >
              <div className="flex items-start justify-between mb-12">
                <span className="font-mono text-[11px] uppercase tracking-widest text-mute group-hover:text-paper/50">
                  Produto próprio · D2C
                </span>
                <ArrowUpRight size={18} className="text-mute group-hover:text-paper group-hover:rotate-12 transition-all" />
              </div>
              <h3 className="font-display text-[36px] md:text-[44px] leading-[1] tracking-tight mb-3">{MARCA.nomeCompleto}</h3>
              <p className="text-[15px] leading-[1.55] text-mute group-hover:text-paper/70 max-w-md">
                Plataforma de configuração de capacetes personalizados, com visualizador ao vivo e fluxo de pedido integrado.
              </p>
            </Link>

            {apps.slice(0, 3).map((app) => (
              <Link
                key={app.slug}
                to={`/apps/${app.slug}`}
                className="reveal group bg-paper p-8 md:p-10 hover:bg-ink hover:text-paper transition-colors"
              >
                <div className="flex items-start justify-between mb-12">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-mute group-hover:text-paper/50">
                    {app.categoria}
                  </span>
                  <ArrowUpRight size={18} className="text-mute group-hover:text-paper group-hover:rotate-12 transition-all" />
                </div>
                <h3 className="font-display text-[36px] md:text-[44px] leading-[1] tracking-tight mb-3">{app.nome}</h3>
                <p className="text-[15px] leading-[1.55] text-mute group-hover:text-paper/70 max-w-md">
                  {app.tagline}
                </p>
              </Link>
            ))}
          </div>

          <div className="mt-10 reveal">
            <Link
              to="/apps"
              className="inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-widest text-ink border-b border-ink pb-1 hover:text-oxblood hover:border-oxblood transition-colors"
            >
              Catálogo completo de apps <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── STACK ── */}
      <section id="stack" className="bg-blueprint-paper py-24 md:py-32 border-b border-blueprint/20 relative overflow-hidden">
        {/* Grade técnica sutil — só nesta seção, como folha de planta */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.06]"
          style={{
            backgroundImage: 'linear-gradient(#16314F 1px, transparent 1px), linear-gradient(90deg, #16314F 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="container mx-auto px-6 md:px-10 relative z-10">
          <div className="grid grid-cols-12 gap-6 mb-14">
            <div className="col-span-12 md:col-span-1 reveal">
              <span className="font-mono text-[11px] text-olive tracking-widest">§ 06</span>
            </div>
            <div className="col-span-12 md:col-span-7 reveal">
              <p className="font-mono text-[11px] text-mute uppercase tracking-widest mb-3">Stack técnico</p>
              <h2 className="font-display font-normal text-[40px] md:text-[56px] leading-[1] tracking-[-0.02em] text-ink">
                Com o que construímos.
              </h2>
            </div>
            <div className="col-span-12 md:col-start-9 md:col-span-4 flex md:items-end reveal">
              <p className="text-mute text-[15px] leading-[1.6]">
                Tecnologia escolhida pelo problema, não por moda. A lista é curta de propósito.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12 reveal">
            {stack.map((g) => (
              <div key={g.grupo} className="border-t-2 border-blueprint pt-5">
                <div className="flex items-baseline justify-between mb-5">
                  <h3 className="font-mono text-[11px] uppercase tracking-widest text-blueprint">{g.grupo}</h3>
                  <span className="font-mono text-[10px] text-blueprint/50">{String(g.itens.length).padStart(2, '0')}</span>
                </div>
                <ul className="space-y-2.5">
                  {g.itens.map((item) => (
                    <li key={item} className="flex items-baseline gap-3 font-display text-[20px] leading-tight text-ink tracking-tight">
                      <span className="font-mono text-[10px] text-blueprint/60 translate-y-[-2px]">+</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="bg-paper py-24 md:py-32 border-b border-rule">
        <div className="container mx-auto px-6 md:px-10">
          <div className="grid grid-cols-12 gap-6 mb-14">
            <div className="col-span-12 md:col-span-1 reveal">
              <span className="font-mono text-[11px] text-olive tracking-widest">§ 07</span>
            </div>
            <div className="col-span-12 md:col-span-7 reveal">
              <p className="font-mono text-[11px] text-mute uppercase tracking-widest mb-3">Perguntas</p>
              <h2 className="font-display font-normal text-[40px] md:text-[56px] leading-[1] tracking-[-0.02em] text-ink">
                As que sempre nos fazem.<br />
                <span className="italic">Respondidas direto.</span>
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-start-2 md:col-span-10 border-t border-ink">
              {faq.map((item, i) => {
                const open = openFaq === i;
                return (
                  <div key={i} className="border-b border-rule reveal">
                    <button
                      onClick={() => setOpenFaq(open ? -1 : i)}
                      className="w-full flex items-start justify-between gap-6 py-6 md:py-7 text-left group"
                    >
                      <span className="font-display text-[22px] md:text-[26px] leading-[1.2] tracking-tight text-ink group-hover:text-oxblood transition-colors">
                        {item.q}
                      </span>
                      <span className="shrink-0 mt-2 text-ink group-hover:text-oxblood transition-colors">
                        {open ? <Minus size={20} /> : <Plus size={20} />}
                      </span>
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-96 pb-7' : 'max-h-0'}`}>
                      <p className="text-mute text-[16px] leading-[1.65] max-w-2xl">
                        {item.a}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTATO ── */}
      <section id="contato" className="bg-ink text-paper py-24 md:py-32">
        <div className="container mx-auto px-6 md:px-10">
          <div className="grid grid-cols-12 gap-6 mb-16">
            <div className="col-span-12 md:col-span-1 reveal">
              <span className="font-mono text-[11px] text-olive-light tracking-widest">§ 08</span>
            </div>
            <div className="col-span-12 md:col-span-11 reveal">
              <p className="font-mono text-[11px] text-paper/40 uppercase tracking-widest mb-4">Contato</p>
              <h2 className="font-display font-normal text-[44px] md:text-[88px] leading-[0.95] tracking-[-0.03em] text-paper max-w-[14ch]">
                Vamos<br />
                <span className="italic text-oxblood">conversar?</span>
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6 md:gap-10">
            <div className="col-span-12 md:col-start-2 md:col-span-5 reveal">
              <p className="text-paper/60 text-[17px] leading-[1.6] mb-10 max-w-md">
                Conte sua ideia em poucas linhas. Em até um dia útil voltamos com perguntas e uma proposta de próximos passos. Sem formulário de 12 campos.
              </p>

              <div className="space-y-6 border-t border-paper/15 pt-8">
                <a
                  href={`mailto:${CONTATO.email}`}
                  className="flex items-center justify-between group border-b border-paper/10 pb-5 hover:border-oxblood transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <Mail size={18} className="text-paper/40 group-hover:text-oxblood transition-colors" />
                    <div>
                      <p className="font-mono text-[10px] text-paper/40 uppercase tracking-widest mb-1">E-mail</p>
                      <p className="font-display text-[20px] text-paper">{CONTATO.email}</p>
                    </div>
                  </div>
                  <ArrowUpRight size={18} className="text-paper/40 group-hover:text-oxblood group-hover:rotate-12 transition-all" />
                </a>
                <a
                  href={whatsappLink('Olá! Gostaria de falar com a equipe do Studio Mythos.')}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between group border-b border-paper/10 pb-5 hover:border-oxblood transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <Phone size={18} className="text-paper/40 group-hover:text-oxblood transition-colors" />
                    <div>
                      <p className="font-mono text-[10px] text-paper/40 uppercase tracking-widest mb-1">WhatsApp</p>
                      <p className="font-display text-[20px] text-paper">{CONTATO.whatsappDisplay}</p>
                    </div>
                  </div>
                  <ArrowUpRight size={18} className="text-paper/40 group-hover:text-oxblood group-hover:rotate-12 transition-all" />
                </a>
              </div>
            </div>

            <div className="col-span-12 md:col-start-8 md:col-span-5 reveal">
              <form className="space-y-7" onSubmit={enviarOrcamento}>
                <div>
                  <label className="block font-mono text-[10px] text-paper/40 uppercase tracking-widest mb-3">01 · Nome</label>
                  <input
                    value={form.nome}
                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                    type="text"
                    placeholder="Como devemos te chamar"
                    className="w-full bg-transparent border-b border-paper/20 pb-3 text-paper placeholder-paper/25 focus:outline-none focus:border-oxblood transition-colors text-[16px] font-display"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] text-paper/40 uppercase tracking-widest mb-3">02 · E-mail</label>
                  <input
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    type="email"
                    placeholder="onde podemos responder"
                    className="w-full bg-transparent border-b border-paper/20 pb-3 text-paper placeholder-paper/25 focus:outline-none focus:border-oxblood transition-colors text-[16px] font-display"
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] text-paper/40 uppercase tracking-widest mb-3">03 · Sobre o projeto</label>
                  <textarea
                    value={form.mensagem}
                    onChange={(e) => setForm({ ...form, mensagem: e.target.value })}
                    rows={4}
                    placeholder="o que você precisa, em poucas linhas"
                    className="w-full bg-transparent border-b border-paper/20 pb-3 text-paper placeholder-paper/25 focus:outline-none focus:border-oxblood transition-colors resize-none text-[16px] font-display"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-paper text-ink font-semibold py-4 hover:bg-oxblood hover:text-paper transition-colors flex items-center justify-center gap-2 mt-4 text-[14px]"
                >
                  Enviar pelo WhatsApp <ArrowRight size={16} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
