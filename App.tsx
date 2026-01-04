
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

  const syncMasterRole = async (userId: string) => {
    try {
      // Força a atualização do cargo no banco para garantir que o RLS funcione
      const { data, error } = await supabase.from('perfis').select('cargo').eq('id', userId).single();
      if (error && error.code === 'PGRST116') {
        // Se o perfil não existe, cria como gestor (já que é o e-mail mestre)
        await supabase.from('perfis').insert([{ 
          id: userId, 
          email: MASTER_MANAGER_EMAIL, 
          cargo: 'gestor', 
          nome: 'Presidente EJN' 
        }]);
      } else if (data && data.cargo !== 'gestor') {
        await supabase.from('perfis').update({ cargo: 'gestor' }).eq('id', userId);
      }
    } catch (e) {
      console.error("Erro Crítico no Sync do Cargo:", e);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        const isMaster = session.user.email?.toLowerCase() === MASTER_MANAGER_EMAIL.toLowerCase();
        setRole(isMaster ? 'gestor' : 'doador');
        if (isMaster) syncMasterRole(session.user.id);
      }
      setIsAppLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        const isMaster = session.user.email?.toLowerCase() === MASTER_MANAGER_EMAIL.toLowerCase();
        setRole(isMaster ? 'gestor' : 'doador');
        if (isMaster) syncMasterRole(session.user.id);
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
        if (session.user.email?.toLowerCase() !== MASTER_MANAGER_EMAIL.toLowerCase()) {
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
    if (role !== 'gestor') return;
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
      showSuccessFeedback("Aluno cadastrado!");
      fetchData(true);
    } catch (err: any) {
      alert(`Erro Supabase: ${err.message}`);
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
      alert(`Erro Supabase: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleAddTransaction = async (newTr: Omit<Transacao, 'id' | 'created_at'>): Promise<boolean> => {
    setIsSyncing(true);
    try {
      const { error } = await supabase.from('transacoes').insert([{
        descricao: newTr.descricao,
        valor: newTr.valor,
        tipo: newTr.tipo,
        categoria: newTr.categoria,
        projeto_id: newTr.projeto_id,
        status: newTr.status || 'confirmed',
        comprovante_url: newTr.comprovante_url,
        doador_email: session.user.email
      }]);
      
      if (error) {
        if (error.code === '42501') {
          const userType = role === 'gestor' ? 'Presidente (Gestor)' : 'Doador';
          throw new Error(`Permissão Negada: O banco de dados bloqueou a gravação para o perfil '${userType}'. Isso ocorre quando o SQL de segurança (RLS) no Supabase não reconhece seu cargo ou está incompleto. Verifique o painel SQL do Supabase.`);
        }
        throw error;
      }
      showSuccessFeedback("Fluxo registrado com sucesso!");
      fetchData(true);
      return true;
    } catch (err: any) {
      alert(`Erro Crítico de Segurança: ${err.message}`);
      return false;
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

  if (isAppLoading) return <div className="min-h-screen bg-white flex items-center justify-center"><Loader2 className="w-12 h-12 text-ejn-teal animate-spin" /></div>;

  if (!session) return <><LandingPage onStart={() => setShowLogin(true)} />{showLogin && <LoginForm onClose={() => setShowLogin(false)} />}</>;

  const impactStats = {
    impactCount: alunos.length,
    totalInvested: transacoes.filter(t => t.tipo === 'in' && t.status === 'confirmed').reduce((acc, t) => acc + t.valor, 0)
  };

  return (
    <div className="min-h-screen flex font-sans text-gray-900 bg-apple-gray">
      <Sidebar activeId={activeTab} onNavigate={setActiveTab} role={role} onRoleSwitch={() => {}} profilePhoto={profilePhoto} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} onLogout={handleLogout} />

      <main className="flex-1 min-w-0 lg:ml-72 p-6 md:p-12 overflow-y-auto">
        <header className="flex flex-col md:flex-row md:justify-between md:items-start mb-8 gap-6">
          <div className="lg:hidden"><button onClick={() => setIsSidebarOpen(true)} className="p-2 text-ejn-teal bg-white rounded-lg shadow-sm"><Menu /></button></div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-ejn-teal">{role === 'gestor' ? 'Painel do Presidente' : `Olá, ${userName.split(' ')[0]}`}</h1>
            <p className="text-apple-text-secondary">{role === 'gestor' ? "Gestão estratégica do Instituto EJN." : "Seu investimento social transformando vidas."}</p>
          </div>
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
          {activeTab === 'projects' && role === 'doador' && <Projects projects={projetos} transactions={transacoes} onDonate={(pid, amt) => handleAddTransaction({ descricao: 'Doação Realizada', valor: amt, tipo: 'in', categoria: 'Doação', projeto_id: pid, status: 'pending' })} />}
          {activeTab === 'transparency' && role === 'doador' && <Transparency transactions={transacoes} />}
          {activeTab === 'profile' && <Profile role={role} onUpdatePhoto={setProfilePhoto} onUpdateName={setUserName} currentPhoto={profilePhoto} totalInvested={impactStats.totalInvested} />}
          
          {activeTab === 'overview' && role === 'gestor' && <ManagerDashboard students={alunos} transactions={transacoes} onAddStudent={handleAddStudent} onNavigate={setActiveTab} />}
          {activeTab === 'students' && role === 'gestor' && <StudentManagement students={alunos} onAddStudent={handleAddStudent} onUpdateStudent={async (s) => { await supabase.from('alunos').update(s).eq('id', s.id); fetchData(true); }} onDeleteStudent={async (id) => { if(confirm("Remover?")){ await supabase.from('alunos').delete().eq('id', id); fetchData(true); }}} />}
          {activeTab === 'project-management' && role === 'gestor' && <ProjectManagement projects={projetos} onAddProject={handleAddProject} onDeleteProject={async (id) => { if(confirm("Excluir?")) { await supabase.from('projetos').delete().eq('id', id); fetchData(true); }}} />}
          {activeTab === 'treasury' && role === 'gestor' && <Treasury transactions={transacoes} projects={projetos} onAddTransaction={handleAddTransaction} onUpdateStatus={handleUpdateTransactionStatus} onDeleteTransaction={async (id) => { if(confirm("Excluir?")){ await supabase.from('transacoes').delete().eq('id', id); fetchData(true); }}} />}
          {activeTab === 'esg' && role === 'gestor' && <ESGReports transactions={transacoes} studentCount={alunos.length} />}
          {activeTab === 'settings' && role === 'gestor' && <Settings onUpdatePhoto={setProfilePhoto} currentPhoto={profilePhoto} />}
        </div>
      </main>
    </div>
  );
};

export default App;
