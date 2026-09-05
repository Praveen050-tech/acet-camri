import express from 'express';
import { supabaseService } from '../data/supabaseStore.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// 1. POST /api/custom-requests (Student/Faculty CAD Intake Submission)
router.post('/', async (req, res) => {
  try {
    const {
      name,
      studentName,
      email,
      phone,
      contact,
      referenceImageUrl,
      desiredSize,
      dimensions,
      material = 'PLA Pro',
      budgetRange,
      deadline,
      notes,
      specialInstructions,
      fileName,
      fileUrl
    } = req.body;

    const requesterName = name || studentName || 'ACET Maker Student';
    const requesterPhone = phone || contact || '+91 97894 44111';
    const requesterEmail = email || `${requesterName.toLowerCase().replace(/[^a-z0-9]/g, '')}@acetcbe.edu.in`;

    const requestPayload = {
      name: requesterName,
      email: requesterEmail,
      phone: requesterPhone,
      referenceImageUrl: fileUrl || referenceImageUrl || fileName || 'custom_model.stl',
      desiredSize: desiredSize || (typeof dimensions === 'object' ? `${dimensions.length}x${dimensions.width}x${dimensions.height} cm` : 'Standard 100mm'),
      material: material || 'PLA Pro',
      budgetRange: budgetRange || '₹500 - ₹1500',
      deadline: deadline || 'Within 3 days',
      notes: notes || specialInstructions || 'Standard 50-micron slicing required.'
    };

    const saved = await supabaseService.createCustomRequest(requestPayload);

    res.status(201).json({
      success: true,
      message: 'Custom CAD print request submitted to Supabase Database',
      data: {
        ...saved,
        studentName: saved.name,
        contact: saved.phone,
        estimatedPrice: 650,
        estimatedWeight: 85,
        estimatedHours: 4
      }
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// 2. GET /api/custom-requests (Admin View Custom CAD Intake Queue)
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const list = await supabaseService.getAllCustomRequests();
    res.json({
      success: true,
      count: list.length,
      data: list.map(item => ({
        ...item,
        studentName: item.name,
        contact: item.phone,
        estimatedPrice: item.budgetRange || 750
      }))
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
