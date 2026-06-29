import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Logo, { LogoMark } from './Logo';

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="container mx-auto px-6 md:px-12 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center"><Logo size={34} variant="dark" /></Link>
        <nav className="flex items-center gap-6">
          <Link to="/apps" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors hidden sm:block">Aplicativos</Link>
          <Link to="/capacetes" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors hidden sm:block">Capacetes</Link>
          <a href="/#servicos" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors hidden sm:block">Serviços</a>
          <a href="/#contato" className="flex items-center gap-1.5 bg-obsidian text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-slate-800 transition-colors">
            Falar com especialista <ArrowRight size={15} />
          </a>
        </nav>
      </div>
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="bg-obsidian text-slate-400 py-12">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-8">
          <div className="max-w-sm">
            <Logo size={36} variant="light" />
            <p className="text-sm mt-4 leading-relaxed">Software house e agência digital. Construímos produtos digitais que crescem negócios.</p>
          </div>
          <div className="flex gap-12">
            <div>
              <p className="text-white font-semibold text-sm mb-3">Empresa</p>
              <ul className="space-y-2 text-sm">
                <li><a href="/#servicos" className="hover:text-white transition-colors">Serviços</a></li>
                <li><Link to="/apps" className="hover:text-white transition-colors">Aplicativos</Link></li>
                <li><Link to="/capacetes" className="hover:text-white transition-colors">Capacetes</Link></li>
                <li><a href="/#contato" className="hover:text-white transition-colors">Contato</a></li>
              </ul>
            </div>
            <div>
              <p className="text-white font-semibold text-sm mb-3">Acesso</p>
              <ul className="space-y-2 text-sm">
                <li><Link to="/login" className="hover:text-white transition-colors">Painel interno</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 text-sm text-slate-500 flex flex-col md:flex-row justify-between gap-2">
          <p>© 2026 Studio Mythos. Todos os direitos reservados.</p>
          <p>contato@studiomythos.com.br</p>
        </div>
      </div>
    </footer>
  );
}
