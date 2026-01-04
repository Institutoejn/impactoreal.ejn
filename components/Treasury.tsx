
import React, { useState, useRef } from 'react';
import { Plus, X, Upload, CheckCircle2, Trash2 } from 'lucide-react';
import { Transacao, Projeto } from '../types';

interface TreasuryProps {
  transactions: Transacao[];
  projects: Projeto[];
  onAddTransaction: (transaction: Omit<Transacao, 'id' | 'created_at'>) => void;
  onUpdateStatus: (id: string, status: 'confirmed' | 'pending') => void;
  onDeleteTransaction: (id: string) => void;
}

export const Treasury: React.FC<TreasuryProps> = ({ transactions, projects, onAddTransaction, onUpdateStatus, onDeleteTransaction }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    descricao: '',
    valor: '',
    tipo: 'out' as 'in' | 'out',
    categoria: 'Educação' as Transacao['categoria'],
    projeto_id: '',
    comprovante_url: ''
  });

  const confirmedTransactions = transactions.filter(t => t.status !== 'pending');
  const totalIn = confirmedTransactions.filter(t => t.tipo === 'in').reduce((acc, t) => acc + t.valor, 0);
  const totalOut = confirmedTransactions.filter(t => t.tipo === 'out').reduce((acc, t) => acc + t.valor, 0);
  const balance = totalIn - totalOut;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTransaction({
      descricao: formData.descricao,
      valor: parseFloat(formData.valor) || 0,
      tipo: formData.tipo,
      categoria: formData.categoria,
      projeto_id: formData.projeto_id || undefined,
      status: 'confirmed',
      comprovante_url: formData.comprovante_url
    });
    setIsModalOpen(false);
    setFormData({ descricao: '', valor: '', tipo: 'out', categoria: 'Educação', projeto_id: '', comprovante_url: '' });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, comprovante_url: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-ejn-teal p-8 rounded-apple-2xl shadow-lg text-white">
          <p className="text-teal-100 text-[11px] font-bold uppercase tracking-widest mb-2">Saldo Real em Conta</p>
          <h3 className="text-4xl font-black">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(balance)}</h3>
        </div>
        <div className="bg-white p-8 rounded-apple-2xl shadow-sm border border-gray-50">
          <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest mb-2">Total Arrecadado</p>
          <h3 className="text-3xl font-bold text-green-600">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalIn)}</h3>
        </div>
        <div className="bg-white p-8 rounded-apple-2xl shadow-sm border border-gray-50">
          <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest mb-2">Total Investido</p>
          <h3 className="text-3xl font-bold text-red-500">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalOut)}</h3>
        </div>
      </div>

      <div className="bg-white rounded-apple-2xl shadow-sm border border-gray-50 overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center">
          <h3 className="text-xl font-bold text-ejn-teal">Fluxo Financeiro EJN</h3>
          <button onClick={() => setIsModalOpen(true)} className="bg-ejn-gold text-white px-8 py-4 rounded-apple-lg font-bold shadow-lg">Registrar Movimentação</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-apple-gray text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              <tr>
                <th className="px-8 py-5">Descrição / Data</th>
                <th className="px-8 py-5 text-right">Valor</th>
                <th className="px-8 py-5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-apple-gray/20">
                  <td className="px-8 py-5">
                    <p className="font-bold text-gray-900">{t.descricao}</p>
                    <p className="text-[10px] text-apple-text-secondary uppercase">{new Date(t.created_at).toLocaleDateString('pt-BR')} • {t.categoria}</p>
                  </td>
                  <td className={`px-8 py-5 text-right font-bold ${t.tipo === 'in' ? 'text-green-600' : 'text-red-500'}`}>
                    {t.tipo === 'in' ? '+' : '-'} {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(t.valor)}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-3">
                      {t.status === 'pending' && (
                        <button onClick={() => onUpdateStatus(t.id, 'confirmed')} className="p-2 text-ejn-gold bg-ejn-gold/10 rounded-lg"><CheckCircle2 className="w-5 h-5" /></button>
                      )}
                      <button onClick={() => onDeleteTransaction(t.id)} className="p-2 text-gray-300 hover:text-red-500"><Trash2 className="w-5 h-5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/20 backdrop-blur-md">
          <div className="bg-white w-full max-w-lg rounded-apple-2xl shadow-2xl p-10">
            <h2 className="text-2xl font-bold text-ejn-teal mb-8">Novo Registro Financeiro</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <button type="button" onClick={() => setFormData({...formData, tipo: 'in', categoria: 'Doação'})} className={`py-4 rounded-apple-lg border-2 font-bold ${formData.tipo === 'in' ? 'bg-green-50 border-green-500 text-green-700' : 'bg-apple-gray border-transparent text-gray-400'}`}>Entrada</button>
                <button type="button" onClick={() => setFormData({...formData, tipo: 'out', categoria: 'Educação'})} className={`py-4 rounded-apple-lg border-2 font-bold ${formData.tipo === 'out' ? 'bg-red-50 border-red-500 text-red-700' : 'bg-apple-gray border-transparent text-gray-400'}`}>Saída</button>
              </div>
              <input required type="text" value={formData.descricao} onChange={e => setFormData({...formData, descricao: e.target.value})} className="w-full px-5 py-4 bg-apple-gray rounded-apple-lg border outline-none focus:border-ejn-teal" placeholder="Descrição" />
              <input required type="number" step="0.01" value={formData.valor} onChange={e => setFormData({...formData, valor: e.target.value})} className="w-full px-5 py-4 bg-apple-gray rounded-apple-lg border outline-none focus:border-ejn-teal" placeholder="Valor R$" />
              <button type="submit" className="w-full bg-ejn-teal text-white py-5 rounded-apple-xl font-black text-lg shadow-xl shadow-ejn-teal/20">Gravar na Nuvem</button>
              <button type="button" onClick={() => setIsModalOpen(false)} className="w-full text-apple-text-secondary font-bold uppercase tracking-widest text-[10px]">Cancelar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
