
import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { ImpactHero } from './components/ImpactHero';
import { TransparencyCard } from './components/TransparencyCard';
import { FeaturedProject } from './components/FeaturedProject';
import { ManagerDashboard } from './components/ManagerDashboard';
import { StudentManagement } from './components/StudentManagement';
import { ProjectManagement } from './components/ProjectManagement';
import { ESGReports } from './components/ESGReports';
import { Treasury } from './components/Treasury';
import { Settings } from './components/Settings';
import { LandingPage } from './components/LandingPage';
import { LoginForm } from './components/LoginForm';
import { MyInvestments } from './components/MyInvestments';
import { Projects } from './components/Projects';
import { Transparency } from './components/Transparency';
import { Profile } from './components/Profile';
import { Heart, Menu, Loader2, CheckCircle2, CloudLightning } from 'lucide-react';
import { UserRole, Aluno, Transacao, Projeto } from './types';
import { supabase } from './supabase';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [role, setRole] = useState<UserRole>('donor');
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [userName, setUserName] = useState("Carregando...");

  const showSuccessFeedback = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const fetchData = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const [alRes, trRes, prRes, profRes] = await Promise.all([
        supabase.from('alunos').select('*').order('nome'),
        supabase.from('transacoes').select('*').order('created_at', { ascending: false }),
        supabase.from('projetos').select('*').order('created_at', { ascending: false }),
        user ? supabase.from('perfis').select('*').eq('id', user.id).single() : Promise.resolve({ data: null, error: null })
      ]);

      if (alRes.error) throw alRes.error;
      if (trRes.error) throw trRes.error;
      if (prRes.error) throw prRes.error;

      setAlunos(alRes.data || []);
      setTransacoes(trRes.data?.map(t => ({
        ...t,
        valor: Number(t.valor)
      })) || []);
      setProjetos(prRes.data?.map(p => ({
        ...p,
        meta_financeira: Number(p.meta_financeira)
      })) || []);

      if (profRes.data) {
        setUserName(profRes.data.nome || "Membro EJN");
        setProfilePhoto(profRes.data.foto_url);
        setRole(profRes.data.cargo as UserRole);
      }

    } catch (err) {
      console.error("Erro Supabase Sync:", err);
    } finally {
      setIsLoading(false);
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) fetchData();
  }, [isLoggedIn, fetchData]);

  const handleAddStudent = async (newStudent: Omit<Aluno, 'id' | 'status'>) => {
    setIsSyncing(true);
    try {
      const { error } = await supabase.from('alunos').insert([{ 
        nome: newStudent.nome,
        idade: newStudent.idade,
        bairro: newStudent.bairro,
        curso: newStudent.curso,
        observacoes: newStudent.observacoes,
        foto_url: newStudent.foto_url,
        status: 'active' 
      }]);
      if (error) throw error;
      showSuccessFeedback("Aluno cadastrado no Instituto EJN!");
      await fetchData(true);
    } catch (err) {
      alert("Erro ao salvar aluno.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleAddTransaction = async (newTr: Omit<Transacao, 'id'>) => {
    setIsSyncing(true);
    try {
      const { error } = await supabase.from('transacoes').insert([{
        descricao: newTr.descricao,
        valor: newTr.valor,
        tipo: newTr.tipo,
        categoria: newTr.categoria,
        projeto_id: newTr.projeto_id,
        status: newTr.status || 'confirmed',
        doador_email: newTr.doador_email,
        comprovante_url: newTr.comprovante_url,
        date: newTr.date
      }]);
      if (error) throw error;
      showSuccessFeedback("Transação financeira registrada!");
      await fetchData(true);
    } catch (err) {
      alert("Erro ao registrar transação.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleUpdateTransactionStatus = async (id: string, status: 'confirmed' | 'pending') => {
    setIsSyncing(true);
    try {
      const { error } = await supabase.from('transacoes').update({ status }).eq('id', id);
      if (error) throw error;
      showSuccessFeedback("Status atualizado!");
      await fetchData(true);
    } catch (err) {
      alert("Erro ao atualizar status.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleUpdateStudent = async (s: Aluno) => {
    setIsSyncing(true);
    await supabase.from('alunos').update(s).eq('id', s.id);
    showSuccessFeedback("Perfil do aluno atualizado.");
    fetchData(true);
  };

  const handleDeleteStudent = async (id: string) => {
    if (!confirm("Confirmar exclusão?")) return;
    setIsSyncing(true);
    await supabase.from('alunos').delete().eq('id', id);
    showSuccessFeedback("Registro removido.");
    fetchData(true);
  };

  const handleAddProject = async (p: Omit<Projeto, 'id'>) => {
    setIsSyncing(true);
    await supabase.from('projetos').insert([p]);
    showSuccessFeedback("Novo projeto lançado!");
    fetchData(true);
  };

  const handleDeleteProject = async (id: string) => {
    setIsSyncing(true);
    await supabase.from('projetos').delete().eq('id', id);
    showSuccessFeedback("Projeto removido.");
    fetchData(true);
  };

  const handleLogin = (userRole: UserRole) => {
    setRole(userRole);
    setIsLoggedIn(true);
    setShowLogin(false);
  };

  if (!isLoggedIn) {
    return (
      <>
        <LandingPage onStart={() => setShowLogin(true)} />
        {showLogin && <LoginForm onLogin={handleLogin} onClose={() => setShowLogin(false)} />}
      </>
    );
  }

  const impactStats = {
    impactCount: alunos.length,
    totalInvested: transacoes
      .filter(t => t.tipo === 'in' && t.status === 'confirmed')
      .reduce((acc, t) => acc + t.valor, 0)
  };

  return (
    <div className="min-h-screen flex font-sans text-gray-900 bg-apple-gray">
      {isLoading && (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-ejn-teal text-white py-2 flex items-center justify-center gap-2 shadow-md">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Sincronizando com Supabase EJN...</span>
        </div>
      )}

      <div className="fixed top-6 right-6 z-[100] flex flex-col items-end gap-3 pointer-events-none">
        {isSyncing && (
          <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-ejn-teal/10 flex items-center gap-2 animate-pulse">
            <CloudLightning className="w-4 h-4 text-ejn-teal" />
            <span className="text-[9px] font-black text-ejn-teal uppercase tracking-widest">Gravando...</span>
          </div>
        )}
        {successMessage && (
          <div className="bg-green-600 text-white px-6 py-3 rounded-apple-lg shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-right duration-300 pointer-events-auto">
            <CheckCircle2 className="w-5 h-5 text-ejn-gold" />
            <span className="text-xs font-bold">{successMessage}</span>
          </div>
        )}
      </div>

      <Sidebar 
        activeId={activeTab} 
        onNavigate={setActiveTab} 
        role={role}
        onRoleSwitch={setRole}
        profilePhoto={profilePhoto}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className={`flex-1 min-w-0 lg:ml-72 p-6 md:p-12 overflow-y-auto transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
        <header className="flex flex-col md:flex-row md:justify-between md:items-start mb-8 md:mb-12 gap-6">
          <div className="flex items-center justify-between w-full md:w-auto lg:hidden">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-ejn-teal bg-white rounded-apple-lg shadow-sm"><Menu className="w-6 h-6" /></button>
          </div>

          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-ejn-teal mb-2 tracking-tight">
              {role === 'donor' ? `Olá, ${userName}` : 'Painel Gestor'}
            </h1>
            <p className="text-apple-text-secondary text-base md:text-lg font-medium">
              {role === 'donor' ? "Seu impacto está transformando vidas." : "Monitoramento de impacto em tempo real."}
            </p>
          </div>
        </header>

        <div className="max-w-6xl mx-auto pb-20">
          {activeTab === 'overview' && role === 'donor' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <ImpactHero impactCount={impactStats.impactCount} totalInvested={impactStats.totalInvested} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <TransparencyCard transactions={transacoes} onNavigate={setActiveTab} />
                <FeaturedProject transactions={transacoes} />
              </div>
            </div>
          )}
          {activeTab === 'investments' && role === 'donor' && <MyInvestments transactions={transacoes} totalInvested={impactStats.totalInvested} />}
          {activeTab === 'projects' && role === 'donor' && (
            <Projects 
              projects={projetos} 
              transactions={transacoes} 
              onDonate={(pid, amt) => handleAddTransaction({ 
                date: new Date().toISOString(),
                descricao: 'Doação Realizada', 
                valor: amt, 
                tipo: 'in', 
                categoria: 'Doação', 
                projeto_id: pid, 
                status: 'pending' 
              })} 
            />
          )}
          {activeTab === 'transparency' && role === 'donor' && <Transparency transactions={transacoes} />}
          {activeTab === 'profile' && <Profile role={role} onUpdatePhoto={setProfilePhoto} onUpdateName={setUserName} currentPhoto={profilePhoto} totalInvested={impactStats.totalInvested} />}
          
          {activeTab === 'overview' && role === 'manager' && <ManagerDashboard students={alunos} transactions={transacoes} onAddStudent={handleAddStudent} onNavigate={setActiveTab} />}
          {activeTab === 'students' && role === 'manager' && <StudentManagement students={alunos} onAddStudent={handleAddStudent} onUpdateStudent={handleUpdateStudent} onDeleteStudent={handleDeleteStudent} />}
          {activeTab === 'project-management' && role === 'manager' && <ProjectManagement projects={projetos} onAddProject={handleAddProject} onDeleteProject={handleDeleteProject} />}
          {activeTab === 'treasury' && role === 'manager' && <Treasury transactions={transacoes} projects={projetos} onAddTransaction={handleAddTransaction} onUpdateStatus={handleUpdateTransactionStatus} onDeleteTransaction={async (id) => { await supabase.from('transacoes').delete().eq('id', id); fetchData(true); }} />}
          {activeTab === 'esg' && role === 'manager' && <ESGReports transactions={transacoes} studentCount={alunos.length} />}
          {activeTab === 'settings' && role === 'manager' && <Settings onUpdatePhoto={setProfilePhoto} currentPhoto={profilePhoto} />}
        </div>
      </main>
    </div>
  );
};

export default App;
