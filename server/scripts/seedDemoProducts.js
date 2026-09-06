import store from '../data/supabaseStore.js';

const demoProducts = [
  // Figurines & Collectibles
  {
    name: 'Articulated Flexi-Dragon',
    slug: 'articulated-flexi-dragon',
    description: 'A fully articulated, print-in-place dragon with movable joints. Perfect for fidgeting or as a desk companion.',
    category: 'figurines',
    basePrice: 500,
    salePrice: 450,
    stockQuantity: 20,
    printTimeHours: 4,
    weightGrams: 100,
    careInstructions: 'Keep away from excessive heat and direct sunlight to prevent warping.',
    images: [{ url: 'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1?auto=format&fit=crop&q=80&w=800', type: 'image' }],
    materials: [
      { name: 'PLA (Standard)', priceDelta: 0 },
      { name: 'Silk PLA', priceDelta: 100 }
    ],
    sizes: [
      { label: 'Standard (15cm)', priceDelta: 0 },
      { label: 'Large (25cm)', priceDelta: 300 }
    ]
  },
  {
    name: 'Mythical Warrior Bust',
    slug: 'mythical-warrior-bust',
    description: 'A highly detailed fantasy warrior bust suitable for painting or display. Captures intricate armor and facial expressions.',
    category: 'figurines',
    basePrice: 850,
    stockQuantity: 10,
    printTimeHours: 8,
    weightGrams: 200,
    careInstructions: 'Handle with care. Can be primed and painted with acrylics.',
    images: [{ url: 'https://images.unsplash.com/photo-1608670576356-74fc24a7ba5d?auto=format&fit=crop&q=80&w=800', type: 'image' }],
    materials: [
      { name: 'Resin (High Detail)', priceDelta: 0 },
      { name: 'PLA+', priceDelta: -100 }
    ],
    sizes: [
      { label: 'Standard (10cm tall)', priceDelta: 0 },
      { label: 'Oversized (20cm tall)', priceDelta: 600 }
    ]
  },

  // Home & Desk D�cor
  {
    name: 'Geometric Spiral Planter',
    slug: 'geometric-spiral-planter',
    description: 'A modern, low-poly spiral vase perfect for small indoor plants or succulents. Printed with a watertight setting.',
    category: 'decor',
    basePrice: 350,
    stockQuantity: 30,
    printTimeHours: 5,
    weightGrams: 150,
    careInstructions: 'Indoor use only. Clean with a damp cloth.',
    images: [{ url: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&q=80&w=800', type: 'image' }],
    materials: [
      { name: 'PETG (Water Resistant)', priceDelta: 0 },
      { name: 'Wood-fill PLA', priceDelta: 150 }
    ],
    sizes: [
      { label: 'Small (10cm)', priceDelta: 0 },
      { label: 'Large (15cm)', priceDelta: 200 }
    ]
  },
  {
    name: 'Modular Desk Organizer',
    slug: 'modular-desk-organizer',
    description: 'A customizable desk organizer set. Includes compartments for pens, a smartphone stand, and a tray for paperclips.',
    category: 'decor',
    basePrice: 600,
    salePrice: 500,
    stockQuantity: 15,
    printTimeHours: 6,
    weightGrams: 250,
    careInstructions: 'Wipe with a soft cloth. Do not use harsh chemicals.',
    images: [{ url: 'https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?auto=format&fit=crop&q=80&w=800', type: 'image' }],
    materials: [
      { name: 'PLA', priceDelta: 0 },
      { name: 'ABS', priceDelta: 100 }
    ],
    sizes: [
      { label: 'Standard Set', priceDelta: 0 },
      { label: 'Extended Set (Extra Trays)', priceDelta: 300 }
    ]
  },

  // CSE Academic Models
  {
    name: 'Logic Gate Demonstration Model',
    slug: 'logic-gate-demo-model',
    description: 'A physical representation of basic logic gates (AND, OR, NOT) with snap-fit connectors for educational demonstrations in computer architecture classes.',
    category: 'academic',
    basePrice: 400,
    stockQuantity: 50,
    printTimeHours: 3,
    weightGrams: 80,
    careInstructions: 'Store in a cool, dry place. Snap-fit joints may loosen over time.',
    images: [{ url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800', type: 'image' }],
    materials: [
      { name: 'PLA', priceDelta: 0 },
      { name: 'PETG', priceDelta: 50 }
    ],
    sizes: [
      { label: 'Standard', priceDelta: 0 },
      { label: 'Classroom Size', priceDelta: 150 }
    ]
  },
  {
    name: 'Scaled Robotic Arm Assembly',
    slug: 'scaled-robotic-arm-assembly',
    description: 'A functional, scaled-down mechanical robotic arm assembly. Ideal for CSE robotics labs and kinematic demonstrations.',
    category: 'academic',
    basePrice: 1200,
    stockQuantity: 5,
    printTimeHours: 15,
    weightGrams: 500,
    careInstructions: 'Contains small moving parts. Assemble carefully.',
    images: [{ url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800', type: 'image' }],
    materials: [
      { name: 'ABS (Durable)', priceDelta: 0 },
      { name: 'Nylon', priceDelta: 400 }
    ],
    sizes: [
      { label: '1:10 Scale', priceDelta: 0 },
      { label: '1:5 Scale', priceDelta: 800 }
    ]
  },

  // Keychains & Small Gifts
  {
    name: 'Custom Nameplate Keychain',
    slug: 'custom-nameplate-keychain',
    description: 'A personalized 3D-printed keychain with your name or custom text. Perfect as a quick gift or backpack tag.',
    category: 'keychains',
    basePrice: 150,
    stockQuantity: 100,
    printTimeHours: 1,
    weightGrams: 15,
    careInstructions: 'Attach to keys securely. Avoid excessive bending.',
    images: [{ url: 'https://images.unsplash.com/photo-1629851606990-2c70d4949503?auto=format&fit=crop&q=80&w=800', type: 'image' }],
    materials: [
      { name: 'PLA', priceDelta: 0 },
      { name: 'TPU (Flexible)', priceDelta: 50 }
    ],
    sizes: [
      { label: 'Standard (5cm)', priceDelta: 0 },
      { label: 'Long (8cm)', priceDelta: 20 }
    ]
  },
  {
    name: 'Emoji Mascot Keychain',
    slug: 'emoji-mascot-keychain',
    description: 'A small, fun mascot figurine keychain. Dual-color print featuring a classic emoji design.',
    category: 'keychains',
    basePrice: 200,
    salePrice: 180,
    stockQuantity: 75,
    printTimeHours: 1,
    weightGrams: 20,
    careInstructions: 'Wipe clean if necessary.',
    images: [{ url: 'https://images.unsplash.com/photo-1616628188506-4bf98a58a7ab?auto=format&fit=crop&q=80&w=800', type: 'image' }],
    materials: [
      { name: 'PLA', priceDelta: 0 }
    ],
    sizes: [
      { label: 'Standard', priceDelta: 0 }
    ]
  },

  // Custom Prints
  {
    name: 'Photo-to-3D Lithophane Bust',
    slug: 'photo-to-3d-lithophane-bust',
    description: 'An example of our custom 3D modeling service. We convert a 2D photograph into a stunning 3D lithophane bust that illuminates when placed in front of light.',
    category: 'custom-prints',
    basePrice: 900,
    stockQuantity: 999,
    printTimeHours: 10,
    weightGrams: 120,
    careInstructions: 'Keep out of direct sunlight. Place near a light source for best effect.',
    images: [{ url: 'https://images.unsplash.com/photo-1618365908648-e71bd5716cba?auto=format&fit=crop&q=80&w=800', type: 'image' }],
    materials: [
      { name: 'White PLA (High Opacity)', priceDelta: 0 },
      { name: 'White Resin', priceDelta: 300 }
    ],
    sizes: [
      { label: 'Medium (12cm)', priceDelta: 0 },
      { label: 'Large (18cm)', priceDelta: 400 }
    ]
  },
  {
    name: 'Custom Logo / Plaque Service',
    slug: 'custom-logo-plaque',
    description: 'Example of our custom logo plaque printing. Provide your 2D logo, and we will extrude it into a professional, dual-color 3D sign.',
    category: 'custom-prints',
    basePrice: 750,
    stockQuantity: 999,
    printTimeHours: 7,
    weightGrams: 300,
    careInstructions: 'Can be wall-mounted using double-sided tape.',
    images: [{ url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800', type: 'image' }],
    materials: [
      { name: 'PLA', priceDelta: 0 },
      { name: 'PETG', priceDelta: 100 }
    ],
    sizes: [
      { label: 'Small (15cm wide)', priceDelta: 0 },
      { label: 'Medium (25cm wide)', priceDelta: 300 }
    ]
  },

  // Event & Fest Merchandise
  {
    name: 'Hackathon Champion Trophy',
    slug: 'hackathon-champion-trophy',
    description: 'A themed trophy print designed for CSE department hackathons and coding fests. Features a geometric brain design.',
    category: 'merch',
    basePrice: 600,
    stockQuantity: 20,
    printTimeHours: 8,
    weightGrams: 250,
    careInstructions: 'Dust regularly. Fragile top sections.',
    images: [{ url: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&q=80&w=800', type: 'image' }],
    materials: [
      { name: 'Silk Gold PLA', priceDelta: 0 },
      { name: 'Silk Silver PLA', priceDelta: 0 }
    ],
    sizes: [
      { label: 'First Place Size', priceDelta: 0 },
      { label: 'Runner Up Size', priceDelta: -100 }
    ]
  },
  {
    name: 'Tech Fest Mascot Figurine',
    slug: 'tech-fest-mascot-figurine',
    description: 'The official mascot of the annual department tech fest. A limited edition print available exclusively during event season.',
    category: 'merch',
    basePrice: 300,
    stockQuantity: 50,
    printTimeHours: 3,
    weightGrams: 80,
    careInstructions: 'Generic display item.',
    images: [{ url: 'https://images.unsplash.com/photo-1582298538104-e2eb7035ce4c?auto=format&fit=crop&q=80&w=800', type: 'image' }],
    materials: [
      { name: 'PLA', priceDelta: 0 }
    ],
    sizes: [
      { label: 'Standard', priceDelta: 0 }
    ]
  }
];

async function seedProducts() {
  console.log('Starting seed process for demo products...');
  try {
    for (const product of demoProducts) {
      console.log(`Seeding product: ${product.name}...`);
      await store.createProduct(product);
    }
    console.log('Successfully seeded 12 demo products.');
  } catch (err) {
    console.error('Error seeding products:', err);
  }
  process.exit(0);
}

seedProducts();
