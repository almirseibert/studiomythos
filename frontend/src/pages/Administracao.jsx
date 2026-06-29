import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Inbox, FileText, Receipt, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import api from '../services/api';
import { isAdmin } from '../services/auth';

export default function Administracao() {
  const admin = isAdmin();
  const [contagens, setContagens] = useState({ curriculos: null, orcamentos: null });
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (!admin) return;
    Promise.all([
      api.get('/admin/curriculos').catch(() => ({ data: { data: [] } })),
      api.get('/admin/orcamentos').catch(() => ({ data: { data: [] } })),
    ]).then(([c, o]) => {
      setContagens({
        curriculos: c.data?.data || [],
        orcamentos: o.data?.data || [],
      });
    }).finally(() => setCarregando(false));
  }, [admin]);

  if (!admin) return <Restrito />;

  const novosCurriculos = (contagens.curriculos || []).filter((x) => x.status === 'Novo').length;
  const novosOrcamentos = (contagens.orcamentos || []).filter((x) => x.status === 'Novo').length;

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto custom-scrollbar">
        <header className="bg-white border-b border-slate-200 h-16 flex items-center px-6 shrink-0 sticky top-0 z-10">
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2"><Inbox className="text-indigo-600" /> Administração</h1>
        </header>

        <div className="p-6 max-w-5xl mx-auto w-full">
          <p className="text-slate-600 mb-6">Solicitações e cadastros recebidos pelo site.</p>
          {carregando ? (
            <div className="flex justify-center py-20 text-indigo-600"><Loader2 className="animate-spin" size={32} /></div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-6">
              <CardAdmin
                to="/admin/curriculos"
                icon={FileText}
                titulo="Currículos / Candidaturas"
                total={(contagens.curriculos || []).length}
                novos={novosCurriculos}
                cor="bg-indigo-50 text-indigo-600"
              />
              <CardAdmin
                to="/admin/orcamentos"
                icon={Receipt}
                titulo="Solicitações de Orçamento"
                total={(contagens.orcamentos || []).length}
                novos={novosOrcamentos}
                cor="bg-emerald-50 text-emerald-600"
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function CardAdmin({ to, icon: Icon, titulo, total, novos, cor }) {
  return (
    <Link to={to} className="group bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md hover:-translate-y-0.5 transition-all">
      <div className="flex items-start justify-between">
        <div className={`p-3 rounded-xl ${cor}`}><Icon size={26} /></div>
        {novos > 0 && <span className="bg-red-100 text-red-700 text-xs font-bold px-2.5 py-1 rounded-full">{novos} novo{novos > 1 ? 's' : ''}</span>}
      </div>
      <h2 className="font-bold text-slate-800 text-lg mt-4">{titulo}</h2>
      <p className="text-3xl font-extrabold text-slate-900 mt-1">{total}</p>
      <span className="inline-flex items-center gap-1.5 text-indigo-600 font-semibold text-sm mt-3 group-hover:gap-2.5 transition-all">Abrir <ArrowRight size={16} /></span>
    </Link>
  );
}

export function Restrito() {
  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-100">
        <ShieldCheck size={64} className="text-red-500 mb-4" />
        <h1 className="text-3xl font-bold mb-2">Acesso Restrito</h1>
        <p className="text-slate-600 text-center max-w-md">Apenas administradores podem acessar esta área.</p>
      </main>
    </div>
  );
}
