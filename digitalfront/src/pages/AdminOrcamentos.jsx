import React, { useEffect, useState } from 'react';
import {
  Receipt, Search, Loader2, X, Printer, Mail, Phone, Tag,
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import HelmetSVG from '../components/HelmetSVG';
import api from '../services/api';
import { isAdmin } from '../services/auth';
import { formatDate, formatDateTime } from '../utils/formatDate';
import { formatCurrency } from '../utils/formatCurrency';
import { Restrito } from './Administracao';

const STATUS = ['Novo', 'Em contato', 'Fechado', 'Cancelado'];
const STATUS_COR = {
  'Novo': 'bg-blue-100 text-blue-700',
  'Em contato': 'bg-amber-100 text-amber-700',
  'Fechado': 'bg-emerald-100 text-emerald-700',
  'Cancelado': 'bg-red-100 text-red-700',
};

export default function AdminOrcamentos() {
  const admin = isAdmin();
  const [lista, setLista] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState('Todos');
  const [sel, setSel] = useState(null);
  const [carregandoDetalhe, setCarregandoDetalhe] = useState(false);

  useEffect(() => { if (admin) carregar(); }, [admin]);

  const carregar = async () => {
    setCarregando(true);
    try {
      const r = await api.get('/admin/orcamentos');
      if (r.data.success) setLista(r.data.data);
    } catch (e) { /* ignore */ } finally { setCarregando(false); }
  };

  const abrir = async (id) => {
    setCarregandoDetalhe(true);
    setSel({ id });
    try {
      const r = await api.get(`/admin/orcamentos/${id}`);
      if (r.data.success) setSel(r.data.data);
    } catch (e) { setSel(null); } finally { setCarregandoDetalhe(false); }
  };

  const mudarStatus = async (status) => {
    if (!sel?.id) return;
    try {
      await api.put(`/admin/orcamentos/${sel.id}/status`, { status });
      setSel((s) => ({ ...s, status }));
      setLista((l) => l.map((x) => (x.id === sel.id ? { ...x, status } : x)));
    } catch (e) { /* ignore */ }
  };

  if (!admin) return <Restrito />;

  const filtrada = lista.filter((c) => {
    const okFiltro = filtro === 'Todos' || c.status === filtro;
    const t = busca.toLowerCase();
    const okBusca = !t || [c.nome, c.email, c.tipo].some((v) => (v || '').toLowerCase().includes(t));
    return okFiltro && okBusca;
  });

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto custom-scrollbar">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center px-6 shrink-0 sticky top-0 z-10">
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2"><Receipt className="text-emerald-600" /> Solicitações de Orçamento</h1>
        </header>

        <div className="p-6 max-w-6xl mx-auto w-full">
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar por nome, e-mail ou tipo…" className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <select value={filtro} onChange={(e) => setFiltro(e.target.value)} className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none">
              <option>Todos</option>{STATUS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {carregando ? (
              <div className="flex justify-center py-20 text-emerald-600"><Loader2 className="animate-spin" size={28} /></div>
            ) : filtrada.length === 0 ? (
              <p className="text-center text-slate-500 py-16">Nenhuma solicitação encontrada.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                      <th className="px-5 py-3 font-semibold">Solicitante</th>
                      <th className="px-5 py-3 font-semibold">Tipo</th>
                      <th className="px-5 py-3 font-semibold">Valor estimado</th>
                      <th className="px-5 py-3 font-semibold">Recebido</th>
                      <th className="px-5 py-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtrada.map((c) => (
                      <tr key={c.id} onClick={() => abrir(c.id)} className="hover:bg-slate-50 cursor-pointer transition-colors">
                        <td className="px-5 py-4">
                          <p className="font-bold text-slate-800">{c.nome}</p>
                          <p className="text-sm text-slate-500">{c.email || c.telefone}</p>
                        </td>
                        <td className="px-5 py-4"><span className="inline-flex items-center gap-1.5 text-sm text-slate-600"><Tag size={13} /> {c.tipo}</span></td>
                        <td className="px-5 py-4 text-sm font-semibold text-emerald-600">{Number(c.valor_estimado) > 0 ? formatCurrency(c.valor_estimado) : '—'}</td>
                        <td className="px-5 py-4 text-sm text-slate-500">{formatDate(c.data_criacao)}</td>
                        <td className="px-5 py-4"><span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_COR[c.status] || 'bg-slate-100 text-slate-600'}`}>{c.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {sel && (
        <DetalheOrcamento dados={sel} carregando={carregandoDetalhe} onClose={() => setSel(null)} onStatus={mudarStatus} />
      )}
    </div>
  );
}

function DetalheOrcamento({ dados, carregando, onClose, onStatus }) {
  const c = dados;
  const cfg = c.dados && typeof c.dados === 'object' ? c.dados : null;
  const ehCapacete = cfg && (cfg.corBase || cfg.viseira);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-end no-print" onClick={onClose}>
      <div className="bg-white w-full max-w-xl h-full overflow-y-auto custom-scrollbar shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between z-10 no-print">
          <div className="flex items-center gap-2">
            <select value={c.status || 'Novo'} onChange={(e) => onStatus(e.target.value)} className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none">
              {STATUS.map((s) => <option key={s}>{s}</option>)}
            </select>
            <button onClick={() => window.print()} className="inline-flex items-center gap-1.5 bg-brand-gradient text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-voltage hover:opacity-95"><Printer size={16} /> Imprimir</button>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700"><X size={22} /></button>
        </div>

        {carregando || !c.nome ? (
          <div className="flex justify-center py-24 text-emerald-600"><Loader2 className="animate-spin" size={28} /></div>
        ) : (
          <div className="print-area p-8 text-slate-800">
            <div className="border-b-2 border-slate-200 pb-5 mb-5">
              <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-600 text-xs font-semibold px-2.5 py-1 rounded-full mb-2"><Tag size={12} /> {c.tipo}</span>
              <h2 className="text-2xl font-black text-slate-900">{c.nome}</h2>
              <div className="flex flex-wrap gap-x-5 gap-y-1 mt-2 text-sm text-slate-600">
                {c.email && <span className="inline-flex items-center gap-1.5"><Mail size={14} /> {c.email}</span>}
                {c.telefone && <span className="inline-flex items-center gap-1.5"><Phone size={14} /> {c.telefone}</span>}
              </div>
              {Number(c.valor_estimado) > 0 && <p className="text-2xl font-black text-emerald-600 mt-3">{formatCurrency(c.valor_estimado)}</p>}
            </div>

            {ehCapacete && (
              <div className="mb-6">
                <div className="bg-zinc-900 rounded-2xl p-3 mb-4">
                  <HelmetSVG corBase={cfg.corBase} viseira={cfg.viseira} grafismo={cfg.grafismo} corGrafismo={cfg.corGrafismo} className="w-full max-w-xs mx-auto" />
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <Spec k="Modelo" v={cfg.modeloNome} />
                  <Spec k="Cor base" v={cfg.corBaseNome} cor={cfg.corBase} />
                  <Spec k="Viseira" v={cfg.viseiraNome} />
                  <Spec k="Grafismo" v={cfg.grafismoNome} />
                  {cfg.grafismo !== 'nenhum' && <Spec k="Cor do grafismo" v={cfg.corGrafismoNome} cor={cfg.corGrafismo} />}
                  <Spec k="Tamanho" v={cfg.tamanhoNome} />
                </div>
              </div>
            )}

            {c.descricao && (
              <div className="mb-6">
                <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500 mb-2">Observações</h3>
                <p className="text-sm text-slate-700 whitespace-pre-wrap">{c.descricao}</p>
              </div>
            )}

            {cfg && !ehCapacete && (
              <div className="mb-6">
                <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500 mb-2">Dados enviados</h3>
                <pre className="text-xs bg-slate-50 border border-slate-200 rounded-lg p-3 overflow-x-auto whitespace-pre-wrap">{JSON.stringify(cfg, null, 2)}</pre>
              </div>
            )}

            <p className="text-xs text-slate-400 mt-8 pt-4 border-t border-slate-100">Recebido em {formatDateTime(c.data_criacao)} · origem: {c.origem || 'Site'}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Spec({ k, v, cor }) {
  if (!v) return null;
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
      <p className="text-xs text-slate-400">{k}</p>
      <p className="font-semibold text-slate-700 flex items-center gap-2">
        {cor && <span className="w-4 h-4 rounded-full border border-slate-300" style={{ background: cor }} />}
        {v}
      </p>
    </div>
  );
}
