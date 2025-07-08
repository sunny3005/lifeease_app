import express from 'express';
import {
  registerPushToken,
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  setupNotificationTable
} from '../controllers/notificationController.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validation.js';
import { apiRateLimit } from '../middleware/rateLimiter.js';
import { z } from 'zod';

const router = express.Router();

// Initialize notification tables
setupNotificationTable()
  .then(() => console.log('✅ Notification tables are ready'))
  .catch(err => console.error('❌ Failed to create notification tables:', err.message));

// Apply rate limiting
router.use(apiRateLimit);

// Register push token (optional auth for anonymous users)
router.post('/register-token',
  optionalAuth,
  validateRequest(z.object({
    body: z.object({
      token: z.string().min(1, 'Push token required'),
      platform: z.enum(['ios', 'android', 'web'])
    })
  })),
  registerPushToken
);

// All other routes require authentication
router.use(authenticateToken);

// Get user notifications
router.get('/', getUserNotifications);

// Mark notification as read
router.put('/:id/read', markNotificationAsRead);

// Mark all notifications as read
router.put('/read-all', markAllNotificationsAsRead);

// Delete notification
router.delete('/:id', deleteNotification);

// Admin route to create notifications (you might want to add admin middleware)
router.post('/create',
  validateRequest(z.object({
    body: z.object({
      title: z.string().min(1, 'Title required'),
      body: z.string().min(1, 'Body required'),
      type: z.string().optional(),
      data: z.object({}).optional(),
      userIds: z.array(z.string().uuid()).optional()
    })
  })),
  createNotification
);

export default router;