// ============================================================================
// CATÁLOGO DE SERVIÇOS — Studio Mythos
// ----------------------------------------------------------------------------
// Cada serviço tem uma página pública dedicada em /servicos/:slug com:
// explicação detalhada, galeria visual, benefícios, entregáveis e CTA de
// orçamento (WhatsApp + formulário).
//
// Para trocar a galeria ilustrativa por fotos reais depois, basta preencher
// `imagens: ['/img/servico/foto1.jpg', ...]` no objeto do serviço — a página
// passa a usar as fotos no lugar dos painéis ilustrativos.
// ============================================================================

import {
  LayoutTemplate, Globe, Smartphone, Code, Database, Target, Search, PenTool,
  Bot, Calendar, Megaphone, Briefcase,
  Gauge, ShoppingCart, Layers, Workflow, MousePointerClick, BarChart3,
  Palette, MessageSquare, CalendarCheck, Image as ImageIcon, Lightbulb,
  Rocket, Zap, Server, CreditCard, Bell, Users,
} from 'lucide-react';

export const servicos = [
  {
    slug: 'sites-landing-pages',
    icon: LayoutTemplate,
    title: 'Sites & Landing Pages',
    categoria: 'Presença digital',
    resumo: 'Sites institucionais e páginas de alta conversão, rápidas e com UI/UX impecável.',
    intro: 'Sua marca com uma presença digital profissional, rápida e feita para converter visitantes em clientes.',
    cor: '#6366F1',
    paragrafos: [
      'Criamos sites institucionais e landing pages sob medida, com design moderno e foco total na experiência do usuário. Cada página é planejada para guiar o visitante até a ação que importa para o seu negócio — seja um contato, um orçamento ou uma compra.',
      'Tudo é construído com tecnologia atual, otimizado para carregar rápido, funcionar perfeitamente no celular e ranquear bem no Google. Você recebe um site fácil de atualizar e pronto para crescer junto com a sua empresa.',
    ],
    beneficios: [
      'Design responsivo, impecável no celular e no desktop',
      'Carregamento rápido e otimização para o Google (SEO)',
      'Estrutura pensada para gerar contatos e vendas',
      'Identidade visual alinhada à sua marca',
    ],
    entregaveis: [
      'Layout exclusivo (sem templates genéricos)',
      'Páginas institucionais e/ou landing pages',
      'Formulários de contato integrados ao WhatsApp/e-mail',
      'Painel ou estrutura para você atualizar conteúdo',
    ],
    galeria: [
      { icon: LayoutTemplate, titulo: 'Layout sob medida', legenda: 'Design exclusivo para a sua marca' },
      { icon: Smartphone, titulo: '100% responsivo', legenda: 'Perfeito em qualquer tela' },
      { icon: Gauge, titulo: 'Performance', legenda: 'Rápido e otimizado para o Google' },
    ],
  },
  {
    slug: 'ecommerce',
    icon: Globe,
    title: 'E-commerce',
    categoria: 'Vendas online',
    resumo: 'Lojas virtuais e plataformas B2B completas, com pagamentos e gestão de catálogo.',
    intro: 'Sua loja vendendo 24 horas por dia, com pagamentos, frete e gestão de produtos de ponta a ponta.',
    cor: '#7C3AED',
    paragrafos: [
      'Desenvolvemos lojas virtuais e plataformas B2B completas, com catálogo de produtos, carrinho, meios de pagamento e cálculo de frete integrados. Tudo pensado para o cliente comprar com facilidade e para você gerenciar tudo sem complicação.',
      'Integramos gateways de pagamento, transportadoras e ferramentas de marketing, e construímos uma experiência de compra fluida que reduz o abandono de carrinho e aumenta o ticket médio.',
    ],
    beneficios: [
      'Vendas 24/7, sem depender de horário comercial',
      'Pagamentos (Pix, cartão, boleto) e frete integrados',
      'Gestão simples de produtos, estoque e pedidos',
      'Experiência de compra que reduz abandono de carrinho',
    ],
    entregaveis: [
      'Loja virtual ou plataforma B2B sob medida',
      'Integração de pagamentos e transportadoras',
      'Painel de gestão de catálogo e pedidos',
      'Relatórios de vendas e desempenho',
    ],
    galeria: [
      { icon: ShoppingCart, titulo: 'Catálogo & carrinho', legenda: 'Compra fluida e intuitiva' },
      { icon: CreditCard, titulo: 'Pagamentos', legenda: 'Pix, cartão e boleto integrados' },
      { icon: BarChart3, titulo: 'Gestão de vendas', legenda: 'Pedidos e relatórios em um lugar' },
    ],
  },
  {
    slug: 'aplicativos-mobile',
    icon: Smartphone,
    title: 'Aplicativos Mobile',
    categoria: 'Mobile',
    resumo: 'Apps nativos e híbridos para Android e iOS, da ideia à publicação nas lojas.',
    intro: 'Do conceito à publicação na Google Play e App Store — seu aplicativo na palma da mão dos clientes.',
    cor: '#4F46E5',
    paragrafos: [
      'Projetamos e desenvolvemos aplicativos para Android e iOS, nativos ou híbridos, conduzindo todo o processo: ideia, design da experiência, desenvolvimento, testes e publicação nas lojas.',
      'Construímos apps estáveis e bonitos, com notificações, integrações e recursos sob medida para o seu negócio — e cuidamos também da parte chata: contas de desenvolvedor, políticas das lojas e atualizações.',
    ],
    beneficios: [
      'Presença direta no celular do seu cliente',
      'Apps para Android e iOS a partir de uma base única',
      'Notificações push para engajar e reter usuários',
      'Publicação e manutenção nas lojas por nossa conta',
    ],
    entregaveis: [
      'Design de interface e experiência (UI/UX)',
      'App Android e/ou iOS',
      'Publicação na Google Play e App Store',
      'Suporte e atualizações pós-lançamento',
    ],
    galeria: [
      { icon: Smartphone, titulo: 'Android & iOS', legenda: 'Uma base, as duas lojas' },
      { icon: Bell, titulo: 'Notificações push', legenda: 'Engaje e traga o usuário de volta' },
      { icon: Rocket, titulo: 'Publicação', legenda: 'Cuidamos das lojas por você' },
    ],
  },
  {
    slug: 'web-apps-saas',
    icon: Code,
    title: 'Web Apps & SaaS',
    categoria: 'Sistemas sob medida',
    resumo: 'Sistemas sob medida, escaláveis, para automatizar e digitalizar processos.',
    intro: 'Sistemas web e plataformas SaaS feitos sob medida para digitalizar e automatizar a sua operação.',
    cor: '#6366F1',
    paragrafos: [
      'Desenvolvemos sistemas web e produtos SaaS do zero, desenhados em torno dos processos reais da sua empresa. Substituímos planilhas e controles manuais por uma plataforma única, segura e acessível de qualquer lugar.',
      'Arquitetura escalável, painéis, controle de acesso por perfil, relatórios e integrações com as ferramentas que você já usa — tudo construído para crescer sem retrabalho.',
    ],
    beneficios: [
      'Processos digitalizados e automatizados de ponta a ponta',
      'Acesso seguro de qualquer lugar, na nuvem',
      'Painéis e relatórios para decidir com dados',
      'Escalável: cresce junto com o seu negócio',
    ],
    entregaveis: [
      'Sistema web / plataforma SaaS sob medida',
      'Controle de usuários e permissões',
      'Integrações com APIs e ferramentas externas',
      'Hospedagem, segurança e manutenção',
    ],
    galeria: [
      { icon: Layers, titulo: 'Sob medida', legenda: 'Modelado no seu processo' },
      { icon: Server, titulo: 'Escalável & seguro', legenda: 'Na nuvem, pronto para crescer' },
      { icon: BarChart3, titulo: 'Painéis & dados', legenda: 'Decisões baseadas em números' },
    ],
  },
  {
    slug: 'crm-automacao',
    icon: Database,
    title: 'CRM & Automação',
    categoria: 'Vendas & atendimento',
    resumo: 'Implantação de CRM, funis de vendas e automações de atendimento para sua equipe vender mais.',
    intro: 'Organize o funil, automatize o atendimento e faça a sua equipe vender mais com previsibilidade.',
    cor: '#7C3AED',
    paragrafos: [
      'Implantamos e configuramos um CRM sob medida para o seu processo comercial: cadastro de leads, funil de vendas em etapas, histórico de cada negociação e indicadores claros de desempenho.',
      'Somamos a isso automações de atendimento — respostas, follow-ups e distribuição de leads — para que nenhuma oportunidade esfrie. O resultado é uma equipe mais produtiva e gestão com visão total do pipeline.',
    ],
    beneficios: [
      'Funil de vendas organizado e previsível',
      'Nenhum lead esquecido, com follow-up automático',
      'Visão completa do histórico de cada cliente',
      'Indicadores de desempenho do time comercial',
    ],
    entregaveis: [
      'Implantação e configuração do CRM',
      'Funil de vendas e etapas personalizadas',
      'Automações de atendimento e follow-up',
      'Treinamento da equipe e relatórios',
    ],
    galeria: [
      { icon: Workflow, titulo: 'Funil de vendas', legenda: 'Etapas claras, do lead ao fechamento' },
      { icon: Zap, titulo: 'Automação', legenda: 'Follow-ups e respostas no automático' },
      { icon: BarChart3, titulo: 'Indicadores', legenda: 'Desempenho do time em tempo real' },
    ],
  },
  {
    slug: 'trafego-pago',
    icon: Target,
    title: 'Tráfego Pago',
    categoria: 'Aquisição',
    resumo: 'Campanhas no Google e Meta Ads focadas no seu retorno sobre investimento.',
    intro: 'Campanhas no Google e nas redes sociais desenhadas para trazer clientes com o melhor retorno possível.',
    cor: '#4F46E5',
    paragrafos: [
      'Criamos e gerenciamos campanhas de anúncios no Google Ads e Meta Ads (Facebook e Instagram), com segmentação precisa do público certo e foco em retorno sobre investimento (ROI).',
      'Acompanhamos métricas de perto, fazemos testes e otimizamos continuamente para reduzir o custo por resultado. Você recebe relatórios claros e sabe exatamente para onde está indo o seu investimento.',
    ],
    beneficios: [
      'Clientes chegando de forma previsível e escalável',
      'Segmentação para impactar o público certo',
      'Otimização contínua para baixar o custo por venda',
      'Relatórios transparentes do retorno (ROI)',
    ],
    entregaveis: [
      'Estratégia e estruturação das campanhas',
      'Criativos e textos dos anúncios',
      'Gestão e otimização contínua',
      'Relatórios de desempenho e ROI',
    ],
    galeria: [
      { icon: MousePointerClick, titulo: 'Google & Meta Ads', legenda: 'Anúncios onde o cliente está' },
      { icon: Target, titulo: 'Segmentação', legenda: 'O público certo, na hora certa' },
      { icon: BarChart3, titulo: 'Retorno (ROI)', legenda: 'Otimização orientada a dados' },
    ],
  },
  {
    slug: 'seo-conteudo',
    icon: Search,
    title: 'SEO & Conteúdo',
    categoria: 'Crescimento orgânico',
    resumo: 'Otimização para busca e conteúdo estratégico para gerar autoridade e leads.',
    intro: 'Apareça no Google de forma orgânica e construa autoridade com conteúdo que atrai clientes.',
    cor: '#6366F1',
    paragrafos: [
      'Otimizamos o seu site para os mecanismos de busca (SEO) — estrutura, performance, palavras-chave e experiência — para que ele seja encontrado por quem procura o que você oferece.',
      'Aliado a isso, produzimos conteúdo estratégico que educa o seu público, gera autoridade e atrai leads de forma contínua, sem depender só de anúncios pagos.',
    ],
    beneficios: [
      'Mais visibilidade no Google sem pagar por clique',
      'Tráfego qualificado e constante ao longo do tempo',
      'Autoridade de marca no seu segmento',
      'Resultado que se acumula e se sustenta',
    ],
    entregaveis: [
      'Auditoria e otimização técnica de SEO',
      'Pesquisa de palavras-chave',
      'Plano e produção de conteúdo',
      'Acompanhamento de posições e tráfego',
    ],
    galeria: [
      { icon: Search, titulo: 'SEO técnico', legenda: 'Estrutura otimizada para buscar' },
      { icon: PenTool, titulo: 'Conteúdo', legenda: 'Autoridade que atrai clientes' },
      { icon: BarChart3, titulo: 'Crescimento', legenda: 'Tráfego orgânico que se acumula' },
    ],
  },
  {
    slug: 'identidade-visual',
    icon: PenTool,
    title: 'Identidade Visual',
    categoria: 'Branding',
    resumo: 'Logomarcas e identidade de marca modernas que posicionam o seu negócio.',
    intro: 'Uma marca memorável e coerente, do logotipo às cores, que posiciona o seu negócio no mercado.',
    cor: '#7C3AED',
    paragrafos: [
      'Criamos identidades visuais completas: logotipo, paleta de cores, tipografia e os elementos que dão personalidade à sua marca. Tudo desenhado para transmitir os valores certos e ser reconhecido com facilidade.',
      'Entregamos um manual de marca para que a sua comunicação seja consistente em todos os pontos de contato — site, redes sociais, materiais impressos e produtos.',
    ],
    beneficios: [
      'Marca profissional que gera confiança',
      'Reconhecimento imediato pelo público',
      'Comunicação consistente em todos os canais',
      'Diferenciação clara da concorrência',
    ],
    entregaveis: [
      'Logotipo e suas variações',
      'Paleta de cores e tipografia',
      'Manual de identidade visual',
      'Aplicações para redes e materiais',
    ],
    galeria: [
      { icon: Palette, titulo: 'Cores & tipografia', legenda: 'A personalidade da marca' },
      { icon: PenTool, titulo: 'Logotipo', legenda: 'Memorável e versátil' },
      { icon: ImageIcon, titulo: 'Manual de marca', legenda: 'Consistência em todo lugar' },
    ],
  },
  {
    slug: 'ia-humanizada',
    icon: Bot,
    title: 'IA Humanizada',
    categoria: 'Inteligência artificial',
    resumo: 'Agentes de inteligência artificial para atendimento e suporte 24 horas.',
    intro: 'Atendimento inteligente 24 horas: agentes de IA que conversam de forma natural e resolvem de verdade.',
    cor: '#4F46E5',
    paragrafos: [
      'Desenvolvemos agentes de inteligência artificial que atendem seus clientes 24 horas por dia, com linguagem natural e tom alinhado à sua marca. Eles respondem dúvidas, qualificam leads e agilizam o suporte.',
      'Treinamos a IA com o conhecimento do seu negócio e a integramos ao WhatsApp, site ou sistemas, com transferência para um atendente humano sempre que necessário.',
    ],
    beneficios: [
      'Atendimento imediato, 24/7, sem fila de espera',
      'Respostas naturais e no tom da sua marca',
      'Qualificação de leads automática',
      'Redução de custo no atendimento',
    ],
    entregaveis: [
      'Agente de IA treinado no seu negócio',
      'Integração com WhatsApp, site ou sistema',
      'Fluxos de qualificação e transferência humana',
      'Ajustes e melhorias contínuas',
    ],
    galeria: [
      { icon: MessageSquare, titulo: 'Conversa natural', legenda: 'No tom da sua marca' },
      { icon: Bot, titulo: 'Atendimento 24/7', legenda: 'Sempre disponível' },
      { icon: Users, titulo: 'Qualifica leads', legenda: 'E passa para o time quando precisa' },
    ],
  },
  {
    slug: 'agendamento-online',
    icon: Calendar,
    title: 'Agendamento Online',
    categoria: 'Automação',
    resumo: 'Sistemas inteligentes de marcações e reservas automatizadas.',
    intro: 'Seus clientes agendam sozinhos, a qualquer hora, e a sua agenda se organiza no automático.',
    cor: '#6366F1',
    paragrafos: [
      'Implantamos sistemas de agendamento e reservas online sob medida, em que o cliente escolhe data e horário disponíveis sem precisar ligar ou aguardar resposta. Sua agenda fica sempre organizada e atualizada.',
      'Adicionamos lembretes automáticos por WhatsApp/e-mail para reduzir faltas, além de confirmações e reagendamentos — tudo integrado à sua rotina.',
    ],
    beneficios: [
      'Agendamentos 24h, sem ocupar o seu time',
      'Menos faltas com lembretes automáticos',
      'Agenda sempre organizada e sem conflitos',
      'Mais comodidade para o cliente',
    ],
    entregaveis: [
      'Sistema de agendamento/reservas online',
      'Lembretes e confirmações automáticas',
      'Gestão de horários e disponibilidade',
      'Integração com a sua agenda atual',
    ],
    galeria: [
      { icon: CalendarCheck, titulo: 'Reserva online', legenda: 'O cliente agenda sozinho' },
      { icon: Bell, titulo: 'Lembretes', legenda: 'Menos faltas, mais presença' },
      { icon: Calendar, titulo: 'Agenda organizada', legenda: 'Sem conflitos de horário' },
    ],
  },
  {
    slug: 'midias-sociais',
    icon: Megaphone,
    title: 'Mídias Sociais',
    categoria: 'Conteúdo & social',
    resumo: 'Gestão estratégica e produção de conteúdo para as suas redes.',
    intro: 'Redes sociais ativas e estratégicas, com conteúdo que fortalece a marca e aproxima o público.',
    cor: '#7C3AED',
    paragrafos: [
      'Cuidamos da gestão das suas redes sociais de ponta a ponta: planejamento de pautas, criação de conteúdo, design dos posts e calendário de publicações alinhado aos objetivos da sua marca.',
      'Acompanhamos o desempenho, interagimos com a audiência e ajustamos a estratégia para crescer seguidores que realmente importam — e transformá-los em clientes.',
    ],
    beneficios: [
      'Presença constante e profissional nas redes',
      'Conteúdo estratégico, não aleatório',
      'Mais engajamento e proximidade com o público',
      'Marca fortalecida e top of mind',
    ],
    entregaveis: [
      'Planejamento e calendário de conteúdo',
      'Criação de posts (design e textos)',
      'Gestão e publicação nas redes',
      'Relatórios de desempenho',
    ],
    galeria: [
      { icon: Megaphone, titulo: 'Estratégia', legenda: 'Conteúdo com propósito' },
      { icon: ImageIcon, titulo: 'Criação', legenda: 'Posts com design profissional' },
      { icon: BarChart3, titulo: 'Engajamento', legenda: 'Crescimento que vira cliente' },
    ],
  },
  {
    slug: 'consultoria-digital',
    icon: Briefcase,
    title: 'Consultoria Digital',
    categoria: 'Estratégia',
    resumo: 'Mapeamento de processos e estratégia de transformação digital.',
    intro: 'Um plano claro para digitalizar o seu negócio e usar tecnologia com propósito e retorno.',
    cor: '#4F46E5',
    paragrafos: [
      'Analisamos os processos e a presença digital da sua empresa para identificar gargalos, oportunidades e prioridades. A partir daí, montamos um plano de transformação digital realista e orientado a resultado.',
      'Você ganha clareza sobre o que automatizar, quais ferramentas adotar e por onde começar — com acompanhamento para tirar o plano do papel sem desperdiçar investimento.',
    ],
    beneficios: [
      'Visão clara do que digitalizar primeiro',
      'Decisões de tecnologia com base em estratégia',
      'Processos mais enxutos e produtivos',
      'Investimento direcionado para o que dá retorno',
    ],
    entregaveis: [
      'Diagnóstico de processos e maturidade digital',
      'Plano de transformação digital priorizado',
      'Recomendação de ferramentas e automações',
      'Acompanhamento da execução',
    ],
    galeria: [
      { icon: Lightbulb, titulo: 'Diagnóstico', legenda: 'Onde estão os gargalos' },
      { icon: Workflow, titulo: 'Plano de ação', legenda: 'Prioridades claras' },
      { icon: Rocket, titulo: 'Execução', legenda: 'Do plano ao resultado' },
    ],
  },
];

export function getServico(slug) {
  return servicos.find((s) => s.slug === slug);
}
