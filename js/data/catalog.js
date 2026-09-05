/**
 * ACET 3D — Official Catalog & Taxonomy
 * Akshaya College of Engineering and Technology (acetcbe.edu.in) 3D Printing Club
 * Color Theme: Red Wine & Carrara Marble
 */

export const CATEGORIES = [
  { id: 'all', name: 'All Collections' },
  { id: 'new-launches', name: 'New Launches', badge: 'NEW' },
  { id: 'college-merch', name: 'College Merch' },
  { id: 'engineering-models', name: 'Engineering Models' },
  { id: 'figurines', name: 'Figurines & Collectibles' },
  { id: 'home-decor', name: 'Home & Desk Décor' },
  { id: 'custom-prints', name: 'Custom Prints & CAD' },
  { id: 'event-merch', name: 'Event & Fest Merch' },
  { id: 'alumni-gifting', name: 'Alumni Gifting', discount: 'CAMPUS PICKUP' }
];

export const PRODUCTS = [
  // 1. COLLEGE MERCH
  {
    id: 'acet-merch-01',
    title: 'ACET Institutional Crest Desk Monolith',
    category: 'college-merch',
    subcategory: 'Campus Identity',
    categoryLabel: 'College Merch',
    salePrice: 899,
    regularPrice: 1299,
    rating: 5.0,
    reviewCount: 84,
    badge: 'CAMPUS FAVORITE',
    badgeType: 'limited',
    isTrending: true,
    isBestSeller: true,
    isNewLaunch: false,
    isFeaturedCollab: true,
    geometryType: 'bust',
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80',
    imageHover: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80',
    description: 'Precision multi-layer 3D printed Akshaya College of Engineering & Technology insignia monument. Cast in Carrara marble composite with cold-cast gold leaf lettering.',
    specs: {
      resolution: '0.05 mm 12K SLA Resin',
      printTime: '11 Hours',
      dimensions: '14 x 10 x 6 cm',
      weight: '320g',
      infill: '100% Solid Heavy Base',
      warranty: 'Official ACET Club Guarantee'
    },
    materials: [
      { id: 'resin', name: 'Carrara Marble SLA Resin', delta: 0, color: '#fcf9f5' },
      { id: 'pla', name: 'Bordeaux Red Wine PLA', delta: -150, color: '#540d2a' },
      { id: 'metal', name: 'Gilded Brass Metal-Fill', delta: 450, color: '#d4af37' }
    ],
    sizes: [
      { id: 's', name: 'Desk Standard (14 cm)', scale: 1.0, priceMult: 1.0 },
      { id: 'm', name: 'Executive Alumnus (22 cm)', scale: 1.5, priceMult: 1.6 }
    ],
    reviews: [
      { author: 'Dr. S. K. Murugan (Faculty)', rating: 5, date: '3 days ago', verified: true, comment: 'The marble surface feel and crisp college lettering looks magnificent on faculty desks.' },
      { author: 'Kavitha R. (Batch of 2022)', rating: 5, date: '1 week ago', verified: true, comment: 'Proud to have this at my corporate office. Outstanding build quality by our junior makers!' }
    ]
  },

  // 2. ENGINEERING MODELS
  {
    id: 'acet-eng-01',
    title: 'Epicyclic Planetary Gearbox Assembly (Print-In-Place)',
    category: 'engineering-models',
    subcategory: 'Mechanical Assemblies',
    categoryLabel: 'Engineering Models',
    salePrice: 1499,
    regularPrice: 1999,
    rating: 4.9,
    reviewCount: 112,
    badge: 'PRINT-IN-PLACE',
    badgeType: 'new',
    isTrending: true,
    isBestSeller: true,
    isNewLaunch: false,
    isFeaturedCollab: false,
    geometryType: 'gearOrb',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    imageHover: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&auto=format&fit=crop&q=80',
    description: 'Fully functional 4:1 reduction planetary gearbox engineered with 0.15mm tolerance print-in-place kinematics. Features ceramic hybrid ball bearings for ultra-smooth desk rotation.',
    specs: {
      resolution: '0.12 mm Precision FDM',
      printTime: '14.5 Hours',
      dimensions: '15 x 15 x 12 cm',
      weight: '380g',
      infill: '50% High-Torque Hexagonal',
      warranty: '6-Month Mechanical Warranty'
    },
    materials: [
      { id: 'pla', name: 'Dual Silk Red Wine & Gold PLA', delta: 0, color: '#540d2a' },
      { id: 'nylon', name: 'Self-Lubricating PA12 Nylon', delta: 400, color: '#2c0916' },
      { id: 'metal', name: 'Bronze-Infused Kinetic Core', delta: 900, color: '#d4af37' }
    ],
    sizes: [
      { id: 'm', name: 'Working Demo (15 cm)', scale: 1.0, priceMult: 1.0 },
      { id: 'l', name: 'Classroom Lecture (25 cm)', scale: 1.6, priceMult: 1.8 }
    ],
    reviews: [
      { author: 'Prof. Ramesh N. (Mech Dept)', rating: 5, date: '5 days ago', verified: true, comment: 'Phenomenal teaching aid for kinematics. Zero binding across all planet gears.' }
    ]
  },
  {
    id: 'acet-eng-02',
    title: 'Dual-Rotor Wind Turbine Nacelle Section',
    category: 'engineering-models',
    subcategory: 'Renewable Tech Demo',
    categoryLabel: 'Engineering Models',
    salePrice: 1899,
    regularPrice: 2499,
    rating: 4.8,
    reviewCount: 47,
    badge: 'EDUCATIONAL',
    badgeType: 'sale',
    isTrending: false,
    isBestSeller: false,
    isNewLaunch: true,
    isFeaturedCollab: false,
    geometryType: 'architecturalTower',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&auto=format&fit=crop&q=80',
    imageHover: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&auto=format&fit=crop&q=80',
    description: 'Detailed cutaway model of a modern wind turbine nacelle with internal planetary gearing, generator rotor, and pitch mechanism.',
    specs: {
      resolution: '0.08 mm Micro Layer',
      printTime: '22 Hours',
      dimensions: '20 x 12 x 18 cm',
      weight: '450g',
      infill: '40% Gyroid',
      warranty: 'Classroom Demonstration Certified'
    },
    materials: [
      { id: 'resin', name: 'Optical Clear & White Resin', delta: 0, color: '#fcf9f5' },
      { id: 'pla', name: 'Tough Red Wine PLA', delta: -200, color: '#540d2a' }
    ],
    sizes: [
      { id: 'm', name: 'Desktop Demo (20 cm)', scale: 1.0, priceMult: 1.0 }
    ],
    reviews: [
      { author: 'Praveen K. (EEE Final Year)', rating: 5, date: '2 weeks ago', verified: true, comment: 'Used this for my final year seminar presentation. Judges were thoroughly impressed!' }
    ]
  },

  // 3. FIGURINES & COLLECTIBLES
  {
    id: 'acet-fig-01',
    title: 'Lord Shiva Meditative Form (Parametric Carrara)',
    category: 'figurines',
    subcategory: 'Heritage Sculptures',
    categoryLabel: 'Figurines & Collectibles',
    salePrice: 3299,
    regularPrice: 4299,
    rating: 5.0,
    reviewCount: 236,
    badge: 'ORIGINAL DESIGN',
    badgeType: 'limited',
    isTrending: true,
    isBestSeller: true,
    isNewLaunch: false,
    isFeaturedCollab: true,
    geometryType: 'bust',
    image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=800&auto=format&fit=crop&q=80',
    imageHover: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80',
    description: 'Timeless spiritual sculpture blended with computational Voronoi geometries. 3D printed in real Carrara marble-dust composite with hand-applied gold leaf highlights.',
    specs: {
      resolution: '0.05 mm (50 Micron SLA)',
      printTime: '28 Hours',
      dimensions: '22 x 14 x 14 cm',
      weight: '680g Weighted',
      infill: 'Dense Mineral Resin Core',
      warranty: 'Lifetime Craftsmanship Assurance'
    },
    materials: [
      { id: 'resin', name: 'Carrara White Marble Composite', delta: 0, color: '#fcf9f5' },
      { id: 'pla', name: 'Bordeaux Matte Red Wine', delta: -400, color: '#540d2a' },
      { id: 'metal', name: 'Antique Gold Bronze Fill', delta: 1200, color: '#d4af37' }
    ],
    sizes: [
      { id: 'm', name: 'Altar Scale (22 cm)', scale: 1.0, priceMult: 1.0 },
      { id: 'l', name: 'Grand Entrance (36 cm)', scale: 1.6, priceMult: 2.2 }
    ],
    reviews: [
      { author: 'Anand Sundaram (Alumnus)', rating: 5, date: 'Yesterday', verified: true, comment: 'The marble texture feels cool and weighty like natural stone. Masterpiece!' }
    ]
  },
  {
    id: 'acet-fig-02',
    title: 'Cyber Ronin Mecha Bust (Kinathukadavu Edition)',
    category: 'figurines',
    subcategory: 'Sci-Fi Collectibles',
    categoryLabel: 'Figurines & Collectibles',
    salePrice: 2799,
    regularPrice: 3699,
    rating: 4.9,
    reviewCount: 165,
    badge: 'BESTSELLER',
    badgeType: 'sale',
    isTrending: true,
    isBestSeller: true,
    isNewLaunch: false,
    isFeaturedCollab: false,
    geometryType: 'bust',
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80',
    imageHover: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80',
    description: 'High-detail 50-micron SLA resin printed cybernetic warrior bust with removable magnetic faceplate and brushed wine patina accents.',
    specs: {
      resolution: '0.05 mm Ultra-SLA',
      printTime: '19 Hours',
      dimensions: '18 x 12 x 10 cm',
      weight: '490g',
      infill: 'Solid Core UV Cured',
      warranty: '6-Month Finish Guarantee'
    },
    materials: [
      { id: 'pla', name: 'Matte Wine PLA', delta: 0, color: '#540d2a' },
      { id: 'resin', name: '8K Ultra Tough Resin', delta: 500, color: '#fcf9f5' },
      { id: 'metal', name: 'Brass-Infused Metal', delta: 1400, color: '#d4af37' }
    ],
    sizes: [
      { id: 's', name: 'Desk (12 cm)', scale: 0.7, priceMult: 0.75 },
      { id: 'm', name: 'Studio (18 cm)', scale: 1.0, priceMult: 1.0 }
    ],
    reviews: [
      { author: 'Dinesh V. (CSE 3rd Year)', rating: 5, date: '4 days ago', verified: true, comment: 'Picked this up directly at the Kinathukadavu 3D Lab. Flawless surface finish.' }
    ]
  },

  // 4. HOME & DESK DÉCOR
  {
    id: 'acet-decor-01',
    title: 'Fibonacci Voronoi Ambient Marble Lamp',
    category: 'home-decor',
    subcategory: 'Lamps & Lighting',
    categoryLabel: 'Home & Desk Décor',
    salePrice: 3999,
    regularPrice: 4999,
    rating: 4.9,
    reviewCount: 189,
    badge: 'GOLDEN RATIO',
    badgeType: 'limited',
    isTrending: true,
    isBestSeller: true,
    isNewLaunch: false,
    isFeaturedCollab: false,
    geometryType: 'voronoiLamp',
    image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&auto=format&fit=crop&q=80',
    imageHover: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80',
    description: 'Parametric Voronoi lattice lamp printed in translucent marble-polymer casting warm ambient golden shadows. Equipped with touch-dimming warm LED core.',
    specs: {
      resolution: '0.12 mm Spiral Continuous',
      printTime: '32 Hours',
      dimensions: '30 x 18 x 18 cm',
      weight: '780g',
      infill: '100% Watertight Shell',
      warranty: '1-Year Electronics & Structural Warranty'
    },
    materials: [
      { id: 'resin', name: 'Translucent Marble White', delta: 0, color: '#fcf9f5' },
      { id: 'pla', name: 'Burgundy Velvet PLA', delta: 300, color: '#540d2a' }
    ],
    sizes: [
      { id: 'm', name: 'Tabletop (30 cm)', scale: 1.0, priceMult: 1.0 },
      { id: 'l', name: 'Lounge Grand (48 cm)', scale: 1.6, priceMult: 2.1 }
    ],
    reviews: [
      { author: 'Meenakshi Sundaram', rating: 5, date: '1 week ago', verified: true, comment: 'The lighting pattern in the evening transforms the entire living room atmosphere.' }
    ]
  },
  {
    id: 'acet-decor-02',
    title: 'Parametric Fluidity Ribbon Vase (Waterproof)',
    category: 'home-decor',
    subcategory: 'Vases & Planters',
    categoryLabel: 'Home & Desk Décor',
    salePrice: 1799,
    regularPrice: 2399,
    rating: 4.8,
    reviewCount: 72,
    badge: 'WATERPROOF',
    badgeType: 'new',
    isTrending: false,
    isBestSeller: false,
    isNewLaunch: true,
    isFeaturedCollab: false,
    geometryType: 'ribbonVase',
    image: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=800&auto=format&fit=crop&q=80',
    imageHover: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?w=800&auto=format&fit=crop&q=80',
    description: 'Algorithmic twisted wave vase with internally bonded resin waterproof lining for fresh flower arrangements and floral stems.',
    specs: {
      resolution: '0.15 mm Continuous Vase Mode',
      printTime: '13 Hours',
      dimensions: '25 x 14 x 14 cm',
      weight: '390g',
      infill: '100% Watertight Perimeters',
      warranty: 'Leak-Proof Assurance'
    },
    materials: [
      { id: 'pla', name: 'Deep Merlot Wine PLA', delta: 0, color: '#540d2a' },
      { id: 'resin', name: 'Carrara Marble Resin', delta: 450, color: '#fcf9f5' },
      { id: 'metal', name: 'Polished Brass Hybrid', delta: 950, color: '#d4af37' }
    ],
    sizes: [
      { id: 'm', name: 'Standard (25 cm)', scale: 1.0, priceMult: 1.0 },
      { id: 'l', name: 'Statement (36 cm)', scale: 1.4, priceMult: 1.7 }
    ],
    reviews: [
      { author: 'Swetha P. (Architecture)', rating: 5, date: '2 weeks ago', verified: true, comment: 'Holds water perfectly without any moisture seepage. Gorgeous organic curves!' }
    ]
  },

  // 5. EVENT & FEST MERCH
  {
    id: 'acet-event-01',
    title: 'Akshaya Techday & Science Fest Winner Trophy',
    category: 'event-merch',
    subcategory: 'Awards & Mementos',
    categoryLabel: 'Event & Fest Merch',
    salePrice: 1999,
    regularPrice: 2699,
    rating: 5.0,
    reviewCount: 94,
    badge: 'OFFICIAL FEST MERCH',
    badgeType: 'limited',
    isTrending: false,
    isBestSeller: true,
    isNewLaunch: false,
    isFeaturedCollab: true,
    geometryType: 'architecturalTower',
    image: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80',
    imageHover: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80',
    description: 'Official annual symposium trophy featuring parametric helical spire, laser-engraved gold plaque, and weighted marble composite plinth.',
    specs: {
      resolution: '0.06 mm High Precision',
      printTime: '16 Hours',
      dimensions: '26 x 10 x 10 cm',
      weight: '720g Plinth',
      infill: 'Solid Mineral Base',
      warranty: 'ACET Annual Fest Certified'
    },
    materials: [
      { id: 'resin', name: 'Carrara Marble & Gold Foil', delta: 0, color: '#fcf9f5' },
      { id: 'pla', name: 'Wine Velvet with Gold Engraving', delta: -200, color: '#540d2a' }
    ],
    sizes: [
      { id: 'm', name: 'Standard Trophy (26 cm)', scale: 1.0, priceMult: 1.0 }
    ],
    reviews: [
      { author: 'Student Council President', rating: 5, date: '1 month ago', verified: true, comment: 'Supplied 60 trophies for our National Symposium. Delivered right on schedule!' }
    ]
  },

  // 6. ALUMNI GIFTING
  {
    id: 'acet-alumni-01',
    title: 'Monolithic Gilded Brass Alumnus Plaque',
    category: 'alumni-gifting',
    subcategory: 'Honorary Mementos',
    categoryLabel: 'Alumni Gifting',
    salePrice: 2499,
    regularPrice: 3299,
    rating: 5.0,
    reviewCount: 58,
    badge: 'ALUMNI EXCLUSIVE',
    badgeType: 'limited',
    isTrending: false,
    isBestSeller: false,
    isNewLaunch: true,
    isFeaturedCollab: true,
    geometryType: 'bust',
    image: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?w=800&auto=format&fit=crop&q=80',
    imageHover: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&auto=format&fit=crop&q=80',
    description: 'Customizable commemorative gift with student name, batch year, and department deeply relief-carved in solid cold-cast brass and red wine enamel.',
    specs: {
      resolution: '0.04 mm 12K SLA',
      printTime: '18 Hours',
      dimensions: '20 x 15 x 4 cm',
      weight: '850g Weighted',
      infill: '100% Solid Brass Infusion',
      warranty: 'Lifetime Commemorative Assurance'
    },
    materials: [
      { id: 'metal', name: 'Cold-Cast Brass & Wine Enamel', delta: 0, color: '#d4af37' },
      { id: 'resin', name: 'Pure Marble Dust Composite', delta: -300, color: '#fcf9f5' }
    ],
    sizes: [
      { id: 'm', name: 'Executive Plaque (20 cm)', scale: 1.0, priceMult: 1.0 }
    ],
    reviews: [
      { author: 'Rajesh Kumar (Batch 2018)', rating: 5, date: '3 weeks ago', verified: true, comment: 'Presented to our reunion batch. Premium packaging and heartwarming finish.' }
    ]
  }
];

