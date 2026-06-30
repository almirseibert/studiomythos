import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  MessageSquare, RefreshCw, Send, Wifi, WifiOff, QrCode, Loader2,
  UserCheck, Bot, Calendar, Brain, Trash2, CheckCircle2, XCircle,
  Clock, ChevronRight, User, Smartphone,
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import api from '../services/api';
import { isAdmin, getUser } from '../services/auth';
import { useNavigate } from 'react-router-dom';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const STATUS_BOT = {
  pronto:        { label: 'Conectado',     dot: 'bg-emerald-500', badge: 'text-emerald-700 bg-emerald-50' },
  autenticado:   { label: 'Autenticando…', dot: 'bg-yellow-400',  badge: 'text-yellow-700 bg-yellow-50' },
  aguardando_qr: { label: 'Aguardando QR', dot: 'bg-blue-500',    badge: 'text-blue-700 bg-blue-50' },
  inicializando: { label: 'Iniciando…',    dot: 'bg-violet-500',  badge: 'text-violet-700 bg-violet-50' },
  erro:          { label: 'Erro',          dot: 'bg-red-500',     badge: 'text-red-700 bg-red-50' },
  erro_auth:     { label: 'Erro de auth',  dot: 'bg-red-500',     badge: 'text-red-700 bg-red-50' },
  desconectado:  { label: 'Desconectado',  dot: 'bg-slate-400',   badge: 'text-slate-600 bg-slate-100' },
};

const MODO_INFO = {
  ia_ativa:     { label: 'IA Ativa',    cls: 'bg-violet-100 text-violet-700', icon: Bot },
  humano_ativo: { label: 'Humano',      cls: 'bg-amber-100 text-amber-700',   icon: UserCheck },
  aguardando:   { label: 'Aguardando',  cls: 'bg-slate-100 text-slate-600',   icon: Clock },
};

const STATUS_AGENDA = {
  agendado:   { label: 'Agendado',   cls: 'bg-blue-100 text-blue-700' },
  confirmado: { label: 'Confirmado', cls: 'bg-emerald-100 text-emerald-700' },
  realizado:  { label: 'Realizado',  cls: 'bg-slate-100 text-slate-500' },
  cancelado:  { label: 'Cancelado',  cls: 'bg-red-100 text-red-600' },
};

function fmtTime(d) {
  if (!d) return '';
  const dt = new Date(d);
  const now = new Date();
  const diff = now - dt;
  if (diff < 60000) return 'agora';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}min`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
  return dt.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

function phoneDisplay(p) { return (p || '').replace('@c.us', '').replace('@g.us', ''); }

// ─── Sub-componentes ──────────────────────────────────────────────────────────

function BotBadge({ status }) {
  const s = STATUS_BOT[status] || STATUS_BOT.desconectado;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold ${s.badge}`}>
      <span className={`w-2 h-2 rounded-full ${s.dot} animate-pulse`} /> {s.label}
    </span>
  );
}

function ModoBadge({ modo }) {
  const m = MODO_INFO[modo] || MODO_INFO.aguardando;
  const Icon = m.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${m.cls}`}>
      <Icon size={11} /> {m.label}
    </span>
  );
}

function Toast({ msg, type }) {
  return (
    <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium animate-in ${type === 'err' ? 'bg-red-600' : 'bg-emerald-600'}`}>
      {msg}
    </div>
  );
}

// ─── Painel de Chat ───────────────────────────────────────────────────────────

