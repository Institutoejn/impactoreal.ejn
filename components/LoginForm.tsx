import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, X, User, Loader2 } from 'lucide-react';
import { supabase } from '../supabase';

interface LoginFormProps {
  onClose: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: { display_name: formData.nome }
          }
        });

        if (error) throw error;

        if (data.user) {
          const { error: profileError } = await supabase.from('perfis').insert([{
            id: data.user.id,
            nome: formData.nome,
            email: formData.email,
            cargo: 'donor',
            bio: 'Novo investidor social do Instituto EJN.'
          }]);
          if (profileError) console.error("Erro ao criar perfil:", profileError);
        }
        
        alert("Cadastro realizado! Verifique seu e-mail ou faça login.");
        setIsSignUp(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw new Error("E-mail ou senha incorretos");
        onClose();
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Erro inesperado.");
    } finally {
      setIsLoading(false);
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
          <div className="mb-6">
            <span className="text-3xl font-bold tracking-tighter font-poppins">
              <span className="text-ejn-gold">Impacto Real</span> <span className="text-ejn-teal">IEJN</span>
            </span>
          </div>
          <p className="text-apple-text-secondary mt-2">
            {isSignUp ? "Crie sua conta de investidor social." : "Acesse sua conta para ver o impacto."}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-bold rounded-apple-lg text-center animate-in shake duration-300">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {isSignUp && (
              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-2 px-1">Nome Completo</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-ejn-teal transition-colors" />
                  <input 
                    type="text" 
                    required
                    value={formData.nome}
                    onChange={(e) => setFormData({...formData, nome: e.target.value})}
                    className="w-full pl-12 pr-4 py-4 bg-apple-gray rounded-apple-lg border-transparent focus:bg-white focus:border-ejn-teal focus:ring-0 outline-none transition-all shadow-sm border"
                    placeholder="Seu nome"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-2 px-1">E-mail</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-ejn-teal transition-colors" />
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
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
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full pl-12 pr-4 py-4 bg-apple-gray rounded-apple-lg border-transparent focus:bg-white focus:border-ejn-teal focus:ring-0 outline-none transition-all shadow-sm border"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-ejn-gold text-white py-4 rounded-apple-xl font-black text-lg hover:bg-[#D19900] transition-all transform active:scale-[0.98] shadow-lg shadow-ejn-gold/20 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Acessando plataforma...
              </>
            ) : (
              <>
                {isSignUp ? "Criar Conta" : "Entrar"}
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-8">
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm font-bold text-ejn-teal hover:underline"
          >
            {isSignUp ? "Já tem uma conta? Entrar" : "Não tem conta? Cadastrar-se"}
          </button>
        </div>

        <p className="text-center mt-10 text-[10px] text-apple-text-secondary leading-relaxed px-4 uppercase tracking-widest font-bold">
          Visão Gestor Mestre Restrita ao Presidente
        </p>
      </div>
    </div>
  );
};