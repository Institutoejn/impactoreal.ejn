
import React, { useState } from 'react';
import { Wallet, Users, AlertCircle, FileUp, UserCheck, PlusCircle, X, Clock, ArrowRight } from 'lucide-react';
import { Aluno, Transacao } from '../types';

interface ManagerDashboardProps {
  students: Aluno[];
  transactions: Transacao[];
  onAddStudent: (student: Omit<Aluno, 'id' | 'status'>) => void;
  onNavigate: (id: string) => void;
}

export const ManagerDashboard: React.FC<ManagerDashboardProps> = ({ students, transactions, onAddStudent, onNavigate }) => {
  const [formData, setFormData] = useState({ name: '', course: '', history: '' });
  
  const confirmedTransactions = transactions.filter(t => t.status === 'confirmado');
  const pendingTransactions = transactions.filter(t => t.status === 'pendente');

  const totalIn = confirmedTransactions.filter(t => t.tipo === 'entrada').reduce((acc, t) => acc + t.valor, 0);
  const totalOut = confirmedTransactions.filter(t => t.tipo === 'saida').reduce((acc, t) => acc + t.valor, 0);
  const balance = totalIn - totalOut;

  const handleQuickRegister = (e: React.FormEvent) => {
    e.preventDefault();
    onAddStudent({
      nome: formData.name,
      curso: formData.course,
      observacoes: formData.history,
      idade: 18,
      bairro: 'Pendente'
    });
    setFormData({ name: '', course: '', history: '' });
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2 bg-white p-8 rounded-apple-2xl shadow-sm border border-gray-50">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-ejn-teal">Fluxo de Caixa Mensal</h3>
              <p className="text-apple-text-secondary text-sm">Resumo consolidado</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-ejn-teal">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(balance)}
              </span>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Saldo Atual</p>
            </div>
          </div>
          
          <div className="flex items-end gap-4 h-48 mb-8">
            {[30, 45, 60, 25, 80, 55, 90, 70].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="w-full bg-apple-gray rounded-t-lg relative overflow-hidden h-full flex items-end">
                  <div className="absolute bottom-0 w-full bg-ejn-teal transition-all group-hover:bg-ejn-gold" style={{ height: `${height}%` }}></div>
                </div>
                <span className="text-[10px] font-bold text-gray-400">S{i+1}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-8 border-t border-gray-50 pt-6">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-ejn-teal"></div>
              <span className="text-sm font-medium text-gray-600">Arrecadação: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalIn)}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-ejn-teal/20"></div>
              <span className="text-sm font-medium text-gray-600">Investimentos: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalOut)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-apple-2xl shadow-sm border border-gray-50 flex flex-col">
          <h3 className="text-xl font-bold text-ejn-teal mb-8">Métricas Sociais</h3>
          <div className="flex-1 space-y-8">
            <div>
              <div className="flex justify-between items-end mb-2">
                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Jovens Ativos</p>
                <span className="text-3xl font-black text-ejn-gold">{students.length}</span>
              </div>
              <div className="w-full h-2 bg-apple-gray rounded-full overflow-hidden">
                <div className="h-full bg-ejn-gold rounded-full" style={{ width: `${Math.min(students.length * 5, 100)}%` }}></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-apple-gray rounded-apple-lg">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Impacto/Mês</p>
                <p className="text-xl font-bold text-ejn-teal">+{Math.ceil(students.length / 4)}</p>
              </div>
              <div className="p-4 bg-apple-gray rounded-apple-lg">
                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Taxa Transp.</p>
                <p className="text-xl font-bold text-ejn-teal">100%</p>
              </div>
            </div>
          </div>
          <button 
            onClick={() => onNavigate('esg')}
            className="mt-8 w-full flex items-center justify-center gap-2 text-ejn-teal font-bold py-4 border-t border-gray-50 hover:bg-ejn-teal/5 transition-colors rounded-b-apple-2xl"
          >
            Relatórios ESG
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-apple-2xl shadow-sm border border-gray-50">
          <div className="flex items-center gap-2 mb-6 text-ejn-gold">
            <Clock className="w-5 h-5" />
            <h3 className="text-xl font-bold text-ejn-teal">Notificações</h3>
          </div>
          <div className="space-y-4">
            {pendingTransactions.length > 0 && (
              <button 
                onClick={() => onNavigate('treasury')}
                className="w-full flex items-center justify-between p-4 bg-ejn-gold/10 rounded-apple-lg border border-ejn-gold/20 group hover:bg-ejn-gold/20 transition-all text-left"
              >
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-ejn-gold" />
                  <div>
                    <span className="text-sm font-bold text-ejn-gold block">{pendingTransactions.length} Movimentações Pendentes</span>
                    <span className="text-[10px] text-ejn-gold/70 font-bold uppercase">Validar no financeiro</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-ejn-gold" />
              </button>
            )}

            <div className="flex items-center justify-between p-4 bg-red-50 rounded-apple-lg border border-red-100 group cursor-pointer hover:bg-red-100 transition-colors">
              <div className="flex items-center gap-3"><FileUp className="w-5 h-5 text-red-500" /><span className="text-sm font-semibold text-red-900">Documentos em Auditoria</span></div>
            </div>
            
            {pendingTransactions.length === 0 && (
              <p className="text-center py-4 text-xs text-apple-text-secondary font-medium italic">Nenhuma notificação crítica no momento.</p>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white p-8 rounded-apple-2xl shadow-sm border border-gray-50">
          <h3 className="text-xl font-bold text-ejn-teal mb-8">Cadastro Rápido de Jovem</h3>
          <form onSubmit={handleQuickRegister} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 bg-apple-gray rounded-apple-lg border-transparent focus:border-ejn-teal focus:ring-0 transition-all outline-none" placeholder="Nome Completo" required />
              <input type="text" value={formData.course} onChange={e => setFormData({...formData, course: e.target.value})} className="w-full px-4 py-3 bg-apple-gray rounded-apple-lg border-transparent focus:border-ejn-teal focus:ring-0 transition-all outline-none" placeholder="Curso / Trilha" required />
            </div>
            <textarea value={formData.history} onChange={e => setFormData({...formData, history: e.target.value})} className="w-full px-4 py-3 bg-apple-gray rounded-apple-lg border-transparent focus:border-ejn-teal focus:ring-0 transition-all outline-none h-[110px] resize-none" placeholder="Breve histórico..."></textarea>
            <div className="md:col-span-2 flex justify-end">
              <button type="submit" className="bg-ejn-teal text-white px-8 py-3 rounded-apple-lg font-bold hover:bg-[#004d45] transition-all transform active:scale-95">Cadastrar Aluno</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
