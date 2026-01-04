
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
import { Bell, Search, Heart, User, Menu, X } from 'lucide-react';
import { UserRole, Student, Transaction, Project } from './types';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [role, setRole] = useState<UserRole>('donor');
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Global Profile State
  const [profilePhoto, setProfilePhoto] = useState<string | null>(() => localStorage.getItem('ejn_profile_photo'));
  const [userName, setUserName] = useState(() => localStorage.getItem('ejn_user_name') || "Carlos Eduardo");

  // Students Persistence
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('ejn_students');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'Alana Vieira', age: 20, neighborhood: 'Vila Nova', course: 'UX/UI Design', status: 'active', history: 'Destaque no módulo de Prototipação.' },
      { id: '2', name: 'Jefferson Santos', age: 19, neighborhood: 'Centro', course: 'Desenvolvimento Web', status: 'active', history: 'Foco em acessibilidade digital.' },
      { id: '3', name: 'Beatriz Lima', age: 21, neighborhood: 'Jardim América', course: 'Liderança Comunitária', status: 'pending', history: 'Iniciando fase de mentoria.' }
    ];
  });

  // Transactions Persistence
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('ejn_transactions');
    return saved ? JSON.parse(saved) : [
      { id: '1', date: '2024-10-20', description: 'Doação Corporativa Apple Inc.', category: 'Doação', type: 'in', amount: 50000.00, status: 'confirmed' },
      { id: '2', date: '2024-10-18', description: 'Licenças Softwares Adobe', category: 'Educação', type: 'out', amount: 2500.00, status: 'confirmed', proofImage: 'https://images.unsplash.com/photo-1554224155-1696413565d3?auto=format&fit=crop&q=80&w=800' },
      { id: '3', date: '2024-10-15', description: 'Material Didático Turma UX', category: 'Educação', type: 'out', amount: 1500.00, status: 'confirmed', proofImage: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800' },
      { id: '4', date: '2024-10-10', description: 'Manutenção Lab Tecnologia', category: 'Infraestrutura', type: 'out', amount: 3500.00, status: 'confirmed', proofImage: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=800' }
    ];
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('ejn_projects');
    return saved ? JSON.parse(saved) : [
      { id: 'proj_1', title: 'Capacitação de Líderes 2026', description: 'Formação intensiva em gestão social e tecnologia.', goal: 100000, status: 'active', image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800' },
      { id: 'proj_2', title: 'Infraestrutura Tecnológica EJN', description: 'Modernização do laboratório de inovação.', goal: 30000, status: 'active', image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800' }
    ];
  });

  // Sync Data to LocalStorage
  useEffect(() => { localStorage.setItem('ejn_students', JSON.stringify(students)); }, [students]);
  useEffect(() => { localStorage.setItem('ejn_transactions', JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => { localStorage.setItem('ejn_projects', JSON.stringify(projects)); }, [projects]);
  useEffect(() => { 
    if (profilePhoto) localStorage.setItem('ejn_profile_photo', profilePhoto);
    else localStorage.removeItem('ejn_profile_photo');
  }, [profilePhoto]);
  useEffect(() => { localStorage.setItem('ejn_user_name', userName); }, [userName]);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [activeTab]);

  const donor = {
    name: userName,
    impactCount: students.filter(s => s.status === 'active').length,
    totalInvested: transactions.filter(t => t.type === 'in' && t.status !== 'pending').reduce((acc, t) => acc + t.amount, 0)
  };

  const handleRoleSwitch = (newRole: UserRole) => {
    setRole(newRole);
    setActiveTab('overview');
    setUserName(newRole === 'manager' ? (localStorage.getItem('ejn_manager_name') || "Paulo Presidente") : (localStorage.getItem('ejn_donor_name') || "Carlos Eduardo"));
  };

  const handleAddStudent = (newStudent: Omit<Student, 'id' | 'status'>) => {
    const student: Student = { ...newStudent, id: Math.random().toString(36).substr(2, 9), status: 'active' };
    setStudents([student, ...students]);
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    setStudents(students.map(s => s.id === updatedStudent.id ? updatedStudent : s));
  };

  const handleDeleteStudent = (id: string) => {
    setStudents(students.filter(s => s.id !== id));
  };

  const handleAddTransaction = (newTransaction: Omit<Transaction, 'id'>) => {
    const transaction: Transaction = { ...newTransaction, id: Math.random().toString(36).substr(2, 9), status: newTransaction.status || 'confirmed' };
    setTransactions([transaction, ...transactions]);
  };

  const handleUpdateTransactionStatus = (id: string, status: 'confirmed' | 'pending') => {
    setTransactions(transactions.map(t => t.id === id ? { ...t, status } : t));
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
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

  const handleAddProject = (newProj: Omit<Project, 'id'>) => {
    const project: Project = { ...newProj, id: Math.random().toString(36).substr(2, 9) };
    setProjects([project, ...projects]);
  };

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  const handleLogin = (userRole: UserRole) => {
    setRole(userRole);
    setIsLoggedIn(true);
    setShowLogin(false);
    setActiveTab('overview');
    setUserName(userRole === 'manager' ? (localStorage.getItem('ejn_manager_name') || "Paulo Presidente") : (localStorage.getItem('ejn_donor_name') || "Carlos Eduardo"));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveTab('overview');
  };

  if (!isLoggedIn) {
    return (
      <>
        <LandingPage onStart={() => setShowLogin(true)} />
        {showLogin && <LoginForm onLogin={handleLogin} onClose={() => setShowLogin(false)} />}
      </>
    );
  }

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

      <main className={`flex-1 min-w-0 transition-all duration-300 lg:ml-72 p-6 md:p-12 overflow-y-auto`}>
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
            <button className="p-3 bg-white rounded-apple-lg text-gray-400 hover:text-ejn-teal shadow-sm transition-all relative">
              <Bell className="w-5 h-5" />
              {(role === 'manager' && transactions.some(t => t.status === 'pending')) && (
                <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              )}
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="text-right">
                <button onClick={handleLogout} className="text-xs font-bold text-red-400 hover:text-red-500 block mb-1 text-nowrap">Sair</button>
                <p className="text-sm font-bold text-gray-800 text-nowrap">
                  {role === 'donor' ? 'Doador Prata' : 'Gestor Master'}
                </p>
              </div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-md text-white overflow-hidden transition-all duration-500 shrink-0 ${role === 'donor' ? 'bg-ejn-gold' : 'bg-ejn-teal'}`}>
                {profilePhoto ? <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover animate-in fade-in" /> : (role === 'donor' ? 'CE' : 'PP')}
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
