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

      // Cores do Instituto
      const ejnTeal = [0, 95, 85]; // #005F55
      const ejnGold = [232, 171, 0]; // #E8AB00
      const ejnDark = [31, 41, 55]; // #1F2937

      // Cabeçalho
      doc.setFillColor(245, 245, 247); // Apple Gray
      doc.rect(0, 0, 210, 40, 'F');
      
      doc.setTextColor(ejnTeal[0], ejnTeal[1], ejnTeal[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.text('Instituto EJN', 20, 20);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Relatório de Transparência e Impacto Social', 20, 28);

      // Selo de Autenticidade
      doc.setDrawColor(ejnGold[0], ejnGold[1], ejnGold[2]);
      doc.setLineWidth(0.5);
      doc.line(140, 15, 190, 15);
      doc.line(140, 25, 190, 25);
      doc.setFontSize(8);
      doc.setTextColor(ejnGold[0], ejnGold[1], ejnGold[2]);
      doc.text('PERFIL AUDITADO', 165, 20, { align: 'center' });
      doc.text('Dados em Tempo Real via Supabase', 165, 23, { align: 'center' });

      // Resumo Executivo
      doc.setTextColor(ejnDark[0], ejnDark[1], ejnDark[2]);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Resumo Executivo', 20, 55);

      const summaryY = 65;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Total de Jovens Impactados:', 20, summaryY);
      doc.setFont('helvetica', 'bold');
      doc.text(`${impactCount} Jovens`, 75, summaryY);

      doc.setFont('helvetica', 'normal');
      doc.text('Total Investido (Social):', 20, summaryY + 8);
      doc.setFont('helvetica', 'bold');
      doc.text(new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalInvested), 75, summaryY + 8);

      doc.setFont('helvetica', 'normal');
      doc.text('Data do Relatório:', 20, summaryY + 16);
      doc.setFont('helvetica', 'bold');
      doc.text(new Date().toLocaleDateString('pt-BR'), 75, summaryY + 16);

      // Tabela de Movimentações
      doc.setFontSize(14);
      doc.text('Histórico de Destinação de Recursos', 20, summaryY + 35);

      const tableData = confirmedOuts.map(t => [
        new Date(t.created_at).toLocaleDateString('pt-BR'),
        t.descricao,
        t.categoria,
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(t.valor)
      ]);

      if (tableData.length === 0) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'italic');
        doc.text('Nenhuma movimentação confirmada registrada no período.', 20, summaryY + 45);
      } else {
        autoTable(doc, {
          startY: summaryY + 40,
          head: [['Data', 'Descrição', 'Categoria', 'Valor']],
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

      // Distribuição por Categoria (Gráfico textual/mini-tabela)
      const finalY = (doc as any).lastAutoTable.finalY || 150;
      doc.setFontSize(14);
      doc.text('Distribuição por Categoria (Mês Atual)', 20, finalY + 20);

      catData.forEach((d, i) => {
        const itemY = finalY + 30 + (i * 8);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(d.label, 25, itemY);
        doc.text(`${d.pct}%`, 80, itemY);
        
        // Mini barra de progresso
        doc.setFillColor(240, 240, 240);
        doc.rect(95, itemY - 3, 50, 2, 'F');
        doc.setFillColor(ejnTeal[0], ejnTeal[1], ejnTeal[2]);
        doc.rect(95, itemY - 3, d.pct / 2, 2, 'F');
      });

      // Rodapé
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text('Instituto EJN - Educação e Impacto Social Sincronizado', 105, 285, { align: 'center' });
        doc.text(`Página ${i} de ${pageCount}`, 190, 285, { align: 'right' });
      }

      doc.save(`Relatorio_Transparencia_EJN_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Falha ao gerar PDF:', error);
      alert('Houve um erro técnico ao processar seu documento. Tente novamente em instantes.');
    } finally {
      setIsGenerating(false);
    }
  };

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
            <button 
              onClick={handleGeneratePDF}
              disabled={isGenerating}
              className={`bg-ejn-gold text-white px-6 py-3 rounded-apple-lg font-bold shadow-md shadow-ejn-gold/10 flex items-center gap-2 transition-all ${isGenerating ? 'opacity-70 cursor-wait' : 'hover:bg-[#D19900]'}`}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Gerando PDF...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Relatório Completo
                </>
              )}
            </button>
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
                <h4 className="font-bold text-gray-800 text-sm mb-1 line-clamp-1">{item.descricao}</h4>
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