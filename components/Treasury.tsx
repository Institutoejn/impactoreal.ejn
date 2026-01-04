
import React, { useState, useRef, useEffect } from 'react';
import { Plus, X, Upload, CheckCircle2, Trash2, Wallet, ArrowUpCircle, ArrowDownCircle, Mail, Edit2, Search } from 'lucide-react';
import { Transacao, Projeto, Perfil } from '../types';
import { supabase } from '../supabase';

interface TreasuryProps {
  transactions: Transacao[];
  projects: Projeto[];
  onAddTransaction: (transaction: Omit<Transacao, 'id' | 'created_at'>) => Promise<boolean>;
  onUpdateStatus: (id: string, status: 'confirmado' | 'pendente') => void;
  onUpdateTransaction: (id: string, updates: Partial<Transacao>) => Promise<boolean>;
  onDeleteTransaction: (id: string) => void;
}

export const Treasury: React.FC<TreasuryProps> = ({ 
  transactions, 
  projects, 
  onAddTransaction, 
  onUpdateStatus, 
  onUpdateTransaction,
  onDeleteTransaction 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [donorEmails, setDonorEmails] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    descricao: '',
    valor: '',
    tipo: 'saida' as 'entrada' | 'saida',
    categoria: 'Educação' as Transacao['categoria'],
    projeto_id: '',
    comprovante_url: '',
    doador_email: ''
  });

  useEffect(() => {
    const fetchEmails = async () => {
      const { data } = await supabase.from('perfis').select('email');
      if (data) setDonorEmails(data.map(p => p.email).filter(Boolean));
    };
    fetchEmails();
  }, [isModalOpen]);

  const confirmedTransactions = transactions.filter(t => t.status === 'confirmado');
  const totalIn = confirmedTransactions.filter(t => t.tipo === 'entrada').reduce((acc, t) => acc + t.valor, 0);
  const totalOut = confirmedTransactions.filter(t => t.tipo === 'saida').reduce((acc, t) => acc + t.valor, 0);
  const balance = totalIn - totalOut;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const status = formData.tipo === 'entrada' && !editingId ? 'pendente' : 'confirmado';
    const payload = {
      descricao: formData.descricao,
      valor: parseFloat(formData.valor) || 0,
      tipo: formData.tipo,
      categoria: formData.categoria,
      projeto_id: formData.projeto_id || undefined,
      doador_email: formData.tipo === 'entrada' ? formData.doador_email : undefined,
      status: status,
      comprovante_url: formData.comprovante_url
    };

    let success = false;
    if (editingId) {
      success = await onUpdateTransaction(editingId, payload);
    } else {
      success = await onAddTransaction(payload);
    }

    if (success) {
      closeModal();
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ 
      descricao: '', 
      valor: '', 
      tipo: 'saida', 
      categoria: 'Educação', 
      projeto_id: '', 
      comprovante_url: '',
      doador_email: ''
    });
  };

  const handleEdit = (t: Transacao) => {
    setEditingId(t.id);
    setFormData({
      descricao: t.descricao,
      valor: t.valor.toString(),
      tipo: t.tipo,
      categoria: t.categoria,
      projeto_id: t.projeto_id || '',
      comprovante_url: t.comprovante_url || '',
      doador_email: t.doador_email || ''
    });
    setIsModalOpen(true);
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
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-12 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-ejn-teal p-8 rounded-apple-2xl shadow-lg text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <Wallet className="w-20 h-20" />
          </div>
          <p className="text-teal-100 text-[11px] font-bold uppercase tracking-widest mb-2 relative z-10">Saldo Real em Conta</p>
          <h3 className="text-4xl font-black relative z-10">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(balance)}</h3>
        </div>
        <div className="bg-white p-8 rounded-apple-2xl shadow-sm border border-gray-50 flex items-center justify-between group">
          <div>
            <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest mb-1">Total Arrecadado</p>
            <h3 className="text-2xl font-bold text-green-600">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalIn)}</h3>
          </div>
          <ArrowUpCircle className="text-green-100 w-10 h-10 group-hover:text-green-200 transition-colors" />
        </div>
        <div className="bg-white p-8 rounded-apple-2xl shadow-sm border border-gray-50 flex items-center justify-between group">
          <div>
            <p className="text-gray-400 text-[11px] font-bold uppercase tracking-widest mb-1">Total Investido</p>
            <h3 className="text-2xl font-bold text-red-500">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalOut)}</h3>
          </div>
          <ArrowDownCircle className="text-red-100 w-10 h-10 group-hover:text-red-200 transition-colors" />
        </div>
      </div>

      <div className="bg-white rounded-apple-2xl shadow-sm border border-gray-50 overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h3 className="text-xl font-bold text-ejn-teal">Fluxo Financeiro EJN</h3>
            <p className="text-apple-text-secondary text-sm font-medium">Rastreabilidade total de cada aporte.</p>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="w-full md:w-auto bg-ejn-gold text-white px-8 py-4 rounded-apple-lg font-bold shadow-lg shadow-ejn-gold/20 hover:bg-[#D19900] transition-all transform active:scale-95">
            Registrar Movimentação
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-apple-gray text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              <tr>
                <th className="px-8 py-5">Descrição / Doador</th>
                <th className="px-8 py-5">Categoria</th>
                <th className="px-8 py-5 text-right">Valor</th>
                <th className="px-8 py-5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {transactions.length > 0 ? transactions.map((t) => (
                <tr key={t.id} className="hover:bg-apple-gray/20 transition-colors group">
                  <td className="px-8 py-5">
                    <p className="font-bold text-gray-900">{t.descricao}</p>
                    {t.doador_email && (
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Mail className="w-3 h-3 text-ejn-gold" />
                        <span className="text-[10px] text-ejn-gold font-bold uppercase tracking-tighter">{t.doador_email}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                       <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${t.status === 'pendente' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                        {t.status}
                      </span>
                      <p className="text-[9px] text-apple-text-secondary font-bold uppercase">{new Date(t.created_at).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="bg-gray-100 text-gray-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">
                      {t.categoria}
                    </span>
                  </td>
                  <td className={`px-8 py-5 text-right font-bold text-lg ${t.tipo === 'entrada' ? 'text-green-600' : 'text-red-500'}`}>
                    {t.tipo === 'entrada' ? '+' : '-'} {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(t.valor)}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {t.status === 'pendente' && (
                        <button onClick={() => onUpdateStatus(t.id, 'confirmado')} className="p-2 text-green-600 bg-green-50 rounded-lg hover:bg-green-100" title="Confirmar">
                          <CheckCircle2 className="w-4.5 h-4.5" />
                        </button>
                      )}
                      <button onClick={() => handleEdit(t)} className="p-2 text-ejn-teal bg-ejn-teal/5 rounded-lg hover:bg-ejn-teal/10" title="Editar">
                        <Edit2 className="w-4.5 h-4.5" />
                      </button>
                      <button onClick={() => onDeleteTransaction(t.id)} className="p-2 text-gray-300 hover:text-red-500 transition-colors" title="Excluir">
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center text-apple-text-secondary font-medium italic">
                    Aguardando registros financeiros.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/20 backdrop-blur-md">
          <div className="bg-white w-full max-w-lg rounded-apple-2xl shadow-2xl p-10 overflow-hidden relative">
            <button onClick={closeModal} className="absolute top-6 right-6 p-2 text-gray-300 hover:text-gray-500 transition-colors">
              <X className="w-6 h-6" />
            </button>
            
            <h2 className="text-2xl font-bold text-ejn-teal mb-8">{editingId ? 'Editar Movimentação' : 'Novo Registro Financeiro'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <button type="button" onClick={() => setFormData({...formData, tipo: 'entrada', categoria: 'Doação'})} className={`py-4 rounded-apple-lg border-2 font-black uppercase text-xs tracking-widest transition-all ${formData.tipo === 'entrada' ? 'bg-green-50 border-green-500 text-green-700 shadow-inner' : 'bg-apple-gray border-transparent text-gray-400 hover:bg-gray-200'}`}>Entrada</button>
                <button type="button" onClick={() => setFormData({...formData, tipo: 'saida', categoria: 'Educação'})} className={`py-4 rounded-apple-lg border-2 font-black uppercase text-xs tracking-widest transition-all ${formData.tipo === 'saida' ? 'bg-red-50 border-red-500 text-red-700 shadow-inner' : 'bg-apple-gray border-transparent text-gray-400 hover:bg-gray-200'}`}>Saída</button>
              </div>

              <div className="space-y-4 max-h-[50vh] overflow-y-auto px-1">
                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase block mb-2 px-1 tracking-widest">Descrição</label>
                  <input required type="text" value={formData.descricao} onChange={e => setFormData({...formData, descricao: e.target.value})} className="w-full px-5 py-3.5 bg-apple-gray rounded-apple-lg border border-transparent outline-none focus:border-ejn-teal focus:bg-white transition-all shadow-sm font-bold" placeholder="Ex: Doação de Patrocínio Master" />
                </div>
                
                {formData.tipo === 'entrada' && (
                  <div>
                    <label className="text-[11px] font-bold text-ejn-gold uppercase block mb-2 px-1 tracking-widest flex items-center gap-2">
                      <Mail className="w-3 h-3" /> E-mail do Doador
                    </label>
                    <input 
                      type="email" 
                      list="donor-emails"
                      value={formData.doador_email} 
                      onChange={e => setFormData({...formData, doador_email: e.target.value})} 
                      className="w-full px-5 py-3.5 bg-ejn-gold/5 rounded-apple-lg border border-ejn-gold/20 outline-none focus:border-ejn-gold focus:bg-white transition-all shadow-sm font-bold text-ejn-gold" 
                      placeholder="vincular@doador.com" 
                    />
                    <datalist id="donor-emails">
                      {donorEmails.map(email => <option key={email} value={email} />)}
                    </datalist>
                    <p className="text-[9px] text-gray-400 mt-1 font-bold uppercase tracking-tight">O impacto será vinculado a este usuário automaticamente.</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-gray-400 uppercase block mb-2 px-1 tracking-widest">Valor R$</label>
                    <input required type="number" step="0.01" value={formData.valor} onChange={e => setFormData({...formData, valor: e.target.value})} className="w-full px-5 py-3.5 bg-apple-gray rounded-apple-lg border border-transparent outline-none focus:border-ejn-teal focus:bg-white transition-all shadow-sm font-bold text-lg" placeholder="0,00" />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-400 uppercase block mb-2 px-1 tracking-widest">Categoria</label>
                    <select value={formData.categoria} onChange={e => setFormData({...formData, categoria: e.target.value as any})} className="w-full px-5 py-3.5 bg-apple-gray rounded-apple-lg border border-transparent outline-none focus:border-ejn-teal focus:bg-white transition-all shadow-sm font-bold">
                      <option value="Educação">Educação</option>
                      <option value="Infraestrutura">Infraestrutura</option>
                      <option value="Alimentação">Alimentação</option>
                      <option value="Doação">Arrecadação</option>
                      <option value="Outros">Outros</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <div 
                    className="w-full h-24 bg-apple-gray rounded-apple-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors group"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {formData.comprovante_url ? (
                      <div className="w-full h-full p-2">
                        <img src={formData.comprovante_url} className="w-full h-full object-cover rounded-lg" alt="Comprovante" />
                      </div>
                    ) : (
                      <>
                        <Upload className="w-6 h-6 text-gray-300 group-hover:text-ejn-teal transition-colors" />
                        <span className="text-[10px] font-bold text-gray-400 uppercase mt-2">Comprovante</span>
                      </>
                    )}
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                  </div>
                </div>
              </div>

              <button type="submit" className="w-full bg-ejn-teal text-white py-5 rounded-apple-xl font-black text-lg shadow-xl shadow-ejn-teal/20 hover:bg-[#004d45] transition-all transform active:scale-95">
                {editingId ? 'Salvar Alterações' : 'Confirmar Registro'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
