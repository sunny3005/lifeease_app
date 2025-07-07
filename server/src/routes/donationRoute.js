import express from 'express';
import {
  createDonation,
  getDonations,
  softDeleteDonation,
  restoreDonation,
  permanentDeleteDonation,
  updateDonation,
  getDonationStats,
  setupDonationTable
} from '../controllers/donationController.js';

const router = express.Router();

// Initialize donation table
setupDonationTable()
  .then(() => console.log('✅ Donations table is ready'))
  .catch(err => console.error('❌ Failed to create donations table:', err.message));

// Donation routes
router.post('/', createDonation);
router.get('/', getDonations);
router.put('/:id', updateDonation);
router.put('/:id/soft-delete', softDeleteDonation);
router.put('/:id/restore', restoreDonation);
router.delete('/:id', permanentDeleteDonation);
router.get('/stats', getDonationStats);

export default router;