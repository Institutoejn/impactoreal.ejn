import React from 'react';
import { TrendingUp, Sparkles } from 'lucide-react';

interface ImpactHeroProps {
  impactCount: number;
  totalInvested: number;
}

export const ImpactHero: React.FC<ImpactHeroProps> = ({ impactCount, totalInvested }) => {
  return (
    <div className="bg-white p-6 md:p-10 rounded-apple-2xl shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] mb-6 md:mb-8 transition-all hover:shadow-[0_12px_50px_-10px_rgba(0,0,0,0.1)] relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
        <Sparkles className="w-24 h-24 md:w-32 md:h-32 text-ejn-gold" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-ejn-teal" />
          <h2 className="font-poppins text-lg font-bold text-ejn-teal uppercase tracking-widest text-[11px] md:text-[13px]">
            Capital Humano em Desenvolvimento
          </h2>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-end gap-2 md:gap-8">
          <div className="flex-1">
            <div className="text-4xl md:text-6xl font-bold text-ejn-gold mb-2 flex items-baseline gap-2 flex-wrap font-poppins">
              {impactCount}
              <span className="text-xl md:text-2xl font-bold text-ejn-teal uppercase tracking-tight">Líderes em Formação</span>
            </div>
            <p className="text-xl md:text-2xl font-extralight text-ejn-teal opacity-90 leading-tight">
              Despertados em tecnologia, estratégia e novos negócios
            </p>
          </div>
          
          <div className="md:border-l border-gray-100 md:pl-8 mt-6 md:mt-0 flex flex-col justify-end pb-2">
            <p className="text-apple-text-secondary text-xs md:text-sm font-extralight mb-1 tracking-wide">
              Investimento social alocado
            </p>
            <p className="text-2xl md:text-3xl font-bold text-gray-900 font-poppins">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalInvested)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};