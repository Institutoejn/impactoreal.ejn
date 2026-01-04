
import React, { useState } from 'react';
import { Target, Users, Building2, ArrowRight, X, QrCode, Copy, CheckCircle2 } from 'lucide-react';
import { Project, Transaction } from '../types';

interface ProjectsProps {
  projects: Project[];
  transactions: Transaction[];
  onDonate: (projectId: string, amount: number) => void;
}

export const Projects: React.FC<ProjectsProps> = ({ projects, transactions, onDonate }) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [donationAmount, setDonationAmount] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const getProgressForProject = (project: Project) => {
    const reached = transactions
      .filter(t => 
        t.type === 'in' && 
        t.status !== 'pending' &&
        (t.projectId === project.id || t.description.toLowerCase().includes(project.title.toLowerCase()))
      )
      .reduce((acc, t) => acc + t.amount, 0);
    
    return Math.min(Math.round((reached / project.goal) * 100), 100);
  };

  const getAmountReached = (project: Project) => {
    return transactions
      .filter(t => 
        t.type === 'in' && 
        t.status !== 'pending' &&
        (t.projectId === project.id || t.description.toLowerCase().includes(project.title.toLowerCase()))
      )
      .reduce((acc, t) => acc + t.amount, 0);
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
                    src={project.image || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800'} 
                    alt={project.title} 
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
                    <h3 className="text-lg md:text-xl font-bold text-ejn-teal line-clamp-2 leading-tight">{project.title}</h3>
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter shrink-0 ${project.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                      {project.status === 'active' ? 'Ativo' : 'Concluído'}
                    </span>
                  </div>
                  <p className="text-apple-text-secondary text-sm mb-6 md:mb-8 leading-relaxed line-clamp-3">
                    {project.description}
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

      {/* Donation Modal - Responsive */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-300 overflow-y-auto">
          <div className="absolute inset-0 bg-white/40 backdrop-blur-xl fixed" onClick={() => !showSuccess && setSelectedProject(null)} />
          
          <div className="relative bg-white w-full max-w-md rounded-apple-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 my-auto">
            {showSuccess ? (
              <div className="p-10 md:p-12 text-center flex flex-col items-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-10 h-10 md:w-12 md:h-12 text-green-500" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-ejn-teal mb-2">Obrigado!</h3>
                <p className="text-sm md:text-base text-apple-text-secondary">Sua contribuição foi enviada e está sendo validada pelo nosso time financeiro.</p>
              </div>
            ) : (
              <>
                <div className="p-6 md:p-8 border-b border-gray-100 flex items-center justify-between">
                  <div className="min-w-0">
                    <h3 className="text-[10px] md:text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Apoiar Projeto</h3>
                    <h2 className="text-lg md:text-xl font-bold text-ejn-teal truncate">{selectedProject.title}</h2>
                  </div>
                  <button onClick={() => setSelectedProject(null)} className="p-2 hover:bg-apple-gray rounded-full transition-colors shrink-0">
                    <X className="w-6 h-6 text-gray-300" />
                  </button>
                </div>

                <div className="p-6 md:p-8 space-y-6 md:space-y-8 max-h-[70vh] overflow-y-auto">
                  <div className="flex flex-col items-center text-center">
                    <div className="p-4 bg-apple-gray rounded-apple-xl mb-4 border border-gray-100">
                      <QrCode className="w-32 h-32 md:w-40 md:h-40 text-gray-800" />
                    </div>
                    <p className="text-[11px] md:text-xs text-apple-text-secondary font-medium px-4">Escaneie o QR Code acima com seu app de banco para realizar a doação via Pix.</p>
                  </div>

                  <button className="w-full bg-ejn-gold/10 text-ejn-gold py-4 rounded-apple-xl font-bold flex items-center justify-center gap-2 hover:bg-ejn-gold/20 transition-all text-sm">
                    <Copy className="w-5 h-5" />
                    Copiar Chave Pix
                  </button>

                  <form onSubmit={handleDonateSubmit} className="space-y-6">
                    <div>
                      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-2 px-1">Valor da Doação (Opcional)</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400 text-sm">R$</span>
                        <input 
                          type="number" 
                          step="0.01"
                          value={donationAmount}
                          onChange={(e) => setDonationAmount(e.target.value)}
                          className="w-full pl-10 pr-4 py-4 bg-apple-gray rounded-apple-lg border-transparent focus:bg-white focus:border-ejn-teal outline-none transition-all border text-sm"
                          placeholder="0,00"
                        />
                      </div>
                    </div>

                    <button type="submit" className="w-full bg-ejn-teal text-white py-4 rounded-apple-xl font-black text-lg shadow-xl shadow-ejn-teal/20 hover:bg-[#004d45] transition-all transform active:scale-[0.98]">
                      Já transferi
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
