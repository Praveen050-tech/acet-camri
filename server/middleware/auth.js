import { supabase } from '../config/supabase.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const { data: { user }, error } = await supabase.auth.getUser(token);
      
      if (error || !user) {
        return res.status(401).json({ success: false, message: 'Not authorized, invalid Supabase authentication token' });
      }

      req.user = { 
        _id: user.id, 
        uid: user.id,
        name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'ACET User', 
        email: user.email,
        role: user.user_metadata?.role || 'user',
        admin: user.user_metadata?.admin === true || user.user_metadata?.role === 'admin'
      };
      
      return next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Not authorized, invalid authentication token' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && (req.user.admin === true || req.user.role === 'admin' || req.user.role === 'club_lead')) {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Forbidden: Admin credentials required' });
  }
};

export const buyerProtect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const { data: { user }, error } = await supabase.auth.getUser(token);
      
      if (error || !user) {
        return res.status(401).json({ success: false, message: 'Session expired. Please log in again.' });
      }
      
      req.buyer = {
        uid: user.id,
        name: user.user_metadata?.full_name || user.email?.split('@')[0],
        email: user.email,
        role: user.user_metadata?.role || 'user'
      };
      return next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Session expired. Please log in again.' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Please log in to continue.' });
  }
};