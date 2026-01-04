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
import { Menu, Loader2 } from 'lucide-react';
import { UserRole, Aluno, Transacao, Projeto, Perfil } from './types';
import { supabase } from './supabase';

const MASTER_MANAGER_EMAIL = "escolajovensdenegocios.oficial@gmail.com";

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [role, setRole] = useState<UserRole>('doador');
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  
  const [profileData, setProfileData] = useState<Partial<Perfil>>({});

  const syncProfile = async (userId: string, email: string) => {
    try {
      const isMaster = email.toLowerCase() === MASTER_MANAGER_EMAIL.toLowerCase();
      const { data, error } = await supabase.from('perfis').select('*').eq('id', userId).single();
      
      if (error && error.code === 'PGRST116') {
        const newProfile = {
          id: userId,
          email: email,
          nome: isMaster ? 'Paulo Ricardo' : 'Impulsionador',
          cargo: isMaster ? 'gestor' : 'doador',
          bio: isMaster ? 'Presidente do Instituto Escola Jovens de Negócios.' : 'Construindo novos amanhãs.'
        };
        await supabase.from('perfis').insert([newProfile]);
        setProfileData(newProfile);
      } else if (data) {
        if (isMaster && (data.nome === 'Impulsionador' || !data.nome)) {
          const update = { nome: 'Paulo Ricardo', cargo: 'gestor' };
          await supabase.from('perfis').update(update).eq('id', userId);
          setProfileData({ ...data, ...update });
        } else {
          setProfileData(data);
        }
      }
    } catch (e) {
      console.error("Erro ao sincronizar perfil:", e);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        const isMaster = session.user.email?.toLowerCase() === MASTER_MANAGER_EMAIL.toLowerCase();
        setRole(isMaster ? 'gestor' : 'doador');
        syncProfile(session.user.id, session.user.email || '');
      }
      setIsAppLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        const isMaster = session.user.email?.toLowerCase() === MASTER_MANAGER_EMAIL.toLowerCase();
        setRole(isMaster ? 'gestor' : 'doador');
        syncProfile(session.user.id, session.user.email || '');
      } else {
        setRole('doador');
        setActiveTab('overview');
        setProfileData({});
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchData = useCallback(async (isSilent = false) => {
    if (!session?.user) return;
    if (!isSilent) setIsAppLoading(true);
    
    try {
      const [alRes, trRes, prRes] = await Promise.all([
        supabase.from('alunos').select('*').order('nome'),
        supabase.from('transacoes').select('*').order('created_at', { ascending: false }),
        supabase.from('projetos').select('*').order('created_at', { ascending: false })
      ]);

      if (alRes.data) setAlunos(alRes.data);
      if (trRes.data) setTransacoes(trRes.data.map(t => ({ ...t, valor: Number(t.valor) })));
      if (prRes.data) setProjetos(prRes.data.map(p => ({ ...p, meta_financeira: Number(p.meta_financeira) })));
      
      const { data: profData } = await supabase.from('perfis').select('*').eq('id', session.user.id).single();
      if (profData) setProfileData(profData);

    } catch (err) {
      console.error("Erro Sync:", err);
    } finally {
      setIsAppLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (session) fetchData();
  }, [session, fetchData]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleAddTransaction = async (newTr: Omit<Transacao, 'id' | 'created_at'>): Promise<boolean> => {
    try {
      const { error } = await supabase.from('transacoes').insert([{
        descricao: newTr.descricao,
        categoria: newTr.categoria,
        tipo: newTr.tipo,
        valor: newTr.valor,
        projeto_id: newTr.projeto_id || null,
        status: newTr.status,
        doador_email: session.user.email,
        comprovante_url: newTr.comprovante_url || null
      }]);
      if (error) throw error;
      alert('Seu impulsionamento foi registrado.');
      fetchData(true);
      return true;
    } catch (err: any) {
      alert(`Falha técnica: ${err.message}`);
      return false;
    }
  };

  if (isAppLoading) return <div className="min-h-screen bg-white flex items-center justify-center"><Loader2 className="w-10 h-10 text-ejn-teal animate-spin" /></div>;

  if (!session) return <><LandingPage onStart={() => setShowLogin(true)} />{showLogin && <LoginForm onClose={() => setShowLogin(false)} />}</>;

  const userTransactions = transacoes.filter(t => 
    role === 'gestor' ? true : t.doador_email === session.user.email
  );

  const totalInvested = userTransactions
    .filter(t => t.tipo === 'entrada' && t.status === 'confirmado')
    .reduce((acc, t) => acc + t.valor, 0);

  const impactCount = (role === 'doador' && totalInvested === 0) ? 0 : alunos.length;

  return (
    <div className="min-h-screen flex font-sans text-gray-900 bg-apple-gray">
      <Sidebar 
        activeId={activeTab} 
        onNavigate={setActiveTab} 
        role={role} 
        onRoleSwitch={() => {}} 
        profilePhoto={profileData.foto_url || null} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        onLogout={handleLogout} 
      />

      <main className="flex-1 min-w-0 lg:ml-72 p-6 md:p-20 overflow-y-auto">
        <header className="flex flex-col md:flex-row md:justify-between md:items-start mb-16 gap-6">
          <div className="lg:hidden"><button onClick={() => setIsSidebarOpen(true)} className="p-2.5 text-ejn-teal bg-white rounded-lg shadow-sm"><Menu /></button></div>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-ejn-teal font-poppins tracking-tight">
              {role === 'gestor' ? `Gestão estratégica.` : `Seu impacto, ${profileData.nome?.split(' ')[0]}.`}
            </h1>
            <p className="text-apple-text-secondary font-extralight tracking-wide text-base mt-1.5 opacity-70">
              {role === 'gestor' ? "A ética da execução." : "Mudando amanhãs, hoje."}
            </p>
          </div>
        </header>

        <div className="max-w-5xl mx-auto pb-32">
          {activeTab === 'overview' && role === 'doador' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <ImpactHero impactCount={impactCount} totalInvested={totalInvested} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <TransparencyCard transactions={transacoes} onNavigate={setActiveTab} />
                <FeaturedProject 
                  projects={projetos} 
                  transactions={transacoes} 
                  onNavigate={setActiveTab} 
                />
              </div>
            </div>
          )}
          {activeTab === 'investments' && role === 'doador' && (
            < MyInvestments 
              transactions={userTransactions} 
              totalInvested={totalInvested} 
              profileData={profileData}
            />
          )}
          {activeTab === 'projects' && role === 'doador' && (
            <Projects 
              projects={projetos} 
              transactions={transacoes} 
              onDonate={(pid, amt) => handleAddTransaction({ 
                descricao: 'Impulsionar amanhã', 
                valor: amt, 
                tipo: 'entrada', 
                categoria: 'Doação', 
                projeto_id: pid, 
                status: 'pendente' 
              })} 
            />
          )}
          {activeTab === 'transparency' && role === 'doador' && <Transparency transactions={transacoes} impactCount={impactCount} totalInvested={totalInvested} />}
          
          {activeTab === 'profile' && (
            <Profile 
              role={role} 
              profileData={profileData}
              totalInvested={totalInvested}
              onRefresh={() => fetchData(true)}
            />
          )}
          
          {activeTab === 'overview' && role === 'gestor' && <ManagerDashboard students={alunos} transactions={transacoes} onAddStudent={async (s) => { await supabase.from('alunos').insert([s]); fetchData(true); }} onNavigate={setActiveTab} />}
          {activeTab === 'students' && role === 'gestor' && <StudentManagement students={alunos} onAddStudent={async (s) => { await supabase.from('alunos').insert([s]); fetchData(true); }} onUpdateStudent={async (s) => { await supabase.from('alunos').update(s).eq('id', s.id); fetchData(true); }} onDeleteStudent={async (id) => { await supabase.from('alunos').delete().eq('id', id); fetchData(true); }} />}
          {activeTab === 'project-management' && role === 'gestor' && <ProjectManagement projects={projetos} onAddProject={async (p) => { await supabase.from('projetos').insert([p]); fetchData(true); }} onDeleteProject={async (id) => { await supabase.from('projetos').delete().eq('id', id); fetchData(true); }} />}
          {activeTab === 'treasury' && role === 'gestor' && <Treasury transactions={transacoes} projects={projetos} onAddTransaction={handleAddTransaction} onUpdateStatus={async (id, st) => { await supabase.from('transacoes').update({ status: st }).eq('id', id); fetchData(true); }} onDeleteTransaction={async (id) => { await supabase.from('transacoes').delete().eq('id', id); fetchData(true); }} />}
          {activeTab === 'esg' && role === 'gestor' && <ESGReports transactions={transacoes} studentCount={alunos.length} profileData={profileData} />}
          {activeTab === 'settings' && role === 'gestor' && (
            <Settings 
              profileData={profileData} 
              onRefresh={() => fetchData(true)} 
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;