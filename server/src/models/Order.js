import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  image: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  }
});

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  items: [orderItemSchema],
  total: {
    type: Number,
    required: true,
    min: 0
  },
  deliveryFee: {
    type: Number,
    default: 0
  },
  finalTotal: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'pending'
  },
  customerInfo: {
    name: String,
    phone: String,
    address: String
  },
  estimatedDeliveryTime: {
    type: Number,
    default: 10 // minutes
  }
}, {
  timestamps: true
});

// Add index for faster queries
orderSchema.index({ createdAt: -1 });
orderSchema.index({ orderId: 1 });

export default mongoose.model('Order', orderSchema);