import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Sparkles, Instagram } from 'lucide-react';
import { MARCA } from '../data/capacetes';

const waLink = (msg) =>
  `https://wa.me/${MARCA.whatsapp}?text=${encodeURIComponent(msg)}`;

function Wordmark() {
  return (
    <Link to="/capacetes" className="flex items-center gap-2 group">
      <span
        className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white shadow-lg"
        style={{ background: `linear-gradient(135deg, ${MARCA.cores.primaria}, ${MARCA.cores.destaque})` }}
      >
        {MARCA.nome.charAt(0)}
      </span>
      <span className="text-xl font-black tracking-tight text-white leading-none">
        {MARCA.nome}
        {MARCA.nomeCompleto.replace(MARCA.nome, '').trim() && (
          <span className="font-semibold ml-1" style={{ color: MARCA.cores.destaque }}>
            {MARCA.nomeCompleto.replace(MARCA.nome, '').trim()}
          </span>
        )}
      </span>
    </Link>
  );
}

export function BrandNav() {
  const [open, setOpen] = useState(false);
  const links = [
    { to: '/capacetes#modelos', label: 'Modelos' },
    { to: '/capacetes#como', label: 'Como funciona' },
    { to: '/trabalhe-conosco', label: 'Trabalhe Conosco' },
  ];
  return (
    <header className="sticky top-0 z-50 bg-black/70 backdrop-blur-md border-b border-white/10">
      <div className="container mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
        <Wordmark />
        <nav className="hidden md:flex items-center gap-7">
          {links.map((l) => (
            <a key={l.label} href={l.to} className="text-sm font-medium text-slate-300 hover:text-white transition-colors">{l.label}</a>
          ))}
          <Link
            to="/capacetes/personalizar"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold text-black"
            style={{ background: MARCA.cores.destaque }}
          >
            <Sparkles size={15} /> Personalizar
          </Link>
        </nav>
        <button className="md:hidden text-white" onClick={() => setOpen(!open)}>{open ? <X size={26} /> : <Menu size={26} />}</button>
      </div>
      {open && (
        <div className="md:hidden bg-black border-t border-white/10 flex flex-col p-5 gap-3">
          {links.map((l) => (
            <a key={l.label} href={l.to} onClick={() => setOpen(false)} className="text-slate-200 font-medium">{l.label}</a>
          ))}
          <Link to="/capacetes/personalizar" className="mt-1 text-center px-4 py-2.5 rounded-full font-bold text-black" style={{ background: MARCA.cores.destaque }}>Personalizar Agora</Link>
        </div>
      )}
    </header>
  );
}

export function BrandFooter() {
  return (
    <footer className="bg-black text-slate-400 border-t border-white/10">
      <div className="container mx-auto px-6 md:px-10 py-12">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div className="max-w-sm">
            <Wordmark />
            <p className="text-sm mt-4 leading-relaxed">{MARCA.descricao}</p>
          </div>
          <div className="flex gap-12">
            <div>
              <p className="text-white font-semibold text-sm mb-3">Capacetes</p>
              <ul className="space-y-2 text-sm">
                <li><Link to="/capacetes/personalizar" className="hover:text-white">Personalizar</Link></li>
                <li><a href="/capacetes#modelos" className="hover:text-white">Modelos</a></li>
                <li><a href={waLink('Olá! Quero saber mais sobre os capacetes personalizados.')} target="_blank" rel="noreferrer" className="hover:text-white">WhatsApp</a></li>
              </ul>
            </div>
            <div>
              <p className="text-white font-semibold text-sm mb-3">Empresa</p>
              <ul className="space-y-2 text-sm">
                <li><Link to="/trabalhe-conosco" className="hover:text-white">Trabalhe Conosco</Link></li>
                <li><a href={`mailto:${MARCA.email}`} className="hover:text-white">Contato</a></li>
                <li><Link to="/" className="hover:text-white">Studio Mythos</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 mt-10 pt-6 text-xs flex flex-col md:flex-row justify-between gap-2">
          <p>© {new Date().getFullYear()} {MARCA.nomeCompleto}. Todos os direitos reservados.</p>
          <p className="flex items-center gap-1.5"><Instagram size={13} /> {MARCA.instagram} · um site <Link to="/" className="text-slate-300 hover:text-white">Studio Mythos</Link></p>
        </div>
      </div>
    </footer>
  );
}

export { waLink };
