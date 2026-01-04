
import React, { useState, useEffect } from 'react';
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
import { Bell, Search, Heart, Menu, Loader2 } from 'lucide-react';
import { UserRole, Student, Transaction, Project } from './types';
import { supabase } from './supabase';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [role, setRole] = useState<UserRole>('donor');
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // App Data States
  const [students, setStudents] = useState<Student[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  
  // Profile Global States
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [userName, setUserName] = useState("Carregando...");

  // Initial Data Fetch from Supabase
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [
          { data: stData },
          { data: trData },
          { data: prData }
        ] = await Promise.all([
          supabase.from('students').select('*').order('name'),
          supabase.from('transactions').select('*').order('date', { ascending: false }),
          supabase.from('projects').select('*').order('status')
        ]);

        if (stData) setStudents(stData);
        if (trData) setTransactions(trData);
        if (prData) setProjects(prData);
      } catch (err) {
        console.error("Erro ao buscar dados do Supabase:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (isLoggedIn) fetchData();
  }, [isLoggedIn]);

  // Sync Profile on Login/Role Switch
  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', role)
        .single();

      if (data) {
        setUserName(data.name);
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

  const handleAddStudent = async (newStudent: Omit<Student, 'id' | 'status'>) => {
    const { data, error } = await supabase
      .from('students')
      .insert([{ ...newStudent, status: 'active' }])
      .select()
      .single();

    if (data) setStudents([data, ...students]);
  };

  const handleUpdateStudent = async (updatedStudent: Student) => {
    const { error } = await supabase
      .from('students')
      .update(updatedStudent)
      .eq('id', updatedStudent.id);

    if (!error) setStudents(students.map(s => s.id === updatedStudent.id ? updatedStudent : s));
  };

  const handleDeleteStudent = async (id: string) => {
    const { error } = await supabase.from('students').delete().eq('id', id);
    if (!error) setStudents(students.filter(s => s.id !== id));
  };

  const handleAddTransaction = async (newTransaction: Omit<Transaction, 'id'>) => {
    const { data, error } = await supabase
      .from('transactions')
      .insert([{ ...newTransaction, status: newTransaction.status || 'confirmed' }])
      .select()
      .single();

    if (data) setTransactions([data, ...transactions]);
  };

  const handleUpdateTransactionStatus = async (id: string, status: 'confirmed' | 'pending') => {
    const { error } = await supabase.from('transactions').update({ status }).eq('id', id);
    if (!error) setTransactions(transactions.map(t => t.id === id ? { ...t, status } : t));
  };

  const handleDeleteTransaction = async (id: string) => {
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (!error) setTransactions(transactions.filter(t => t.id !== id));
  };

  const handleDonate = (projectId: string, amount: number) => {
    const project = projects.find(p => p.id === projectId);
    handleAddTransaction({
      description: `Doação via Pix: ${project?.title || 'Projeto'}`,
      amount,
      type: 'in',
      category: 'Doação',
      projectId,
      date: new Date().toISOString().split('T')[0],
      status: 'pending'
    });
  };

  const handleAddProject = async (newProj: Omit<Project, 'id'>) => {
    const { data, error } = await supabase.from('projects').insert([newProj]).select().single();
    if (data) setProjects([data, ...projects]);
  };

  const handleDeleteProject = async (id: string) => {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (!error) setProjects(projects.filter(p => p.id !== id));
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

  const donor = {
    name: userName,
    impactCount: students.filter(s => s.status === 'active').length,
    totalInvested: transactions.filter(t => t.type === 'in' && t.status !== 'pending').reduce((acc, t) => acc + t.amount, 0)
  };

  return (
    <div className="min-h-screen flex font-sans text-gray-900 bg-apple-gray">
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
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
          <div className="flex flex-col items-center justify-center h-full text-ejn-teal">
            <Loader2 className="w-12 h-12 animate-spin mb-4" />
            <p className="font-bold uppercase tracking-widest text-xs">Sincronizando com Supabase...</p>
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
                    <p className="text-sm font-bold text-gray-800">{role === 'donor' ? 'Doador Prata' : 'Gestor Master'}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-md text-white overflow-hidden shrink-0 ${role === 'donor' ? 'bg-ejn-gold' : 'bg-ejn-teal'}`}>
                    {profilePhoto ? <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" /> : (role === 'donor' ? 'CE' : 'PP')}
                  </div>
                </div>
              </div>
            </header>

            <div className="max-w-6xl mx-auto">
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
            <span className="absolute right-16 md:right-20 bg-white text-ejn-teal px-4 py-2 rounded-xl text-sm font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Precisa de ajuda?</span>
          </button>
        )}
      </main>
    </div>
  );
};

export default App;