export const LIFESTYLE_BANNERS = [
  {
    title: 'Official College Merch',
    subtitle: 'ACET Insignia, Department Mascots & Keychains',
    tag: 'CAMPUS PRIDE',
    gridClass: 'col-6',
    image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=900&auto=format&fit=crop&q=80',
    linkCategoryId: 'college-merch'
  },
  {
    title: 'CSE Academic & Engineering Models',
    subtitle: 'Working Print-in-Place Gearboxes & Demonstrators',
    tag: 'CSE MAKER LAB',
    gridClass: 'col-6',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=900&auto=format&fit=crop&q=80',
    linkCategoryId: 'engineering-models'
  },
  {
    title: 'Carrara Marble Heritage Art',
    subtitle: '50-Micron SLA Fine Art & Devotional Sculptures',
    tag: 'ARTISAN FINISH',
    gridClass: 'col-4',
    image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=700&auto=format&fit=crop&q=80',
    linkCategoryId: 'figurines'
  },
  {
    title: 'Custom Photo & CAD Studio',
    subtitle: 'Rapid Prototyping for Student & Industry Projects',
    tag: 'COMMISSIONS OPEN',
    gridClass: 'col-4',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=700&auto=format&fit=crop&q=80',
    linkCategoryId: 'custom-prints'
  },
  {
    title: 'Techday & Fest Trophy Drops',
    subtitle: 'Bespoke Mementos for Symposiums & Alumni',
    tag: 'BULK CAMPUS ORDERS',
    gridClass: 'col-4',
    image: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=700&auto=format&fit=crop&q=80',
    linkCategoryId: 'event-merch'
  }
];

