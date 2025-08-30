const express = require('express');
const { 
  getTasks, 
  createTask, 
  updateTask, 
  deleteTask,
  addSubtask,
  toggleSubtask,
  deleteSubtask
} = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const { validateTask } = require('../middleware/validation');

const router = express.Router();

router.route('/')
  .get(protect, getTasks)
  .post(protect, validateTask, createTask);

router.route('/:id')
  .put(protect, updateTask)
  .delete(protect, deleteTask);

router.route('/:id/subtasks')
  .post(protect, addSubtask);

router.route('/:id/subtasks/:subtaskId')
  .put(protect, toggleSubtask)
  .delete(protect, deleteSubtask);

module.exports = router;