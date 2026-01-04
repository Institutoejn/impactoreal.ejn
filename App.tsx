
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
import { Bell, Search, Heart, Menu, Loader2, WifiOff, CheckCircle2, CloudLightning } from 'lucide-react';
import { UserRole, Student, Transaction, Project } from './types';
import { supabase } from './supabase';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [role, setRole] = useState<UserRole>('donor');
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // States de DevOps (Conectividade e Sincronização)
  const [isLoading, setIsLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // App Data States
  const [students, setStudents] = useState<Student[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  
  // Profile Global States
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [userName, setUserName] = useState("Carregando...");

  // Handler de Sucesso (QA Feedback)
  const showSuccessFeedback = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  // 1. Lógica de Leitura (Read Global)
  const fetchData = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsLoading(true);
    setConnectionError(false);
    
    try {
      // Busca paralela otimizada
      const [stRes, trRes, prRes] = await Promise.all([
        supabase.from('students').select('*').order('name'),
        supabase.from('transactions').select('*').order('date', { ascending: false }),
        supabase.from('projects').select('*').order('created_at', { ascending: false })
      ]);

      if (stRes.error) throw stRes.error;
      if (trRes.error) throw trRes.error;
      if (prRes.error) throw prRes.error;

      // Sincronização de Alunos
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

      // Sincronização de Transações (Tesouraria)
      const mappedTransactions: Transaction[] = trRes.data.map(t => ({
        id: t.id,
        date: t.date,
        description: t.description,
        category: t.category,
        type: t.type,
        amount: Number(t.amount),
        projectId: t.project_id,
        status: t.status,
        proofImage: t.proof_image
      }));
      setTransactions(mappedTransactions);

      // Sincronização de Projetos
      setProjects(prRes.data.map(p => ({
        id: p.id,
        title: p.title,
        description: p.description,
        goal: Number(p.goal),
        status: p.status,
        image: p.image
      })));

      console.log("%c✓ Sincronização Real-Time Concluída", "color: #005F55; font-weight: bold;");

    } catch (err) {
      console.error("Falha na comunicação com Supabase:", err);
      setConnectionError(true);
    } finally {
      setIsLoading(false);
      setIsSyncing(false);
    }
  }, []);

  // 2. Inicialização
  useEffect(() => {
    if (isLoggedIn) fetchData();
  }, [isLoggedIn, fetchData]);

  // 3. Handlers de Escrita (Create/Update com Instant Update)
  
  const handleAddStudent = async (newStudent: Omit<Student, 'id' | 'status'>) => {
    setIsSyncing(true);
    try {
      const { error } = await supabase.from('students').insert([{ 
        name: newStudent.name,
        age: newStudent.age,
        neighborhood: newStudent.neighborhood,
        course: newStudent.course,
        history: newStudent.history,
        image: newStudent.image,
        status: 'active' 
      }]);

      if (error) throw error;
      showSuccessFeedback("Dados salvos com sucesso no Instituto EJN!");
      await fetchData(true); // Sync silencioso para atualizar lista
    } catch (err) {
      alert("Falha ao salvar no servidor. Verifique as chaves do Supabase.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleAddTransaction = async (newTr: Omit<Transaction, 'id'>) => {
    setIsSyncing(true);
    try {
      const { error } = await supabase.from('transactions').insert([{
        description: newTr.description,
        amount: newTr.amount,
        type: newTr.type,
        category: newTr.category,
        project_id: newTr.projectId,
        date: newTr.date,
        status: newTr.status || 'confirmed',
        proof_image: newTr.proofImage
      }]);

      if (error) throw error;
      showSuccessFeedback("Movimentação financeira registrada!");
      await fetchData(true); // Atualiza barra de progresso instantaneamente
    } catch (err) {
      alert("Erro ao processar transação financeira.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleUpdateTransactionStatus = async (id: string, status: 'confirmed' | 'pending') => {
    setIsSyncing(true);
    try {
      const { error } = await supabase.from('transactions').update({ status }).eq('id', id);
      if (error) throw error;
      showSuccessFeedback("Status de doação validado!");
      await fetchData(true);
    } catch (err) {
      alert("Erro ao validar doação.");
    } finally {
      setIsSyncing(false);
    }
  };

  // Demais handlers simplificados para manter performance...
  const handleUpdateStudent = async (s: Student) => {
    setIsSyncing(true);
    await supabase.from('students').update(s).eq('id', s.id);
    showSuccessFeedback("Perfil do aluno atualizado.");
    fetchData(true);
  };

  const handleDeleteStudent = async (id: string) => {
    if (!confirm("Confirmar exclusão no Supabase?")) return;
    setIsSyncing(true);
    await supabase.from('students').delete().eq('id', id);
    showSuccessFeedback("Registro removido.");
    fetchData(true);
  };

  const handleAddProject = async (p: Omit<Project, 'id'>) => {
    setIsSyncing(true);
    await supabase.from('projects').insert([p]);
    showSuccessFeedback("Novo projeto lançado com sucesso!");
    fetchData(true);
  };

  const handleDeleteProject = async (id: string) => {
    setIsSyncing(true);
    await supabase.from('projects').delete().eq('id', id);
    showSuccessFeedback("Projeto removido do portfólio.");
    fetchData(true);
  };

  const handleLogin = (userRole: UserRole) => {
    setRole(userRole);
    setIsLoggedIn(true);
    setShowLogin(false);
  };

  // Fix: Definition for handleRoleSwitch used in the Sidebar component.
  const handleRoleSwitch = (newRole: UserRole) => {
    setRole(newRole);
    setActiveTab('overview'); // Ensure consistency when switching between Doador and Gestor views
  };

  // View de Carregamento / Erro
  if (!isLoggedIn) {
    return (
      <>
        <LandingPage onStart={() => setShowLogin(true)} />
        {showLogin && <LoginForm onLogin={handleLogin} onClose={() => setShowLogin(false)} />}
      </>
    );
  }

  // Métricas do Doador (Baseadas em Select Global)
  const donor = {
    name: userName,
    impactCount: students.length,
    totalInvested: transactions
      .filter(t => t.type === 'in' && t.status === 'confirmed')
      .reduce((acc, t) => acc + t.amount, 0)
  };

  return (
    <div className="min-h-screen flex font-sans text-gray-900 bg-apple-gray">
      {/* Banner de Status de Conexão (DevOps Feedback) */}
      {isLoading && (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-ejn-teal text-white py-2 flex items-center justify-center gap-2 animate-in slide-in-from-top duration-300">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Conectando ao banco de dados do Instituto EJN...</span>
        </div>
      )}

      {/* Alertas de Sucesso (QA Feedback) */}
      <div className="fixed top-6 right-6 z-[100] flex flex-col items-end gap-3 pointer-events-none">
        {isSyncing && (
          <div className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-ejn-teal/10 flex items-center gap-2 animate-pulse">
            <CloudLightning className="w-4 h-4 text-ejn-teal" />
            <span className="text-[9px] font-black text-ejn-teal uppercase tracking-widest">Sincronizando...</span>
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
        onRoleSwitch={handleRoleSwitch}
        profilePhoto={profilePhoto}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className={`flex-1 min-w-0 lg:ml-72 p-6 md:p-12 overflow-y-auto ${isLoading ? 'opacity-40 pointer-events-none' : 'opacity-100'} transition-opacity duration-500`}>
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
              {role === 'donor' ? `Olá, ${userName}` : 'Painel de Gestão'}
            </h1>
            <p className="text-apple-text-secondary text-base md:text-lg font-medium">
              {role === 'donor' ? "Seu impacto está transformando vidas." : "Gerencie o impacto e a transparência em tempo real."}
            </p>
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
          {activeTab === 'projects' && role === 'donor' && <Projects projects={projects} transactions={transactions} onDonate={(pid, amt) => handleAddTransaction({ description: 'Doação Realizada', amount: amt, type: 'in', category: 'Doação', projectId: pid, date: new Date().toISOString().split('T')[0], status: 'pending' })} />}
          {activeTab === 'transparency' && role === 'donor' && <Transparency transactions={transactions} />}
          {activeTab === 'profile' && <Profile role={role} onUpdatePhoto={setProfilePhoto} onUpdateName={setUserName} currentPhoto={profilePhoto} totalInvested={donor.totalInvested} />}
          
          {activeTab === 'overview' && role === 'manager' && <ManagerDashboard students={students} transactions={transactions} onAddStudent={handleAddStudent} onNavigate={setActiveTab} />}
          {activeTab === 'students' && role === 'manager' && <StudentManagement students={students} onAddStudent={handleAddStudent} onUpdateStudent={handleUpdateStudent} onDeleteStudent={handleDeleteStudent} />}
          {activeTab === 'project-management' && role === 'manager' && <ProjectManagement projects={projects} onAddProject={handleAddProject} onDeleteProject={handleDeleteProject} />}
          {activeTab === 'treasury' && role === 'manager' && <Treasury transactions={transactions} projects={projects} onAddTransaction={handleAddTransaction} onUpdateStatus={handleUpdateTransactionStatus} onDeleteTransaction={async (id) => { await supabase.from('transactions').delete().eq('id', id); fetchData(true); }} />}
          {activeTab === 'esg' && role === 'manager' && <ESGReports transactions={transactions} studentCount={students.length} />}
          {activeTab === 'settings' && role === 'manager' && <Settings onUpdatePhoto={setProfilePhoto} currentPhoto={profilePhoto} />}
        </div>

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
