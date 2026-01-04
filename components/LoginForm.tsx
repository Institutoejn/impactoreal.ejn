
import React, { useState } from 'react';
import { Heart, Mail, Lock, ArrowRight, X } from 'lucide-react';
import { UserRole } from '../types';

interface LoginFormProps {
  onLogin: (role: UserRole) => void;
  onClose: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'gestor@ejn.com.br') {
      onLogin('manager');
    } else {
      onLogin('donor');
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-white/60 backdrop-blur-xl" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-md p-10 rounded-apple-2xl shadow-2xl animate-in zoom-in-95 duration-500">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-gray-300 hover:text-gray-500 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-10">
          <div className="w-14 h-14 bg-ejn-teal rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-ejn-teal/20">
            <Heart className="text-white w-8 h-8" fill="white" />
          </div>
          <h2 className="text-3xl font-black text-ejn-teal tracking-tight">Impacto Real</h2>
          <p className="text-apple-text-secondary mt-2">Acesse sua conta para ver o impacto.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-2 px-1">E-mail</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-ejn-teal transition-colors" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-apple-gray rounded-apple-lg border-transparent focus:bg-white focus:border-ejn-teal focus:ring-0 outline-none transition-all shadow-sm border"
                  placeholder="ex: voce@email.com"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-2 px-1">Senha</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-ejn-teal transition-colors" />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-apple-gray rounded-apple-lg border-transparent focus:bg-white focus:border-ejn-teal focus:ring-0 outline-none transition-all shadow-sm border"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between px-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded text-ejn-teal focus:ring-ejn-teal" />
              <span className="text-xs text-apple-text-secondary">Lembrar-me</span>
            </label>
            <a href="#" className="text-xs font-bold text-ejn-teal hover:underline">Esqueceu a senha?</a>
          </div>

          <button 
            type="submit"
            className="w-full bg-ejn-gold text-white py-4 rounded-apple-xl font-black text-lg hover:bg-[#D19900] transition-all transform active:scale-[0.98] shadow-lg shadow-ejn-gold/20 flex items-center justify-center gap-2"
          >
            Entrar
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>

        <p className="text-center mt-10 text-xs text-apple-text-secondary leading-relaxed px-4">
          Para testar a visão do gestor, use: <br />
          <span className="font-bold text-ejn-teal">gestor@ejn.com.br</span>
        </p>
      </div>
    </div>
  );
};
