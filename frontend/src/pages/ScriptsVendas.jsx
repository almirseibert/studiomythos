import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { Phone, ChevronDown, ChevronUp } from 'lucide-react';

// ── Nichos ────────────────────────────────────────────────────────────────────
const NICHOS = [
  { id: 'lava',        emoji: '🚗', nome: 'Lava-rápido',         srv: 'Agendamento + App' },
  { id: 'clinica',     emoji: '🏥', nome: 'Clínica / Saúde',      srv: 'Agendamento + IA + Site' },
  { id: 'restaurante', emoji: '🍽️', nome: 'Restaurante',          srv: 'Site + Redes + Tráfego' },
  { id: 'comercio',    emoji: '🛍️', nome: 'Comércio Local',       srv: 'E-commerce + Tráfego' },
  { id: 'logistica',   emoji: '🚛', nome: 'Transportadora',       srv: 'App Frota + Sistema' },
  { id: 'imobiliaria', emoji: '🏠', nome: 'Imobiliária',          srv: 'Site + CRM + Tráfego' },
  { id: 'academia',    emoji: '💪', nome: 'Academia / Studio',    srv: 'Agendamento + Redes' },
  { id: 'escritorio',  emoji: '📊', nome: 'Escritório Contábil',  srv: 'Sistema + IA + Site' },
  { id: 'prestador',   emoji: '🔧', nome: 'Prestador de Serviço', srv: 'Site + CRM + Redes' },
];

