import express from 'express';
import { 
  suggestOutfit, 
  getPersonalizedRecommendations,
  setupAISuggestionsTable 
} from '../controllers/aiSuggestController.js';
import { verifyToken } from '../controllers/authController.js';

const router = express.Router();

// Initialize AI suggestions table
setupAISuggestionsTable()
  .then(() => console.log('✅ AI suggestions table is ready'))
  .catch(err => console.error('❌ Failed to create AI suggestions table:', err.message));

// AI suggestion routes
router.get('/suggest-outfit', suggestOutfit);
router.get('/personalized', verifyToken, getPersonalizedRecommendations);

export default router;