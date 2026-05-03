import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase project credentials
const SUPABASE_URL = "https://qteoyttucxpubgucxzlk.supabase.co"
const SUPABASE_PUBLIC_KEY = "sb_publishable_2RrtMqoYvUf-3zIOtWeEpw_8vm1LNTD"

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