// ── Scripts por nicho ─────────────────────────────────────────────────────────
// type: 'vm' = vendedor, 'cl' = cliente, 'tip' = dica, 'obj' = objeção (title + text)
const SCRIPTS = {
  lava: {
    abertura: [
      { type: 'tip', text: 'Contexto: empresa que agenda lavagens por WhatsApp manual. Mencione o app Meu Lava Rápido!' },
      { type: 'vm', text: 'Boa tarde, aqui é o [Seu Nome], da Studio Mythos, tudo bem? Estou ligando pra falar rapidamente com o responsável pelo lava-rápido [Nome do Estabelecimento]. É possível?' },
      { type: 'cl', text: 'Sou eu mesmo. O que é?' },
      { type: 'vm', text: 'Perfeito, [Nome]! Desenvolvemos soluções digitais especialmente para lava-rápidos, e vi que o seu estabelecimento ainda não tem agendamento online. Tenho só 2 minutinhos com você?' },
      { type: 'vm', text: 'A maioria dos lava-rápidos que atendemos perdia cliente porque a agenda estava cheia e não conseguia atender quem ligava. Com o nosso sistema, o próprio cliente agenda pelo celular, escolhe o serviço e o horário — e você para de perder venda. Faz sentido pra você?' },
    ],
    interesse: [
      { type: 'vm', text: 'Me conta, [Nome] — hoje como os seus clientes agendam a lavagem? É por telefone, WhatsApp ou pessoalmente?' },
      { type: 'cl', text: 'Principalmente WhatsApp mesmo...' },
      { type: 'vm', text: 'Entendi! E já aconteceu de o cliente mandar mensagem e você não ver na hora, aí ele foi pra outro lugar? Isso é muito comum. Imagina se o cliente pudesse agendar sozinho, 24 horas, mesmo enquanto você está atendendo outro carro — sem precisar responder mensagem. A agenda já apareceria organizada no celular. Quanto tempo você acha que perderia a menos por dia?' },
      { type: 'vm', text: 'Além do agendamento, a gente também cria sites com cardápio de serviços e preços — muita gente pesquisa no Google antes de ir. Você tem presença no Google Meu Negócio ou site hoje?' },
    ],
    objecoes: [
      { type: 'obj', title: '"Não tenho dinheiro agora"', text: 'Entendo! Por isso eu queria entender melhor a sua operação antes de falar de valor. Posso te mostrar em 15 minutos como outros lava-rápidos aumentaram o faturamento com agendamento online? Aí você decide se faz sentido.' },
      { type: 'obj', title: '"Já tenho WhatsApp e funciona"', text: 'Ótimo que funciona! A diferença é que com o sistema o cliente agenda sozinho, confirma automaticamente e você recebe o dia cheio organizado — sem você responder nada. É basicamente tempo seu de volta. Vale conhecer?' },
      { type: 'obj', title: '"Não entendo de tecnologia"', text: 'É justamente por isso que a gente faz tudo por você — a gente configura, treina e fica do lado. Você só usa, simples como o WhatsApp. Posso te mostrar numa videochamada de 15 minutinhos?' },
      { type: 'obj', title: '"Deixa eu pensar"', text: 'Claro, sem pressão! Posso te mandar o link do nosso portfólio no WhatsApp agora? Aí você vê com calma e quando quiser conversar é só me chamar.' },
    ],
    fechamento: [
      { type: 'vm', text: '[Nome], faz sentido a gente marcar uma demonstração de 15 minutos — por vídeo, no horário que preferir. Mostro como ficaria o agendamento do seu lava-rápido funcionando de verdade. Qual seria o melhor dia pra você essa semana?' },
      { type: 'vm', text: 'Posso te mandar no WhatsApp o nosso portfólio e um vídeo do sistema — assim você já vê como ficaria antes de a gente conversar. Qual é o seu número pra eu mandar agora?' },
      { type: 'tip', text: 'Após a ligação: "Oi [Nome], aqui é o [Seu Nome] da Studio Mythos! Obrigado pela atenção. Segue o link do nosso portfólio: studiomythos.com.br — qualquer dúvida é só chamar 😊"' },
    ],
  },
  clinica: {
    abertura: [
      { type: 'tip', text: 'Contexto: clínicas perdem pacientes por falta de agendamento online 24h e atendimento lento no WhatsApp.' },
      { type: 'vm', text: 'Boa tarde! Aqui é o [Seu Nome] da Studio Mythos. Estou ligando pra falar com o responsável pela [Nome da Clínica]. Posso falar com você por 2 minutos?' },
      { type: 'vm', text: '[Nome], a gente ajuda clínicas a nunca mais perderem paciente por demora no atendimento. Desenvolvemos sistemas de agendamento online onde o paciente marca a consulta sozinho, 24 horas — e um assistente de IA que responde dúvidas e confirma agendamentos automaticamente. Isso seria útil pra sua clínica?' },
    ],
    interesse: [
      { type: 'vm', text: 'Como funciona hoje o agendamento na clínica? A recepção recebe muito volume de mensagens no WhatsApp?' },
      { type: 'vm', text: 'Você já perdeu paciente por demorar a responder? Com agendamento 24h, o paciente não espera: entra na página, vê os horários disponíveis e confirma. A clínica recebe a notificação e pronto.' },
      { type: 'vm', text: 'Além disso, a gente oferece um assistente de IA treinado com tudo que sua clínica precisa responder — fica disponível às 22h quando a recepção já fechou. Quantos pacientes mandam mensagem fora do horário comercial?' },
    ],
    objecoes: [
      { type: 'obj', title: '"Já temos uma secretária"', text: 'Com certeza, e ela continua essencial! O sistema libera ela das tarefas repetitivas — confirmar consulta, responder "qual o horário disponível?" — pra ela focar no que importa: atender bem quem está na clínica. É produtividade, não substituição.' },
      { type: 'obj', title: '"Usamos um sistema próprio"', text: 'Entendido! A gente pode integrar o agendamento ao sistema que vocês já usam, ou criar solução complementar pra canais digitais. Posso entender melhor como funciona hoje pra sugerir o que faz sentido?' },
      { type: 'obj', title: '"Está caro agora"', text: 'Sem problema. Posso mostrar numa reunião rápida o retorno que clínicas semelhantes tiveram — em média recuperam o investimento com 2 ou 3 pacientes extras por mês. Quinze minutos, sem compromisso?' },
    ],
    fechamento: [
      { type: 'vm', text: '[Nome], posso marcar uma demonstração de 15 minutos — por vídeo ou presencial aqui em Porto Alegre — onde mostro exatamente como ficaria o agendamento e o assistente de IA para a sua clínica. Quando seria melhor pra você?' },
      { type: 'tip', text: 'Follow-up: envie por WhatsApp os links studiomythos.com.br/servicos/agendamento-online e studiomythos.com.br/servicos/ia-humanizada' },
    ],
  },
  restaurante: {
    abertura: [
      { type: 'tip', text: 'Contexto: restaurantes perdem clientes sem presença no Google e sem redes sociais profissionais.' },
      { type: 'vm', text: 'Boa tarde! Aqui é o [Seu Nome] da Studio Mythos. Posso falar com o responsável pelo [Nome do Restaurante]? São só 2 minutinhos!' },
      { type: 'vm', text: '[Nome], a gente ajuda restaurantes a aparecerem no Google pra quem está procurando onde comer na região. Criamos sites com cardápio digital, gestão de redes sociais e campanhas no Instagram e Google. Muitos restaurantes perdem clientes porque não aparecem nas buscas — faz sentido falar sobre isso?' },
    ],
    interesse: [
      { type: 'vm', text: 'Quando alguém pesquisa "[tipo de culinária] perto de mim" no Google, o seu restaurante aparece? Tem site ou é só o iFood?' },
      { type: 'vm', text: 'O iFood cobra de 12% a 30% por pedido. Com site próprio e anúncios no Instagram, você recebe o pedido direto — sem comissão. Quanto você paga de comissão por mês, mais ou menos?' },
      { type: 'vm', text: 'A gente cria o site com cardápio digital integrado ao WhatsApp pra receber pedido direto, e faz gestão das redes com posts estratégicos toda semana. É exatamente o que falta pra você aparecer antes da concorrência.' },
    ],
    objecoes: [
      { type: 'obj', title: '"Já tenho Instagram"', text: 'Ótimo ter Instagram! Mas tem alguém gerenciando estrategicamente, analisando o que funciona, criando conteúdo com frequência e rodando anúncio pago? A diferença entre um Instagram amador e profissional é quanto dinheiro ele traz todo mês.' },
      { type: 'obj', title: '"Estou no iFood, não preciso de site"', text: 'O iFood é ótimo pra descoberta, mas você paga comissão em todo pedido. Com site próprio + anúncio, o cliente que já te conhece pede direto com você — sem comissão. É complementar, não excludente.' },
    ],
    fechamento: [
      { type: 'vm', text: '[Nome], posso te mandar no WhatsApp exemplos de sites de restaurante que a gente fez? Aí você vê o estilo e a gente marca 20 minutos pra conversar. Qual é o seu WhatsApp?' },
    ],
  },
  comercio: {
    abertura: [
      { type: 'tip', text: 'Contexto: comércio local sem loja virtual perde vendas para concorrentes online.' },
      { type: 'vm', text: 'Boa tarde, aqui é o [Seu Nome] da Studio Mythos! Posso falar com o dono(a) da [Nome da Loja]? Tenho uma informação importante sobre vendas online pra compartilhar.' },
      { type: 'vm', text: '[Nome], a gente cria lojas virtuais profissionais pra comércio local — pra você vender pelo seu site, no Instagram, e receber pelo Pix ou cartão, sem depender de marketplaces que cobram comissão. Hoje você vende online de alguma forma?' },
    ],
    interesse: [
      { type: 'vm', text: 'Seus concorrentes já têm loja online? Quando alguém pesquisa "[produto] em [cidade]" no Google, aparece quem tem site — quem não tem fica invisível.' },
      { type: 'vm', text: 'Com uma loja virtual, você vende 24 horas — mesmo quando a loja física está fechada. Imagina receber pedidos de madrugada e acordar com vendas feitas automaticamente. Além disso, podemos rodar anúncios no Facebook e Instagram pra trazer cliente direto.' },
    ],
    objecoes: [
      { type: 'obj', title: '"Tenho medo de não saber mexer"', text: 'A gente entrega tudo pronto e treinado — você gerencia por um painel simples, parecido com o Instagram. E nosso suporte fica disponível pra qualquer dúvida.' },
      { type: 'obj', title: '"Já tenho página no Instagram"', text: 'Instagram é ótimo pra engajamento, mas sem loja virtual você depende de cada cliente ir te chamar no direct. Com e-commerce, o pedido chega automaticamente com pagamento já feito. É outra escala de venda.' },
    ],
    fechamento: [
      { type: 'vm', text: 'Posso te mandar exemplos de lojas virtuais que a gente criou? Você vê o estilo e a gente conversa sobre o seu negócio. Qual o seu WhatsApp?' },
    ],
  },
  logistica: {
    abertura: [
      { type: 'tip', text: 'Contexto: transportadoras controlam frota em planilha, perdem dinheiro com manutenções não planejadas.' },
      { type: 'vm', text: 'Boa tarde! Aqui é o [Seu Nome] da Studio Mythos. Posso falar com o responsável pela frota da [Nome da Empresa]?' },
      { type: 'vm', text: '[Nome], a gente desenvolveu um aplicativo de Gestão de Frota para transportadoras — controle de veículos, motoristas, abastecimentos, manutenções preventivas e documentos tudo num app mobile. Hoje vocês controlam a frota em planilha ou sistema?' },
    ],
    interesse: [
      { type: 'vm', text: 'Já aconteceu de um veículo parar porque a manutenção foi esquecida ou o documento venceu? Isso gera prejuízo enorme — multa, reboque, entrega atrasada. O nosso app avisa com antecedência tudo que está vencendo.' },
      { type: 'vm', text: 'O motorista faz o checklist de inspeção direto pelo celular antes de sair — e o gestor vê tudo em tempo real. Quantos veículos tem na frota de vocês hoje?' },
    ],
    objecoes: [
      { type: 'obj', title: '"Já usamos planilha e funciona"', text: 'A planilha funciona enquanto é pequena, mas quando cresce fica impossível de controlar — qualquer erro custa caro. O app é mais simples de usar do que planilha e ainda avisa automaticamente sobre vencimentos. Vale conhecer em 15 minutos?' },
    ],
    fechamento: [
      { type: 'vm', text: '[Nome], posso te mostrar uma demonstração do Gestão de Frota em 15 minutinhos por vídeo? Você vê o app funcionando de verdade e a gente conversa sobre o tamanho da frota de vocês. Quando seria possível?' },
    ],
  },
  imobiliaria: {
    abertura: [
      { type: 'tip', text: 'Contexto: imobiliárias perdem leads sem site profissional e sem CRM para gestão de negociações.' },
      { type: 'vm', text: 'Boa tarde! Aqui é o [Seu Nome] da Studio Mythos. Posso falar com o corretor(a) responsável pela [Nome da Imobiliária]?' },
      { type: 'vm', text: '[Nome], a gente ajuda imobiliárias a captar mais leads pelo Google e organizar todas as negociações num CRM — pra nenhum cliente interessado cair no esquecimento. Hoje como vocês organizam o funil de vendas?' },
    ],
    interesse: [
      { type: 'vm', text: 'Você já perdeu venda porque um cliente com interesse sumiu e não foi feito o follow-up na hora certa? Com um CRM para imobiliária, o sistema lembra o corretor de ligar, manda mensagem automática e mostra onde está cada negociação.' },
      { type: 'vm', text: 'Além do CRM, a gente cria sites com catálogo de imóveis profissional e roda campanhas no Google e Instagram pra atrair comprador qualificado. Hoje onde chegam a maioria dos leads de vocês?' },
    ],
    objecoes: [
      { type: 'obj', title: '"Usamos o ZAP/OLX"', text: 'Ótimos portais! Mas você depende deles e paga por cada anúncio. Com site próprio no Google, o lead chega direto pra você, sem intermediário — e o custo por lead tende a ser muito menor a médio prazo.' },
    ],
    fechamento: [
      { type: 'vm', text: 'Posso te mostrar num encontro rápido de 20 minutos como o CRM e o site funcionariam pra imobiliária de vocês? Quando seria o melhor horário?' },
    ],
  },
  academia: {
    abertura: [
      { type: 'tip', text: 'Contexto: academias perdem alunos por falta de agendamento de aulas e comunicação digital fraca.' },
      { type: 'vm', text: 'Boa tarde! Aqui é o [Seu Nome] da Studio Mythos. Posso falar com o responsável pela [Nome da Academia]?' },
      { type: 'vm', text: '[Nome], a gente ajuda academias e estúdios fitness a automatizar o agendamento de aulas e fortalecer a presença digital — pra atrair alunos novos e reter quem já está. Hoje como os alunos agendam aulas ou avaliações?' },
    ],
    interesse: [
      { type: 'vm', text: 'Com agendamento online, o aluno marca a aula experimental ou avaliação sozinho — 24 horas, pelo celular. Você para de perder interessado que não conseguiu marcar fora do horário comercial.' },
      { type: 'vm', text: 'A gente também faz gestão de redes sociais pra academia — conteúdo de motivação, resultados de alunos, promoções — e roda anúncio no Instagram pra atrair aluno novo na região. Quanto você investe hoje em captação de alunos?' },
    ],
    objecoes: [
      { type: 'obj', title: '"Usamos grupo de WhatsApp"', text: 'Grupo funciona pra comunicação, mas não pra agendamento organizado. Quando tem 30 pessoas querendo agendar ao mesmo tempo, fica um caos. O sistema organiza tudo automaticamente e você foca no treino, não na agenda.' },
    ],
    fechamento: [
      { type: 'vm', text: '[Nome], posso te mostrar em 15 minutos como ficaria o sistema de agendamento pra sua academia? É por vídeo mesmo, bem rápido. Quando você teria disponibilidade essa semana?' },
    ],
  },
  escritorio: {
    abertura: [
      { type: 'tip', text: 'Contexto: escritórios contábeis com processos manuais perdem produtividade e não se diferenciam digitalmente.' },
      { type: 'vm', text: 'Boa tarde! Aqui é o [Seu Nome] da Studio Mythos. Posso falar com o sócio ou responsável pelo escritório [Nome]?' },
      { type: 'vm', text: '[Nome], a gente ajuda escritórios contábeis a digitalizar processos internos e ter presença profissional que atrai cliente novo pelo Google. Vocês têm site hoje e recebem contato de novos clientes por lá?' },
    ],
    interesse: [
      { type: 'vm', text: 'A maioria dos escritórios que atendemos recebia cliente só por indicação. Com site bem feito e SEO, é possível aparecer quando um empresário pesquisa "escritório contábil em [cidade]" — e o contato chega automaticamente.' },
      { type: 'vm', text: 'A gente também desenvolve sistemas internos pra digitalizar a troca de documentos com clientes — sem e-mail bagunçado ou pasta de Dropbox improvisada. Isso já foi uma dor no escritório de vocês?' },
    ],
    objecoes: [
      { type: 'obj', title: '"A maioria dos clientes vem por indicação"', text: 'Indicação é ouro — e vai continuar vindo. Mas e o cliente que não tem ninguém pra indicar vocês? Ele vai no Google, e se não achar o escritório de vocês, vai pro concorrente. Site e SEO complementam a indicação sem substituir.' },
    ],
    fechamento: [
      { type: 'vm', text: 'Posso te mandar exemplos de sites que fizemos pra escritórios contábeis? E se fizer sentido, a gente marca 20 minutos pra entender o que faz sentido pra vocês. Qual seu WhatsApp?' },
    ],
  },
  prestador: {
    abertura: [
      { type: 'tip', text: 'Contexto: eletricistas, encanadores, pintores, etc. perdem cliente por falta de site e presença no Google.' },
      { type: 'vm', text: 'Boa tarde! Aqui é o [Seu Nome] da Studio Mythos. Estou falando com o [Nome/Empresa]? Tenho 2 minutinhos pra te mostrar como aparecer pra mais clientes que procuram o seu serviço no Google.' },
      { type: 'vm', text: '[Nome], hoje quando alguém pesquisa "[seu serviço] em [cidade]" no Google, você aparece? Porque quem aparece recebe o contato antes de todo mundo — e a gente cria sites profissionais pra prestadores aparecerem nessa busca.' },
    ],
    interesse: [
      { type: 'vm', text: 'Com um site profissional com fotos dos seus serviços, avaliações de clientes e botão de WhatsApp, você recebe contato de quem está ativamente procurando o que você faz — cliente quente, não indicação aleatória.' },
      { type: 'vm', text: 'A gente também pode gerenciar seu Instagram mostrando seus trabalhos — isso gera autoridade e faz o cliente confiar antes de te contratar. Você já pensa nisso mas não tem tempo de fazer?' },
    ],
    objecoes: [
      { type: 'obj', title: '"Tenho serviço suficiente por indicação"', text: 'Que ótimo! Mas e quando der uma baixa, ou você quiser crescer e contratar alguém? Presença digital é o fundo de reserva de cliente — quando a indicação cair, você tem outro canal funcionando. Vale construir isso enquanto está bem.' },
      { type: 'obj', title: '"Site é caro"', text: 'O nosso site pra prestador começa por um valor acessível e se paga com 1 serviço fechado que veio do Google. Quanto você cobra num serviço médio? Posso te mostrar em que prazo se paga.' },
    ],
    fechamento: [
      { type: 'vm', text: 'Posso te mandar agora no WhatsApp exemplos de sites que fizemos pra [eletricistas/encanadores/pintores]? Você vê o estilo e a gente conversa rapidinho. Qual é o seu número?' },
    ],
  },
};

