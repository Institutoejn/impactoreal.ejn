
import React, { useState, useRef, useEffect } from 'react';
import { Camera, Save, User, Mail, Phone, Globe, Linkedin, Instagram, Lock, ShieldCheck, Award, Heart, CheckCircle2, Loader2 } from 'lucide-react';
import { UserRole } from '../types';
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
    name: '',
    email: '',
    phone: '',
    bio: '',
    linkedin: '',
    instagram: '',
    appear_in_wall: false,
    receive_reports: true
  });

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', role)
        .single();

      if (data) {
        setFormData({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          bio: data.bio || '',
          linkedin: data.linkedin || '',
          instagram: data.instagram || '',
          appear_in_wall: data.appear_in_wall || false,
          receive_reports: data.receive_reports !== false
        });
      }
      setIsLoading(false);
    };

    fetchProfile();
  }, [role]);

  const handleSave = async () => {
    setIsSaving(true);
    const { error } = await supabase
      .from('profiles')
      .upsert({
        role: role,
        ...formData,
        profile_photo: currentPhoto
      }, { onConflict: 'role' });

    if (!error) {
      onUpdateName(formData.name);
      alert('Perfil sincronizado com Supabase!');
    } else {
      console.error(error);
      alert('Erro ao salvar no banco de dados.');
    }
    setIsSaving(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdatePhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) return (
    <div className="flex justify-center items-center h-64 text-ejn-teal">
      <Loader2 className="w-8 h-8 animate-spin" />
    </div>
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header Profile Card */}
      <div className="bg-white p-8 md:p-12 rounded-apple-2xl shadow-sm border border-gray-50 flex flex-col items-center md:items-start md:flex-row gap-8">
        <div className="relative group cursor-pointer shrink-0" onClick={() => fileInputRef.current?.click()}>
          <div className="w-32 h-32 md:w-44 md:h-44 rounded-full overflow-hidden border-4 border-ejn-teal shadow-xl relative transition-all group-hover:scale-105">
            {currentPhoto ? (
              <img src={currentPhoto} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-apple-gray flex items-center justify-center">
                <User className="w-16 h-16 text-gray-300" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
              <Camera className="text-white w-8 h-8" />
            </div>
          </div>
          <button className="absolute bottom-2 right-2 p-2 bg-ejn-teal text-white rounded-full shadow-lg border-2 border-white">
            <Camera className="w-5 h-5" />
          </button>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
        </div>

        <div className="flex-1 text-center md:text-left space-y-4">
          <div>
            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
              <h2 className="text-3xl font-black text-ejn-teal tracking-tight">{formData.name || 'Seu Nome'}</h2>
              {role === 'donor' && (
                <div className="flex items-center justify-center md:justify-start gap-1 bg-ejn-gold/10 text-ejn-gold px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border border-ejn-gold/20">
                  <Award className="w-3 h-3" />
                  {totalInvested >= 5000 ? 'Padrinho Ouro' : 'Parceiro EJN'}
                </div>
              )}
            </div>
            <p className="text-apple-text-secondary text-lg font-medium">
              {role === 'manager' ? "Presidente - Instituto EJN" : "Investidor Social de Impacto"}
            </p>
          </div>
          <p className="text-gray-600 leading-relaxed max-w-2xl text-sm md:text-base italic">
            "{formData.bio || 'Adicione uma breve biografia...'}"
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 md:p-10 rounded-apple-2xl shadow-sm border border-gray-50">
            <div className="flex items-center gap-3 mb-8">
              <User className="w-6 h-6 text-ejn-teal" />
              <h3 className="text-xl font-bold text-ejn-teal">Informações Pessoais</h3>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">Nome Completo</label>
                  <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} type="text" className="w-full px-5 py-4 bg-apple-gray rounded-apple-lg border-transparent focus:bg-white focus:border-ejn-teal outline-none transition-all shadow-sm border" />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">E-mail</label>
                  <input value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} type="email" className="w-full px-5 py-4 bg-apple-gray rounded-apple-lg border-transparent focus:bg-white focus:border-ejn-teal outline-none transition-all shadow-sm border" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">Mini Bio Profissional</label>
                <textarea value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="w-full px-5 py-4 bg-apple-gray rounded-apple-lg border-transparent focus:bg-white focus:border-ejn-teal outline-none transition-all h-32 resize-none shadow-sm border" />
              </div>
            </div>
          </div>

          <div className="bg-white p-8 md:p-10 rounded-apple-2xl shadow-sm border border-gray-50">
            <div className="flex items-center gap-3 mb-8">
              <Globe className="w-6 h-6 text-ejn-teal" />
              <h3 className="text-xl font-bold text-ejn-teal">Conexões</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input value={formData.linkedin} onChange={e => setFormData({...formData, linkedin: e.target.value})} type="text" className="w-full px-5 py-4 bg-apple-gray rounded-apple-lg border-transparent focus:bg-white focus:border-ejn-teal outline-none transition-all shadow-sm border" placeholder="LinkedIn URL" />
              <input value={formData.instagram} onChange={e => setFormData({...formData, instagram: e.target.value})} type="text" className="w-full px-5 py-4 bg-apple-gray rounded-apple-lg border-transparent focus:bg-white focus:border-ejn-teal outline-none transition-all shadow-sm border" placeholder="@instagram" />
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-ejn-teal p-8 rounded-apple-2xl text-white shadow-xl shadow-ejn-teal/20 relative overflow-hidden group">
            <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
              {role === 'donor' ? <Heart className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
              Impacto Cloud
            </h3>
            <div className="space-y-6">
              <div>
                <p className="text-teal-100/60 text-[10px] font-bold uppercase tracking-widest mb-1">Total Investido</p>
                <p className="text-3xl font-black">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(role === 'donor' ? totalInvested : 1500000)}</p>
              </div>
            </div>
          </div>

          {role === 'donor' && (
            <div className="bg-white p-8 rounded-apple-2xl shadow-sm border border-gray-50">
              <h3 className="text-lg font-bold text-ejn-teal mb-6">Privacidade</h3>
              <div className="space-y-4">
                <button 
                  onClick={() => setFormData({...formData, appear_in_wall: !formData.appear_in_wall})}
                  className="w-full flex items-center justify-between text-left"
                >
                  <span className="text-sm font-bold text-gray-800">Nome no Mural</span>
                  <div className={`w-10 h-6 rounded-full transition-all flex items-center px-1 ${formData.appear_in_wall ? 'bg-ejn-teal' : 'bg-gray-200'}`}>
                    <div className={`w-4 h-4 bg-white rounded-full transition-all ${formData.appear_in_wall ? 'translate-x-4' : 'translate-x-0'}`} />
                  </div>
                </button>
              </div>
            </div>
          )}

          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="w-full bg-ejn-teal text-white py-5 rounded-apple-xl font-black text-lg shadow-xl shadow-ejn-teal/20 hover:bg-[#004d45] transition-all transform active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
            Sincronizar Supabase
          </button>
        </div>
      </div>
    </div>
  );
};
