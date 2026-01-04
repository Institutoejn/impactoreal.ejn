
import React, { useRef, useState } from 'react';
import { Camera, User, Linkedin, Instagram, ShieldCheck, Award, CheckCircle2, Loader2, Building2 } from 'lucide-react';
import { UserRole, Perfil } from '../types';
import { supabase } from '../supabase';

interface ProfileProps {
  role: UserRole;
  profileData: Partial<Perfil>;
  totalInvested: number;
  onRefresh: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ role, profileData, totalInvested, onRefresh }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const isGestor = role === 'gestor';

  const handleUpdatePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const getInstagramUrl = (handle: string) => {
    const clean = handle.replace('@', '');
    return `https://instagram.com/${clean}`;
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8 max-w-5xl mx-auto pb-12">
      <div className="bg-white p-12 rounded-apple-2xl shadow-sm border border-gray-50 flex flex-col md:flex-row gap-10 items-center md:items-start relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-ejn-teal/5 rounded-full -mr-32 -mt-32 pointer-events-none" />
        
        <div className="relative cursor-pointer group z-10" onClick={() => fileInputRef.current?.click()}>
          <div className="w-44 h-44 rounded-full overflow-hidden border-4 border-ejn-teal shadow-xl relative group-hover:scale-105 transition-all bg-white flex items-center justify-center">
            {profileData.foto_url ? (
              <img src={profileData.foto_url} className="w-full h-full object-cover" alt="Profile" />
            ) : (
              <User className="w-16 h-16 text-gray-300" />
            )}
            {isSaving && <div className="absolute inset-0 bg-white/50 flex items-center justify-center"><Loader2 className="animate-spin text-ejn-teal" /></div>}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><Camera className="text-white w-8 h-8" /></div>
          </div>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleUpdatePhoto} />
        </div>

        <div className="flex-1 text-center md:text-left space-y-4 z-10">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <h2 className="text-3xl font-black text-ejn-teal tracking-tight">{profileData.nome || 'Carregando...'}</h2>
            <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isGestor ? 'bg-ejn-teal text-white' : 'bg-ejn-gold/10 text-ejn-gold'}`}>
              {isGestor ? 'Presidente' : 'Investidor de Impacto'}
            </div>
          </div>
          <p className="text-apple-text-secondary text-lg font-medium">
            {isGestor ? 'Instituto Escola Jovens de Negócios' : 'Parceiro da Educação Brasileira'}
          </p>
          <p className="text-gray-600 italic max-w-2xl leading-relaxed">
            "{profileData.bio || (isGestor ? 'Liderando a transformação social através da educação.' : 'Contribuindo para o futuro de jovens talentos.')}"
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {isGestor ? (
            <div className="bg-white p-10 rounded-apple-2xl shadow-sm border border-ejn-teal/10 space-y-8">
              <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                <Building2 className="w-6 h-6 text-ejn-teal" />
                <h3 className="text-xl font-bold text-ejn-teal">Dados Institucionais</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Razão Social</p>
                  <p className="font-semibold text-gray-800">{profileData.razao_social || 'Instituto Escola Jovens de Negócios'}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">CNPJ</p>
                  <p className="font-semibold text-gray-800">{profileData.cnpj || '51.708.193/0001-70'}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Endereço Sede</p>
                  <p className="font-semibold text-gray-800">{profileData.endereco || 'São Paulo, SP'}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-10 rounded-apple-2xl shadow-sm border border-gray-50">
              <h3 className="text-xl font-bold text-ejn-teal mb-6 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" />
                Certificações EJN
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-apple-gray rounded-apple-xl border border-gray-100 flex items-center gap-4">
                  <Award className="w-10 h-10 text-ejn-gold" />
                  <div>
                    <p className="font-bold text-ejn-teal">Selo Investidor Social</p>
                    <p className="text-xs text-apple-text-secondary">Nível Ouro Ativo</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white p-10 rounded-apple-2xl shadow-sm border border-gray-50">
            <h3 className="text-xl font-bold text-ejn-teal mb-6 flex items-center gap-2">
              <Linkedin className="w-5 h-5" />
              Presença Digital
            </h3>
            <div className="flex flex-wrap gap-4">
              {profileData.linkedin ? (
                <a href={profileData.linkedin.startsWith('http') ? profileData.linkedin : `https://${profileData.linkedin}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-blue-50 text-blue-700 px-5 py-3 rounded-full text-sm font-bold hover:bg-blue-100 transition-colors">
                  <Linkedin className="w-4 h-4" /> LinkedIn Profissional
                </a>
              ) : null}
              {profileData.instagram ? (
                <a href={getInstagramUrl(profileData.instagram)} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-pink-50 text-pink-700 px-5 py-3 rounded-full text-sm font-bold hover:bg-pink-100 transition-colors">
                  <Instagram className="w-4 h-4" /> Instagram {profileData.instagram.includes('@') ? '' : '@'}{profileData.instagram}
                </a>
              ) : null}
              {!profileData.linkedin && !profileData.instagram && (
                <p className="text-sm text-apple-text-secondary italic">Nenhuma rede social vinculada. Configure em Ajustes.</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-ejn-teal p-8 rounded-apple-2xl text-white shadow-xl relative overflow-hidden group">
            <ShieldCheck className="w-8 h-8 text-ejn-gold mb-8" />
            <p className="text-teal-100/60 text-[10px] font-bold uppercase tracking-widest mb-1">
              {isGestor ? 'Captação sob Gestão' : 'Total Investido'}
            </p>
            <p className="text-4xl font-black mb-8">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalInvested)}
            </p>
            <div className="flex items-center gap-2 text-ejn-gold">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-widest">Auditoria Real-time</span>
            </div>
          </div>
          
          <button onClick={() => onRefresh()} className="w-full bg-apple-gray text-ejn-teal py-4 rounded-apple-xl font-bold text-sm hover:bg-white transition-all border border-gray-200 flex items-center justify-center gap-2">
            Atualizar Informações
          </button>
        </div>
      </div>
    </div>
  );
};
