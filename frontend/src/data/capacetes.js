// ============================================================================
// MARCA DE CAPACETES — configuração editável (cliente separado do Studio Mythos)
// ----------------------------------------------------------------------------
// Tudo o que aparece na sub-página /capacetes e no customizador /capacetes/personalizar
// é controlado por este arquivo. Para rebrandar, troque MARCA (nome/cores) e as listas.
// ============================================================================

export const MARCA = {
  nome: 'ALLBLACK',
  nomeCompleto: 'ALLBLACK MOTOS',
  tagline: 'O capacete dos seus sonhos, do seu jeito.',
  descricao:
    'Capacetes personalizados sob medida: você escolhe a cor, a viseira e os grafismos, e nós montamos exatamente como você imaginou. Segurança certificada, acabamento premium e a sua identidade na pista.',
  // Paleta da MARCA (distinta da identidade do Studio Mythos)
  cores: {
    primaria: '#DC2626', // vermelho corrida
    escura: '#0B0B0F',   // carbono / all black
    clara: '#F4F4F5',
    destaque: '#FACC15', // amarelo
  },
  whatsapp: '5551983108144',
  instagram: '@allblackmotos',
  email: 'contato@allblackmotos.com.br',
};

// Preço base do capacete personalizado (em R$)
export const PRECO_BASE = 590;

// ---------------------------------------------------------------------------
// Paleta de COR BASE do casco (recolore o capacete ao vivo)
// ---------------------------------------------------------------------------
export const CORES_BASE = [
  { id: 'vermelho', nome: 'Vermelho Corrida', hex: '#DC2626' },
  { id: 'preto', nome: 'Preto Fosco', hex: '#18181B' },
  { id: 'branco', nome: 'Branco Perolado', hex: '#FAFAFA' },
  { id: 'azul', nome: 'Azul Elétrico', hex: '#2563EB' },
  { id: 'ciano', nome: 'Ciano Voltage', hex: '#06B6D4' },
  { id: 'verde', nome: 'Verde Neon', hex: '#16A34A' },
  { id: 'amarelo', nome: 'Amarelo Raia', hex: '#FACC15' },
  { id: 'laranja', nome: 'Laranja Fogo', hex: '#F97316' },
  { id: 'rosa', nome: 'Rosa Pink', hex: '#EC4899' },
  { id: 'roxo', nome: 'Roxo Profundo', hex: '#7C3AED' },
  { id: 'grafite', nome: 'Grafite', hex: '#475569' },
  { id: 'vinho', nome: 'Vinho', hex: '#7F1D1D' },
];

// ---------------------------------------------------------------------------
// VISEIRAS — tipo controla como o HelmetSVG renderiza:
//  'vidro'   -> camada translúcida com `tint`
//  'solido'  -> cor opaca (branca/preta)
//  'cromada' -> gradiente metálico (stops)
// ---------------------------------------------------------------------------
export const VISEIRAS = [
  { id: 'transparente', nome: 'Transparente', tipo: 'vidro', tint: 'rgba(186,230,253,0.28)', extra: 0 },
  { id: 'fume', nome: 'Fumê', tipo: 'vidro', tint: 'rgba(30,41,59,0.55)', extra: 40 },
  { id: 'preta', nome: 'Preta', tipo: 'solido', cor: '#0A0A0A', extra: 60 },
  { id: 'branca', nome: 'Branca', tipo: 'solido', cor: '#F8FAFC', extra: 60 },
  { id: 'cromada', nome: 'Cromada (Prata)', tipo: 'cromada', stops: ['#e2e8f0', '#94a3b8', '#cbd5e1', '#64748b'], extra: 120 },
  { id: 'cromada-azul', nome: 'Cromada Azul', tipo: 'cromada', stops: ['#bae6fd', '#3b82f6', '#93c5fd', '#1d4ed8'], extra: 140 },
];

