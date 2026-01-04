
import React from 'react';
import { TrendingUp, Sparkles } from 'lucide-react';

interface ImpactHeroProps {
  impactCount: number;
  totalInvested: number;
}

export const ImpactHero: React.FC<ImpactHeroProps> = ({ impactCount, totalInvested }) => {
  return (
    <div className="bg-white p-8 md:p-12 rounded-apple-2xl shadow-[0_8px_40px_-12px_rgba(0,0,0,0.06)] mb-8 transition-all hover:shadow-[0_12px_50px_-10px_rgba(0,0,0,0.1)] relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
        <Sparkles className="w-32 h-32 text-ejn-gold" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-8">
          <TrendingUp className="w-5 h-5 text-ejn-teal" />
          <h2 className="font-poppins text-lg font-bold text-ejn-teal uppercase tracking-widest text-[11px] md:text-[13px]">
            Seu impacto
          </h2>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-12">
          <div className="flex-1">
            <div className="text-5xl md:text-7xl font-bold text-ejn-gold mb-3 flex items-baseline gap-3 flex-wrap font-poppins tracking-tighter">
              {impactCount}
              <span className="text-2xl md:text-3xl font-bold text-ejn-teal uppercase tracking-tight">Líderes formados</span>
            </div>
            <p className="text-xl md:text-3xl font-extralight text-ejn-teal opacity-90 leading-tight">
              Amanhãs despertados hoje.
            </p>
          </div>
          
          <div className="md:border-l border-gray-100 md:pl-12 mt-6 md:mt-0 flex flex-col justify-end pb-3">
            <p className="text-apple-text-secondary text-xs md:text-sm font-extralight mb-1 tracking-wide uppercase font-bold">
              Total investido
            </p>
            <p className="text-3xl md:text-4xl font-bold text-gray-900 font-poppins tracking-tighter">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalInvested)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
