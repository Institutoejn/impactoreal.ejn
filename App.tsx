
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
import { Menu, Loader2, CheckCircle2, CloudLightning, LogOut } from 'lucide-react';
import { UserRole, Aluno, Transacao, Projeto } from './types';
import { supabase } from './supabase';

const MASTER_MANAGER_EMAIL = "escolajovensdenegocios.oficial@gmail.com";

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [role, setRole] = useState<UserRole>('doador');
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [userName, setUserName] = useState("Membro EJN");

  const showSuccessFeedback = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  // Monitoramento de Sessão com verificação de Role Mestre
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        setRole(session.user.email === MASTER_MANAGER_EMAIL ? 'gestor' : 'doador');
      }
      setIsAppLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        setRole(session.user.email === MASTER_MANAGER_EMAIL ? 'gestor' : 'doador');
      } else {
        setRole('doador');
        setActiveTab('overview');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchData = useCallback(async (isSilent = false) => {
    if (!session?.user) return;
    if (!isSilent) setIsLoading(true);
    
    try {
      const [alRes, trRes, prRes, profRes] = await Promise.all([
        supabase.from('alunos').select('*').order('nome'),
        supabase.from('transacoes').select('*').order('created_at', { ascending: false }),
        supabase.from('projetos').select('*').order('created_at', { ascending: false }),
        supabase.from('perfis').select('*').eq('id', session.user.id).single()
      ]);

      if (alRes.data) setAlunos(alRes.data);
      if (trRes.data) setTransacoes(trRes.data.map(t => ({ ...t, valor: Number(t.valor) })));
      if (prRes.data) setProjetos(prRes.data.map(p => ({ ...p, meta_financeira: Number(p.meta_financeira) })));

      if (profRes.data) {
        setUserName(profRes.data.nome || "Membro EJN");
        setProfilePhoto(profRes.data.foto_url);
        // Respeitar o cargo do banco se não for o mestre
        if (session.user.email !== MASTER_MANAGER_EMAIL) {
          setRole(profRes.data.cargo || 'doador');
        }
      }

    } catch (err) {
      console.error("Erro Sync:", err);
    } finally {
      setIsLoading(false);
      setIsSyncing(false);
    }
  }, [session]);

  useEffect(() => {
    if (session) fetchData();
  }, [session, fetchData]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleAddStudent = async (newStudent: Omit<Aluno, 'id' | 'status'>) => {
    if (role !== 'gestor') {
      alert("Acesso negado: Área restrita ao Presidente.");
      return;
    }
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
      showSuccessFeedback("Aluno cadastrado com sucesso!");
      fetchData(true);
    } catch (err: any) {
      alert(`Erro técnico ao salvar Aluno: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleAddProject = async (p: Omit<Projeto, 'id'>) => {
    if (role !== 'gestor') return;
    setIsSyncing(true);
    try {
      const { error } = await supabase.from('projetos').insert([{
        nome: p.nome,
        descricao: p.descricao,
        meta_financeira: p.meta_financeira,
        status: p.status,
        capa_url: p.capa_url
      }]);
      
      if (error) throw error;
      showSuccessFeedback("Projeto social lançado!");
      fetchData(true);
    } catch (err: any) {
      alert(`Erro técnico ao salvar Projeto: ${err.message}`);
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
        date: newTr.date,
        comprovante_url: newTr.comprovante_url,
        doador_email: session.user.email
      }]);
      
      if (error) throw error;
      showSuccessFeedback("Movimentação registrada!");
      fetchData(true);
    } catch (err: any) {
      alert(`Erro técnico ao salvar Transação: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleUpdateTransactionStatus = async (id: string, status: 'confirmed' | 'pending') => {
    if (role !== 'gestor') return;
    setIsSyncing(true);
    const { error } = await supabase.from('transacoes').update({ status }).eq('id', id);
    if (error) alert(`Erro: ${error.message}`);
    else { showSuccessFeedback("Status validado!"); fetchData(true); }
  };

  if (isAppLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-ejn-teal animate-spin mx-auto mb-4" />
          <p className="text-sm font-bold text-ejn-teal uppercase tracking-widest">Iniciando plataforma...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <>
        <LandingPage onStart={() => setShowLogin(true)} />
        {showLogin && <LoginForm onClose={() => setShowLogin(false)} />}
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
          <span className="text-[10px] font-bold uppercase tracking-widest">Sincronizando com Supabase...</span>
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
        onRoleSwitch={() => {}}
        profilePhoto={profilePhoto}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onLogout={handleLogout}
      />

      <main className={`flex-1 min-w-0 lg:ml-72 p-6 md:p-12 overflow-y-auto transition-opacity duration-300 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
        <header className="flex flex-col md:flex-row md:justify-between md:items-start mb-8 md:mb-12 gap-6">
          <div className="flex items-center justify-between w-full md:w-auto lg:hidden">
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-ejn-teal bg-white rounded-apple-lg shadow-sm"><Menu className="w-6 h-6" /></button>
          </div>

          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold text-ejn-teal mb-2 tracking-tight">
              {role === 'gestor' ? 'Painel do Presidente' : `Olá, ${userName.split(' ')[0]}`}
            </h1>
            <p className="text-apple-text-secondary text-base md:text-lg font-medium">
              {role === 'gestor' ? "Gestão estratégica do Instituto EJN." : "Seu investimento social transformando vidas."}
            </p>
          </div>
          
          <button 
            onClick={handleLogout}
            className="hidden md:flex items-center gap-2 px-4 py-2 text-red-500 font-bold text-xs uppercase tracking-widest hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </header>

        <div className="max-w-6xl mx-auto pb-20">
          {activeTab === 'overview' && role === 'doador' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <ImpactHero impactCount={impactStats.impactCount} totalInvested={impactStats.totalInvested} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <TransparencyCard transactions={transacoes} onNavigate={setActiveTab} />
                <FeaturedProject transactions={transacoes} />
              </div>
            </div>
          )}
          {activeTab === 'investments' && role === 'doador' && <MyInvestments transactions={transacoes} totalInvested={impactStats.totalInvested} />}
          {activeTab === 'projects' && role === 'doador' && (
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
          {activeTab === 'transparency' && role === 'doador' && <Transparency transactions={transacoes} />}
          {activeTab === 'profile' && <Profile role={role} onUpdatePhoto={setProfilePhoto} onUpdateName={setUserName} currentPhoto={profilePhoto} totalInvested={impactStats.totalInvested} />}
          
          {activeTab === 'overview' && role === 'gestor' && <ManagerDashboard students={alunos} transactions={transacoes} onAddStudent={handleAddStudent} onNavigate={setActiveTab} />}
          {activeTab === 'students' && role === 'gestor' && <StudentManagement students={alunos} onAddStudent={handleAddStudent} onUpdateStudent={async (s) => { await supabase.from('alunos').update(s).eq('id', s.id); fetchData(true); }} onDeleteStudent={async (id) => { if(confirm("Deseja realmente remover este registro?")){ await supabase.from('alunos').delete().eq('id', id); fetchData(true); }}} />}
          {activeTab === 'project-management' && role === 'gestor' && <ProjectManagement projects={projetos} onAddProject={handleAddProject} onDeleteProject={async (id) => { if(confirm("Remover projeto?")) { await supabase.from('projetos').delete().eq('id', id); fetchData(true); }}} />}
          {activeTab === 'treasury' && role === 'gestor' && <Treasury transactions={transacoes} projects={projetos} onAddTransaction={handleAddTransaction} onUpdateStatus={handleUpdateTransactionStatus} onDeleteTransaction={async (id) => { if(confirm("Excluir transação?")){ await supabase.from('transacoes').delete().eq('id', id); fetchData(true); }}} />}
          {activeTab === 'esg' && role === 'gestor' && <ESGReports transactions={transacoes} studentCount={alunos.length} />}
          {activeTab === 'settings' && role === 'gestor' && <Settings onUpdatePhoto={setProfilePhoto} currentPhoto={profilePhoto} />}
        </div>
      </main>
    </div>
  );
};

export default App;
