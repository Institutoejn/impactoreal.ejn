import React, { useState } from 'react';
import { FileBarChart, Download, Sparkles, Globe, Printer, Share2, X, CheckCircle2, Briefcase, Rocket } from 'lucide-react';
import { Transacao, Perfil } from '../types';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ESGReportsProps {
  transactions: Transacao[];
  studentCount: number;
  marketCount: number;
  businessCount: number;
  profileData: Partial<Perfil>;
}

export const ESGReports: React.FC<ESGReportsProps> = ({ transactions, studentCount, marketCount, businessCount, profileData }) => {
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

  // Cálculo de Empregabilidade
  const employabilityRate = studentCount > 0 ? ((marketCount / studentCount) * 100).toFixed(1) : "0.0";

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

        // --- SEÇÃO 1: IMPACTO SOCIAL E CARREIRA ---
        let currentY = 55;
        doc.setFontSize(14);
        doc.setTextColor(ejnTeal[0], ejnTeal[1], ejnTeal[2]);
        doc.text('01. IMPACTO SOCIAL E SUCESSO DE CARREIRA', 20, currentY);
        
        currentY += 12;
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(240, 240, 240);
        
        // Card de Alunos
        doc.roundedRect(20, currentY, 80, 25, 3, 3, 'FD');
        doc.setFontSize(8);
        doc.setTextColor(textGray[0], textGray[1], textGray[2]);
        doc.text('JOVENS EM FORMAÇÃO', 25, currentY + 8);
        doc.setFontSize(16);
        doc.setTextColor(ejnGold[0], ejnGold[1], ejnGold[2]);
        doc.text(`${studentCount} Líderes`, 25, currentY + 18);

        // Card de Vidas
        doc.roundedRect(110, currentY, 80, 25, 3, 3, 'FD');
        doc.setFontSize(8);
        doc.setTextColor(textGray[0], textGray[1], textGray[2]);
        doc.text('VIDAS IMPACTADAS (INDIRETOS)', 115, currentY + 8);
        doc.setFontSize(16);
        doc.setTextColor(ejnTeal[0], ejnTeal[1], ejnTeal[2]);
        doc.text(`${studentCount * 4} Pessoas`, 115, currentY + 18);

        // --- SEÇÃO: IMPACTO NO MERCADO DE TRABALHO ---
        currentY += 40;
        doc.setFontSize(12);
        doc.setTextColor(textDark[0], textDark[1], textDark[2]);
        doc.text('Impacto no Mercado de Trabalho', 20, currentY);

        currentY += 8;
        doc.setFillColor(245, 245, 247);
        doc.roundedRect(20, currentY, 170, 35, 3, 3, 'F');
        
        // Selo de Sucesso Profissional
        doc.setFillColor(ejnGold[0], ejnGold[1], ejnGold[2]);
        doc.roundedRect(145, currentY + 5, 40, 10, 2, 2, 'F');
        doc.setFontSize(7);
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.text('SUCESSO PROFISSIONAL', 165, currentY + 11.5, { align: 'center' });

        doc.setFontSize(9);
        doc.setTextColor(textGray[0], textGray[1], textGray[2]);
        doc.setFont('helvetica', 'normal');
        doc.text('Taxa de Empregabilidade:', 28, currentY + 12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(ejnTeal[0], ejnTeal[1], ejnTeal[2]);
        doc.text(`${employabilityRate}%`, 68, currentY + 12);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(textGray[0], textGray[1], textGray[2]);
        doc.text('Fomentação de Negócios:', 28, currentY + 22);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(ejnGold[0], ejnGold[1], ejnGold[2]);
        doc.text(`${businessCount} Novos Empreendedores`, 68, currentY + 22);

        // --- SEÇÃO 2: GOVERNANÇA FINANCEIRA ---
        currentY += 50;
        doc.setFontSize(14);
        doc.setTextColor(ejnTeal[0], ejnTeal[1], ejnTeal[2]);
        doc.text('02. GOVERNANÇA E TRANSPARÊNCIA FINANCEIRA', 20, currentY);

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

        // --- FOOTER ---
        doc.setFontSize(7);
        doc.setTextColor(180, 180, 180);
        doc.text('Documento gerado pela Inteligência de Dados Impacto Real. IEJN - Inovação em Capital Social.', 105, 285, { align: 'center' });

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
        
        <h2 className="text-2xl font-bold text-ejn-teal mb-4 tracking-tight">Gerador de Relatório ESG 3.0</h2>
        <p className="text-apple-text-secondary text-base mb-10 leading-relaxed font-extralight">
          Consolide o impacto social do Instituto em um documento oficial. Agora com métricas de empregabilidade e novos negócios para investidores de elite.
        </p>
        
        <div className="grid grid-cols-2 gap-6 w-full mb-10">
          <div className="bg-apple-gray p-6 rounded-apple-xl">
            <Briefcase className="w-5 h-5 text-ejn-teal mb-2 mx-auto" />
            <p className="text-xl font-bold text-ejn-teal">{marketCount}</p>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Empregados</p>
          </div>
          <div className="bg-apple-gray p-6 rounded-apple-xl">
            <Rocket className="w-5 h-5 text-ejn-gold mb-2 mx-auto" />
            <p className="text-xl font-bold text-ejn-gold">{businessCount}</p>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Empreendendo</p>
          </div>
        </div>
        
        <div className="flex gap-4 w-full">
          <button 
            onClick={generatePDF}
            disabled={isGenerating}
            className={`w-full group flex items-center justify-center gap-3 px-8 py-5 rounded-apple-xl font-bold text-base transition-all transform active:scale-95 shadow-xl ${
              isGenerating 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-ejn-teal text-white hover:bg-[#004d45] shadow-ejn-teal/20'
            }`}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Sincronizando Impacto...
              </>
            ) : (
              <>
                <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Exportar ESG Oficial
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
            <h3 className="text-2xl font-bold text-ejn-teal mb-2">Impacto Consolidado!</h3>
            <p className="text-apple-text-secondary font-extralight mb-8">O relatório 3.0 foi processado com sucesso e enviado para o seu dispositivo.</p>
            <button 
              onClick={() => setShowPreview(false)}
              className="w-full bg-apple-gray text-ejn-teal py-4 rounded-apple-lg font-bold hover:bg-gray-100 transition-colors"
            >
              Concluído
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