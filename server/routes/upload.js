import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { bucket } from '../config/firebase.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const uploadDir = process.env.VERCEL ? '/tmp/uploads' : path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Memory storage for Firebase upload on Vercel, disk storage for local if Firebase is missing
const storage = process.env.VERCEL || bucket 
  ? multer.memoryStorage()
  : multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, uploadDir);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
      }
    });

const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.stl', '.obj', '.step', '.stp', '.3mf', '.jpg', '.jpeg', '.png', '.webp', '.mp4', '.webm', '.glb', '.gltf', '.pdf'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed: ${allowedExtensions.join(', ')}`), false);
  }
};

const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter
});

router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      // For backward compatibility with 'cadFile' name from earlier checkout form
      return res.status(400).json({ success: false, message: 'No file uploaded. Use field name "file" or "cadFile".' });
    }

    let fileUrl = '';
    
    // Upload to Firebase Storage if available (and we are using memoryStorage)
    if ((process.env.VERCEL || bucket) && req.file.buffer && bucket) {
      const ext = path.extname(req.file.originalname).toLowerCase();
      const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;
      const blob = bucket.file(`uploads/${uniqueName}`);
      const blobStream = blob.createWriteStream({
        metadata: {
          contentType: req.file.mimetype
        }
      });
      
      await new Promise((resolve, reject) => {
        blobStream.on('error', err => reject(err));
        blobStream.on('finish', () => resolve());
        blobStream.end(req.file.buffer);
      });
      
      await blob.makePublic();
      fileUrl = blob.publicUrl();
    } else {
      // Local fallback
      fileUrl = `/uploads/${req.file.filename}`;
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

// Alias for old 'cadFile' field name
router.post('/cad', upload.single('cadFile'), async (req, res) => {
  // Delegate to the root logic
  req.url = '/';
  router.handle(req, res);
});

export default router;
