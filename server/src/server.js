import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import outfitRoute from './routes/outfitRoute.js';
import donateRoute from './routes/donateRoute.js';
import extractRoute from './routes/extractRoute.js';
import authRoute from './routes/authRoute.js';
import aiSuggestRoute from './routes/aiSuggestRoute.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:8081', 'http://localhost:3000', 'http://192.168.1.7:8081'],
  credentials: true
}));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoute);
app.use('/api/outfits', outfitRoute);
app.use('/api/donate', donateRoute);
app.use('/api/extract-image', extractRoute);
app.use('/api/ai', aiSuggestRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 LifeEase Server running at http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});