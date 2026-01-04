import React, { useState, useRef, useEffect } from 'react';
/* Adicionado Globe ao import para corrigir o erro na linha 157 */
import { Camera, Save, User, Mail, Phone, FileText, Linkedin, Instagram, Lock, ShieldCheck, Award, Heart, CheckCircle2, Globe } from 'lucide-react';
import { UserRole } from '../types';

interface ProfileProps {
  role: UserRole;
  onUpdatePhoto: (base64: string) => void;
  onUpdateName: (name: string) => void;
  currentPhoto: string | null;
  totalInvested: number;
}

export const Profile: React.FC<ProfileProps> = ({ role, onUpdatePhoto, onUpdateName, currentPhoto, totalInvested }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Persistence states
  const [name, setName] = useState(() => localStorage.getItem(`ejn_${role}_name`) || (role === 'manager' ? "Paulo Presidente" : "Carlos Eduardo"));
  const [email, setEmail] = useState(() => localStorage.getItem(`ejn_${role}_email`) || (role === 'manager' ? "paulo@ejn.com.br" : "carlos.edu@email.com"));
  const [phone, setPhone] = useState(() => localStorage.getItem(`ejn_${role}_phone`) || (role === 'manager' ? "(11) 98888-7777" : "(11) 99999-8888"));
  const [bio, setBio] = useState(() => localStorage.getItem(`ejn_${role}_bio`) || (role === 'manager' ? "Presidente do Instituto EJN. Focado em transformar o futuro de jovens através da educação empreendedora." : "Investidor social entusiasta de tecnologia e impacto comunitário. Apoiador ativo desde 2023."));
  const [linkedin, setLinkedin] = useState(() => localStorage.getItem(`ejn_${role}_linkedin`) || "");
  const [instagram, setInstagram] = useState(() => localStorage.getItem(`ejn_${role}_instagram`) || "");
  
  // Donor Preferences
  const [appearInWall, setAppearInWall] = useState(() => localStorage.getItem(`ejn_donor_wall`) === 'true');
  const [receiveReports, setReceiveReports] = useState(() => localStorage.getItem(`ejn_donor_reports`) !== 'false');

  const handleSave = () => {
    localStorage.setItem(`ejn_${role}_name`, name);
    localStorage.setItem(`ejn_${role}_email`, email);
    localStorage.setItem(`ejn_${role}_phone`, phone);
    localStorage.setItem(`ejn_${role}_bio`, bio);
    localStorage.setItem(`ejn_${role}_linkedin`, linkedin);
    localStorage.setItem(`ejn_${role}_instagram`, instagram);
    
    if (role === 'donor') {
      localStorage.setItem(`ejn_donor_wall`, String(appearInWall));
      localStorage.setItem(`ejn_donor_reports`, String(receiveReports));
    }
    
    onUpdateName(name);
    alert('Alterações salvas com sucesso!');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        onUpdatePhoto(base64);
        localStorage.setItem('ejn_profile_photo', base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const badgeText = totalInvested >= 5000 ? 'Padrinho Ouro' : 'Parceiro EJN';

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
              <h2 className="text-3xl font-black text-ejn-teal tracking-tight">{name}</h2>
              {role === 'donor' && (
                <div className="flex items-center justify-center md:justify-start gap-1 bg-ejn-gold/10 text-ejn-gold px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border border-ejn-gold/20">
                  <Award className="w-3 h-3" />
                  {badgeText}
                </div>
              )}
            </div>
            <p className="text-apple-text-secondary text-lg font-medium">
              {role === 'manager' ? "Presidente - Instituto EJN" : "Investidor Social de Impacto"}
            </p>
          </div>
          
          <p className="text-gray-600 leading-relaxed max-w-2xl text-sm md:text-base italic">
            "{bio}"
          </p>

          <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
            <a href={linkedin} className="flex items-center gap-2 text-ejn-teal hover:text-[#004d45] font-bold text-sm bg-apple-gray px-4 py-2 rounded-apple-lg transition-all">
              <Linkedin className="w-4 h-4" />
              LinkedIn
            </a>
            <a href={instagram} className="flex items-center gap-2 text-ejn-teal hover:text-[#004d45] font-bold text-sm bg-apple-gray px-4 py-2 rounded-apple-lg transition-all">
              <Instagram className="w-4 h-4" />
              Instagram
            </a>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Forms */}
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
                  <input value={name} onChange={e => setName(e.target.value)} type="text" className="w-full px-5 py-4 bg-apple-gray rounded-apple-lg border-transparent focus:bg-white focus:border-ejn-teal outline-none transition-all shadow-sm border" />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">E-mail</label>
                  <input value={email} onChange={e => setEmail(e.target.value)} type="email" className="w-full px-5 py-4 bg-apple-gray rounded-apple-lg border-transparent focus:bg-white focus:border-ejn-teal outline-none transition-all shadow-sm border" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">Telefone</label>
                  <input value={phone} onChange={e => setPhone(e.target.value)} type="text" className="w-full px-5 py-4 bg-apple-gray rounded-apple-lg border-transparent focus:bg-white focus:border-ejn-teal outline-none transition-all shadow-sm border" placeholder="(11) 00000-0000" />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">Cargo / Título</label>
                  <input disabled value={role === 'manager' ? "Presidente" : "Investidor"} type="text" className="w-full px-5 py-4 bg-apple-gray rounded-apple-lg border-transparent focus:bg-white outline-none transition-all shadow-sm border opacity-60" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">Mini Bio Profissional</label>
                <textarea value={bio} onChange={e => setBio(e.target.value)} className="w-full px-5 py-4 bg-apple-gray rounded-apple-lg border-transparent focus:bg-white focus:border-ejn-teal outline-none transition-all h-32 resize-none shadow-sm border" />
              </div>
            </div>
          </div>

          {/* Social Links Form */}
          <div className="bg-white p-8 md:p-10 rounded-apple-2xl shadow-sm border border-gray-50">
            <div className="flex items-center gap-3 mb-8">
              <Globe className="w-6 h-6 text-ejn-teal" />
              <h3 className="text-xl font-bold text-ejn-teal">Links de Conexão</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">URL LinkedIn</label>
                <input value={linkedin} onChange={e => setLinkedin(e.target.value)} type="text" className="w-full px-5 py-4 bg-apple-gray rounded-apple-lg border-transparent focus:bg-white focus:border-ejn-teal outline-none transition-all shadow-sm border" placeholder="https://linkedin.com/in/perfil" />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1">@ Instagram</label>
                <input value={instagram} onChange={e => setInstagram(e.target.value)} type="text" className="w-full px-5 py-4 bg-apple-gray rounded-apple-lg border-transparent focus:bg-white focus:border-ejn-teal outline-none transition-all shadow-sm border" placeholder="@perfil" />
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="bg-white p-8 md:p-10 rounded-apple-2xl shadow-sm border border-gray-50">
            <div className="flex items-center gap-3 mb-8">
              <Lock className="w-6 h-6 text-ejn-teal" />
              <h3 className="text-xl font-bold text-ejn-teal">Segurança da Conta</h3>
            </div>
            <button className="flex items-center gap-2 bg-apple-gray px-6 py-3 rounded-apple-lg font-bold text-ejn-teal hover:bg-gray-200 transition-all text-sm">
              Alterar Senha de Acesso
            </button>
          </div>
        </div>

        {/* Right Column: Summaries & Preferences */}
        <div className="space-y-8">
          {/* Summary Card */}
          <div className="bg-ejn-teal p-8 md:p-10 rounded-apple-2xl shadow-xl shadow-ejn-teal/20 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-700">
              {role === 'donor' ? <Heart className="w-24 h-24" /> : <ShieldCheck className="w-24 h-24" />}
            </div>
            <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
              {role === 'donor' ? <Heart className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
              Resumo do Perfil
            </h3>
            <div className="space-y-8">
              <div>
                <p className="text-teal-100/60 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">
                  {role === 'donor' ? 'Total Investido' : 'Patrimônio Gerenciado'}
                </p>
                <p className="text-3xl font-black">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(role === 'donor' ? totalInvested : 1500000)}
                </p>
              </div>
              <div>
                <p className="text-teal-100/60 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">
                  {role === 'donor' ? 'Meses de Apoio' : 'Tempo de Casa'}
                </p>
                <p className="text-3xl font-black">{role === 'donor' ? 14 : '4 anos'}</p>
              </div>
            </div>
          </div>

          {/* Donor Specific: Preferences */}
          {role === 'donor' && (
            <div className="bg-white p-8 rounded-apple-2xl shadow-sm border border-gray-50">
              <h3 className="text-lg font-bold text-ejn-teal mb-6">Preferências</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between group cursor-pointer" onClick={() => setAppearInWall(!appearInWall)}>
                  <div>
                    <p className="text-sm font-bold text-gray-800">Nome no Mural</p>
                    <p className="text-[10px] text-apple-text-secondary">Desejo aparecer no mural de doadores.</p>
                  </div>
                  <button className={`w-12 h-7 rounded-full transition-all relative flex items-center px-1 ${appearInWall ? 'bg-ejn-teal' : 'bg-gray-200'}`}>
                    <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-all ${appearInWall ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
                <div className="flex items-center justify-between group cursor-pointer" onClick={() => setReceiveReports(!receiveReports)}>
                  <div>
                    <p className="text-sm font-bold text-gray-800">Relatórios Automáticos</p>
                    <p className="text-[10px] text-apple-text-secondary">Receber balanço mensal por e-mail.</p>
                  </div>
                  <button className={`w-12 h-7 rounded-full transition-all relative flex items-center px-1 ${receiveReports ? 'bg-ejn-teal' : 'bg-gray-200'}`}>
                    <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-all ${receiveReports ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Social Proof */}
          <div className="bg-green-50 p-6 rounded-apple-xl border border-green-100 flex items-start gap-4">
            <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
            <div>
              <p className="text-sm font-bold text-green-800">Perfil Verificado</p>
              <p className="text-xs text-green-700/70">Seus dados e impacto são autenticados pelo Instituto Escola de Negócios.</p>
            </div>
          </div>

          <button 
            onClick={handleSave}
            className="w-full bg-ejn-teal text-white py-5 rounded-apple-xl font-black text-lg shadow-xl shadow-ejn-teal/20 hover:bg-[#004d45] transition-all transform active:scale-95 flex items-center justify-center gap-3"
          >
            <Save className="w-6 h-6" />
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
};