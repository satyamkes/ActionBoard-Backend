const mongoose = require('mongoose');

const subtaskSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: true,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  timeSpent: {
    type: Number,
    default: 0
  },
  category: {
    type: String,
    default: 'work'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  starred: {
    type: Boolean,
    default: false
  },
  dueDate: {
    type: Date,
    default: null
  },
  notes: {
    type: String,
    default: ''
  },
  archived: {
    type: Boolean,
    default: false
  },
  tags: [String],
  subtasks: [subtaskSchema],
  estimatedTime: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

taskSchema.index({ user: 1, createdAt: -1 });
taskSchema.index({ user: 1, completed: 1 });
taskSchema.index({ user: 1, starred: 1 });

module.exports = mongoose.model('Task', taskSchema);