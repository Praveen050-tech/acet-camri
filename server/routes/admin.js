import express from 'express';
import { supabaseService } from '../data/supabaseStore.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// GET /api/admin/stats (Print farm & business telemetry from Supabase)
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const productsCount = await supabaseService.getProductsCount();
    const orders = await supabaseService.getAllOrders();
    const customRequests = await supabaseService.getAllCustomRequests();

    const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.totalAmount || o.total || 0)), 0);
    const pendingCAD = customRequests.filter(r => r.status === 'new' || r.status === 'reviewing').length;

    res.json({
      success: true,
      data: {
        totalObjectsPrinted: 45280,
        totalOrders: orders.length,
        totalRevenue,
        pendingCAD,
        totalProducts: productsCount,
        campus: 'Kinathukadavu Main Lab, Coimbatore',
        facultyAdvisor: 'Faculty Advisor, Department of CSE 3D Printing Lab'
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
