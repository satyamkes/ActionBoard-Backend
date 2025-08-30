const Pomodoro = require('../models/Pomodoro');
const Achievement = require('../models/Achievement');

// Get pomodoro settings
const getPomodoro = async (req, res) => {
  try {
    let pomodoro = await Pomodoro.findOne({ user: req.user._id });
    
    if (!pomodoro) {
      pomodoro = await Pomodoro.create({ user: req.user._id });
    }
    
    res.json(pomodoro);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update pomodoro settings
const updatePomodoro = async (req, res) => {
  try {
    let pomodoro = await Pomodoro.findOne({ user: req.user._id });
    
    if (!pomodoro) {
      pomodoro = await Pomodoro.create({ 
        user: req.user._id,
        ...req.body
      });
    } else {
      Object.keys(req.body).forEach(key => {
        pomodoro[key] = req.body[key];
      });
      
      pomodoro = await pomodoro.save();
    }
    
    // Check for pomodoro achievement
    if (req.body.completed && req.body.completed > 0) {
      const achievementExists = await Achievement.findOne({
        user: req.user._id,
        name: 'pomodoro_master'
      });
      
      if (!achievementExists) {
        await Achievement.create({
          user: req.user._id,
          name: 'pomodoro_master',
          description: 'Completed a pomodoro session'
        });
      }
    }
    
    res.json(pomodoro);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getPomodoro,
  updatePomodoro
};