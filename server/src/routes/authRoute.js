import express from 'express';
import { 
  register, 
  login, 
  setupUserTable, 
  updateUser, 
  getUserProfile,
  verifyToken 
} from '../controllers/authController.js';

const router = express.Router();

// Initialize user table
setupUserTable()
  .then(() => console.log('✅ Users table is ready'))
  .catch(err => console.error('❌ Failed to create users table:', err.message));

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes (require authentication)
router.get('/profile', verifyToken, getUserProfile);
router.put('/profile', verifyToken, updateUser);

// Legacy route for backward compatibility
router.put('/user/update', verifyToken, updateUser);

export default router;