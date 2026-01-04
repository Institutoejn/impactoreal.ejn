
import React, { useState, useRef } from 'react';
import { User, Building2, Bell, Camera, Save, X } from 'lucide-react';

interface SettingsProps {
  onUpdatePhoto: (base64: string) => void;
  currentPhoto: string | null;
}

export const Settings: React.FC<SettingsProps> = ({ onUpdatePhoto, currentPhoto }) => {
  const [notifications, setNotifications] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8 max-w-4xl">
      {/* Profile Section */}
      <div className="bg-white p-10 rounded-apple-2xl shadow-sm border border-gray-50">
        <div className="flex items-center gap-3 mb-10">
          <User className="w-6 h-6 text-ejn-teal" />
          <h3 className="text-2xl font-bold text-ejn-teal">Perfil do Gestor</h3>
        </div>
        
        <div className="flex flex-col md:flex-row gap-12">
          <div className="flex flex-col items-center gap-4">
            <div 
              className="relative group cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-32 h-32 bg-ejn-teal rounded-full flex items-center justify-center text-white text-4xl font-black shadow-xl overflow-hidden border-4 border-white transition-all group-hover:scale-[1.02]">
                {currentPhoto ? (
                  <img src={currentPhoto} alt="Profile" className="w-full h-full object-cover animate-in fade-in" />
                ) : (
                  'ADM'
                )}
              </div>
              <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-[1px]">
                <Camera className="text-white w-8 h-8 drop-shadow-lg" />
              </div>
              <button 
                type="button"
                className="absolute bottom-1 right-1 p-2.5 bg-white rounded-full shadow-lg border border-gray-100 text-ejn-teal hover:scale-110 transition-transform z-10"
              >
                <Camera className="w-5 h-5" />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange} 
              />
            </div>
            <div className="flex flex-col items-center">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Gestor Master</p>
              {currentPhoto && (
                <button 
                  onClick={(e) => { e.stopPropagation(); onUpdatePhoto(''); }}
                  className="mt-2 text-[10px] font-bold text-red-400 hover:text-red-500 transition-colors uppercase"
                >
                  Remover Foto
                </button>
              )}
            </div>
          </div>
          
          <div className="flex-1 space-y-6 font-sans">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-2 px-1">Nome de Exibição</label>
                <input type="text" className="w-full px-5 py-3 bg-apple-gray rounded-apple-lg border-transparent focus:bg-white focus:border-ejn-teal focus:ring-0 outline-none transition-all shadow-sm border" defaultValue="Admin EJN" />
              </div>
              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-2 px-1">E-mail de Acesso</label>
                <input type="email" className="w-full px-5 py-3 bg-apple-gray rounded-apple-lg border-transparent focus:bg-white focus:border-ejn-teal focus:ring-0 outline-none transition-all shadow-sm border" defaultValue="gestor@ejn.com.br" />
              </div>
            </div>
            <div>
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-2 px-1">Alterar Senha</label>
              <input type="password" placeholder="••••••••" className="w-full px-5 py-3 bg-apple-gray rounded-apple-lg border-transparent focus:bg-white focus:border-ejn-teal focus:ring-0 outline-none transition-all shadow-sm border" />
            </div>
          </div>
        </div>
      </div>

      {/* Institution Section */}
      <div className="bg-white p-10 rounded-apple-2xl shadow-sm border border-gray-50 font-sans">
        <div className="flex items-center gap-3 mb-10">
          <Building2 className="w-6 h-6 text-ejn-teal" />
          <h3 className="text-2xl font-bold text-ejn-teal">Dados do Instituto</h3>
        </div>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-2 px-1">Razão Social</label>
              <input type="text" className="w-full px-5 py-3 bg-apple-gray rounded-apple-lg border-transparent focus:bg-white focus:border-ejn-teal focus:ring-0 outline-none transition-all shadow-sm border" defaultValue="Instituto Impacto Real EJN" />
            </div>
            <div>
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-2 px-1">CNPJ</label>
              <input type="text" className="w-full px-5 py-3 bg-apple-gray rounded-apple-lg border-transparent focus:bg-white focus:border-ejn-teal focus:ring-0 outline-none transition-all shadow-sm border" defaultValue="00.000.000/0001-00" />
            </div>
          </div>
          <div>
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-2 px-1">Endereço Sede</label>
            <input type="text" className="w-full px-5 py-3 bg-apple-gray rounded-apple-lg border-transparent focus:bg-white focus:border-ejn-teal focus:ring-0 outline-none transition-all shadow-sm border" defaultValue="Av. da Tecnologia, 1000 - São Paulo, SP" />
          </div>
        </div>
      </div>

      {/* Preferences Section */}
      <div className="bg-white p-10 rounded-apple-2xl shadow-sm border border-gray-50 font-sans">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-6 h-6 text-ejn-teal" />
            <div>
              <h3 className="text-xl font-bold text-ejn-teal">Notificações</h3>
              <p className="text-apple-text-secondary text-sm">Avisar sobre novas doações e aprovações.</p>
            </div>
          </div>
          
          <button 
            onClick={() => setNotifications(!notifications)}
            className={`w-14 h-8 rounded-full transition-all relative flex items-center px-1 ${notifications ? 'bg-ejn-teal' : 'bg-gray-200'}`}
          >
            <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 ${notifications ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button className="flex items-center gap-2 bg-ejn-teal text-white px-10 py-5 rounded-apple-xl font-bold hover:bg-[#004d45] transition-all shadow-xl shadow-ejn-teal/20 transform active:scale-95">
          <Save className="w-5 h-5" />
          Salvar Alterações
        </button>
      </div>
    </div>
  );
};
