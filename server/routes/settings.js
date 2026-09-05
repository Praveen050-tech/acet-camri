import express from 'express';
import fs from 'fs';
import path from 'path';
import { protect, adminOnly } from '../middleware/auth.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const settingsFile = path.join(__dirname, '..', 'data', 'settings.json');

const getDefaultSettings = () => ({
  studentDiscountPercent: 40,
  facultyDiscountPercent: 20,
  maintenanceMode: false
});

router.get('/', (req, res) => {
  try {
    if (fs.existsSync(settingsFile)) {
      const data = JSON.parse(fs.readFileSync(settingsFile, 'utf8'));
      return res.json({ success: true, data });
    }
    res.json({ success: true, data: getDefaultSettings() });
  } catch(e) {
    res.json({ success: true, data: getDefaultSettings() });
  }
});

router.put('/', protect, adminOnly, (req, res) => {
  try {
    const newSettings = req.body;
    fs.writeFileSync(settingsFile, JSON.stringify(newSettings, null, 2));
    res.json({ success: true, data: newSettings });
  } catch(e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

export default router;
