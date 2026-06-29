// ============================================================================
// CENTRAL DE APLICATIVOS — Studio Mythos
// ----------------------------------------------------------------------------
// Cada app publicado pela organização tem uma subpágina pública em /apps/:slug
// contendo tudo que a Google Play / App Store exigem: descrição, política de
// privacidade, termos de uso e suporte.
//
// Para adicionar um app: copie um objeto do array `apps` e edite os campos.
// Se `politicaPrivacidade` ou `termos` ficarem vazios, a página gera um texto
// padrão (compatível com a Play Store) a partir dos dados do app.
// ============================================================================

export const STUDIO = {
  nome: 'Studio Mythos',
  razaoSocial: 'Studio Mythos',
  email: 'contato@studiomythos.com.br',
  suporteEmail: 'suporte@studiomythos.com.br',
  site: 'https://studiomythos.com.br',
};

export const apps = [
  {
    slug: 'missao-cumprida',
    nome: 'Missão Cumprida',
    inicial: 'M',
    cor: '#4F46E5',
    categoria: 'Produtividade / Logística',
    tagline: 'Gestão de pedidos e entregas na palma da mão.',
    descricao:
      'O Missão Cumprida conecta a operação de pedidos e entregas em um só lugar: criação de pedidos, acompanhamento em tempo real e organização da rotina de entregas para equipes e prestadores.',
    funcionalidades: [
      'Criação e acompanhamento de pedidos',
      'Organização de entregas e rotas',
      'Status em tempo real',
      'Histórico e relatórios',
    ],
    coletaDados: ['Nome', 'E-mail', 'Localização aproximada (para entregas)'],
    plataformas: ['Android', 'iOS'],
    lancamento: '2026',
    playStoreUrl: '',
    appStoreUrl: '',
    site: '',
    suporte: { email: 'suporte@studiomythos.com.br', telefone: '' },
    publicado: false, // true quando estiver no ar nas lojas
    // politicaPrivacidade: '',  // deixe vazio para usar o template padrão
    // termos: '',
  },
  {
    slug: 'gestao-de-frota',
    nome: 'Gestão de Frota',
    inicial: 'GF',
    cor: '#0EA5E9',
    categoria: 'Logística / Frotas',
    tagline: 'Controle completo da frota da MAK Serviços.',
    descricao:
      'O Gestão de Frota é o aplicativo da MAK Serviços para administrar toda a frota da empresa em um só lugar: veículos, motoristas, abastecimentos, manutenções, documentos e custos. Mantém a operação organizada, reduz paradas inesperadas e dá visão clara dos gastos de cada veículo.',
    funcionalidades: [
      'Cadastro de veículos e motoristas',
      'Controle de abastecimentos e custos',
      'Agenda de manutenções preventivas e corretivas',
      'Documentos e vencimentos (licenciamento, seguro)',
      'Indicadores e relatórios da frota',
    ],
    coletaDados: ['Nome', 'E-mail', 'Dados dos veículos', 'Localização aproximada (para operação da frota)'],
    plataformas: ['Android', 'iOS'],
    lancamento: '2026',
    playStoreUrl: '',
    appStoreUrl: '',
    site: '',
    suporte: { email: 'suporte@studiomythos.com.br', telefone: '' },
    publicado: false,
  },
  {
    slug: 'meu-lava-rapido',
    nome: 'Meu Lava Rápido',
    inicial: 'LR',
    cor: '#2563EB',
    categoria: 'Automotivo / Serviços',
    tagline: 'Agende e gerencie lavagens automotivas.',
    descricao:
      'O Meu Lava Rápido é o aplicativo de lavagem automotiva que conecta o cliente ao lava-rápido: agendamento de horários, escolha do tipo de lavagem, acompanhamento do serviço e histórico de atendimentos. Para o estabelecimento, organiza a fila, os horários e o controle dos serviços prestados.',
    funcionalidades: [
      'Agendamento de lavagens por horário',
      'Catálogo de serviços e valores',
      'Acompanhamento do status do serviço',
      'Histórico de lavagens e clientes',
      'Gestão de fila e agenda do lava-rápido',
    ],
    coletaDados: ['Nome', 'E-mail', 'Telefone', 'Dados do veículo'],
    plataformas: ['Android', 'iOS'],
    lancamento: '2026',
    playStoreUrl: '',
    appStoreUrl: '',
    site: '',
    suporte: { email: 'suporte@studiomythos.com.br', telefone: '' },
    exclusaoUrl: 'https://studiomythos.com.br/apps/exclusao-conta',
    publicado: false,
  },
  {
    slug: 'check-list',
    nome: 'Check List',
    inicial: 'CL',
    cor: '#059669',
    categoria: 'Frotas / Inspeção',
    tagline: 'Checklist de inspeção de frota na palma da mão.',
    descricao:
      'O Check List é o aplicativo de checklist de frota: o motorista faz a inspeção do veículo direto pelo celular, registrando itens de segurança, fotos e ocorrências antes de cada viagem. Garante a conformidade da frota, cria um histórico de vistorias e antecipa problemas antes que virem prejuízo.',
    funcionalidades: [
      'Checklists de inspeção personalizáveis',
      'Registro de fotos e ocorrências',
      'Vistoria de saída e retorno do veículo',
      'Histórico de inspeções por veículo',
      'Alertas de itens reprovados',
    ],
    coletaDados: ['Nome', 'E-mail', 'Dados dos veículos', 'Fotos das inspeções'],
    plataformas: ['Android', 'iOS'],
    lancamento: '2026',
    playStoreUrl: '',
    appStoreUrl: '',
    site: '',
    suporte: { email: 'suporte@studiomythos.com.br', telefone: '' },
    publicado: false,
  },
];

