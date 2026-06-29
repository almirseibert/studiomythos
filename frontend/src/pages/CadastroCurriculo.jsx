import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  User, MapPin, Target, GraduationCap, Briefcase, Award, Plus, Trash2,
  Loader2, CheckCircle2, Send, FileText,
} from 'lucide-react';
import { BrandNav, BrandFooter } from '../components/CapaceteChrome';
import { MARCA } from '../data/capacetes';
import api from '../services/api';

const ESCOLARIDADES = ['Fundamental', 'Médio', 'Técnico', 'Superior cursando', 'Superior completo', 'Pós-graduação', 'Mestrado/Doutorado'];
const DISPONIBILIDADES = ['Imediata', 'A combinar', '15 dias', '30 dias'];
const ESTADOS_CIVIS = ['Solteiro(a)', 'Casado(a)', 'Divorciado(a)', 'Viúvo(a)', 'União estável'];
const CNHS = ['Não possuo', 'A', 'B', 'AB', 'C', 'D', 'E'];

const vazioExp = () => ({ empresa: '', cargo: '', periodo: '', atividades: '' });
const vazioForm = () => ({ curso: '', instituicao: '', nivel: '', ano: '' });
const vazioCurso = () => ({ nome: '', instituicao: '', ano: '' });

export default function CadastroCurriculo() {
  const [f, setF] = useState({
    nome: '', email: '', telefone: '', data_nascimento: '', cpf: '', rg: '',
    sexo: '', estado_civil: '', nacionalidade: 'Brasileira',
    endereco: '', cidade: '', estado: '', cep: '',
    vaga_desejada: '', pretensao_salarial: '', disponibilidade: 'A combinar',
    escolaridade: '', cnh: 'Não possuo', possui_veiculo: false,
    linkedin: '', portfolio: '', habilidades: '', sobre: '',
  });
  const [experiencias, setExperiencias] = useState([vazioExp()]);
  const [formacoes, setFormacoes] = useState([vazioForm()]);
  const [cursos, setCursos] = useState([vazioCurso()]);
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState(null);

  useEffect(() => { document.title = `Cadastro de Currículo · ${MARCA.nomeCompleto}`; }, []);

  const set = (campo, valor) => setF((p) => ({ ...p, [campo]: valor }));

  const limparVazios = (arr, chaves) => arr.filter((it) => chaves.some((c) => (it[c] || '').trim()));

  const enviar = async (e) => {
    e.preventDefault();
    setErro(null);
    if (!f.nome.trim() || !f.email.trim()) {
      setErro('Preencha ao menos nome e e-mail.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setEnviando(true);
    try {
      await api.post('/publico/curriculos', {
        ...f,
        origem: MARCA.nomeCompleto,
        experiencias: limparVazios(experiencias, ['empresa', 'cargo']),
        formacoes: limparVazios(formacoes, ['curso', 'instituicao']),
        cursos: limparVazios(cursos, ['nome']),
      });
      setEnviado(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setErro(err.response?.data?.error || 'Não foi possível enviar. Tente novamente.');
    } finally {
      setEnviando(false);
    }
  };

  const grad = `linear-gradient(135deg, ${MARCA.cores.primaria}, ${MARCA.cores.destaque})`;

  if (enviado) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
        <BrandNav />
        <div className="container mx-auto px-6 py-24 max-w-xl text-center anim-pop-in">
          <CheckCircle2 size={72} className="mx-auto text-emerald-500 mb-5" />
          <h1 className="text-3xl font-extrabold text-slate-900 mb-3">Currículo enviado! 🎉</h1>
          <p className="text-slate-600 mb-8">Obrigado, <strong>{f.nome.split(' ')[0]}</strong>! Seu currículo entrou no banco de talentos da {MARCA.nomeCompleto}. Entraremos em contato assim que surgir uma oportunidade compatível.</p>
          <Link to="/capacetes" className="inline-flex items-center gap-2 text-black font-bold px-6 py-3 rounded-full hover:opacity-95 transition" style={{ background: grad }}>Voltar ao site</Link>
        </div>
        <BrandFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <BrandNav />

      <section className="text-white py-14" style={{ background: `linear-gradient(135deg, ${MARCA.cores.escura}, #1c1c22)` }}>
        <div className="container mx-auto px-6 md:px-12 max-w-3xl">
          <Link to="/trabalhe-conosco" className="text-sm text-slate-400 hover:text-white">← Trabalhe Conosco</Link>
          <h1 className="text-3xl md:text-4xl font-black mt-2 flex items-center gap-3"><FileText style={{ color: MARCA.cores.destaque }} /> Cadastro de currículo</h1>
          <p className="text-slate-400 mt-2">{MARCA.nomeCompleto} · preencha sua ficha. Campos com * são obrigatórios.</p>
        </div>
      </section>

      <form onSubmit={enviar} className="container mx-auto px-6 md:px-12 py-10 max-w-3xl space-y-6">
        {erro && <div className="bg-red-50 text-red-700 border border-red-200 rounded-xl p-4 text-sm">{erro}</div>}

        {/* DADOS PESSOAIS */}
        <Secao icon={User} titulo="Dados pessoais">
          <Grid>
            <Campo label="Nome completo*"><input className={inp} value={f.nome} onChange={(e) => set('nome', e.target.value)} required /></Campo>
            <Campo label="E-mail*"><input type="email" className={inp} value={f.email} onChange={(e) => set('email', e.target.value)} required /></Campo>
            <Campo label="Telefone / WhatsApp"><input className={inp} value={f.telefone} onChange={(e) => set('telefone', e.target.value)} /></Campo>
            <Campo label="Data de nascimento"><input type="date" className={inp} value={f.data_nascimento} onChange={(e) => set('data_nascimento', e.target.value)} /></Campo>
            <Campo label="CPF"><input className={inp} value={f.cpf} onChange={(e) => set('cpf', e.target.value)} /></Campo>
            <Campo label="RG"><input className={inp} value={f.rg} onChange={(e) => set('rg', e.target.value)} /></Campo>
            <Campo label="Sexo">
              <select className={inp} value={f.sexo} onChange={(e) => set('sexo', e.target.value)}>
                <option value="">Selecione</option><option>Feminino</option><option>Masculino</option><option>Outro</option><option>Prefiro não informar</option>
              </select>
            </Campo>
            <Campo label="Estado civil">
              <select className={inp} value={f.estado_civil} onChange={(e) => set('estado_civil', e.target.value)}>
                <option value="">Selecione</option>{ESTADOS_CIVIS.map((x) => <option key={x}>{x}</option>)}
              </select>
            </Campo>
            <Campo label="Nacionalidade"><input className={inp} value={f.nacionalidade} onChange={(e) => set('nacionalidade', e.target.value)} /></Campo>
          </Grid>
        </Secao>

        {/* ENDEREÇO */}
        <Secao icon={MapPin} titulo="Endereço">
          <Grid>
            <Campo label="Endereço" full><input className={inp} value={f.endereco} onChange={(e) => set('endereco', e.target.value)} /></Campo>
            <Campo label="Cidade"><input className={inp} value={f.cidade} onChange={(e) => set('cidade', e.target.value)} /></Campo>
            <Campo label="Estado"><input className={inp} value={f.estado} onChange={(e) => set('estado', e.target.value)} /></Campo>
            <Campo label="CEP"><input className={inp} value={f.cep} onChange={(e) => set('cep', e.target.value)} /></Campo>
          </Grid>
        </Secao>

        {/* OBJETIVO */}
        <Secao icon={Target} titulo="Objetivo profissional">
          <Grid>
            <Campo label="Vaga / cargo desejado"><input className={inp} value={f.vaga_desejada} onChange={(e) => set('vaga_desejada', e.target.value)} placeholder="Ex.: Desenvolvedor Front-end" /></Campo>
            <Campo label="Pretensão salarial"><input className={inp} value={f.pretensao_salarial} onChange={(e) => set('pretensao_salarial', e.target.value)} placeholder="Ex.: R$ 3.000" /></Campo>
            <Campo label="Disponibilidade">
              <select className={inp} value={f.disponibilidade} onChange={(e) => set('disponibilidade', e.target.value)}>{DISPONIBILIDADES.map((x) => <option key={x}>{x}</option>)}</select>
            </Campo>
            <Campo label="Escolaridade">
              <select className={inp} value={f.escolaridade} onChange={(e) => set('escolaridade', e.target.value)}>
                <option value="">Selecione</option>{ESCOLARIDADES.map((x) => <option key={x}>{x}</option>)}
              </select>
            </Campo>
            <Campo label="CNH">
              <select className={inp} value={f.cnh} onChange={(e) => set('cnh', e.target.value)}>{CNHS.map((x) => <option key={x}>{x}</option>)}</select>
            </Campo>
            <Campo label="Possui veículo próprio?">
              <label className="flex items-center gap-2 h-[42px] text-sm text-slate-700">
                <input type="checkbox" checked={f.possui_veiculo} onChange={(e) => set('possui_veiculo', e.target.checked)} className="w-4 h-4 accent-indigo-600" /> Sim, tenho veículo
              </label>
            </Campo>
            <Campo label="LinkedIn"><input className={inp} value={f.linkedin} onChange={(e) => set('linkedin', e.target.value)} placeholder="URL do perfil" /></Campo>
            <Campo label="Portfólio / site"><input className={inp} value={f.portfolio} onChange={(e) => set('portfolio', e.target.value)} placeholder="URL" /></Campo>
          </Grid>
        </Secao>

        {/* EXPERIÊNCIAS */}
        <Secao icon={Briefcase} titulo="Experiência profissional"
          acao={<BotaoAdd onClick={() => setExperiencias((a) => [...a, vazioExp()])} />}>
          <div className="space-y-4">
            {experiencias.map((it, i) => (
              <LinhaDinamica key={i} onRemove={experiencias.length > 1 ? () => setExperiencias((a) => a.filter((_, k) => k !== i)) : null}>
                <Grid>
                  <Campo label="Empresa"><input className={inp} value={it.empresa} onChange={(e) => upd(setExperiencias, i, 'empresa', e.target.value)} /></Campo>
                  <Campo label="Cargo"><input className={inp} value={it.cargo} onChange={(e) => upd(setExperiencias, i, 'cargo', e.target.value)} /></Campo>
                  <Campo label="Período"><input className={inp} value={it.periodo} onChange={(e) => upd(setExperiencias, i, 'periodo', e.target.value)} placeholder="Ex.: jan/2022 – atual" /></Campo>
                  <Campo label="Principais atividades" full><textarea rows={2} className={inp} value={it.atividades} onChange={(e) => upd(setExperiencias, i, 'atividades', e.target.value)} /></Campo>
                </Grid>
              </LinhaDinamica>
            ))}
          </div>
        </Secao>

        {/* FORMAÇÃO */}
        <Secao icon={GraduationCap} titulo="Formação acadêmica"
          acao={<BotaoAdd onClick={() => setFormacoes((a) => [...a, vazioForm()])} />}>
          <div className="space-y-4">
            {formacoes.map((it, i) => (
              <LinhaDinamica key={i} onRemove={formacoes.length > 1 ? () => setFormacoes((a) => a.filter((_, k) => k !== i)) : null}>
                <Grid>
                  <Campo label="Curso"><input className={inp} value={it.curso} onChange={(e) => upd(setFormacoes, i, 'curso', e.target.value)} /></Campo>
                  <Campo label="Instituição"><input className={inp} value={it.instituicao} onChange={(e) => upd(setFormacoes, i, 'instituicao', e.target.value)} /></Campo>
                  <Campo label="Nível"><input className={inp} value={it.nivel} onChange={(e) => upd(setFormacoes, i, 'nivel', e.target.value)} placeholder="Ex.: Bacharelado" /></Campo>
                  <Campo label="Ano de conclusão"><input className={inp} value={it.ano} onChange={(e) => upd(setFormacoes, i, 'ano', e.target.value)} /></Campo>
                </Grid>
              </LinhaDinamica>
            ))}
          </div>
        </Secao>

        {/* CURSOS */}
        <Secao icon={Award} titulo="Cursos e certificações"
          acao={<BotaoAdd onClick={() => setCursos((a) => [...a, vazioCurso()])} />}>
          <div className="space-y-4">
            {cursos.map((it, i) => (
              <LinhaDinamica key={i} onRemove={cursos.length > 1 ? () => setCursos((a) => a.filter((_, k) => k !== i)) : null}>
                <Grid>
                  <Campo label="Curso / certificação"><input className={inp} value={it.nome} onChange={(e) => upd(setCursos, i, 'nome', e.target.value)} /></Campo>
                  <Campo label="Instituição"><input className={inp} value={it.instituicao} onChange={(e) => upd(setCursos, i, 'instituicao', e.target.value)} /></Campo>
                  <Campo label="Ano"><input className={inp} value={it.ano} onChange={(e) => upd(setCursos, i, 'ano', e.target.value)} /></Campo>
                </Grid>
              </LinhaDinamica>
            ))}
          </div>
        </Secao>

        {/* HABILIDADES + SOBRE */}
        <Secao icon={Award} titulo="Habilidades & apresentação">
          <div className="space-y-4">
            <Campo label="Habilidades (separe por vírgula)" full><textarea rows={2} className={inp} value={f.habilidades} onChange={(e) => set('habilidades', e.target.value)} placeholder="Ex.: React, comunicação, inglês intermediário" /></Campo>
            <Campo label="Sobre você / carta de apresentação" full><textarea rows={4} className={inp} value={f.sobre} onChange={(e) => set('sobre', e.target.value)} placeholder="Conte um pouco da sua trajetória e do que você procura." /></Campo>
          </div>
        </Secao>

        <button type="submit" disabled={enviando} className="w-full text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-95 transition disabled:opacity-60 text-lg" style={{ background: grad }}>
          {enviando ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />} Enviar currículo
        </button>
      </form>

      <BrandFooter />
    </div>
  );
}

const inp = 'w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none';

function upd(setter, i, campo, valor) {
  setter((a) => a.map((it, k) => (k === i ? { ...it, [campo]: valor } : it)));
}

function Secao({ icon: Icon, titulo, acao, children }) {
  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Icon size={20} className="text-indigo-600" /> {titulo}</h2>
        {acao}
      </div>
      {children}
    </section>
  );
}

function Grid({ children }) {
  return <div className="grid sm:grid-cols-2 gap-4">{children}</div>;
}

function Campo({ label, full, children }) {
  return (
    <div className={full ? 'sm:col-span-2' : ''}>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      {children}
    </div>
  );
}

function BotaoAdd({ onClick }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-800">
      <Plus size={16} /> Adicionar
    </button>
  );
}

function LinhaDinamica({ onRemove, children }) {
  return (
    <div className="relative bg-slate-50 border border-slate-200 rounded-xl p-4">
      {onRemove && (
        <button type="button" onClick={onRemove} className="absolute top-3 right-3 text-slate-400 hover:text-red-500" title="Remover">
          <Trash2 size={16} />
        </button>
      )}
      {children}
    </div>
  );
}
