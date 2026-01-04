
import React, { useState, useRef, useEffect } from 'react';
import { Camera, Save, User, Linkedin, Instagram, ShieldCheck, Award, CheckCircle2, Loader2 } from 'lucide-react';
import { UserRole, Perfil } from '../types';
import { supabase } from '../supabase';

interface ProfileProps {
  role: UserRole;
  onUpdatePhoto: (base64: string) => void;
  onUpdateName: (name: string) => void;
  currentPhoto: string | null;
  totalInvested: number;
}

export const Profile: React.FC<ProfileProps> = ({ role, onUpdatePhoto, onUpdateName, currentPhoto, totalInvested }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    bio: '',
    linkedin: '',
    instagram: '',
    cargo: role
  });

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return setIsLoading(false);

      const { data } = await supabase.from('perfis').select('*').eq('id', user.id).single();
      if (data) {
        setFormData({
          nome: data.nome || '',
          email: data.email || '',
          bio: data.bio || '',
          linkedin: data.linkedin || '',
          instagram: data.instagram || '',
          cargo: data.cargo || role
        });
      }
      setIsLoading(false);
    };
    fetchProfile();
  }, [role]);

  const handleSave = async () => {
    setIsSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return setIsSaving(false);

    const { error } = await supabase.from('perfis').update({
      nome: formData.nome,
      bio: formData.bio,
      linkedin: formData.linkedin,
      instagram: formData.instagram,
      foto_url: currentPhoto,
      updated_at: new Date().toISOString()
    }).eq('id', user.id);

    if (!error) {
      onUpdateName(formData.nome);
      alert('Perfil sincronizado!');
    } else {
      alert('Erro: ' + error.message);
    }
    setIsSaving(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => onUpdatePhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-ejn-teal" /></div>;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8 max-w-5xl mx-auto pb-12">
      <div className="bg-white p-12 rounded-apple-2xl shadow-sm border border-gray-50 flex flex-col md:flex-row gap-8 items-center md:items-start">
        <div className="relative cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
          <div className="w-44 h-44 rounded-full overflow-hidden border-4 border-ejn-teal shadow-xl relative group-hover:scale-105 transition-all">
            {currentPhoto ? <img src={currentPhoto} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-apple-gray flex items-center justify-center"><User className="w-16 h-16 text-gray-300" /></div>}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><Camera className="text-white w-8 h-8" /></div>
          </div>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
        </div>

        <div className="flex-1 text-center md:text-left space-y-4">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <h2 className="text-3xl font-black text-ejn-teal">{formData.nome || 'Seu Nome'}</h2>
            <div className="bg-ejn-gold/10 text-ejn-gold px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest">
              {totalInvested >= 5000 ? 'Padrinho Ouro' : 'Parceiro Social'}
            </div>
          </div>
          <p className="text-apple-text-secondary text-lg font-medium">{formData.cargo === 'manager' ? 'Gestor Administrativo' : 'Investidor de Impacto'}</p>
          <p className="text-gray-600 italic max-w-2xl">"{formData.bio || 'Adicione uma bio para inspirar o Instituto.'}"</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-10 rounded-apple-2xl shadow-sm border border-gray-50 space-y-6">
            <h3 className="text-xl font-bold text-ejn-teal mb-4">Dados Pessoais</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} type="text" className="w-full px-5 py-4 bg-apple-gray rounded-apple-lg outline-none border" placeholder="Nome Completo" />
              <input value={formData.email} type="email" className="w-full px-5 py-4 bg-apple-gray rounded-apple-lg border opacity-50" disabled />
            </div>
            <textarea value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="w-full px-5 py-4 bg-apple-gray rounded-apple-lg outline-none border h-32" placeholder="Biografia curta" />
          </div>
          <div className="bg-white p-10 rounded-apple-2xl shadow-sm border border-gray-50 space-y-6">
            <h3 className="text-xl font-bold text-ejn-teal mb-4">Redes Sociais</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input value={formData.linkedin} onChange={e => setFormData({...formData, linkedin: e.target.value})} type="text" className="w-full px-5 py-4 bg-apple-gray rounded-apple-lg border" placeholder="LinkedIn URL" />
              <input value={formData.instagram} onChange={e => setFormData({...formData, instagram: e.target.value})} type="text" className="w-full px-5 py-4 bg-apple-gray rounded-apple-lg border" placeholder="Instagram @user" />
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-ejn-teal p-8 rounded-apple-2xl text-white shadow-xl relative overflow-hidden">
            <ShieldCheck className="w-5 h-5 text-ejn-gold mb-8" />
            <p className="text-teal-100/60 text-[10px] font-bold uppercase tracking-widest mb-1">Status de Impacto</p>
            <div className="flex items-center gap-2 mb-6"><CheckCircle2 className="w-4 h-4 text-ejn-gold" /><p className="text-sm font-bold">Verificado em Blockchain</p></div>
            <p className="text-teal-100/60 text-[10px] font-bold uppercase tracking-widest mb-1">Total Movimentado</p>
            <p className="text-3xl font-black">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalInvested)}</p>
          </div>
          <button onClick={handleSave} disabled={isSaving} className="w-full bg-ejn-gold text-white py-5 rounded-apple-xl font-black text-lg shadow-xl hover:bg-[#D19900] disabled:opacity-50 flex items-center justify-center gap-3">
            {isSaving ? <Loader2 className="animate-spin" /> : <Save />} Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
};
