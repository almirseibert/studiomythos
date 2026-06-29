import React, { useState, useEffect } from 'react';
import { ShieldCheck, Plus, Mail, Lock, User, AlertCircle, CheckCircle, Briefcase } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import api from '../services/api';
import { getUser, isAdmin } from '../services/auth';

export default function UsuariosAdmin() {
  const [usuarios, setUsuarios] = useState([]);
  const [novoUsuario, setNovoUsuario] = useState({ nome: '', email: '', senha: '', papel: 'vendedor' });
  const [mensagem, setMensagem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const usuarioAtual = getUser();
  const admin = isAdmin();

  useEffect(() => { carregarUsuarios(); }, []);

  const carregarUsuarios = async () => {
    try {
      const response = await api.get('/auth/usuarios');
      if (response.data.success) setUsuarios(response.data.data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    }
  };

  const handleCriarUsuario = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMensagem(null);
    try {
      const response = await api.post('/auth/usuarios', novoUsuario);
      if (response.data.success) {
        setMensagem({ tipo: 'sucesso', texto: 'Utilizador criado com sucesso!' });
        setNovoUsuario({ nome: '', email: '', senha: '', papel: 'vendedor' });
        carregarUsuarios();
      }
    } catch (error) {
      setMensagem({ tipo: 'erro', texto: error.response?.data?.error || 'Erro ao criar utilizador.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!admin) {
    return (
      <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-100">
          <ShieldCheck size={64} className="text-red-500 mb-4" />
          <h1 className="text-3xl font-bold mb-2">Acesso Restrito</h1>
          <p className="text-slate-600 text-center max-w-md">Apenas administradores podem gerir acessos.</p>
        </main>
      </div>
    );
  }

  const papelBadge = (user) => {
    if (user.email === 'almir.seibert@gmail.com') return <span className="bg-red-100 text-red-700 text-xs font-bold px-2.5 py-1 rounded-full border border-red-200">Super Admin</span>;
    if (user.papel === 'admin') return <span className="bg-violet-100 text-violet-700 text-xs font-bold px-2.5 py-1 rounded-full border border-violet-200">Administrador</span>;
    return <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-full border border-indigo-200">Vendedor</span>;
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto custom-scrollbar">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center px-6 shrink-0 sticky top-0 z-10">
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2"><ShieldCheck className="text-indigo-600" /> Gestão de Acessos</h1>
        </header>

        <div className="p-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 self-start">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Adicionar Utilizador</h2>
            {mensagem && (
              <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 text-sm ${mensagem.tipo === 'sucesso' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                {mensagem.tipo === 'sucesso' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}{mensagem.texto}
              </div>
            )}
            <form onSubmit={handleCriarUsuario} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input type="text" value={novoUsuario.nome} onChange={e => setNovoUsuario({ ...novoUsuario, nome: e.target.value })} className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input type="email" value={novoUsuario.email} onChange={e => setNovoUsuario({ ...novoUsuario, email: e.target.value })} className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Palavra-passe</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input type="password" value={novoUsuario.senha} onChange={e => setNovoUsuario({ ...novoUsuario, senha: e.target.value })} minLength="6" className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Papel</label>
                <select value={novoUsuario.papel} onChange={e => setNovoUsuario({ ...novoUsuario, papel: e.target.value })} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-indigo-500 outline-none">
                  <option value="vendedor">Vendedor</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              <button type="submit" disabled={isLoading} className="w-full bg-brand-gradient text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 hover:opacity-95 transition shadow-voltage">
                {isLoading ? 'A gravar…' : <><Plus size={18} /> Criar Acesso</>}
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden self-start">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h2 className="text-lg font-bold text-slate-800">Equipa ({usuarios.length})</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase text-slate-500">
                    <th className="px-6 py-3 font-semibold">Nome & E-mail</th>
                    <th className="px-6 py-3 font-semibold">Papel</th>
                    <th className="px-6 py-3 font-semibold text-center">Leads</th>
                    <th className="px-6 py-3 font-semibold text-center">Ganhos</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {usuarios.map(user => (
                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-800">{user.nome}</p>
                        <p className="text-sm text-slate-500">{user.email}</p>
                      </td>
                      <td className="px-6 py-4">{papelBadge(user)}</td>
                      <td className="px-6 py-4 text-center font-medium text-slate-600">{user.leads ?? 0}</td>
                      <td className="px-6 py-4 text-center font-semibold text-emerald-600">{user.ganhos ?? 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
