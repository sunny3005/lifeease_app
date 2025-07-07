// --------------------
// 🌍 Environment Setup
// --------------------
import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';

// Load environment variables
dotenv.config();

const app = express();

// --------------------
// 🧠 Middleware Setup
// --------------------
app.use(cors({ origin: '*', credentials: true }));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

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

// --------------------------
// 🛡️ Route Path Validator
// --------------------------
const originalUse = app.use.bind(app);
app.use = function (path, ...handlers) {
  if (typeof path === 'string' && /^\/:($|\/)/.test(path)) {
    console.warn('⚠️ Detected malformed route path:', path);
  }
  return originalUse(path, ...handlers);
};

// --------------------------
// 🛠️ Safe Route Registration
// --------------------------
function safeUseRoute(label, path, route) {
  try {
    console.log(`🔍 Registering ${label} at path: "${path}"`);
    app.use(path, route);
    console.log(`✅ ${label} route loaded at ${path}`);
  } catch (err) {
    console.error(`❌ Failed to load ${label} route at ${path}`);
    console.error(err.stack);
  }
}

// ✅ Apply Routes
safeUseRoute('Auth', '/api/auth', authRoute);
safeUseRoute('Outfits', '/api/outfits', outfitRoute);
safeUseRoute('Donate (Legacy)', '/api/donate', donateRoute);
safeUseRoute('Donations', '/api/donations', donationRoute);
safeUseRoute('Tasks', '/api/tasks', taskRoute);
safeUseRoute('Extract', '/api/extract-image', extractRoute);
safeUseRoute('AI Suggest', '/api/ai', aiSuggestRoute);

// -------------------------------
// ❌ Global Error Handler
// -------------------------------
app.use((err, req, res, next) => {
  console.error('🔥 Server Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// -----------------------------
// 🚫 404 Route Not Found Catch
// -----------------------------
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// --------------------
// 🚀 Start the Server
// --------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 LifeEase Server running at http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});