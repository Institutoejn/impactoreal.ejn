
import React, { useState, useRef } from 'react';
import { Plus, ArrowUpRight, ArrowDownLeft, X, Upload, CheckCircle2, Clock, Trash2, Camera } from 'lucide-react';
import { Transacao, Projeto } from '../types';

interface TreasuryProps {
  transactions: Transacao[];
  projects: Projeto[];
  onAddTransaction: (transaction: Omit<Transacao, 'id'>) => void;
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

  const totalIn = transactions.filter(t => t.tipo === 'in' && t.status !== 'pending').reduce((acc, t) => acc + t.valor, 0);
  const totalOut = transactions.filter(t => t.tipo === 'out').reduce((acc, t) => acc + t.valor, 0);
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
      comprovante_url: formData.comprovante_url,
      date: new Date().toISOString()
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
          <h3 className="text-xl font-bold text-ejn-teal">Movimentações Financeiras</h3>
          <button onClick={() => setIsModalOpen(true)} className="bg-ejn-gold text-white px-6 py-3 rounded-apple-lg font-bold shadow-md">Novo Registro</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-apple-gray text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              <tr>
                <th className="px-8 py-4">Descrição</th>
                <th className="px-8 py-4">Categoria</th>
                <th className="px-8 py-4 text-right">Valor</th>
                <th className="px-8 py-4 text-right">Status</th>
                <th className="px-8 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-apple-gray/20">
                  <td className="px-8 py-5 font-semibold">{t.descricao}</td>
                  <td className="px-8 py-5 text-sm text-gray-500">{t.categoria}</td>
                  <td className={`px-8 py-5 text-right font-bold ${t.tipo === 'in' ? 'text-green-600' : 'text-gray-900'}`}>
                    {t.tipo === 'in' ? '+' : '-'} {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(t.valor)}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${t.status === 'confirmed' ? 'bg-green-50 text-green-600' : 'bg-ejn-gold/10 text-ejn-gold'}`}>
                      {t.status === 'confirmed' ? 'Validado' : 'Pendente'}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      {t.status === 'pending' && (
                        <button onClick={() => onUpdateStatus(t.id, 'confirmed')} className="p-2 text-green-500"><CheckCircle2 className="w-5 h-5" /></button>
                      )}
                      <button onClick={() => onDeleteTransaction(t.id)} className="p-2 text-gray-300 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-md">
          <div className="bg-white w-full max-w-lg rounded-apple-2xl shadow-2xl overflow-hidden">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-ejn-teal">Novo Registro</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-apple-gray rounded-full"><X className="w-6 h-6 text-gray-300" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <button type="button" onClick={() => setFormData({...formData, tipo: 'in', categoria: 'Doação'})} className={`py-4 rounded-apple-lg border-2 font-bold ${formData.tipo === 'in' ? 'bg-green-50 border-green-500 text-green-700' : 'bg-apple-gray border-transparent text-gray-400'}`}>Entrada</button>
                <button type="button" onClick={() => setFormData({...formData, tipo: 'out', categoria: 'Educação'})} className={`py-4 rounded-apple-lg border-2 font-bold ${formData.tipo === 'out' ? 'bg-red-50 border-red-500 text-red-700' : 'bg-apple-gray border-transparent text-gray-400'}`}>Saída</button>
              </div>
              <div className="space-y-4">
                <input required type="text" value={formData.descricao} onChange={e => setFormData({...formData, descricao: e.target.value})} className="w-full px-5 py-3 bg-apple-gray rounded-apple-lg outline-none border focus:border-ejn-teal" placeholder="Descrição da movimentação" />
                <div className="grid grid-cols-2 gap-4">
                  <input required type="number" step="0.01" value={formData.valor} onChange={e => setFormData({...formData, valor: e.target.value})} className="w-full px-5 py-3 bg-apple-gray rounded-apple-lg outline-none border focus:border-ejn-teal" placeholder="Valor R$" />
                  <select value={formData.categoria} onChange={e => setFormData({...formData, categoria: e.target.value as any})} className="w-full px-5 py-3 bg-apple-gray rounded-apple-lg outline-none border focus:border-ejn-teal">
                    <option value="Educação">Educação</option>
                    <option value="Infraestrutura">Infraestrutura</option>
                    <option value="Alimentação">Alimentação</option>
                    <option value="Doação">Doação</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>
              </div>
              <div className="border-2 border-dashed border-gray-200 rounded-apple-lg p-6 flex flex-col items-center cursor-pointer hover:bg-apple-gray/30" onClick={() => fileInputRef.current?.click()}>
                {formData.comprovante_url ? <img src={formData.comprovante_url} className="w-full h-32 object-cover rounded-lg" /> : <div className="text-center"><Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" /><p className="text-xs font-bold text-gray-400 uppercase">Comprovante</p></div>}
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
              </div>
              <button type="submit" className="w-full bg-ejn-teal text-white py-4 rounded-apple-xl font-bold shadow-lg">Registrar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
