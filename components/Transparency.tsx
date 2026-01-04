
import React, { useState } from 'react';
import { PieChart, FileText, ShieldCheck, Download, Calendar, Image as ImageIcon, Camera, X } from 'lucide-react';
import { Transacao } from '../types';

interface TransparencyProps {
  transactions: Transacao[];
}

export const Transparency: React.FC<TransparencyProps> = ({ transactions }) => {
  const [showExportModal, setShowExportModal] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyOuts = transactions.filter(t => {
    const d = new Date(t.created_at);
    return t.tipo === 'out' && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const totalMonthlyOut = monthlyOuts.reduce((acc, t) => acc + t.valor, 0);

  const categories = ['Educação', 'Infraestrutura', 'Alimentação', 'Outros'];
  const catData = categories.map(cat => {
    const amount = monthlyOuts.filter(t => t.categoria === cat).reduce((acc, t) => acc + t.valor, 0);
    const pct = totalMonthlyOut > 0 ? Math.round((amount / totalMonthlyOut) * 100) : 0;
    return { label: cat, amount, pct };
  });

  const verifiedTransactions = transactions
    .filter(t => t.tipo === 'out' && t.status === 'confirmed')
    .slice(0, 8); 

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-10">
      <div className="bg-white p-10 rounded-apple-2xl shadow-sm border border-gray-50 flex flex-col lg:flex-row items-center gap-12">
        <div className="w-48 h-48 relative flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {catData.map((d, i) => {
              let offset = 0;
              for(let j=0; j<i; j++) offset += catData[j].pct;
              const dashArray = `${d.pct} 100`;
              const colors = ['#005F55', '#E8AB00', '#FF6B6B', '#D1D5DB'];
              return d.pct > 0 ? (
                <circle key={i} cx="50" cy="50" r="40" fill="none" stroke={colors[i]} strokeWidth="12" strokeDasharray={dashArray} strokeDashoffset={-offset} />
              ) : null;
            })}
          </svg>
          <div className="absolute text-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Mês Atual</span>
            <p className="text-xl font-black text-ejn-teal">{new Intl.NumberFormat('pt-BR', { notation: 'compact' }).format(totalMonthlyOut)}</p>
          </div>
        </div>

        <div className="flex-1 space-y-8">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-2xl font-bold text-ejn-teal flex items-center gap-2"><PieChart className="w-6 h-6" />Impacto Mensal</h3>
              <p className="text-apple-text-secondary">Rastreamento real de investimentos educacionais.</p>
            </div>
            <button onClick={() => setShowExportModal(true)} className="bg-ejn-gold text-white px-6 py-3 rounded-apple-lg font-bold shadow-md shadow-ejn-gold/10">Relatório Completo</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {catData.map((item, i) => (
              <div key={i} className="p-4 bg-apple-gray rounded-apple-lg border border-gray-100">
                <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">{item.label}</span>
                <p className="text-lg font-black text-ejn-teal">{item.pct}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-bold text-ejn-teal flex items-center gap-3"><ShieldCheck className="w-6 h-6" />Feed de Evidências</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {verifiedTransactions.map((item) => (
            <div key={item.id} className="bg-white rounded-apple-2xl shadow-sm border border-gray-50 overflow-hidden group">
              <div className="relative h-40 bg-gray-100">
                {item.comprovante_url ? (
                  <img src={item.comprovante_url} alt={item.descricao} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><FileText className="w-10 h-10 text-gray-300" /></div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                  <button onClick={() => item.comprovante_url && setLightboxImage(item.comprovante_url)} className="text-white text-xs font-bold bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">Ver Comprovante</button>
                </div>
              </div>
              <div className="p-5">
                <h4 className="font-bold text-gray-800 text-sm mb-1">{item.descricao}</h4>
                <div className="flex items-center gap-2 text-[10px] text-apple-text-secondary font-bold uppercase">
                  <Calendar className="w-3 h-3" />
                  {new Date(item.created_at).toLocaleDateString('pt-BR')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {lightboxImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-12 animate-in fade-in">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setLightboxImage(null)} />
          <div className="relative max-w-4xl bg-white rounded-apple-2xl overflow-hidden shadow-2xl animate-in zoom-in-95">
            <img src={lightboxImage} alt="Doc" className="w-full h-auto max-h-[80vh] object-contain" />
            <div className="p-8 border-t flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-ejn-teal">Comprovação Fiscal EJN</h3>
                <p className="text-xs text-apple-text-secondary">Evidência validada pelo comitê de transparência.</p>
              </div>
              <button onClick={() => setLightboxImage(null)} className="p-4 bg-apple-gray rounded-full"><X /></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
