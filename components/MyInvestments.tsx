
import React from 'react';
import { Award, Download, Calendar, ArrowUpRight } from 'lucide-react';
import { Transacao } from '../types';

interface MyInvestmentsProps {
  transactions: Transacao[];
  totalInvested: number;
}

export const MyInvestments: React.FC<MyInvestmentsProps> = ({ transactions, totalInvested }) => {
  const myInvestments = transactions.filter(t => t.tipo === 'in');

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white p-10 rounded-apple-2xl shadow-sm border border-gray-50 mb-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-8">
          <div className="w-20 h-20 bg-ejn-gold/10 rounded-full flex items-center justify-center border-4 border-ejn-gold/20">
            <Award className="w-10 h-10 text-ejn-gold" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status do Perfil</p>
            <h2 className="text-3xl font-black text-ejn-teal mb-1">Investidor Social</h2>
            <p className="text-apple-text-secondary font-medium">Você já investiu <span className="text-ejn-teal font-bold">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalInvested)}</span></p>
          </div>
        </div>
        <button className="bg-ejn-teal text-white px-8 py-4 rounded-apple-xl font-bold flex items-center gap-3 shadow-lg shadow-ejn-teal/10">
          <Download className="w-5 h-5" />
          Baixar Extrato (PDF)
        </button>
      </div>

      <div className="bg-white rounded-apple-2xl shadow-sm border border-gray-50 overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center">
          <h3 className="text-xl font-bold text-ejn-teal">Histórico de Contribuições</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-apple-gray">
              <tr>
                <th className="px-8 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Data</th>
                <th className="px-8 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Destinação</th>
                <th className="px-8 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-right">Valor</th>
                <th className="px-8 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-right">Doc</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {myInvestments.map((inv) => (
                <tr key={inv.id} className="hover:bg-apple-gray/20 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4 text-gray-300" />
                      {new Date(inv.created_at).toLocaleDateString('pt-BR')}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <p className="font-semibold text-gray-800">{inv.descricao}</p>
                    <p className="text-[10px] text-ejn-teal font-bold uppercase tracking-wider">{inv.categoria}</p>
                  </td>
                  <td className="px-8 py-5 text-right font-bold text-lg text-ejn-teal">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(inv.valor)}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="text-gray-300 group-hover:text-ejn-gold"><ArrowUpRight className="w-5 h-5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
