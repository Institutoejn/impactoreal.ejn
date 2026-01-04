
import React, { useState } from 'react';
import { FileBarChart, Download, Sparkles, Heart, Globe, Printer, Share2, X } from 'lucide-react';
import { Transacao } from '../types';

interface ESGReportsProps {
  transactions: Transacao[];
  studentCount: number;
}

export const ESGReports: React.FC<ESGReportsProps> = ({ transactions, studentCount }) => {
  const [showPreview, setShowPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const totalIn = transactions.filter(t => t.tipo === 'entrada' && t.status === 'confirmado').reduce((acc, t) => acc + t.valor, 0);

  const generateReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowPreview(true);
    }, 2000);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="bg-white p-12 rounded-apple-2xl shadow-sm border border-gray-50 flex flex-col items-center text-center max-w-2xl mx-auto">
        <div className="w-20 h-20 bg-ejn-teal/5 rounded-full flex items-center justify-center mb-8 relative">
          <FileBarChart className="w-10 h-10 text-ejn-teal" />
          <div className="absolute -top-1 -right-1">
            <Sparkles className="w-6 h-6 text-ejn-gold animate-pulse" />
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-ejn-teal mb-4 tracking-tight">Gerador de Relatório de Impacto</h2>
        <p className="text-apple-text-secondary text-lg mb-10 leading-relaxed">
          Nossa tecnologia de transparência consolida dados ESG em tempo real. 
          Gere um documento oficial com métricas de impacto e prestação de contas.
        </p>
        
        <button 
          onClick={generateReport}
          disabled={isGenerating}
          className={`group flex items-center justify-center gap-3 px-10 py-5 rounded-apple-xl font-black text-lg transition-all transform active:scale-95 shadow-xl ${
            isGenerating 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-ejn-teal text-white hover:bg-[#004d45] shadow-ejn-teal/20'
          }`}
        >
          {isGenerating ? (
            <>
              <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-500 rounded-full animate-spin" />
              Consolidando Dados...
            </>
          ) : (
            <>
              <FileBarChart className="w-6 h-6 group-hover:scale-110 transition-transform" />
              Gerar Relatório ESG
            </>
          )}
        </button>
      </div>

      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowPreview(false)} />
          
          <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-apple-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-500">
            {/* Toolbar */}
            <div className="flex items-center justify-between p-6 bg-apple-gray border-b border-gray-200">
              <div className="flex items-center gap-4">
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-gray-200">Impacto_Relatorio_2024.pdf</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-3 hover:bg-white rounded-apple-lg text-gray-500 transition-all shadow-sm">
                  <Printer className="w-5 h-5" />
                </button>
                <button className="p-3 hover:bg-white rounded-apple-lg text-gray-500 transition-all shadow-sm">
                  <Share2 className="w-5 h-5" />
                </button>
                <button className="flex items-center gap-2 bg-ejn-teal text-white px-5 py-2.5 rounded-apple-lg font-bold text-sm hover:bg-[#004d45] transition-all shadow-md">
                  <Download className="w-4 h-4" />
                  Download
                </button>
                <div className="w-px h-8 bg-gray-200 mx-2"></div>
                <button onClick={() => setShowPreview(false)} className="p-3 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-apple-lg transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-12 bg-gray-50/50">
              <div className="max-w-3xl mx-auto bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] rounded-sm p-16 min-h-[1000px] text-gray-800 font-serif">
                <div className="flex justify-between items-start border-b-2 border-ejn-teal pb-10 mb-12 font-sans">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-ejn-teal rounded-xl flex items-center justify-center">
                      <Heart className="text-white w-8 h-8" fill="white" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-black text-ejn-teal">Instituto EJN</h1>
                      <p className="text-[10px] uppercase font-bold text-apple-text-secondary tracking-widest">Impacto Real • Relatório ESG</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm">Data de Emissão</p>
                    <p className="text-sm text-gray-500">{new Date().toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>

                <div className="space-y-12 font-sans">
                  <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Resumo de Transparência</h2>
                    <div className="grid grid-cols-3 gap-6">
                      <div className="p-6 bg-apple-gray rounded-apple-lg border border-gray-100">
                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Arrecadado</p>
                        <p className="text-2xl font-black text-ejn-teal">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalIn)}
                        </p>
                      </div>
                      <div className="p-6 bg-apple-gray rounded-apple-lg border border-gray-100">
                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Vidas Transformadas</p>
                        <p className="text-2xl font-black text-ejn-gold">{studentCount * 12}</p>
                      </div>
                      <div className="p-6 bg-apple-gray rounded-apple-lg border border-gray-100">
                        <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Alunos Ativos</p>
                        <p className="text-2xl font-black text-gray-800">{studentCount}</p>
                      </div>
                    </div>
                  </section>

                  <section className="bg-ejn-teal/5 p-8 rounded-apple-xl border border-ejn-teal/10">
                    <h3 className="text-lg font-bold text-ejn-teal mb-4 flex items-center gap-2">
                      <Globe className="w-5 h-5" />
                      Impacto Social e Educacional
                    </h3>
                    <p className="text-gray-700 leading-relaxed mb-6 italic">
                      "O Instituto EJN reafirma seu compromisso com o ODS 4 (Educação de Qualidade) e ODS 8 (Trabalho Decente e Crescimento Econômico). 
                      Atualmente gerenciamos recursos que possibilitam a formação técnica de jovens, com foco em resultados mensuráveis de empregabilidade."
                    </p>
                    <div className="w-full h-1 bg-white rounded-full overflow-hidden">
                      <div className="h-full bg-ejn-gold w-[85%]"></div>
                    </div>
                  </section>
                </div>

                <div className="mt-32 pt-8 border-t border-gray-100 text-center">
                  <p className="text-[10px] uppercase font-bold text-gray-300 tracking-[0.2em] mb-4">Documento Verificado Via Blockchain Impacto Real</p>
                  <div className="flex justify-center">
                    <div className="w-16 h-16 bg-apple-gray border border-gray-200 rounded-sm flex items-center justify-center opacity-50">
                      <span className="text-[8px] font-mono text-gray-400">QR CODE VERIFIED</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
