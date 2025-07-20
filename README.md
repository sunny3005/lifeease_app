# LifeEase - Full-Stack Grocery Delivery App

A complete React Native + TypeScript grocery delivery application with Node.js + Express + MongoDB backend.

## 🚀 Features

### Frontend (React Native + TypeScript)
- **Grocery Shop Tab**: Browse product categories (Dairy, Fruits & Vegetables, Groceries)
- **Order History Tab**: View all past orders with detailed information
- **Shopping Cart**: Add/remove items, manage quantities
- **Order Placement**: Complete checkout flow with backend integration
- **Real-time Updates**: Automatic cart synchronization and order status tracking

### Backend (Node.js + Express + MongoDB)
- **Order Management**: Create, read, update order status
- **MongoDB Integration**: Persistent data storage with Mongoose ODM
- **RESTful API**: Clean API endpoints for order operations
- **Order Statistics**: Analytics and reporting capabilities
- **Error Handling**: Comprehensive error handling and logging

## 📱 App Structure

### Main Screens
1. **Grocery Delivery** (`/grocery-delivery`)
   - Top tab navigation with two tabs:
     - 🛍️ **Grocery Shop**: Product categories and shopping
     - 📜 **Order History**: Past orders and order tracking

2. **Category Screen** (`/category-screen`)
   - Product listings by category
   - Add to cart functionality
   - Price display with discounts

3. **Cart Screen** (`/cart`)
   - Cart items management
   - Order total calculation
   - Place order functionality

4. **Order Success** (`/order-success`)
   - Order confirmation
   - Order ID display
   - Navigation back to shopping

## 🛠️ Tech Stack

### Frontend
- **React Native** with Expo
- **TypeScript** for type safety
- **React Navigation** (Material Top Tabs)
- **Context API** for state management
- **Lucide React Native** for icons
- **React Native Reanimated** for animations

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **UUID** for unique order ID generation
- **CORS** for cross-origin requests
- **Custom logging** system

## 🗄️ Database Schema

### Order Model
```javascript
{
  orderId: String,        // Unique order identifier
  items: [
    {
      id: String,         // Product ID
      name: String,       // Product name
      price: Number,      // Product price
      quantity: Number,   // Quantity ordered
      image: String,      // Product image URL
      category: String    // Product category
    }
  ],
  total: Number,          // Subtotal amount
  deliveryFee: Number,    // Delivery charges
  finalTotal: Number,     // Total including delivery
  status: String,         // Order status (pending, confirmed, etc.)
  customerInfo: {
    name: String,
    phone: String,
    address: String
  },
  estimatedDeliveryTime: Number,  // In minutes
  createdAt: Date,        // Order creation timestamp
  updatedAt: Date         // Last update timestamp
}
```

## 🔌 API Endpoints

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get all orders (with pagination)
- `GET /api/orders/:orderId` - Get specific order
- `PUT /api/orders/:orderId/status` - Update order status
- `GET /api/orders/stats` - Get order statistics

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- Expo CLI
- React Native development environment

### Backend Setup
1. Navigate to server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/lifeease_grocery
   JWT_SECRET=your_jwt_secret_key
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to mobile directory:
   ```bash
   cd mobile
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Expo development server:
   ```bash
   npx expo start
   ```

## 📊 Order Flow

1. **Browse Products**: User browses categories and products
2. **Add to Cart**: Products are added to local cart state
3. **Review Cart**: User reviews items and quantities
4. **Place Order**: 
   - Generate unique order ID
   - Send POST request to `/api/orders`
   - Store order in MongoDB
5. **Order Confirmation**: Display success message and order ID
6. **Order History**: Orders appear in history tab with real-time status

## 🎨 UI/UX Features

- **Material Design**: Clean, modern interface
- **Dark/Light Theme**: Automatic theme switching
- **Smooth Animations**: React Native Reanimated for fluid transitions
- **Loading States**: Proper loading indicators and error handling
- **Responsive Design**: Optimized for different screen sizes
- **Accessibility**: Screen reader support and proper contrast ratios

## 🔧 Configuration

### Backend Configuration
- **Database**: Configure MongoDB connection in `server/src/config/database.js`
- **Environment**: Set environment variables in `.env` file
- **Logging**: Custom logging system in `server/src/utils/logger.js`

### Frontend Configuration
- **API Endpoints**: Update `BACKEND_URL` in components to match your server
- **Theme**: Customize colors in `mobile/context/ThemeContext.tsx`
- **Cart**: Cart state managed in `mobile/context/CartContext.tsx`

## 📱 Screenshots & Demo

The app includes:
- Intuitive category browsing
- Smooth cart management
- Real-time order tracking
- Comprehensive order history
- Professional UI/UX design

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation
- Review the code comments
- Open an issue on GitHub

---

Built with ❤️ using React Native, TypeScript, Node.js, and MongoDB.