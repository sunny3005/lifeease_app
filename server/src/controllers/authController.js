import { sql } from '../../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

// 🛠 Create the table if it doesn't exist
export async function setupUserTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT UNIQUE,
      password TEXT NOT NULL,
      avatar TEXT,
      gender TEXT,
      membership_type TEXT DEFAULT 'Free',
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
  `;
}

// ✅ Register User - Fixed to redirect to login after success
export const register = async (req, res) => {
  const { name, email, password, phone, avatar, gender } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  try {
    // Check if email already exists
    const emailExists = await sql`SELECT * FROM users WHERE email = ${email.trim()}`;
    if (emailExists.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Check if phone already exists (if provided)
    if (phone) {
      const phoneExists = await sql`SELECT * FROM users WHERE phone = ${phone.trim()}`;
      if (phoneExists.length > 0) {
        return res.status(400).json({ error: 'Phone number already registered' });
      }
    }

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await sql`
      INSERT INTO users (name, email, password, phone, avatar, gender)
      VALUES (${name.trim()}, ${email.trim()}, ${hashedPassword}, ${phone?.trim()}, ${avatar}, ${gender})
      RETURNING id, name, email, phone, avatar, gender, membership_type, created_at
    `;

    const user = result[0];
    console.log('[REGISTER] User registered successfully:', user.email);

    // Don't auto-login, just return success message
    res.status(201).json({
      success: true,
      message: 'Account created successfully! Please login to continue.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        gender: user.gender,
        membershipType: user.membership_type,
        joinedDate: user.created_at,
      }
    });
  } catch (err) {
    console.error('[REGISTER] Error:', err.message);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
};

// ✅ Login User - Enhanced security and validation
export const login = async (req, res) => {
  const { phone: rawPhone, password: rawPass } = req.body;
  
  if (!rawPhone || !rawPass) {
    return res.status(400).json({ error: 'Phone and password are required' });
  }

  const phone = rawPhone.trim();
  const password = rawPass.trim();

  console.log('[LOGIN] Attempting login with phone:', phone);

  try {
    const result = await sql`SELECT * FROM users WHERE phone = ${phone}`;
    if (!result.length) {
      console.log('[LOGIN] 🛑 No user found with phone:', phone);
      return res.status(400).json({ error: 'Invalid phone number or password' });
    }
    const user = result[0];
    console.log('[LOGIN] Found user:', { id: user.id, phone: user.phone, name: user.name });
console.log('[LOGIN] Plain password from request:', password);
console.log('[LOGIN] Stored hashed password from DB:', user.password);

    // Verify password with bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('[LOGIN] Password validation:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('[LOGIN] 🛑 Password mismatch');
      return res.status(400).json({ error: 'Invalid phone number or password' });
    }
console.log('[LOGIN] Password validation:', isPasswordValid);
    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email,
        phone: user.phone 
      }, 
      JWT_SECRET, 
      { expiresIn: '7d' }
    );

    // Update last login timestamp
    await sql`UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = ${user.id}`;

    console.log('[LOGIN] ✅ Login successful for user:', user.name);

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        gender: user.gender,
        membershipType: user.membership_type || 'Free',
        joinedDate: user.created_at,
      },
    });
  } catch (err) {
    console.error('[LOGIN] 🚨 Server error:', err.message);
    return res.status(500).json({ error: 'Login failed. Please try again.' });
  }
};

// Middleware to verify JWT token
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('[AUTH] Token verification failed:', err.message);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// ✅ Update User Profile
export const updateUser = async (req, res) => {
  const { name, email, avatar, gender, phone } = req.body;
  const userId = req.user.id;

  console.log('[UPDATE_USER] Updating user:', userId, { name, email, avatar, gender, phone });

  try {
    // Check if email is being changed and if it's already taken
    if (email) {
      const emailExists = await sql`
        SELECT * FROM users WHERE email = ${email} AND id != ${userId}
      `;
      if (emailExists.length > 0) {
        return res.status(400).json({ error: 'Email already in use by another account' });
      }
    }

    // Check if phone is being changed and if it's already taken
    if (phone) {
      const phoneExists = await sql`
        SELECT * FROM users WHERE phone = ${phone} AND id != ${userId}
      `;
      if (phoneExists.length > 0) {
        return res.status(400).json({ error: 'Phone number already in use by another account' });
      }
    }

    const updatedUser = await sql`
      UPDATE users
      SET 
        name = COALESCE(${name}, name),
        email = COALESCE(${email}, email),
        avatar = COALESCE(${avatar}, avatar),
        gender = COALESCE(${gender}, gender),
        phone = COALESCE(${phone}, phone),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${userId}
      RETURNING id, name, email, phone, avatar, gender, membership_type, created_at
    `;

    if (updatedUser.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('[UPDATE_USER] ✅ User updated successfully:', updatedUser[0]);

    res.json({ 
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: updatedUser[0].id,
        name: updatedUser[0].name,
        email: updatedUser[0].email,
        phone: updatedUser[0].phone,
        avatar: updatedUser[0].avatar,
        gender: updatedUser[0].gender,
        membershipType: updatedUser[0].membership_type,
        joinedDate: updatedUser[0].created_at,
      }
    });
  } catch (err) {
    console.error('[UPDATE_USER] Error:', err.message);
    res.status(500).json({ error: 'Failed to update profile. Please try again.' });
  }
};

// ✅ Get User Profile
export const getUserProfile = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await sql`
      SELECT id, name, email, phone, avatar, gender, membership_type, created_at
      FROM users WHERE id = ${userId}
    `;

    if (result.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result[0];
    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        gender: user.gender,
        membershipType: user.membership_type,
        joinedDate: user.created_at,
      }
    });
  } catch (err) {
    console.error('[GET_USER] Error:', err.message);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
};