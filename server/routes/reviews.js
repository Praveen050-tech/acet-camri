import express from 'express';
import { supabaseService } from '../data/supabaseStore.js';

const router = express.Router();

// 1. GET /api/reviews/:productId (Publicly readable from Supabase)
router.get('/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const list = await supabaseService.getReviewsForProduct(productId);
    
    res.json({
      success: true,
      count: list.length,
      data: list.map(r => ({
        ...r,
        author: r.customerName || r.author || 'ACET Maker Student',
        role: 'Verified Campus Maker',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        verifiedPurchase: true
      }))
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 2. POST /api/reviews (Create Review in Supabase)
router.post('/', async (req, res) => {
  try {
    const { productId, customerName, author, rating, comment } = req.body;
    const saved = await supabaseService.createReview({
      productId: productId || 'acet-merch-01',
      customerName: customerName || author || 'ACET Maker Student',
      rating: Number(rating || 5),
      comment: comment || 'Masterpiece 50-micron 3D print.'
    });

    res.status(201).json({
      success: true,
      message: 'Review recorded in Supabase Database',
      data: saved
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;