export function getApp(slug) {
  return apps.find((a) => a.slug === slug);
}

const hoje = () =>
  new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

// Política de privacidade padrão (PT-BR, compatível com Google Play / LGPD)
export function politicaPadrao(app) {
  const dados = (app.coletaDados && app.coletaDados.length)
    ? app.coletaDados.map((d) => `• ${d}`).join('\n')
    : '• Este aplicativo não coleta dados pessoais identificáveis.';
  return `Última atualização: ${hoje()}

Esta Política de Privacidade descreve como o aplicativo "${app.nome}", desenvolvido e mantido por ${STUDIO.nome}, trata as informações dos seus usuários. Ao utilizar o aplicativo, você concorda com as práticas descritas abaixo.

1. DADOS QUE COLETAMOS
Para o funcionamento do aplicativo, podemos coletar:
${dados}

2. COMO USAMOS OS DADOS
Os dados são utilizados exclusivamente para: prover e melhorar as funcionalidades do aplicativo, oferecer suporte ao usuário, garantir segurança e cumprir obrigações legais. Não vendemos dados pessoais.

3. COMPARTILHAMENTO
Não compartilhamos seus dados com terceiros, exceto quando necessário para o funcionamento do serviço (provedores de infraestrutura), por exigência legal ou com o seu consentimento.

4. ARMAZENAMENTO E SEGURANÇA
Adotamos medidas técnicas e organizacionais para proteger os dados contra acesso não autorizado, perda ou alteração. Os dados são mantidos apenas pelo tempo necessário às finalidades descritas.

5. SEUS DIREITOS (LGPD)
Você pode solicitar a qualquer momento: confirmação de tratamento, acesso, correção, anonimização, portabilidade e exclusão dos seus dados, bem como revogar o consentimento. Para exercer seus direitos, entre em contato pelo e-mail ${app.suporte?.email || STUDIO.suporteEmail}.

6. CRIANÇAS
O aplicativo não se destina a menores de 13 anos e não coletamos intencionalmente dados de crianças.

7. ALTERAÇÕES
Esta política pode ser atualizada periodicamente. A data da última atualização será sempre indicada no topo deste documento.

8. CONTATO
Em caso de dúvidas sobre esta política ou sobre o tratamento dos seus dados, fale com ${STUDIO.nome}:
E-mail: ${app.suporte?.email || STUDIO.suporteEmail}`;
}

// Termos de uso padrão (PT-BR)
export function termosPadrao(app) {
  return `Última atualização: ${hoje()}

Estes Termos de Uso regem a utilização do aplicativo "${app.nome}", fornecido por ${STUDIO.nome}. Ao baixar, acessar ou usar o aplicativo, você concorda com estes termos.

1. LICENÇA DE USO
Concedemos uma licença limitada, não exclusiva e intransferível para usar o aplicativo para fins pessoais ou profissionais legítimos, conforme estes termos.

2. RESPONSABILIDADES DO USUÁRIO
Você concorda em usar o aplicativo de forma lícita, não violar direitos de terceiros, não tentar burlar mecanismos de segurança e manter a confidencialidade das suas credenciais de acesso.

3. PROPRIEDADE INTELECTUAL
Todo o conteúdo, marca, design e código do aplicativo pertencem a ${STUDIO.nome} e são protegidos por lei. É vedada a reprodução sem autorização.

4. DISPONIBILIDADE
Empenhamo-nos para manter o aplicativo disponível, mas não garantimos funcionamento ininterrupto. Podemos modificar, suspender ou descontinuar funcionalidades a qualquer momento.

5. LIMITAÇÃO DE RESPONSABILIDADE
O aplicativo é fornecido "no estado em que se encontra". Na máxima extensão permitida por lei, ${STUDIO.nome} não se responsabiliza por danos indiretos decorrentes do uso ou da impossibilidade de uso.

6. ALTERAÇÕES DOS TERMOS
Podemos atualizar estes termos periodicamente. O uso continuado após mudanças representa concordância com a nova versão.

7. CONTATO
Dúvidas sobre estes termos: ${app.suporte?.email || STUDIO.suporteEmail}`;
}
