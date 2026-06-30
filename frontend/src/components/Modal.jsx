import React from 'react';
import { X } from 'lucide-react';

export default function Modal({ open, onClose, title, subtitle, icon, children, maxWidth = 'max-w-md' }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-obsidian/60 backdrop-blur-sm flex items-center justify-center z-[900] p-4" onClick={onClose}>
      <div
        className={`bg-white rounded-2xl shadow-2xl w-full ${maxWidth} max-h-[90vh] overflow-hidden flex flex-col dp-fade-up`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50 shrink-0">
          <div className="flex items-center gap-3">
            {icon && <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg">{icon}</div>}
            <div>
              <h2 className="font-bold text-slate-800">{title}</h2>
              {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:bg-slate-200 p-2 rounded-full transition-colors"><X size={20} /></button>
        </div>
        <div className="overflow-y-auto custom-scrollbar flex-1">{children}</div>
      </div>
    </div>
  );
}
