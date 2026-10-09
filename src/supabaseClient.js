import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) || 
  (typeof process !== 'undefined' && (process.env?.VITE_SUPABASE_URL || process.env?.SUPABASE_URL));
const SUPABASE_PUBLIC_KEY = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) || 
  (typeof process !== 'undefined' && (process.env?.VITE_SUPABASE_ANON_KEY || process.env?.SUPABASE_ANON_KEY));

let client;

// Helper to mock chainable Supabase query methods safely
const makeDbChain = () => {
  const chain = {};
  const execute = () => Promise.resolve({ data: null, error: null });
  
  const chainableMethods = [
    'select', 'insert', 'update', 'delete', 
    'eq', 'neq', 'gt', 'lt', 'gte', 'lte', 
    'like', 'ilike', 'is', 'in', 'contains', 
    'order', 'limit', 'range', 'single', 'maybeSingle'
  ];
  
  chainableMethods.forEach(method => {
    chain[method] = () => chain;
  });
  
  // Make the chain thenable so it acts as a Promise when awaited
  chain.then = (onFulfilled) => execute().then(onFulfilled);
  
  return chain;
};

if (!SUPABASE_URL || !SUPABASE_PUBLIC_KEY) {
  console.warn("⚠️ Supabase credentials are not defined in the environment variables. Using mock client.");
  
  client = {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: async () => ({ data: {}, error: new Error("Supabase not configured") }),
      signUp: async () => ({ data: {}, error: new Error("Supabase not configured") }),
      signOut: async () => ({ error: null }),
    },
    from: () => makeDbChain()
  };
} else {
  try {
    client = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
  } catch (e) {
    console.error("Failed to initialize Supabase client:", e);
    client = {
      auth: {
        getSession: async () => ({ data: { session: null } }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
      },
      from: () => makeDbChain()
    };
  }
}

/** @type {any} */
const supabaseInstance = client;

export const supabase = supabaseInstance;


