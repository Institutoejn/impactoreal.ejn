
import React, { useState } from 'react';
import { PieChart, FileText, ShieldCheck, Download, Calendar, Image as ImageIcon, Camera, X, Loader2 } from 'lucide-react';
import { Transacao } from '../types';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface TransparencyProps {
  transactions: Transacao[];
  impactCount?: number;
  totalInvested?: number;
}

export const Transparency: React.FC<TransparencyProps> = ({ transactions, impactCount = 0, totalInvested = 0 }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const confirmedOuts = transactions.filter(t => t.tipo === 'saida' && t.status === 'confirmado');
  const monthlyOuts = confirmedOuts.filter(t => {
    const d = new Date(t.created_at);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const totalMonthlyOut = monthlyOuts.reduce((acc, t) => acc + t.valor, 0);

  const categories = ['Educação', 'Infraestrutura', 'Alimentação', 'Outros'];
  const catData = categories.map(cat => {
    const amount = monthlyOuts.filter(t => t.categoria === cat).reduce((acc, t) => acc + t.valor, 0);
    const pct = totalMonthlyOut > 0 ? Math.round((amount / totalMonthlyOut) * 100) : 0;
    return { label: cat, amount, pct };
  });

  const verifiedTransactions = confirmedOuts.slice(0, 8); 

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const ejnTeal = [0, 95, 85];
      const ejnGold = [232, 171, 0];
      const ejnDark = [31, 41, 55];

      doc.setFillColor(245, 245, 247);
      doc.rect(0, 0, 210, 40, 'F');
      
      doc.setTextColor(ejnTeal[0], ejnTeal[1], ejnTeal[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.text('Instituto EJN', 20, 20);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Destino real: Transparência Absoluta', 20, 28);

      doc.setDrawColor(ejnGold[0], ejnGold[1], ejnGold[2]);
      doc.setLineWidth(0.5);
      doc.line(140, 15, 190, 15);
      doc.line(140, 25, 190, 25);
      doc.setFontSize(8);
      doc.setTextColor(ejnGold[0], ejnGold[1], ejnGold[2]);
      doc.text('DADOS AUDITADOS', 165, 20, { align: 'center' });
      doc.text('Sincronização em Tempo Real', 165, 23, { align: 'center' });

      doc.setTextColor(ejnDark[0], ejnDark[1], ejnDark[2]);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Destino real: Panorama de Impacto', 20, 55);

      const summaryY = 65;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Líderes formados no Ciclo:', 20, summaryY);
      doc.setFont('helvetica', 'bold');
      doc.text(`${impactCount} Líderes`, 85, summaryY);

      doc.setFont('helvetica', 'normal');
      doc.text('Impacto Social Investido:', 20, summaryY + 8);
      doc.setFont('helvetica', 'bold');
      doc.text(new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalInvested), 85, summaryY + 8);

      doc.setFontSize(14);
      doc.text('Rastreabilidade: Fluxo Real', 20, summaryY + 35);

      const tableData = confirmedOuts.map(t => [
        new Date(t.created_at).toLocaleDateString('pt-BR'),
        t.descricao,
        t.categoria,
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(t.valor)
      ]);

      if (tableData.length === 0) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'italic');
        doc.text('Nenhuma evidência registrada no período.', 20, summaryY + 45);
      } else {
        autoTable(doc, {
          startY: summaryY + 40,
          head: [['Data', 'Descrição', 'Eixo', 'Valor']],
          body: tableData,
          theme: 'striped',
          headStyles: { 
            fillColor: ejnTeal,
            fontSize: 10,
            fontStyle: 'bold'
          },
          bodyStyles: { 
            fontSize: 9,
            textColor: ejnDark
          },
          columnStyles: {
            3: { halign: 'right' }
          },
          margin: { left: 20, right: 20 }
        });
      }

      doc.save(`Destino_Real_EJN_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Falha técnica:', error);
      alert('Tente novamente em instantes.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-12">
      <div className="bg-white p-12 rounded-apple-2xl shadow-sm border border-gray-50 flex flex-col lg:flex-row items-center gap-16">
        <div className="w-56 h-56 relative flex items-center justify-center">
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
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Este mês</span>
            <p className="text-2xl font-black text-ejn-teal">{new Intl.NumberFormat('pt-BR', { notation: 'compact' }).format(totalMonthlyOut)}</p>
          </div>
        </div>

        <div className="flex-1 space-y-10">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-3xl font-bold text-ejn-teal flex items-center gap-3 tracking-tighter"><PieChart className="w-8 h-8" />Destino real</h3>
              <p className="text-apple-text-secondary font-extralight text-lg">Transparência absoluta em cada movimento.</p>
            </div>
            <button 
              onClick={handleGeneratePDF}
              disabled={isGenerating}
              className={`bg-ejn-gold text-white px-8 py-4 rounded-apple-xl font-bold shadow-xl shadow-ejn-gold/20 flex items-center gap-3 transition-all ${isGenerating ? 'opacity-70 cursor-wait' : 'hover:bg-[#D19900] active:scale-95'}`}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Sincronizando...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Relatório PDF
                </>
              )}
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {catData.map((item, i) => (
              <div key={i} className="p-6 bg-apple-gray/50 rounded-apple-xl border border-gray-100">
                <span className="text-[10px] font-bold text-gray-400 uppercase block mb-2 tracking-widest">{item.label}</span>
                <p className="text-2xl font-black text-ejn-teal">{item.pct}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <h3 className="text-2xl font-bold text-ejn-teal flex items-center gap-3 tracking-tighter"><ShieldCheck className="w-8 h-8" />Transparência</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {verifiedTransactions.map((item) => (
            <div key={item.id} className="bg-white rounded-apple-2xl shadow-sm border border-gray-50 overflow-hidden group hover:shadow-xl transition-all duration-500">
              <div className="relative h-48 bg-gray-100">
                {item.comprovante_url ? (
                  <img src={item.comprovante_url} alt={item.descricao} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><FileText className="w-12 h-12 text-gray-200" /></div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                  <button onClick={() => item.comprovante_url && setLightboxImage(item.comprovante_url)} className="text-white text-xs font-bold bg-white/20 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/20">Ver recibo</button>
                </div>
              </div>
              <div className="p-6">
                <h4 className="font-bold text-gray-800 text-sm mb-2 line-clamp-1">{item.descricao}</h4>
                <div className="flex items-center gap-2 text-[10px] text-apple-text-secondary font-bold uppercase tracking-widest">
                  <Calendar className="w-3 h-3" />
                  {new Date(item.created_at).toLocaleDateString('pt-BR')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {lightboxImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 animate-in fade-in">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setLightboxImage(null)} />
          <div className="relative max-w-4xl bg-white rounded-apple-2xl overflow-hidden shadow-2xl animate-in zoom-in-95">
            <img src={lightboxImage} alt="Doc" className="w-full h-auto max-h-[80vh] object-contain" />
            <div className="p-10 border-t flex justify-between items-center bg-white">
              <div>
                <h3 className="text-xl font-bold text-ejn-teal">Comprovação Fiscal</h3>
                <p className="text-sm text-apple-text-secondary font-extralight">Auditado pelo Instituto EJN.</p>
              </div>
              <button onClick={() => setLightboxImage(null)} className="p-4 bg-apple-gray rounded-full hover:bg-gray-200 transition-colors"><X className="w-6 h-6 text-gray-400" /></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
