import express from 'express';
import { persistentStore } from '../data/persistentStore.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// 1. POST /api/contact (Submit Contact/Inquiry Message)
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
    }

    const contactEntry = {
      id: `inq-${Date.now()}`,
      name,
      email,
      phone: phone || '',
      subject: subject || 'General Store / 3D Lab Inquiry',
      message,
      status: 'New Inquiry',
      createdAt: new Date().toISOString()
    };

    persistentStore.insert('contacts', contactEntry);

    res.status(201).json({
      success: true,
      message: 'Thank you for contacting ACET 3D Lab. Our student coordinators will reach out shortly.',
      data: contactEntry
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 2. GET /api/contact (Admin View Inquiries)
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const inquiries = persistentStore.get('contacts');
    res.json({ success: true, count: inquiries.length, data: inquiries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
