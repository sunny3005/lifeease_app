import express from 'express';

const app = express();

function safeUseRoute(label, path, route) {
  try {
    app.use(path, route);
    console.log(`✅ ${label} route loaded at ${path}`);
  } catch (err) {
    console.error(`❌ Failed to load ${label} route at ${path}`);
    console.error(err.message);
  }
}

// Import routes individually
import outfitRoute from './routes/outfitRoute.js';
import donateRoute from './routes/donateRoute.js';
import extractRoute from './routes/extractRoute.js';
import authRoute from './routes/authRoute.js';
import aiSuggestRoute from './routes/aiSuggestRoute.js';

// Try loading each route
safeUseRoute('Auth', '/api/auth', authRoute);
safeUseRoute('Outfits', '/api/outfits', outfitRoute);
safeUseRoute('Donate', '/api/donate', donateRoute);
safeUseRoute('Extract', '/api/extract-image', extractRoute);
safeUseRoute('AI Suggest', '/api/ai', aiSuggestRoute);
