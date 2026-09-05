import { seedSupabaseDatabase } from '../seed_supabase.js';

export const seedDatabase = async () => {
  return await seedSupabaseDatabase();
};

export default seedDatabase;
