import React, { useEffect, useState } from 'react';
import {
  FileText, Search, Loader2, X, Printer, Mail, Phone, MapPin, Briefcase,
  GraduationCap, Award, Target, User, ExternalLink,
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import api from '../services/api';
import { isAdmin } from '../services/auth';
import { formatDate, formatDateTime } from '../utils/formatDate';
import { Restrito } from './Administracao';

const STATUS = ['Novo', 'Em análise', 'Entrevista', 'Aprovado', 'Reprovado'];
const STATUS_COR = {
  'Novo': 'bg-blue-100 text-blue-700',
  'Em análise': 'bg-amber-100 text-amber-700',
  'Entrevista': 'bg-violet-100 text-violet-700',
  'Aprovado': 'bg-emerald-100 text-emerald-700',
  'Reprovado': 'bg-red-100 text-red-700',
};

export default function AdminCurriculos() {
  const admin = isAdmin();
  const [lista, setLista] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState('Todos');
  const [sel, setSel] = useState(null);
  const [carregandoDetalhe, setCarregandoDetalhe] = useState(false);

  useEffect(() => { if (admin) carregar(); }, [admin]);

  const carregar = async () => {
    setCarregando(true);
    try {
      const r = await api.get('/admin/curriculos');
      if (r.data.success) setLista(r.data.data);
    } catch (e) { /* ignore */ } finally { setCarregando(false); }
  };

  const abrir = async (id) => {
    setCarregandoDetalhe(true);
    setSel({ id });
    try {
      const r = await api.get(`/admin/curriculos/${id}`);
      if (r.data.success) setSel(r.data.data);
    } catch (e) { setSel(null); } finally { setCarregandoDetalhe(false); }
  };

  const mudarStatus = async (status) => {
    if (!sel?.id) return;
    try {
      await api.put(`/admin/curriculos/${sel.id}/status`, { status });
      setSel((s) => ({ ...s, status }));
      setLista((l) => l.map((x) => (x.id === sel.id ? { ...x, status } : x)));
    } catch (e) { /* ignore */ }
  };

  if (!admin) return <Restrito />;

  const filtrada = lista.filter((c) => {
    const okFiltro = filtro === 'Todos' || c.status === filtro;
    const t = busca.toLowerCase();
    const okBusca = !t || [c.nome, c.email, c.vaga_desejada, c.cidade].some((v) => (v || '').toLowerCase().includes(t));
    return okFiltro && okBusca;
  });

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto custom-scrollbar">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center px-6 shrink-0 sticky top-0 z-10">
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2"><FileText className="text-indigo-600" /> Currículos & Candidaturas</h1>
        </header>

        <div className="p-6 max-w-6xl mx-auto w-full">
          {/* filtros */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar por nome, e-mail, vaga ou cidade…" className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <select value={filtro} onChange={(e) => setFiltro(e.target.value)} className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none">
              <option>Todos</option>{STATUS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {carregando ? (
              <div className="flex justify-center py-20 text-indigo-600"><Loader2 className="animate-spin" size={28} /></div>
            ) : filtrada.length === 0 ? (
              <p className="text-center text-slate-500 py-16">Nenhum currículo encontrado.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                      <th className="px-5 py-3 font-semibold">Candidato</th>
                      <th className="px-5 py-3 font-semibold">Vaga</th>
                      <th className="px-5 py-3 font-semibold">Cidade</th>
                      <th className="px-5 py-3 font-semibold">Recebido</th>
                      <th className="px-5 py-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtrada.map((c) => (
                      <tr key={c.id} onClick={() => abrir(c.id)} className="hover:bg-slate-50 cursor-pointer transition-colors">
                        <td className="px-5 py-4">
                          <p className="font-bold text-slate-800">{c.nome}</p>
                          <p className="text-sm text-slate-500">{c.email}</p>
                        </td>
                        <td className="px-5 py-4 text-sm text-slate-600">{c.vaga_desejada || '—'}</td>
                        <td className="px-5 py-4 text-sm text-slate-600">{[c.cidade, c.estado].filter(Boolean).join(' / ') || '—'}</td>
                        <td className="px-5 py-4 text-sm text-slate-500">{formatDate(c.data_criacao)}</td>
                        <td className="px-5 py-4"><span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_COR[c.status] || 'bg-slate-100 text-slate-600'}`}>{c.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {sel && (
        <DetalheCurriculo
          dados={sel}
          carregando={carregandoDetalhe}
          onClose={() => setSel(null)}
          onStatus={mudarStatus}
        />
      )}
    </div>
  );
}

function DetalheCurriculo({ dados, carregando, onClose, onStatus }) {
  const c = dados;
  const exp = c.experiencias || [];
  const form = c.formacoes || [];
  const cursos = c.cursos || [];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-end no-print" onClick={onClose}>
      <div className="bg-white w-full max-w-2xl h-full overflow-y-auto custom-scrollbar shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* barra de ações (não imprime) */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between z-10 no-print">
          <div className="flex items-center gap-2">
            <select value={c.status || 'Novo'} onChange={(e) => onStatus(e.target.value)} className="border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none">
              {STATUS.map((s) => <option key={s}>{s}</option>)}
            </select>
            <button onClick={() => window.print()} className="inline-flex items-center gap-1.5 bg-brand-gradient text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-voltage hover:opacity-95"><Printer size={16} /> Imprimir</button>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700"><X size={22} /></button>
        </div>

        {carregando || !c.nome ? (
          <div className="flex justify-center py-24 text-indigo-600"><Loader2 className="animate-spin" size={28} /></div>
        ) : (
          <div className="print-area p-8 text-slate-800">
            {/* cabeçalho */}
            <div className="border-b-2 border-slate-200 pb-5 mb-5">
              <h2 className="text-3xl font-black text-slate-900">{c.nome}</h2>
              {c.vaga_desejada && <p className="text-indigo-600 font-semibold mt-1">{c.vaga_desejada}</p>}
              <div className="flex flex-wrap gap-x-5 gap-y-1 mt-3 text-sm text-slate-600">
                {c.email && <span className="inline-flex items-center gap-1.5"><Mail size={14} /> {c.email}</span>}
                {c.telefone && <span className="inline-flex items-center gap-1.5"><Phone size={14} /> {c.telefone}</span>}
                {(c.cidade || c.estado) && <span className="inline-flex items-center gap-1.5"><MapPin size={14} /> {[c.endereco, c.cidade, c.estado].filter(Boolean).join(', ')}</span>}
              </div>
              <div className="flex flex-wrap gap-x-5 gap-y-1 mt-1 text-sm text-slate-500">
                {c.linkedin && <a href={c.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-indigo-600"><ExternalLink size={13} /> LinkedIn</a>}
                {c.portfolio && <a href={c.portfolio} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-indigo-600"><ExternalLink size={13} /> Portfólio</a>}
              </div>
            </div>

            <DadosPessoais c={c} />

            <BlocoObjetivo c={c} />

            {c.sobre && <Bloco icon={User} titulo="Sobre"><p className="text-sm leading-relaxed whitespace-pre-wrap">{c.sobre}</p></Bloco>}

            {exp.length > 0 && (
              <Bloco icon={Briefcase} titulo="Experiência profissional">
                {exp.map((e, i) => (
                  <Item key={i} titulo={[e.cargo, e.empresa].filter(Boolean).join(' · ')} sub={e.periodo} texto={e.atividades} />
                ))}
              </Bloco>
            )}

            {form.length > 0 && (
              <Bloco icon={GraduationCap} titulo="Formação acadêmica">
                {form.map((e, i) => (
                  <Item key={i} titulo={[e.curso, e.nivel].filter(Boolean).join(' · ')} sub={[e.instituicao, e.ano].filter(Boolean).join(' — ')} />
                ))}
              </Bloco>
            )}

            {cursos.length > 0 && (
              <Bloco icon={Award} titulo="Cursos e certificações">
                {cursos.map((e, i) => (
                  <Item key={i} titulo={e.nome} sub={[e.instituicao, e.ano].filter(Boolean).join(' — ')} />
                ))}
              </Bloco>
            )}

            {c.habilidades && (
              <Bloco icon={Award} titulo="Habilidades">
                <div className="flex flex-wrap gap-2">
                  {c.habilidades.split(',').map((h, i) => h.trim() && (
                    <span key={i} className="bg-slate-100 text-slate-700 text-sm px-3 py-1 rounded-full">{h.trim()}</span>
                  ))}
                </div>
              </Bloco>
            )}

            <p className="text-xs text-slate-400 mt-8 pt-4 border-t border-slate-100">Recebido em {formatDateTime(c.data_criacao)} · origem: {c.origem || 'Site'}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function DadosPessoais({ c }) {
  const itens = [
    ['Nascimento', formatDate(c.data_nascimento)],
    ['CPF', c.cpf], ['RG', c.rg],
    ['Sexo', c.sexo], ['Estado civil', c.estado_civil],
    ['Nacionalidade', c.nacionalidade], ['CEP', c.cep],
    ['CNH', c.cnh], ['Veículo próprio', c.possui_veiculo ? 'Sim' : 'Não'],
  ].filter(([, v]) => v);
  if (itens.length === 0) return null;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 mb-6 text-sm">
      {itens.map(([k, v]) => (
        <div key={k}><span className="text-slate-400">{k}:</span> <span className="text-slate-700 font-medium">{v}</span></div>
      ))}
    </div>
  );
}

function BlocoObjetivo({ c }) {
  const itens = [
    ['Pretensão salarial', c.pretensao_salarial],
    ['Disponibilidade', c.disponibilidade],
    ['Escolaridade', c.escolaridade],
  ].filter(([, v]) => v);
  if (itens.length === 0) return null;
  return (
    <Bloco icon={Target} titulo="Objetivo">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
        {itens.map(([k, v]) => (
          <div key={k}><p className="text-slate-400 text-xs">{k}</p><p className="font-medium text-slate-700">{v}</p></div>
        ))}
      </div>
    </Bloco>
  );
}

function Bloco({ icon: Icon, titulo, children }) {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500 flex items-center gap-2 mb-3 pb-1 border-b border-slate-100">
        <Icon size={15} className="text-indigo-600" /> {titulo}
      </h3>
      {children}
    </div>
  );
}

function Item({ titulo, sub, texto }) {
  return (
    <div className="mb-3">
      <p className="font-semibold text-slate-800">{titulo}</p>
      {sub && <p className="text-sm text-slate-500">{sub}</p>}
      {texto && <p className="text-sm text-slate-600 mt-1 whitespace-pre-wrap">{texto}</p>}
    </div>
  );
}
