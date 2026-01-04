import React, { useState } from 'react';
import { Award, Download, Calendar, ArrowUpRight, Loader2 } from 'lucide-react';
import { Transacao, Perfil } from '../types';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface MyInvestmentsProps {
  transactions: Transacao[];
  totalInvested: number;
  profileData: Partial<Perfil>;
}

export const MyInvestments: React.FC<MyInvestmentsProps> = ({ transactions, totalInvested, profileData }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const myInvestments = transactions.filter(t => t.tipo === 'entrada');

  const gerarExtratoPessoal = async () => {
    if (myInvestments.length === 0) {
      alert('Você ainda não possui investimentos registrados para gerar extrato.');
      return;
    }

    setIsGenerating(true);
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const ejnTeal = [0, 95, 85];
      const ejnGold = [232, 171, 0];
      const ejnDark = [17, 24, 39];

      doc.setFillColor(245, 245, 247);
      doc.rect(0, 0, 210, 45, 'F');
      
      doc.setTextColor(ejnTeal[0], ejnTeal[1], ejnTeal[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.text('Instituto EJN', 20, 22);
      
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text('Extrato de Investimento Social: Causas que eu Impulsiono', 20, 30);

      doc.setDrawColor(ejnGold[0], ejnGold[1], ejnGold[2]);
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(140, 15, 50, 20, 3, 3, 'FD');
      doc.setTextColor(ejnGold[0], ejnGold[1], ejnGold[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('IMPULSIONADOR', 165, 24, { align: 'center' });
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.text('Legado Validado via App', 165, 28, { align: 'center' });

      doc.setTextColor(ejnDark[0], ejnDark[1], ejnDark[2]);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Perfil do Impulsionador', 20, 60);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Nome:', 20, 68);
      doc.setFont('helvetica', 'bold');
      doc.text(profileData.nome || 'Parceiro do Instituto', 45, 68);

      doc.setFont('helvetica', 'normal');
      doc.text('E-mail:', 20, 74);
      doc.setFont('helvetica', 'bold');
      doc.text(profileData.email || 'Não informado', 45, 74);

      doc.setFont('helvetica', 'normal');
      doc.text('Impacto Acumulado:', 20, 80);
      doc.setFont('helvetica', 'bold');
      doc.text(new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalInvested), 55, 80);

      doc.setFontSize(12);
      doc.text('Linha do Tempo de Transformação', 20, 95);

      const tableData = myInvestments.map(inv => [
        new Date(inv.created_at).toLocaleDateString('pt-BR'),
        inv.descricao,
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(inv.valor),
        inv.status?.toUpperCase() || 'CONFIRMADO'
      ]);

      autoTable(doc, {
        startY: 100,
        head: [['Data', 'Destinação Estratégica', 'Valor', 'Status']],
        body: tableData,
        theme: 'striped',
        headStyles: { 
          fillColor: ejnTeal,
          fontSize: 10,
          fontStyle: 'bold'
        },
        bodyStyles: { 
          fontSize: 9,
          textColor: [100, 100, 100],
          fontStyle: 'normal'
        },
        columnStyles: {
          2: { halign: 'right' },
          3: { halign: 'center' }
        },
        margin: { left: 20, right: 20 }
      });

      doc.setTextColor(150, 150, 150);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'italic');
      doc.text('Obrigado por investir no futuro de nossos jovens talentos.', 105, (doc as any).lastAutoTable.finalY + 20, { align: 'center' });
      doc.text('Este documento comprova o capital social injetado na educação brasileira através do Instituto EJN.', 105, (doc as any).lastAutoTable.finalY + 25, { align: 'center' });

      doc.save(`Extrato_Impacto_EJN_${profileData.nome?.replace(/\s+/g, '_') || 'Impulsionador'}.pdf`);
    } catch (error) {
      console.error('Erro técnico:', error);
      alert('Não foi possível gerar seu extrato de impacto no momento.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white p-10 rounded-apple-2xl shadow-sm border border-gray-50 mb-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-8">
          <div className="w-20 h-20 bg-ejn-gold/10 rounded-full flex items-center justify-center border-4 border-ejn-gold/20">
            <Award className="w-10 h-10 text-ejn-gold" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status de Parceria</p>
            <h2 className="text-3xl font-black text-ejn-teal mb-1">Causas que eu Impulsiono</h2>
            <p className="text-apple-text-secondary font-medium font-extralight">Seu legado acumulado é de <span className="text-ejn-teal font-bold">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalInvested)}</span></p>
          </div>
        </div>
        <button 
          onClick={gerarExtratoPessoal}
          disabled={isGenerating}
          className={`bg-ejn-teal text-white px-8 py-4 rounded-apple-xl font-bold flex items-center gap-3 shadow-lg shadow-ejn-teal/10 transition-all ${isGenerating ? 'opacity-70 cursor-wait' : 'hover:bg-[#004d45]'}`}
        >
          {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
          {isGenerating ? 'Processando Legado...' : 'Baixar Extrato de Impacto (PDF)'}
        </button>
      </div>

      <div className="bg-white rounded-apple-2xl shadow-sm border border-gray-50 overflow-hidden">
        <div className="p-8 border-b border-gray-50">
          <h3 className="text-xl font-bold text-ejn-teal">Linha do Tempo de Transformação</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-apple-gray">
              <tr>
                <th className="px-8 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Data / Status</th>
                <th className="px-8 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Destinação Estratégica</th>
                <th className="px-8 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-right">Valor</th>
                <th className="px-8 py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-right">Track</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {myInvestments.length > 0 ? myInvestments.map((inv) => (
                <tr key={inv.id} className="hover:bg-apple-gray/20 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-sm text-gray-500 font-extralight">
                        <Calendar className="w-4 h-4 text-gray-300" />
                        {new Date(inv.created_at).toLocaleDateString('pt-BR')}
                      </div>
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full w-fit ${inv.status === 'pendente' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                        {inv.status === 'pendente' ? 'Em Validação' : 'Confirmado'}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <p className="font-bold text-gray-800">{inv.descricao}</p>
                    <p className="text-[10px] text-ejn-teal font-bold uppercase tracking-wider">{inv.categoria}</p>
                  </td>
                  <td className="px-8 py-5 text-right font-bold text-lg text-ejn-teal">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(inv.valor)}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="text-gray-300 group-hover:text-ejn-gold"><ArrowUpRight className="w-5 h-5" /></button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="px-8 py-20 text-center text-apple-text-secondary font-extralight italic">
                    Nenhum investimento registrado na sua linha do tempo ainda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};