export const STUDIOS = [
  {
    city: 'Kinathukadavu Campus',
    name: 'ACET 3D Printing Maker Lab',
    address: 'Akshaya College of Engineering and Technology, Kinathukadavu, Coimbatore, Tamil Nadu 642109',
    hours: 'Mon – Sat: 8:30 AM – 5:30 PM IST',
    phone: '+91 4259 242570 / +91 97894 44111',
    images: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=400&auto=format&fit=crop&q=80'
    ]
  },
  {
    city: 'Coimbatore Hub',
    name: 'ACET Innovation & Industry Incubation Hub',
    address: 'Avinashi Road, Peelamedu, Coimbatore, Tamil Nadu 641004',
    hours: 'Mon – Fri: 9:00 AM – 6:00 PM IST',
    phone: '+91 422 257 8899',
    images: [
      'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&auto=format&fit=crop&q=80'
    ]
  }
];

export const TESTIMONIALS = [
  {
    quote: 'The ACET 3D Printing Club printed our entire UAV frame prototype in carbon-reinforced nylon. The dimensional accuracy directly contributed to our team winning the National Hackathon.',
    author: 'Sanjay Manikandan',
    role: 'Aero & Mech Club Lead, ACET',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    productPurchased: 'Epicyclic Planetary Gearbox Assembly'
  },
  {
    quote: 'Ordered the Carrara Marble Shiva sculpture for my home temple. It feels exactly like polished marble with the precision of 50-micron SLA. Heartiest congratulations to Akshaya makers!',
    author: 'Lakshmi Narayanan',
    role: 'Alumnus & Tech Lead, Bengaluru',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    productPurchased: 'Lord Shiva Meditative Form'
  },
  {
    quote: 'Our department ordered 50 customized gilded trophies for the International Conference. Flawless gold detailing, on-time campus pickup, and fantastic student coordination.',
    author: 'Dr. Mythili S.',
    role: 'Head of Department, CSE',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
    productPurchased: 'Akshaya Techday & Science Fest Winner Trophy'
  }
];
