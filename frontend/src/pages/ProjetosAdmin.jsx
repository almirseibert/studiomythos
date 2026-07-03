import React, { useEffect, useState } from 'react';
import {
  LayoutTemplate, Plus, Trash2, ExternalLink, Loader2, UploadCloud,
  Link2, FileArchive, Eye, EyeOff, X, Pencil,
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { Restrito } from './Administracao';
import api from '../services/api';
import { isAdmin } from '../services/auth';
import { urlDoProjeto } from '../services/sites';

const VAZIO = {
  titulo: '', subtitulo: '', descricao: '',
  cor: '#4F46E5', cor_secundaria: '#7C3AED',
  tipo: 'arquivos', url_externa: '', publicado: 1,
};

export default function ProjetosAdmin() {
  const admin = isAdmin();
  const [lista, setLista] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [form, setForm] = useState(null); // objeto = modal aberto (novo/edição)
  const [arquivo, setArquivo] = useState(null);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');

  const carregar = () => {
    setCarregando(true);
    api.get('/admin/projetos')
      .then((r) => setLista(r.data?.data || []))
      .catch(() => setLista([]))
      .finally(() => setCarregando(false));
  };
  useEffect(() => { if (admin) carregar(); }, [admin]);

  if (!admin) return <Restrito />;

  const abrirNovo = () => { setForm({ ...VAZIO }); setArquivo(null); setErro(''); };
  const abrirEdicao = (p) => {
    setForm({ ...p, publicado: p.publicado ? 1 : 0 });
    setArquivo(null); setErro('');
  };

  const salvar = async () => {
    setErro('');
    if (!form.titulo.trim()) { setErro('Informe o título.'); return; }
    if (form.tipo === 'arquivos' && !form.id && !arquivo) { setErro('Envie o arquivo .zip ou .html do site.'); return; }
    if (form.tipo === 'link' && !form.url_externa.trim()) { setErro('Informe a URL externa.'); return; }

    const fd = new FormData();
    ['titulo', 'subtitulo', 'descricao', 'cor', 'cor_secundaria', 'tipo', 'url_externa'].forEach((k) => {
      if (form[k] != null) fd.append(k, form[k]);
    });
    fd.append('publicado', form.publicado ? 1 : 0);
    if (arquivo) fd.append('arquivo', arquivo);

    setSalvando(true);
    try {
      if (form.id) await api.put(`/admin/projetos/${form.id}`, fd);
      else await api.post('/admin/projetos', fd);
      setForm(null);
      carregar();
    } catch (e) {
      setErro(e.response?.data?.error || 'Erro ao salvar o projeto.');
    } finally {
      setSalvando(false);
    }
  };

  const remover = async (p) => {
    if (!window.confirm(`Remover "${p.titulo}"? Os arquivos hospedados também serão apagados.`)) return;
    try { await api.delete(`/admin/projetos/${p.id}`); carregar(); }
    catch { alert('Erro ao remover.'); }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto custom-scrollbar">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 shrink-0 sticky top-0 z-10">
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2"><LayoutTemplate className="text-indigo-600" /> Projetos & Sites</h1>
          <button onClick={abrirNovo} className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-4 py-2 rounded-lg transition-colors">
            <Plus size={18} /> Novo projeto
          </button>
        </header>

        <div className="p-6 max-w-5xl mx-auto w-full">
          <p className="text-slate-600 mb-6">Crie cards da Central de Aplicativos e publique landing pages ou sites (ZIP/HTML) sem mexer no código.</p>

          {carregando ? (
            <div className="flex justify-center py-20 text-indigo-600"><Loader2 className="animate-spin" size={32} /></div>
          ) : lista.length === 0 ? (
            <div className="text-center text-slate-500 py-20 border-2 border-dashed border-slate-200 rounded-2xl">
              Nenhum projeto ainda. Clique em <strong>Novo projeto</strong> para publicar o primeiro.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {lista.map((p) => (
                <div key={p.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-11 h-11 rounded-xl shrink-0 flex items-center justify-center text-white font-bold"
                         style={{ background: `linear-gradient(135deg, ${p.cor}, ${p.cor_secundaria})` }}>
                      {p.tipo === 'link' ? <Link2 size={20} /> : <FileArchive size={20} />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-800 truncate">{p.titulo}</h3>
                        {p.publicado
                          ? <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded"><Eye size={11} /> No ar</span>
                          : <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded"><EyeOff size={11} /> Oculto</span>}
                      </div>
                      <p className="text-xs text-slate-500 truncate">{p.subtitulo || (p.tipo === 'link' ? 'Link externo' : `/sites/${p.slug}`)}</p>
                    </div>
                  </div>
                  {p.descricao && <p className="text-sm text-slate-600 mt-3 line-clamp-2">{p.descricao}</p>}
                  <div className="flex items-center gap-2 mt-4">
                    <a href={urlDoProjeto(p)} target="_blank" rel="noopener noreferrer"
                       className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 text-sm font-semibold">
                      <ExternalLink size={15} /> Abrir
                    </a>
                    <div className="flex-1" />
                    <button onClick={() => abrirEdicao(p)} className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg"><Pencil size={16} /></button>
                    <button onClick={() => remover(p)} className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {form && (
        <Modal onClose={() => setForm(null)}>
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <LayoutTemplate size={20} className="text-indigo-600" />
            {form.id ? 'Editar projeto' : 'Novo projeto'}
          </h2>

          <div className="space-y-4">
            <Campo label="Título *">
              <input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                     className="inp" placeholder="Ex.: Yoga Serena" />
            </Campo>
            <Campo label="Subtítulo">
              <input value={form.subtitulo || ''} onChange={(e) => setForm({ ...form, subtitulo: e.target.value })}
                     className="inp" placeholder="Ex.: Landing page · Estúdio de yoga" />
            </Campo>
            <Campo label="Descrição">
              <textarea value={form.descricao || ''} onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                        rows={3} className="inp" placeholder="Texto curto exibido no card." />
            </Campo>

            <div className="grid grid-cols-2 gap-3">
              <Campo label="Cor primária">
                <input type="color" value={form.cor} onChange={(e) => setForm({ ...form, cor: e.target.value })}
                       className="w-full h-10 rounded-lg border border-slate-200 cursor-pointer" />
              </Campo>
              <Campo label="Cor secundária">
                <input type="color" value={form.cor_secundaria} onChange={(e) => setForm({ ...form, cor_secundaria: e.target.value })}
                       className="w-full h-10 rounded-lg border border-slate-200 cursor-pointer" />
              </Campo>
            </div>

            <Campo label="Tipo de conteúdo">
              <div className="flex gap-2">
                <BotaoTipo ativo={form.tipo === 'arquivos'} onClick={() => setForm({ ...form, tipo: 'arquivos' })} icon={FileArchive} label="Arquivos (ZIP/HTML)" />
                <BotaoTipo ativo={form.tipo === 'link'} onClick={() => setForm({ ...form, tipo: 'link' })} icon={Link2} label="Link externo" />
              </div>
            </Campo>

            {form.tipo === 'arquivos' ? (
              <Campo label={form.id ? 'Substituir arquivos (opcional)' : 'Arquivo do site (.zip ou .html) *'}>
                <label className="flex items-center gap-3 border-2 border-dashed border-slate-300 rounded-xl px-4 py-4 cursor-pointer hover:border-indigo-400 transition-colors">
                  <UploadCloud className="text-indigo-500" />
                  <span className="text-sm text-slate-600 truncate">{arquivo ? arquivo.name : 'Clique para escolher um .zip (site completo) ou .html'}</span>
                  <input type="file" accept=".zip,.html,.htm" className="hidden"
                         onChange={(e) => setArquivo(e.target.files?.[0] || null)} />
                </label>
                <p className="text-[11px] text-slate-400 mt-1">ZIP deve conter um <code>index.html</code>. Máx. 50&nbsp;MB.</p>
              </Campo>
            ) : (
              <Campo label="URL externa *">
                <input value={form.url_externa || ''} onChange={(e) => setForm({ ...form, url_externa: e.target.value })}
                       className="inp" placeholder="https://..." />
              </Campo>
            )}

            <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <input type="checkbox" checked={!!form.publicado}
                     onChange={(e) => setForm({ ...form, publicado: e.target.checked ? 1 : 0 })} />
              Publicar na Central de Aplicativos
            </label>

            {erro && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{erro}</p>}
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button onClick={() => setForm(null)} className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-100 font-medium text-sm">Cancelar</button>
            <button onClick={salvar} disabled={salvando}
                    className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold text-sm px-5 py-2 rounded-lg">
              {salvando && <Loader2 className="animate-spin" size={16} />} Salvar
            </button>
          </div>
        </Modal>
      )}

      <style>{`.inp{width:100%;border:1px solid #e2e8f0;border-radius:0.6rem;padding:0.55rem 0.75rem;font-size:0.875rem;outline:none}.inp:focus{border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.15)}`}</style>
    </div>
  );
}

function Campo({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function BotaoTipo({ ativo, onClick, icon: Icon, label }) {
  return (
    <button type="button" onClick={onClick}
      className={`flex-1 inline-flex items-center justify-center gap-2 text-sm font-medium px-3 py-2 rounded-lg border transition-colors ${
        ativo ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
      }`}>
      <Icon size={16} /> {label}
    </button>
  );
}

function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"><X size={20} /></button>
        {children}
      </div>
    </div>
  );
}
