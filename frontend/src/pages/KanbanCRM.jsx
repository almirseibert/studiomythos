import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users, Loader2, BookOpen, Tag, Info, GlobeLock, Clock, X } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import api from '../services/api';
import { useToast } from '../components/Toast';
import Modal from '../components/Modal';
import { formatCurrency } from '../utils/formatCurrency';
import { ESTAGIOS, STATUS_CORES } from './LeadDetail';

const servicosReferencia = [
  { nome: 'Criação de Landing Page', descricao: 'Página única focada em conversão, ideal para campanhas de anúncios e captura de leads.', min: 800, med: 1500, max: 3000 },
  { nome: 'E-commerce / Loja Virtual', descricao: 'Plataforma completa de vendas online com carrinho, pagamentos e gestão de stock.', min: 2500, med: 5000, max: 15000 },
  { nome: 'Gestão de Tráfego Pago (Mensal)', descricao: 'Criação e otimização de campanhas no Google e Meta Ads (não inclui verba de mídia).', min: 800, med: 1500, max: 5000 },
  { nome: 'Gestão de Redes Sociais (Mensal)', descricao: 'Planeamento, design, copywriting e agendamento de publicações estratégicas.', min: 600, med: 1200, max: 3000 },
  { nome: 'Identidade Visual / Branding', descricao: 'Logótipo, paleta de cores, tipografia e manual de marca profissional.', min: 500, med: 1200, max: 4000 },
  { nome: 'Desenvolvimento de Sistema Web', descricao: 'Sistemas sob medida (ERPs, CRMs, portais) com base de dados e integrações.', min: 5000, med: 12000, max: 50000 },
];

const corColuna = {
  Novo: 'bg-slate-200', Contactado: 'bg-blue-300', Qualificado: 'bg-amber-300',
  Proposta: 'bg-violet-300', 'Negociação': 'bg-indigo-300', Ganho: 'bg-emerald-400', Perdido: 'bg-red-300',
};

