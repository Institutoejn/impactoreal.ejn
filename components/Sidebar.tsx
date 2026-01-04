import React from 'react';
import { 
  LayoutDashboard, 
  Coins, 
  Target, 
  FileText, 
  User,
  Users,
  Wallet,
  BarChart3,
  Settings,
  Rocket,
  X,
  LogOut
} from 'lucide-react';
import { NavItem, UserRole } from '../types';

interface SidebarProps {
  activeId: string;
  onNavigate: (id: string) => void;
  role: UserRole;
  onRoleSwitch: (role: UserRole) => void;
  profilePhoto: string | null;
  isOpen?: boolean;
  onClose?: () => void;
  onLogout: () => void;
}

const donorNavItems: NavItem[] = [
  { id: 'overview', label: 'Seu impacto', icon: LayoutDashboard },
  { id: 'investments', label: 'Meu legado', icon: Coins },
  { id: 'projects', label: 'Impulsionar', icon: Target },
  { id: 'transparency', label: 'Destino real', icon: FileText },
];

const managerNavItems: NavItem[] = [
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'students', label: 'Líderes', icon: Users },
  { id: 'project-management', label: 'Projetos', icon: Rocket },
  { id: 'treasury', label: 'Tesouraria', icon: Wallet },
  { id: 'esg', label: 'ESG', icon: BarChart3 },
  { id: 'settings', label: 'Ajustes', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeId, onNavigate, role, profilePhoto, isOpen, onClose, onLogout }) => {
  const items = role === 'gestor' ? managerNavItems : donorNavItems;

  return (
    <aside className={`fixed left-0 top-0 h-screen w-72 bg-white border-r border-gray-100 flex flex-col z-50 transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="p-8 pb-6 flex items-center justify-between">
        <button 
          onClick={() => onNavigate('overview')}
          className="flex items-center transition-opacity hover:opacity-80 text-left"
        >
          <span className="logo-text">
            <span className="text-ejn-gold">Impacto Real</span> <span className="text-gray-900">IEJN</span>
          </span>
        </button>
        <button 
          onClick={onClose}
          className="lg:hidden p-2 text-gray-400 hover:text-ejn-teal transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="px-8 py-2 mb-6">
        <div className="px-3 py-1.5 bg-ejn-teal/5 rounded-full inline-flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${role === 'gestor' ? 'bg-ejn-gold' : 'bg-green-500 animate-pulse'}`} />
          <span className="text-[9px] font-bold text-ejn-teal uppercase tracking-widest font-poppins">
            {role === 'gestor' ? 'Gestão' : 'Investidor'}
          </span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-3.5 px-6 py-3.5 rounded-apple-lg transition-all duration-300 group ${
              activeId === item.id 
                ? 'bg-apple-gray text-ejn-teal' 
                : 'text-apple-text-secondary hover:bg-apple-gray/50 hover:text-ejn-teal'
            }`}
          >
            <item.icon className={`w-4.5 h-4.5 transition-colors ${
              activeId === item.id ? 'text-ejn-teal' : 'text-gray-400 group-hover:text-ejn-teal'
            }`} />
            <span className="font-bold text-[13.6px] tracking-tight">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-6 mt-auto space-y-2 border-t border-gray-50">
        <button 
          onClick={() => onNavigate('profile')}
          className={`w-full flex items-center gap-3.5 px-6 py-3.5 rounded-apple-lg transition-all duration-300 ${
            activeId === 'profile' 
              ? 'bg-apple-gray text-ejn-teal' 
              : 'text-apple-text-secondary hover:bg-apple-gray/50 hover:text-ejn-teal'
          }`}
        >
          <div className="w-7 h-7 rounded-full bg-ejn-teal/10 flex items-center justify-center overflow-hidden shrink-0 border border-ejn-teal/5">
            {profilePhoto ? (
              <img src={profilePhoto} alt="User" className="w-full h-full object-cover" />
            ) : (
              <User className="w-4 h-4 text-ejn-teal" />
            )}
          </div>
          <span className="font-bold text-[13.6px] truncate">Perfil</span>
        </button>

        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3.5 px-6 py-3.5 text-red-500 rounded-apple-lg hover:bg-red-50 transition-all duration-300 group"
        >
          <LogOut className="w-4.5 h-4.5 group-hover:scale-110 transition-transform" />
          <span className="font-bold text-[13.6px]">Sair</span>
        </button>
      </div>
    </aside>
  );
};