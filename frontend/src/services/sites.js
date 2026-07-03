// Base URL onde os sites publicados pelo painel são servidos pelo backend.
// Deriva de VITE_API_URL removendo o sufixo "/api": os arquivos ficam em /sites/<slug>/.
// Ex.: https://studiomythos-backend.../api  ->  https://studiomythos-backend.../sites/<slug>/
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
export const SITES_BASE = API_URL.replace(/\/api\/?$/, '') + '/sites';

// URL pública de um projeto (card) — link externo ou site hospedado.
export function urlDoProjeto(p) {
  if (p.tipo === 'link') return p.url_externa;
  const entrada = p.arquivo_entrada && p.arquivo_entrada !== 'index.html' ? p.arquivo_entrada : '';
  return `${SITES_BASE}/${p.slug}/${entrada}`;
}
