import Order from '../models/Order.js';
import { v4 as uuidv4 } from 'uuid';

// Create a new order
export const createOrder = async (req, res) => {
  try {
    const { items, total, deliveryFee = 0, customerInfo } = req.body;

    // Validation
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Items array is required and cannot be empty'
      });
    }

    if (!total || total <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Total amount must be greater than 0'
      });
    }

    // Validate each item
    for (const item of items) {
      if (!item.id || !item.name || !item.price || !item.quantity) {
        return res.status(400).json({
          success: false,
          error: 'Each item must have id, name, price, and quantity'
        });
      }
    }

    // Generate unique order ID
    const orderId = `ORD${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    // Calculate final total
    const finalTotal = total + deliveryFee;

    // Create order
    const order = new Order({
      orderId,
      items,
      total,
      deliveryFee,
      finalTotal,
      customerInfo: customerInfo || {},
      estimatedDeliveryTime: 10
    });

    await order.save();

    console.log('[ORDER] Created new order:', orderId);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order: {
        orderId: order.orderId,
        items: order.items,
        total: order.total,
        deliveryFee: order.deliveryFee,
        finalTotal: order.finalTotal,
        status: order.status,
        estimatedDeliveryTime: order.estimatedDeliveryTime,
        createdAt: order.createdAt
      }
    });

  } catch (error) {
    console.error('[ORDER] Create error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: 'Order ID already exists. Please try again.'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to create order. Please try again.'
    });
  }
};

// Get all orders (order history)
export const getOrders = async (req, res) => {
  try {
    const { limit = 50, page = 1, status } = req.query;
    
    const query = {};
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .lean();

    const totalOrders = await Order.countDocuments(query);

    console.log('[ORDER] Fetched orders:', orders.length);

    res.json({
      success: true,
      orders: orders.map(order => ({
        orderId: order.orderId,
        items: order.items,
        total: order.total,
        deliveryFee: order.deliveryFee,
        finalTotal: order.finalTotal,
        status: order.status,
        estimatedDeliveryTime: order.estimatedDeliveryTime,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      })),
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalOrders / parseInt(limit)),
        totalOrders,
        hasNext: parseInt(page) < Math.ceil(totalOrders / parseInt(limit)),
        hasPrev: parseInt(page) > 1
      }
    });

  } catch (error) {
    console.error('[ORDER] Fetch error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch orders'
    });
  }
};

// Get single order by ID
export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({ orderId }).lean();

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    res.json({
      success: true,
      order: {
        orderId: order.orderId,
        items: order.items,
        total: order.total,
        deliveryFee: order.deliveryFee,
        finalTotal: order.finalTotal,
        status: order.status,
        customerInfo: order.customerInfo,
        estimatedDeliveryTime: order.estimatedDeliveryTime,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      }
    });

  } catch (error) {
    console.error('[ORDER] Get by ID error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch order'
    });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
    
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status. Valid statuses: ' + validStatuses.join(', ')
      });
    }

    const order = await Order.findOneAndUpdate(
      { orderId },
      { status },
      { new: true }
    ).lean();

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    console.log('[ORDER] Updated status:', orderId, 'to', status);

    res.json({
      success: true,
      message: 'Order status updated successfully',
      order: {
        orderId: order.orderId,
        status: order.status,
        updatedAt: order.updatedAt
      }
    });

  } catch (error) {
    console.error('[ORDER] Update status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update order status'
    });
  }
};

// Get order statistics
export const getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const todayOrders = await Order.countDocuments({
      createdAt: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0))
      }
    });

    const statusStats = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const revenueStats = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$finalTotal' },
          averageOrderValue: { $avg: '$finalTotal' }
        }
      }
    ]);

    res.json({
      success: true,
      stats: {
        totalOrders,
        todayOrders,
        statusBreakdown: statusStats.reduce((acc, stat) => {
          acc[stat._id] = stat.count;
          return acc;
        }, {}),
        revenue: {
          total: revenueStats[0]?.totalRevenue || 0,
          averageOrderValue: revenueStats[0]?.averageOrderValue || 0
        }
      }
    });

  } catch (error) {
    console.error('[ORDER] Stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch order statistics'
    });
  }
};