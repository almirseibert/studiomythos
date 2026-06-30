import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, DollarSign, Briefcase, GlobeLock, Target, Radar, Loader2, TrendingUp, Trophy
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import api from '../services/api';
import { getUser } from '../services/auth';
import { formatCurrency } from '../utils/formatCurrency';
import { ESTAGIOS, STATUS_CORES } from './LeadDetail';

export default function Dashboard() {
  const navigate = useNavigate();
  const [resumo, setResumo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const usuario = getUser();

  useEffect(() => {
    api.get('/relatorios/dashboard')
      .then(r => r.data.success && setResumo(r.data.data))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const metricas = resumo ? [
    { titulo: 'Receita Ganha', valor: formatCurrency(resumo.receitaPrevista), icone: <DollarSign size={22} />, cor: 'text-emerald-600 bg-emerald-50' },
    { titulo: 'Pipeline em Aberto', valor: formatCurrency(resumo.pipelineAberto), icone: <TrendingUp size={22} />, cor: 'text-indigo-600 bg-indigo-50' },
    { titulo: 'Total de Leads', valor: resumo.totalLeads, icone: <Users size={22} />, cor: 'text-violet-600 bg-violet-50' },
    { titulo: 'Oportunidades sem site', valor: resumo.oportunidadesSemSite, icone: <GlobeLock size={22} />, cor: 'text-cyan-600 bg-cyan-50' },
  ] : [];

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto custom-scrollbar">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center px-6 shrink-0 sticky top-0 z-10">
          <h1 className="text-xl font-bold text-slate-800">Visão Geral</h1>
        </header>

        <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-xl text-slate-600">Olá, <span className="font-bold text-slate-800">{usuario.nome || 'Gestor'}</span> 👋</h2>
              <p className="text-sm text-slate-500">Acompanhe a captação e o funil em tempo real.</p>
            </div>
            <button onClick={() => navigate('/prospeccao')} className="bg-brand-gradient text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-voltage hover:opacity-95 transition">
              <Radar size={18} /> Prospectar no Mapa
            </button>
          </div>

          {isLoading || !resumo ? (
            <div className="flex justify-center items-center h-40 text-indigo-600"><Loader2 className="animate-spin" size={32} /></div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {metricas.map((m, i) => (
                  <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className={`p-2.5 rounded-xl w-max mb-3 ${m.cor}`}>{m.icone}</div>
                    <h3 className="text-slate-500 text-xs font-semibold uppercase tracking-wide">{m.titulo}</h3>
                    <p className="text-2xl font-extrabold text-slate-800 mt-1">{m.valor}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Funil */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2"><Briefcase size={18} className="text-indigo-600" /> Funil por estágio</h3>
                    <span className="text-xs text-slate-500">Taxa de conversão: <strong className="text-emerald-600">{resumo.taxaConversao}%</strong></span>
                  </div>
                  <div className="space-y-3">
                    {ESTAGIOS.map(s => {
                      const dados = resumo.funil[s] || { total: 0, valor: 0 };
                      const max = Math.max(...ESTAGIOS.map(e => resumo.funil[e]?.total || 0), 1);
                      const pct = Math.round((dados.total / max) * 100);
                      return (
                        <div key={s}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="font-medium text-slate-600">{s}</span>
                            <span className="text-slate-400">{dados.total} · {formatCurrency(dados.valor)}</span>
                          </div>
                          <div className="w-full bg-slate-100 h-6 rounded-md overflow-hidden">
                            <div className={`h-full rounded-md ${STATUS_CORES[s]?.split(' ')[0] || 'bg-indigo-200'}`} style={{ width: `${Math.max(pct, 4)}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Ranking de vendedores */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                  <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-5"><Trophy size={18} className="text-amber-500" /> Ranking de Vendedores</h3>
                  <div className="space-y-3">
                    {resumo.ranking.length === 0 && <p className="text-sm text-slate-400">Sem vendedores ativos.</p>}
                    {resumo.ranking.map((v, i) => (
                      <div key={v.id} className="flex items-center gap-3">
                        <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>{i + 1}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-700 truncate">{v.nome}</p>
                          <p className="text-[11px] text-slate-400">{v.leads} leads · {v.ganhos} ganhos</p>
                        </div>
                        <span className="text-sm font-bold text-emerald-600">{formatCurrency(v.receita)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-obsidian rounded-2xl p-6 text-white flex items-center justify-between flex-wrap gap-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <Target className="text-cyan-400" size={28} />
                  <div>
                    <p className="font-bold text-lg">{resumo.captadosProspeccao} leads captados via prospecção no mapa</p>
                    <p className="text-slate-400 text-sm">Continue varrendo regiões em busca de empresas sem site.</p>
                  </div>
                </div>
                <button onClick={() => navigate('/prospeccao')} className="bg-white/10 hover:bg-white/20 px-5 py-2.5 rounded-xl font-medium transition">Abrir mapa →</button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
