import React from 'react';
import { TrendingUp, Sparkles, Briefcase, Rocket, Users, Wallet } from 'lucide-react';

interface ImpactHeroProps {
  impactCount: number;
  totalInvested: number;
  marketCount: number;
  businessCount: number;
}

export const ImpactHero: React.FC<ImpactHeroProps> = ({ 
  impactCount, 
  totalInvested, 
  marketCount, 
  businessCount 
}) => {
  return (
    <div className="bg-white p-10 md:p-12 rounded-apple-2xl shadow-[0_4px_20px_-12px_rgba(0,0,0,0.05)] mb-12 transition-all hover:shadow-[0_8px_30px_-10px_rgba(0,0,0,0.08)] relative overflow-hidden group border border-gray-50">
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
        <Sparkles className="w-24 h-24 text-ejn-gold" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-10">
          <TrendingUp className="w-4 h-4 text-ejn-teal" />
          <h2 className="font-poppins text-[10px] font-bold text-ejn-teal uppercase tracking-widest opacity-60">
            Painel de Realização Social
          </h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-x-0 md:divide-x divide-gray-50">
          <div className="flex flex-col items-center md:items-start md:px-6">
            <div className="w-8 h-8 bg-apple-gray rounded-lg flex items-center justify-center mb-3">
              <Wallet className="w-4 h-4 text-ejn-teal" />
            </div>
            <p className="text-2xl font-bold text-gray-900 font-poppins tracking-tight">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(totalInvested)}
            </p>
            <p className="text-[10px] font-extralight text-apple-text-secondary uppercase tracking-widest mt-1">Investimento</p>
          </div>

          <div className="flex flex-col items-center md:items-start md:px-6">
            <div className="w-8 h-8 bg-apple-gray rounded-lg flex items-center justify-center mb-3">
              <Users className="w-4 h-4 text-ejn-teal" />
            </div>
            <p className="text-2xl font-bold text-gray-900 font-poppins tracking-tight">{impactCount}</p>
            <p className="text-[10px] font-extralight text-apple-text-secondary uppercase tracking-widest mt-1">Jovens Formados</p>
          </div>

          <div className="flex flex-col items-center md:items-start md:px-6">
            <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center mb-3">
              <Briefcase className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900 font-poppins tracking-tight">{marketCount}</p>
            <p className="text-[10px] font-extralight text-apple-text-secondary uppercase tracking-widest mt-1">Jovens Empregados</p>
          </div>

          <div className="flex flex-col items-center md:items-start md:px-6">
            <div className="w-8 h-8 bg-ejn-gold/5 rounded-lg flex items-center justify-center mb-3">
              <Rocket className="w-4 h-4 text-ejn-gold" />
            </div>
            <p className="text-2xl font-bold text-gray-900 font-poppins tracking-tight">{businessCount}</p>
            <p className="text-[10px] font-extralight text-apple-text-secondary uppercase tracking-widest mt-1">Jovens Empreendendo</p>
          </div>
        </div>
      </div>
    </div>
  );
};