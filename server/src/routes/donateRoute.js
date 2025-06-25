import express from 'express';
import {
  getDonatedClothes,
  donateClothes,
  restoreDonatedClothes,
  setupDonatedTable,
} from '../controllers/donateController.js';

const router = express.Router();

// Ensure table exists
(async () => {
  try {
    await setupDonatedTable();
    console.log('✅ Donated table is ready');
  } catch (err) {
    console.error('❌ Failed to setup donated table:', err.message);
  }
})();


router.get('/', getDonatedClothes);
router.post('/', donateClothes);           // <-- This enables POST /api/donate
router.post('/restore', restoreDonatedClothes);

export default router;
