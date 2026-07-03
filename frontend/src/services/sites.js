// Base URL onde os sites publicados pelo painel são servidos.
// Em produção o nginx do frontend encaminha /sites/ para o backend, então
// usamos o MESMO domínio (studiomythos.com.br/sites/<slug>/). Em dev, o proxy
// do Vite (vite.config.js) encaminha /sites para o backend local.
// Dá para forçar outra origem via VITE_SITES_BASE, se necessário.
export const SITES_BASE = import.meta.env.VITE_SITES_BASE || '/sites';

// URL pública de um projeto (card) — link externo ou site hospedado.
export function urlDoProjeto(p) {
  if (p.tipo === 'link') return p.url_externa;
  const entrada = p.arquivo_entrada && p.arquivo_entrada !== 'index.html' ? p.arquivo_entrada : '';
  return `${SITES_BASE}/${p.slug}/${entrada}`;
}
