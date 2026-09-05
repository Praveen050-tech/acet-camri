import bcrypt from 'bcryptjs';
import { supabase, isLiveSupabase } from './config/supabase.js';

async function createAdmin() {
  if (!supabase || !isLiveSupabase) {
    console.error('❌ Supabase is not connected.');
    process.exit(1);
  }

  const email = 'admin@acetcbe.edu.in';
  const password = 'acet3d2026';
  const name = 'ACET 3D Club Lead';

  console.log(`Creating admin account for ${email}...`);

  try {
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const { data, error } = await supabase
      .from('app_admins')
      .upsert(
        {
          email,
          name,
          password_hash,
          role: 'admin',
          department: 'Department of Computer Science and Engineering'
        },
        { onConflict: 'email' }
      )
      .select();

    if (error) {
      console.error('❌ Error creating admin:', error.message);
    } else {
      console.log('✅ Successfully created admin account!');
    }
  } catch (err) {
    console.error('❌ Exception:', err.message);
  }
  process.exit(0);
}

createAdmin();
