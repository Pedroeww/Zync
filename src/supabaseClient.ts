import { createClient } from '@supabase/supabase-js';

// Use environment variables for Supabase credentials with hardcoded fallbacks
const env = (import.meta as any).env;
const SUPABASE_URL = env.VITE_SUPABASE_URL || "https://qteoyttucxpubgucxzlk.supabase.co";
const SUPABASE_PUBLIC_KEY = env.VITE_SUPABASE_ANON_KEY || "sb_publishable_2RrtMqoYvUf-3zIOtWeEpw_8vm1LNTD";

// Helper to check if credentials are valid format
const isValidConfig = SUPABASE_URL && SUPABASE_URL.startsWith('https://') && SUPABASE_PUBLIC_KEY;

export const supabase = (isValidConfig 
  ? createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY)
  : { 
      auth: { 
        getSession: async () => ({ data: { session: null }, error: null }), 
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }), 
        getUser: async () => ({ data: { user: null }, error: null }), 
        signOut: async () => ({ error: null }),
        signInWithOAuth: async () => ({ data: { url: '' }, error: new Error('Supabase not configured') }),
        signUp: async () => ({ data: { user: null, session: null }, error: new Error('Supabase not configured') }),
        signInWithPassword: async () => ({ data: { user: null, session: null }, error: new Error('Supabase not configured') })
      },
      from: () => {
        const chain = {
          select: () => chain,
          insert: () => chain,
          update: () => chain,
          delete: () => chain,
          eq: () => chain,
          order: () => chain,
          single: async () => ({ data: null, error: new Error('Supabase not configured') }),
          then: (cb: any) => Promise.resolve({ data: [], error: new Error('Supabase not configured') }).then(cb)
        };
        return chain;
      },
      storage: { 
        from: () => ({ 
          upload: async () => ({ data: null, error: new Error('Supabase not configured') }), 
          createSignedUrl: async () => ({ data: null, error: new Error('Supabase not configured') }), 
          remove: async () => ({ data: null, error: new Error('Supabase not configured') }) 
        }) 
      }
    }) as any;

export const isSupabaseConfigured = isValidConfig && !SUPABASE_URL.includes('your-actual-supabase');
