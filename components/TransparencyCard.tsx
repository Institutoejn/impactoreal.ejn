
import React from 'react';
import { BookOpen, CheckCircle2 } from 'lucide-react';
// Importação corrigida para Transacao
import { Transacao } from '../types';

interface TransparencyCardProps {
  transactions: Transacao[];
  onNavigate: (id: string) => void;
}

export const TransparencyCard: React.FC<TransparencyCardProps> = ({ transactions, onNavigate }) => {
  // Corrigido: usando 'tipo' em vez de 'type' conforme definido em types.ts
  const lastOut = transactions.filter(t => t.tipo === 'out')[0];
  const monthlyOut = transactions
    .filter(t => t.tipo === 'out')
    // Propriedade corrigida de amount para valor
    .reduce((acc, t) => acc + t.valor, 0);

  return (
    <div className="bg-white p-8 rounded-apple-2xl shadow-[0_4px_24px_rgba(0,0,0,0.04)] h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold text-ejn-teal">Onde seu dinheiro chegou</h3>
        <span className="bg-green-50 text-green-600 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" />
          Verificado
        </span>
      </div>

      <div className="space-y-6 flex-1">
        {lastOut ? (
          <div className="flex items-start gap-4 p-5 bg-apple-gray rounded-apple-lg group hover:bg-white hover:shadow-sm transition-all cursor-default border border-transparent hover:border-gray-100">
            <div className="w-12 h-12 bg-ejn-teal/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-ejn-teal transition-colors">
              <BookOpen className="w-6 h-6 text-ejn-teal group-hover:text-white" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Última Destinação</p>
              <p className="font-semibold text-gray-800 text-lg">{lastOut.descricao}</p>
              <p className="text-apple-text-secondary text-sm">{lastOut.categoria}</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-ejn-teal">
                {/* Propriedade corrigida de amount para valor */}
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(lastOut.valor)}
              </p>
              <p className="text-xs text-apple-text-secondary">
                {new Date(lastOut.date).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-apple-text-secondary text-center py-8">Nenhuma destinação registrada ainda.</p>
        )}

        <div className="flex items-center justify-between pt-4">
          <p className="text-sm text-apple-text-secondary">Total rastreado este mês</p>
          <p className="font-bold text-gray-800">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(monthlyOut)}
          </p>
        </div>
      </div>
      
      <button 
        onClick={() => onNavigate('transparency')}
        className="mt-8 w-full py-3 text-sm font-semibold text-ejn-teal hover:bg-ejn-teal/5 rounded-apple-lg transition-colors border border-ejn-teal/10"
      >
        Ver Relatório de Transparência
      </button>
    </div>
  );
};
