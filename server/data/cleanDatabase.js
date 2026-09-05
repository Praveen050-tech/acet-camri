import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'database.json');

const canonicalProducts = [
  {
    id: "acet-crest-monolith",
    name: "ACET Official Crest & Institutional Seal Monolith",
    title: "ACET Official Crest & Institutional Seal Monolith",
    slug: "acet-crest-monolith",
    sku: "ACET-CRST-001",
    category: "College Merch",
    categoryLabel: "College Merch",
    subcategory: "Institutional Identity",
    salePrice: 899,
    basePrice: 1299,
    regularPrice: 1299,
    rating: 4.9,
    ratingAvg: 4.9,
    ratingCount: 38,
    reviewCount: 38,
    stock: 45,
    printTimeHours: 6,
    weightGrams: 160,
    isTrending: true,
    isBestSeller: true,
    badge: "OFFICIAL MERCH",
    images: [
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80"
    ],
    image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80",
    imageHover: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",
    description: "Sculpted high-relief replica of the Akshaya College of Engineering and Technology institutional crest. Sliced at 50-micron micro-resolution with diamond-buffed Carrara marble composite finish.",
    detailedStory: "Engineered as an emblem of excellence for Akshaya students, faculty, and visiting dignitaries. Each piece is cured under calibrated 405nm UV chambers at our Kinathukadavu maker facility.",
    careInstructions: "Clean gently with microfiber cloth. Keep away from extreme temperatures above 65°C.",
    materials: [
      { name: "PLA Pro (Matte Burgundy)", priceDelta: 0, desc: "Standard institutional burgundy polymer" },
      { name: "Cold-Cast Brass Resin", priceDelta: 450, desc: "Real bronze metal-dust heavy weight" },
      { name: "Carrara Marble Composite", priceDelta: 800, desc: "Mineral-loaded composite with satin feel" }
    ],
    sizes: [
      { label: "Standard Desktop (10cm)", name: "Desktop Classic (10cm)", priceDelta: 0 },
      { label: "Executive Pedestal (18cm)", name: "Executive Pedestal (18cm)", priceDelta: 500 }
    ],
    campusPickupAvailable: true,
    createdAt: "2026-08-30T10:00:00.000Z",
    updatedAt: "2026-09-04T10:00:00.000Z"
  },
  {
    id: "planetary-reduction-gearbox",
    name: "4:1 Planetary Reduction Gearbox (Print-in-Place)",
    title: "4:1 Planetary Reduction Gearbox (Print-in-Place)",
    slug: "planetary-reduction-gearbox",
    sku: "ACET-ENG-002",
    category: "Engineering Models",
    categoryLabel: "Engineering Models",
    subcategory: "Kinematics & Machine Design",
    salePrice: 1149,
    basePrice: 1499,
    regularPrice: 1499,
    rating: 5.0,
    ratingAvg: 5.0,
    ratingCount: 29,
    reviewCount: 29,
    stock: 25,
    printTimeHours: 8,
    weightGrams: 220,
    isTrending: true,
    isBestSeller: true,
    badge: "PRINT-IN-PLACE",
    images: [
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80"
    ],
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",
    imageHover: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
    description: "Fully functional 4:1 epicyclic reduction gear assembly printed in a single pass without assembly. Demonstrates kinematic engineering mechanics with zero backlash.",
    detailedStory: "Engineered and validated by student innovators of the Department of Computer Science and Engineering (CSE). Demonstrates precision mechanical tolerances for laboratory viva and robotics prototyping.",
    careInstructions: "Use dry silicone lubricant for continuous high-speed rotation demonstration.",
    materials: [
      { name: "PETG High-Toughness", priceDelta: 0, desc: "Impact resistant tough polymer" },
      { name: "Carbon Fiber Nylon (PA12-CF)", priceDelta: 600, desc: "High tensile structural composite" }
    ],
    sizes: [
      { label: "100mm Ratio Test", name: "100mm Ratio Test", priceDelta: 0 },
      { label: "150mm Demonstration Rig", name: "150mm Demonstration Rig", priceDelta: 400 }
    ],
    campusPickupAvailable: true,
    createdAt: "2026-08-30T10:00:00.000Z",
    updatedAt: "2026-09-04T10:00:00.000Z"
  },
  {
    id: "voronoi-adiyogi-shiva",
    name: "Computational Voronoi Adiyogi Shiva Monolith",
    title: "Computational Voronoi Adiyogi Shiva Monolith",
    slug: "voronoi-adiyogi-shiva",
    sku: "ACET-FIG-003",
    category: "Spiritual Figurines",
    categoryLabel: "Spiritual Figurines",
    subcategory: "Computational Sacred Art",
    salePrice: 3299,
    basePrice: 4299,
    regularPrice: 4299,
    rating: 5.0,
    ratingAvg: 5.0,
    ratingCount: 64,
    reviewCount: 64,
    stock: 12,
    printTimeHours: 14,
    weightGrams: 420,
    isTrending: true,
    isBestSeller: true,
    badge: "50-MICRON SLA",
    images: [
      "https://images.unsplash.com/photo-1608889175123-8ee362201f81?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=800&auto=format&fit=crop&q=80"
    ],
    image: "https://images.unsplash.com/photo-1608889175123-8ee362201f81?w=800&auto=format&fit=crop&q=80",
    imageHover: "https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=800&auto=format&fit=crop&q=80",
    description: "Algorithmic Voronoi mathematical tessellation sculpture of Lord Shiva. Cast from Carrara marble mineral composite with 50-micron SLA surface resolution.",
    detailedStory: "Computational geometry generated via custom procedural Voronoi partitioning algorithms developed at the CSE 3D Lab. Finished with artisan mineral wash.",
    careInstructions: "Wipe gently with damp soft cloth. Sealed with satin polyurethane finish.",
    materials: [
      { name: "Carrara Marble SLA Resin", priceDelta: 0, desc: "Mineral composite with cool stone feel" },
      { name: "Hand-Gilded Alabaster", priceDelta: 950, desc: "Real gold leaf trimmed edition" }
    ],
    sizes: [
      { label: "Pooja Shrine (14cm)", name: "Pooja Shrine (14cm)", priceDelta: 0 },
      { label: "Centerpiece (22cm)", name: "Centerpiece (22cm)", priceDelta: 900 }
    ],
    campusPickupAvailable: true,
    createdAt: "2026-08-30T10:00:00.000Z",
    updatedAt: "2026-09-04T10:00:00.000Z"
  },
  {
    id: "fibonacci-spiral-desk-lamp",
    name: "Fibonacci Spiral Geodesic Ambient Desk Lamp",
    title: "Fibonacci Spiral Geodesic Ambient Desk Lamp",
    slug: "fibonacci-spiral-desk-lamp",
    sku: "ACET-DEC-004",
    category: "Home Décor",
    categoryLabel: "Home & Décor",
    subcategory: "Parametric Lighting",
    salePrice: 1599,
    basePrice: 2199,
    regularPrice: 2199,
    rating: 4.8,
    ratingAvg: 4.8,
    ratingCount: 22,
    reviewCount: 22,
    stock: 18,
    printTimeHours: 11,
    weightGrams: 310,
    isTrending: true,
    isBestSeller: false,
    badge: "WARM LED INCLUDED",
    images: [
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&auto=format&fit=crop&q=80"
    ],
    image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&auto=format&fit=crop&q=80",
    imageHover: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&auto=format&fit=crop&q=80",
    description: "Golden-ratio mathematical lattice lampshade with warm ambient LED diffuser base. Casts geometric shadow patterns engineered by CSE additive manufacturing team.",
    detailedStory: "Derived from Fibonacci sequence spiraling phyllotaxis equations. Optimizes light diffusion while projecting geometric shadows.",
    careInstructions: "Use only with included 5W low-heat LED USB light module.",
    materials: [
      { name: "Translucent White PLA", priceDelta: 0, desc: "High diffusion optical grade PLA" },
      { name: "Amber Matte Filament", priceDelta: 200, desc: "Warm amber glow tone" }
    ],
    sizes: [
      { label: "Desk Compact (16cm)", name: "Desk Compact (16cm)", priceDelta: 0 },
      { label: "Floor Standing (28cm)", name: "Floor Standing (28cm)", priceDelta: 700 }
    ],
    campusPickupAvailable: true,
    createdAt: "2026-08-30T10:00:00.000Z",
    updatedAt: "2026-09-04T10:00:00.000Z"
  },
  {
    id: "akshaya-techday-trophy",
    name: "Akshaya Techday & Symposium Champion Trophy",
    title: "Akshaya Techday & Symposium Champion Trophy",
    slug: "akshaya-techday-trophy",
    sku: "ACET-FEST-005",
    category: "Fest Merch",
    categoryLabel: "Fest Merch",
    subcategory: "Institutional Trophies & Honors",
    salePrice: 850,
    basePrice: 1200,
    regularPrice: 1200,
    rating: 4.9,
    ratingAvg: 4.9,
    ratingCount: 17,
    reviewCount: 17,
    stock: 40,
    printTimeHours: 7,
    weightGrams: 190,
    isTrending: false,
    isBestSeller: true,
    badge: "CUSTOM ENGRAVABLE",
    images: [
      "https://images.unsplash.com/photo-1569517282132-25d22f4573e6?w=800&auto=format&fit=crop&q=80"
    ],
    image: "https://images.unsplash.com/photo-1569517282132-25d22f4573e6?w=800&auto=format&fit=crop&q=80",
    imageHover: "https://images.unsplash.com/photo-1569517282132-25d22f4573e6?w=800&auto=format&fit=crop&q=80",
    description: "Official Department of Computer Science and Engineering annual technical symposium trophy. Dual-tone metallic gold and satin emerald finish.",
    detailedStory: "Commissioned for college symposia, hackathons, and academic honors. Features debossed college monogram and customizable winner plaque plate.",
    careInstructions: "Handle with clean hands. Dust with soft feather brush.",
    materials: [
      { name: "Silk Gold PLA + Emerald Base", priceDelta: 0, desc: "Dual luster institutional finish" }
    ],
    sizes: [
      { label: "Winner (22cm)", name: "Winner (22cm)", priceDelta: 0 },
      { label: "Runner-up (18cm)", name: "Runner-up (18cm)", priceDelta: -200 }
    ],
    campusPickupAvailable: true,
    createdAt: "2026-08-30T10:00:00.000Z",
    updatedAt: "2026-09-04T10:00:00.000Z"
  },
  {
    id: "cse-alumni-keepsake-penstand",
    name: "CSE Department 3D Alumni Keepsake Pen Stand",
    title: "CSE Department 3D Alumni Keepsake Pen Stand",
    slug: "cse-alumni-keepsake-penstand",
    sku: "ACET-ALUM-006",
    category: "Alumni Gifting",
    categoryLabel: "Alumni Gifting",
    subcategory: "Alumni Memorabilia",
    salePrice: 599,
    basePrice: 899,
    regularPrice: 899,
    rating: 5.0,
    ratingAvg: 5.0,
    ratingCount: 31,
    reviewCount: 31,
    stock: 50,
    printTimeHours: 4,
    weightGrams: 120,
    isTrending: true,
    isBestSeller: true,
    badge: "ALUMNI SPECIAL",
    images: [
      "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=800&auto=format&fit=crop&q=80"
    ],
    image: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=800&auto=format&fit=crop&q=80",
    imageHover: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=800&auto=format&fit=crop&q=80",
    description: "Precision wireframe geometric desktop organizer featuring embossed Department of Computer Science and Engineering identity and smartphone docking cradle.",
    detailedStory: "A tribute for graduating engineers and distinguished alumni of the CSE department. Practical, elegant, and permanently debossed.",
    careInstructions: "Avoid immersion in water. Oil wood-fill PLA lightly once a year.",
    materials: [
      { name: "Walnut Wood-Fill PLA", priceDelta: 0, desc: "Real wood fibers composite" },
      { name: "Matte Forest Green PLA", priceDelta: -50, desc: "Satin institutional green" }
    ],
    sizes: [
      { label: "Desktop Standard (12cm)", name: "Desktop Standard (12cm)", priceDelta: 0 }
    ],
    campusPickupAvailable: true,
    createdAt: "2026-08-30T10:00:00.000Z",
    updatedAt: "2026-09-04T10:00:00.000Z"
  }
];

