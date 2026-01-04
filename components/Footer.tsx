import React from 'react';
import { Instagram, Linkedin, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-100 py-16">
      <div className="max-w-6xl mx-auto px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold tracking-tighter font-poppins">
              <span className="text-ejn-gold">Impacto Real</span> <span className="text-ejn-teal">IEJN</span>
            </span>
          </div>
          
          <div className="flex gap-8 text-apple-text-secondary text-sm font-medium">
            <a href="#" className="hover:text-ejn-teal transition-colors">Sobre Nós</a>
            <a href="#" className="hover:text-ejn-teal transition-colors">Transparência</a>
            <a href="#" className="hover:text-ejn-teal transition-colors">Projetos</a>
            <a href="#" className="hover:text-ejn-teal transition-colors">Contato</a>
          </div>

          <div className="flex gap-4">
            <button className="p-2 bg-apple-gray rounded-full text-gray-400 hover:text-ejn-teal transition-all">
              <Instagram className="w-5 h-5" />
            </button>
            <button className="p-2 bg-apple-gray rounded-full text-gray-400 hover:text-ejn-teal transition-all">
              <Linkedin className="w-5 h-5" />
            </button>
            <button className="p-2 bg-apple-gray rounded-full text-gray-400 hover:text-ejn-teal transition-all">
              <Globe className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-50 text-center">
          <p className="text-xs text-apple-text-secondary">
            © 2024 Impacto Real IEJN. Todos os direitos reservados. Feito com impacto real.
          </p>
        </div>
      </div>
    </footer>
  );
};