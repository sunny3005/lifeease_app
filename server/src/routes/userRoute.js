import express from 'express';
import {
  getUserDashboard,
  changePassword,
  deleteAccount,
  getUserActivity,
  setupUserActivityTable
} from '../controllers/userController.js';
import { authenticateToken } from '../middleware/auth.js';
import { validateRequest, schemas } from '../middleware/validation.js';
import { apiRateLimit } from '../middleware/rateLimiter.js';
import { z } from 'zod';

const router = express.Router();

// Initialize user activity table
setupUserActivityTable()
  .then(() => console.log('✅ User activity table is ready'))
  .catch(err => console.error('❌ Failed to create user activity table:', err.message));

// Apply rate limiting to all user routes
router.use(apiRateLimit);

// All routes require authentication
router.use(authenticateToken);

// User dashboard with stats
router.get('/dashboard', getUserDashboard);

// Change password
router.put('/change-password', 
  validateRequest(z.object({
    body: z.object({
      currentPassword: z.string().min(1, 'Current password required'),
      newPassword: z.string().min(6, 'New password must be at least 6 characters')
    })
  })),
  changePassword
);

// Delete account
router.delete('/account',
  validateRequest(z.object({
    body: z.object({
      password: z.string().min(1, 'Password confirmation required')
    })
  })),
  deleteAccount
);

// Get user activity log
router.get('/activity', getUserActivity);

export default router;