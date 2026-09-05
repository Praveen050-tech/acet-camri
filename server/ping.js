import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_ANON_KEY");
  process.exit(1);
}

const supabaseAnon = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function ping() {
  console.log(`Connecting to: ${SUPABASE_URL}`);
  
  // Test connection to products table
  const { data, error } = await supabaseAnon
    .from('products')
    .select('id, name, base_price, sale_price, stock_quantity')
    .limit(1);

  if (error) {
    console.error('❌ Supabase Ping Failed:');
    console.error(error);
  } else {
    console.log('✅ Supabase Connection Successful (Anon Key)');
    console.log('Test Query Result (products table):');
    console.log(JSON.stringify(data, null, 2));
  }
}

ping();
