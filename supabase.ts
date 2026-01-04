
import { createClient } from '@supabase/supabase-js';

// No ambiente Vercel, as variáveis são injetadas em process.env
// No ambiente de desenvolvimento local, podem estar em window.env
const SUPABASE_URL = (typeof process !== 'undefined' && process.env?.SUPABASE_URL) 
  || (window as any).env?.SUPABASE_URL 
  || 'https://kbbbplvavudugbvyidnz.supabase.co';

const SUPABASE_ANON_KEY = (typeof process !== 'undefined' && process.env?.SUPABASE_ANON_KEY) 
  || (window as any).env?.SUPABASE_ANON_KEY 
  || 'sb_publishable_p-dR8FRp4sTsQSFPAhOqoA_9KSp6q7k';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("ERRO CRÍTICO DE DEVOPS: Credenciais do Supabase ausentes na Vercel.");
}

// Criação do cliente com persistência de sessão e headers de cache desativados para dados real-time
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    headers: { 'x-application-name': 'impacto-real-ejn' }
  }
});
