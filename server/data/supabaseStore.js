/**
 * ACET 3D — Official Supabase Data Access Service & Store
 * Department of Computer Science and Engineering
 * Akshaya College of Engineering & Technology (acetcbe.edu.in • TNEA: 2763)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { supabase, isLiveSupabase } from '../config/supabase.js';

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

// Helper to format PostgreSQL snake_case product row to camelCase object
function formatProductFromDb(row) {
  if (!row) return null;
  const images = Array.isArray(row.product_images) && row.product_images.length > 0
    ? row.product_images.map(img => ({ id: img.id, url: img.url, position: img.position }))
    : (Array.isArray(row.images) ? row.images : [{ id: `img-${row.id}-0`, url: row.image || '/images/products/placeholder.jpg', position: 0 }]);

  const materials = Array.isArray(row.product_materials) && row.product_materials.length > 0
    ? row.product_materials.map(m => ({ id: m.id, name: m.name, priceDelta: Number(m.price_delta || 0) }))
    : (Array.isArray(row.materials) ? row.materials : [{ id: `mat-${row.id}-0`, name: 'PLA', priceDelta: 0 }]);

  const sizes = Array.isArray(row.product_sizes) && row.product_sizes.length > 0
    ? row.product_sizes.map(s => ({ id: s.id, label: s.label, priceDelta: Number(s.price_delta || 0) }))
    : (Array.isArray(row.sizes) ? row.sizes : [{ id: `sz-${row.id}-0`, label: 'Small (5cm)', priceDelta: 0 }]);

  const basePrice = Number(row.base_price !== undefined ? row.base_price : (row.basePrice || 0));
  const salePrice = row.sale_price !== undefined && row.sale_price !== null ? Number(row.sale_price) : (row.salePrice !== undefined && row.salePrice !== null ? Number(row.salePrice) : null);
  const stockQuantity = Number(row.stock_quantity !== undefined ? row.stock_quantity : (row.stockQuantity !== undefined ? row.stockQuantity : 25));

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    category: row.category,
    basePrice,
    salePrice,
    stockQuantity,
    printTimeHours: Number(row.print_time_hours || row.printTimeHours || 2),
    weightGrams: Number(row.weight_grams || row.weightGrams || 50),
    careInstructions: row.care_instructions || row.careInstructions || 'Keep away from direct heat exceeding 55°C.',
    ratingAvg: Number(row.rating_avg !== undefined ? row.rating_avg : (row.ratingAvg || 5.0)),
    ratingCount: Number(row.rating_count !== undefined ? row.rating_count : (row.ratingCount || 0)),
    isActive: row.is_active !== undefined ? row.is_active : (row.isActive !== undefined ? row.isActive : true),
    createdAt: row.created_at || row.createdAt || new Date().toISOString(),
    updatedAt: row.updated_at || row.updatedAt || new Date().toISOString(),
    images,
    materials,
    sizes
  };
}

// -------------------------------------------------------------
// BACKEND VALIDATION RULES
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
// SUPABASE POSTGRESQL DATA REPOSITORY
// -------------------------------------------------------------
export const supabaseService = {
  
  // --- PRODUCTS & RELATIONS ---
  async getProducts(filter = {}) {
    if (supabase && isLiveSupabase) {
      try {
        let query = supabase
          .from('products')
          .select(`
            *,
            product_images (*),
            product_materials (*),
            product_sizes (*)
          `)
          .eq('is_active', true);

        if (filter.category) {
          query = query.eq('category', filter.category);
        }
        if (filter.search) {
          query = query.ilike('name', `%${filter.search}%`);
        }

        const { data, error } = await query;
        if (!error && data) {
          return data.map(formatProductFromDb);
        }
        if (error) console.warn('Supabase getProducts warning:', error.message);
      } catch (e) {
        console.warn('Supabase getProducts error, local fallback:', e.message);
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

  async getProductById(idOrSlug) {
    if (supabase && isLiveSupabase) {
      try {
        const { data, error } = await supabase
          .from('products')
          .select(`
            *,
            product_images (*),
            product_materials (*),
            product_sizes (*)
          `)
          .or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`)
          .maybeSingle();

        if (!error && data) {
          return formatProductFromDb(data);
        }
      } catch (e) {
        console.warn('Supabase getProductById error, fallback:', e.message);
      }
    }

    const local = loadLocal();
    return (local.products || []).find(p => p.id === idOrSlug || p.slug === idOrSlug) || null;
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
    
    const formattedImages = rawImages.map((img, idx) => {
      if (typeof img === 'string') {
        return { id: `img-${productData.slug || Date.now()}-${idx}`, url: img, position: idx };
      }
      return { id: img.id || `img-${productData.slug || Date.now()}-${idx}`, url: img.url, position: img.position !== undefined ? img.position : idx };
    });

    const formattedMaterials = Array.isArray(productData.materials)
      ? productData.materials.map((m, idx) => ({ id: m.id || `mat-${productData.slug || Date.now()}-${idx}`, name: m.name, priceDelta: Number(m.priceDelta || 0) }))
      : [{ id: `mat-${productData.slug || Date.now()}-0`, name: 'PLA', priceDelta: 0 }];

    const formattedSizes = Array.isArray(productData.sizes)
      ? productData.sizes.map((s, idx) => ({ id: s.id || `sz-${productData.slug || Date.now()}-${idx}`, label: s.label || s.name, priceDelta: Number(s.priceDelta || 0) }))
      : [{ id: `sz-${productData.slug || Date.now()}-0`, label: 'Small (5cm)', priceDelta: 0 }];

    const basePrice = Number(productData.basePrice !== undefined ? productData.basePrice : (productData.price || 0));
    const salePrice = productData.salePrice !== undefined && productData.salePrice !== null ? Number(productData.salePrice) : null;
    const stockQuantity = Number(productData.stockQuantity !== undefined ? productData.stockQuantity : (productData.stock !== undefined ? productData.stock : 25));
    const docId = productData.id || productData.slug || `acet-prod-${Date.now()}`;

    const saved = {
      id: docId,
      name: productData.name,
      slug: productData.slug,
      description: productData.description || '',
      category: productData.category,
      basePrice,
      salePrice,
      stockQuantity,
      stock: stockQuantity,
      images: formattedImages,
      materials: formattedMaterials,
      sizes: formattedSizes,
      printTimeHours: Number(productData.printTimeHours || 2),
      weightGrams: Number(productData.weightGrams || 50),
      careInstructions: productData.careInstructions || 'Keep away from direct heat exceeding 55°C.',
      ratingAvg: Number(productData.ratingAvg !== undefined ? productData.ratingAvg : (productData.rating || 5.0)),
      ratingCount: Number(productData.ratingCount !== undefined ? productData.ratingCount : (productData.reviewCount || 0)),
      isActive: productData.isActive !== undefined ? Boolean(productData.isActive) : true,
      createdAt: now,
      updatedAt: now
    };

    if (supabase && isLiveSupabase) {
      try {
        const { data: prodRow, error: prodErr } = await supabase
          .from('products')
          .upsert({
            id: docId,
            name: saved.name,
            slug: saved.slug,
            description: saved.description,
            category: saved.category,
            base_price: saved.basePrice,
            sale_price: saved.salePrice,
            stock_quantity: saved.stockQuantity,
            print_time_hours: saved.printTimeHours,
            weight_grams: saved.weightGrams,
            care_instructions: saved.careInstructions,
            rating_avg: saved.ratingAvg,
            rating_count: saved.ratingCount,
            is_active: saved.isActive,
            created_at: now,
            updated_at: now
          })
          .select()
          .single();

        if (!prodErr && prodRow) {
          // Insert relations
          if (formattedImages.length > 0) {
            await supabase.from('product_images').upsert(
              formattedImages.map(img => ({ product_id: prodRow.id, url: img.url, position: img.position }))
            );
          }
          if (formattedMaterials.length > 0) {
            await supabase.from('product_materials').upsert(
              formattedMaterials.map(m => ({ product_id: prodRow.id, name: m.name, price_delta: m.priceDelta }))
            );
          }
          if (formattedSizes.length > 0) {
            await supabase.from('product_sizes').upsert(
              formattedSizes.map(s => ({ product_id: prodRow.id, label: s.label, price_delta: s.priceDelta }))
            );
          }
        }
      } catch (e) {
        console.warn('Supabase createProduct notice:', e.message);
      }
    }

    const local = loadLocal();
    local.products = local.products || [];
    const existingIdx = local.products.findIndex(p => p.slug === saved.slug || p.id === docId);

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

    if (supabase && isLiveSupabase) {
      try {
        const updatePayload = {};
        if (cleaned.name) updatePayload.name = cleaned.name;
        if (cleaned.slug) updatePayload.slug = cleaned.slug;
        if (cleaned.description) updatePayload.description = cleaned.description;
        if (cleaned.category) updatePayload.category = cleaned.category;
        if (cleaned.basePrice !== undefined) updatePayload.base_price = cleaned.basePrice;
        if (cleaned.salePrice !== undefined) updatePayload.sale_price = cleaned.salePrice;
        if (cleaned.stockQuantity !== undefined) updatePayload.stock_quantity = cleaned.stockQuantity;
        if (cleaned.isActive !== undefined) updatePayload.is_active = cleaned.isActive;
        updatePayload.updated_at = now;

        await supabase.from('products').update(updatePayload).eq('id', id);
      } catch (e) {
        console.warn('Supabase updateProduct warning:', e.message);
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
    if (supabase && isLiveSupabase) {
      try {
        await supabase.from('products').delete().eq('id', id);
      } catch (e) {
        console.warn('Supabase deleteProduct error:', e.message);
      }
    }
    const local = loadLocal();
    local.products = (local.products || []).filter(p => p.id !== id && p.slug !== id);
    saveLocal(local);
    return true;
  },

  async getProductsCount() {
    if (supabase && isLiveSupabase) {
      try {
        const { count, error } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true });
        if (!error && count !== null) return count;
      } catch (e) {}
    }
    const local = loadLocal();
    return (local.products || []).length;
  },

  // --- ORDERS & FULFILLMENT ---
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

    if (supabase && isLiveSupabase) {
      try {
        const { data: orderRow, error: orderErr } = await supabase
          .from('customer_orders')
          .insert({
            order_number: orderId,
            customer_name: docData.customer.name,
            customer_email: docData.customer.email,
            customer_phone: docData.customer.phone,
            customer_address: docData.customer.address,
            status: docData.status,
            total_amount: docData.totalAmount,
            payment_status: docData.paymentStatus,
            payment_id: docData.paymentId,
            delivery_method: docData.deliveryMethod,
            created_at: now,
            updated_at: now
          })
          .select()
          .single();

        if (!orderErr && orderRow && Array.isArray(docData.items)) {
          const itemsPayload = docData.items.map(item => ({
            order_id: orderRow.id,
            product_name: item.name,
            quantity: item.quantity,
            selected_material: item.material,
            selected_size: item.size,
            price_at_purchase: item.priceAtPurchase
          }));
          await supabase.from('order_items').insert(itemsPayload);
        }
      } catch (e) {
        console.warn('Supabase createOrder notice:', e.message);
      }
    }

    const local = loadLocal();
    local.orders = local.orders || [];
    local.orders.push(docData);
    saveLocal(local);
    return docData;
  },

  async getOrderById(orderId) {
    if (supabase && isLiveSupabase) {
      try {
        const { data, error } = await supabase
          .from('customer_orders')
          .select(`
            *,
            order_items (*)
          `)
          .eq('order_number', orderId)
          .maybeSingle();

        if (!error && data) {
          return {
            id: data.id,
            orderId: data.order_number,
            customer: {
              name: data.customer_name,
              email: data.customer_email,
              phone: data.customer_phone,
              address: data.customer_address
            },
            items: data.order_items?.map(it => ({
              name: it.product_name,
              quantity: it.quantity,
              material: it.selected_material,
              size: it.selected_size,
              priceAtPurchase: Number(it.price_at_purchase)
            })) || [],
            totalAmount: Number(data.total_amount),
            status: data.status,
            paymentStatus: data.payment_status,
            paymentId: data.payment_id,
            deliveryMethod: data.delivery_method,
            createdAt: data.created_at,
            updatedAt: data.updated_at
          };
        }
      } catch (e) {
        console.warn('Supabase getOrderById error:', e.message);
      }
    }

    const local = loadLocal();
    return (local.orders || []).find(o => o.orderId === orderId || o.id === orderId) || null;
  },

  async getAllOrders() {
    if (supabase && isLiveSupabase) {
      try {
        const { data, error } = await supabase
          .from('customer_orders')
          .select(`
            *,
            order_items (*)
          `)
          .order('created_at', { ascending: false });

        if (!error && data) {
          return data.map(d => ({
            id: d.id,
            orderId: d.order_number,
            customer: {
              name: d.customer_name,
              email: d.customer_email,
              phone: d.customer_phone,
              address: d.customer_address
            },
            items: d.order_items || [],
            totalAmount: Number(d.total_amount),
            status: d.status,
            paymentStatus: d.payment_status,
            deliveryMethod: d.delivery_method,
            createdAt: d.created_at,
            updatedAt: d.updated_at
          }));
        }
      } catch (e) {
        console.warn('Supabase getAllOrders error:', e.message);
      }
    }

    const local = loadLocal();
    return (local.orders || []).slice().reverse();
  },

  async updateOrderStatus(orderId, status) {
    const validStatuses = ['Placed', 'Confirmed', 'Printing', 'Shipped', 'Ready for Pickup', 'Delivered'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    const now = new Date().toISOString();
    if (supabase && isLiveSupabase) {
      try {
        await supabase
          .from('customer_orders')
          .update({ status, updated_at: now })
          .eq('order_number', orderId);
      } catch (e) {
        console.warn('Supabase updateOrderStatus error:', e.message);
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

  // --- CUSTOM REQUESTS ---
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

    if (supabase && isLiveSupabase) {
      try {
        await supabase.from('custom_print_requests').insert({
          request_id: requestId,
          name: docData.name,
          email: docData.email,
          phone: docData.phone,
          reference_image_url: docData.referenceImageUrl,
          desired_size: docData.desiredSize,
          material: docData.material,
          budget_range: docData.budgetRange,
          deadline: docData.deadline,
          notes: docData.notes,
          status: docData.status,
          created_at: now
        });
      } catch (e) {
        console.warn('Supabase createCustomRequest error:', e.message);
      }
    }

    const local = loadLocal();
    local.customRequests = local.customRequests || [];
    local.customRequests.push(docData);
    saveLocal(local);
    return docData;
  },

  async getAllCustomRequests() {
    if (supabase && isLiveSupabase) {
      try {
        const { data, error } = await supabase
          .from('custom_print_requests')
          .select('*')
          .order('created_at', { ascending: false });
        if (!error && data) {
          return data.map(d => ({
            requestId: d.request_id,
            name: d.name,
            email: d.email,
            phone: d.phone,
            referenceImageUrl: d.reference_image_url,
            desiredSize: d.desired_size,
            material: d.material,
            budgetRange: d.budget_range,
            deadline: d.deadline,
            notes: d.notes,
            status: d.status,
            createdAt: d.created_at
          }));
        }
      } catch (e) {
        console.warn('Supabase getAllCustomRequests error:', e.message);
      }
    }

    const local = loadLocal();
    return local.customRequests || [];
  },

  // --- REVIEWS ---
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

    if (supabase && isLiveSupabase) {
      try {
        await supabase.from('reviews').insert({
          product_id: docData.productId,
          customer_name: docData.customerName,
          rating: docData.rating,
          comment: docData.comment,
          created_at: now
        });
      } catch (e) {
        console.warn('Supabase createReview error:', e.message);
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
    if (supabase && isLiveSupabase) {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .eq('product_id', productId)
          .order('created_at', { ascending: false });

        if (!error && data) {
          return data.map(d => ({
            id: d.id,
            productId: d.product_id,
            customerName: d.customer_name,
            rating: Number(d.rating),
            comment: d.comment,
            createdAt: d.created_at
          }));
        }
      } catch (e) {
        console.warn('Supabase getReviewsForProduct error:', e.message);
      }
    }

    const local = loadLocal();
    return (local.reviews || []).filter(r => r.productId === productId);
  },

  // PAGE CONTENT CMS
  async getPageContent(pageSlug) {
    if (supabase && isLiveSupabase) {
      try {
        const { data, error } = await supabase
          .from('page_content')
          .select('*')
          .eq('page_slug', pageSlug)
          .order('position', { ascending: true });
        if (!error && data) {
          return data.map(d => ({
            id: d.id, pageSlug: d.page_slug, title: d.title,
            description: d.description, imageUrl: d.image_url || '',
            position: Number(d.position || 0),
            createdAt: d.created_at, updatedAt: d.updated_at
          }));
        }
      } catch (e) { console.warn('Supabase getPageContent error:', e.message); }
    }
    const local = loadLocal();
    return (local.pageContent || []).filter(c => c.pageSlug === pageSlug).sort((a, b) => (a.position || 0) - (b.position || 0));
  },

  async createPageContent(docData) {
    const now = new Date().toISOString();
    if (supabase && isLiveSupabase) {
      try {
        const { data, error } = await supabase.from('page_content').insert({
          page_slug: docData.pageSlug, title: docData.title,
          description: docData.description || '', image_url: docData.imageUrl || '',
          position: Number(docData.position || 0), created_at: now, updated_at: now
        }).select().single();
        if (!error && data) {
          return { id: data.id, pageSlug: data.page_slug, title: data.title,
            description: data.description, imageUrl: data.image_url || '',
            position: Number(data.position || 0), createdAt: data.created_at, updatedAt: data.updated_at };
        }
      } catch (e) { console.warn('Supabase createPageContent error:', e.message); }
    }
    const local = loadLocal();
    local.pageContent = local.pageContent || [];
    const newId = 'pc-' + Date.now();
    const saved = { id: newId, pageSlug: docData.pageSlug, title: docData.title,
      description: docData.description || '', imageUrl: docData.imageUrl || '',
      position: Number(docData.position || 0), createdAt: now, updatedAt: now };
    local.pageContent.push(saved);
    saveLocal(local);
    return saved;
  },

  async updatePageContent(id, docData) {
    const now = new Date().toISOString();
    if (supabase && isLiveSupabase) {
      try {
        const up = { updated_at: now };
        if (docData.title !== undefined) up.title = docData.title;
        if (docData.description !== undefined) up.description = docData.description;
        if (docData.imageUrl !== undefined) up.image_url = docData.imageUrl;
        if (docData.position !== undefined) up.position = Number(docData.position);
        const { data, error } = await supabase.from('page_content').update(up).eq('id', id).select().single();
        if (!error && data) {
          return { id: data.id, pageSlug: data.page_slug, title: data.title,
            description: data.description, imageUrl: data.image_url || '',
            position: Number(data.position || 0), createdAt: data.created_at, updatedAt: data.updated_at };
        }
      } catch (e) { console.warn('Supabase updatePageContent error:', e.message); }
    }
    const local = loadLocal();
    local.pageContent = local.pageContent || [];
    const idx = local.pageContent.findIndex(c => c.id === id);
    if (idx === -1) return null;
    const existing = local.pageContent[idx];
    const updated = { ...existing,
      title: docData.title !== undefined ? docData.title : existing.title,
      description: docData.description !== undefined ? docData.description : existing.description,
      imageUrl: docData.imageUrl !== undefined ? docData.imageUrl : existing.imageUrl,
      position: docData.position !== undefined ? Number(docData.position) : existing.position,
      updatedAt: now };
    local.pageContent[idx] = updated;
    saveLocal(local);
    return updated;
  },

  async deletePageContent(id) {
    if (supabase && isLiveSupabase) {
      try { await supabase.from('page_content').delete().eq('id', id); }
      catch (e) { console.warn('Supabase deletePageContent error:', e.message); }
    }
    const local = loadLocal();
    local.pageContent = (local.pageContent || []).filter(c => c.id !== id);
    saveLocal(local);
    return true;
  }
};

export default supabaseService;
