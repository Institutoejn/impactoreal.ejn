
import React, { useState, useEffect, useRef } from 'react';
import { Target, ArrowRight, X, QrCode, Copy, CheckCircle2, Info, Loader2 } from 'lucide-react';
import { Projeto, Transacao } from '../types';
import QRious from 'qrious';

// --- DEFINIÇÕES DE TIPOS ---

interface ProjectsProps {
  projects: Projeto[];
  transactions: Transacao[];
  onDonate: (projectId: string, amount: number) => Promise<boolean>;
}

// --- UTILITÁRIOS PIX ---

const crc16 = (str: string): string => {
  let crc = 0xFFFF;
  const polynomial = 0x1021;
  for (let i = 0; i < str.length; i++) {
    let b = str.charCodeAt(i);
    for (let j = 0; j < 8; j++) {
      let bit = ((b >> (7 - j) & 1) === 1);
      let c15 = ((crc >> 15 & 1) === 1);
      crc <<= 1;
      if (c15 !== bit) crc ^= polynomial;
    }
  }
  crc &= 0xFFFF;
  return crc.toString(16).toUpperCase().padStart(4, '0');
};

const genField = (id: string, value: string): string => {
  const len = value.length.toString().padStart(2, '0');
  return `${id}${len}${value}`;
};

const generatePixPayload = (amount: number | null): string => {
  const PIX_KEY = "51708193000170";
  const MERCHANT_NAME = "INSTITUTO ESCOLA JOVENS";
  const MERCHANT_CITY = "SAO PAULO";

  const accountInfo = [
    genField('00', 'br.gov.bcb.pix'),
    genField('01', PIX_KEY)
  ].join('');

  const payload = [
    genField('00', '01'),
    genField('26', accountInfo),
    genField('52', '0000'),
    genField('53', '986'),
    amount && amount > 0 ? genField('54', amount.toFixed(2)) : '',
    genField('58', 'BR'),
    genField('59', MERCHANT_NAME),
    genField('60', MERCHANT_CITY),
    genField('62', genField('05', '***')),
    '6304'
  ].join('');

  return payload + crc16(payload);
};

// --- COMPONENTE PRINCIPAL ---

