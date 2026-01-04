
import React, { useState, useRef } from 'react';
import { Plus, ArrowUpRight, ArrowDownLeft, Search, X, Upload, CheckCircle2, Clock, Trash2, Camera, ImageIcon } from 'lucide-react';
import { Transaction, Project } from '../types';

interface TreasuryProps {
  transactions: Transaction[];
  projects: Project[];
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  onUpdateStatus: (id: string, status: 'confirmed' | 'pending') => void;
  onDeleteTransaction: (id: string) => void;
}

export const Treasury: React.FC<TreasuryProps> = ({ transactions, projects, onAddTransaction, onUpdateStatus, onDeleteTransaction }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'out' as 'in' | 'out',
    category: 'Educação' as Transaction['category'],
    projectId: '',
    date: new Date().toISOString().split('T')[0],
    proofImage: ''
  });

  const totalIn = transactions.filter(t => t.type === 'in' && t.status !== 'pending').reduce((acc, t) => acc + t.amount, 0);
  const totalOut = transactions.filter(t => t.type === 'out').reduce((acc, t) => acc + t.amount, 0);
  const balance = totalIn - totalOut;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, proofImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTransaction({
      description: formData.description,
      amount: parseFloat(formData.amount),
      type: formData.type,
      category: formData.category,
      projectId: formData.type === 'in' ? formData.projectId : undefined,
      date: formData.date,
      status: 'confirmed',
      proofImage: formData.proofImage
    });
    setFormData({ description: '', amount: '', type: 'out', category: 'Educação', projectId: '', date: new Date().toISOString().split('T')[0], proofImage: '' });
    setIsModalOpen(false);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8 md:space-y-12">
      {/* Treasury Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 font-sans">
        <div className="bg-ejn-teal p-8 rounded-apple-2xl shadow-lg shadow-ejn-teal/20 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-700"><ArrowUpRight className="w-24 h-24" /></div>
          <p className="text-teal-100 text-[11px] font-bold uppercase tracking-widest mb-2">Saldo em Conta</p>
          <h3 className="text-3xl md:text-4xl font-black">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(balance)}</h3>
          <p className="mt-4 text-[10px] text-teal-100/60 font-medium">Sincronizado em tempo real</p>
        </div>

        <div className="bg-white p-8 rounded-apple-2xl shadow-sm border border-gray-50 group">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors"><ArrowUpRight className="w-5 h-5 text-green-600" /></div>
            <p className="text-apple-text-secondary text-[11px] font-bold uppercase tracking-widest">Entradas</p>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-gray-800">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalIn)}</h3>
        </div>

        <div className="bg-white p-8 rounded-apple-2xl shadow-sm border border-gray-50 group md:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-50 rounded-lg group-hover:bg-red-100 transition-colors"><ArrowDownLeft className="w-5 h-5 text-red-600" /></div>
            <p className="text-apple-text-secondary text-[11px] font-bold uppercase tracking-widest">Gastos</p>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-gray-800">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalOut)}</h3>
        </div>
      </div>

      {/* Pending Donations Row (Grid adjust) */}
      {transactions.filter(t => t.status === 'pending').length > 0 && (
         <div className="animate-in slide-in-from-left-4 duration-500">
          <div className="flex items-center gap-2 mb-6 text-ejn-gold">
            <Clock className="w-5 h-5" />
            <h3 className="text-xl font-bold">Aguardando Validação</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {transactions.filter(t => t.status === 'pending').map((t) => (
              <div key={t.id} className="bg-white p-6 rounded-apple-xl shadow-md border-l-4 border-ejn-gold flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="font-bold text-gray-800 line-clamp-1">{t.description}</p>
                  <p className="text-xl font-black text-ejn-teal mt-1">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(t.amount)}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => onUpdateStatus(t.id, 'confirmed')} className="flex-1 sm:flex-none bg-ejn-gold text-white px-5 py-2.5 rounded-apple-lg font-bold text-sm hover:bg-[#D19900] transition-all shadow-md"><CheckCircle2 className="w-4 h-4 mx-auto" /></button>
                  <button onClick={() => onDeleteTransaction(t.id)} className="flex-1 sm:flex-none p-2.5 text-red-400 hover:bg-red-50 rounded-apple-lg transition-colors border border-transparent hover:border-red-100"><Trash2 className="w-5 h-5 mx-auto" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Table */}
      <div className="bg-white rounded-apple-2xl shadow-sm border border-gray-50 overflow-hidden font-sans">
        <div className="p-6 md:p-8 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <h3 className="text-xl font-bold text-ejn-teal w-full md:w-auto">Fluxo de Caixa</h3>
          <button onClick={() => setIsModalOpen(true)} className="w-full md:w-auto bg-ejn-gold text-white px-6 py-3 rounded-apple-lg font-bold hover:bg-[#D19900] transition-all flex items-center justify-center gap-2 shadow-lg shadow-ejn-gold/20 transform active:scale-95">
            <Plus className="w-5 h-5" />
            Novo Registro
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-apple-gray uppercase tracking-widest text-[11px] font-bold text-gray-400">
              <tr>
                <th className="px-8 py-4">Data</th>
                <th className="px-8 py-4">Descrição</th>
                <th className="px-8 py-4">Categoria</th>
                <th className="px-8 py-4 text-right">Valor</th>
                <th className="px-8 py-4 text-right">Mídia</th>
                <th className="px-8 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {transactions.filter(t => t.status !== 'pending').map((t) => (
                <tr key={t.id} className="hover:bg-apple-gray/20 transition-colors group">
                  <td className="px-8 py-5 text-sm text-gray-500">{new Date(t.date).toLocaleDateString('pt-BR')}</td>
                  <td className="px-8 py-5 font-semibold text-gray-800">{t.description}</td>
                  <td className="px-8 py-5">
                    <span className="bg-apple-gray text-apple-text-secondary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">{t.category}</span>
                  </td>
                  <td className={`px-8 py-5 text-right font-bold text-lg ${t.type === 'in' ? 'text-green-600' : 'text-gray-900'}`}>
                    {t.type === 'in' ? '+' : '-'} {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(t.amount)}
                  </td>
                  <td className="px-8 py-5 text-right">
                    {t.proofImage ? (
                      <div className="flex justify-end">
                        <div className="w-8 h-8 rounded-lg overflow-hidden border border-gray-100 shadow-sm" title="Ver Comprovante">
                          <img src={t.proofImage} alt="Comprovante" className="w-full h-full object-cover" />
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-200">—</span>
                    )}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button onClick={() => onDeleteTransaction(t.id)} className="p-2 text-gray-300 hover:text-red-500 transition-colors lg:opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Movement Modal - Responsive */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-300 overflow-y-auto">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-md fixed" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white w-full max-w-lg rounded-apple-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-500 my-auto">
            <div className="p-6 md:p-8 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl md:text-2xl font-bold text-ejn-teal">Nova Movimentação</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-apple-gray rounded-full text-gray-300 transition-colors"><X className="w-6 h-6" /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <button type="button" onClick={() => setFormData({...formData, type: 'in', category: 'Doação'})} className={`py-4 rounded-apple-lg border-2 font-bold transition-all text-sm ${formData.type === 'in' ? 'bg-green-50 border-green-500 text-green-700' : 'bg-apple-gray border-transparent text-gray-400'}`}>Entrada</button>
                <button type="button" onClick={() => setFormData({...formData, type: 'out', category: 'Educação'})} className={`py-4 rounded-apple-lg border-2 font-bold transition-all text-sm ${formData.type === 'out' ? 'bg-red-50 border-red-500 text-red-700' : 'bg-apple-gray border-transparent text-gray-400'}`}>Saída</button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">Descrição</label>
                  <input required type="text" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-5 py-3 bg-apple-gray rounded-apple-lg border-transparent focus:bg-white focus:border-ejn-teal outline-none transition-all shadow-sm border text-sm" placeholder="Ex: Material para Turma UX" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">Valor (R$)</label>
                    <input required type="number" step="0.01" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} className="w-full px-5 py-3 bg-apple-gray rounded-apple-lg border-transparent focus:bg-white focus:border-ejn-teal outline-none transition-all shadow-sm border text-sm" placeholder="0,00" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">Categoria</label>
                    <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as any})} className="w-full px-5 py-3 bg-apple-gray rounded-apple-lg border-transparent focus:bg-white focus:border-ejn-teal outline-none transition-all shadow-sm border appearance-none text-sm">
                      {formData.type === 'in' ? <option value="Doação">Doação</option> : <><option value="Educação">Educação</option><option value="Infraestrutura">Infraestrutura</option><option value="Alimentação">Alimentação</option><option value="Outros">Outros</option></>}
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block px-1">Comprovante / Nota Fiscal</label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 rounded-apple-lg p-6 flex flex-col items-center justify-center text-center hover:bg-apple-gray/50 transition-all cursor-pointer group bg-apple-gray/30 min-h-[140px]"
                >
                  {formData.proofImage ? (
                    <div className="relative w-full h-32 flex items-center justify-center overflow-hidden rounded-apple-lg border border-gray-100 shadow-sm">
                      <img src={formData.proofImage} alt="Preview" className="w-full h-full object-cover animate-in fade-in" />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[1px]">
                        <Camera className="text-white w-8 h-8" />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <Upload className="w-6 h-6 text-gray-400 group-hover:text-ejn-teal transition-colors" />
                      </div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Selecione o arquivo</p>
                      <p className="text-[10px] text-gray-300 mt-1">PNG, JPG ou PDF</p>
                    </>
                  )}
                </div>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                {formData.proofImage && <button type="button" onClick={() => setFormData({...formData, proofImage: ''})} className="text-[10px] font-bold text-red-400 hover:text-red-500 uppercase flex items-center gap-1 mx-auto"><Trash2 className="w-3 h-3" />Limpar Seleção</button>}
              </div>
              
              <button type="submit" className="w-full bg-ejn-teal text-white py-4 rounded-apple-xl font-black text-lg shadow-xl hover:bg-[#004d45] transition-all transform active:scale-95 shadow-ejn-teal/20">Registrar Movimentação</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
