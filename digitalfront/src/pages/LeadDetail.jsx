import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Phone, MapPin, Globe, GlobeLock, User, Tag, DollarSign, Loader2,
  MessageCircle, Mail, CalendarClock, StickyNote, PhoneCall, Send, Clock,
  Sparkles, Package, Plus, Trash2, Save, Users, Database
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import api from '../services/api';
import { useToast } from '../components/Toast';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDateTime, timeAgo } from '../utils/formatDate';

export const ESTAGIOS = ['Novo', 'Contactado', 'Qualificado', 'Proposta', 'Negociação', 'Ganho', 'Perdido'];

export const STATUS_CORES = {
  Novo: 'bg-slate-100 text-slate-700 border-slate-200',
  Contactado: 'bg-blue-100 text-blue-700 border-blue-200',
  Qualificado: 'bg-amber-100 text-amber-700 border-amber-200',
  Proposta: 'bg-violet-100 text-violet-700 border-violet-200',
  'Negociação': 'bg-indigo-100 text-indigo-700 border-indigo-200',
  Ganho: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Perdido: 'bg-red-100 text-red-700 border-red-200',
};

const TIPOS_INTERACAO = [
  { id: 'Ligação', icon: PhoneCall }, { id: 'WhatsApp', icon: MessageCircle },
  { id: 'Email', icon: Mail }, { id: 'Reunião', icon: CalendarClock }, { id: 'Nota', icon: StickyNote },
];

const ICONE_TIPO = {
  'Ligação': PhoneCall, WhatsApp: MessageCircle, Email: Mail, 'Reunião': CalendarClock,
  Nota: StickyNote, Status: Tag, 'Atribuição': User, Sistema: Clock,
};

