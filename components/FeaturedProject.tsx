import React from 'react';
import { ArrowRight, Star, Target } from 'lucide-react';
import { Projeto, Transacao } from '../types';

interface FeaturedProjectProps {
  projects: Projeto[];
  transactions: Transacao[];
  onNavigate: (id: string) => void;
}

export const FeaturedProject: React.FC<FeaturedProjectProps> = ({ projects, transactions, onNavigate }) => {
  // Identifica o projeto mais recente como destaque
  const project = projects.length > 0 
    ? [...projects].sort((a, b) => new Date(b.id).getTime() - new Date(a.id).getTime())[0] 
    : null;

  if (!project) {
    return (
      <div className="bg-white rounded-apple-2xl shadow-sm border border-gray-50 p-12 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
        <div className="w-16 h-16 bg-apple-gray rounded-full flex items-center justify-center mb-6">
          <Target className="w-8 h-8 text-gray-300" />
        </div>
        <h3 className="text-xl font-bold text-ejn-teal mb-2">Estamos preparando novos sonhos.</h3>
        <p className="text-apple-text-secondary font-extralight max-w-xs">
          Fique atento! Novas frentes de impacto social serão lançadas em breve por nossa presidência.
        </p>
      </div>
    );
  }

  // Cálculo de progresso baseado em transações REAIS vinculadas ao projeto
  const reached = transactions
    .filter(t => 
      t.tipo === 'entrada' && 
      t.status === 'confirmado' && 
      t.projeto_id === project.id
    )
    .reduce((acc, t) => acc + t.valor, 0);
  
  const progress = project.meta_financeira > 0 
    ? Math.min(Math.round((reached / project.meta_financeira) * 100), 100)
    : 0;

  return (
    <div className="bg-white rounded-apple-2xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] overflow-hidden h-full flex flex-col group border border-gray-50">
      <div className="relative h-56 overflow-hidden">
        <img 
          src={project.capa_url || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800"} 
          alt={project.nome} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-ejn-gold text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1 shadow-lg shadow-ejn-gold/30">
            <Star className="w-3 h-3 fill-white" />
            Foco Estratégico
          </span>
        </div>
      </div>
      
      <div className="p-8 flex flex-col flex-1">
        <h3 className="text-xl font-bold text-ejn-teal mb-3">{project.nome}</h3>
        <p className="text-apple-text-secondary text-sm mb-8 leading-relaxed font-extralight line-clamp-3">
          {project.descricao}
        </p>
        
        <div className="mt-auto">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Aceleração Real</span>
            <span className="text-xs font-bold text-ejn-gold">{progress}% concluído</span>
          </div>
          <div className="w-full h-2 bg-apple-gray rounded-full mb-8 overflow-hidden">
            <div 
              className="h-full bg-ejn-gold rounded-full transition-all duration-1000 ease-out shadow-[0_0_12px_rgba(232,171,0,0.4)]" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <button 
            onClick={() => onNavigate('projects')}
            className="w-full bg-ejn-gold text-white font-bold py-4 rounded-apple-lg hover:bg-[#D19900] transition-all transform active:scale-[0.98] shadow-lg shadow-ejn-gold/20 flex items-center justify-center gap-2"
          >
            Impulsionar este Legado
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};