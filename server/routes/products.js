import express from 'express';
import { supabaseService, validateProduct } from '../data/supabaseStore.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Helper to normalize product output for storefront compatibility
function normalizeProduct(p) {
  if (!p) return null;
  const name = p.name || p.title || 'ACET 3D Model';
  const slug = p.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const basePrice = Number(p.basePrice !== undefined ? p.basePrice : (p.regularPrice || p.price || 0));
  const salePrice = p.salePrice !== undefined && p.salePrice !== null ? Number(p.salePrice) : null;
  const stockQuantity = Number(p.stockQuantity !== undefined ? p.stockQuantity : (p.stock !== undefined ? p.stock : 25));

  // Format images as relational objects { id, url, position }
  const rawImages = Array.isArray(p.images) && p.images.length > 0 
    ? p.images 
    : (p.image || p.imageUrl ? [p.image || p.imageUrl] : ['/images/products/placeholder.jpg']);
  
  const images = rawImages.map((img, idx) => {
    if (typeof img === 'string') {
      return { id: `img-${slug}-${idx}`, url: img, position: idx };
    }
    return { id: img.id || `img-${slug}-${idx}`, url: img.url, position: img.position !== undefined ? img.position : idx };
  });

  // Format materials as relational objects { id, name, priceDelta }
  const rawMaterials = Array.isArray(p.materials) && p.materials.length > 0 
    ? p.materials 
    : (p.availableMaterials || [{ name: 'PLA', priceDelta: 0 }]);
  
  const materials = rawMaterials.map((m, idx) => ({
    id: m.id || `mat-${slug}-${idx}`,
    name: m.name,
    priceDelta: Number(m.priceDelta || 0)
  }));

  // Format sizes as relational objects { id, label, priceDelta }
  const rawSizes = Array.isArray(p.sizes) && p.sizes.length > 0 
    ? p.sizes 
    : (p.availableSizes ? p.availableSizes.map(s => ({ label: s.name || s.dimensionStr, priceDelta: (s.multiplier ? (s.multiplier - 1) * basePrice : 0) })) : [{ label: 'Small (5cm)', priceDelta: 0 }]);
  
  const sizes = rawSizes.map((s, idx) => ({
    id: s.id || `sz-${slug}-${idx}`,
    label: s.label || s.name,
    priceDelta: Number(s.priceDelta || 0)
  }));


  const videos = Array.isArray(p.videos) ? p.videos : [];
  const model3d = p.model3d || '';

  return {
    id: p.id || slug,
    name,
    slug,
    description: p.description || '',
    category: p.category,
    basePrice,
    salePrice,
    stockQuantity,
    printTimeHours: Number(p.printTimeHours || 2),
    weightGrams: Number(p.weightGrams || 50),
    careInstructions: p.careInstructions || 'Keep away from direct heat exceeding 55°C.',
    ratingAvg: Number(p.ratingAvg !== undefined ? p.ratingAvg : (p.rating || 5.0)),
    ratingCount: Number(p.ratingCount !== undefined ? p.ratingCount : (p.reviewCount || 1)),
    isActive: p.isActive !== undefined ? Boolean(p.isActive) : true,
    createdAt: p.createdAt || new Date().toISOString(),
    updatedAt: p.updatedAt || new Date().toISOString(),
    // Relational tables
    images,
    materials,
    sizes,
    videos,
    model3d,
    // Storefront backward compatibility aliases
    title: name,
    price: salePrice || basePrice,
    regularPrice: basePrice,
    stock: stockQuantity,
    rating: Number(p.ratingAvg !== undefined ? p.ratingAvg : (p.rating || 5.0)),
    image: images[0]?.url || '/images/products/placeholder.jpg',
    categoryLabel: p.categoryLabel || p.category,
    availableMaterials: materials,
    availableSizes: sizes
  };
}

// 1. GET /api/products (Filterable Storefront Catalog)
router.get('/', async (req, res) => {
  try {
    const { category, search, material, sort } = req.query;

    let products = await supabaseService.getProducts({
      category: category && category !== 'all' ? category : undefined,
      search: search || undefined
    });

    let normalized = products.map(normalizeProduct);

    if (material && material !== 'all') {
      normalized = normalized.filter(p => 
        p.materials?.some(m => m.name?.toLowerCase().includes(material.toLowerCase()))
      );
    }

    if (sort === 'price-low') {
      normalized.sort((a, b) => (a.salePrice || a.basePrice) - (b.salePrice || b.basePrice));
    } else if (sort === 'price-high') {
      normalized.sort((a, b) => (b.salePrice || b.basePrice) - (a.salePrice || a.basePrice));
    } else if (sort === 'rating') {
      normalized.sort((a, b) => b.ratingAvg - a.ratingAvg);
    }

    res.json({
      success: true,
      count: normalized.length,
      data: normalized
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 2. GET /api/products/:id (Product Details by ID or Slug)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await supabaseService.getProductById(id);

    if (!product) {
      return res.status(404).json({ success: false, message: '3D Product Model not found in database' });
    }

    res.json({ success: true, data: normalizeProduct(product) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 3. POST /api/products (Admin Create Product in Supabase)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const body = req.body;
    const name = body.name || body.title;
    const slug = body.slug || name?.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const newProductData = {
      name,
      slug,
      description: body.description,
      category: body.category,
      basePrice: Number(body.basePrice !== undefined ? body.basePrice : (body.regularPrice || body.price || 0)),
      salePrice: body.salePrice !== undefined && body.salePrice !== null ? Number(body.salePrice) : null,
      stockQuantity: Number(body.stockQuantity !== undefined ? body.stockQuantity : (body.stock || 20)),
      images: body.images || (body.image ? [body.image] : undefined),
      videos: body.videos,
      model3d: body.model3d || '',
      videos: body.videos,
      model3d: body.model3d || '',
      materials: body.materials,
      sizes: body.sizes,
    videos,
    model3d: body.model3d || '',
      printTimeHours: Number(body.printTimeHours || 2),
      weightGrams: Number(body.weightGrams || 50),
      careInstructions: body.careInstructions || 'Keep away from direct heat exceeding 55°C.',
      ratingAvg: Number(body.ratingAvg || body.rating || 5.0),
      ratingCount: Number(body.ratingCount || 1),
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : true
    };

    const saved = await supabaseService.createProduct(newProductData);

    res.status(201).json({
      success: true,
      message: 'Product successfully created in Supabase Database',
      data: normalizeProduct(saved)
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// 4. PUT /api/products/:id (Admin Update Product in Supabase)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await supabaseService.updateProduct(id, req.body);

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Product not found in database' });
    }

    res.json({
      success: true,
      message: 'Product updated in Supabase Database',
      data: normalizeProduct(updated)
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// 5. DELETE /api/products/:id (Admin Delete Product in Supabase)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    await supabaseService.deleteProduct(id);
    res.json({ success: true, message: 'Product removed from Supabase Database' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
