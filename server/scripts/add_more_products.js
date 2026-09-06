import store from '../data/supabaseStore.js';

const newProducts = [
  // Figurines & Collectibles - Devotional
  {
    name: 'Lord Ganesh Idol',
    slug: 'lord-ganesh-idol',
    description: 'A traditional seated Ganesh figurine. Highly detailed, making it suitable for home or office altars and as a thoughtful gift. Resin printing is recommended to capture the finer details.',
    category: 'figurines',
    basePrice: 400,
    stockQuantity: 25,
    printTimeHours: 6,
    weightGrams: 150,
    careInstructions: 'Handle with care. Dust with a soft brush.',
    images: [{ url: 'https://images.unsplash.com/photo-1590022419747-d1d6dd8b939e?auto=format&fit=crop&q=80&w=800', type: 'image' }],
    materials: [
      { name: 'White Resin (Recommended)', priceDelta: 100 },
      { name: 'PLA', priceDelta: 0 }
    ],
    sizes: [
      { label: 'Small (10cm)', priceDelta: 0 },
      { label: 'Medium (18cm)', priceDelta: 300 }
    ]
  },
  {
    name: 'Lord Shiva Idol',
    slug: 'lord-shiva-idol',
    description: 'A finely detailed Shiva figurine depicted in a meditative pose. Ideal for display and gifting. For the best reproduction of intricate ornaments, select the Resin option.',
    category: 'figurines',
    basePrice: 450,
    stockQuantity: 15,
    printTimeHours: 7,
    weightGrams: 160,
    careInstructions: 'Fragile details; avoid dropping.',
    images: [{ url: 'https://images.unsplash.com/photo-1591147576264-b6a8f10b78e2?auto=format&fit=crop&q=80&w=800', type: 'image' }],
    materials: [
      { name: 'White Resin (Recommended)', priceDelta: 100 },
      { name: 'PLA', priceDelta: 0 }
    ],
    sizes: [
      { label: 'Small (10cm)', priceDelta: 0 },
      { label: 'Medium (18cm)', priceDelta: 350 }
    ]
  },
  {
    name: 'Lord Krishna Idol',
    slug: 'lord-krishna-idol',
    description: 'A beautifully sculpted Krishna figurine holding a flute. Perfect for festive gifting or home décor. We recommend the high-detail resin material for the best finish.',
    category: 'figurines',
    basePrice: 400,
    stockQuantity: 20,
    printTimeHours: 6,
    weightGrams: 140,
    careInstructions: 'Keep away from direct heat.',
    images: [{ url: 'https://images.unsplash.com/photo-1628186105021-396426dbecad?auto=format&fit=crop&q=80&w=800', type: 'image' }],
    materials: [
      { name: 'White Resin (Recommended)', priceDelta: 100 },
      { name: 'PLA', priceDelta: 0 }
    ],
    sizes: [
      { label: 'Small (10cm)', priceDelta: 0 },
      { label: 'Medium (18cm)', priceDelta: 300 }
    ]
  },
  {
    name: 'Goddess Lakshmi Idol',
    slug: 'goddess-lakshmi-idol',
    description: 'A traditional Lakshmi figurine. A common festive and gifting item, printed with care. Choose the Resin material to ensure all fine jewelry details are perfectly resolved.',
    category: 'figurines',
    basePrice: 400,
    stockQuantity: 30,
    printTimeHours: 6,
    weightGrams: 150,
    careInstructions: 'Dust with a soft brush.',
    images: [{ url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=800', type: 'image' }],
    materials: [
      { name: 'White Resin (Recommended)', priceDelta: 100 },
      { name: 'PLA', priceDelta: 0 }
    ],
    sizes: [
      { label: 'Small (10cm)', priceDelta: 0 },
      { label: 'Medium (18cm)', priceDelta: 300 }
    ]
  },

  // Engineering Models
  {
    name: 'Four-Bar Linkage Mechanism Demo Board',
    slug: 'four-bar-linkage-demo',
    description: 'A working demonstration of a basic four-bar linkage mechanism. Hand-crank operated. Excellent teaching aid for engineering students exploring kinematics.',
    category: 'engineering-models',
    basePrice: 500,
    stockQuantity: 15,
    printTimeHours: 8,
    weightGrams: 200,
    careInstructions: 'Do not force the crank. Lubricate joints lightly if squeaking occurs.',
    images: [{ url: 'https://images.unsplash.com/photo-1581092334245-d4193568c8b6?auto=format&fit=crop&q=80&w=800', type: 'image' }],
    materials: [
      { name: 'PETG (Durable)', priceDelta: 100 },
      { name: 'PLA', priceDelta: 0 }
    ],
    sizes: [
      { label: 'Standard Desktop Size', priceDelta: 0 }
    ]
  },
  {
    name: 'Gearbox / Gear Train Demonstration Model',
    slug: 'gearbox-demo-model',
    description: 'A simple gear-train assembly demonstrating torque and speed relationships. Features multiple interchangeable gear ratios for educational exploration.',
    category: 'engineering-models',
    basePrice: 850,
    stockQuantity: 10,
    printTimeHours: 12,
    weightGrams: 350,
    careInstructions: 'Keep fingers clear of meshing gears during operation.',
    images: [{ url: 'https://images.unsplash.com/photo-1517420879524-86d64ac2f339?auto=format&fit=crop&q=80&w=800', type: 'image' }],
    materials: [
      { name: 'PETG (Durable)', priceDelta: 150 },
      { name: 'PLA', priceDelta: 0 }
    ],
    sizes: [
      { label: 'Standard', priceDelta: 0 }
    ]
  },
  {
    name: 'Cam-and-Follower Mechanism Model',
    slug: 'cam-follower-demo',
    description: 'Demonstrates the conversion of rotary motion into linear motion via a cam profile. Perfect for hobbyists and mechanical engineering demonstrations.',
    category: 'engineering-models',
    basePrice: 400,
    stockQuantity: 20,
    printTimeHours: 5,
    weightGrams: 120,
    careInstructions: 'Ensure the follower track remains clear of debris.',
    images: [{ url: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=800', type: 'image' }],
    materials: [
      { name: 'PETG (Durable)', priceDelta: 50 },
      { name: 'PLA', priceDelta: 0 }
    ],
    sizes: [
      { label: 'Standard', priceDelta: 0 }
    ]
  },
  {
    name: 'Miniature Engine Piston Assembly',
    slug: 'mini-piston-assembly',
    description: 'A hand-crank-operated piston and cylinder demonstration model. Shows the internal reciprocating motion of a basic combustion engine block.',
    category: 'engineering-models',
    basePrice: 950,
    stockQuantity: 5,
    printTimeHours: 14,
    weightGrams: 400,
    careInstructions: 'Tolerances are tight; handle gently to avoid binding.',
    images: [{ url: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&q=80&w=800', type: 'image' }],
    materials: [
      { name: 'PETG (Durable)', priceDelta: 150 },
      { name: 'PLA', priceDelta: 0 }
    ],
    sizes: [
      { label: '1:4 Scale', priceDelta: 0 }
    ]
  }
];

async function seedMore() {
  console.log('Starting seed process for 8 new products...');
  try {
    for (const product of newProducts) {
      console.log(`Seeding product: ${product.name}...`);
      await store.createProduct(product);
    }
    console.log('Successfully seeded 8 additional products.');
  } catch (err) {
    console.error('Error seeding products:', err);
  }
  process.exit(0);
}

seedMore();
