const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  unlockedAt: {
    type: Date,
    default: Date.now
  }
});

achievementSchema.index({ user: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Achievement', achievementSchema);