// --------------------
// 🌍 Environment Setup
// --------------------
import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import { logger, requestLogger } from './utils/logger.js';

// Load environment variables
dotenv.config();

const app = express();

// --------------------
// 🧠 Middleware Setup
// --------------------
app.use(cors({ origin: '*', credentials: true }));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(requestLogger);

// ----------------------------
// 🔍 Health Check Endpoint
// ----------------------------
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// ---------------------
// 🚏 Import Route Files
// ---------------------
import outfitRoute from './routes/outfitRoute.js';
import donateRoute from './routes/donateRoute.js';
import extractRoute from './routes/extractRoute.js';
import authRoute from './routes/authRoute.js';
import aiSuggestRoute from './routes/aiSuggestRoute.js';
import taskRoute from './routes/taskRoute.js';
import donationRoute from './routes/donationRoute.js';
import userRoute from './routes/userRoute.js';
import notificationRoute from './routes/notificationRoute.js';

// --------------------------
// 🛡️ Route Path Validator
// --------------------------
const originalUse = app.use.bind(app);
app.use = function (path, ...handlers) {
  if (typeof path === 'string' && /^\/:($|\/)/.test(path)) {
    logger.warn('Detected malformed route path', { path });
  }
  return originalUse(path, ...handlers);
};

// --------------------------
// 🛠️ Safe Route Registration
// --------------------------
function safeUseRoute(label, path, route) {
  try {
    logger.info(`Registering ${label} route`, { path });
    app.use(path, route);
    logger.info(`${label} route loaded successfully`, { path });
  } catch (err) {
    logger.error(`Failed to load ${label} route`, { path, error: err.message });
  }
}

// ✅ Apply Routes
safeUseRoute('Auth', '/api/auth', authRoute);
safeUseRoute('User', '/api/user', userRoute);
safeUseRoute('Outfits', '/api/outfits', outfitRoute);
safeUseRoute('Donate (Legacy)', '/api/donate', donateRoute);
safeUseRoute('Donations', '/api/donations', donationRoute);
safeUseRoute('Tasks', '/api/tasks', taskRoute);
safeUseRoute('Notifications', '/api/notifications', notificationRoute);
safeUseRoute('Extract', '/api/extract-image', extractRoute);
safeUseRoute('AI Suggest', '/api/ai', aiSuggestRoute);

// -------------------------------
// ❌ Global Error Handler
// -------------------------------
app.use((err, req, res, next) => {
  logger.error('Server Error', { 
    error: err.message, 
    stack: err.stack,
    url: req.url,
    method: req.method 
  });
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// -----------------------------
// 🚫 404 Route Not Found Catch
// -----------------------------
app.use('*', (req, res) => {
  logger.warn('Route not found', { url: req.url, method: req.method });
  res.status(404).json({ error: 'Route not found' });
});

// --------------------
// 🚀 Start the Server
// --------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info('LifeEase Server started', { 
    port: PORT, 
    environment: process.env.NODE_ENV || 'development',
    healthCheck: `http://localhost:${PORT}/health`
  });
});