export const Projects: React.FC<ProjectsProps> = ({ projects, transactions, onDonate }) => {
  const [selectedProject, setSelectedProject] = useState<Projeto | null>(null);
  const [donationAmount, setDonationAmount] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pixCode, setPixCode] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getProgressForProject = (project: Projeto) => {
    const reached = transactions
      .filter(t => 
        t.tipo === 'entrada' && 
        t.status === 'confirmado' &&
        (t.projeto_id === project.id || t.descricao.toLowerCase().includes(project.nome.toLowerCase()))
      )
      .reduce((acc, t) => acc + t.valor, 0);
    
    return Math.min(Math.round((reached / project.meta_financeira) * 100), 100);
  };

  const getAmountReached = (project: Projeto) => {
    return transactions
      .filter(t => 
        t.tipo === 'entrada' && 
        t.status === 'confirmado' &&
        (t.projeto_id === project.id || t.descricao.toLowerCase().includes(project.nome.toLowerCase()))
      )
      .reduce((acc, t) => acc + t.valor, 0);
  };

  useEffect(() => {
    if (selectedProject) {
      const amount = parseFloat(donationAmount) || null;
      const code = generatePixPayload(amount);
      setPixCode(code);
      setIsCopied(false);
    }
  }, [selectedProject, donationAmount]);

  useEffect(() => {
    if (selectedProject && canvasRef.current && pixCode) {
      new QRious({
        element: canvasRef.current,
        value: pixCode,
        size: 240,
        level: 'M'
      });
    }
  }, [pixCode, selectedProject]);

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDonateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProject) {
      setIsSubmitting(true);
      const success = await onDonate(selectedProject.id, parseFloat(donationAmount) || 0);
      
      if (success) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          setSelectedProject(null);
          setDonationAmount('');
        }, 3000);
      }
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {projects.map((project) => {
            const progress = getProgressForProject(project);
            const reachedAmount = getAmountReached(project);
            
            return (
              <div key={project.id} className="bg-white rounded-apple-2xl shadow-sm border border-gray-50 overflow-hidden flex flex-col group hover:shadow-2xl transition-all duration-500">
                <div className="relative h-56 md:h-64 overflow-hidden">
                  <img 
                    src={project.capa_url || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800'} 
                    alt={project.nome} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                  <div className="absolute top-6 left-6">
                    <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl">
                      <Target className="w-6 h-6 text-ejn-teal" />
                    </div>
                  </div>
                </div>

                <div className="p-10 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-4 gap-3">
                    <h3 className="text-xl md:text-2xl font-bold text-ejn-teal line-clamp-2 leading-tight tracking-tighter">{project.nome}</h3>
                    <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shrink-0 ${project.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                      {project.status === 'active' ? 'Ativo' : 'Finalizado'}
                    </span>
                  </div>
                  <p className="text-apple-text-secondary text-base mb-10 leading-relaxed line-clamp-3 font-extralight">
                    {project.descricao}
                  </p>

                  <div className="mt-auto space-y-6">
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Impacto alcançado</p>
                        <p className="font-bold text-ejn-teal text-xl">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(reachedAmount)}
                        </p>
                      </div>
                      <span className="text-2xl font-black text-ejn-gold">{progress}%</span>
                    </div>
                    
                    <div className="w-full h-2.5 bg-apple-gray rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-ejn-gold rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    <button 
                      onClick={() => setSelectedProject(project)}
                      className="w-full mt-6 bg-ejn-teal text-white py-5 rounded-apple-xl font-bold text-lg hover:bg-[#004d45] transition-all transform active:scale-[0.98] shadow-2xl shadow-ejn-teal/10 flex items-center justify-center gap-3"
                    >
                      Mudar uma vida
                      <ArrowRight className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 text-center p-8">
          <Target className="w-20 h-20 text-gray-100 mb-6" />
          <h3 className="text-2xl font-bold text-gray-300 tracking-tight">Novos amanhãs em breve.</h3>
          <p className="text-apple-text-secondary text-lg font-extralight">O Instituto EJN está desenhando as próximas trilhas de liderança.</p>
        </div>
      )}

      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-white/40 backdrop-blur-xl fixed" onClick={() => !showSuccess && !isSubmitting && setSelectedProject(null)} />
          
          <div className="relative bg-white w-full max-w-md rounded-apple-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 my-auto">
            {showSuccess ? (
              <div className="p-12 text-center flex flex-col items-center bg-white">
                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-8">
                  <CheckCircle2 className="w-14 h-14 text-green-500" />
                </div>
                <h3 className="text-3xl font-bold text-ejn-teal mb-3 tracking-tighter">Destino real.</h3>
                <p className="text-lg text-apple-text-secondary font-extralight">Seu investimento social foi enviado para validação. Em instantes ele fará parte do seu legado.</p>
              </div>
            ) : (
              <>
                <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-white">
                  <div className="min-w-0">
                    <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Impacto via Pix</h3>
                    <h2 className="text-xl font-bold text-ejn-teal truncate tracking-tight">{selectedProject.nome}</h2>
                  </div>
                  <button onClick={() => !isSubmitting && setSelectedProject(null)} className="p-3 hover:bg-apple-gray rounded-full transition-colors shrink-0">
                    <X className="w-6 h-6 text-gray-300" />
                  </button>
                </div>

                <div className="p-10 space-y-10 max-h-[75vh] overflow-y-auto bg-white">
                  
                  <div>
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-4 px-1">Valor do investimento</label>
                    <div className="relative">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 font-bold text-ejn-teal text-xl">R$</span>
                      <input 
                        type="number" 
                        step="0.01"
                        value={donationAmount}
                        onChange={(e) => setDonationAmount(e.target.value)}
                        disabled={isSubmitting}
                        className="w-full pl-16 pr-6 py-5 bg-apple-gray rounded-apple-xl outline-none focus:bg-white border-transparent focus:border-ejn-teal border transition-all text-2xl font-black text-ejn-teal disabled:opacity-50"
                        placeholder="0,00"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col items-center text-center">
                    <div className="p-6 bg-white rounded-apple-2xl mb-6 border-2 border-ejn-teal/5 shadow-xl">
                      <canvas ref={canvasRef} className="max-w-full" />
                    </div>
                    <p className="text-xs text-apple-text-secondary font-medium px-6 leading-relaxed">
                      Escaneie com o app do seu banco. 100% do valor é convertido em formação para líderes de Rio Preto.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <button 
                      onClick={handleCopyPix}
                      disabled={isSubmitting}
                      className={`w-full flex items-center justify-center gap-3 py-5 rounded-apple-xl font-bold text-base transition-all border-2 ${
                        isCopied 
                          ? 'bg-green-50 border-green-500 text-green-700' 
                          : 'bg-ejn-gold/5 border-ejn-gold/10 text-ejn-gold hover:bg-ejn-gold/10'
                      }`}
                    >
                      {isCopied ? <CheckCircle2 className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
                      {isCopied ? 'Copiado!' : 'Copiar código Pix'}
                    </button>

                    <button 
                      onClick={handleDonateSubmit}
                      disabled={isSubmitting}
                      className="w-full bg-ejn-teal text-white py-6 rounded-apple-xl font-bold text-xl shadow-2xl shadow-ejn-teal/20 hover:bg-[#004d45] transition-all transform active:scale-[0.98] flex items-center justify-center gap-4 disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-6 h-6 animate-spin" />
                          Processando...
                        </>
                      ) : (
                        'Confirmar envio'
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
