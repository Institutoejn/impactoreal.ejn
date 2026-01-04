
import React, { useState, useRef } from 'react';
import { X, Search, MoreHorizontal, GraduationCap, MapPin, UserPlus, Edit2, Trash2, History, Camera, Briefcase, Rocket } from 'lucide-react';
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

  const handleToggleStatus = (s: Aluno, field: 'esta_empregado' | 'esta_emprendendo') => {
    onUpdateStudent({
      ...s,
      [field]: !s[field]
    });
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
          <input 
            type="text" 
            placeholder="Localizar líder..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-white rounded-apple-xl outline-none shadow-sm border-transparent focus:border-ejn-teal border transition-all"
          />
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="flex items-center justify-center gap-3 bg-ejn-teal text-white px-8 py-4 rounded-apple-xl font-bold shadow-lg shadow-ejn-teal/20 hover:bg-[#004d45] transition-all"
        >
          <UserPlus className="w-5 h-5" />
          Registrar líder
        </button>
      </div>

      <div className="bg-white rounded-apple-2xl shadow-sm border border-gray-50 overflow-hidden min-h-[400px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-apple-gray">
              <tr>
                <th className="px-10 py-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Líder</th>
                <th className="px-10 py-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Sucesso Profissional</th>
                <th className="px-10 py-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Trilha</th>
                <th className="px-10 py-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-apple-gray/20 transition-colors group">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-ejn-teal/5 rounded-full overflow-hidden border border-gray-100 flex items-center justify-center text-ejn-teal font-bold shadow-sm shrink-0">
                        {s.foto_url ? <img src={s.foto_url} className="w-full h-full object-cover" /> : s.nome.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-ejn-teal text-[15px] truncate">{s.nome}</p>
                        <p className="text-[10px] text-apple-text-secondary font-extralight uppercase font-bold tracking-widest">{s.idade} anos</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => handleToggleStatus(s, 'esta_empregado')}
                        className={`p-2 rounded-lg transition-all flex items-center gap-1.5 border ${s.esta_empregado ? 'bg-green-50 border-green-100 text-green-600 shadow-sm' : 'bg-apple-gray border-transparent text-gray-300 hover:text-gray-400'}`}
                        title="Empregado"
                      >
                        <Briefcase className="w-4 h-4" />
                        {s.esta_empregado && <span className="text-[9px] font-bold uppercase tracking-tighter">No Mercado</span>}
                      </button>
                      <button 
                        onClick={() => handleToggleStatus(s, 'esta_emprendendo')}
                        className={`p-2 rounded-lg transition-all flex items-center gap-1.5 border ${s.esta_emprendendo ? 'bg-ejn-gold/10 border-ejn-gold/20 text-ejn-gold shadow-sm' : 'bg-apple-gray border-transparent text-gray-300 hover:text-gray-400'}`}
                        title="Empreendedor"
                      >
                        <Rocket className="w-4 h-4" />
                        {s.esta_emprendendo && <span className="text-[9px] font-bold uppercase tracking-tighter">Novo Negócio</span>}
                      </button>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-2 text-[13px] text-gray-700 font-bold">
                      <GraduationCap className="w-3.5 h-3.5 text-ejn-gold" />
                      {s.curso}
                    </div>
                  </td>
                  <td className="px-10 py-6 text-right relative">
                    <button onClick={() => setActiveMenuId(activeMenuId === s.id ? null : s.id)} className="p-3 text-gray-300 hover:text-ejn-teal transition-colors"><MoreHorizontal className="w-5 h-5" /></button>
                    {activeMenuId === s.id && (
                      <div className="absolute right-10 top-16 w-56 bg-white rounded-apple-xl shadow-2xl border border-gray-100 py-3 z-30 animate-in fade-in zoom-in-95 duration-200">
                        <button onClick={() => { setHistoryStudent(s); setIsHistoryModalOpen(true); setActiveMenuId(null); }} className="w-full flex items-center gap-4 px-6 py-4 text-sm font-bold text-gray-600 hover:bg-apple-gray transition-colors"><History className="w-4 h-4 text-ejn-teal" />Sua Jornada</button>
                        <button onClick={() => handleEdit(s)} className="w-full flex items-center gap-4 px-6 py-4 text-sm font-bold text-gray-600 hover:bg-apple-gray transition-colors"><Edit2 className="w-4 h-4 text-ejn-gold" />Editar</button>
                        <button onClick={() => onDeleteStudent(s.id)} className="w-full flex items-center gap-4 px-6 py-4 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"><Trash2 className="w-4 h-4" />Remover</button>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/10 backdrop-blur-md">
          <div className="bg-white w-full max-w-2xl rounded-apple-2xl shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="flex items-center justify-between p-8 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-ejn-teal tracking-tighter">{editingStudent ? 'Atualizar líder' : 'Novo líder'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-3 hover:bg-apple-gray rounded-full transition-colors"><X className="w-6 h-6 text-gray-300" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-10 space-y-8 max-h-[70vh] overflow-y-auto">
              <div className="flex flex-col items-center">
                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  <div className="w-28 h-28 bg-apple-gray rounded-full flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-200 hover:border-ejn-teal transition-colors">
                    {formData.foto_url ? <img src={formData.foto_url} className="w-full h-full object-cover" /> : <Camera className="w-10 h-10 text-gray-300" />}
                  </div>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                </div>
                <p className="text-[10px] font-bold text-gray-400 uppercase mt-4 tracking-widest">Identidade Visual</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase block mb-3 px-1 tracking-widest">Nome completo *</label>
                  <input required type="text" value={formData.nome} onChange={(e) => setFormData({...formData, nome: e.target.value})} className="w-full px-6 py-4 bg-apple-gray rounded-apple-xl outline-none focus:bg-white border-transparent focus:border-ejn-teal border transition-all font-bold" />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase block mb-3 px-1 tracking-widest">Idade</label>
                  <input type="number" value={formData.idade} onChange={(e) => setFormData({...formData, idade: e.target.value})} className="w-full px-6 py-4 bg-apple-gray rounded-apple-xl outline-none focus:bg-white border-transparent focus:border-ejn-teal border transition-all font-bold" />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase block mb-3 px-1 tracking-widest">Região</label>
                  <input type="text" value={formData.bairro} onChange={(e) => setFormData({...formData, bairro: e.target.value})} className="w-full px-6 py-4 bg-apple-gray rounded-apple-xl outline-none focus:bg-white border-transparent focus:border-ejn-teal border transition-all font-bold" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase block mb-3 px-1 tracking-widest">Trilha estratégica *</label>
                  <input required type="text" value={formData.curso} onChange={(e) => setFormData({...formData, curso: e.target.value})} className="w-full px-6 py-4 bg-apple-gray rounded-apple-xl outline-none focus:bg-white border-transparent focus:border-ejn-teal border transition-all font-bold" />
                </div>
                <div className="md:col-span-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase block mb-3 px-1 tracking-widest">Sua Jornada</label>
                  <textarea value={formData.observacoes} onChange={(e) => setFormData({...formData, observacoes: e.target.value})} className="w-full px-6 py-4 bg-apple-gray rounded-apple-xl outline-none focus:bg-white border-transparent focus:border-ejn-teal border transition-all h-32 resize-none font-extralight text-lg" placeholder="Como o Instituto mudou seu amanhã..." />
                </div>
              </div>
              <button type="submit" className="w-full bg-ejn-teal text-white py-5 rounded-apple-xl font-bold shadow-xl shadow-ejn-teal/10 hover:bg-[#004d45] uppercase tracking-widest text-sm transition-all active:scale-[0.98]">Confirmar registro</button>
            </form>
          </div>
        </div>
      )}

      {isHistoryModalOpen && historyStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/10 backdrop-blur-md animate-in fade-in">
          <div className="bg-white w-full max-w-xl rounded-apple-2xl shadow-2xl p-12 animate-in zoom-in-95">
            <h2 className="text-3xl font-bold text-ejn-teal mb-8 tracking-tighter">Sua Jornada: {historyStudent.nome}</h2>
            <div className="bg-apple-gray/50 p-8 rounded-apple-xl italic text-gray-700 leading-relaxed mb-10 font-extralight text-xl">
              "{historyStudent.observacoes || 'Trajetória em construção.'}"
            </div>
            <button onClick={() => setIsHistoryModalOpen(false)} className="w-full bg-ejn-teal text-white py-5 rounded-apple-xl font-bold text-lg hover:bg-[#004d45] transition-all">Fechar</button>
          </div>
        </div>
      )}
    </div>
  );
};
