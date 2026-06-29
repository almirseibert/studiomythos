import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, ArrowUpRight, ArrowDownRight, Wallet, Loader2, X } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import api from '../services/api';

export default function Financeiro() {
  const [lancamentos, setLancamentos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Resumos
  const [totais, setTotais] = useState({ receitas: 0, despesas: 0, saldo: 0 });

  const [novoLancamento, setNovoLancamento] = useState({
    data: new Date().toISOString().split('T')[0], // Hoje
    descricao: '', categoria: 'Serviços', tipo: 'RECEITA', valor: '', status: 'PENDENTE'
  });

  useEffect(() => {
    carregarLancamentos();
  }, []);

  const carregarLancamentos = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/financeiro');
      if (response.data.success) {
        const dados = response.data.data;
        setLancamentos(dados);
        
        // Calcular totais
        let rec = 0; let desp = 0;
        dados.forEach(l => {
          const val = Number(l.valor);
          if (l.tipo === 'RECEITA' && l.status === 'PAGO') rec += val;
          if (l.tipo === 'DESPESA' && l.status === 'PAGO') desp += val;
        });
        setTotais({ receitas: rec, despesas: desp, saldo: rec - desp });
      }
    } catch (error) {
      console.error('Erro ao carregar:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSalvarLancamento = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/financeiro', novoLancamento);
      if (response.data.success) {
        setIsModalOpen(false);
        setNovoLancamento({
          data: new Date().toISOString().split('T')[0],
          descricao: '', categoria: 'Serviços', tipo: 'RECEITA', valor: '', status: 'PENDENTE'
        });
        carregarLancamentos();
      }
    } catch (error) {
      alert('Erro ao gravar lançamento.');
    }
  };

  const getStatusStyle = (status) => {
    return status === 'PAGO' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-yellow-100 text-yellow-700 border-yellow-200';
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden relative">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center px-6 shrink-0 sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-slate-800">Controlo Financeiro</h1>
        </header>

        <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 border shadow-sm">
              <div className="p-3 bg-slate-50 text-slate-600 rounded-lg w-max mb-2"><Wallet size={24} /></div>
              <h3 className="text-slate-500 text-sm font-medium">Saldo Atual (Líquido)</h3>
              <p className="text-3xl font-bold text-slate-800 mt-1">R$ {totais.saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="bg-white rounded-xl p-6 border shadow-sm">
              <div className="p-3 bg-green-50 text-green-600 rounded-lg w-max mb-2"><ArrowUpRight size={24} /></div>
              <h3 className="text-slate-500 text-sm font-medium">Receitas Pagas</h3>
              <p className="text-3xl font-bold text-green-600 mt-1">R$ {totais.receitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="bg-white rounded-xl p-6 border shadow-sm">
              <div className="p-3 bg-red-50 text-red-600 rounded-lg w-max mb-2"><ArrowDownRight size={24} /></div>
              <h3 className="text-slate-500 text-sm font-medium">Despesas Pagas</h3>
              <p className="text-3xl font-bold text-red-600 mt-1">R$ {totais.despesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" placeholder="Pesquisar..." className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm bg-slate-50"/>
            </div>
            <button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 shadow-sm">
              <Plus size={18} /> Novo Lançamento
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            {isLoading ? (
               <div className="flex justify-center items-center h-40 text-indigo-600">
                  <Loader2 className="animate-spin" size={32} />
               </div>
            ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-slate-50 border-b text-xs uppercase text-slate-500 font-semibold">
                    <th className="px-6 py-4">Data</th>
                    <th className="px-6 py-4">Descrição</th>
                    <th className="px-6 py-4">Tipo</th>
                    <th className="px-6 py-4">Valor</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {lancamentos.map((lanc) => (
                    <tr key={lanc.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-slate-600">
                         {new Date(lanc.data).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-800">{lanc.descricao}</td>
                      <td className="px-6 py-4">
                        <span className={`flex items-center gap-1 text-sm font-semibold ${lanc.tipo === 'RECEITA' ? 'text-green-600' : 'text-red-600'}`}>
                          {lanc.tipo === 'RECEITA' ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>} {lanc.tipo}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-700">
                        R$ {Number(lanc.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getStatusStyle(lanc.status)}`}>{lanc.status}</span>
                      </td>
                    </tr>
                  ))}
                  {lancamentos.length === 0 && (
                     <tr><td colSpan="5" className="text-center py-6 text-slate-500">Nenhum lançamento registado.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            )}
          </div>
        </div>

        {/* MODAL DE NOVO LANÇAMENTO */}
        {isModalOpen && (
          <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
              <div className="px-6 py-4 border-b flex justify-between items-center bg-slate-50">
                <h2 className="font-bold text-slate-800">Registrar Lançamento</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
              </div>
              <form onSubmit={handleSalvarLancamento} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Descrição</label>
                  <input required type="text" value={novoLancamento.descricao} onChange={e => setNovoLancamento({...novoLancamento, descricao: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"/>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Data</label>
                    <input required type="date" value={novoLancamento.data} onChange={e => setNovoLancamento({...novoLancamento, data: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm"/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Valor (R$)</label>
                    <input required type="number" min="0" step="0.01" value={novoLancamento.valor} onChange={e => setNovoLancamento({...novoLancamento, valor: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm"/>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Tipo</label>
                    <select value={novoLancamento.tipo} onChange={e => setNovoLancamento({...novoLancamento, tipo: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm">
                      <option value="RECEITA">Receita (+)</option>
                      <option value="DESPESA">Despesa (-)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <select value={novoLancamento.status} onChange={e => setNovoLancamento({...novoLancamento, status: e.target.value})} className="w-full border rounded-lg px-3 py-2 text-sm">
                      <option value="PAGO">Pago / Recebido</option>
                      <option value="PENDENTE">Pendente</option>
                    </select>
                  </div>
                </div>
                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm">Cancelar</button>
                  <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm">Gravar Lançamento</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}