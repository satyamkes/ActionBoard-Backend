const Task = require('../models/Task');
const Achievement = require('../models/Achievement');

// Get all tasks with filtering
const getTasks = async (req, res) => {
  try {
    const { filter, search, tags } = req.query;
    let query = { user: req.user._id };
    
    // Apply filters
    if (filter === 'active') {
      query.completed = false;
      query.archived = false;
    } else if (filter === 'completed') {
      query.completed = true;
    } else if (filter === 'starred') {
      query.starred = true;
    } else if (filter === 'archived') {
      query.archived = true;
    } else {
      query.archived = false;
    }
    
    // Apply search
    if (search) {
      query.text = { $regex: search, $options: 'i' };
    }
    
    // Apply tags filter
    if (tags) {
      const tagArray = tags.split(',');
      query.tags = { $in: tagArray };
    }
    
    const tasks = await Task.find(query).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new task
const createTask = async (req, res) => {
  try {
    const task = new Task({
      user: req.user._id,
      ...req.body
    });
    
    const createdTask = await task.save();
    
    // Check for first task achievement
    const taskCount = await Task.countDocuments({ user: req.user._id });
    if (taskCount === 1) {
      await Achievement.create({
        user: req.user._id,
        name: 'first_task',
        description: 'Created your first task'
      });
    }
    
    res.status(201).json(createdTask);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a task
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (task && task.user.toString() === req.user._id.toString()) {
      Object.keys(req.body).forEach(key => {
        task[key] = req.body[key];
      });
      
      const updatedTask = await task.save();
      
      // Check for task completion achievement
      if (req.body.completed) {
        const completedCount = await Task.countDocuments({ 
          user: req.user._id, 
          completed: true 
        });
        
        if (completedCount === 1) {
          await Achievement.create({
            user: req.user._id,
            name: 'task_completed',
            description: 'Completed your first task'
          });
        }
        
        if (completedCount >= 10) {
          const achievementExists = await Achievement.findOne({
            user: req.user._id,
            name: 'productivity_expert'
          });
          
          if (!achievementExists) {
            await Achievement.create({
              user: req.user._id,
              name: 'productivity_expert',
              description: 'Completed 10 tasks'
            });
          }
        }
      }
      
      res.json(updatedTask);
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (task && task.user.toString() === req.user._id.toString()) {
      await Task.deleteOne({ _id: req.params.id });
      res.json({ message: 'Task removed' });
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Add a subtask
const addSubtask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (task && task.user.toString() === req.user._id.toString()) {
      task.subtasks.push(req.body);
      const updatedTask = await task.save();
      res.json(updatedTask);
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Toggle subtask completion
const toggleSubtask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (task && task.user.toString() === req.user._id.toString()) {
      const subtask = task.subtasks.id(req.params.subtaskId);
      if (subtask) {
        subtask.completed = !subtask.completed;
        const updatedTask = await task.save();
        res.json(updatedTask);
      } else {
        res.status(404).json({ message: 'Subtask not found' });
      }
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a subtask
const deleteSubtask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (task && task.user.toString() === req.user._id.toString()) {
      task.subtasks.id(req.params.subtaskId).remove();
      const updatedTask = await task.save();
      res.json(updatedTask);
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  addSubtask,
  toggleSubtask,
  deleteSubtask
};