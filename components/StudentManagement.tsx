
import React, { useState, useEffect, useRef } from 'react';
import { X, Search, MoreHorizontal, GraduationCap, MapPin, UserPlus, Edit2, Trash2, History, Camera, User } from 'lucide-react';
import { Student } from '../types';

interface StudentManagementProps {
  students: Student[];
  onAddStudent: (student: Omit<Student, 'id' | 'status'>) => void;
  onUpdateStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
}

export const StudentManagement: React.FC<StudentManagementProps> = ({ students, onAddStudent, onUpdateStudent, onDeleteStudent }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [historyStudent, setHistoryStudent] = useState<Student | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const menuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    neighborhood: '',
    course: '',
    history: '',
    image: ''
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const studentData = {
      name: formData.name,
      age: parseInt(formData.age),
      neighborhood: formData.neighborhood,
      course: formData.course,
      history: formData.history,
      image: formData.image
    };

    if (editingStudent) {
      onUpdateStudent({ ...editingStudent, ...studentData });
    } else {
      onAddStudent(studentData);
    }
    resetForm();
    setIsModalOpen(false);
  };

  const resetForm = () => {
    setFormData({ name: '', age: '', neighborhood: '', course: '', history: '', image: '' });
    setEditingStudent(null);
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      age: student.age.toString(),
      neighborhood: student.neighborhood,
      course: student.course,
      history: student.history,
      image: student.image || ''
    });
    setIsModalOpen(true);
    setActiveMenuId(null);
  };

  const handleDelete = (student: Student) => {
    if (window.confirm(`Tem certeza que deseja remover ${student.name}?`)) {
      onDeleteStudent(student.id);
    }
    setActiveMenuId(null);
  };

  const handleViewHistory = (student: Student) => {
    setHistoryStudent(student);
    setIsHistoryModalOpen(true);
    setActiveMenuId(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="relative flex-1 max-w-md font-sans">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar aluno por nome ou curso..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white rounded-apple-lg border-transparent focus:border-ejn-teal focus:ring-0 transition-all outline-none shadow-sm text-sm"
          />
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="flex items-center justify-center gap-2 bg-ejn-teal text-white px-6 py-4 rounded-apple-lg font-bold hover:bg-[#004d45] transition-all transform active:scale-95 shadow-md shadow-ejn-teal/10"
        >
          <UserPlus className="w-5 h-5" />
          Novo Aluno
        </button>
      </div>

      <div className="bg-white rounded-apple-2xl shadow-sm border border-gray-50 overflow-hidden min-h-[400px] font-sans">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
            <thead className="bg-apple-gray">
              <tr>
                <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Aluno</th>
                <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Curso</th>
                <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Bairro</th>
                <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-apple-gray/30 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-ejn-teal/5 rounded-full flex items-center justify-center font-bold text-ejn-teal overflow-hidden border border-gray-100 shrink-0">
                        {student.image ? (
                          <img src={student.image} alt={student.name} className="w-full h-full object-cover" />
                        ) : (
                          student.name.charAt(0)
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-ejn-teal truncate">{student.name}</p>
                        <p className="text-xs text-apple-text-secondary">{student.age} anos</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <GraduationCap className="w-4 h-4 text-gray-300" />
                      {student.course}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin className="w-4 h-4 text-gray-300" />
                      {student.neighborhood}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-center">
                    <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter ${
                      student.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                    }`}>
                      {student.status === 'active' ? 'Ativo' : 'Pendente'}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right relative">
                    <button 
                      onClick={() => setActiveMenuId(activeMenuId === student.id ? null : student.id)}
                      className="p-2 text-gray-300 hover:text-ejn-teal transition-colors"
                    >
                      <MoreHorizontal className="w-5 h-5" />
                    </button>

                    {activeMenuId === student.id && (
                      <div 
                        ref={menuRef}
                        className="absolute right-8 top-12 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-30 animate-in fade-in zoom-in-95 duration-200 origin-top-right"
                      >
                        <button onClick={() => handleViewHistory(student)} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-apple-gray transition-colors text-left"><History className="w-4 h-4 text-ejn-teal" />Histórico</button>
                        <button onClick={() => handleEdit(student)} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-apple-gray transition-colors text-left"><Edit2 className="w-4 h-4 text-ejn-gold" />Editar</button>
                        <div className="h-px bg-gray-50 my-1"></div>
                        <button onClick={() => handleDelete(student)} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors text-left"><Trash2 className="w-4 h-4" />Excluir</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cadastro Modal - Mobile Optimized */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-300 overflow-y-auto">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-md fixed" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white w-full max-w-2xl rounded-apple-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-500 my-auto">
            <div className="flex items-center justify-between p-6 md:p-8 border-b border-gray-100">
              <h2 className="text-xl md:text-2xl font-bold text-ejn-teal">{editingStudent ? 'Editar Aluno' : 'Cadastrar Novo Aluno'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-apple-gray rounded-full transition-colors"><X className="w-6 h-6 text-gray-400" /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6 font-sans max-h-[70vh] overflow-y-auto">
              <div className="flex flex-col items-center mb-6">
                <div 
                  className="relative group cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-24 h-24 md:w-28 md:h-28 bg-apple-gray rounded-full flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-200 group-hover:border-ejn-teal transition-all group-hover:scale-105">
                    {formData.image ? (
                      <img src={formData.image} alt="Preview" className="w-full h-full object-cover animate-in fade-in" />
                    ) : (
                      <Camera className="w-10 h-10 text-gray-300" />
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="text-white w-8 h-8" />
                  </div>
                  <button type="button" className="absolute bottom-0 right-0 p-2.5 bg-white rounded-full shadow-lg border border-gray-100 text-ejn-teal hover:scale-110 active:scale-90 transition-all"><Camera className="w-4 h-4" /></button>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                </div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-3">Foto do Aluno</p>
                {formData.image && <button type="button" onClick={(e) => { e.stopPropagation(); setFormData({...formData, image: ''}) }} className="mt-1 text-[9px] text-red-400 font-bold uppercase hover:underline">Remover Foto</button>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-2 px-1">Nome Completo</label>
                  <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-5 py-3 bg-apple-gray rounded-apple-lg border-transparent focus:bg-white focus:border-ejn-teal outline-none transition-all shadow-sm border" placeholder="Nome do jovem" />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-2 px-1">Idade</label>
                  <input required type="number" value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} className="w-full px-5 py-3 bg-apple-gray rounded-apple-lg border-transparent focus:bg-white focus:border-ejn-teal outline-none transition-all shadow-sm border" placeholder="Ex: 19" />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-2 px-1">Bairro</label>
                  <input required type="text" value={formData.neighborhood} onChange={(e) => setFormData({...formData, neighborhood: e.target.value})} className="w-full px-5 py-3 bg-apple-gray rounded-apple-lg border-transparent focus:bg-white focus:border-ejn-teal outline-none transition-all shadow-sm border" placeholder="Localização" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-2 px-1">Curso / Trilha</label>
                  <select required value={formData.course} onChange={(e) => setFormData({...formData, course: e.target.value})} className="w-full px-5 py-3 bg-apple-gray rounded-apple-lg border-transparent focus:bg-white focus:border-ejn-teal outline-none transition-all shadow-sm border appearance-none">
                    <option value="">Selecione um curso</option>
                    <option value="UX/UI Design">UX/UI Design</option>
                    <option value="Desenvolvimento Web">Desenvolvimento Web</option>
                    <option value="Liderança Comunitária">Liderança Comunitária</option>
                    <option value="Empreendedorismo Social">Empreendedorismo Social</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-2 px-1">Histórico</label>
                  <textarea value={formData.history} onChange={(e) => setFormData({...formData, history: e.target.value})} className="w-full px-5 py-3 bg-apple-gray rounded-apple-lg border-transparent focus:bg-white focus:border-ejn-teal outline-none transition-all h-32 resize-none shadow-sm border" placeholder="Contexto social..." />
                </div>
              </div>
              
              <button type="submit" className="w-full bg-ejn-teal text-white py-4 rounded-apple-lg font-bold shadow-lg hover:bg-[#004d45] transition-all transform active:scale-[0.98]">
                {editingStudent ? 'Salvar Alterações' : 'Salvar Cadastro'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* History Modal - Mobile Optimized */}
      {isHistoryModalOpen && historyStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm fixed" onClick={() => setIsHistoryModalOpen(false)} />
          <div className="relative bg-white w-full max-w-lg rounded-apple-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 font-sans">
            <div className="p-8 md:p-10 text-center">
              <div className="w-24 h-24 bg-ejn-teal/10 rounded-full flex items-center justify-center mx-auto mb-6 overflow-hidden border-2 border-ejn-teal/20">
                {historyStudent.image ? (
                  <img src={historyStudent.image} alt={historyStudent.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-12 h-12 text-ejn-teal/40" />
                )}
              </div>
              <h2 className="text-2xl font-bold text-ejn-teal mb-8">{historyStudent.name}</h2>
              <div className="bg-apple-gray p-6 md:p-8 rounded-apple-xl text-left border border-gray-100 mb-8 font-medium italic text-gray-700 leading-relaxed max-h-[40vh] overflow-y-auto text-sm md:text-base">
                "{historyStudent.history || 'Nenhum registro de evolução detalhado no momento.'}"
              </div>
              <button onClick={() => setIsHistoryModalOpen(false)} className="w-full bg-ejn-teal text-white py-4 rounded-apple-lg font-bold shadow-lg transition-all hover:bg-[#004d45]">Fechar Visualização</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
