/**
 * ACET CAMRI — Official Supabase Database Seeder
 * Department of Computer Science and Engineering
 * Akshaya College of Engineering & Technology
 */

import { supabase, isLiveSupabase } from './config/supabase.js';
import { supabaseService } from './data/supabaseStore.js';

export const starterProducts = [
  {
    name: 'Additive Manufacturing Training Program Registration',
    slug: 'am-training-registration',
    description: '3-day In-house Student Training Program on Additive Manufacturing at CAMRI (9, 10 & 11 September 2026). Hands-on Training with Bambu Lab H2C, Multi-Material & Multi-Color Printing, Design to Print Workflow, Real-world Applications & Prototyping, Live Demonstrations & Practical Sessions. For In-house Students Only.',
    category: 'Training',
    basePrice: 500,
    salePrice: 500,
    stockQuantity: 100, // Limit of students
    printTimeHours: 0,
    weightGrams: 0,
    careInstructions: 'Bring your student ID card.',
    ratingAvg: 5.0,
    ratingCount: 0,
    isActive: true,
    images: [
      { id: 'img-training-0', url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80', position: 0 }
    ],
    materials: [
      { id: 'mat-none', name: 'N/A', priceDelta: 0 }
    ],
    sizes: [
      { id: 'sz-none', label: 'Standard Ticket', priceDelta: 0 }
    ]
  }
];

export const seedSupabaseDatabase = async () => {
  if (!supabase || !isLiveSupabase) {
    console.log('🌱 Skipping Supabase seed: Running in offline fallback mode.');
    return;
  }

  try {
    // 1. Delete all existing products first to clear demo data
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Deletes all

    if (deleteError) {
      console.warn('⚠️ Error clearing old products:', deleteError.message);
    } else {
      console.log('✅ Cleared old demo products');
    }

    // 2. Insert new products
    let insertedCount = 0;
    for (const prod of starterProducts) {
      const existing = await supabaseService.getProductById(prod.slug);
      
      if (!existing) {
        try {
          await supabaseService.createProduct(prod);
          insertedCount++;
        } catch (err) {
          console.error(`❌ Failed to seed ${prod.slug}:`, err.message);
        }
      }
    }
    
    if (insertedCount > 0) {
      console.log(`\n✅ Successfully seeded ${insertedCount} new products into Supabase Database!\n`);
    }

  } catch (err) {
    console.error('❌ Supabase Seeding Error:', err.message);
  }
};
