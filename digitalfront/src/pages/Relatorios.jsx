import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, DollarSign, GlobeLock, Loader2, Trophy } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import api from '../services/api';
import { formatCurrency } from '../utils/formatCurrency';
import { ESTAGIOS, STATUS_CORES } from './LeadDetail';

export default function Relatorios() {
  const [dados, setDados] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get('/relatorios/dashboard')
      .then(r => r.data.success && setDados(r.data.data))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const kpis = dados ? [
    { titulo: 'Receita Ganha', valor: formatCurrency(dados.receitaPrevista), icon: DollarSign },
    { titulo: 'Pipeline Aberto', valor: formatCurrency(dados.pipelineAberto), icon: TrendingUp },
    { titulo: 'Taxa de Conversão', valor: `${dados.taxaConversao}%`, icon: BarChart3 },
    { titulo: 'Oportunidades sem site', valor: dados.oportunidadesSemSite, icon: GlobeLock },
  ] : [];

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto custom-scrollbar">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 shrink-0 sticky top-0 z-10">
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2"><BarChart3 className="text-indigo-600" /> Relatórios & Analítica</h1>
        </header>

        <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
          {isLoading || !dados ? (
            <div className="flex justify-center items-center h-40 text-indigo-600"><Loader2 className="animate-spin" size={32} /></div>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.map((k, i) => (
                  <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                    <p className="text-slate-500 text-xs font-semibold uppercase tracking-wide flex items-center justify-between mb-2">
                      {k.titulo} <k.icon size={16} className="text-slate-400" />
                    </p>
                    <p className="text-2xl font-extrabold text-slate-800">{k.valor}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <h2 className="font-bold text-slate-800 mb-5">Funil de Vendas (real)</h2>
                  <div className="space-y-3">
                    {ESTAGIOS.map(s => {
                      const d = dados.funil[s] || { total: 0, valor: 0 };
                      const max = Math.max(...ESTAGIOS.map(e => dados.funil[e]?.total || 0), 1);
                      return (
                        <div key={s}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-slate-600">{s}</span>
                            <span className="font-bold text-slate-700">{d.total}</span>
                          </div>
                          <div className="w-full bg-slate-100 h-7 rounded-md overflow-hidden">
                            <div className={`h-full rounded-md ${STATUS_CORES[s]?.split(' ')[0] || 'bg-indigo-200'}`} style={{ width: `${Math.max(Math.round((d.total / max) * 100), 4)}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                  <h2 className="font-bold text-slate-800 mb-5 flex items-center gap-2"><Trophy size={18} className="text-amber-500" /> Desempenho por Vendedor</h2>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-xs uppercase text-slate-400 border-b border-slate-100">
                        <th className="text-left py-2 font-semibold">Vendedor</th>
                        <th className="text-center py-2 font-semibold">Leads</th>
                        <th className="text-center py-2 font-semibold">Ganhos</th>
                        <th className="text-right py-2 font-semibold">Receita</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {dados.ranking.map(v => (
                        <tr key={v.id}>
                          <td className="py-2.5 font-medium text-slate-700 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-brand-gradient text-white flex items-center justify-center text-[10px] font-bold uppercase">{v.nome.charAt(0)}</span>
                            {v.nome}
                          </td>
                          <td className="py-2.5 text-center text-slate-600">{v.leads}</td>
                          <td className="py-2.5 text-center text-emerald-600 font-semibold">{v.ganhos}</td>
                          <td className="py-2.5 text-right font-bold text-slate-700">{formatCurrency(v.receita)}</td>
                        </tr>
                      ))}
                      {dados.ranking.length === 0 && <tr><td colSpan="4" className="py-6 text-center text-slate-400">Sem dados.</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
