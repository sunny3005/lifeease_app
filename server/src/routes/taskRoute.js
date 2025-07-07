import express from 'express';
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  getTaskStats,
  setupTaskTable
} from '../controllers/taskController.js';

const router = express.Router();

// Initialize task table
setupTaskTable()
  .then(() => console.log('✅ Tasks table is ready'))
  .catch(err => console.error('❌ Failed to create tasks table:', err.message));

// Task routes
router.post('/', createTask);
router.get('/', getTasks);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.get('/stats', getTaskStats);

export default router;