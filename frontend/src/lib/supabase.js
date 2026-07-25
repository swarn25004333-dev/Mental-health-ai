import { createClient } from '@supabase/supabase-js';

// Environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Debug logging
console.log("Supabase URL:", supabaseUrl);
console.log("Supabase Key:", supabaseAnonKey ? "[PRESENT]" : undefined);

// Check if variables exist
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Supabase environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) are missing in frontend/.env.");
}

// Fallback to placeholder if missing to avoid uncaught exception during bundle evaluation
const validUrl = supabaseUrl || 'https://placeholder.supabase.co';
const validKey = supabaseAnonKey || 'placeholder-anon-key';

export const supabase = createClient(validUrl, validKey);