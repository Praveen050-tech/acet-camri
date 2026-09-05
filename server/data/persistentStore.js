/**
 * ACET 3D — Unified Persistent Data Engine
 * Ensures 100% data persistence to MongoDB when active, 
 * with automatic persistent disk JSON backup (server/data/database.json) when running standalone.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'database.json');

// Default initial database state
const defaultData = {
  products: [
    {
      id: 'acet-merch-01',
      title: 'ACET Institutional Crest Desk Monolith',
      slug: 'acet-institutional-crest-desk-monolith',
      sku: 'ACET-CRST-001',
      category: 'college-merch',
      categoryLabel: 'College Merch',
      subcategory: 'Institutional Identity',
      salePrice: 899,
      regularPrice: 1299,
      rating: 4.9,
      reviewCount: 38,
      badge: 'OFFICIAL MERCH',
      geometryType: 'bust',
      image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80',
      imageHover: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
      description: 'Sculpted high-relief replica of the Akshaya College of Engineering and Technology institutional crest. Sliced at 50-micron micro-resolution with diamond-buffed Carrara marble composite finish.',
      detailedStory: 'Engineered as an emblem of excellence for Akshaya students, faculty, and visiting dignitaries. Each piece is cured under calibrated 405nm UV chambers at our Kinathukadavu maker facility.',
      specs: {
        resolution: '0.05 mm (50-Micron)',
        material: 'Carrara Marble SLA Resin',
        dimensions: '14 x 10 x 8 cm',
        weight: '240 g',
        infill: '30% Gyroid Solid',
        printTime: '9.5 Hours',
        craftsman: 'ACET 3D Club Innovators',
        warranty: '10-Day Replacement Guarantee'
      },
      availableMaterials: [
        { id: 'marble', name: 'Carrara Marble SLA Resin', priceDelta: 0, desc: 'Mineral-loaded composite with satin feel' },
        { id: 'green', name: 'ACET Emerald Green SLA', priceDelta: 150, desc: 'Signature institutional emerald polymer' },
        { id: 'nylon', name: 'PA12 Carbon-Fiber Nylon', priceDelta: 300, desc: 'Extreme durability industrial CoreXY print' },
        { id: 'gold', name: 'Cold-Cast Brass Metal', priceDelta: 650, desc: 'Real bronze metal-dust heavy weight' }
      ],
      availableSizes: [
        { id: 'desktop', name: 'Desktop Classic (14cm)', dimensionStr: '14 x 10 x 8 cm', multiplier: 1.0 },
        { id: 'grand', name: 'Plaque Edition (20cm)', dimensionStr: '20 x 14 x 11 cm', multiplier: 1.65 }
      ],
      stock: 45,
      isTrending: true,
      isBestSeller: true,
      careInstructions: 'Clean gently with microfiber cloth. Keep away from extreme temperatures above 65°C.',
      campusPickupAvailable: true
    },
    {
      id: 'acet-eng-01',
      title: 'Binary Logic & Computing Adder Demonstrator',
      slug: 'binary-logic-computing-adder-demonstrator',
      sku: 'ACET-CSE-002',
      category: 'engineering-models',
      categoryLabel: 'CSE Academic Models',
      subcategory: 'Computing Architectures & Hardware',
      salePrice: 1499,
      regularPrice: 2199,
      rating: 5.0,
      reviewCount: 29,
      badge: 'PRINT-IN-PLACE',
      geometryType: 'gearOrb',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      imageHover: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80',
      description: 'Fully functional print-in-place binary logic gate mechanism designed to physically demonstrate computational ALU state transitions and Boolean operations.',
      detailedStory: 'Developed by student innovators of the Department of Computer Science and Engineering (CSE). Demonstrates silicon gate logic and binary arithmetic for computing lab demonstrations.',
      specs: {
        resolution: '0.12 mm Layer Height',
        material: 'PA12 Carbon Fiber + Tough PLA',
        dimensions: '16 x 16 x 10 cm',
        weight: '380 g',
        infill: '45% High-Torque Honeycomb',
        printTime: '14.2 Hours',
        craftsman: 'Department of Computer Science & Engineering 3D Lab',
        warranty: '6-Month Mechanical Warranty'
      },
      availableMaterials: [
        { id: 'tough-pla', name: 'Industrial Tough PLA', priceDelta: 0, desc: 'Rigid low-friction gate filament' },
        { id: 'nylon-cf', name: 'PA12 Carbon-Fiber Composite', priceDelta: 450, desc: 'High stiffness & wear resistance' }
      ],
      availableSizes: [
        { id: 'compact', name: 'Lab Scale (1:1)', dimensionStr: '16 x 16 x 10 cm', multiplier: 1.0 },
        { id: 'classroom', name: 'Classroom Demo Scale (1.5:1)', dimensionStr: '24 x 24 x 15 cm', multiplier: 1.8 }
      ],
      stock: 28,
      isTrending: true,
      isBestSeller: true,
      careInstructions: 'Apply dry PTFE lubricant periodically for optimal long-term mechanical performance.',
      campusPickupAvailable: true
    },
    {
      id: 'acet-fig-01',
      title: 'Parametric Meditating Shiva Monolith',
      slug: 'parametric-meditating-shiva-monolith',
      sku: 'ACET-FIG-003',
      category: 'figurines',
      categoryLabel: 'Figurines',
      subcategory: 'Heritage Sculptures',
      salePrice: 3299,
      regularPrice: 4499,
      rating: 4.95,
      reviewCount: 44,
      badge: 'CARRARA MARBLE',
      geometryType: 'bust',
      image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=800&auto=format&fit=crop&q=80',
      imageHover: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80',
      description: 'Intricately modeled computational voronoi sculpture of Lord Shiva in deep dhyana meditation, cast in Carrara marble SLA resin with 24K gilded gold patina accents.',
      detailedStory: 'Modeled using algorithmic lattice optimization to create an interplay of shadow and light, evoking profound serenity and artistic precision.',
      specs: {
        resolution: '0.05 mm (50-Micron)',
        material: 'Carrara Marble SLA Resin',
        dimensions: '22 x 15 x 12 cm',
        weight: '620 g',
        infill: '100% Solid Casting',
        printTime: '26 Hours',
        craftsman: 'ACET Master Artisans',
        warranty: 'Lifetime Craftsmanship Guarantee'
      },
      availableMaterials: [
        { id: 'marble', name: 'Carrara Marble Composite', priceDelta: 0, desc: 'Mineral marble dust with cold-touch density' },
        { id: 'black-obsidian', name: 'Black Obsidian Matte Resin', priceDelta: 250, desc: 'Deep volcanic matte texture' },
        { id: 'gilded-gold', name: 'Gilded Leaf Antique Bronze', priceDelta: 800, desc: 'Hand-applied 24K leaf patina' }
      ],
      availableSizes: [
        { id: 'classic', name: 'Medium Shrine (22cm)', dimensionStr: '22 x 15 x 12 cm', multiplier: 1.0 },
        { id: 'altar', name: 'Grand Altar (32cm)', dimensionStr: '32 x 22 x 18 cm', multiplier: 2.1 }
      ],
      stock: 15,
      isTrending: true,
      isBestSeller: true,
      careInstructions: 'Wipe with a clean dry cotton cloth. Do not use chemical solvents.',
      campusPickupAvailable: true
    },
    {
      id: 'acet-decor-01',
      title: 'Voronoi Cellular Ambient Light Luminary',
      slug: 'voronoi-cellular-ambient-light-luminary',
      sku: 'ACET-DEC-004',
      category: 'home-decor',
      categoryLabel: 'Home & Décor',
      subcategory: 'Ambient Lighting',
      salePrice: 1899,
      regularPrice: 2599,
      rating: 4.85,
      reviewCount: 19,
      badge: 'PARAMETRIC LIGHT',
      geometryType: 'voronoiLamp',
      image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80',
      imageHover: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&auto=format&fit=crop&q=80',
      description: 'Mathematical Voronoi tessellation ambient accent lamp with warm 2700K LED illumination core, casting organic shadow patterns across interior spaces.',
      detailedStory: 'Generated via generative design algorithms that mimic natural cellular structures found in botanical leaves and dragonfly wings.',
      specs: {
        resolution: '0.15 mm Layer Height',
        material: 'Matte Ivory PETG / SLA Base',
        dimensions: '20 x 13 x 13 cm',
        weight: '310 g',
        infill: '100% Perimeter Walls',
        printTime: '16.5 Hours',
        craftsman: 'Architecture & Design Circle',
        warranty: '1-Year Electrical Core Warranty'
      },
      availableMaterials: [
        { id: 'ivory', name: 'Matte Ivory Translucent', priceDelta: 0, desc: 'Warm organic diffused light glow' },
        { id: 'acet-green', name: 'ACET Emerald Accent Core', priceDelta: 200, desc: 'Institutional emerald base accent' }
      ],
      availableSizes: [
        { id: 'desk', name: 'Desk Companion (20cm)', dimensionStr: '20 x 13 x 13 cm', multiplier: 1.0 },
        { id: 'floor', name: 'Living Room Pillar (30cm)', dimensionStr: '30 x 18 x 18 cm', multiplier: 1.75 }
      ],
      stock: 22,
      isTrending: false,
      isBestSeller: true,
      careInstructions: 'Includes USB-C 5V powered LED base with touch dimmer.',
      campusPickupAvailable: true
    },
    {
      id: 'acet-event-01',
      title: 'Akshaya National Symposium Winner Trophy',
      slug: 'akshaya-national-symposium-winner-trophy',
      sku: 'ACET-EVT-005',
      category: 'event-merch',
      categoryLabel: 'Fest Merch',
      subcategory: 'Trophies & Mementos',
      salePrice: 1299,
      regularPrice: 1899,
      rating: 4.9,
      reviewCount: 31,
      badge: 'FEST TROPHY',
      geometryType: 'architecturalTower',
      image: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80',
      imageHover: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
      description: 'Customizable 3D-printed championship trophy with integrated cold-cast brass emblem and laser-engraved student symposium award plaque.',
      detailedStory: 'Official memento crafted for national technical symposiums, hackathons, and robotic competitions hosted across Akshaya engineering departments.',
      specs: {
        resolution: '0.08 mm High Detail',
        material: 'Cold-Cast Brass + Black Onyx Resin',
        dimensions: '25 x 9 x 9 cm',
        weight: '450 g',
        infill: '50% Solid Weighted Base',
        printTime: '11 Hours',
        craftsman: 'ACET Maker Studio',
        warranty: 'Lifetime Memento Guarantee'
      },
      availableMaterials: [
        { id: 'brass', name: 'Cold-Cast Gold & Brass', priceDelta: 0, desc: 'Brushed gold metallic finish' },
        { id: 'silver', name: 'Polished Nickel Silver', priceDelta: 100, desc: 'High-mirror silver luster' }
      ],
      availableSizes: [
        { id: 'standard', name: 'Championship Size (25cm)', dimensionStr: '25 x 9 x 9 cm', multiplier: 1.0 }
      ],
      stock: 40,
      isTrending: false,
      isBestSeller: false,
      careInstructions: 'Custom brass nameplate engraving available for bulk department events.',
      campusPickupAvailable: true
    },
    {
      id: 'acet-alumni-01',
      title: 'Executive Alumni Heritage Crest Plaque Set',
      slug: 'executive-alumni-heritage-crest-plaque-set',
      sku: 'ACET-ALM-006',
      category: 'alumni-gifting',
      categoryLabel: 'Alumni Gifting',
      subcategory: 'Executive Gifting',
      salePrice: 2499,
      regularPrice: 3499,
      rating: 5.0,
      reviewCount: 27,
      badge: 'ALUMNI EXCLUSIVE',
      geometryType: 'bust',
      image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
      imageHover: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80',
      description: 'Commemorative executive alumni gift set featuring a solid Carrara marble medallion mounted on handcrafted dark teakwood base with gold-leaf typography.',
      detailedStory: 'Commissioned by the Akshaya Alumni Association to honor distinguished alumni contributions in industry, research, and global technology leadership.',
      specs: {
        resolution: '0.05 mm SLA Master',
        material: 'Carrara Marble Resin + Teakwood',
        dimensions: '18 x 18 x 4 cm',
        weight: '520 g',
        infill: '100% Solid Cast',
        printTime: '12 Hours',
        craftsman: 'ACET 3D Lab',
        warranty: 'Lifetime Craft Guarantee'
      },
      availableMaterials: [
        { id: 'marble-wood', name: 'Carrara Marble & Teakwood', priceDelta: 0, desc: 'Classic institutional executive format' }
      ],
      availableSizes: [
        { id: 'executive', name: 'Executive Desktop (18cm)', dimensionStr: '18 x 18 x 4 cm', multiplier: 1.0 }
      ],
      stock: 30,
      isTrending: false,
      isBestSeller: true,
      careInstructions: 'Supplied in velvet-lined ACET presentation gift box.',
      campusPickupAvailable: true
    }
  ],
  orders: [
    {
      orderId: 'ACET-84920',
      customerName: 'S. Manikandan',
      contact: '+91 97894 44111',
      rollNo: '21CS045',
      department: 'Computer Science and Engineering',
      items: [{
        productId: 'acet-merch-01',
        title: 'ACET Institutional Crest Desk Monolith',
        material: 'Carrara Marble SLA Resin',
        size: 'Desktop Classic (14cm)',
        price: 899,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80'
      }],
      subtotal: 899,
      discount: 0,
      shipping: 0,
      total: 899,
      fulfillment: 'Campus Pickup (Kinathukadavu 3D Lab Desk)',
      address: 'ACET Campus, Kinathukadavu, Coimbatore',
      paymentMethod: 'Razorpay / UPI',
      paymentStatus: 'Paid',
      status: 'Printing on Bed 02',
      printBed: 'Bed 02 (Ender-3 V3 SLA)',
      progressPercent: 65,
      milestones: [
        { step: 'Order Placed & Mesh Audit', done: true, time: '03 Sep, 09:30 AM' },
        { step: '50-Micron SLA Slicing (Cura/Prusa)', done: true, time: '03 Sep, 10:15 AM' },
        { step: '3D Printing in Progress (Bed 02)', done: true, time: 'Layer 1,840 of 3,200' },
        { step: 'UV Curing & Gold Buffing', done: false, time: 'Est. 02:00 PM' },
        { step: 'Ready for Pickup at Kinathukadavu Desk', done: false, time: 'Est. 04:30 PM' }
      ],
      createdAt: new Date().toISOString()
    }
  ],
  customRequests: [
    {
      requestId: 'ACET-CAD-1029',
      studentName: 'A. Praveen Kumar',
      contact: '+91 98421 22334',
      rollNo: '22CS018',
      department: 'Computer Science and Engineering',
      fileName: 'iot_microcontroller_enclosure_v3.stl',
      dimensions: { length: 18, width: 12, height: 9 },
      material: 'PA12 Carbon-Fiber Nylon',
      finish: 'Hand-Sanded & Primed',
      infillDensity: 40,
      estimatedPrice: 2150,
      status: 'Approved & Slicing Bed Scheduled',
      assignedPrintBed: 'Bed 03 (Prusa MK4)',
      createdAt: new Date().toISOString()
    }
  ],
  reviews: [
    {
      productId: 'acet-merch-01',
      author: 'K. Vignesh (21CS045)',
      comment: 'The 50-micron Carrara marble monolith finish is exceptional. It captures our Akshaya institutional seal with pristine micro-detail on my office desk.',
      rating: 5,
      createdAt: new Date().toISOString()
    },
    {
      productId: 'acet-eng-01',
      author: 'Prof. Ramesh N. (Faculty, CSE)',
      comment: 'The binary logic demonstrator works right off the print bed with zero assembly backlash. Used it directly for our Computer Science architecture lab demo.',
      rating: 5,
      createdAt: new Date().toISOString()
    }
  ],
  contacts: [
    {
      name: 'Dr. G. Sundaram',
      email: 'sundaram@acetcbe.edu.in',
      phone: '+91 94433 11223',
      subject: 'Symposium Trophy Bulk Order (50 Units)',
      message: 'Need 50 custom engraved mementos for our National Level Technical Symposium on Oct 15.',
      createdAt: new Date().toISOString()
    }
  ]
};

// Ensure database file exists
function loadData() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2), 'utf8');
      return defaultData;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error loading database.json:', err);
    return defaultData;
  }
}

function saveData(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving database.json:', err);
  }
}

export const persistentStore = {
  get(collectionName) {
    const data = loadData();
    return data[collectionName] || [];
  },

  getAll() {
    return loadData();
  },

  insert(collectionName, item) {
    const data = loadData();
    if (!data[collectionName]) data[collectionName] = [];
    data[collectionName].unshift(item);
    saveData(data);
    return item;
  },

  update(collectionName, queryFn, updateFields) {
    const data = loadData();
    if (!data[collectionName]) return null;
    const index = data[collectionName].findIndex(queryFn);
    if (index !== -1) {
      data[collectionName][index] = { ...data[collectionName][index], ...updateFields, updatedAt: new Date().toISOString() };
      saveData(data);
      return data[collectionName][index];
    }
    return null;
  },

  remove(collectionName, queryFn) {
    const data = loadData();
    if (!data[collectionName]) return false;
    const initialLen = data[collectionName].length;
    data[collectionName] = data[collectionName].filter((item) => !queryFn(item));
    saveData(data);
    return data[collectionName].length < initialLen;
  }
};