export default function LeadDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast, ToastHost } = useToast();
  const [lead, setLead] = useState(null);
  const [vendedores, setVendedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tipo, setTipo] = useState('Ligação');
  const [descricao, setDescricao] = useState('');
  const [salvando, setSalvando] = useState(false);

  // Proposta / serviços / contatos
  const [catalogo, setCatalogo] = useState([]);
  const [servicos, setServicos] = useState([]);
  const [produto, setProduto] = useState('');
  const [valorProposta, setValorProposta] = useState('');
  const [contatos, setContatos] = useState([]);
  const [salvandoProposta, setSalvandoProposta] = useState(false);

  const carregar = async () => {
    try {
      const r = await api.get(`/leads/${id}`);
      if (r.data.success) {
        const l = r.data.data;
        setLead(l);
        setServicos(Array.isArray(l.servicos_oferecidos) ? l.servicos_oferecidos : []);
        setProduto(l.produto_oferecido || '');
        setValorProposta(l.valor_proposta ? String(l.valor_proposta) : '');
        setContatos(Array.isArray(l.contatos) ? l.contatos : []);
      }
    } catch {
      showToast('Erro ao carregar lead.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregar();
    api.get('/auth/vendedores').then(r => r.data.success && setVendedores(r.data.data)).catch(() => {});
    api.get('/leads/servicos-catalogo').then(r => r.data.success && setCatalogo(r.data.data)).catch(() => {});
  }, [id]);

  const toggleServico = (sid) => {
    setServicos(prev => prev.includes(sid) ? prev.filter(s => s !== sid) : [...prev, sid]);
  };

  const totalSugerido = catalogo
    .filter(s => servicos.includes(s.id))
    .reduce((acc, s) => acc + Number(s.valor_base || 0), 0);

  const addContato = () => setContatos(prev => [...prev, { nome: '', email: '', telefone: '' }]);
  const updateContato = (i, campo, v) => setContatos(prev => prev.map((c, idx) => idx === i ? { ...c, [campo]: v } : c));
  const removeContato = (i) => setContatos(prev => prev.filter((_, idx) => idx !== i));

  const salvarProposta = async () => {
    setSalvandoProposta(true);
    try {
      await api.put(`/leads/${id}`, {
        servicos_oferecidos: servicos,
        produto_oferecido: produto,
        valor_proposta: Number(valorProposta) || 0,
        contatos: contatos.filter(c => (c.nome || c.email || c.telefone)),
      });
      showToast('Proposta e contatos salvos!', 'success');
      carregar();
    } catch { showToast('Erro ao salvar proposta.', 'error'); }
    finally { setSalvandoProposta(false); }
  };

  const mudarStatus = async (status) => {
    try {
      const r = await api.put(`/leads/${id}/status`, { status });
      if (r.data.success) {
        showToast(r.data.automacao_disparada ? 'Status alterado · WhatsApp disparado 🚀' : `Movido para ${status}`, 'success');
        carregar();
      }
    } catch { showToast('Erro ao mudar status.', 'error'); }
  };

  const atribuir = async (vendedor_id) => {
    try {
      await api.put(`/leads/${id}/atribuir`, { vendedor_id });
      showToast('Vendedor atualizado.', 'success');
      carregar();
    } catch { showToast('Erro ao atribuir.', 'error'); }
  };

  const registrar = async (e) => {
    e.preventDefault();
    if (!descricao.trim()) return;
    setSalvando(true);
    try {
      await api.post(`/leads/${id}/interacoes`, { tipo, descricao });
      setDescricao('');
      showToast('Passo da negociação registrado!', 'success');
      carregar();
    } catch { showToast('Erro ao registrar.', 'error'); }
    finally { setSalvando(false); }
  };

  if (loading) return (
    <div className="flex h-screen bg-slate-50"><Sidebar /><div className="flex-1 flex items-center justify-center text-indigo-600"><Loader2 className="animate-spin" size={32} /></div></div>
  );
  if (!lead) return (
    <div className="flex h-screen bg-slate-50"><Sidebar /><div className="flex-1 flex items-center justify-center text-slate-500">Lead não encontrado.</div></div>
  );

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto custom-scrollbar">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center gap-3 px-6 shrink-0 sticky top-0 z-10">
          <button onClick={() => navigate(-1)} className="text-slate-500 hover:text-slate-800 p-1.5 hover:bg-slate-100 rounded-lg"><ArrowLeft size={20} /></button>
          <div className="min-w-0">
            <h1 className="text-lg font-bold text-slate-800 truncate">{lead.empresa || lead.nome}</h1>
            <p className="text-xs text-slate-500">{lead.categoria || 'Lead'} · {lead.cidade || 'Sem cidade'}</p>
          </div>
          <span className={`ml-auto text-xs font-bold px-3 py-1.5 rounded-full border ${STATUS_CORES[lead.status] || ''}`}>{lead.status}</span>
        </header>

        <div className="p-6 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* SERVIÇOS EM EVIDÊNCIA — destaque para o vendedor escolher o que oferecer */}
          <div className="lg:col-span-3 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl shadow-voltage p-5 text-white">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={20} />
              <h2 className="font-bold text-lg">Serviços para oferecer</h2>
            </div>
            <p className="text-xs text-indigo-100 mb-4">Selecione o que faz sentido para {lead.empresa || 'este cliente'} — clique para marcar.</p>
            <div className="flex flex-wrap gap-2">
              {catalogo.map(s => {
                const on = servicos.includes(s.id);
                return (
                  <button key={s.id} onClick={() => toggleServico(s.id)}
                    className={`px-3 py-2 rounded-xl text-sm font-semibold border transition-all ${on ? 'bg-white text-indigo-700 border-white shadow-md scale-[1.02]' : 'bg-white/10 text-white border-white/30 hover:bg-white/20'}`}>
                    {on ? '✓ ' : ''}{s.label}
                    <span className={`ml-1.5 text-[11px] ${on ? 'text-indigo-400' : 'text-indigo-200'}`}>{formatCurrency(s.valor_base)}</span>
                  </button>
                );
              })}
            </div>
            {servicos.length > 0 && (
              <div className="mt-4 flex items-center justify-between bg-white/10 rounded-xl px-4 py-2.5">
                <span className="text-sm">{servicos.length} serviço(s) · sugestão de pacote</span>
                <button onClick={() => setValorProposta(String(totalSugerido))} className="text-sm font-bold underline-offset-2 hover:underline">
                  {formatCurrency(totalSugerido)} → usar como valor
                </button>
              </div>
            )}
          </div>

          {/* COLUNA INFO + AÇÕES */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <h2 className="font-bold text-slate-800 mb-4">Dados do Lead</h2>
              <ul className="space-y-3 text-sm">
                <Info icon={User} label="Contato" valor={lead.nome || '—'} />
                <Info icon={Phone} label="Telefone" valor={lead.telefone || '—'} />
                <Info icon={MapPin} label="Endereço" valor={lead.endereco || '—'} />
                <Info icon={Tag} label="Categoria" valor={lead.categoria || '—'} />
                <li className="flex items-start gap-3">
                  {lead.possui_website ? <Globe size={16} className="text-slate-400 mt-0.5" /> : <GlobeLock size={16} className="text-emerald-500 mt-0.5" />}
                  <div>
                    <p className="text-[11px] uppercase tracking-wide text-slate-400">Website</p>
                    {lead.possui_website
                      ? <a href={lead.website_url} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline break-all">{lead.website_url || 'Possui site'}</a>
                      : <p className="font-semibold text-emerald-600">Oportunidade — sem site</p>}
                  </div>
                </li>
                <Info icon={DollarSign} label="Valor estimado" valor={formatCurrency(lead.valor_estimado)} />
              </ul>
            </div>

            {/* Informações da internet (OSM / Google Maps style) */}
            {Array.isArray(lead.detalhes_externos) && lead.detalhes_externos.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <h2 className="font-bold text-slate-800 mb-3 flex items-center gap-2"><Database size={18} className="text-violet-600" /> Informações da internet</h2>
                <ul className="space-y-2 text-sm">
                  {lead.detalhes_externos.map((d, i) => (
                    <li key={i} className="flex justify-between gap-3 border-b border-slate-50 pb-1.5 last:border-0">
                      <span className="text-slate-400">{d.label}</span>
                      <span className="font-medium text-slate-700 text-right break-all">{d.valor}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Vendedor */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <h2 className="font-bold text-slate-800 mb-3">Vendedor responsável</h2>
              <select value={lead.vendedor_id || ''} onChange={e => atribuir(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none">
                <option value="">Sem atribuição</option>
                {vendedores.map(v => <option key={v.id} value={v.id}>{v.nome}</option>)}
              </select>
            </div>

            {/* Status */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <h2 className="font-bold text-slate-800 mb-3">Mover no funil</h2>
              <div className="flex flex-wrap gap-2">
                {ESTAGIOS.map(s => (
                  <button key={s} onClick={() => mudarStatus(s)} disabled={s === lead.status}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${s === lead.status ? `${STATUS_CORES[s]} cursor-default` : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-700'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* COLUNA TIMELINE */}
          <div className="lg:col-span-2 space-y-6">
            {/* PROPOSTA & CONTATOS */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-slate-800 flex items-center gap-2"><Package size={18} className="text-indigo-600" /> Proposta & Contatos</h2>
                <button onClick={salvarProposta} disabled={salvandoProposta}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                  {salvandoProposta ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Salvar
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] uppercase tracking-wide text-slate-400 font-semibold">Produto / serviço oferecido</label>
                  <input value={produto} onChange={e => setProduto(e.target.value)}
                    placeholder="Ex: Site institucional + Google Meu Negócio"
                    className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-wide text-slate-400 font-semibold">Valor da proposta (R$)</label>
                  <input type="number" min="0" step="0.01" value={valorProposta} onChange={e => setValorProposta(e.target.value)}
                    placeholder="0,00"
                    className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
              </div>

              {/* Contatos */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-[11px] uppercase tracking-wide text-slate-400 font-semibold flex items-center gap-1.5"><Users size={13} /> Contatos do cliente</label>
                  <button onClick={addContato} className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"><Plus size={13} /> Adicionar</button>
                </div>
                {contatos.length === 0 ? (
                  <p className="text-xs text-slate-400 py-3 text-center border border-dashed border-slate-200 rounded-lg">Nenhum contato. Clique em “Adicionar”.</p>
                ) : (
                  <div className="space-y-2">
                    {contatos.map((c, i) => (
                      <div key={i} className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1fr_auto] gap-2 items-center">
                        <input value={c.nome || ''} onChange={e => updateContato(i, 'nome', e.target.value)} placeholder="Nome"
                          className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                        <input value={c.telefone || ''} onChange={e => updateContato(i, 'telefone', e.target.value)} placeholder="Telefone"
                          className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                        <input value={c.email || ''} onChange={e => updateContato(i, 'email', e.target.value)} placeholder="E-mail"
                          className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                        <button onClick={() => removeContato(i)} className="text-slate-300 hover:text-red-500 p-1.5 justify-self-end"><Trash2 size={16} /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <form onSubmit={registrar} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <h2 className="font-bold text-slate-800 mb-3">Registrar passo da negociação</h2>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {TIPOS_INTERACAO.map(({ id: t, icon: Icon }) => (
                  <button type="button" key={t} onClick={() => setTipo(t)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all ${tipo === t ? 'bg-brand-gradient text-white border-transparent' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'}`}>
                    <Icon size={13} /> {t}
                  </button>
                ))}
              </div>
              <textarea value={descricao} onChange={e => setDescricao(e.target.value)} rows={3}
                placeholder="Descreva o que aconteceu nesta etapa (ex: liguei, cliente pediu proposta para sexta…)"
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none" />
              <div className="flex justify-end mt-3">
                <button type="submit" disabled={salvando || !descricao.trim()} className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold px-5 py-2 rounded-lg text-sm flex items-center gap-2">
                  {salvando ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />} Registrar
                </button>
              </div>
            </form>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Clock size={18} className="text-indigo-600" /> Histórico da negociação</h2>
              {lead.interacoes.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-6">Nenhuma interação ainda.</p>
              ) : (
                <ol className="relative border-l-2 border-slate-100 ml-3 space-y-5">
                  {lead.interacoes.map(it => {
                    const Icon = ICONE_TIPO[it.tipo] || StickyNote;
                    return (
                      <li key={it.id} className="ml-6">
                        <span className="absolute -left-[13px] w-6 h-6 rounded-full bg-white border-2 border-indigo-200 flex items-center justify-center text-indigo-600">
                          <Icon size={12} />
                        </span>
                        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="text-xs font-bold text-slate-700 flex items-center gap-2">
                              {it.tipo}
                              {it.mensagem_automatica ? <span className="text-[9px] bg-violet-100 text-violet-700 px-1.5 py-0.5 rounded uppercase">Auto</span> : null}
                            </span>
                            <span className="text-[11px] text-slate-400" title={formatDateTime(it.data_criacao)}>{timeAgo(it.data_criacao)}</span>
                          </div>
                          <p className="text-sm text-slate-600 whitespace-pre-wrap">{it.descricao}</p>
                          {it.usuario_nome && <p className="text-[11px] text-slate-400 mt-1">por {it.usuario_nome}</p>}
                        </div>
                      </li>
                    );
                  })}
                </ol>
              )}
            </div>
          </div>
        </div>
      </main>
      <ToastHost />
    </div>
  );
}

function Info({ icon: Icon, label, valor }) {
  return (
    <li className="flex items-start gap-3">
      <Icon size={16} className="text-slate-400 mt-0.5" />
      <div>
        <p className="text-[11px] uppercase tracking-wide text-slate-400">{label}</p>
        <p className="font-medium text-slate-700">{valor}</p>
      </div>
    </li>
  );
}
