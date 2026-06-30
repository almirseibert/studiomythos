export function formatCurrency(valor) {
  const n = Number(valor) || 0;
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function formatNumber(valor) {
  return (Number(valor) || 0).toLocaleString('pt-BR');
}

export default formatCurrency;
