
import { createClient } from '@supabase/supabase-js';

// Prioriza variáveis de ambiente da Vercel/Ambiente de Build
// Fallback para as chaves fornecidas caso as variáveis não estejam definidas
const SUPABASE_URL = (typeof process !== 'undefined' && process.env?.SUPABASE_URL) 
  || (window as any).env?.SUPABASE_URL 
  || 'https://kbbbplvavudugbvyidnz.supabase.co';

const SUPABASE_ANON_KEY = (typeof process !== 'undefined' && process.env?.SUPABASE_ANON_KEY) 
  || (window as any).env?.SUPABASE_ANON_KEY 
  || 'sb_publishable_p-dR8FRp4sTsQSFPAhOqoA_9KSp6q7k';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn("Supabase: Credenciais não detectadas. Verifique as variáveis de ambiente.");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
