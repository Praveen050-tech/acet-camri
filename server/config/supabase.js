/**
 * ACET 3D — Official Supabase PostgreSQL Client Configuration
 * Department of Computer Science and Engineering
 * Akshaya College of Engineering & Technology (acetcbe.edu.in • TNEA: 2763)
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://acet-3d.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

let supabase = null;
let isLiveSupabase = false;

try {
  if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY && !SUPABASE_SERVICE_ROLE_KEY.includes('placeholder')) {
    supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    isLiveSupabase = true;
    console.log(`⚡ Connected to live Supabase PostgreSQL Project: ${SUPABASE_URL}`);
  } else {
    // Create client instance for structure and local fallback
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY || 'anon-key-dummy-for-dev', {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    console.log(`⚡ Supabase client initialized (Local Offline-First Mode).`);
  }
} catch (error) {
  console.warn(`⚠️ Supabase client initialization notice: ${error.message}`);
}

export { supabase, isLiveSupabase, SUPABASE_URL, SUPABASE_ANON_KEY };
export default supabase;
