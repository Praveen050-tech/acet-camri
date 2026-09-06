import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { supabase } from '../config/supabase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const STORAGE_BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'uploads';

const uploadDir = process.env.VERCEL ? '/tmp/uploads' : path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Always use memory storage to upload to Supabase Storage
const storage = multer.memoryStorage();

console.log('Upload storage mode: Supabase Storage (bucket: ' + STORAGE_BUCKET + ')');

const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.stl', '.obj', '.step', '.stp', '.3mf', '.jpg', '.jpeg', '.png', '.webp', '.mp4', '.webm', '.glb', '.gltf', '.pdf'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Allowed: ' + allowedExtensions.join(', ')), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter
});

router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded. Use field name "file".' });
    }

    let fileUrl = '';

    try {
      // Upload to Supabase Storage
      const ext = path.extname(req.file.originalname).toLowerCase();
      const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;
      const filePath = 'uploads/' + uniqueName;

      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(filePath, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: true
        });

      if (error) {
        throw error;
      }

      // Get the public URL
      const { data: publicUrlData } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(filePath);

      fileUrl = publicUrlData.publicUrl;
    } catch (supaErr) {
      // Fallback to local disk
      console.error('Supabase Storage upload failed, saving locally:', supaErr.message);
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const localName = uniqueSuffix + path.extname(req.file.originalname);
      const localPath = path.join(uploadDir, localName);
      fs.writeFileSync(localPath, req.file.buffer);
      fileUrl = '/uploads/' + localName;
    }

    res.json({
      success: true,
      data: {
        filename: req.file.originalname,
        url: fileUrl,
        size: req.file.size
      }
    });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Alias for old cadFile field name
router.post('/cad', upload.single('cadFile'), async (req, res) => {
  req.url = '/';
  router.handle(req, res);
});

export default router;