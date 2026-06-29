import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { setSession } from '../services/auth';
import { LogoMark } from '../components/Logo';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErro('');
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.success) {
        setSession(response.data.token, response.data.usuario);
        navigate('/dashboard');
      }
    } catch (error) {
      setErro(error.response?.data?.error || 'Erro de ligação ao servidor. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans relative">
      <button onClick={() => navigate('/')} className="absolute top-8 left-8 text-slate-500 hover:text-slate-800 flex items-center gap-2 transition-colors">
        <ArrowRight className="rotate-180" size={20} /> Voltar ao Site
      </button>

      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row z-10">
        {/* Lado escuro / marca */}
        <div className="w-full md:w-1/2 bg-obsidian p-12 text-white flex flex-col justify-center relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-10 w-72 h-72 bg-violet-600/20 rounded-full blur-3xl" />
          <div className="relative z-10">
            <LogoMark size={56} />
            <h1 className="text-4xl font-extrabold mt-8 mb-4 leading-tight">O motor do seu <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">crescimento digital</span></h1>
            <p className="text-slate-400 text-lg">Capte clientes, prospecte no mapa e feche mais negócios — tudo num só lugar.</p>
          </div>
        </div>

        {/* Formulário */}
        <div className="w-full md:w-1/2 p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800">Bem-vindo de volta 👋</h2>
            <p className="text-slate-500 mt-2">Insira as suas credenciais para continuar.</p>
          </div>

          {erro && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
              <AlertCircle size={20} /><p className="text-sm font-medium">{erro}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">E-mail Corporativo</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 transition-all" required />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">Palavra-passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 transition-all" required />
              </div>
            </div>
            <button type="submit" disabled={isLoading} className="w-full bg-brand-gradient text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-voltage hover:opacity-95">
              {isLoading ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <>Entrar no Sistema <ArrowRight size={20} /></>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
