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

// ✅ Register User
export const register = async (req, res) => {
  const { name, email, password, phone, avatar, gender } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  try {
    const emailExists = await sql`SELECT 1 FROM users WHERE email = ${email.trim()}`;
    if (emailExists.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    if (phone) {
      const phoneExists = await sql`SELECT 1 FROM users WHERE phone = ${phone.trim()}`;
      if (phoneExists.length > 0) {
        return res.status(400).json({ error: 'Phone number already registered' });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await sql`
      INSERT INTO users (name, email, password, phone, avatar, gender)
      VALUES (${name.trim()}, ${email.trim()}, ${hashedPassword}, ${phone?.trim()}, ${avatar}, ${gender})
      RETURNING id, name, email, phone, avatar, gender, created_at
    `;

    const user = result[0];
    console.log('[REGISTER] Success:', user.email);

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
        joinedDate: user.created_at,
      }
    });
  } catch (err) {
    console.error('[REGISTER] Error:', err.message);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
};

// ✅ Login User
export const login = async (req, res) => {
  const { phone: rawPhone, password: rawPass } = req.body;

  if (!rawPhone || !rawPass) {
    return res.status(400).json({ error: 'Phone and password are required' });
  }

  const phone = rawPhone.trim();
  const password = rawPass.trim();

  try {
    const result = await sql`SELECT * FROM users WHERE phone = ${phone}`;
    if (!result.length) {
      return res.status(400).json({ error: 'Invalid phone number or password' });
    }

    const user = result[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid phone number or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, phone: user.phone },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    await sql`UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = ${user.id}`;

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
        joinedDate: user.created_at,
      },
    });
  } catch (err) {
    console.error('[LOGIN] Error:', err.message);
    return res.status(500).json({ error: 'Login failed. Please try again.' });
  }
};

// ✅ Verify Token Middleware
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access token required' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// ✅ Update Profile
export const updateUser = async (req, res) => {
  const { name, email, avatar, gender, phone } = req.body;
  const userId = req.user.id;

  try {
    if (email) {
      const emailExists = await sql`
        SELECT 1 FROM users WHERE email = ${email} AND id != ${userId}
      `;
      if (emailExists.length > 0) {
        return res.status(400).json({ error: 'Email already in use' });
      }
    }

    if (phone) {
      const phoneExists = await sql`
        SELECT 1 FROM users WHERE phone = ${phone} AND id != ${userId}
      `;
      if (phoneExists.length > 0) {
        return res.status(400).json({ error: 'Phone already in use' });
      }
    }

    const updatedUser = await sql`
      UPDATE users SET
        name = COALESCE(${name}, name),
        email = COALESCE(${email}, email),
        avatar = COALESCE(${avatar}, avatar),
        gender = COALESCE(${gender}, gender),
        phone = COALESCE(${phone}, phone),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${userId}
      RETURNING id, name, email, phone, avatar, gender, created_at
    `;

    if (!updatedUser.length) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = updatedUser[0];
    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        gender: user.gender,
        joinedDate: user.created_at,
      }
    });
  } catch (err) {
    console.error('[UPDATE_USER] Error:', err.message);
    res.status(500).json({ error: 'Profile update failed' });
  }
};

// ✅ Get User Profile
export const getUserProfile = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await sql`
      SELECT id, name, email, phone, avatar, gender, created_at
      FROM users WHERE id = ${userId}
    `;

    if (!result.length) {
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
        joinedDate: user.created_at,
      }
    });
  } catch (err) {
    console.error('[GET_USER] Error:', err.message);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};
