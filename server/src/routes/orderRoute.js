import express from 'express';
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  getOrderStats
} from '../controllers/orderController.js';

const router = express.Router();

// Order routes
router.post('/', createOrder);
router.get('/', getOrders);
router.get('/stats', getOrderStats);
router.get('/:orderId', getOrderById);
router.put('/:orderId/status', updateOrderStatus);

export default router;