// ── Fases do plano de contato ─────────────────────────────────────────────────
const FASES = [
  {
    num: 1, cor: 'bg-indigo-50 text-indigo-700',
    titulo: 'PREPARAÇÃO — Antes de ligar',
    sub: 'Pesquisa, lista e CRM configurado',
    itens: [
      'Liste 20 empresas/dia — use o módulo de Prospecção no mapa do CRM filtrando por categoria e cidade.',
      'Priorize empresas SEM SITE — o CRM já sinaliza "oportunidade SEM SITE" no cadastro do lead.',
      'Pesquise 2 minutos por empresa — nome do dono (Google/LinkedIn/Instagram), segmento e cidade.',
      'Crie o lead no CRM antes de ligar — já com telefone e categoria do nicho.',
      'Selecione o script correto na aba "Scripts por Nicho" conforme o segmento.',
    ],
  },
  {
    num: 2, cor: 'bg-cyan-50 text-cyan-700',
    titulo: 'LIGAÇÃO — Cold Call (5–7 min)',
    sub: 'Apresentação → Dor → Interesse → Próximo passo',
    itens: [
      'Abertura (30 seg) — nome, empresa, motivo objetivo do contato.',
      'Gancho de dor (1 min) — mencione o problema específico do nicho antes de falar de solução.',
      'Proposta de valor (1 min) — o que a Studio Mythos resolve, com resultado concreto.',
      'Pergunta qualificadora (1 min) — descubra se existe orçamento ou urgência.',
      'CTA claro (30 seg) — proponha reunião rápida (15 min) ou portfólio pelo WhatsApp.',
      'Registre no CRM imediatamente após — resultado, próximo passo e data de follow-up.',
    ],
  },
  {
    num: 3, cor: 'bg-emerald-50 text-emerald-700',
    titulo: 'FOLLOW-UP — WhatsApp + E-mail',
    sub: 'Cadência de 3 toques em 7 dias',
    itens: [
      'D+0 (após ligação) — WhatsApp: "Obrigado pela atenção, [Nome]! Segue nosso portfólio: studiomythos.com.br 😊"',
      'D+3 — WhatsApp curto: "Oi [Nome], deu uma olhada no portfólio? Posso tirar alguma dúvida em 10 min esta semana?"',
      'D+7 — E-mail com caso de sucesso do nicho + CTA para agendar demo.',
      'D+14 (reativação) — Se sem resposta, nova ligação com ângulo diferente (outro serviço ou benefício).',
    ],
  },
  {
    num: 4, cor: 'bg-red-50 text-red-700',
    titulo: 'REUNIÃO — Apresentação e proposta',
    sub: 'Google Meet ou presencial — 30 min',
    itens: [
      'Diagnóstico (10 min) — faça perguntas abertas sobre dores atuais e o que já tentaram.',
      'Apresentação (10 min) — mostre 2–3 serviços relevantes ao nicho com exemplos visuais.',
      'Proposta personalizada (5 min) — valor percebido antes do preço.',
      'Fechamento (5 min) — "O que precisaria acontecer para a gente começar?" ou proposta formal em 24h.',
    ],
  },
  {
    num: 5, cor: 'bg-amber-50 text-amber-700',
    titulo: 'MÉTRICAS — Acompanhamento semanal',
    sub: 'Dashboard do CRM + reunião de pipeline',
    itens: [
      'Taxa de contato — meta: 25% das ligações conectadas.',
      'Taxa de agendamento — meta: 20% das conexões viram reunião.',
      'Taxa de proposta — meta: 70% das reuniões geram proposta.',
      'Taxa de fechamento — meta: 30% das propostas fecham.',
      'Revisão semanal — ajuste de nicho ou script conforme dados do CRM.',
    ],
  },
];