export default function KanbanCRM() {
  const navigate = useNavigate();
  const { showToast, ToastHost } = useToast();
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCatalogoOpen, setIsCatalogoOpen] = useState(false);
  const [vendedores, setVendedores] = useState([]);
  const [novo, setNovo] = useState({ nome: '', empresa: '', telefone: '', email: '', valor_estimado: '', titulo: '', vendedor_id: '' });

  useEffect(() => {
    carregar();
    api.get('/auth/vendedores').then(r => r.data.success && setVendedores(r.data.data)).catch(() => {});
  }, []);

  const carregar = async () => {
    try {
      setIsLoading(true);
      const r = await api.get('/leads');
      if (r.data.success) setLeads(r.data.data);
    } catch {
      showToast('Falha ao carregar o funil.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const salvar = async (e) => {
    e.preventDefault();
    try {
      const r = await api.post('/leads', { ...novo, origem: 'Manual', status: 'Novo' });
      if (r.data.success) {
        setIsModalOpen(false);
        setNovo({ nome: '', empresa: '', telefone: '', email: '', valor_estimado: '', titulo: '', vendedor_id: '' });
        showToast('Lead criado com sucesso!', 'success');
        carregar();
      }
    } catch { showToast('Erro ao gravar lead.', 'error'); }
  };

  const onDragStart = (e, id) => e.dataTransfer.setData('leadId', id);
  const onDrop = async (e, status) => {
    e.preventDefault();
    const id = parseInt(e.dataTransfer.getData('leadId'));
    const lead = leads.find(l => l.id === id);
    if (!lead || lead.status === status) return;
    const antigos = [...leads];
    setLeads(leads.map(l => l.id === id ? { ...l, status } : l));
    try {
      const r = await api.put(`/leads/${id}/status`, { status });
      showToast(r.data.automacao_disparada ? `WhatsApp disparado para ${lead.empresa} 🚀` : `Movido para ${status}`, 'success');
      carregar();
    } catch {
      setLeads(antigos);
      showToast('Erro ao mover lead.', 'error');
    }
  };

  const agingBadge = (dias) => {
    if (dias == null) return null;
    const cor = dias >= 14 ? 'text-red-600 bg-red-50' : dias >= 7 ? 'text-amber-600 bg-amber-50' : 'text-slate-500 bg-slate-100';
    return <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded flex items-center gap-1 ${cor}`}><Clock size={10} /> {dias}d</span>;
  };

  const valorTotal = leads.reduce((s, l) => s + Number(l.valor_estimado || 0), 0);

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden relative">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 shrink-0 z-10">
          <h1 className="text-xl font-bold text-slate-800">Funil de Vendas</h1>
          <div className="flex items-center gap-3">
            <span className="hidden sm:flex text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">{leads.length} leads · {formatCurrency(valorTotal)}</span>
            <button onClick={() => setIsCatalogoOpen(true)} className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm transition-colors">
              <BookOpen size={18} /> Tabela de Preços
            </button>
            <button onClick={() => setIsModalOpen(true)} className="bg-brand-gradient text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-voltage hover:opacity-95 transition">
              <Plus size={18} /> Novo Lead
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-x-auto overflow-y-hidden p-6">
          {isLoading ? (
            <div className="flex w-full h-full items-center justify-center text-indigo-500"><Loader2 size={32} className="animate-spin" /></div>
          ) : (
            <div className="flex gap-4 h-full items-start min-w-max pb-4">
              {ESTAGIOS.map(fase => {
                const doFase = leads.filter(l => l.status === fase);
                const total = doFase.reduce((s, l) => s + Number(l.valor_estimado || 0), 0);
                return (
                  <div key={fase} className="w-72 flex flex-col max-h-full bg-slate-100/60 rounded-xl border border-slate-200" onDragOver={e => e.preventDefault()} onDrop={e => onDrop(e, fase)}>
                    <div className="px-3 py-3 border-b border-slate-200 rounded-t-xl flex justify-between items-center bg-white">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${corColuna[fase]}`} />
                        <h3 className="font-bold text-sm text-slate-700">{fase}</h3>
                      </div>
                      <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full">{doFase.length}</span>
                    </div>
                    <p className="px-3 py-1.5 text-[11px] text-slate-400 font-medium bg-white/50 border-b border-slate-100">{formatCurrency(total)}</p>

                    <div className="p-2.5 overflow-y-auto flex-1 space-y-2.5 custom-scrollbar">
                      {doFase.map(lead => (
                        <div key={lead.id} draggable onDragStart={e => onDragStart(e, lead.id)} onClick={() => navigate(`/leads/${lead.id}`)}
                          className="bg-white p-3 rounded-lg shadow-sm border border-slate-200 cursor-pointer hover:border-indigo-300 hover:shadow-md transition-all">
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <h4 className="font-bold text-slate-800 text-sm leading-tight">{lead.empresa || lead.nome}</h4>
                            {!lead.possui_website && <span title="Sem site" className="shrink-0 text-emerald-500"><GlobeLock size={15} /></span>}
                          </div>
                          {lead.categoria && <p className="text-[11px] text-slate-400 mb-2">{lead.categoria}</p>}
                          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                            <span className="font-bold text-slate-700 text-sm">{formatCurrency(lead.valor_estimado)}</span>
                            {agingBadge(lead.dias_parado)}
                          </div>
                          {lead.vendedor_nome && (
                            <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-500">
                              <span className="w-5 h-5 rounded-full bg-brand-gradient text-white flex items-center justify-center text-[9px] font-bold uppercase">{lead.vendedor_nome.charAt(0)}</span>
                              {lead.vendedor_nome}
                            </div>
                          )}
                        </div>
                      ))}
                      {doFase.length === 0 && <div className="h-16 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center text-slate-300 text-xs">Arraste para cá</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* MODAL NOVO LEAD */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title="Novo Lead" subtitle="Cria um lead no início do funil">
        <form onSubmit={salvar} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Título do Projeto</label>
            <input required value={novo.titulo} onChange={e => setNovo({ ...novo, titulo: e.target.value })} placeholder="Ex: Website institucional" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Empresa</label>
              <input required value={novo.empresa} onChange={e => setNovo({ ...novo, empresa: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Contato</label>
              <input value={novo.nome} onChange={e => setNovo({ ...novo, nome: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Telefone</label>
              <input value={novo.telefone} onChange={e => setNovo({ ...novo, telefone: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Valor (R$)</label>
              <input type="number" min="0" step="0.01" value={novo.valor_estimado} onChange={e => setNovo({ ...novo, valor_estimado: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" /></div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Vendedor responsável</label>
            <select value={novo.vendedor_id} onChange={e => setNovo({ ...novo, vendedor_id: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none">
              <option value="">Sem atribuição</option>
              {vendedores.map(v => <option key={v.id} value={v.id}>{v.nome}</option>)}
            </select>
          </div>
          <div className="pt-2 flex justify-end gap-3">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium">Cancelar</button>
            <button type="submit" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold">Gravar</button>
          </div>
        </form>
      </Modal>

      {/* MODAL CATÁLOGO */}
      <Modal open={isCatalogoOpen} onClose={() => setIsCatalogoOpen(false)} title="Mural de Serviços & Preços" subtitle="Referência para a equipa comercial" icon={<BookOpen size={22} />} maxWidth="max-w-4xl">
        <div className="p-6 bg-slate-50/50">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {servicosReferencia.map((s, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 left-0 w-1 h-full bg-brand-gradient" />
                <div>
                  <h3 className="font-bold text-slate-800 text-base mb-2">{s.nome}</h3>
                  <p className="text-sm text-slate-600 mb-5 min-h-[40px] leading-relaxed">{s.descricao}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-2 flex items-center gap-1"><Tag size={12} /> Referência de Mercado</p>
                  <div className="flex justify-between items-end">
                    <div><p className="text-[10px] text-slate-400 uppercase">Mínimo</p><p className="font-medium text-slate-700">{formatCurrency(s.min)}</p></div>
                    <div className="text-center bg-indigo-100 px-3 py-1.5 rounded-md"><p className="text-[10px] text-indigo-700 uppercase font-bold">Média</p><p className="font-bold text-indigo-900 text-lg">{formatCurrency(s.med)}</p></div>
                    <div className="text-right"><p className="text-[10px] text-slate-400 uppercase">Máximo</p><p className="font-medium text-slate-700">{formatCurrency(s.max)}</p></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex gap-3 text-sm text-indigo-800">
            <Info size={24} className="shrink-0 text-indigo-600" />
            <p><strong>Nota:</strong> valores médios de mercado para ancoragem. O preço final considera a complexidade do projeto, horas estimadas e integrações necessárias.</p>
          </div>
        </div>
      </Modal>

      <ToastHost />
    </div>
  );
}
