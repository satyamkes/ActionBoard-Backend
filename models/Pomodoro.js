const mongoose = require('mongoose');

const pomodoroSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  active: {
    type: Boolean,
    default: false
  },
  time: {
    type: Number,
    default: 1500
  },
  type: {
    type: String,
    enum: ['work', 'break'],
    default: 'work'
  },
  completed: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Pomodoro', pomodoroSchema);