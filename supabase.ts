
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://kbbbplvavudugbvyidnz.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_p-dR8FRp4sTsQSFPAhOqoA_9KSp6q7k';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