// ---------------------------------------------------------------------------
// GRAFISMOS / adesivos / pinturas sobrepostos ao casco
// (o HelmetSVG conhece os ids: nenhum, faixa, linhas, chamas, raio, carbono)
// ---------------------------------------------------------------------------
export const GRAFISMOS = [
  { id: 'nenhum', nome: 'Sem grafismo', extra: 0 },
  { id: 'faixa', nome: 'Faixa central', extra: 90 },
  { id: 'linhas', nome: 'Linhas duplas', extra: 90 },
  { id: 'chamas', nome: 'Chamas', extra: 140 },
  { id: 'raio', nome: 'Raio', extra: 120 },
  { id: 'carbono', nome: 'Carbono', extra: 160 },
];

// Cores de DESTAQUE para o grafismo
export const CORES_GRAFISMO = [
  { id: 'branco', nome: 'Branco', hex: '#FFFFFF' },
  { id: 'preto', nome: 'Preto', hex: '#0A0A0A' },
  { id: 'amarelo', nome: 'Amarelo', hex: '#FACC15' },
  { id: 'vermelho', nome: 'Vermelho', hex: '#EF4444' },
  { id: 'ciano', nome: 'Ciano', hex: '#22D3EE' },
  { id: 'prata', nome: 'Prata', hex: '#CBD5E1' },
  { id: 'dourado', nome: 'Dourado', hex: '#D4AF37' },
  { id: 'verde', nome: 'Verde', hex: '#22C55E' },
];

// ---------------------------------------------------------------------------
// TAMANHOS (circunferência da cabeça em cm)
// ---------------------------------------------------------------------------
export const TAMANHOS = [
  { id: '53-54', nome: '53/54 — PP' },
  { id: '55-56', nome: '55/56 — P' },
  { id: '57-58', nome: '57/58 — M' },
  { id: '59-60', nome: '59/60 — G' },
  { id: '61-62', nome: '61/62 — GG' },
  { id: '63-64', nome: '63/64 — XGG' },
];

// ---------------------------------------------------------------------------
// MODELOS (delta de preço sobre o PRECO_BASE)
// ---------------------------------------------------------------------------
export const MODELOS = [
  { id: 'fechado', nome: 'Fechado (Full Face)', delta: 0, desc: 'Proteção total, ideal para alta velocidade.' },
  { id: 'articulado', nome: 'Articulado (Escamoteável)', delta: 180, desc: 'Queixeira que abre — versátil para o dia a dia.' },
  { id: 'aberto', nome: 'Aberto', delta: -60, desc: 'Leve e arejado para a cidade.' },
];

// Combos prontos exibidos na galeria da landing
export const ESTILOS = [
  { nome: 'Race Red', corBase: '#DC2626', viseira: 'cromada', grafismo: 'faixa', corGrafismo: '#FFFFFF' },
  { nome: 'Stealth', corBase: '#18181B', viseira: 'fume', grafismo: 'carbono', corGrafismo: '#0A0A0A' },
  { nome: 'Voltage', corBase: '#06B6D4', viseira: 'cromada-azul', grafismo: 'raio', corGrafismo: '#0A0A0A' },
  { nome: 'Inferno', corBase: '#0A0A0A', viseira: 'preta', grafismo: 'chamas', corGrafismo: '#F97316' },
  { nome: 'Ghost', corBase: '#FAFAFA', viseira: 'transparente', grafismo: 'linhas', corGrafismo: '#DC2626' },
  { nome: 'Neon Strike', corBase: '#16A34A', viseira: 'fume', grafismo: 'raio', corGrafismo: '#FACC15' },
];

// Helpers de lookup
export const acharViseira = (id) => VISEIRAS.find((v) => v.id === id) || VISEIRAS[0];
export const acharGrafismo = (id) => GRAFISMOS.find((g) => g.id === id) || GRAFISMOS[0];
export const acharModelo = (id) => MODELOS.find((m) => m.id === id) || MODELOS[0];

// Calcula o preço final a partir da configuração escolhida
export function calcularPreco({ viseira, grafismo, modelo }) {
  const v = acharViseira(viseira)?.extra || 0;
  const g = acharGrafismo(grafismo)?.extra || 0;
  const m = acharModelo(modelo)?.delta || 0;
  return PRECO_BASE + v + g + m;
}