const realisticOrders = [
  {
    orderId: "ACET-849201",
    customer: {
      name: "S. Manikandan",
      email: "manikandan.s@acetcbe.edu.in",
      phone: "+91 97894 44111",
      address: "CSE Smart Lab, Akshaya College, Kinathukadavu"
    },
    items: [
      {
        productId: "acet-crest-monolith",
        name: "ACET Official Crest & Institutional Seal Monolith",
        quantity: 1,
        material: "Carrara Marble Composite",
        size: "Executive Pedestal (18cm)",
        priceAtPurchase: 1399
      }
    ],
    totalAmount: 1399,
    paymentStatus: "paid",
    paymentId: "pay_rzp_live_948201",
    status: "Printing",
    deliveryMethod: "campus_pickup",
    customerName: "S. Manikandan",
    contact: "+91 97894 44111",
    total: 1399,
    progressPercent: 65,
    createdAt: "2026-09-03T14:30:00.000Z",
    updatedAt: "2026-09-04T08:00:00.000Z"
  }
];

const realisticCADRequests = [
  {
    requestId: "ACET-CAD-10294",
    name: "A. Praveen Kumar",
    email: "praveen.a@acetcbe.edu.in",
    phone: "+91 94432 55678",
    referenceImageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800",
    desiredSize: "160x140x90 mm",
    material: "PA12 Carbon-Fiber Nylon",
    budgetRange: "₹1500 - ₹2500",
    deadline: "Within 4 days",
    notes: "Custom quadcopter drone arm chassis for CSE IoT Lab autonomous drone project.",
    status: "reviewing",
    createdAt: "2026-09-03T16:00:00.000Z"
  }
];

const realisticReviews = [
  {
    productId: "acet-crest-monolith",
    customerName: "K. Vignesh (21CS045)",
    rating: 5,
    comment: "The Carrara marble finish looks magnificent on my study desk. Precision is top notch.",
    createdAt: "2026-09-01T12:00:00.000Z"
  },
  {
    productId: "planetary-reduction-gearbox",
    customerName: "Prof. Ramesh N. (Faculty, CSE)",
    rating: 5,
    comment: "Smooth mechanical rotation straight off the print bed with zero assembly. Excellent demonstration model for student projects.",
    createdAt: "2026-09-02T15:30:00.000Z"
  }
];

export function cleanAndResetDatabase() {
  const data = {
    products: canonicalProducts,
    orders: realisticOrders,
    customRequests: realisticCADRequests,
    reviews: realisticReviews
  };

  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  console.log(`✨ Database cleaned: ${canonicalProducts.length} curated products, ${realisticOrders.length} order, ${realisticCADRequests.length} custom request, ${realisticReviews.length} reviews.`);
}

cleanAndResetDatabase();
