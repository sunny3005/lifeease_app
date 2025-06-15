import express from 'express';
import { extractImage } from '../controllers/extractController.js';

const router = express.Router();

router.post('/', extractImage);

export default router;
