import express from 'express';
import {
  getDonatedClothes,
  donateClothes,
  restoreDonatedClothes,
  setupDonatedTable,
} from '../controllers/donateController.js';

const router = express.Router();

// Ensure table exists
await setupDonatedTable();

router.get('/', getDonatedClothes);
router.post('/', donateClothes);           // <-- This enables POST /api/donate
router.post('/restore', restoreDonatedClothes);

export default router;