function ChatPanel({ conversa, onClose, onUpdate, botReady }) {
  const [mensagens, setMensagens] = useState([]);
  const [texto, setTexto] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modo, setModo] = useState(conversa.modo);
  const scrollRef = useRef(null);

  const load = useCallback(async () => {
    try {
      const { data } = await api.get(`/whatsapp/conversas/${conversa.id}`);
      if (data.success) {
        setMensagens(data.data.mensagens);
        setModo(data.data.conversa.modo);
      }
    } finally { setLoading(false); }
  }, [conversa.id]);

  useEffect(() => { load(); const t = setInterval(load, 6000); return () => clearInterval(t); }, [load]);
  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [mensagens]);

  const assumir = async () => {
    await api.post(`/whatsapp/conversas/${conversa.id}/assumir`);
    setModo('humano_ativo'); onUpdate();
  };
  const devolver = async () => {
    await api.post(`/whatsapp/conversas/${conversa.id}/devolver`);
    setModo('ia_ativa'); onUpdate();
  };
  const enviar = async (e) => {
    e.preventDefault();
    if (!texto.trim() || !botReady) return;
    setEnviando(true);
    try {
      await api.post(`/whatsapp/conversas/${conversa.id}/mensagem`, { mensagem: texto });
      setTexto('');
      await load();
    } finally { setEnviando(false); }
  };

  const REMETENTE_STYLE = {
    cliente: 'bg-white border border-slate-200 text-slate-800 self-start rounded-tl-none',
    ia:      'bg-violet-600 text-white self-end rounded-tr-none',
    humano:  'bg-emerald-600 text-white self-end rounded-tr-none',
  };
  const REMETENTE_LABEL = { cliente: 'Cliente', ia: '🤖 Mythos', humano: '👤 Vendedor' };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-white shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition">
            <ChevronRight size={18} className="rotate-180" />
          </button>
          <div className="min-w-0">
            <p className="font-bold text-slate-800 truncate">{conversa.nome_contato || phoneDisplay(conversa.phone)}</p>
            <p className="text-xs text-slate-400">{phoneDisplay(conversa.phone)} · {conversa.empresa || 'Sem empresa'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <ModoBadge modo={modo} />
          {modo === 'ia_ativa' ? (
            <button onClick={assumir} className="text-xs bg-amber-500 hover:bg-amber-600 text-white font-semibold px-3 py-1.5 rounded-lg transition flex items-center gap-1">
              <UserCheck size={13} /> Assumir
            </button>
          ) : modo === 'humano_ativo' ? (
            <button onClick={devolver} className="text-xs bg-violet-600 hover:bg-violet-700 text-white font-semibold px-3 py-1.5 rounded-lg transition flex items-center gap-1">
              <Bot size={13} /> Devolver à IA
            </button>
          ) : null}
        </div>
      </div>

      {/* Mensagens */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-slate-50 custom-scrollbar">
        {loading && <div className="flex justify-center py-8"><Loader2 className="animate-spin text-violet-400" /></div>}
        {mensagens.map((m) => (
          <div key={m.id} className={`flex flex-col max-w-[75%] ${m.remetente === 'cliente' ? 'items-start' : 'items-end ml-auto'}`}>
            <p className="text-[10px] text-slate-400 mb-0.5 px-1">{REMETENTE_LABEL[m.remetente]}</p>
            <div className={`px-3 py-2 rounded-2xl text-sm shadow-sm ${REMETENTE_STYLE[m.remetente]}`}>
              <p className="whitespace-pre-wrap break-words">{m.conteudo}</p>
            </div>
            <p className="text-[10px] text-slate-300 mt-0.5 px-1">
              {new Date(m.criado_em).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      {/* Input */}
      {modo === 'humano_ativo' ? (
        <form onSubmit={enviar} className="flex gap-2 p-3 border-t border-slate-200 bg-white shrink-0">
          <input
            type="text"
            value={texto}
            onChange={e => setTexto(e.target.value)}
            placeholder="Digite sua mensagem como vendedor..."
            className="flex-1 border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <button
            type="submit"
            disabled={enviando || !botReady}
            className="bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 rounded-xl transition disabled:opacity-50"
          >
            {enviando ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </form>
      ) : (
        <div className="flex items-center gap-2 px-4 py-3 border-t border-slate-200 bg-slate-50 text-sm text-slate-400 shrink-0">
          <Bot size={16} className="text-violet-400" />
          A IA está atendendo este contato. Clique em "Assumir" para intervir.
        </div>
      )}
    </div>
  );
}

// ─── Aba Agenda ───────────────────────────────────────────────────────────────

function AbaAgenda({ showToast }) {
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('agendado');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/whatsapp/agendamentos${filtro ? `?status=${filtro}` : ''}`);
      if (data.success) setAgendamentos(data.data);
    } finally { setLoading(false); }
  }, [filtro]);

  useEffect(() => { load(); }, [load]);

  const atualizar = async (id, status) => {
    await api.patch(`/whatsapp/agendamentos/${id}`, { status });
    showToast('Status atualizado');
    load();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        {['', 'agendado', 'confirmado', 'realizado', 'cancelado'].map(s => (
          <button
            key={s}
            onClick={() => setFiltro(s)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${filtro === s ? 'bg-violet-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            {s || 'Todos'}
          </button>
        ))}
        <button onClick={load} className="ml-auto p-2 rounded-lg hover:bg-white border border-transparent hover:border-slate-200 text-slate-400 transition">
          <RefreshCw size={15} />
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="animate-spin text-violet-400" /></div>
      ) : agendamentos.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <Calendar size={40} className="mx-auto mb-3 opacity-30" />
          <p>Nenhum agendamento {filtro ? `com status "${filtro}"` : ''}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {agendamentos.map(a => (
            <div key={a.id} className="bg-white rounded-xl border border-slate-200 p-4 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <p className="font-semibold text-slate-800">{a.titulo}</p>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_AGENDA[a.status]?.cls || ''}`}>
                    {STATUS_AGENDA[a.status]?.label || a.status}
                  </span>
                </div>
                <p className="text-sm text-slate-500 flex items-center gap-1.5">
                  <Clock size={13} /> {a.data_hora_fmt}
                </p>
                <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-0.5">
                  <User size={13} /> {a.cliente_nome || phoneDisplay(a.phone)} {a.empresa ? `· ${a.empresa}` : ''}
                </p>
                {a.descricao && <p className="text-xs text-slate-400 mt-1 italic">{a.descricao}</p>}
              </div>
              <div className="flex gap-1.5 shrink-0">
                {a.status === 'agendado' && (
                  <button onClick={() => atualizar(a.id, 'confirmado')} className="p-1.5 rounded-lg hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 transition" title="Confirmar">
                    <CheckCircle2 size={16} />
                  </button>
                )}
                {['agendado', 'confirmado'].includes(a.status) && (
                  <>
                    <button onClick={() => atualizar(a.id, 'realizado')} className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition" title="Marcar realizado">
                      <CheckCircle2 size={16} />
                    </button>
                    <button onClick={() => atualizar(a.id, 'cancelado')} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition" title="Cancelar">
                      <XCircle size={16} />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Aba Conexão / Config ─────────────────────────────────────────────────────

function AbaConexao({ botStatus, qrImg, loadingQR, loadingRestart, onRestart, onRefreshQR, showToast }) {
  const [phone, setPhone] = useState('');
  const [msg, setMsg] = useState('');
  const [sending, setSending] = useState(false);

  const enviarTeste = async (e) => {
    e.preventDefault();
    if (!phone || !msg) return;
    setSending(true);
    try {
      await api.post('/whatsapp/conversas/0/mensagem', { mensagem: msg });
      showToast('Mensagem enviada!');
      setMsg('');
    } catch (err) {
      // Fallback: envio direto
      try {
        const conv = await api.get('/whatsapp/conversas').then(r => r.data.data.find(c => phoneDisplay(c.phone) === phone.replace(/\D/g, '')));
        if (conv) {
          await api.post(`/whatsapp/conversas/${conv.id}/mensagem`, { mensagem: msg });
          showToast('Mensagem enviada!');
          setMsg('');
        } else showToast('Conversa não encontrada. Envie uma mensagem primeiro.', 'err');
      } catch { showToast('Erro ao enviar', 'err'); }
    } finally { setSending(false); }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* Status */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-700">Status da Conexão</h3>
          <button onClick={onRefreshQR} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition"><RefreshCw size={14} /></button>
        </div>
        <div className="flex items-center gap-3">
          {botStatus?.ready ? <Wifi size={28} className="text-emerald-500" /> : <WifiOff size={28} className="text-slate-300" />}
          <BotBadge status={botStatus?.status || 'desconectado'} />
        </div>
        {botStatus?.status === 'aguardando_qr' && (
          <p className="text-sm text-blue-600 bg-blue-50 rounded-lg px-3 py-2">
            Escaneie o QR ao lado com o WhatsApp do número que será o bot da empresa.
          </p>
        )}
        <button
          onClick={onRestart}
          disabled={loadingRestart}
          className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold px-4 py-2.5 rounded-xl transition disabled:opacity-60"
        >
          {loadingRestart ? <Loader2 size={15} className="animate-spin" /> : <Smartphone size={15} />}
          {botStatus?.ready ? 'Reiniciar Bot' : 'Iniciar Bot'}
        </button>
        <div className="text-xs text-slate-400 space-y-1 pt-2 border-t border-slate-100">
          <p>• Configure <code className="bg-slate-100 px-1 rounded">WHATSAPP_ENABLED=true</code> para auto-iniciar</p>
          <p>• Monte o volume <code className="bg-slate-100 px-1 rounded">/app/whatsapp-sessions</code> no Docker para persistir a sessão</p>
          <p>• No EasyPanel: use "Montagem de Volume" (não Bind Mount) com o path <code className="bg-slate-100 px-1 rounded">/app/whatsapp-sessions</code></p>
        </div>
      </div>

      {/* QR Code */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col items-center justify-center gap-4">
        <h3 className="font-bold text-slate-700 self-start">QR Code</h3>
        {loadingQR ? (
          <Loader2 className="animate-spin text-violet-400" size={36} />
        ) : qrImg ? (
          <>
            <img src={qrImg} alt="QR Code" className="w-44 h-44 rounded-xl border border-slate-200" />
            <p className="text-xs text-slate-400 text-center">Abra o WhatsApp → Dispositivos conectados → Conectar dispositivo</p>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-slate-200 py-4">
            <QrCode size={56} />
            <p className="text-sm text-slate-400 text-center">
              {botStatus?.ready ? 'Bot conectado — QR desnecessário' : 'Inicie o bot para gerar o QR Code'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Página Principal ─────────────────────────────────────────────────────────

const TABS = [
  { id: 'conversas', label: 'Conversas', icon: MessageSquare },
  { id: 'agenda',    label: 'Agenda',    icon: Calendar },
  { id: 'conexao',   label: 'Conexão',   icon: Smartphone },
];

export default function WhatsApp() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('conversas');
  const [botStatus, setBotStatus] = useState(null);
  const [qrImg, setQrImg] = useState(null);
  const [loadingQR, setLoadingQR] = useState(false);
  const [loadingRestart, setLoadingRestart] = useState(false);
  const [conversas, setConversas] = useState([]);
  const [conversaSelecionada, setConversaSelecionada] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!isAdmin()) { navigate('/dashboard'); return; }
    fetchStatus();
    fetchConversas();
    const t = setInterval(() => { fetchStatus(); fetchConversas(); }, 8000);
    return () => clearInterval(t);
  }, []);

  const showToast = (msg, type = 'ok') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchStatus = useCallback(async () => {
    try {
      const { data } = await api.get('/whatsapp/status');
      setBotStatus(data.data);
      if (data.data.qrAvailable) fetchQR();
      else setQrImg(null);
    } catch (_) {}
  }, []);

  const fetchQR = useCallback(async () => {
    setLoadingQR(true);
    try {
      const { data } = await api.get('/whatsapp/qr');
      if (data.success) setQrImg(data.qr);
    } catch (_) { setQrImg(null); }
    finally { setLoadingQR(false); }
  }, []);

  const fetchConversas = useCallback(async () => {
    try {
      const { data } = await api.get('/whatsapp/conversas');
      if (data.success) setConversas(data.data);
    } catch (_) {}
  }, []);

  const handleRestart = async () => {
    setLoadingRestart(true);
    try {
      await api.post('/whatsapp/restart');
      showToast('Bot reiniciando…');
      setTimeout(fetchStatus, 2500);
    } catch (e) { showToast(e.response?.data?.error || 'Erro ao reiniciar', 'err'); }
    finally { setLoadingRestart(false); }
  };

  // Separa conversas com mensagem não lida (humano aguardando)
  const conversasHandover = conversas.filter(c => c.modo === 'humano_ativo');
  const conversasIA = conversas.filter(c => c.modo !== 'humano_ativo');

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden">
      <Sidebar />
      {toast && <Toast {...toast} />}

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center px-6 shrink-0 sticky top-0 z-10 gap-3">
          <MessageSquare size={20} className="text-emerald-600" />
          <h1 className="text-xl font-bold text-slate-800">WhatsApp Bot</h1>
          <span className="text-xs font-semibold bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">IA Gemini</span>
          <div className="ml-auto">
            {botStatus && <BotBadge status={botStatus.status} />}
          </div>
        </header>

        {/* Tabs */}
        <div className="bg-white border-b border-slate-200 px-6 flex gap-1 shrink-0">
          {TABS.map(t => {
            const Icon = t.icon;
            const isActive = tab === t.id;
            const badge = t.id === 'conversas' && conversasHandover.length > 0 ? conversasHandover.length : null;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition ${isActive ? 'border-violet-600 text-violet-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
              >
                <Icon size={16} />
                {t.label}
                {badge && <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{badge}</span>}
              </button>
            );
          })}
        </div>

        {/* Conteúdo */}
        <div className="flex-1 overflow-hidden">

          {/* ── Tab Conversas ── */}
          {tab === 'conversas' && (
            <div className="flex h-full">
              {/* Lista de conversas */}
              <div className={`w-80 shrink-0 border-r border-slate-200 bg-white flex flex-col overflow-hidden ${conversaSelecionada ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-3 border-b border-slate-100 flex items-center justify-between">
                  <p className="text-sm font-bold text-slate-600">Conversas ({conversas.length})</p>
                  <button onClick={fetchConversas} className="p-1 rounded hover:bg-slate-100 text-slate-400 transition"><RefreshCw size={13} /></button>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-slate-100">
                  {conversas.length === 0 && (
                    <div className="text-center py-12 text-slate-300">
                      <MessageSquare size={36} className="mx-auto mb-2" />
                      <p className="text-sm">Nenhuma conversa ainda</p>
                    </div>
                  )}
                  {[...conversasHandover, ...conversasIA].map(c => {
                    const isSelected = conversaSelecionada?.id === c.id;
                    return (
                      <button
                        key={c.id}
                        onClick={() => setConversaSelecionada(c)}
                        className={`w-full text-left px-3 py-3 transition ${isSelected ? 'bg-violet-50' : 'hover:bg-slate-50'}`}
                      >
                        <div className="flex items-center justify-between mb-0.5 gap-2">
                          <p className="text-sm font-semibold text-slate-800 truncate">
                            {c.nome_contato || phoneDisplay(c.phone)}
                          </p>
                          <div className="flex items-center gap-1 shrink-0">
                            <ModoBadge modo={c.modo} />
                            <span className="text-[10px] text-slate-300">{fmtTime(c.ultima_mensagem_em)}</span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-400 truncate">{c.empresa || phoneDisplay(c.phone)}</p>
                        {c.ultima_mensagem && (
                          <p className="text-xs text-slate-400 truncate mt-0.5">
                            {c.ultimo_remetente === 'ia' ? '🤖' : c.ultimo_remetente === 'humano' ? '👤' : ''} {c.ultima_mensagem}
                          </p>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Painel de chat */}
              <div className="flex-1 flex flex-col overflow-hidden">
                {conversaSelecionada ? (
                  <ChatPanel
                    key={conversaSelecionada.id}
                    conversa={conversaSelecionada}
                    botReady={botStatus?.ready}
                    onClose={() => setConversaSelecionada(null)}
                    onUpdate={fetchConversas}
                  />
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-300 gap-3">
                    <MessageSquare size={56} className="opacity-30" />
                    <p className="text-slate-400">Selecione uma conversa para ver as mensagens</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Tab Agenda ── */}
          {tab === 'agenda' && (
            <div className="p-6 overflow-y-auto h-full custom-scrollbar max-w-3xl mx-auto w-full">
              <AbaAgenda showToast={showToast} />
            </div>
          )}

          {/* ── Tab Conexão ── */}
          {tab === 'conexao' && (
            <div className="p-6 overflow-y-auto h-full custom-scrollbar max-w-3xl mx-auto w-full">
              <AbaConexao
                botStatus={botStatus}
                qrImg={qrImg}
                loadingQR={loadingQR}
                loadingRestart={loadingRestart}
                onRestart={handleRestart}
                onRefreshQR={fetchStatus}
                showToast={showToast}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
