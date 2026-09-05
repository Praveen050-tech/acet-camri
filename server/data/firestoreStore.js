import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { admin, db, isLiveFirestore } from '../config/firebase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'database.json');

// Local file store fallback
function loadLocal() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading local fallback database:', err);
  }
  return { products: [], orders: [], customRequests: [], reviews: [] };
}

function saveLocal(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing local fallback database:', err);
  }
}

// -------------------------------------------------------------
// BACKEND VALIDATION RULES (§4)
// -------------------------------------------------------------
export const validateProduct = (data, isUpdate = false) => {
  const errors = [];
  if (!isUpdate && !data.name?.trim()) errors.push('Product name is required');
  if (!isUpdate && !data.slug?.trim()) errors.push('Product slug is required');
  if (!isUpdate && !data.description?.trim()) errors.push('Product description is required');
  if (!isUpdate && !data.category?.trim()) errors.push('Category is required');
  
  if (data.salePrice !== undefined && data.salePrice !== null && (isNaN(data.salePrice) || Number(data.salePrice) <= 0)) {
    errors.push('Sale price must be a positive number');
  }
  if (data.basePrice !== undefined && (isNaN(data.basePrice) || Number(data.basePrice) <= 0)) {
    errors.push('Base price must be a positive number');
  }
  const stockVal = data.stockQuantity !== undefined ? data.stockQuantity : data.stock;
  if (stockVal !== undefined && (isNaN(stockVal) || Number(stockVal) < 0)) {
    errors.push('Stock quantity cannot be negative');
  }
  if (data.materials && !Array.isArray(data.materials)) {
    errors.push('Materials must be an array of objects');
  }
  if (data.sizes && !Array.isArray(data.sizes)) {
    errors.push('Sizes must be an array of objects');
  }

  return { isValid: errors.length === 0, errors };
};

export const validateOrder = (data) => {
  const errors = [];
  const validStatuses = ['Placed', 'Confirmed', 'Printing', 'Shipped', 'Ready for Pickup', 'Delivered'];
  const validPaymentStatuses = ['pending', 'paid', 'failed'];
  const validDeliveryMethods = ['shipping', 'campus_pickup'];

  if (!data.customer || !data.customer.name || !data.customer.phone) {
    errors.push('Customer name and phone number are required');
  }
  if (!Array.isArray(data.items) || data.items.length === 0) {
    errors.push('Order must contain at least one product item');
  }
  if (isNaN(data.totalAmount) || Number(data.totalAmount) <= 0) {
    errors.push('Total amount must be a positive number');
  }
  if (data.status && !validStatuses.includes(data.status)) {
    errors.push(`Status must be one of: ${validStatuses.join(', ')}`);
  }
  if (data.paymentStatus && !validPaymentStatuses.includes(data.paymentStatus)) {
    errors.push(`Payment status must be one of: ${validPaymentStatuses.join(', ')}`);
  }
  if (data.deliveryMethod && !validDeliveryMethods.includes(data.deliveryMethod)) {
    errors.push(`Delivery method must be one of: ${validDeliveryMethods.join(', ')}`);
  }

  return { isValid: errors.length === 0, errors };
};

export const validateCustomRequest = (data) => {
  const errors = [];
  const validStatuses = ['new', 'reviewing', 'quoted', 'accepted', 'rejected'];

  if (!data.name?.trim()) errors.push('Requester name is required');
  if (!data.email?.trim()) errors.push('Email is required');
  if (!data.phone?.trim()) errors.push('Phone is required');
  if (data.status && !validStatuses.includes(data.status)) {
    errors.push(`Status must be one of: ${validStatuses.join(', ')}`);
  }

  return { isValid: errors.length === 0, errors };
};

export const validateReview = (data) => {
  const errors = [];
  if (!data.productId) errors.push('productId is required');
  if (!data.customerName?.trim()) errors.push('Customer name is required');
  if (isNaN(data.rating) || Number(data.rating) < 1 || Number(data.rating) > 5) {
    errors.push('Rating must be an integer between 1 and 5');
  }
  return { isValid: errors.length === 0, errors };
};

