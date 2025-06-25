import express from 'express';
import {
  createOutfit,
  getOutfitsByCategory,
  deleteOutfit,
  setupOutfitTable
} from '../controllers/outfitController.js';

const router = express.Router();

// Ensure table exists
router.use(async (req, res, next) => {
  try {
    await setupOutfitTable();
    next();
  } catch (err) {
    console.error('❌ Failed to ensure Outfit table:', err.message);
    res.status(500).json({ error: 'Database setup failed' });
  }
});


router.post('/', createOutfit);
router.get('/category/:category', getOutfitsByCategory); // ✅ FIXED
router.delete('/delete/:id', deleteOutfit);             // ✅ FIXED

export default router;
