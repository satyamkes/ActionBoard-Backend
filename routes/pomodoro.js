const express = require('express');
const { 
  getPomodoro, 
  updatePomodoro 
} = require('../controllers/pomodoroController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(protect, getPomodoro)
  .put(protect, updatePomodoro);

module.exports = router;