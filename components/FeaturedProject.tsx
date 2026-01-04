
import React from 'react';
import { ArrowRight, Star } from 'lucide-react';
import { Transacao } from '../types';

interface FeaturedProjectProps {
  transactions: Transacao[];
}

export const FeaturedProject: React.FC<FeaturedProjectProps> = ({ transactions }) => {
  const goal = 50000;
  const reached = transactions
    .filter(t => t.tipo === 'entrada' && t.status === 'confirmado' && (t.categoria === 'Doação' || t.descricao.toLowerCase().includes('líderes')))
    .reduce((acc, t) => acc + t.valor, 0);
  
  const progress = Math.min(Math.round((reached / goal) * 100), 100);

  return (
    <div className="bg-white rounded-apple-2xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] overflow-hidden h-full flex flex-col">
      <div className="relative h-56 overflow-hidden group">
        <img 
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800" 
          alt="Jovem estudando" 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-ejn-gold text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1 shadow-lg shadow-ejn-gold/30">
            <Star className="w-3 h-3 fill-white" />
            Destaque
          </span>
        </div>
      </div>
      
      <div className="p-8 flex flex-col flex-1">
        <h3 className="text-xl font-bold text-ejn-teal mb-3">Bolsa Formação Líderes 2026</h3>
        <p className="text-apple-text-secondary text-sm mb-8 leading-relaxed">
          Ajude-nos a financiar o próximo ciclo de formação para 50 jovens talentos de comunidades sub-representadas. 
        </p>
        
        <div className="mt-auto">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold text-gray-400 uppercase">Progresso da Meta</span>
            <span className="text-xs font-bold text-ejn-gold">{progress}%</span>
          </div>
          <div className="w-full h-2 bg-apple-gray rounded-full mb-8 overflow-hidden">
            <div className="h-full bg-ejn-gold rounded-full transition-all duration-1000" style={{ width: `${progress}%` }}></div>
          </div>

          <button className="w-full bg-ejn-gold text-white font-bold py-4 rounded-apple-lg hover:bg-[#D19900] transition-all transform active:scale-[0.98] shadow-lg shadow-ejn-gold/20 flex items-center justify-center gap-2">
            Investir neste Futuro
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
