import React, { useState, useCallback } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const ESTILOS = {
  success: { icon: CheckCircle, ring: 'border-emerald-200', accent: 'text-emerald-500' },
  error: { icon: AlertCircle, ring: 'border-red-200', accent: 'text-red-500' },
  info: { icon: Info, ring: 'border-indigo-200', accent: 'text-indigo-500' },
};

export function useToast() {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast((t) => (t && t.id ? null : t)), 4000);
  }, []);

  const ToastHost = () => {
    if (!toast) return null;
    const cfg = ESTILOS[toast.type] || ESTILOS.info;
    const Icon = cfg.icon;
    return (
      <div className="fixed bottom-6 right-6 z-[1000] dp-fade-up">
        <div className={`bg-white px-5 py-4 rounded-xl shadow-2xl border ${cfg.ring} flex items-center gap-3 max-w-sm`}>
          <Icon className={cfg.accent} size={22} />
          <p className="font-medium text-slate-800 text-sm flex-1">{toast.message}</p>
          <button onClick={() => setToast(null)} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
        </div>
      </div>
    );
  };

  return { showToast, ToastHost };
}

export default useToast;
