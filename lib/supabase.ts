import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://chdlpyhzxdsyalzpyrwh.supabase.co';
const supabaseAnonKey = 'sb_publishable_rlQ7B7dcwgqHHJqlsGXH4w_ASy__r2-';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);