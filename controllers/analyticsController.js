const Task = require('../models/Task');
const Achievement = require('../models/Achievement');

// Get analytics data
const getAnalytics = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id });
    const achievements = await Achievement.find({ user: req.user._id });
    
    const completedCount = tasks.filter(task => task.completed).length;
    const totalCount = tasks.filter(task => !task.archived).length;
    const totalTimeSpent = tasks.reduce((acc, task) => acc + (task.timeSpent || 0), 0);
    const starredCount = tasks.filter(task => task.starred && !task.archived).length;
    
    // Calculate productivity score
    const completedTasks = tasks.filter(task => task.completed && !task.archived).length;
    const starCount = tasks.filter(task => task.starred && !task.archived).length;
    
    const productivityScore = Math.round(
      (completedTasks / Math.max(1, totalCount)) * 50 +
      (Math.min(totalTimeSpent, 36000) / 36000) * 25 +
      (starCount / Math.max(1, totalCount)) * 25
    );
    
    // Category distribution
    const categoryDistribution = {};
    tasks.forEach(task => {
      if (!task.archived) {
        categoryDistribution[task.category] = (categoryDistribution[task.category] || 0) + 1;
      }
    });
    
    // Priority distribution
    const priorityDistribution = {};
    tasks.forEach(task => {
      if (!task.archived) {
        priorityDistribution[task.priority] = (priorityDistribution[task.priority] || 0) + 1;
      }
    });
    
    res.json({
      completedCount,
      totalCount,
      totalTimeSpent,
      starredCount,
      productivityScore,
      categoryDistribution,
      priorityDistribution,
      achievements
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAnalytics
};