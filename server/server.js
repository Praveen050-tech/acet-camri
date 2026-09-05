/**
 * ACET 3D — Production Express.js + Supabase PostgreSQL API Server
 * Department of Computer Science and Engineering
 * Akshaya College of Engineering & Technology (acetcbe.edu.in • TNEA: 2763)
 */

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { supabase, isLiveSupabase, SUPABASE_URL } from './config/supabase.js';
import { supabaseService } from './data/supabaseStore.js';
import { seedDatabase } from './data/seed.js';

import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import customRequestRoutes from './routes/customRequests.js';
import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import settingsRoutes from './routes/settings.js';
import uploadRoutes from './routes/upload.js';
import reviewRoutes from './routes/reviews.js';
import contactRoutes from './routes/contact.js';
import pageContentRoutes from './routes/pageContent.js';
import paymentRoutes from './routes/payment.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Supabase tables & seed data
// seedDatabase().catch((err) => {
  // console.warn('Initial seeding notice:', err.message);
// });

// Production & Subdomain CORS policy
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5000',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5000',
  'https://store.acetcbe.edu.in',
  'https://acet-camri.vercel.app',
  'https://3d.acetcbe.edu.in',
  'https://acetcbe.edu.in'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.acetcbe.edu.in')) {
      callback(null, true);
    } else {
      callback(null, true); // Permissive in development
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Route Mounts
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/custom-requests', customRequestRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/page-content', pageContentRoutes);
app.use('/api/payment', paymentRoutes);

// Health check endpoint (Queries Supabase PostgreSQL database)
app.get('/api/health', async (req, res) => {
  try {
    const productsCount = await supabaseService.getProductsCount();

    res.json({
      success: true,
      status: 'online',
      service: 'ACET 3D Supabase PostgreSQL API',
      databaseEngine: isLiveSupabase ? 'Supabase PostgreSQL (Live)' : 'Supabase (Local Fallback Mode)',
      supabaseUrl: SUPABASE_URL,
      productsCount: productsCount,
      institution: 'Akshaya College of Engineering and Technology (acetcbe.edu.in)',
      department: 'Department of Computer Science and Engineering',
      tneaCode: 2763,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../client/dist')));
app.use(express.static(path.join(__dirname, '../')));

// Fallback router for React SPA
app.get('*', (req, res) => {
  const clientDist = path.join(__dirname, '../client/dist/index.html');
  res.sendFile(clientDist, (err) => {
    if (err) {
      res.sendFile(path.join(__dirname, '../index.html'));
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ success: false, message: err.message || 'Internal Server Error' });
});

if (!process.env.VERCEL) {
app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`⚡  ACET 3D Supabase Database Server running on port ${PORT}`);
  console.log(`🌐 Local API: http://localhost:${PORT}`);
  console.log(`🩺 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🎓 Institution: Akshaya College (acetcbe.edu.in • TNEA: 2763)`);
  console.log(`🚀 Dept: Computer Science & Engineering`);
  console.log(`======================================================\n`);
  });
}

export default app;
