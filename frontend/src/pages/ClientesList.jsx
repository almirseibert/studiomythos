import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Phone, Loader2, GlobeLock, Globe, Filter, ChevronRight, Radar } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import api from '../services/api';
import { ESTAGIOS, STATUS_CORES } from './LeadDetail';

export default function ClientesList() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('');
  const [somenteSemSite, setSomenteSemSite] = useState(false);

  useEffect(() => { carregar(); }, []);

  const carregar = async () => {
    try {
      setIsLoading(true);
      const r = await api.get('/leads');
      if (r.data.success) setLeads(r.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const filtrados = useMemo(() => {
    return leads.filter(l => {
      if (filtroStatus && l.status !== filtroStatus) return false;
      if (somenteSemSite && l.possui_website) return false;
      if (busca) {
        const t = busca.toLowerCase();
        return (l.empresa || '').toLowerCase().includes(t) || (l.nome || '').toLowerCase().includes(t) || (l.cidade || '').toLowerCase().includes(t) || (l.categoria || '').toLowerCase().includes(t);
      }
      return true;
    });
  }, [leads, busca, filtroStatus, somenteSemSite]);

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 shrink-0">
          <h1 className="text-xl font-bold text-slate-800">Leads & Clientes</h1>
          <button onClick={() => navigate('/prospeccao')} className="bg-brand-gradient text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-voltage hover:opacity-95 transition">
            <Radar size={18} /> Captar mais
          </button>
        </header>

        <div className="p-4 border-b border-slate-200 bg-white shrink-0 flex flex-col lg:flex-row gap-3 lg:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input value={busca} onChange={e => setBusca(e.target.value)} placeholder="Pesquisar empresa, contato, cidade…" className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50" />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-400"><Filter size={16} /></span>
            <select value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)} className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none">
              <option value="">Todos os estágios</option>
              {ESTAGIOS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <button onClick={() => setSomenteSemSite(v => !v)} className={`px-3 py-2 rounded-lg text-sm font-medium border flex items-center gap-1.5 transition-all ${somenteSemSite ? 'bg-emerald-600 text-white border-transparent' : 'bg-white text-slate-600 border-slate-200'}`}>
              <GlobeLock size={15} /> Só sem site
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6 custom-scrollbar">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            {isLoading ? (
              <div className="flex justify-center items-center h-40 text-indigo-600"><Loader2 className="animate-spin" size={32} /></div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold">
                    <th className="px-6 py-4">Empresa</th>
                    <th className="px-6 py-4 hidden md:table-cell">Categoria</th>
                    <th className="px-6 py-4 hidden lg:table-cell">Contato</th>
                    <th className="px-6 py-4">Vendedor</th>
                    <th className="px-6 py-4">Estágio</th>
                    <th className="px-6 py-4 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtrados.map(l => (
                    <tr key={l.id} onClick={() => navigate(`/leads/${l.id}`)} className="hover:bg-indigo-50/40 transition-colors cursor-pointer">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-brand-gradient flex items-center justify-center text-white font-bold uppercase text-sm">{(l.empresa || l.nome || '?').charAt(0)}</div>
                          <div>
                            <p className="font-semibold text-slate-800 flex items-center gap-1.5">{l.empresa || l.nome}
                              {!l.possui_website ? <GlobeLock size={13} className="text-emerald-500" /> : <Globe size={13} className="text-slate-300" />}
                            </p>
                            <p className="text-xs text-slate-500">{l.cidade || l.origem}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell text-sm text-slate-600">{l.categoria || '—'}</td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        {l.telefone ? <span className="text-sm text-slate-600 flex items-center gap-2"><Phone size={13} className="text-slate-400" /> {l.telefone}</span> : <span className="text-sm text-slate-300">—</span>}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{l.vendedor_nome || <span className="text-slate-300">Sem atribuição</span>}</td>
                      <td className="px-6 py-4"><span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${STATUS_CORES[l.status] || ''}`}>{l.status}</span></td>
                      <td className="px-6 py-4 text-slate-300"><ChevronRight size={16} /></td>
                    </tr>
                  ))}
                  {filtrados.length === 0 && (
                    <tr><td colSpan="6" className="px-6 py-10 text-center text-slate-500">Nenhum lead encontrado. Use a <button onClick={() => navigate('/prospeccao')} className="text-indigo-600 font-medium hover:underline">Prospecção no Mapa</button> para captar.</td></tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
