import { admin, db } from './config/firebase.js';
import { firestoreService } from './data/firestoreStore.js';

const starterProducts = [
  {
    name: 'ACET Official Crest & Institutional Seal Monolith',
    slug: 'acet-crest-monolith',
    description: 'Precision architectural crest of Akshaya College of Engineering & Technology. High-density resin monolithic block with 24K gold foil trim and debossed motto.',
    category: 'CSE Academic Models',
    basePrice: 1299,
    salePrice: 899,
    stockQuantity: 45,
    printTimeHours: 6.0,
    weightGrams: 160.0,
    careInstructions: 'Clean with dry microfiber cloth. Keep out of direct sunlight exceeding 60°C.',
    ratingAvg: 4.9,
    ratingCount: 38,
    isActive: true,
    images: [
      { id: 'img-crest-0', url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80', position: 0 }
    ],
    materials: [
      { id: 'mat-crest-0', name: 'PLA Pro (Matte Burgundy)', priceDelta: 0 },
      { id: 'mat-crest-1', name: 'Cold-Cast Brass Resin', priceDelta: 450 },
      { id: 'mat-crest-2', name: 'Carrara Marble Composite', priceDelta: 800 }
    ],
    sizes: [
      { id: 'sz-crest-0', label: 'Standard Desktop (10cm)', priceDelta: 0 },
      { id: 'sz-crest-1', label: 'Executive Pedestal (18cm)', priceDelta: 500 }
    ]
  },
  {
    name: '4:1 Planetary Reduction Gearbox (Print-in-Place)',
    slug: 'planetary-reduction-gearbox',
    description: 'Fully functional 4:1 epicyclic reduction gear assembly printed in a single pass without assembly. Demonstrates kinematic engineering mechanics with zero backlash.',
    category: 'CSE Academic Models',
    basePrice: 1499,
    salePrice: 1149,
    stockQuantity: 25,
    printTimeHours: 8.0,
    weightGrams: 220.0,
    careInstructions: 'Use dry silicone lubricant for continuous high-speed rotation demonstration.',
    ratingAvg: 5.0,
    ratingCount: 29,
    isActive: true,
    images: [
      { id: 'img-gear-0', url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80', position: 0 }
    ],
    materials: [
      { id: 'mat-gear-0', name: 'PETG High-Toughness', priceDelta: 0 },
      { id: 'mat-gear-1', name: 'Carbon Fiber Nylon (PA12-CF)', priceDelta: 600 }
    ],
    sizes: [
      { id: 'sz-gear-0', label: '100mm Ratio Test', priceDelta: 0 },
      { id: 'sz-gear-1', label: '150mm Demonstration Rig', priceDelta: 400 }
    ]
  },
  {
    name: 'Computational Voronoi Adiyogi Shiva Monolith',
    slug: 'voronoi-adiyogi-shiva',
    description: 'Algorithmic Voronoi mathematical tessellation sculpture of Lord Shiva. Cast from Carrara marble mineral composite with 50-micron SLA surface resolution.',
    category: 'Figurines & Collectibles',
    basePrice: 4299,
    salePrice: 3299,
    stockQuantity: 12,
    printTimeHours: 14.0,
    weightGrams: 420.0,
    careInstructions: 'Wipe gently with damp soft cloth. Sealed with satin polyurethane finish.',
    ratingAvg: 5.0,
    ratingCount: 64,
    isActive: true,
    images: [
      { id: 'img-shiva-0', url: 'https://images.unsplash.com/photo-1608889175123-8ee362201f81?w=800&auto=format&fit=crop&q=80', position: 0 }
    ],
    materials: [
      { id: 'mat-shiva-0', name: 'Carrara Marble SLA Resin', priceDelta: 0 },
      { id: 'mat-shiva-1', name: 'Hand-Gilded Alabaster', priceDelta: 950 }
    ],
    sizes: [
      { id: 'sz-shiva-0', label: 'Pooja Shrine (14cm)', priceDelta: 0 },
      { id: 'sz-shiva-1', label: 'Centerpiece (22cm)', priceDelta: 900 }
    ]
  },
  {
    name: 'Fibonacci Spiral Geodesic Ambient Desk Lamp',
    slug: 'fibonacci-spiral-desk-lamp',
    description: 'Golden-ratio mathematical lattice lampshade with warm ambient LED diffuser base. Casts geometric shadow patterns engineered by CSE additive manufacturing team.',
    category: 'Home & Desk Décor',
    basePrice: 2199,
    salePrice: 1599,
    stockQuantity: 18,
    printTimeHours: 11.0,
    weightGrams: 310.0,
    careInstructions: 'Use only with included 5W low-heat LED USB light module.',
    ratingAvg: 4.8,
    ratingCount: 22,
    isActive: true,
    images: [
      { id: 'img-lamp-0', url: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&auto=format&fit=crop&q=80', position: 0 }
    ],
    materials: [
      { id: 'mat-lamp-0', name: 'Translucent White PLA', priceDelta: 0 },
      { id: 'mat-lamp-1', name: 'Amber Matte Filament', priceDelta: 200 }
    ],
    sizes: [
      { id: 'sz-lamp-0', label: 'Desk Compact (16cm)', priceDelta: 0 },
      { id: 'sz-lamp-1', label: 'Floor Standing (28cm)', priceDelta: 700 }
    ]
  },
  {
    name: 'Akshaya Techday & Symposium Champion Trophy',
    slug: 'akshaya-techday-trophy',
    description: 'Official Department of Computer Science and Engineering annual technical symposium trophy. Dual-tone metallic gold and satin emerald finish.',
    category: 'Event & Fest Merchandise',
    basePrice: 1200,
    salePrice: 850,
    stockQuantity: 40,
    printTimeHours: 7.0,
    weightGrams: 190.0,
    careInstructions: 'Handle with clean hands. Dust with soft feather brush.',
    ratingAvg: 4.9,
    ratingCount: 17,
    isActive: true,
    images: [
      { id: 'img-trophy-0', url: 'https://images.unsplash.com/photo-1569517282132-25d22f4573e6?w=800&auto=format&fit=crop&q=80', position: 0 }
    ],
    materials: [
      { id: 'mat-trophy-0', name: 'Silk Gold PLA + Emerald Base', priceDelta: 0 }
    ],
    sizes: [
      { id: 'sz-trophy-0', label: 'Winner (22cm)', priceDelta: 0 },
      { id: 'sz-trophy-1', label: 'Runner-up (18cm)', priceDelta: -200 }
    ]
  },
  {
    name: 'CSE Department 3D Alumni Keepsake Pen Stand',
    slug: 'cse-alumni-keepsake-penstand',
    description: 'Precision wireframe geometric desktop organizer featuring embossed Department of Computer Science and Engineering identity and smartphone docking cradle.',
    category: 'Keychains & Small Gifts',
    basePrice: 899,
    salePrice: 599,
    stockQuantity: 50,
    printTimeHours: 4.0,
    weightGrams: 120.0,
    careInstructions: 'Avoid immersion in water. Oil wood-fill PLA lightly once a year.',
    ratingAvg: 5.0,
    ratingCount: 31,
    isActive: true,
    images: [
      { id: 'img-penstand-0', url: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=800&auto=format&fit=crop&q=80', position: 0 }
    ],
    materials: [
      { id: 'mat-penstand-0', name: 'Walnut Wood-Fill PLA', priceDelta: 0 },
      { id: 'mat-penstand-1', name: 'Matte Forest Green PLA', priceDelta: -50 }
    ],
    sizes: [
      { id: 'sz-penstand-0', label: 'Desktop Standard (12cm)', priceDelta: 0 }
    ]
  }
];

export async function seedFirestoreDatabase() {
  console.log('🌱 Seeding ACET 3D Cloud Firestore Collections...');
  let count = 0;
  for (const prod of starterProducts) {
    try {
      await firestoreService.createProduct(prod);
      count++;
    } catch (err) {
      console.warn(`Product ${prod.slug} seeding notice:`, err.message);
    }
  }
  console.log(`✅ Successfully seeded ${count} CSE 3D starter products into Cloud Firestore!`);
  return count;
}

if (process.argv[1]?.endsWith('seed.js')) {
  seedFirestoreDatabase().then(() => {
    console.log('🎉 Seeding completed successfully.');
    process.exit(0);
  }).catch((err) => {
    console.error('Seeding error:', err);
    process.exit(1);
  });
}