const KPIS = [
  { valor: '50',  label: 'Ligações/dia' },
  { valor: '10',  label: 'Conexões/dia' },
  { valor: '10',  label: 'Reuniões/semana' },
  { valor: '10',  label: 'Fechamentos/mês' },
];

const SCRIPT_TABS = [
  { id: 'abertura',   label: 'Abertura' },
  { id: 'interesse',  label: 'Interesse' },
  { id: 'objecoes',   label: 'Objeções' },
  { id: 'fechamento', label: 'Fechamento' },
];

// ── Renderiza uma linha do script ─────────────────────────────────────────────
function ScriptLinha({ linha, i }) {
  if (linha.type === 'tip') {
    return (
      <div key={i} className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-sm text-emerald-700 flex gap-2 leading-relaxed">
        <span className="flex-shrink-0">💡</span>{linha.text}
      </div>
    );
  }
  if (linha.type === 'obj') {
    return (
      <div key={i} className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
        <p className="text-xs font-bold text-red-600 mb-1">{linha.title}</p>
        <p className="text-sm text-red-700 leading-relaxed">{linha.text}</p>
      </div>
    );
  }
  const isVm = linha.type === 'vm';
  return (
    <div key={i}>
      <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${isVm ? 'text-violet-500' : 'text-cyan-500'}`}>
        {isVm ? '🎙 Você (Vendedor)' : '👤 Cliente'}
      </p>
      <div className={`rounded-xl px-4 py-3 text-sm leading-relaxed border-l-4 ${
        isVm
          ? 'bg-violet-50 border border-violet-200 border-l-violet-400 text-slate-700'
          : 'bg-cyan-50 border border-cyan-200 border-l-cyan-400 text-slate-700'
      }`}>
        {linha.text}
      </div>
    </div>
  );
}

// ── Componente principal ───────────────────────────────────────────────────────
export default function ScriptsVendas() {
  const [tab, setTab]             = useState('empresa');
  const [faseAberta, setFaseAberta] = useState(null);
  const [nicho, setNicho]         = useState('lava');
  const [scriptTab, setScriptTab] = useState('abertura');

  const toggleFase = (i) => setFaseAberta(prev => prev === i ? null : i);
  const linhas = (SCRIPTS[nicho] || {})[scriptTab] || [];

  const MAIN_TABS = [
    { id: 'empresa',  label: '📊 Leitura da Empresa' },
    { id: 'plano',    label: '🗺️ Plano de Contato' },
    { id: 'scripts',  label: '📞 Scripts por Nicho' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto custom-scrollbar">

        {/* Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center px-6 shrink-0 sticky top-0 z-10">
          <Phone size={20} className="text-violet-500 mr-3" />
          <h1 className="text-xl font-bold text-slate-800">Scripts de Vendas</h1>
          <span className="ml-3 text-xs font-semibold bg-violet-100 text-violet-700 px-2.5 py-0.5 rounded-full">Prospecção ativa</span>
        </header>

        <div className="p-6 max-w-7xl mx-auto w-full">

          {/* Tabs principais */}
          <div className="flex gap-1 mb-6 border-b border-slate-200">
            {MAIN_TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-4 py-2.5 text-sm font-semibold rounded-t-lg border-b-2 -mb-px transition-all ${
                  tab === t.id
                    ? 'border-violet-500 text-violet-700 bg-violet-50'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* ── TAB 1: EMPRESA ── */}
          {tab === 'empresa' && (
            <div className="space-y-5 dp-fade-up">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <h2 className="text-xs font-bold uppercase tracking-widest text-violet-500 mb-3">🏢 Sobre a Studio Mythos</h2>
                <div className="space-y-1.5 text-sm text-slate-700">
                  <p>• Agência digital <strong>(Software House & Agência Digital)</strong> sediada em Lajeado (RS)</p>
                  <p>• Atende <strong>pequenas e médias empresas</strong> e startups que precisam de <strong>presença digital, sistemas e automação</strong></p>
                  <p>• WhatsApp: <strong>(51) 98310-8144</strong> · E-mail: <strong>contato@studiomythos.com.br</strong></p>
                  <p>• CRM próprio com <strong>prospecção via mapa</strong> (Google Maps + OpenStreetMap)</p>
                  <p>• Linha de <strong>apps próprios</strong>: Missão Cumprida, Gestão de Frota, Meu Lava Rápido, Check List</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-violet-500 mb-3">🛠️ Portfólio de Serviços (12 linhas)</h2>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Sites & Landing Pages','E-commerce','Apps Mobile','Web Apps & SaaS',
                      'CRM & Automação','Tráfego Pago','SEO & Conteúdo','Identidade Visual',
                      'IA Humanizada','Agendamento Online','Mídias Sociais','Consultoria Digital',
                    ].map(s => (
                      <span key={s} className="bg-violet-50 text-violet-700 border border-violet-200 text-xs px-2.5 py-1 rounded-full font-medium">{s}</span>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-violet-500 mb-3">🎯 Diferenciais Competitivos</h2>
                  <ul className="space-y-1.5 text-sm text-slate-700">
                    {[
                      'Design exclusivo, sem templates genéricos',
                      'Entrega de ponta a ponta (do briefing ao ar)',
                      'IA humanizada integrada ao WhatsApp/site',
                      'Foco em ROI e métricas de resultado',
                      'Sistemas escaláveis na nuvem',
                      'Apps próprios para nichos específicos',
                    ].map(d => (
                      <li key={d} className="flex gap-2"><span className="text-emerald-500 mt-0.5 flex-shrink-0">✓</span>{d}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-violet-500 mb-3">🏆 Nichos Prioritários para Captação</h2>
                  <div className="flex flex-wrap gap-2">
                    {['Lava-rápidos','Clínicas & Saúde','Restaurantes','Comércio local',
                      'Logística & Frota','Imobiliárias','Academias','Contabilidade'].map(n => (
                      <span key={n} className="bg-cyan-50 text-cyan-700 border border-cyan-200 text-xs px-2.5 py-1 rounded-full font-medium">{n}</span>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-violet-500 mb-3">📱 Apps em Desenvolvimento (2026)</h2>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex gap-2"><span className="text-amber-500 flex-shrink-0">●</span><div><strong>Missão Cumprida</strong> — gestão de pedidos e entregas</div></li>
                    <li className="flex gap-2"><span className="text-cyan-500 flex-shrink-0">●</span><div><strong>Gestão de Frota</strong> — controle de frotas corporativas</div></li>
                    <li className="flex gap-2"><span className="text-blue-500 flex-shrink-0">●</span><div><strong>Meu Lava Rápido</strong> — agendamento automotivo</div></li>
                    <li className="flex gap-2"><span className="text-emerald-500 flex-shrink-0">●</span><div><strong>Check List</strong> — inspeção de frota mobile</div></li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* ── TAB 2: PLANO ── */}
          {tab === 'plano' && (
            <div className="space-y-5 dp-fade-up">
              <div className="bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-200 rounded-2xl p-5">
                <p className="font-bold text-violet-800 text-sm mb-1">🎯 Estratégia: Cold Call → Qualificação → Proposta → Fechamento</p>
                <p className="text-sm text-violet-600">Ciclo de prospecção ativa por telefone com follow-up por WhatsApp. Meta: 5 reuniões/semana por vendedor.</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {KPIS.map(k => (
                  <div key={k.label} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 text-center">
                    <div className="text-3xl font-extrabold text-violet-600">{k.valor}</div>
                    <div className="text-xs text-slate-500 mt-1">{k.label}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                {FASES.map((f, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <button
                      onClick={() => toggleFase(i)}
                      className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-slate-50 transition-colors"
                    >
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${f.cor}`}>{f.num}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800 text-sm">{f.titulo}</p>
                        <p className="text-xs text-slate-500">{f.sub}</p>
                      </div>
                      {faseAberta === i
                        ? <ChevronUp size={16} className="text-slate-400 flex-shrink-0" />
                        : <ChevronDown size={16} className="text-slate-400 flex-shrink-0" />}
                    </button>
                    {faseAberta === i && (
                      <div className="px-5 pb-4 space-y-2 border-t border-slate-100 pt-3">
                        {f.itens.map((item, j) => (
                          <p key={j} className="text-sm text-slate-600 flex gap-2 leading-relaxed">
                            <span className="text-violet-400 mt-0.5 flex-shrink-0">›</span>{item}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── TAB 3: SCRIPTS ── */}
          {tab === 'scripts' && (
            <div className="dp-fade-up space-y-5">

              {/* Seletor de nicho */}
              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2">
                {NICHOS.map(n => (
                  <button
                    key={n.id}
                    onClick={() => { setNicho(n.id); setScriptTab('abertura'); }}
                    className={`rounded-xl border p-2.5 text-center transition-all ${
                      nicho === n.id
                        ? 'border-violet-500 bg-violet-50 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-violet-300 hover:bg-violet-50/50'
                    }`}
                  >
                    <div className="text-xl mb-1">{n.emoji}</div>
                    <div className={`text-[11px] font-semibold leading-tight ${nicho === n.id ? 'text-violet-700' : 'text-slate-700'}`}>{n.nome}</div>
                    <div className="text-[9px] text-slate-400 mt-0.5 hidden lg:block">{n.srv}</div>
                  </button>
                ))}
              </div>

              {/* Script box */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Script tab bar */}
                <div className="flex border-b border-slate-200 bg-slate-50">
                  {SCRIPT_TABS.map(t => (
                    <button
                      key={t.id}
                      onClick={() => setScriptTab(t.id)}
                      className={`px-5 py-3 text-xs font-semibold transition-all border-b-2 -mb-px ${
                        scriptTab === t.id
                          ? 'border-violet-500 text-violet-700 bg-white'
                          : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-white/60'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                {/* Script lines */}
                <div className="p-5 space-y-3">
                  {linhas.length > 0
                    ? linhas.map((linha, i) => <ScriptLinha key={i} linha={linha} i={i} />)
                    : <p className="text-sm text-slate-400 text-center py-8">Script em desenvolvimento para este nicho.</p>
                  }
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
