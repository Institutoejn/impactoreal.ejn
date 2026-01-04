
import React, { useState } from 'react';
import { PieChart, FileText, CheckCircle2, ShieldCheck, Download, Calendar, Image as ImageIcon, Camera, X } from 'lucide-react';
// Importação corrigida para Transacao
import { Transacao } from '../types';

interface TransparencyProps {
  transactions: Transacao[];
}

export const Transparency: React.FC<TransparencyProps> = ({ transactions }) => {
  const [showExportModal, setShowExportModal] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  // Calculate monthly stats based on real transactions
  const monthlyOuts = transactions.filter(t => {
    const d = new Date(t.date);
    return t.type === 'out' && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  // Propriedade corrigida de amount para valor
  const totalMonthlyOut = monthlyOuts.reduce((acc, t) => acc + t.valor, 0);

  const categories = ['Educação', 'Infraestrutura', 'Alimentação', 'Outros'];
  const catData = categories.map(cat => {
    const amount = monthlyOuts
      .filter(t => t.categoria === cat)
      // Propriedade corrigida de amount para valor
      .reduce((acc, t) => acc + t.valor, 0);
    const pct = totalMonthlyOut > 0 ? Math.round((amount / totalMonthlyOut) * 100) : 0;
    return { label: cat, amount, pct };
  });

  // Verification Feed (Show real proof images from transactions)
  const verifiedTransactions = transactions
    .filter(t => t.type === 'out' && t.status === 'confirmed')
    .slice(0, 8); 

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8 md:space-y-10">
      {/* Header Card: Fluid Layout */}
      <div className="bg-white p-6 md:p-10 rounded-apple-2xl shadow-sm border border-gray-50 flex flex-col lg:flex-row items-center gap-8 md:gap-12">
        <div className="w-48 h-48 md:w-64 md:h-64 relative flex items-center justify-center shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {catData.map((d, i) => {
              let offset = 0;
              for(let j=0; j<i; j++) offset += catData[j].pct;
              const dashArray = `${d.pct} 100`;
              const colors = ['#005F55', '#E8AB00', '#FF6B6B', '#D1D5DB'];
              return d.pct > 0 ? (
                <circle
                  key={i}
                  cx="50" cy="50" r="40"
                  fill="none"
                  stroke={colors[i]}
                  strokeWidth="12"
                  strokeDasharray={dashArray}
                  strokeDashoffset={-offset}
                  className="transition-all duration-1000 ease-out"
                />
              ) : null;
            })}
          </svg>
          <div className="absolute flex flex-col items-center text-center">
            <span className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Total Mês</span>
            <span className="text-xl md:text-2xl font-black text-ejn-teal tracking-tighter">
              {new Intl.NumberFormat('pt-BR', { notation: 'compact' }).format(totalMonthlyOut)}
            </span>
          </div>
        </div>

        <div className="flex-1 space-y-6 md:space-y-8 w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-ejn-teal mb-2 flex items-center gap-2">
                <PieChart className="w-6 h-6" />
                Impacto Mensal
              </h3>
              <p className="text-apple-text-secondary text-sm md:text-base leading-relaxed max-w-lg">
                Rastreamento real de investimentos. Garantia de transparência absoluta em cada real.
              </p>
            </div>
            <button 
              onClick={() => setShowExportModal(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-ejn-gold text-white px-6 py-3 rounded-apple-lg font-bold hover:bg-[#D19900] transition-all transform active:scale-95 shadow-md shadow-ejn-gold/20 text-sm"
            >
              <Download className="w-5 h-5" />
              Relatório Completo
            </button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
            {catData.map((item, i) => {
               const colors = ['bg-ejn-teal', 'bg-ejn-gold', 'bg-red-400', 'bg-gray-200'];
               return (
                <div key={i} className="p-3 md:p-4 bg-apple-gray rounded-apple-lg border border-gray-100 hover:shadow-sm transition-all">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full ${colors[i]}`} />
                    <span className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate">{item.label}</span>
                  </div>
                  <p className="text-base md:text-lg font-black text-ejn-teal">{item.pct}%</p>
                </div>
               );
            })}
          </div>
        </div>
      </div>

      {/* Feed de Comprovação - Grid Responsive */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h3 className="text-xl font-bold text-ejn-teal flex items-center gap-3">
            <ShieldCheck className="w-6 h-6" />
            Feed de Transparência
          </h3>
          <span className="text-[10px] md:text-[11px] font-bold text-gray-400 uppercase tracking-widest bg-apple-gray px-4 py-2 rounded-full flex items-center gap-2">
            <Camera className="w-3 h-3" />
            Atualizações em tempo real
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {verifiedTransactions.map((item) => (
            <div key={item.id} className="bg-white rounded-apple-2xl shadow-sm border border-gray-50 overflow-hidden group hover:shadow-xl transition-all duration-500">
              <div className="relative h-40 md:h-48 overflow-hidden bg-gray-100">
                {/* Propriedade corrigida de proofImage para comprovante_url */}
                {item.comprovante_url ? (
                  <img src={item.comprovante_url} alt={item.descricao} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FileText className="w-10 h-10 md:w-12 md:h-12 text-gray-300" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4 md:p-6 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => item.comprovante_url && setLightboxImage(item.comprovante_url)}
                    className="text-white text-[10px] md:text-xs font-bold flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full w-full justify-center hover:bg-white/30 transition-all border border-white/20"
                  >
                    <ImageIcon className="w-4 h-4" />
                    Ver Evidência
                  </button>
                </div>
                <div className="absolute top-3 left-3">
                  <span className="bg-white/90 backdrop-blur-sm text-ejn-teal text-[8px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-sm border border-ejn-teal/10">
                    {item.categoria}
                  </span>
                </div>
              </div>
              <div className="p-4 md:p-6">
                <h4 className="font-bold text-gray-800 text-sm mb-1 leading-tight line-clamp-1">{item.descricao}</h4>
                <div className="flex items-center gap-2 text-[10px] text-apple-text-secondary font-medium uppercase tracking-widest">
                  <Calendar className="w-3 h-3" />
                  {new Date(item.date).toLocaleDateString('pt-BR')}
                </div>
              </div>
            </div>
          ))}
          {verifiedTransactions.length === 0 && (
            <div className="col-span-full py-16 text-center bg-white rounded-apple-2xl border-2 border-dashed border-gray-100 p-6">
              <p className="text-apple-text-secondary font-medium text-sm">Aguardando novos lançamentos de impacto.</p>
            </div>
          )}
        </div>
      </div>

      {/* Detailed Table - Responsive Scroll */}
      <div className="bg-white rounded-apple-2xl shadow-sm border border-gray-50 overflow-hidden font-sans">
        <div className="p-6 md:p-8 border-b border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="w-6 h-6 text-ejn-teal" />
            <h3 className="text-lg md:text-xl font-bold text-ejn-teal">Histórico Detalhado</h3>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[600px]">
            <thead className="bg-apple-gray uppercase tracking-widest text-[10px] md:text-[11px] font-bold text-gray-400">
              <tr>
                <th className="px-8 py-4">Lançamento</th>
                <th className="px-8 py-4 text-right">Montante</th>
                <th className="px-8 py-4 text-right">Status</th>
                <th className="px-8 py-4 text-right">Doc</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {monthlyOuts.map((out) => (
                <tr key={out.id} className="hover:bg-apple-gray/30 transition-all group">
                  <td className="px-8 py-5">
                    <p className="font-bold text-gray-800 text-sm md:text-base">{out.descricao}</p>
                    <p className="text-[10px] md:text-xs text-apple-text-secondary mt-0.5">{out.categoria} • {new Date(out.date).toLocaleDateString('pt-BR')}</p>
                  </td>
                  <td className="px-8 py-5 text-right font-bold text-gray-900 text-sm md:text-base whitespace-nowrap">
                    {/* Propriedade corrigida de amount para valor */}
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(out.valor)}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <span className="text-[9px] md:text-[10px] text-green-600 font-black uppercase tracking-widest bg-green-50 px-2 py-1 rounded-full whitespace-nowrap">Verificado</span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      {/* Propriedade corrigida de proofImage para comprovante_url */}
                      {out.comprovante_url && (
                        <button onClick={() => setLightboxImage(out.comprovante_url!)} className="p-2 text-gray-300 hover:text-ejn-teal transition-colors"><ImageIcon className="w-4 h-4" /></button>
                      )}
                      <button className="p-2 text-gray-300 hover:text-ejn-teal transition-colors"><Download className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lightbox - Fully Responsive Overlay */}
      {lightboxImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setLightboxImage(null)} />
          <button onClick={() => setLightboxImage(null)} className="absolute top-6 right-6 md:top-10 md:right-10 p-4 text-white hover:bg-white/10 rounded-full transition-all z-[110]"><X className="w-8 h-8" /></button>
          <div className="relative max-w-5xl w-full max-h-full overflow-hidden rounded-apple-xl shadow-2xl animate-in zoom-in-95 duration-500 bg-white">
            <img src={lightboxImage} alt="Prova de impacto" className="w-full h-auto max-h-[70vh] object-contain mx-auto" />
            <div className="p-6 md:p-8 bg-white border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-center sm:text-left">
                <h3 className="text-lg font-bold text-ejn-teal leading-tight">Comprovação Fiscal</h3>
                <p className="text-xs md:text-sm text-apple-text-secondary">Evidência validada e auditada pelo Instituto</p>
              </div>
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-ejn-teal text-white px-8 py-4 rounded-apple-xl font-bold text-sm shadow-lg shadow-ejn-teal/10 transform active:scale-95 transition-all">
                <Download className="w-5 h-5" />
                Baixar Original
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal - Mobile Adapt */}
      {showExportModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm fixed" onClick={() => setShowExportModal(false)} />
          <div className="relative bg-white w-full max-w-xl rounded-apple-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 my-auto">
            <div className="p-8 md:p-12 text-center">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-ejn-teal/10 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-8">
                <Download className="w-8 h-8 md:w-10 md:h-10 text-ejn-teal" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-ejn-teal mb-4 tracking-tight leading-tight">Relatório Consolidado</h2>
              <p className="text-apple-text-secondary text-sm md:text-lg mb-8 md:mb-10 leading-relaxed px-2">
                O arquivo conterá todos os comprovantes e métricas de impacto do mês de Outubro.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={() => setShowExportModal(false)} className="order-2 sm:order-1 flex-1 py-4 bg-apple-gray rounded-apple-lg font-bold text-gray-400 hover:bg-gray-200 transition-all text-sm uppercase tracking-widest">Voltar</button>
                <button onClick={() => setShowExportModal(false)} className="order-1 sm:order-2 flex-1 py-4 bg-ejn-teal text-white rounded-apple-lg font-bold shadow-lg shadow-ejn-teal/20 hover:bg-[#004d45] transition-all transform active:scale-95 text-sm uppercase tracking-widest">Confirmar</button>
              </div>
            </div>
            <button onClick={() => setShowExportModal(false)} className="absolute top-4 right-4 p-2 text-gray-300 hover:text-gray-500"><X className="w-6 h-6" /></button>
          </div>
        </div>
      )}
    </div>
  );
};
