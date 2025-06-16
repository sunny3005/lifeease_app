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
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
  `;
}

// ✅ Register User
export const register = async (req, res) => {
  const { name, email, password, phone, avatar, gender } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Check if email already exists
    const emailExists = await sql`SELECT * FROM users WHERE email = ${email.trim()}`;
    if (emailExists.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Check if phone already exists
    if (phone) {
      const phoneExists = await sql`SELECT * FROM users WHERE phone = ${phone.trim()}`;
      if (phoneExists.length > 0) {
        return res.status(400).json({ error: 'Phone already registered' });
      }
    }

    const hashed = await bcrypt.hash(password, 10);

    const result = await sql`
      INSERT INTO users (name, email, password, phone, avatar, gender)
      VALUES (${name.trim()}, ${email.trim()}, ${hashed}, ${phone?.trim()}, ${avatar}, ${gender})
      RETURNING id, name, email, phone, avatar, gender, created_at
    `;

    const user = result[0];
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });

    console.log('[REGISTER] User registered successfully:', user);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user
    });
  } catch (err) {
    console.error('[REGISTER] Error:', err.message);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Login User by phone
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
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const user = result[0];
    console.log('[LOGIN] Found user:', { id: user.id, phone: user.phone, name: user.name });

    const match = await bcrypt.compare(password, user.password);
    console.log('[LOGIN] Password match:', match);

    if (!match) {
      console.log('[LOGIN] 🛑 Password mismatch');
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });

    console.log('[LOGIN] ✅ Login successful for user:', user.name);

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        gender: user.gender,
        membershipType: 'Free',
        joinedDate: user.created_at,
      },
    });
  } catch (err) {
    console.error('[LOGIN] 🚨 Server error:', err.message);
    return res.status(500).json({ error: 'Server error' });
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
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// ✅ Update User
export const updateUser = async (req, res) => {
  const { name, email, avatar, gender } = req.body;
  const userId = req.user.id;

  console.log('[UPDATE_USER] Updating user:', userId, { name, email, avatar, gender });

  try {
    const updatedUser = await sql`
      UPDATE users
      SET name = ${name}, email = ${email}, avatar = ${avatar}, gender = ${gender}
      WHERE id = ${userId}
      RETURNING id, name, email, phone, avatar, gender
    `;

    if (updatedUser.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('[UPDATE_USER] ✅ User updated successfully:', updatedUser[0]);

    res.json({ 
      message: 'User updated successfully',
      user: updatedUser[0] 
    });
  } catch (err) {
    console.error('[UPDATE_USER] Error:', err.message);
    res.status(500).json({ error: 'Failed to update user' });
  }
};