
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
import { Bell, Search, Heart, Menu, Loader2, WifiOff } from 'lucide-react';
import { UserRole, Student, Transaction, Project } from './types';
import { supabase } from './supabase';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [role, setRole] = useState<UserRole>('donor');
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // States de Carregamento e Erro
  const [isLoading, setIsLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  
  // App Data States
  const [students, setStudents] = useState<Student[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  
  // Profile Global States
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [userName, setUserName] = useState("Carregando...");

  // 1. Verificação de Conexão e Busca de Dados
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setConnectionError(false);
    try {
      // Validar conexão básica
      const { error: connCheck } = await supabase.from('projects').select('id').limit(1);
      if (connCheck) throw connCheck;

      const [stRes, trRes, prRes] = await Promise.all([
        supabase.from('students').select('*').order('name'),
        supabase.from('transactions').select('*').order('date', { ascending: false }),
        supabase.from('projects').select('*').order('created_at', { ascending: false })
      ]);

      if (stRes.error) throw stRes.error;
      if (trRes.error) throw trRes.error;
      if (prRes.error) throw prRes.error;

      // Mapeamento de Snake Case para Camel Case
      setStudents(stRes.data.map(s => ({
        id: s.id,
        name: s.name,
        age: s.age,
        neighborhood: s.neighborhood,
        course: s.course,
        status: s.status,
        history: s.history,
        image: s.image
      })));

      setTransactions(trRes.data.map(t => ({
        id: t.id,
        date: t.date,
        description: t.description,
        category: t.category,
        type: t.type,
        amount: t.amount,
        projectId: t.project_id,
        status: t.status,
        proofImage: t.proof_image
      })));

      setProjects(prRes.data.map(p => ({
        id: p.id,
        title: p.title,
        description: p.description,
        goal: p.goal,
        status: p.status,
        image: p.image
      })));

    } catch (err) {
      console.error("Erro de sincronização Supabase:", err);
      setConnectionError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) fetchData();
  }, [isLoggedIn, fetchData]);

  // 2. Sync Profile
  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', role)
        .maybeSingle();

      if (data) {
        setUserName(data.name || (role === 'manager' ? "Paulo Presidente" : "Carlos Eduardo"));
        setProfilePhoto(data.profile_photo);
      } else {
        setUserName(role === 'manager' ? "Paulo Presidente" : "Carlos Eduardo");
      }
    };

    if (isLoggedIn) fetchProfile();
  }, [isLoggedIn, role]);

  const handleRoleSwitch = (newRole: UserRole) => {
    setRole(newRole);
    setActiveTab('overview');
  };

  // 3. Handlers de Dados (Supabase CRUD)
  
  const handleAddStudent = async (newStudent: Omit<Student, 'id' | 'status'>) => {
    setIsSyncing(true);
    try {
      const { data, error } = await supabase
        .from('students')
        .insert([{ 
          name: newStudent.name,
          age: newStudent.age,
          neighborhood: newStudent.neighborhood,
          course: newStudent.course,
          history: newStudent.history,
          image: newStudent.image,
          status: 'active' 
        }])
        .select()
        .single();

      if (error) throw error;
      fetchData(); // Atualiza lista
    } catch (err) {
      alert("Erro ao salvar aluno. Verifique sua conexão.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleUpdateStudent = async (updatedStudent: Student) => {
    setIsSyncing(true);
    try {
      const { error } = await supabase
        .from('students')
        .update({
          name: updatedStudent.name,
          age: updatedStudent.age,
          neighborhood: updatedStudent.neighborhood,
          course: updatedStudent.course,
          history: updatedStudent.history,
          image: updatedStudent.image,
          status: updatedStudent.status
        })
        .eq('id', updatedStudent.id);

      if (error) throw error;
      fetchData();
    } catch (err) {
      alert("Erro ao atualizar aluno.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDeleteStudent = async (id: string) => {
    if (!window.confirm("Deseja realmente excluir este registro?")) return;
    setIsSyncing(true);
    try {
      const { error } = await supabase.from('students').delete().eq('id', id);
      if (error) throw error;
      setStudents(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      alert("Não foi possível excluir o aluno.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleAddTransaction = async (newTr: Omit<Transaction, 'id'>) => {
    setIsSyncing(true);
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert([{
          description: newTr.description,
          amount: newTr.amount,
          type: newTr.type,
          category: newTr.category,
          project_id: newTr.projectId,
          date: newTr.date,
          status: newTr.status || 'confirmed',
          proof_image: newTr.proofImage
        }])
        .select()
        .single();

      if (error) throw error;
      fetchData(); // Atualiza para recalcular progresso dos projetos
    } catch (err) {
      alert("Erro ao registrar transação financeira.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleUpdateTransactionStatus = async (id: string, status: 'confirmed' | 'pending') => {
    setIsSyncing(true);
    try {
      const { error } = await supabase.from('transactions').update({ status }).eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (err) {
      alert("Erro ao alterar status da transação.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    setIsSyncing(true);
    try {
      const { error } = await supabase.from('transactions').delete().eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (err) {
      alert("Erro ao excluir transação.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleAddProject = async (newProj: Omit<Project, 'id'>) => {
    setIsSyncing(true);
    try {
      const { error } = await supabase.from('projects').insert([{
        title: newProj.title,
        description: newProj.description,
        goal: newProj.goal,
        status: newProj.status,
        image: newProj.image
      }]);
      if (error) throw error;
      fetchData();
    } catch (err) {
      alert("Erro ao criar projeto.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm("Isso afetará os registros financeiros vinculados. Confirmar?")) return;
    setIsSyncing(true);
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (err) {
      alert("Erro ao excluir projeto.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDonate = (projectId: string, amount: number) => {
    const project = projects.find(p => p.id === projectId);
    handleAddTransaction({
      description: `Investimento: ${project?.title || 'Projeto Impacto'}`,
      amount,
      type: 'in',
      category: 'Doação',
      projectId,
      date: new Date().toISOString().split('T')[0],
      status: 'pending'
    });
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

  if (connectionError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-apple-gray p-8 text-center">
        <div className="bg-white p-12 rounded-apple-2xl shadow-xl max-w-md">
          <WifiOff className="w-16 h-16 text-red-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-ejn-teal mb-4">Falha na Sincronização</h2>
          <p className="text-apple-text-secondary mb-8">Não conseguimos conectar ao banco de dados do Instituto. Verifique sua conexão com a internet.</p>
          <button onClick={fetchData} className="w-full bg-ejn-teal text-white py-4 rounded-apple-lg font-bold hover:bg-[#004d45] transition-all">Tentar Novamente</button>
        </div>
      </div>
    );
  }

  const donor = {
    name: userName,
    impactCount: students.length,
    totalInvested: transactions
      .filter(t => t.type === 'in' && t.status === 'confirmed')
      .reduce((acc, t) => acc + t.amount, 0)
  };

  return (
    <div className="min-h-screen flex font-sans text-gray-900 bg-apple-gray">
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {isSyncing && (
        <div className="fixed top-6 right-6 z-[100] bg-white px-4 py-2 rounded-full shadow-lg border border-ejn-teal/10 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <Loader2 className="w-4 h-4 text-ejn-teal animate-spin" />
          <span className="text-[10px] font-black text-ejn-teal uppercase tracking-widest">Sincronizando...</span>
        </div>
      )}

      <Sidebar 
        activeId={activeTab} 
        onNavigate={setActiveTab} 
        role={role}
        onRoleSwitch={handleRoleSwitch}
        profilePhoto={profilePhoto}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className={`flex-1 min-w-0 lg:ml-72 p-6 md:p-12 overflow-y-auto`}>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-ejn-teal">
            <Loader2 className="w-12 h-12 animate-spin mb-4" />
            <p className="font-black uppercase tracking-widest text-[10px]">Acessando Servidores EJN...</p>
          </div>
        ) : (
          <>
            <header className="flex flex-col md:flex-row md:justify-between md:items-start mb-8 md:mb-12 gap-6">
              <div className="flex items-center justify-between w-full md:w-auto">
                <button onClick={() => setIsSidebarOpen(true)} className="p-2 -ml-2 text-ejn-teal lg:hidden bg-white rounded-apple-lg shadow-sm">
                  <Menu className="w-6 h-6" />
                </button>
                <div className="md:hidden flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-md text-white overflow-hidden ${role === 'donor' ? 'bg-ejn-gold' : 'bg-ejn-teal'}`}>
                    {profilePhoto ? <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" /> : (role === 'donor' ? 'CE' : 'PP')}
                  </div>
                </div>
              </div>

              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-ejn-teal mb-2 tracking-tight">
                  {role === 'donor' 
                    ? activeTab === 'overview' ? `Olá, ${userName}`
                      : activeTab === 'investments' ? 'Meus Investimentos'
                      : activeTab === 'projects' ? 'Projetos de Impacto'
                      : activeTab === 'transparency' ? 'Transparência EJN'
                      : `Olá, ${userName}`
                    : activeTab === 'students' ? 'Gestão de Alunos' 
                    : activeTab === 'project-management' ? 'Gestão de Projetos'
                    : activeTab === 'treasury' ? 'Tesouraria'
                    : activeTab === 'esg' ? 'Relatórios ESG' 
                    : activeTab === 'settings' ? 'Configurações'
                    : 'Painel de Gestão'}
                </h1>
                <p className="text-apple-text-secondary text-base md:text-lg font-medium">
                  {role === 'donor' ? "Seu impacto está transformando vidas." : "Gerencie o impacto e a transparência do Instituto."}
                </p>
              </div>
              
              <div className="hidden md:flex items-center gap-4">
                <button className="p-3 bg-white rounded-apple-lg text-gray-400 hover:text-ejn-teal shadow-sm transition-all">
                  <Search className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                  <div className="text-right">
                    <button onClick={() => setIsLoggedIn(false)} className="text-xs font-bold text-red-400 hover:text-red-500 block mb-1">Sair</button>
                    <p className="text-sm font-bold text-gray-800">{role === 'donor' ? 'Investidor EJN' : 'Gestor Master'}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-md text-white overflow-hidden shrink-0 ${role === 'donor' ? 'bg-ejn-gold' : 'bg-ejn-teal'}`}>
                    {profilePhoto ? <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" /> : (role === 'donor' ? 'CE' : 'PP')}
                  </div>
                </div>
              </div>
            </header>

            <div className="max-w-6xl mx-auto pb-20">
              {activeTab === 'overview' && role === 'donor' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <ImpactHero impactCount={donor.impactCount} totalInvested={donor.totalInvested} />
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                    <TransparencyCard transactions={transactions} onNavigate={setActiveTab} />
                    <FeaturedProject transactions={transactions} />
                  </div>
                </div>
              )}
              {activeTab === 'investments' && role === 'donor' && <MyInvestments transactions={transactions} totalInvested={donor.totalInvested} />}
              {activeTab === 'projects' && role === 'donor' && <Projects projects={projects} transactions={transactions} onDonate={handleDonate} />}
              {activeTab === 'transparency' && role === 'donor' && <Transparency transactions={transactions} />}
              {activeTab === 'profile' && <Profile role={role} onUpdatePhoto={setProfilePhoto} onUpdateName={setUserName} currentPhoto={profilePhoto} totalInvested={donor.totalInvested} />}
              
              {activeTab === 'overview' && role === 'manager' && <ManagerDashboard students={students} transactions={transactions} onAddStudent={handleAddStudent} onNavigate={setActiveTab} />}
              {activeTab === 'students' && role === 'manager' && <StudentManagement students={students} onAddStudent={handleAddStudent} onUpdateStudent={handleUpdateStudent} onDeleteStudent={handleDeleteStudent} />}
              {activeTab === 'project-management' && role === 'manager' && <ProjectManagement projects={projects} onAddProject={handleAddProject} onDeleteProject={handleDeleteProject} />}
              {activeTab === 'treasury' && role === 'manager' && <Treasury transactions={transactions} projects={projects} onAddTransaction={handleAddTransaction} onUpdateStatus={handleUpdateTransactionStatus} onDeleteTransaction={handleDeleteTransaction} />}
              {activeTab === 'esg' && role === 'manager' && <ESGReports transactions={transactions} studentCount={students.length} />}
              {activeTab === 'settings' && role === 'manager' && <Settings onUpdatePhoto={setProfilePhoto} currentPhoto={profilePhoto} />}
            </div>
          </>
        )}

        {role === 'donor' && (
          <button className="fixed bottom-6 right-6 md:bottom-10 md:right-10 w-14 h-14 md:w-16 md:h-16 bg-ejn-teal text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all group z-30">
            <Heart className="w-6 h-6 group-hover:fill-white" />
          </button>
        )}
      </main>
    </div>
  );
};

export default App;
