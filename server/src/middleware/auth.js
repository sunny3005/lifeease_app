import jwt from 'jsonwebtoken';
import { sql } from '../../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Verify user still exists
    const user = await sql`
      SELECT id, name, email, phone, avatar, gender, membership_type, created_at
      FROM users WHERE id = ${decoded.id}
    `;

    if (user.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = {
      id: user[0].id,
      name: user[0].name,
      email: user[0].email,
      phone: user[0].phone,
      avatar: user[0].avatar,
      gender: user[0].gender,
      membershipType: user[0].membership_type,
      joinedDate: user[0].created_at
    };
    
    next();
  } catch (error) {
    console.error('[AUTH_MIDDLEWARE] Token verification failed:', error.message);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

export const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await sql`
      SELECT id, name, email, phone, avatar, gender, membership_type, created_at
      FROM users WHERE id = ${decoded.id}
    `;

    if (user.length > 0) {
      req.user = {
        id: user[0].id,
        name: user[0].name,
        email: user[0].email,
        phone: user[0].phone,
        avatar: user[0].avatar,
        gender: user[0].gender,
        membershipType: user[0].membership_type,
        joinedDate: user[0].created_at
      };
    } else {
      req.user = null;
    }
  } catch (error) {
    req.user = null;
  }

  next();
};