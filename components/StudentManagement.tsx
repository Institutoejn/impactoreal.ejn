
import React, { useState, useRef } from 'react';
import { X, Search, MoreHorizontal, GraduationCap, MapPin, UserPlus, Edit2, Trash2, History, Camera, User } from 'lucide-react';
import { Aluno } from '../types';

interface StudentManagementProps {
  students: Aluno[];
  onAddStudent: (student: Omit<Aluno, 'id' | 'status'>) => void;
  onUpdateStudent: (student: Aluno) => void;
  onDeleteStudent: (id: string) => void;
}

export const StudentManagement: React.FC<StudentManagementProps> = ({ students, onAddStudent, onUpdateStudent, onDeleteStudent }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [editingStudent, setEditingStudent] = useState<Aluno | null>(null);
  const [historyStudent, setHistoryStudent] = useState<Aluno | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    nome: '',
    idade: '',
    bairro: '',
    curso: '',
    observacoes: '',
    foto_url: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      nome: formData.nome,
      idade: parseInt(formData.idade) || 0,
      bairro: formData.bairro,
      curso: formData.curso,
      observacoes: formData.observacoes,
      foto_url: formData.foto_url
    };

    if (editingStudent) {
      onUpdateStudent({ ...editingStudent, ...payload });
    } else {
      onAddStudent(payload);
    }
    setIsModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({ nome: '', idade: '', bairro: '', curso: '', observacoes: '', foto_url: '' });
    setEditingStudent(null);
  };

  const handleEdit = (s: Aluno) => {
    setEditingStudent(s);
    setFormData({
      nome: s.nome,
      idade: s.idade.toString(),
      bairro: s.bairro,
      curso: s.curso,
      observacoes: s.observacoes,
      foto_url: s.foto_url || ''
    });
    setIsModalOpen(true);
    setActiveMenuId(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, foto_url: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const filtered = students.filter(s => s.nome.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar aluno..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white rounded-apple-lg outline-none shadow-sm text-sm"
          />
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="flex items-center justify-center gap-2 bg-ejn-teal text-white px-6 py-4 rounded-apple-lg font-bold shadow-md"
        >
          <UserPlus className="w-5 h-5" />
          Novo Aluno
        </button>
      </div>

      <div className="bg-white rounded-apple-2xl shadow-sm border border-gray-50 overflow-hidden min-h-[400px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-apple-gray">
              <tr>
                <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Aluno</th>
                <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Curso</th>
                <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Bairro</th>
                <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-apple-gray/30 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-ejn-teal/5 rounded-full overflow-hidden border border-gray-100 flex items-center justify-center text-ejn-teal font-bold">
                        {s.foto_url ? <img src={s.foto_url} className="w-full h-full object-cover" /> : s.nome.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-ejn-teal">{s.nome}</p>
                        <p className="text-xs text-apple-text-secondary">{s.idade} anos</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <GraduationCap className="w-4 h-4 text-gray-300" />
                      {s.curso}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin className="w-4 h-4 text-gray-300" />
                      {s.bairro}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right relative">
                    <button onClick={() => setActiveMenuId(activeMenuId === s.id ? null : s.id)} className="p-2 text-gray-300 hover:text-ejn-teal"><MoreHorizontal className="w-5 h-5" /></button>
                    {activeMenuId === s.id && (
                      <div className="absolute right-8 top-12 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-30">
                        <button onClick={() => { setHistoryStudent(s); setIsHistoryModalOpen(true); setActiveMenuId(null); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-apple-gray"><History className="w-4 h-4 text-ejn-teal" />Observações</button>
                        <button onClick={() => handleEdit(s)} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-apple-gray"><Edit2 className="w-4 h-4 text-ejn-gold" />Editar</button>
                        <button onClick={() => onDeleteStudent(s.id)} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50"><Trash2 className="w-4 h-4" />Excluir</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-md">
          <div className="bg-white w-full max-w-2xl rounded-apple-2xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-ejn-teal">{editingStudent ? 'Editar Aluno' : 'Novo Aluno'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-apple-gray rounded-full"><X className="w-6 h-6 text-gray-400" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="flex flex-col items-center">
                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <div className="w-24 h-24 bg-apple-gray rounded-full flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-200">
                    {formData.foto_url ? <img src={formData.foto_url} className="w-full h-full object-cover" /> : <Camera className="w-10 h-10 text-gray-300" />}
                  </div>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                </div>
                <p className="text-[10px] font-bold text-gray-400 uppercase mt-2">Foto do Aluno</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase block mb-2 px-1">Nome Completo *</label>
                  <input required type="text" value={formData.nome} onChange={(e) => setFormData({...formData, nome: e.target.value})} className="w-full px-5 py-3 bg-apple-gray rounded-apple-lg border shadow-sm outline-none focus:border-ejn-teal" placeholder="Nome do jovem" />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase block mb-2 px-1">Idade</label>
                  <input type="number" value={formData.idade} onChange={(e) => setFormData({...formData, idade: e.target.value})} className="w-full px-5 py-3 bg-apple-gray rounded-apple-lg border shadow-sm outline-none focus:border-ejn-teal" placeholder="Ex: 19" />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase block mb-2 px-1">Bairro</label>
                  <input type="text" value={formData.bairro} onChange={(e) => setFormData({...formData, bairro: e.target.value})} className="w-full px-5 py-3 bg-apple-gray rounded-apple-lg border shadow-sm outline-none focus:border-ejn-teal" placeholder="Localização" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase block mb-2 px-1">Curso / Trilha *</label>
                  <input required type="text" value={formData.curso} onChange={(e) => setFormData({...formData, curso: e.target.value})} className="w-full px-5 py-3 bg-apple-gray rounded-apple-lg border shadow-sm outline-none focus:border-ejn-teal" placeholder="Ex: UX/UI Design" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase block mb-2 px-1">Observações / Histórico</label>
                  <textarea value={formData.observacoes} onChange={(e) => setFormData({...formData, observacoes: e.target.value})} className="w-full px-5 py-3 bg-apple-gray rounded-apple-lg border shadow-sm outline-none focus:border-ejn-teal h-24 resize-none" placeholder="Contexto social..." />
                </div>
              </div>
              <button type="submit" className="w-full bg-ejn-teal text-white py-4 rounded-apple-lg font-bold shadow-lg hover:bg-[#004d45]">Salvar Cadastro</button>
            </form>
          </div>
        </div>
      )}

      {isHistoryModalOpen && historyStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-apple-2xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold text-ejn-teal mb-6">Observações: {historyStudent.nome}</h2>
            <div className="bg-apple-gray p-6 rounded-apple-xl italic text-gray-700 leading-relaxed mb-8">
              "{historyStudent.observacoes || 'Sem observações registradas.'}"
            </div>
            <button onClick={() => setIsHistoryModalOpen(false)} className="w-full bg-ejn-teal text-white py-4 rounded-apple-lg font-bold">Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
};