// -------------------------------------------------------------
// FIRESTORE COLLECTIONS REPOSITORY (§3)
// -------------------------------------------------------------
export const firestoreService = {
  
  // --- PRODUCTS (products/{productId}) ---
  async getProducts(filter = {}) {
    if (db) {
      try {
        let query = db.collection('products');
        if (filter.category) {
          query = query.where('category', '==', filter.category);
        }
        const snap = await query.get();
        let list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        if (filter.search) {
          const q = filter.search.toLowerCase();
          list = list.filter(p => 
            p.name?.toLowerCase().includes(q) || 
            p.description?.toLowerCase().includes(q) ||
            p.category?.toLowerCase().includes(q)
          );
        }
        return list;
      } catch (e) {
        console.warn('Firestore getProducts error, falling back to local:', e.message);
      }
    }
    const local = loadLocal();
    let list = local.products || [];
    if (filter.category) {
      list = list.filter(p => p.category === filter.category);
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(p => 
        p.name?.toLowerCase().includes(q) || 
        p.description?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
      );
    }
    return list;
  },

  async getProductById(id) {
    if (db) {
      try {
        const docRef = db.collection('products').doc(id);
        const doc = await docRef.get();
        if (doc.exists) {
          return { id: doc.id, ...doc.data() };
        }
        // Also check by slug
        const slugSnap = await db.collection('products').where('slug', '==', id).limit(1).get();
        if (!slugSnap.empty) {
          return { id: slugSnap.docs[0].id, ...slugSnap.docs[0].data() };
        }
      } catch (e) {
        console.warn('Firestore getProductById error, fallback:', e.message);
      }
    }
    const local = loadLocal();
    return (local.products || []).find(p => p.id === id || p.slug === id) || null;
  },

  async createProduct(productData) {
    const val = validateProduct(productData);
    if (!val.isValid) {
      throw new Error(`Validation Error: ${val.errors.join(', ')}`);
    }

    const now = new Date().toISOString();
    const rawImages = Array.isArray(productData.images) 
      ? productData.images 
      : (productData.imageUrl || productData.image ? [productData.imageUrl || productData.image] : ['/images/products/placeholder.jpg']);
    
    // Normalize images to relational items { url, position }
    const formattedImages = rawImages.map((img, idx) => {
      if (typeof img === 'string') {
        return { id: `img-${Date.now()}-${idx}`, url: img, position: idx };
      }
      return { id: img.id || `img-${Date.now()}-${idx}`, url: img.url, position: img.position !== undefined ? img.position : idx };
    });

    const formattedMaterials = Array.isArray(productData.materials)
      ? productData.materials.map((m, idx) => ({ id: m.id || `mat-${Date.now()}-${idx}`, name: m.name, priceDelta: Number(m.priceDelta || 0) }))
      : [{ id: `mat-${Date.now()}-0`, name: 'PLA', priceDelta: 0 }];

    const formattedSizes = Array.isArray(productData.sizes)
      ? productData.sizes.map((s, idx) => ({ id: s.id || `sz-${Date.now()}-${idx}`, label: s.label || s.name, priceDelta: Number(s.priceDelta || 0) }))
      : [{ id: `sz-${Date.now()}-0`, label: 'Small (5cm)', priceDelta: 0 }];

    const basePrice = Number(productData.basePrice !== undefined ? productData.basePrice : (productData.price || 0));
    const salePrice = productData.salePrice !== undefined && productData.salePrice !== null ? Number(productData.salePrice) : null;
    const stockQuantity = Number(productData.stockQuantity !== undefined ? productData.stockQuantity : (productData.stock !== undefined ? productData.stock : 25));

    const docData = {
      name: productData.name,
      slug: productData.slug,
      description: productData.description || '',
      category: productData.category,
      basePrice,
      salePrice,
      stockQuantity,
      stock: stockQuantity, // backward compatible alias
      images: formattedImages,
      materials: formattedMaterials,
      sizes: formattedSizes,
      printTimeHours: Number(productData.printTimeHours || 2),
      weightGrams: Number(productData.weightGrams || 50),
      careInstructions: productData.careInstructions || 'Keep away from direct heat exceeding 55°C.',
      ratingAvg: Number(productData.ratingAvg !== undefined ? productData.ratingAvg : (productData.rating || 5.0)),
      ratingCount: Number(productData.ratingCount !== undefined ? productData.ratingCount : (productData.reviewCount || 1)),
      isActive: productData.isActive !== undefined ? Boolean(productData.isActive) : true,
      createdAt: now,
      updatedAt: now
    };

    const docId = productData.id || productData.slug || `acet-prod-${Date.now()}`;

    if (db) {
      try {
        const docRef = db.collection('products').doc(docId);
        await docRef.set(docData, { merge: true });
        return { id: docId, ...docData };
      } catch (e) {
        console.warn('Firestore createProduct error, writing local:', e.message);
      }
    }

    const local = loadLocal();
    local.products = local.products || [];
    const existingIdx = local.products.findIndex(p => p.slug === docData.slug || p.id === docId);
    const saved = { id: docId, ...docData };

    if (existingIdx !== -1) {
      local.products[existingIdx] = { ...local.products[existingIdx], ...saved };
    } else {
      local.products.push(saved);
    }
    saveLocal(local);
    return saved;
  },

  async updateProduct(id, updateData) {
    const val = validateProduct(updateData, true);
    if (!val.isValid) {
      throw new Error(`Validation Error: ${val.errors.join(', ')}`);
    }

    const now = new Date().toISOString();
    const cleaned = { ...updateData, updatedAt: now };

    if (db) {
      try {
        const docRef = db.collection('products').doc(id);
        await docRef.set(cleaned, { merge: true });
        const updated = await docRef.get();
        return { id: updated.id, ...updated.data() };
      } catch (e) {
        console.warn('Firestore updateProduct error:', e.message);
      }
    }

    const local = loadLocal();
    const idx = (local.products || []).findIndex(p => p.id === id || p.slug === id);
    if (idx !== -1) {
      local.products[idx] = { ...local.products[idx], ...cleaned };
      saveLocal(local);
      return local.products[idx];
    }
    return null;
  },

  async deleteProduct(id) {
    if (db) {
      try {
        await db.collection('products').doc(id).delete();
      } catch (e) {
        console.warn('Firestore deleteProduct error:', e.message);
      }
    }
    const local = loadLocal();
    local.products = (local.products || []).filter(p => p.id !== id && p.slug !== id);
    saveLocal(local);
    return true;
  },

  async getProductsCount() {
    if (db) {
      try {
        const snap = await db.collection('products').count().get();
        return snap.data().count;
      } catch (e) {
        // Fallback size
        try {
          const snap = await db.collection('products').get();
          return snap.size;
        } catch (err) {}
      }
    }
    const local = loadLocal();
    return (local.products || []).length;
  },

  // --- ORDERS (orders/{orderId}) ---
  async createOrder(orderData) {
    const val = validateOrder(orderData);
    if (!val.isValid) {
      throw new Error(`Validation Error: ${val.errors.join(', ')}`);
    }

    const now = new Date().toISOString();
    const orderId = orderData.orderId || `ACET-${Math.floor(100000 + Math.random() * 900000)}`;
    const docData = {
      orderId,
      customer: orderData.customer,
      items: orderData.items,
      totalAmount: Number(orderData.totalAmount),
      paymentStatus: orderData.paymentStatus || 'paid',
      paymentId: orderData.paymentId || `pay_${Date.now()}`,
      status: orderData.status || 'Placed',
      deliveryMethod: orderData.deliveryMethod || 'campus_pickup',
      createdAt: now,
      updatedAt: now
    };

    if (db) {
      try {
        await db.collection('orders').doc(orderId).set(docData);
        return { id: orderId, ...docData };
      } catch (e) {
        console.warn('Firestore createOrder error, local fallback:', e.message);
      }
    }

    const local = loadLocal();
    local.orders = local.orders || [];
    local.orders.push(docData);
    saveLocal(local);
    return docData;
  },

  async getOrderById(orderId) {
    if (db) {
      try {
        const docRef = db.collection('orders').doc(orderId);
        const doc = await docRef.get();
        if (doc.exists) {
          return { id: doc.id, ...doc.data() };
        }
        // Also check by orderId field
        const snap = await db.collection('orders').where('orderId', '==', orderId).limit(1).get();
        if (!snap.empty) {
          return { id: snap.docs[0].id, ...snap.docs[0].data() };
        }
      } catch (e) {
        console.warn('Firestore getOrderById error:', e.message);
      }
    }
    const local = loadLocal();
    return (local.orders || []).find(o => o.orderId === orderId || o.id === orderId) || null;
  },

  async getAllOrders() {
    if (db) {
      try {
        const snap = await db.collection('orders').orderBy('createdAt', 'desc').get();
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
      } catch (e) {
        try {
          const snap = await db.collection('orders').get();
          return snap.docs.map(d => ({ id: d.id, ...d.data() }));
        } catch (err) {}
      }
    }
    const local = loadLocal();
    return (local.orders || []).reverse();
  },

  async updateOrderStatus(orderId, status) {
    const validStatuses = ['Placed', 'Confirmed', 'Printing', 'Shipped', 'Ready for Pickup', 'Delivered'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    const now = new Date().toISOString();
    if (db) {
      try {
        await db.collection('orders').doc(orderId).set({ status, updatedAt: now }, { merge: true });
        return { success: true, orderId, status };
      } catch (e) {
        console.warn('Firestore updateOrderStatus error:', e.message);
      }
    }

    const local = loadLocal();
    const idx = (local.orders || []).findIndex(o => o.orderId === orderId || o.id === orderId);
    if (idx !== -1) {
      local.orders[idx].status = status;
      local.orders[idx].updatedAt = now;
      saveLocal(local);
      return { success: true, orderId, status };
    }
    return null;
  },

  // --- CUSTOM REQUESTS (customRequests/{requestId}) ---
  async createCustomRequest(data) {
    const val = validateCustomRequest(data);
    if (!val.isValid) {
      throw new Error(`Validation Error: ${val.errors.join(', ')}`);
    }

    const now = new Date().toISOString();
    const requestId = `ACET-CAD-${Math.floor(10000 + Math.random() * 90000)}`;
    const docData = {
      requestId,
      name: data.name,
      email: data.email,
      phone: data.phone,
      referenceImageUrl: data.referenceImageUrl || data.fileUrl || '',
      desiredSize: data.desiredSize || data.dimensions || 'Standard (100mm)',
      material: data.material || 'PLA Pro',
      budgetRange: data.budgetRange || '₹500 - ₹1500',
      deadline: data.deadline || '',
      notes: data.notes || data.instructions || '',
      status: 'new',
      createdAt: now
    };

    if (db) {
      try {
        await db.collection('customRequests').doc(requestId).set(docData);
        return { id: requestId, ...docData };
      } catch (e) {
        console.warn('Firestore createCustomRequest error:', e.message);
      }
    }

    const local = loadLocal();
    local.customRequests = local.customRequests || [];
    local.customRequests.push(docData);
    saveLocal(local);
    return docData;
  },

  async getAllCustomRequests() {
    if (db) {
      try {
        const snap = await db.collection('customRequests').get();
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
      } catch (e) {
        console.warn('Firestore getAllCustomRequests error:', e.message);
      }
    }
    const local = loadLocal();
    return local.customRequests || [];
  },

  // --- REVIEWS (reviews/{reviewId}) ---
  async createReview(data) {
    const val = validateReview(data);
    if (!val.isValid) {
      throw new Error(`Validation Error: ${val.errors.join(', ')}`);
    }

    const now = new Date().toISOString();
    const docData = {
      productId: data.productId,
      customerName: data.customerName,
      rating: Number(data.rating),
      comment: data.comment || '',
      createdAt: now
    };

    if (db) {
      try {
        const docRef = await db.collection('reviews').add(docData);
        return { id: docRef.id, ...docData };
      } catch (e) {
        console.warn('Firestore createReview error:', e.message);
      }
    }

    const local = loadLocal();
    const newId = `review-${Date.now()}`;
    const saved = { id: newId, ...docData };
    local.reviews = local.reviews || [];
    local.reviews.push(saved);
    saveLocal(local);
    return saved;
  },

  async getReviewsForProduct(productId) {
    if (db) {
      try {
        const snap = await db.collection('reviews').where('productId', '==', productId).get();
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
      } catch (e) {
        console.warn('Firestore getReviewsForProduct error:', e.message);
      }
    }
    const local = loadLocal();
    return (local.reviews || []).filter(r => r.productId === productId);
  }
};

export default firestoreService;
