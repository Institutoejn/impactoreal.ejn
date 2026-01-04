
import React, { useState } from 'react';
import { Rocket, Plus, X, Edit2, Trash2, Target } from 'lucide-react';
import { Projeto } from '../types';

interface ProjectManagementProps {
  projects: Projeto[];
  onAddProject: (project: Omit<Projeto, 'id'>) => void;
  onDeleteProject: (id: string) => void;
}

export const ProjectManagement: React.FC<ProjectManagementProps> = ({ projects, onAddProject, onDeleteProject }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    meta_financeira: '',
    status: 'active' as 'active' | 'finished'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddProject({
      nome: formData.nome,
      descricao: formData.descricao,
      meta_financeira: parseFloat(formData.meta_financeira) || 0,
      status: formData.status,
      capa_url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800'
    });
    setFormData({ nome: '', descricao: '', meta_financeira: '', status: 'active' });
    setIsModalOpen(false);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-2xl font-bold text-ejn-teal">Projetos de Impacto</h2>
          <p className="text-apple-text-secondary">Metas financeiras para mobilizar o Instituto.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-ejn-gold text-white px-6 py-3 rounded-apple-lg font-bold shadow-lg">
          <Plus className="w-5 h-5" />
          Novo Projeto
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((p) => (
          <div key={p.id} className="bg-white p-8 rounded-apple-2xl shadow-sm border border-gray-50 flex flex-col group relative">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-ejn-teal/5 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-ejn-teal" />
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => onDeleteProject(p.id)} className="p-2 text-gray-300 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            <h3 className="text-xl font-bold text-ejn-teal mb-2">{p.nome}</h3>
            <p className="text-sm text-apple-text-secondary mb-6 line-clamp-2">{p.descricao}</p>
            <div className="mt-auto pt-6 border-t border-gray-50">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Meta Financeira</p>
              <p className="text-2xl font-black text-ejn-teal">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p.meta_financeira)}</p>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/20 backdrop-blur-md">
          <div className="bg-white w-full max-w-lg rounded-apple-2xl shadow-2xl overflow-hidden">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-ejn-teal">Novo Projeto Social</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-apple-gray rounded-full"><X className="w-6 h-6 text-gray-400" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <input required type="text" value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} className="w-full px-5 py-3 bg-apple-gray rounded-apple-lg outline-none border focus:border-ejn-teal" placeholder="Nome do Projeto" />
              <textarea value={formData.descricao} onChange={e => setFormData({...formData, descricao: e.target.value})} className="w-full px-5 py-3 bg-apple-gray rounded-apple-lg outline-none border focus:border-ejn-teal h-24 resize-none" placeholder="Descrição Curta" />
              <div className="grid grid-cols-2 gap-4">
                <input required type="number" step="0.01" value={formData.meta_financeira} onChange={e => setFormData({...formData, meta_financeira: e.target.value})} className="w-full px-5 py-3 bg-apple-gray rounded-apple-lg outline-none border focus:border-ejn-teal" placeholder="Meta R$" />
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})} className="w-full px-5 py-3 bg-apple-gray rounded-apple-lg border">
                  <option value="active">Ativo</option>
                  <option value="finished">Finalizado</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-ejn-teal text-white py-4 rounded-apple-xl font-black shadow-lg">Lançar Projeto</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
