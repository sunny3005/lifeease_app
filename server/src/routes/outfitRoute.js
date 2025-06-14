import express from 'express';
import {
  createOutfit,
  getOutfitsByCategory,
  deleteOutfit,
  setupOutfitTable
} from '../controllers/outfitController.js';

const router = express.Router();

// Ensure table exists
await setupOutfitTable();

router.post('/', createOutfit);
router.get('/:category', getOutfitsByCategory);
router.delete('/:id', deleteOutfit);

export default router;
