import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'acet_3d_printing_club_jwt_secret_kinathukadavu_2026';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = { 
        _id: decoded.id || decoded.uid || 'acet-admin-01', 
        uid: decoded.uid || decoded.id,
        name: decoded.name || 'ACET 3D Club Lead', 
        email: decoded.email || 'admin@acetcbe.edu.in',
        role: decoded.role || 'admin',
        admin: decoded.admin === true || decoded.role === 'admin'
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

// Buyer authentication middleware — verifies the buyer is logged in
export const buyerProtect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      
      req.buyer = {
        uid: decoded.uid || decoded.id,
        name: decoded.name,
        email: decoded.email,
        role: decoded.role
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
