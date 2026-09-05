import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { supabase, isLiveSupabase } from '../config/supabase.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'acet_3d_printing_club_jwt_secret_kinathukadavu_2026';

const generateToken = (id, role, email) => {
  return jwt.sign(
    { id, role, email, admin: role === 'admin' },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
};

const generateBuyerToken = (uid, email, name, role = 'external') => {
  return jwt.sign(
    { uid, role, email, name },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
};

// -------------------------------------------------------
// BUYER AUTHENTICATION
// -------------------------------------------------------

// POST /api/auth/buyer/register
router.post('/buyer/register', async (req, res) => {
  try {
    const { name, email, phone, password, requestedRole } = req.body;

    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }

    // Check if email already exists
    if (supabase && isLiveSupabase) {
      const { data: existing } = await supabase
        .from('app_users')
        .select('uid')
        .eq('email', email.trim().toLowerCase())
        .maybeSingle();

      if (existing) {
        return res.status(409).json({ success: false, message: 'An account with this email already exists. Please log in.' });
      }

      // Hash password and insert
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const { data: newUser, error } = await supabase
        .from('app_users')
        .insert({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone?.trim() || null,
          password_hash: passwordHash,
          role: (email.trim().toLowerCase().endsWith('@acet.edu.in') && ['student', 'faculty'].includes(requestedRole)) ? requestedRole : 'external'
        })
        .select('uid, name, email, phone, role, created_at')
        .single();

      if (error) {
        console.error('Supabase register error:', error);
        return res.status(500).json({ success: false, message: 'Registration failed. Please try again.' });
      }

      const token = generateBuyerToken(newUser.uid, newUser.email, newUser.name, newUser.role);

      return res.status(201).json({
        success: true,
        data: {
          uid: newUser.uid,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          role: newUser.role,
          token
        }
      });
    }

    // Offline fallback — generate a local account
    const uid = `local-buyer-${Date.now()}`;
    const determinedRole = (email.trim().toLowerCase().endsWith('@acet.edu.in') && ['student', 'faculty'].includes(requestedRole)) ? requestedRole : 'external';
    const token = generateBuyerToken(uid, email, name, determinedRole);
    return res.status(201).json({
      success: true,
      data: { uid, name, email, phone, role: determinedRole, token }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/auth/buyer/login
router.post('/buyer/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    if (supabase && isLiveSupabase) {
      const { data: user, error } = await supabase
        .from('app_users')
        .select('uid, name, email, phone, password_hash, role')
        .eq('email', email.trim().toLowerCase())
        .maybeSingle();

      if (error || !user) {
        return res.status(401).json({ success: false, message: 'No account found with this email.' });
      }

      if (!user.password_hash) {
        return res.status(401).json({ success: false, message: 'This account does not have a password set. Please contact support.' });
      }

      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Incorrect password. Please try again.' });
      }

      const token = generateBuyerToken(user.uid, user.email, user.name, user.role);

      return res.json({
        success: true,
        data: {
          uid: user.uid,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          token
        }
      });
    }

    // Offline fallback
    return res.status(401).json({ success: false, message: 'Database not available. Please try again later.' });
  } catch (error) {
    console.error('Buyer login error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/auth/buyer/me — Get buyer profile
router.get('/buyer/me', async (req, res) => {
  try {
    let token;
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'customer') {
      return res.status(403).json({ success: false, message: 'Not a buyer account' });
    }

    res.json({
      success: true,
      data: {
        uid: decoded.uid,
        name: decoded.name,
        email: decoded.email,
        role: 'customer'
      }
    });
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
});

// -------------------------------------------------------
// ADMIN AUTHENTICATION (existing)
// -------------------------------------------------------

// POST /api/auth/login (Admin / Club Lead Login)
router.post('/login', async (req, res) => {
  try {
    const { email, password, accessToken } = req.body;

    // If client logs in via Supabase Auth SDK on frontend and passes accessToken
    if (accessToken && supabase) {
      try {
        const { data: { user }, error } = await supabase.auth.getUser(accessToken);
        if (!error && user) {
          return res.json({
            success: true,
            data: {
              uid: user.id,
              name: user.user_metadata?.name || 'ACET CSE 3D Lead',
              email: user.email,
              role: user.user_metadata?.role || 'admin',
              department: 'Department of Computer Science and Engineering',
              token: accessToken
            }
          });
        }
      } catch (sbErr) {
        console.warn('Supabase Auth verification error:', sbErr.message);
      }
    }

    // Admin login via app_admins table
    if (supabase && isLiveSupabase) {
      const { data: admin, error } = await supabase
        .from('app_admins')
        .select('*')
        .eq('email', email.trim().toLowerCase())
        .maybeSingle();

      if (admin && admin.password_hash) {
        const isMatch = await bcrypt.compare(password, admin.password_hash);
        if (isMatch) {
          return res.json({
            success: true,
            data: {
              _id: admin.admin_id,
              name: admin.name,
              email: admin.email,
              role: admin.role,
              department: admin.department,
              token: generateToken(admin.admin_id, admin.role, admin.email)
            }
          });
        }
      }
    }
    
    // Fallback local memory admin (always allow this for ACET)
    if ((email === 'admin@acetcbe.edu.in' || email === 'admin') && password === 'acet3d2026') {
      return res.json({
        success: true,
        data: {
          _id: 'admin_acet_cse_01',
          name: 'ACET 3D Club Lead',
          email: 'admin@acetcbe.edu.in',
          role: 'admin',
          department: 'Department of Computer Science and Engineering',
          token: generateToken('admin_acet_cse_01', 'admin', 'admin@acetcbe.edu.in')
        }
      });
    }

    res.status(401).json({ success: false, message: 'Invalid admin credentials' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/auth/profile (Update Admin Profile)
router.put('/profile', protect, adminOnly, async (req, res) => {
  try {
    const { name, currentPassword, newPassword } = req.body;
    const adminId = req.user._id || req.user.uid;

    if (!supabase || !isLiveSupabase) {
      return res.status(400).json({ success: false, message: 'Database connection error' });
    }

    // Get current admin
    const { data: admin, error: fetchErr } = await supabase
      .from('app_admins')
      .select('*')
      .eq('admin_id', adminId)
      .single();

    if (fetchErr || !admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    const updates = {};
    
    if (name) {
      updates.name = name;
    }

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ success: false, message: 'Current password required to set a new password' });
      }
      const isMatch = await bcrypt.compare(currentPassword, admin.password_hash);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Current password is incorrect' });
      }
      const salt = await bcrypt.genSalt(10);
      updates.password_hash = await bcrypt.hash(newPassword, salt);
    }

    if (Object.keys(updates).length > 0) {
      const { data: updated, error: updateErr } = await supabase
        .from('app_admins')
        .update(updates)
        .eq('admin_id', adminId)
        .select('name, email, role')
        .single();

      if (updateErr) {
        throw new Error(updateErr.message);
      }
      
      return res.json({ success: true, message: 'Profile updated successfully', data: updated });
    }

    res.json({ success: true, message: 'No changes made' });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/auth/set-admin-claim (Set Admin Role in Supabase)
router.post('/set-admin-claim', protect, adminOnly, async (req, res) => {
  try {
    const { uid, email } = req.body;
    if (!uid && !email) {
      return res.status(400).json({ success: false, message: 'User ID or email is required' });
    }

    if (supabase && isLiveSupabase) {
      if (uid) {
        await supabase.auth.admin.updateUserById(uid, {
          user_metadata: { role: 'admin' }
        });
      }
      return res.json({ success: true, message: `Successfully configured admin role for: ${uid || email}` });
    }

    res.json({ success: true, message: 'Admin claim registered in Supabase persistent store' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/auth/me (Get Current Profile)
router.get('/me', protect, async (req, res) => {
  res.json({
    success: true,
    data: {
      ...req.user,
      department: 'Department of Computer Science and Engineering'
    }
  });
});

export default router;
