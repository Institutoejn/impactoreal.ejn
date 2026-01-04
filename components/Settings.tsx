
import React, { useState, useRef, useEffect } from 'react';
import { User, Building2, Bell, Camera, Save, Loader2, CheckCircle2 } from 'lucide-react';
import { Perfil } from '../types';
import { supabase } from '../supabase';

interface SettingsProps {
  profileData: Partial<Perfil>;
  onRefresh: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ profileData, onRefresh }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [form, setForm] = useState({
    nome: '',
    bio: '',
    razao_social: '',
    cnpj: '',
    endereco: ''
  });

  useEffect(() => {
    if (profileData) {
      setForm({
        nome: profileData.nome || '',
        bio: profileData.bio || '',
        razao_social: profileData.razao_social || '',
        cnpj: profileData.cnpj || '',
        endereco: profileData.endereco || ''
      });
    }
  }, [profileData]);

  const handleSave = async () => {
    setIsSaving(true);
    setSuccess(false);
    try {
      const { error } = await supabase.from('perfis').update({
        nome: form.nome,
        bio: form.bio,
        razao_social: form.razao_social,
        cnpj: form.cnpj,
        endereco: form.endereco
      }).eq('id', profileData.id);

      if (error) throw error;
      setSuccess(true);
      onRefresh();
      setTimeout(() => setSuccess(false), 3000);
    } catch (e: any) {
      alert(`Erro ao salvar: ${e.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        setIsSaving(true);
        await supabase.from('perfis').update({ foto_url: reader.result as string }).eq('id', profileData.id);
        onRefresh();
        setIsSaving(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8 max-w-4xl">
      <div className="bg-white p-10 rounded-apple-2xl shadow-sm border border-gray-50">
        <div className="flex items-center gap-3 mb-10">
          <User className="w-6 h-6 text-ejn-teal" />
          <h3 className="text-2xl font-bold text-ejn-teal">Configurações de Exibição</h3>
        </div>
        
        <div className="flex flex-col md:flex-row gap-12">
          <div className="flex flex-col items-center gap-4">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="w-32 h-32 bg-ejn-teal rounded-full flex items-center justify-center text-white text-4xl font-black shadow-xl overflow-hidden border-4 border-white">
                {profileData.foto_url ? (
                  <img src={profileData.foto_url} className="w-full h-full object-cover" />
                ) : (
                  'ADM'
                )}
              </div>
              <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center"><Camera className="text-white w-8 h-8" /></div>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Clique para alterar foto</p>
          </div>
          
          <div className="flex-1 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-2 px-1">Nome de Exibição</label>
                <input value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} type="text" className="w-full px-5 py-3 bg-apple-gray rounded-apple-lg border outline-none focus:border-ejn-teal transition-all" />
              </div>
              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-2 px-1">Cargo</label>
                <input value="Presidente" disabled className="w-full px-5 py-3 bg-gray-50 text-gray-400 rounded-apple-lg border cursor-not-allowed" />
              </div>
            </div>
            <div>
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-2 px-1">E-mail do Gestor</label>
              <input value={profileData.email} disabled className="w-full px-5 py-3 bg-gray-50 text-gray-400 rounded-apple-lg border cursor-not-allowed" />
            </div>
            <div>
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-2 px-1">Bio Institucional</label>
              <textarea value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} className="w-full px-5 py-3 bg-apple-gray rounded-apple-lg border outline-none focus:border-ejn-teal transition-all h-24 resize-none" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-10 rounded-apple-2xl shadow-sm border border-gray-50">
        <div className="flex items-center gap-3 mb-10">
          <Building2 className="w-6 h-6 text-ejn-teal" />
          <h3 className="text-2xl font-bold text-ejn-teal">Dados do Instituto</h3>
        </div>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-2 px-1">Razão Social</label>
              <input value={form.razao_social} onChange={e => setForm({...form, razao_social: e.target.value})} type="text" className="w-full px-5 py-3 bg-apple-gray rounded-apple-lg border outline-none focus:border-ejn-teal transition-all" />
            </div>
            <div>
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-2 px-1">CNPJ</label>
              <input value={form.cnpj} onChange={e => setForm({...form, cnpj: e.target.value})} type="text" className="w-full px-5 py-3 bg-apple-gray rounded-apple-lg border outline-none focus:border-ejn-teal transition-all" />
            </div>
          </div>
          <div>
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-2 px-1">Endereço Sede</label>
            <input value={form.endereco} onChange={e => setForm({...form, endereco: e.target.value})} type="text" className="w-full px-5 py-3 bg-apple-gray rounded-apple-lg border outline-none focus:border-ejn-teal transition-all" />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className={`flex items-center gap-3 px-10 py-5 rounded-apple-xl font-bold transition-all transform active:scale-95 shadow-xl ${
            success ? 'bg-green-500 text-white' : 'bg-ejn-teal text-white hover:bg-[#004d45] shadow-ejn-teal/20'
          }`}
        >
          {isSaving ? <Loader2 className="animate-spin w-5 h-5" /> : success ? <CheckCircle2 className="w-5 h-5" /> : <Save className="w-5 h-5" />}
          {success ? 'Sincronizado!' : 'Salvar Alterações'}
        </button>
      </div>
    </div>
  );
};
