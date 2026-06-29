import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Trash2, ShieldCheck, CheckCircle2, AlertTriangle } from 'lucide-react';
import { PublicHeader, PublicFooter } from '../components/SiteChrome';
import api from '../services/api';

const APPS_SUPORTADOS = [
  { slug: 'meu-lava-rapido', nome: 'Meu Lava Rápido' },
  { slug: 'missao-cumprida', nome: 'Missão Cumprida' },
  { slug: 'gestao-de-frota', nome: 'Gestão de Frota' },
  { slug: 'check-list', nome: 'Check List' },
];

const inp = 'w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none transition';
const inpErr = 'w-full border border-red-300 rounded-lg px-3 py-2.5 text-sm bg-white focus:ring-2 focus:ring-red-400 outline-none transition';

export default function ExclusaoConta() {
  const [form, setForm] = useState({ app: 'meu-lava-rapido', nome: '', email: '', motivo: '', confirmacao: false });
  const [erros, setErros] = useState({});
  const [enviado, setEnviado] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erroServidor, setErroServidor] = useState('');

  function set(campo, valor) {
    setForm((f) => ({ ...f, [campo]: valor }));
    setErros((e) => ({ ...e, [campo]: undefined }));
  }

  function validar() {
    const e = {};
    if (!form.nome.trim()) e.nome = 'Informe seu nome completo.';
    if (!form.email.trim()) e.email = 'Informe o e-mail cadastrado no app.';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'E-mail inválido.';
    if (!form.confirmacao) e.confirmacao = 'Confirme que entende que a ação é irreversível.';
    return e;
  }

  async function enviar(ev) {
    ev.preventDefault();
    const e = validar();
    if (Object.keys(e).length) { setErros(e); return; }
    setCarregando(true);
    setErroServidor('');
    try {
      await api.post('/publico/exclusao-conta', {
        app: form.app,
        nome: form.nome.trim(),
        email: form.email.trim().toLowerCase(),
        motivo: form.motivo.trim() || null,
      });
      setEnviado(true);
    } catch {
      setErroServidor('Não foi possível enviar a solicitação. Tente novamente ou entre em contato pelo e-mail suporte@studiomythos.com.br.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <PublicHeader />

      <div className="container mx-auto px-6 md:px-12 py-10 max-w-2xl">
        <Link to="/apps" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-6">
          <ArrowLeft size={16} /> Aplicativos
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <span className="w-11 h-11 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shrink-0">
            <Trash2 size={22} />
          </span>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Solicitar exclusão de conta</h1>
            <p className="text-sm text-slate-500 mt-0.5">Studio Mythos · Aplicativos</p>
          </div>
        </div>

        {enviado ? (
          <div className="bg-white border border-emerald-200 rounded-2xl p-8 text-center shadow-sm">
            <CheckCircle2 size={48} className="text-emerald-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-900 mb-2">Solicitação recebida</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Recebemos sua solicitação de exclusão de conta para <strong>{form.email}</strong>.<br />
              Nossa equipe processará o pedido em até <strong>15 dias úteis</strong> e enviará uma confirmação para o seu e-mail.
            </p>
            <p className="text-xs text-slate-400 mt-6">
              Dúvidas? Fale com a gente: suporte@studiomythos.com.br
            </p>
          </div>
        ) : (
          <>
            {/* Aviso */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 mb-6">
              <AlertTriangle size={20} className="text-amber-500 shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800 leading-relaxed">
                <strong>Ação irreversível.</strong> Ao confirmar, sua conta e todos os dados associados
                (histórico de lavagens, clientes, relatórios) serão permanentemente excluídos.
                Dados de cobrança são mantidos pelo período exigido por lei.
              </div>
            </div>

            <form onSubmit={enviar} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">

              {/* App */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Aplicativo *</label>
                <select
                  className={inp}
                  value={form.app}
                  onChange={(ev) => set('app', ev.target.value)}
                >
                  {APPS_SUPORTADOS.map((a) => (
                    <option key={a.slug} value={a.slug}>{a.nome}</option>
                  ))}
                </select>
              </div>

              {/* Nome */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nome completo *</label>
                <input
                  type="text"
                  className={erros.nome ? inpErr : inp}
                  placeholder="Seu nome conforme cadastrado"
                  value={form.nome}
                  onChange={(ev) => set('nome', ev.target.value)}
                />
                {erros.nome && <p className="text-xs text-red-500 mt-1">{erros.nome}</p>}
              </div>

              {/* E-mail */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">E-mail cadastrado no app *</label>
                <input
                  type="email"
                  className={erros.email ? inpErr : inp}
                  placeholder="email@exemplo.com"
                  value={form.email}
                  onChange={(ev) => set('email', ev.target.value)}
                />
                {erros.email && <p className="text-xs text-red-500 mt-1">{erros.email}</p>}
              </div>

              {/* Motivo */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Motivo da exclusão <span className="font-normal text-slate-400">(opcional)</span>
                </label>
                <textarea
                  className={inp + ' resize-none'}
                  rows={3}
                  placeholder="Nos ajude a melhorar contando o motivo..."
                  value={form.motivo}
                  onChange={(ev) => set('motivo', ev.target.value)}
                />
              </div>

              {/* Confirmação */}
              <div>
                <label className={`flex items-start gap-3 cursor-pointer rounded-lg p-3 border ${erros.confirmacao ? 'border-red-300 bg-red-50' : 'border-slate-200 hover:bg-slate-50'} transition`}>
                  <input
                    type="checkbox"
                    className="mt-0.5 accent-red-500 shrink-0"
                    checked={form.confirmacao}
                    onChange={(ev) => set('confirmacao', ev.target.checked)}
                  />
                  <span className="text-sm text-slate-700">
                    Entendo que a exclusão é <strong>permanente e irreversível</strong> e que todos os meus dados serão removidos.
                  </span>
                </label>
                {erros.confirmacao && <p className="text-xs text-red-500 mt-1">{erros.confirmacao}</p>}
              </div>

              {erroServidor && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">{erroServidor}</div>
              )}

              <button
                type="submit"
                disabled={carregando}
                className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white font-semibold py-3 rounded-xl transition text-sm"
              >
                <Trash2 size={16} />
                {carregando ? 'Enviando...' : 'Solicitar exclusão de conta'}
              </button>
            </form>

            {/* Info LGPD */}
            <div className="flex items-start gap-2.5 mt-5 text-xs text-slate-400">
              <ShieldCheck size={15} className="shrink-0 mt-0.5" />
              <span>
                Seus dados são tratados conforme a LGPD. Processamos esta solicitação em até 15 dias úteis.
                Para dúvidas: <a href="mailto:suporte@studiomythos.com.br" className="underline hover:text-slate-600">suporte@studiomythos.com.br</a>
              </span>
            </div>
          </>
        )}
      </div>

      <PublicFooter />
    </div>
  );
}
