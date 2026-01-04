
import React from 'react';
import { 
  LayoutDashboard, 
  Coins, 
  Target, 
  FileText, 
  User,
  Heart,
  Users,
  Wallet,
  BarChart3,
  Settings,
  ChevronDown,
  Rocket,
  X
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
}

const donorNavItems: NavItem[] = [
  { id: 'overview', label: 'Visão Geral', icon: LayoutDashboard },
  { id: 'investments', label: 'Meus Investimentos', icon: Coins },
  { id: 'projects', label: 'Projetos', icon: Target },
  { id: 'transparency', label: 'Transparência', icon: FileText },
];

const managerNavItems: NavItem[] = [
  { id: 'overview', label: 'Visão Geral', icon: LayoutDashboard },
  { id: 'students', label: 'Gestão de Alunos', icon: Users },
  { id: 'project-management', label: 'Gestão de Projetos', icon: Rocket },
  { id: 'treasury', label: 'Tesouraria', icon: Wallet },
  { id: 'esg', label: 'Relatórios ESG', icon: BarChart3 },
  { id: 'settings', label: 'Configurações', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeId, onNavigate, role, onRoleSwitch, profilePhoto, isOpen, onClose }) => {
  const items = role === 'donor' ? donorNavItems : managerNavItems;

  return (
    <aside className={`fixed left-0 top-0 h-screen w-72 bg-white border-r border-gray-100 flex flex-col z-50 transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      {/* Brand Header */}
      <div className="p-8 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-ejn-teal rounded-xl flex items-center justify-center">
            <Heart className="text-white w-6 h-6" fill="white" />
          </div>
          <h1 className="text-2xl font-bold text-ejn-teal tracking-tight">
            Instituto <span className="font-extrabold">EJN</span>
          </h1>
        </div>
        <button 
          onClick={onClose}
          className="lg:hidden p-2 text-gray-400 hover:text-ejn-teal transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Role Switcher */}
      <div className="px-6 mb-8 mt-4">
        <button 
          onClick={() => onRoleSwitch(role === 'donor' ? 'manager' : 'donor')}
          className="w-full flex items-center justify-between px-4 py-3 bg-apple-gray rounded-apple-lg text-xs font-bold text-ejn-teal group hover:bg-ejn-teal/5 transition-colors"
        >
          <span className="uppercase tracking-widest">
            Visão: {role === 'donor' ? 'Doador' : 'Gestor'}
          </span>
          <ChevronDown className="w-3 h-3 text-gray-400 group-hover:text-ejn-teal" />
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-apple-lg transition-all duration-300 group ${
              activeId === item.id 
                ? 'bg-apple-gray text-ejn-teal shadow-sm' 
                : 'text-apple-text-secondary hover:bg-apple-gray/50 hover:text-ejn-teal'
            }`}
          >
            <item.icon className={`w-5 h-5 transition-colors ${
              activeId === item.id ? 'text-ejn-teal' : 'text-gray-400 group-hover:text-ejn-teal'
            }`} />
            <span className="font-medium text-[15px]">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Profile Footer */}
      <div className="p-6 mt-auto">
        <button 
          onClick={() => onNavigate('profile')}
          className={`w-full flex items-center gap-4 px-6 py-4 rounded-apple-lg transition-all duration-300 ${
            activeId === 'profile' 
              ? 'bg-apple-gray text-ejn-teal' 
              : 'text-apple-text-secondary hover:bg-apple-gray/50 hover:text-ejn-teal'
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-ejn-teal/10 flex items-center justify-center overflow-hidden shrink-0">
            {profilePhoto ? (
              <img src={profilePhoto} alt="User" className="w-full h-full object-cover" />
            ) : (
              <User className="w-5 h-5 text-ejn-teal" />
            )}
          </div>
          <span className="font-medium text-[15px] truncate">Meu Perfil</span>
        </button>
      </div>
    </aside>
  );
};
