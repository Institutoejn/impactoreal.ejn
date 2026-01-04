
import React, { useState, useEffect, useRef } from 'react';
import { Target, ArrowRight, X, QrCode, Copy, CheckCircle2, Info } from 'lucide-react';
import { Projeto, Transacao } from '../types';
import QRious from 'qrious';

// --- DEFINIÇÕES DE TIPOS ---

interface ProjectsProps {
  projects: Projeto[];
  transactions: Transacao[];
  onDonate: (projectId: string, amount: number) => void;
}

// --- UTILITÁRIOS PIX (Engenharia de Pagamentos) ---

const crc16 = (str: string): string => {
  let crc = 0xFFFF;
  const polynomial = 0x1021;
  for (let i = 0; i < str.length; i++) {
    let b = str.charCodeAt(i);
    for (let j = 0; j < 8; j++) {
      let bit = ((b >> (7 - j) & 1) === 1);
      let c15 = ((crc >> 15 & 1) === 1);
      crc <<= 1;
      // Corrigido: usando '!==' para XOR lógico entre booleanos em TypeScript
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
  const PIX_KEY = "51708193000170"; // CNPJ limpo
  const MERCHANT_NAME = "INSTITUTO ESCOLA JOVENS"; // Max 25 chars
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
  const [pixCode, setPixCode] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getProgressForProject = (project: Projeto) => {
    const reached = transactions
      .filter(t => 
        t.tipo === 'in' && 
        t.status !== 'pending' &&
        (t.projeto_id === project.id || t.descricao.toLowerCase().includes(project.nome.toLowerCase()))
      )
      .reduce((acc, t) => acc + t.valor, 0);
    
    return Math.min(Math.round((reached / project.meta_financeira) * 100), 100);
  };

  const getAmountReached = (project: Projeto) => {
    return transactions
      .filter(t => 
        // Corrigido: usando 'tipo' em vez de 'type' conforme definido em types.ts
        t.tipo === 'in' && 
        t.status !== 'pending' &&
        (t.projeto_id === project.id || t.descricao.toLowerCase().includes(project.nome.toLowerCase()))
      )
      .reduce((acc, t) => acc + t.valor, 0);
  };

  // Atualiza o Payload Pix sempre que o valor ou projeto muda
  useEffect(() => {
    if (selectedProject) {
      const amount = parseFloat(donationAmount) || null;
      const code = generatePixPayload(amount);
      setPixCode(code);
      setIsCopied(false);
    }
  }, [selectedProject, donationAmount]);

  // Renderiza o QR Code no Canvas via QRious
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

  const handleDonateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProject) {
      onDonate(selectedProject.id, parseFloat(donationAmount) || 0);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setSelectedProject(null);
        setDonationAmount('');
      }, 3000);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {projects.map((project) => {
            const progress = getProgressForProject(project);
            const reachedAmount = getAmountReached(project);
            
            return (
              <div key={project.id} className="bg-white rounded-apple-2xl shadow-sm border border-gray-50 overflow-hidden flex flex-col group hover:shadow-xl transition-all duration-500">
                <div className="relative h-48 md:h-56 overflow-hidden">
                  <img 
                    src={project.capa_url || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800'} 
                    alt={project.nome} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                  />
                  <div className="absolute top-4 left-4">
                    <div className="bg-white/90 backdrop-blur-sm p-3 rounded-xl shadow-lg">
                      <Target className="w-5 h-5 text-ejn-teal" />
                    </div>
                  </div>
                </div>

                <div className="p-6 md:p-8 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-3 gap-2">
                    <h3 className="text-lg md:text-xl font-bold text-ejn-teal line-clamp-2 leading-tight">{project.nome}</h3>
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter shrink-0 ${project.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                      {project.status === 'active' ? 'Ativo' : 'Concluído'}
                    </span>
                  </div>
                  <p className="text-apple-text-secondary text-sm mb-6 md:mb-8 leading-relaxed line-clamp-3">
                    {project.descricao}
                  </p>

                  <div className="mt-auto space-y-4">
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status da Meta</p>
                        <p className="font-bold text-ejn-teal text-base md:text-lg">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(reachedAmount)}
                        </p>
                      </div>
                      <span className="text-xl font-black text-ejn-gold">{progress}%</span>
                    </div>
                    
                    <div className="w-full h-2 bg-apple-gray rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-ejn-gold rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    <button 
                      onClick={() => setSelectedProject(project)}
                      className="w-full mt-4 bg-ejn-teal text-white py-4 rounded-apple-xl font-bold hover:bg-[#004d45] transition-all transform active:scale-[0.98] shadow-lg shadow-ejn-teal/10 flex items-center justify-center gap-2"
                    >
                      Apoiar este Projeto
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center p-6">
          <Target className="w-16 h-16 text-gray-200 mb-4" />
          <h3 className="text-xl font-bold text-gray-400">Nenhum projeto ativo no momento.</h3>
          <p className="text-apple-text-secondary">O Instituto está planejando novas trilhas de impacto.</p>
        </div>
      )}

      {/* Donation Modal - PIX Engine Active */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-white/40 backdrop-blur-xl fixed" onClick={() => !showSuccess && setSelectedProject(null)} />
          
          <div className="relative bg-white w-full max-w-md rounded-apple-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 my-auto">
            {showSuccess ? (
              <div className="p-10 md:p-12 text-center flex flex-col items-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-10 h-10 md:w-12 md:h-12 text-green-500" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-ejn-teal mb-2">Impacto Registrado!</h3>
                <p className="text-sm md:text-base text-apple-text-secondary">Seu investimento foi enviado para validação do Instituto. Em breve ele aparecerá no seu histórico.</p>
              </div>
            ) : (
              <>
                <div className="p-6 md:p-8 border-b border-gray-100 flex items-center justify-between">
                  <div className="min-w-0">
                    <h3 className="text-[10px] md:text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Investimento Social via Pix</h3>
                    <h2 className="text-lg md:text-xl font-bold text-ejn-teal truncate">{selectedProject.nome}</h2>
                  </div>
                  <button onClick={() => setSelectedProject(null)} className="p-2 hover:bg-apple-gray rounded-full transition-colors shrink-0">
                    <X className="w-6 h-6 text-gray-300" />
                  </button>
                </div>

                <div className="p-6 md:p-8 space-y-6 md:space-y-8 max-h-[75vh] overflow-y-auto">
                  
                  {/* Pix Amount Input */}
                  <div>
                    <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-2 px-1">Quanto você deseja investir?</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-ejn-teal text-sm">R$</span>
                      <input 
                        type="number" 
                        step="0.01"
                        value={donationAmount}
                        onChange={(e) => setDonationAmount(e.target.value)}
                        className="w-full pl-10 pr-4 py-4 bg-apple-gray rounded-apple-lg border-transparent focus:bg-white focus:border-ejn-teal outline-none transition-all border text-lg font-bold text-ejn-teal"
                        placeholder="0,00"
                      />
                    </div>
                    {!donationAmount && (
                      <div className="flex items-center gap-1 mt-2 text-[10px] text-ejn-gold font-bold uppercase tracking-wide px-1">
                        <Info className="w-3 h-3" />
                        Dica: Digite o valor para facilitar o pagamento
                      </div>
                    )}
                  </div>

                  {/* QR Code Canvas */}
                  <div className="flex flex-col items-center text-center">
                    <div className="p-4 bg-white rounded-apple-xl mb-4 border-2 border-ejn-teal/5 shadow-sm">
                      <canvas ref={canvasRef} className="max-w-full" />
                    </div>
                    <p className="text-[10px] md:text-xs text-apple-text-secondary font-medium px-4">
                      Escaneie o QR Code acima com o aplicativo do seu banco para transferir diretamente para o Instituto EJN.
                    </p>
                  </div>

                  {/* Pix Copy Action */}
                  <div className="space-y-3">
                    <button 
                      onClick={handleCopyPix}
                      className={`w-full flex items-center justify-center gap-2 py-4 rounded-apple-xl font-bold text-sm transition-all border-2 ${
                        isCopied 
                          ? 'bg-green-50 border-green-500 text-green-700' 
                          : 'bg-ejn-gold/5 border-ejn-gold/10 text-ejn-gold hover:bg-ejn-gold/10'
                      }`}
                    >
                      {isCopied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                      {isCopied ? 'Código Copiado!' : 'Copiar Chave Pix'}
                    </button>

                    <button 
                      onClick={handleDonateSubmit} 
                      className="w-full bg-ejn-teal text-white py-5 rounded-apple-xl font-black text-lg shadow-xl shadow-ejn-teal/20 hover:bg-[#004d45] transition-all transform active:scale-[0.98]"
                    >
                      Já realizei a transferência
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
