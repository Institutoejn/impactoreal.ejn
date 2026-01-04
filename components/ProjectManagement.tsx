
import React, { useState } from 'react';
import { Rocket, Plus, X, Edit2, Trash2, Target } from 'lucide-react';
import { Project } from '../types';

interface ProjectManagementProps {
  projects: Project[];
  onAddProject: (project: Omit<Project, 'id'>) => void;
  onDeleteProject: (id: string) => void;
}

export const ProjectManagement: React.FC<ProjectManagementProps> = ({ projects, onAddProject, onDeleteProject }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    goal: '',
    status: 'active' as 'active' | 'finished'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddProject({
      title: formData.title,
      description: formData.description,
      goal: parseFloat(formData.goal),
      status: formData.status,
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800' // Default placeholder
    });
    setFormData({ title: '', description: '', goal: '', status: 'active' });
    setIsModalOpen(false);
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-2xl font-bold text-ejn-teal">Portfólio de Projetos</h2>
          <p className="text-apple-text-secondary">Crie e acompanhe metas de impacto social.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-ejn-gold text-white px-6 py-3 rounded-apple-lg font-bold hover:bg-[#D19900] transition-all transform active:scale-95 shadow-lg shadow-ejn-gold/20"
        >
          <Plus className="w-5 h-5" />
          Novo Projeto
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <div key={project.id} className="bg-white p-8 rounded-apple-2xl shadow-sm border border-gray-50 flex flex-col group relative">
            <div className="flex justify-between items-start mb-6">
              <div className="w-12 h-12 bg-ejn-teal/5 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-ejn-teal" />
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 text-gray-300 hover:text-ejn-teal transition-colors"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => onDeleteProject(project.id)} className="p-2 text-gray-300 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>

            <h3 className="text-xl font-bold text-ejn-teal mb-2">{project.title}</h3>
            <p className="text-sm text-apple-text-secondary mb-6 line-clamp-2">{project.description}</p>
            
            <div className="mt-auto pt-6 border-t border-gray-50">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Meta Financeira</span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter ${project.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                  {project.status === 'active' ? 'Ativo' : 'Finalizado'}
                </span>
              </div>
              <p className="text-2xl font-black text-ejn-teal">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(project.goal)}
              </p>
            </div>
          </div>
        ))}

        {projects.length === 0 && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-gray-200 rounded-apple-2xl">
            <Rocket className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="text-apple-text-secondary font-medium">Nenhum projeto cadastrado. Comece criando um novo.</p>
          </div>
        )}
      </div>

      {/* Modal Novo Projeto */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white w-full max-w-lg rounded-apple-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
            <div className="flex items-center justify-between p-8 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-ejn-teal">Novo Projeto Social</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-apple-gray rounded-full transition-colors"><X className="w-6 h-6 text-gray-400" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-2 px-1">Nome do Projeto</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-5 py-3 bg-apple-gray rounded-apple-lg border-transparent focus:bg-white focus:border-ejn-teal focus:ring-0 outline-none transition-all shadow-sm border" placeholder="Ex: Capacitação Fullstack 2026" />
              </div>
              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-2 px-1">Descrição Curta</label>
                <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-5 py-3 bg-apple-gray rounded-apple-lg border-transparent focus:bg-white focus:border-ejn-teal focus:ring-0 outline-none transition-all shadow-sm border h-24 resize-none" placeholder="O que este projeto pretende alcançar?" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-2 px-1">Meta (R$)</label>
                  <input required type="number" step="0.01" value={formData.goal} onChange={e => setFormData({...formData, goal: e.target.value})} className="w-full px-5 py-3 bg-apple-gray rounded-apple-lg border-transparent focus:bg-white focus:border-ejn-teal focus:ring-0 outline-none transition-all shadow-sm border" placeholder="0,00" />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-2 px-1">Status Inicial</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})} className="w-full px-5 py-3 bg-apple-gray rounded-apple-lg border-transparent focus:bg-white focus:border-ejn-teal focus:ring-0 outline-none transition-all shadow-sm border appearance-none">
                    <option value="active">Ativo</option>
                    <option value="finished">Finalizado</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full bg-ejn-teal text-white py-4 rounded-apple-xl font-black text-lg shadow-xl shadow-ejn-teal/20 hover:bg-[#004d45] transition-all transform active:scale-[0.98]">
                Lançar Projeto
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
