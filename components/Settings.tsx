
import React, { useState, useRef, useEffect } from 'react';
import { User, Building2, Camera, Save, Loader2, CheckCircle2, Linkedin, Instagram, MapPin, FileText } from 'lucide-react';
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
    endereco: '',
    linkedin: '',
    instagram: ''
  });

  // Sincroniza dados vindos do banco para o estado local do formulário
  useEffect(() => {
    if (profileData) {
      setForm({
        nome: profileData.nome || '',
        bio: profileData.bio || '',
        razao_social: profileData.razao_social || '',
        cnpj: profileData.cnpj || '',
        endereco: profileData.endereco || '',
        linkedin: profileData.linkedin || '',
        instagram: profileData.instagram || ''
      });
    }
  }, [profileData]);

  // Função para aplicar máscara de CNPJ (00.000.000/0000-00)
  const maskCNPJ = (value: string) => {
    return value
      .replace(/\D/g, '') // Remove tudo o que não é dígito
      .replace(/^(\d{2})(\d)/, '$1.$2') // Coloca ponto entre o segundo e o terceiro dígitos
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3') // Coloca ponto entre o quinto e o sexto dígitos
      .replace(/\.(\d{3})(\d)/, '.$1/$2') // Coloca uma barra entre o oitavo e o nono dígitos
      .replace(/(\d{4})(\d)/, '$1-$2') // Coloca um hífen depois do décimo segundo dígito
      .slice(0, 18); // Limita o tamanho
  };

  const handleCNPJChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, cnpj: maskCNPJ(e.target.value) });
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSuccess(false);
    
    try {
      // Captura do usuário autenticado para garantir o ID (UUID)
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Sessão expirada. Por favor, faça login novamente.");

      // Lógica de Upsert contemplando os novos campos do Instituto
      const { error } = await supabase.from('perfis').upsert({
        id: user.id,
        email: user.email,
        nome: form.nome,
        bio: form.bio,
        cargo: 'gestor',
        linkedin: form.linkedin,
        instagram: form.instagram,
        razao_social: form.razao_social,
        cnpj: form.cnpj,
        endereco: form.endereco,
        foto_url: profileData.foto_url
      });

      if (error) {
        console.error("Erro Supabase Detalhado:", error);
        throw new Error(`[${error.code}] ${error.message}`);
      }

      setSuccess(true);
      
      // Força atualização global dos dados para refletir no "Meu Perfil"
      onRefresh();
      
      alert('Dados do Instituto EJN atualizados com sucesso!');
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (e: any) {
      alert(`FALHA AO SALVAR DADOS:\n${e.message}`);
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
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { error } = await supabase.from('perfis').upsert({ 
            id: user.id,
            foto_url: reader.result as string 
          });
          if (!error) onRefresh();
        }
        setIsSaving(false);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8 max-w-4xl pb-20">
      {/* Seção de Perfil Pessoal */}
      <div className="bg-white p-10 rounded-apple-2xl shadow-sm border border-gray-50">
        <div className="flex items-center gap-3 mb-10">
          <User className="w-6 h-6 text-ejn-teal" />
          <h3 className="text-2xl font-bold text-ejn-teal">Perfil do Presidente</h3>
        </div>
        
        <div className="flex flex-col md:flex-row gap-12">
          <div className="flex flex-col items-center gap-4">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="w-32 h-32 bg-ejn-teal rounded-full flex items-center justify-center text-white text-4xl font-black shadow-xl overflow-hidden border-4 border-white transition-transform group-hover:scale-105">
                {profileData.foto_url ? (
                  <img src={profileData.foto_url} className="w-full h-full object-cover" alt="Avatar" />
                ) : (
                  'ADM'
                )}
              </div>
              <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                <Camera className="text-white w-8 h-8" />
              </div>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Foto Oficial</p>
          </div>
          
          <div className="flex-1 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-2 px-1">Nome Completo</label>
                <input 
                  value={form.nome} 
                  onChange={e => setForm({...form, nome: e.target.value})} 
                  type="text" 
                  className="w-full px-5 py-3 bg-apple-gray rounded-apple-lg border border-transparent outline-none focus:border-ejn-teal focus:bg-white transition-all shadow-sm" 
                  placeholder="Ex: Paulo Ricardo" 
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-2 px-1">Cargo Atual</label>
                <input value="Presidente" disabled className="w-full px-5 py-3 bg-gray-50 text-gray-400 rounded-apple-lg border border-gray-100 cursor-not-allowed font-medium" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-2 px-1">LinkedIn Profissional</label>
                <div className="relative">
                  <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    value={form.linkedin} 
                    onChange={e => setForm({...form, linkedin: e.target.value})} 
                    type="text" 
                    className="w-full pl-12 pr-5 py-3 bg-apple-gray rounded-apple-lg border border-transparent outline-none focus:border-ejn-teal focus:bg-white transition-all shadow-sm" 
                    placeholder="linkedin.com/in/usuario" 
                  />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-2 px-1">Instagram Institucional</label>
                <div className="relative">
                  <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    value={form.instagram} 
                    onChange={e => setForm({...form, instagram: e.target.value})} 
                    type="text" 
                    className="w-full pl-12 pr-5 py-3 bg-apple-gray rounded-apple-lg border border-transparent outline-none focus:border-ejn-teal focus:bg-white transition-all shadow-sm" 
                    placeholder="@instituto_ejn" 
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-2 px-1">Bio do Presidente</label>
              <textarea 
                value={form.bio} 
                onChange={e => setForm({...form, bio: e.target.value})} 
                className="w-full px-5 py-3 bg-apple-gray rounded-apple-lg border border-transparent outline-none focus:border-ejn-teal focus:bg-white transition-all h-24 resize-none shadow-sm" 
                placeholder="Descreva sua visão para o Instituto..." 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Seção de Dados do Instituto */}
      <div className="bg-white p-10 rounded-apple-2xl shadow-sm border border-gray-50">
        <div className="flex items-center gap-3 mb-10">
          <Building2 className="w-6 h-6 text-ejn-teal" />
          <h3 className="text-2xl font-bold text-ejn-teal">Dados do Instituto</h3>
        </div>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-2 px-1">Razão Social</label>
              <div className="relative">
                <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  value={form.razao_social} 
                  onChange={e => setForm({...form, razao_social: e.target.value})} 
                  type="text" 
                  className="w-full pl-12 pr-5 py-3 bg-apple-gray rounded-apple-lg border border-transparent outline-none focus:border-ejn-teal focus:bg-white transition-all shadow-sm" 
                  placeholder="Nome oficial da organização"
                />
              </div>
            </div>
            <div>
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-2 px-1">CNPJ do Instituto</label>
              <div className="relative">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  value={form.cnpj} 
                  onChange={handleCNPJChange} 
                  type="text" 
                  className="w-full pl-12 pr-5 py-3 bg-apple-gray rounded-apple-lg border border-transparent outline-none focus:border-ejn-teal focus:bg-white transition-all shadow-sm font-mono" 
                  placeholder="00.000.000/0000-00"
                />
              </div>
            </div>
          </div>
          <div>
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-2 px-1">Endereço da Sede</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                value={form.endereco} 
                onChange={e => setForm({...form, endereco: e.target.value})} 
                type="text" 
                className="w-full pl-12 pr-5 py-3 bg-apple-gray rounded-apple-lg border border-transparent outline-none focus:border-ejn-teal focus:bg-white transition-all shadow-sm" 
                placeholder="Rua, Número, Bairro, Cidade - UF"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Ações Finais */}
      <div className="flex justify-end pt-4">
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className={`flex items-center gap-3 px-12 py-5 rounded-apple-xl font-black text-lg transition-all transform active:scale-95 shadow-xl ${
            success ? 'bg-green-500 text-white' : 'bg-ejn-teal text-white hover:bg-[#004d45] shadow-ejn-teal/20'
          }`}
        >
          {isSaving ? <Loader2 className="animate-spin w-6 h-6" /> : success ? <CheckCircle2 className="w-6 h-6" /> : <Save className="w-6 h-6" />}
          {success ? 'Dados Sincronizados!' : 'Gravar Alterações'}
        </button>
      </div>
    </div>
  );
};

// Componente Local auxiliar para o ícone Hash não importado
const Hash = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="9" x2="20" y2="9"></line>
    <line x1="4" y1="15" x2="20" y2="15"></line>
    <line x1="10" y1="3" x2="8" y2="21"></line>
    <line x1="16" y1="3" x2="14" y2="21"></line>
  </svg>
);
