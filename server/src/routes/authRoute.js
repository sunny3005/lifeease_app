import express from 'express';
import { register, login, setupUserTable,updateUser } from '../controllers/authController.js';

const router = express.Router();

setupUserTable()
  .then(() => console.log('✅ Users table is ready'))
  .catch(err => console.error('❌ Failed to create users table:', err.message));

router.post('/register', register);
router.post('/login', login);
router.put('/user/update', updateUser);

export default router;
