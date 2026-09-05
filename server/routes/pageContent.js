/**
 * ACET CAMRI - Page Content CMS API
 * Provides CRUD for dynamic content blocks on institutional pages.
 */

import express from 'express';
import { supabaseService } from '../data/supabaseStore.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

const VALID_PAGES = ['facilities', 'services', 'research', 'training', 'projects', 'industry'];

// GET /api/page-content/:pageSlug - Public
router.get('/:pageSlug', async (req, res) => {
  try {
    const { pageSlug } = req.params;
    if (!VALID_PAGES.includes(pageSlug)) {
      return res.status(400).json({ success: false, message: 'Invalid page slug. Valid: ' + VALID_PAGES.join(', ') });
    }
    const blocks = await supabaseService.getPageContent(pageSlug);
    res.json({ success: true, data: blocks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/page-content - Admin only
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { pageSlug, title, description, imageUrl, position } = req.body;
    if (!pageSlug || !title) {
      return res.status(400).json({ success: false, message: 'pageSlug and title are required.' });
    }
    if (!VALID_PAGES.includes(pageSlug)) {
      return res.status(400).json({ success: false, message: 'Invalid page slug.' });
    }
    const block = await supabaseService.createPageContent({
      pageSlug, title, description: description || '', imageUrl: imageUrl || '', position: position || 0
    });
    res.status(201).json({ success: true, data: block });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/page-content/:id - Admin only
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, imageUrl, position } = req.body;
    const updated = await supabaseService.updatePageContent(id, { title, description, imageUrl, position });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Content block not found.' });
    }
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/page-content/:id - Admin only
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    await supabaseService.deletePageContent(id);
    res.json({ success: true, message: 'Content block deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
