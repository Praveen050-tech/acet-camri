import express from 'express';
import { supabaseService } from '../data/supabaseStore.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// GET /api/payment/settings - Get active bank/UPI details
router.get('/settings', async (req, res) => {
  try {
    const settings = await supabaseService.getPaymentSettings();
    res.json({ success: true, data: settings });
  } catch (error) {
    console.error('Fetch payment settings error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/payment/settings - Update bank/UPI details (Admin only)
router.put('/settings', protect, adminOnly, async (req, res) => {
  try {
    const settings = await supabaseService.updatePaymentSettings(req.body);
    res.json({ success: true, data: settings });
  } catch (error) {
    console.error('Update payment settings error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/payment/:orderId/submit - Submit payment screenshot
router.post('/:orderId/submit', protect, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { amountDue, buyerContactName, buyerContactEmail, buyerContactPhone, screenshotUrl, transactionRefNote } = req.body;

    if (!screenshotUrl) {
      return res.status(400).json({ success: false, message: 'Screenshot URL is required.' });
    }

    // Verify order belongs to the user
    const order = await supabaseService.getOrderById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }
    
    // In a real app, verify req.user.uid === order.buyer (but we are allowing submission if they know the ID for now, or you can strictly enforce it)
    if (order.buyer !== req.user.uid && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized to submit payment for this order.' });
    }

    const paymentData = {
      orderId,
      amountDue: order.totalAmount, // Server truth, don't trust client amountDue
      buyerContactName,
      buyerContactEmail,
      buyerContactPhone,
      screenshotUrl,
      transactionRefNote,
      status: 'pending_verification'
    };

    const payment = await supabaseService.createPayment(paymentData);
    
    // Update order status indirectly by changing its payment Status context (we leave overall status as Placed or change if we want)
    // The spec says: CustomerOrder.status = 'Placed' stays as-is but a new order-facing status label "Payment Submitted" is shown
    // We will update the order's paymentStatus to pending_verification
    await supabaseService.updateOrderStatus(orderId, order.status, 'pending_verification', req.user.uid);

    res.status(201).json({ success: true, data: payment });
  } catch (error) {
    console.error('Submit payment error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/payment/pending - Get pending payments (Admin only)
router.get('/pending', protect, adminOnly, async (req, res) => {
  try {
    const payments = await supabaseService.getPayments('pending_verification');
    res.json({ success: true, data: payments });
  } catch (error) {
    console.error('Fetch pending payments error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH /api/payment/:id/verify - Verify payment (Admin only)
router.patch('/:id/verify', protect, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    
    const payment = await supabaseService.updatePayment(id, {
      status: 'verified',
      verifiedByAdminUid: req.user.uid,
      verifiedAt: new Date().toISOString()
    });

    if (payment) {
      // Move order to Confirmed
      await supabaseService.updateOrderStatus(payment.orderId || payment.order_id, 'Confirmed', 'paid', req.user.uid);
    }

    res.json({ success: true, data: payment });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH /api/payment/:id/reject - Reject payment (Admin only)
router.patch('/:id/reject', protect, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body; // we could store rejection reason in payment if we add the field

    const payment = await supabaseService.updatePayment(id, {
      status: 'rejected'
      // transactionRefNote: reason // Optionally repurpose this or add a new field
    });

    if (payment) {
      // Revert order payment status back to failed/rejected
      await supabaseService.updateOrderStatus(payment.orderId || payment.order_id, 'Placed', 'failed', req.user.uid);
    }

    res.json({ success: true, data: payment });
  } catch (error) {
    console.error('Reject payment error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
