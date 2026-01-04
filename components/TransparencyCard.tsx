import React from 'react';
import { BookOpen, CheckCircle2 } from 'lucide-react';
import { Transacao } from '../types';

interface TransparencyCardProps {
  transactions: Transacao[];
  onNavigate: (id: string) => void;
}

export const TransparencyCard: React.FC<TransparencyCardProps> = ({ transactions, onNavigate }) => {
  const lastOut = transactions.filter(t => t.tipo === 'saida')[0];

  return (
    <div className="bg-white p-8 rounded-apple-2xl shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold text-ejn-teal">Rastreabilidade do Legado</h3>
        <span className="bg-green-50 text-green-600 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" />
          Auditado
        </span>
      </div>

      <div className="space-y-6 flex-1">
        {lastOut ? (
          <div className="flex items-start gap-4 p-5 bg-apple-gray rounded-apple-lg group hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-gray-100">
            <div className="w-12 h-12 bg-ejn-teal/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-ejn-teal transition-colors">
              <BookOpen className="w-6 h-6 text-ejn-teal group-hover:text-white" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Última Transformação</p>
              <p className="font-semibold text-gray-800 text-lg line-clamp-1">{lastOut.descricao}</p>
              <p className="text-apple-text-secondary text-sm">{lastOut.categoria}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xl font-bold text-ejn-teal">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(lastOut.valor)}
              </p>
              <p className="text-[10px] text-apple-text-secondary">
                {new Date(lastOut.created_at).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-apple-text-secondary text-center py-8">Aguardando as próximas evidências de impacto.</p>
        )}
      </div>
      
      <button 
        onClick={() => onNavigate('transparency')}
        className="mt-8 w-full py-4 text-sm font-bold text-ejn-teal hover:bg-ejn-teal/5 rounded-apple-lg border border-ejn-teal/10 transition-colors"
      >
        Ver Transparência Radical
      </button>
    </div>
  );
};