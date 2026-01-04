import React from 'react';
import { TrendingUp, Sparkles } from 'lucide-react';

interface ImpactHeroProps {
  impactCount: number;
  totalInvested: number;
}

export const ImpactHero: React.FC<ImpactHeroProps> = ({ impactCount, totalInvested }) => {
  return (
    <div className="bg-white p-10 md:p-14 rounded-apple-2xl shadow-[0_4px_20px_-12px_rgba(0,0,0,0.05)] mb-12 transition-all hover:shadow-[0_8px_30px_-10px_rgba(0,0,0,0.08)] relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
        <Sparkles className="w-24 h-24 text-ejn-gold" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-10">
          <TrendingUp className="w-4 h-4 text-ejn-teal" />
          <h2 className="font-poppins text-xs font-bold text-ejn-teal uppercase tracking-widest opacity-60">
            Seu impacto
          </h2>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-end gap-10 md:gap-16">
          <div className="flex-1">
            <div className="text-4xl md:text-5xl font-bold text-ejn-gold mb-2 flex items-baseline gap-3 flex-wrap font-poppins tracking-tighter">
              {impactCount}
              <span className="text-xl md:text-2xl font-bold text-ejn-teal uppercase tracking-tight">Líderes formados</span>
            </div>
            <p className="text-lg md:text-2xl font-extralight text-ejn-teal opacity-80 leading-tight">
              Amanhãs despertados hoje.
            </p>
          </div>
          
          <div className="md:border-l border-gray-100 md:pl-16 mt-6 md:mt-0 flex flex-col justify-end pb-2">
            <p className="text-apple-text-secondary text-[10px] font-bold mb-1 tracking-widest uppercase opacity-60">
              Total investido
            </p>
            <p className="text-2xl md:text-3xl font-bold text-gray-900 font-poppins tracking-tight">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalInvested)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};