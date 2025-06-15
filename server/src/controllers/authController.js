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

  const phoneExists = await sql`SELECT * FROM users WHERE phone = ${phone}`;
  if (phoneExists.length > 0) {
    return res.status(400).json({ error: 'Phone already registered' });
  }

  try {
    const existing = await sql`SELECT * FROM users WHERE email = ${email}`;
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashed = await bcrypt.hash(password, 10);

    const result = await sql`
      INSERT INTO users (name, email, password, phone, avatar, gender)
      VALUES (${name}, ${email}, ${hashed}, ${phone}, ${avatar}, ${gender})
      RETURNING id, name, email, phone, avatar, gender, created_at
    `;

    const user = result[0];
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ✅ Login User
// ✅ Login User by phone
export const login = async (req, res) => {
  const { phone: rawPhone, password: rawPass } = req.body;
  const phone = rawPhone.trim();
  const password = rawPass.trim();

  console.log('[LOGIN] Phone:', phone);
  console.log('[LOGIN] Password length:', password.length);

  try {
    const result = await sql`SELECT * FROM users WHERE phone = ${phone}`;
    if (!result.length) {
      console.log('[LOGIN] 🛑 No user found');
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const user = result[0];
    console.log('[LOGIN] Found user phone:', user.phone);

    const match = await bcrypt.compare(password, user.password);
    console.log('[LOGIN] bcrypt.compare result:', match);

    if (!match) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });

    console.log('[LOGIN] ✅ User login successful');
    console.log('[LOGIN] 🔐 Token:', token);

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        gender: user.gender,
        membershipType: 'Free', // default if not in DB
        joinedDate: user.created_at,
      },
    });
  } catch (err) {
    console.error('[LOGIN] 🚨 Server error:', err.message);
    return res.status(500).json({ error: 'Server error' });
  }
};


export async function updateUser(req, res) {
  const { name, email, avatar } = req.body;
  const userId = req.user.id;

  try {
    const updatedUser = await sql`
      UPDATE users
      SET name = ${name}, email = ${email}, avatar = ${avatar},gender=${gender}
      WHERE id = ${userId}
      RETURNING id, name, email, avatar,gender
    `;

    res.json({ user: updatedUser[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update user' });
  }
}
