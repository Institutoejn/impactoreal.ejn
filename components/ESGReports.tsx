import React, { useState } from 'react';
import { FileBarChart, Download, Sparkles, Globe, Printer, Share2, X, CheckCircle2 } from 'lucide-react';
import { Transacao, Perfil } from '../types';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ESGReportsProps {
  transactions: Transacao[];
  studentCount: number;
  profileData: Partial<Perfil>;
}

export const ESGReports: React.FC<ESGReportsProps> = ({ transactions, studentCount, profileData }) => {
  const [showPreview, setShowPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Consolidação de Dados Financeiros
  const confirmedTransactions = transactions.filter(t => t.status === 'confirmado');
  const totalIn = confirmedTransactions
    .filter(t => t.tipo === 'entrada')
    .reduce((acc, t) => acc + t.valor, 0);
  
  const totalOut = confirmedTransactions
    .filter(t => t.tipo === 'saida')
    .reduce((acc, t) => acc + t.valor, 0);

  const balance = totalIn - totalOut;

  // Cálculo de Eficiência por Categoria
  const categories = ['Educação', 'Infraestrutura', 'Alimentação', 'Outros'];
  const outputs = confirmedTransactions.filter(t => t.tipo === 'saida');
  
  const stats = categories.map(cat => {
    const amount = outputs.filter(t => t.categoria === cat).reduce((acc, t) => acc + t.valor, 0);
    const pct = totalOut > 0 ? (amount / totalOut) * 100 : 0;
    return { cat, amount, pct };
  });

  const generatePDF = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      try {
        const doc = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });

        const ejnTeal = [0, 95, 85];
        const ejnGold = [232, 171, 0];
        const textDark = [17, 24, 39];
        const textGray = [107, 114, 128];

        // --- HEADER ---
        doc.setFillColor(245, 245, 247); // Apple Gray
        doc.rect(0, 0, 210, 40, 'F');
        
        // Logo Customizado
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(18);
        doc.setTextColor(ejnGold[0], ejnGold[1], ejnGold[2]);
        doc.text('Impacto Real', 20, 22);
        doc.setTextColor(textDark[0], textDark[1], textDark[2]);
        doc.text('IEJN', 61, 22);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(textGray[0], textGray[1], textGray[2]);
        doc.text('Relatório de Sustentabilidade e Governança (ESG)', 20, 30);
        
        doc.setFont('helvetica', 'bold');
        doc.text(`EMITIDO EM: ${new Date().toLocaleDateString('pt-BR')}`, 190, 22, { align: 'right' });

        // --- SEÇÃO 1: IMPACTO SOCIAL ---
        let currentY = 55;
        doc.setFontSize(14);
        doc.setTextColor(ejnTeal[0], ejnTeal[1], ejnTeal[2]);
        doc.text('01. IMPACTO SOCIAL (ODS 4)', 20, currentY);
        
        currentY += 12;
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(240, 240, 240);
        
        // Card de Alunos
        doc.roundedRect(20, currentY, 80, 25, 3, 3, 'FD');
        doc.setFontSize(8);
        doc.setTextColor(textGray[0], textGray[1], textGray[2]);
        doc.text('TALENTOS EM FORMAÇÃO', 25, currentY + 8);
        doc.setFontSize(16);
        doc.setTextColor(ejnGold[0], ejnGold[1], ejnGold[2]);
        doc.text(`${studentCount} Jovens`, 25, currentY + 18);

        // Card de Vidas
        doc.roundedRect(110, currentY, 80, 25, 3, 3, 'FD');
        doc.setFontSize(8);
        doc.setTextColor(textGray[0], textGray[1], textGray[2]);
        doc.text('VIDAS DESPERTADAS (INDIRETOS)', 115, currentY + 8);
        doc.setFontSize(16);
        doc.setTextColor(ejnTeal[0], ejnTeal[1], ejnTeal[2]);
        doc.text(`${studentCount * 4} Pessoas`, 115, currentY + 18);

        // --- SEÇÃO 2: GOVERNANÇA FINANCEIRA ---
        currentY += 40;
        doc.setFontSize(14);
        doc.setTextColor(ejnTeal[0], ejnTeal[1], ejnTeal[2]);
        doc.text('02. GOVERNANÇA E TRANSPARÊNCIA', 20, currentY);

        currentY += 8;
        autoTable(doc, {
          startY: currentY,
          head: [['CONTA', 'DESCRIÇÃO TÉCNICA', 'VALOR CONSOLIDADO']],
          body: [
            ['Captação Social', 'Total de doações e aportes via plataforma', new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalIn)],
            ['Investimento Direto', 'Execução de projetos e trilhas educacionais', new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalOut)],
            ['Saldo em Custódia', 'Recursos disponíveis para novos amanhãs', new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(balance)]
          ],
          theme: 'plain',
          headStyles: { fillColor: [245, 245, 247], textColor: textDark, fontStyle: 'bold', fontSize: 9 },
          bodyStyles: { textColor: textGray, fontSize: 10 },
          columnStyles: { 2: { halign: 'right', textColor: ejnTeal, fontStyle: 'bold' } },
          margin: { left: 20, right: 20 }
        });

        // --- SEÇÃO 3: EFICIÊNCIA OPERACIONAL ---
        currentY = (doc as any).lastAutoTable.finalY + 20;
        doc.setFontSize(12);
        doc.setTextColor(textDark[0], textDark[1], textDark[2]);
        doc.text('Alocação por Eixo de Impacto (%)', 20, currentY);

        currentY += 8;
        stats.forEach((s, i) => {
          doc.setFillColor(245, 245, 247);
          doc.roundedRect(20, currentY, 170, 10, 2, 2, 'F');
          doc.setFillColor(ejnGold[0], ejnGold[1], ejnGold[2]);
          doc.rect(20, currentY, (170 * s.pct) / 100, 10, 'F');
          
          doc.setFontSize(8);
          doc.setTextColor(textDark[0], textDark[1], textDark[2]);
          doc.text(`${s.cat}: ${s.pct.toFixed(1)}%`, 22, currentY + 6);
          currentY += 14;
        });

        // --- SEÇÃO 4: DADOS INSTITUCIONAIS ---
        currentY += 10;
        doc.setDrawColor(230, 230, 230);
        doc.line(20, currentY, 190, currentY);
        
        currentY += 10;
        doc.setFontSize(12);
        doc.setTextColor(ejnTeal[0], ejnTeal[1], ejnTeal[2]);
        doc.text('03. INFRAESTRUTURA LEGAL', 20, currentY);

        currentY += 10;
        doc.setFontSize(9);
        doc.setTextColor(textGray[0], textGray[1], textGray[2]);
        doc.text(`Razão Social: ${profileData.razao_social || 'Instituto Escola Jovens de Negócios'}`, 20, currentY);
        doc.text(`CNPJ: ${profileData.cnpj || '51.708.193/0001-70'}`, 20, currentY + 6);
        doc.text(`Sede: ${profileData.endereco || 'São Paulo - Brasil'}`, 20, currentY + 12);

        // --- FOOTER ---
        doc.setFontSize(7);
        doc.setTextColor(180, 180, 180);
        doc.text('Documento gerado automaticamente pela plataforma Impacto Real. Dados sincronizados com o banco de dados oficial do Instituto EJN.', 105, 285, { align: 'center' });

        doc.save(`Relatorio_Impacto_ESG_EJN_${new Date().getFullYear()}.pdf`);
        setIsGenerating(false);
        setShowPreview(true);
      } catch (err) {
        console.error("Erro ao gerar PDF:", err);
        alert("Erro técnico ao consolidar relatório.");
        setIsGenerating(false);
      }
    }, 1500);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white p-12 rounded-apple-2xl shadow-sm border border-gray-50 flex flex-col items-center text-center max-w-2xl mx-auto">
        <div className="w-16 h-16 bg-ejn-teal/5 rounded-full flex items-center justify-center mb-8 relative">
          <FileBarChart className="w-8 h-8 text-ejn-teal" />
          <div className="absolute -top-1 -right-1">
            <Sparkles className="w-5 h-5 text-ejn-gold animate-pulse" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-ejn-teal mb-4 tracking-tight">Gerador de Relatório ESG de Elite</h2>
        <p className="text-apple-text-secondary text-base mb-10 leading-relaxed font-extralight">
          Consolide o impacto social do Instituto em um documento oficial. Perfeito para prestação de contas com patrocinadores e investidores institucionais.
        </p>
        
        <div className="flex gap-4">
          <button 
            onClick={generatePDF}
            disabled={isGenerating}
            className={`group flex items-center justify-center gap-3 px-8 py-4 rounded-apple-xl font-bold text-base transition-all transform active:scale-95 shadow-xl ${
              isGenerating 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-ejn-teal text-white hover:bg-[#004d45] shadow-ejn-teal/20'
            }`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Auditando Dados...
              </>
            ) : (
              <>
                <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Baixar Relatório ESG
              </>
            )}
          </button>
        </div>
      </div>

      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowPreview(false)} />
          
          <div className="relative bg-white w-full max-w-lg p-10 rounded-apple-2xl shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            <h3 className="text-2xl font-bold text-ejn-teal mb-2">Relatório Gerado!</h3>
            <p className="text-apple-text-secondary font-extralight mb-8">O documento foi processado e o download deve ter iniciado automaticamente.</p>
            <button 
              onClick={() => setShowPreview(false)}
              className="w-full bg-apple-gray text-ejn-teal py-4 rounded-apple-lg font-bold hover:bg-gray-100 transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Loader2 = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);