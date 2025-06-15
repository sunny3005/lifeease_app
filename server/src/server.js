import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import outfitRoute from './routes/outfitRoute.js';
import donateRoute from './routes/donateRoute.js';
import extractRoute from './routes/extractRoute.js';
import authRoute from './routes/authRoute.js'

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/outfits', outfitRoute);
// app.use('/api/donated-clothes', donateRoute);
app.use('/api/extract-image', extractRoute);
app.use('/api/donate', donateRoute); 
app.use('/api/auth', authRoute);

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
