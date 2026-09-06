import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder_key';

// Remove any accidental literal quotes that might have been added via CLI
const supabaseUrl = rawUrl.replace(/^["']|["']$/g, '');
const supabaseAnonKey = rawKey.replace(/^["']|["']$/g, '');

console.log("Supabase URL loaded:", supabaseUrl ? "Valid string" : "Empty", "Starts with http:", supabaseUrl.startsWith("http"));

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
