import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles, Check, Loader2, CheckCircle2, Send, MessageCircle, RotateCcw,
} from 'lucide-react';
import HelmetSVG from '../components/HelmetSVG';
import { BrandNav, BrandFooter, waLink } from '../components/CapaceteChrome';
import api from '../services/api';
import { formatCurrency } from '../utils/formatCurrency';
import {
  MARCA, CORES_BASE, VISEIRAS, GRAFISMOS, CORES_GRAFISMO, TAMANHOS, MODELOS,
  calcularPreco, acharViseira, acharGrafismo, acharModelo,
} from '../data/capacetes';

export default function PersonalizarCapacete() {
  const [config, setConfig] = useState({
    corBase: CORES_BASE[0].hex,
    corBaseNome: CORES_BASE[0].nome,
    viseira: 'transparente',
    grafismo: 'nenhum',
    corGrafismo: CORES_GRAFISMO[0].hex,
    corGrafismoNome: CORES_GRAFISMO[0].nome,
    tamanho: TAMANHOS[2].id,
    modelo: MODELOS[0].id,
  });
  const [contato, setContato] = useState({ nome: '', email: '', telefone: '', observacoes: '' });
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState(null);

  const set = (patch) => setConfig((c) => ({ ...c, ...patch }));
  const preco = useMemo(() => calcularPreco(config), [config]);

  const resumoTexto = () => {
    const v = acharViseira(config.viseira);
    const g = acharGrafismo(config.grafismo);
    const m = acharModelo(config.modelo);
    const tam = TAMANHOS.find((t) => t.id === config.tamanho);
    return [
      `Capacete personalizado ${MARCA.nome}`,
      `• Modelo: ${m.nome}`,
      `• Cor base: ${config.corBaseNome}`,
      `• Viseira: ${v.nome}`,
      `• Grafismo: ${g.nome}${config.grafismo !== 'nenhum' ? ` (${config.corGrafismoNome})` : ''}`,
      `• Tamanho: ${tam?.nome || config.tamanho}`,
      `• Valor estimado: ${formatCurrency(preco)}`,
    ].join('\n');
  };

  const enviarOrcamento = async (e) => {
    e.preventDefault();
    setErro(null);
    if (!contato.nome || (!contato.email && !contato.telefone)) {
      setErro('Informe seu nome e ao menos um contato (e-mail ou telefone).');
      return;
    }
    setEnviando(true);
    try {
      await api.post('/publico/orcamentos', {
        nome: contato.nome,
        email: contato.email,
        telefone: contato.telefone,
        tipo: 'Capacete personalizado',
        descricao: contato.observacoes,
        valor_estimado: preco,
        dados: { ...config, resumo: resumoTexto(), tamanhoNome: TAMANHOS.find((t) => t.id === config.tamanho)?.nome, modeloNome: acharModelo(config.modelo).nome, viseiraNome: acharViseira(config.viseira).nome, grafismoNome: acharGrafismo(config.grafismo).nome },
      });
      setEnviado(true);
    } catch (err) {
      setErro(err.response?.data?.error || 'Não foi possível enviar. Tente novamente.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 font-sans text-white">
      <BrandNav />

      <div className="container mx-auto px-4 md:px-10 py-8">
        <div className="mb-6">
          <Link to="/capacetes" className="text-sm text-slate-400 hover:text-white">← Voltar para {MARCA.nome}</Link>
          <h1 className="text-3xl md:text-4xl font-black mt-2 flex items-center gap-3">
            <Sparkles style={{ color: MARCA.cores.destaque }} /> Personalize seu capacete
          </h1>
          <p className="text-slate-400 mt-1">Monte ao vivo e veja o valor na hora.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* PREVIEW */}
          <div className="lg:sticky lg:top-24 self-start">
            <div className="bg-gradient-to-b from-white/10 to-transparent border border-white/10 rounded-3xl p-4">
              <HelmetSVG
                corBase={config.corBase}
                viseira={config.viseira}
                grafismo={config.grafismo}
                corGrafismo={config.corGrafismo}
                className="w-full max-w-lg mx-auto"
              />
            </div>
            <div className="mt-4 flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl px-5 py-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">Valor estimado</p>
                <p className="text-3xl font-black" style={{ color: MARCA.cores.destaque }}>{formatCurrency(preco)}</p>
              </div>
              <a href="#orcamento" className="px-5 py-3 rounded-full font-bold text-black" style={{ background: MARCA.cores.destaque }}>Solicitar orçamento</a>
            </div>
          </div>

          {/* OPÇÕES */}
          <div className="space-y-8">
            {/* Modelo */}
            <Bloco titulo="Modelo">
              <div className="grid sm:grid-cols-3 gap-3">
                {MODELOS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => set({ modelo: m.id })}
                    className={`text-left rounded-xl border p-3 transition-all ${config.modelo === m.id ? 'border-yellow-400 bg-white/10' : 'border-white/10 bg-white/5 hover:border-white/30'}`}
                  >
                    <p className="font-bold text-sm">{m.nome}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{m.desc}</p>
                  </button>
                ))}
              </div>
            </Bloco>

            {/* Cor base */}
            <Bloco titulo="Cor base" valor={config.corBaseNome}>
              <div className="flex flex-wrap gap-3">
                {CORES_BASE.map((c) => (
                  <button
                    key={c.id}
                    title={c.nome}
                    onClick={() => set({ corBase: c.hex, corBaseNome: c.nome })}
                    className={`w-11 h-11 rounded-full border-2 transition-transform hover:scale-110 ${config.corBase === c.hex ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-zinc-950 border-white' : 'border-white/20'}`}
                    style={{ background: c.hex }}
                  >
                    {config.corBase === c.hex && <Check size={16} className="mx-auto" color={['#FAFAFA', '#FACC15'].includes(c.hex) ? '#000' : '#fff'} />}
                  </button>
                ))}
              </div>
            </Bloco>

            {/* Viseira */}
            <Bloco titulo="Viseira" valor={acharViseira(config.viseira).nome}>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {VISEIRAS.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => set({ viseira: v.id })}
                    className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-all ${config.viseira === v.id ? 'border-yellow-400 bg-white/10' : 'border-white/10 bg-white/5 hover:border-white/30'}`}
                  >
                    {v.nome}{v.extra ? <span className="block text-[10px] text-slate-400">+{formatCurrency(v.extra)}</span> : <span className="block text-[10px] text-slate-500">incluso</span>}
                  </button>
                ))}
              </div>
            </Bloco>

            {/* Grafismo */}
            <Bloco titulo="Grafismo / pintura" valor={acharGrafismo(config.grafismo).nome}>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                {GRAFISMOS.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => set({ grafismo: g.id })}
                    className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-all ${config.grafismo === g.id ? 'border-yellow-400 bg-white/10' : 'border-white/10 bg-white/5 hover:border-white/30'}`}
                  >
                    {g.nome}{g.extra ? <span className="block text-[10px] text-slate-400">+{formatCurrency(g.extra)}</span> : <span className="block text-[10px] text-slate-500">grátis</span>}
                  </button>
                ))}
              </div>
              {config.grafismo !== 'nenhum' && (
                <div>
                  <p className="text-xs text-slate-400 mb-2">Cor do grafismo: <strong className="text-white">{config.corGrafismoNome}</strong></p>
                  <div className="flex flex-wrap gap-3">
                    {CORES_GRAFISMO.map((c) => (
                      <button
                        key={c.id}
                        title={c.nome}
                        onClick={() => set({ corGrafismo: c.hex, corGrafismoNome: c.nome })}
                        className={`w-9 h-9 rounded-full border-2 transition-transform hover:scale-110 ${config.corGrafismo === c.hex ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-zinc-950 border-white' : 'border-white/20'}`}
                        style={{ background: c.hex }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </Bloco>

            {/* Tamanho */}
            <Bloco titulo="Tamanho">
              <div className="flex flex-wrap gap-2">
                {TAMANHOS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => set({ tamanho: t.id })}
                    className={`rounded-lg border px-3 py-2 text-sm font-medium transition-all ${config.tamanho === t.id ? 'border-yellow-400 bg-white/10' : 'border-white/10 bg-white/5 hover:border-white/30'}`}
                  >
                    {t.nome}
                  </button>
                ))}
              </div>
            </Bloco>

            {/* ORÇAMENTO */}
            <div id="orcamento" className="bg-white/5 border border-white/10 rounded-3xl p-6">
              {enviado ? (
                <div className="text-center py-6 anim-pop-in">
                  <CheckCircle2 size={56} className="mx-auto mb-3 text-emerald-400" />
                  <h3 className="text-2xl font-black mb-2">Solicitação enviada! 🎉</h3>
                  <p className="text-slate-300 max-w-md mx-auto">Recebemos a configuração do seu capacete. Em breve entraremos em contato com o orçamento final.</p>
                  <div className="flex flex-col sm:flex-row justify-center gap-3 mt-6">
                    <a href={waLink(resumoTexto())} target="_blank" rel="noreferrer" className="px-6 py-3 rounded-full font-bold text-black flex items-center justify-center gap-2" style={{ background: MARCA.cores.destaque }}>
                      <MessageCircle size={18} /> Adiantar no WhatsApp
                    </a>
                    <button onClick={() => { setEnviado(false); setContato({ nome: '', email: '', telefone: '', observacoes: '' }); }} className="px-6 py-3 rounded-full font-semibold border border-white/20 hover:bg-white/10 flex items-center justify-center gap-2">
                      <RotateCcw size={16} /> Montar outro
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-black mb-1">Solicitar orçamento</h3>
                  <p className="text-sm text-slate-400 mb-5">Enviamos o valor final e o prazo de produção. Sem compromisso.</p>
                  {erro && <div className="mb-4 text-sm bg-red-500/15 text-red-300 border border-red-500/30 rounded-lg p-3">{erro}</div>}
                  <form onSubmit={enviarOrcamento} className="space-y-3">
                    <input value={contato.nome} onChange={(e) => setContato({ ...contato, nome: e.target.value })} placeholder="Seu nome*" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-yellow-400" />
                    <div className="grid sm:grid-cols-2 gap-3">
                      <input value={contato.email} onChange={(e) => setContato({ ...contato, email: e.target.value })} type="email" placeholder="E-mail" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-yellow-400" />
                      <input value={contato.telefone} onChange={(e) => setContato({ ...contato, telefone: e.target.value })} placeholder="WhatsApp / telefone" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-yellow-400" />
                    </div>
                    <textarea value={contato.observacoes} onChange={(e) => setContato({ ...contato, observacoes: e.target.value })} rows={2} placeholder="Observações (opcional)" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-yellow-400 resize-none" />
                    <div className="flex items-center justify-between gap-4 pt-1">
                      <p className="text-sm text-slate-400">Total: <strong className="text-white text-lg">{formatCurrency(preco)}</strong></p>
                      <button type="submit" disabled={enviando} className="px-6 py-3 rounded-full font-bold text-black flex items-center gap-2 disabled:opacity-60" style={{ background: MARCA.cores.destaque }}>
                        {enviando ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />} Enviar
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <BrandFooter />
    </div>
  );
}

function Bloco({ titulo, valor, children }) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-3">
        <h2 className="font-bold text-lg">{titulo}</h2>
        {valor && <span className="text-sm text-slate-400">{valor}</span>}
      </div>
      {children}
    </div>
  );
}
