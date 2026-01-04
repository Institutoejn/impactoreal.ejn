
import React, { useState, useRef, useEffect } from 'react';
import { Camera, Save, User, Linkedin, Instagram, ShieldCheck, Award, CheckCircle2, Loader2, Building2, MapPin, Hash } from 'lucide-react';
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
  
  const [formData, setFormData] = useState<Partial<Perfil>>({
    nome: '',
    email: '',
    bio: '',
    linkedin: '',
    instagram: '',
    razao_social: '',
    cnpj: '',
    endereco: '',
    cargo: role
  });

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return setIsLoading(false);

        const { data, error } = await supabase.from('perfis').select('*').eq('id', user.id).single();
        
        if (data) {
          setFormData({
            ...data,
            nome: data.nome || '',
            email: data.email || '',
            bio: data.bio || '',
            linkedin: data.linkedin || '',
            instagram: data.instagram || '',
            razao_social: data.razao_social || '',
            cnpj: data.cnpj || '',
            endereco: data.endereco || '',
            cargo: data.cargo || role
          });
        }
      } catch (err) {
        console.error("Erro ao carregar perfil:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [role]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Sessão expirada. Faça login novamente.");

      // Payload Básico (Sempre existe no banco)
      const payload: any = {
        nome: formData.nome,
        bio: formData.bio,
        linkedin: formData.linkedin,
        instagram: formData.instagram,
        foto_url: currentPhoto
      };

      // Só incluímos os dados institucionais se o usuário for gestor
      // E enviamos apenas se houver conteúdo para evitar erros de constraint
      if (formData.cargo === 'gestor') {
        if (formData.razao_social) payload.razao_social = formData.razao_social;
        if (formData.cnpj) payload.cnpj = formData.cnpj;
        if (formData.endereco) payload.endereco = formData.endereco;
      }

      const { error } = await supabase.from('perfis').update(payload).eq('id', user.id);

      if (error) {
        // Erro 42703 é "Undefined Column" - O banco não tem cnpj/razao_social/endereco
        if (error.code === '42703') {
          throw new Error("Erro de Configuração: As colunas de 'CNPJ' ou 'Razão Social' ainda não foram criadas na sua tabela de perfis no Supabase. Por favor, rode o script SQL fornecido para habilitar esses campos.");
        }
        throw error;
      }
      
      if (formData.nome) onUpdateName(formData.nome);
      alert('Perfil e dados institucionais sincronizados!');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => onUpdatePhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center py-32 animate-pulse">
      <Loader2 className="animate-spin text-ejn-teal w-10 h-10 mb-4" />
      <p className="text-sm font-bold text-ejn-teal uppercase tracking-widest">Acessando Banco de Dados...</p>
    </div>
  );

  const isGestor = formData.cargo === 'gestor';

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header Profile */}
      <div className="bg-white p-12 rounded-apple-2xl shadow-sm border border-gray-50 flex flex-col md:flex-row gap-10 items-center md:items-start relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-ejn-teal/5 rounded-full -mr-32 -mt-32 pointer-events-none" />
        
        <div className="relative cursor-pointer group z-10" onClick={() => fileInputRef.current?.click()}>
          <div className="w-44 h-44 rounded-full overflow-hidden border-4 border-ejn-teal shadow-xl relative group-hover:scale-105 transition-all bg-white">
            {currentPhoto ? <img src={currentPhoto} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-apple-gray flex items-center justify-center"><User className="w-16 h-16 text-gray-300" /></div>}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><Camera className="text-white w-8 h-8" /></div>
          </div>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
        </div>

        <div className="flex-1 text-center md:text-left space-y-4 z-10">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <h2 className="text-3xl font-black text-ejn-teal tracking-tight">{formData.nome || 'Usuário EJN'}</h2>
            <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isGestor ? 'bg-ejn-teal text-white' : 'bg-ejn-gold/10 text-ejn-gold'}`}>
              {isGestor ? 'Presidente' : 'Investidor de Impacto'}
            </div>
          </div>
          <p className="text-apple-text-secondary text-lg font-medium">
            {isGestor ? 'Instituto Escola Jovens de Negócios' : 'Parceiro da Educação Brasileira'}
          </p>
          <p className="text-gray-600 italic max-w-2xl leading-relaxed">
            "{formData.bio || (isGestor ? 'Liderando a transformação social através da educação.' : 'Contribuindo para o futuro de jovens talentos.')}"
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {isGestor && (
            <div className="bg-white p-10 rounded-apple-2xl shadow-sm border border-ejn-teal/10 space-y-8 animate-in slide-in-from-left duration-500">
              <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                <Building2 className="w-6 h-6 text-ejn-teal" />
                <h3 className="text-xl font-bold text-ejn-teal">Dados do Instituto</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase block mb-2 px-1">Razão Social</label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                    <input value={formData.razao_social} onChange={e => setFormData({...formData, razao_social: e.target.value})} type="text" className="w-full pl-11 pr-5 py-4 bg-apple-gray rounded-apple-lg outline-none border focus:border-ejn-teal transition-all" placeholder="Nome da instituição" />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase block mb-2 px-1">CNPJ</label>
                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                    <input value={formData.cnpj} onChange={e => setFormData({...formData, cnpj: e.target.value})} type="text" className="w-full pl-11 pr-5 py-4 bg-apple-gray rounded-apple-lg border" placeholder="00.000.000/0001-00" />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase block mb-2 px-1">Endereço Sede</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                    <input value={formData.endereco} onChange={e => setFormData({...formData, endereco: e.target.value})} type="text" className="w-full pl-11 pr-5 py-4 bg-apple-gray rounded-apple-lg outline-none border focus:border-ejn-teal transition-all" placeholder="Rua, Número, Cidade - UF" />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white p-10 rounded-apple-2xl shadow-sm border border-gray-50 space-y-6">
            <h3 className="text-xl font-bold text-ejn-teal mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Informações Pessoais
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase block mb-2 px-1">Nome Completo</label>
                <input value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} type="text" className="w-full px-5 py-4 bg-apple-gray rounded-apple-lg outline-none border focus:border-ejn-teal transition-all" placeholder="Seu nome" />
              </div>
              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase block mb-2 px-1">E-mail (Bloqueado)</label>
                <input value={formData.email} type="email" className="w-full px-5 py-4 bg-apple-gray rounded-apple-lg border opacity-50 cursor-not-allowed" disabled />
              </div>
            </div>
            <div>
              <label className="text-[11px] font-bold text-gray-400 uppercase block mb-2 px-1">Bio / Apresentação</label>
              <textarea value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="w-full px-5 py-4 bg-apple-gray rounded-apple-lg outline-none border h-32 resize-none focus:border-ejn-teal transition-all" placeholder="Fale um pouco sobre você..." />
            </div>
          </div>

          <div className="bg-white p-10 rounded-apple-2xl shadow-sm border border-gray-50 space-y-6">
            <h3 className="text-xl font-bold text-ejn-teal mb-4 flex items-center gap-2">
              <Linkedin className="w-5 h-5" />
              Conexões
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input value={formData.linkedin} onChange={e => setFormData({...formData, linkedin: e.target.value})} type="text" className="w-full px-5 py-4 bg-apple-gray rounded-apple-lg border focus:border-ejn-teal outline-none transition-all" placeholder="URL do LinkedIn" />
              <input value={formData.instagram} onChange={e => setFormData({...formData, instagram: e.target.value})} type="text" className="w-full px-5 py-4 bg-apple-gray rounded-apple-lg border focus:border-ejn-teal outline-none transition-all" placeholder="@ seu_instagram" />
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-ejn-teal p-8 rounded-apple-2xl text-white shadow-xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
            <ShieldCheck className="w-8 h-8 text-ejn-gold mb-8 relative z-10" />
            
            <p className="text-teal-100/60 text-[10px] font-bold uppercase tracking-widest mb-1 relative z-10">Confiança Institucional</p>
            <div className="flex items-center gap-2 mb-8 relative z-10">
              <CheckCircle2 className="w-4 h-4 text-ejn-gold" />
              <p className="text-sm font-bold">Perfil Auditado</p>
            </div>

            <p className="text-teal-100/60 text-[10px] font-bold uppercase tracking-widest mb-1 relative z-10">
              {isGestor ? 'Impacto Gerenciado' : 'Meu Investimento Total'}
            </p>
            <p className="text-4xl font-black relative z-10">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalInvested)}
            </p>
            
            {!isGestor && (
              <div className="mt-8 pt-8 border-t border-white/10 relative z-10">
                <p className="text-[10px] font-bold uppercase text-teal-100/60 mb-3">Conquista Atual</p>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-ejn-gold rounded-xl shadow-lg shadow-black/20">
                    <Award className="w-6 h-6 text-ejn-teal" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Investidor Ouro</p>
                    <p className="text-[10px] text-teal-100/80 uppercase">Top 5% Instituto EJN</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button 
            onClick={handleSave} 
            disabled={isSaving} 
            className="w-full bg-ejn-gold text-white py-6 rounded-apple-xl font-black text-xl shadow-xl hover:bg-[#D19900] transition-all transform active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-4 group"
          >
            {isSaving ? <Loader2 className="animate-spin" /> : <Save className="group-hover:scale-110 transition-transform" />} 
            Sincronizar Dados
          </button>
          
          <p className="text-center text-[10px] text-apple-text-secondary font-bold uppercase tracking-widest px-8">
            Todas as alterações são registradas para auditoria de transparência.
          </p>
        </div>
      </div>
    </div>
  );
};
