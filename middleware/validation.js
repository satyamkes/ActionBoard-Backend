const validateTask = (req, res, next) => {
  const { text, category, priority } = req.body;
  
  if (!text || text.trim() === '') {
    return res.status(400).json({ message: 'Task text is required' });
  }
  
  const validCategories = ['work', 'personal', 'health', 'learning', 'finance', 'social', 'creative', 'other'];
  if (category && !validCategories.includes(category)) {
    return res.status(400).json({ message: 'Invalid category' });
  }
  
  const validPriorities = ['low', 'medium', 'high', 'critical'];
  if (priority && !validPriorities.includes(priority)) {
    return res.status(400).json({ message: 'Invalid priority' });
  }
  
  next();
};

const validateUser = (req, res, next) => {
  const { username, email, password } = req.body;
  
  if (!username || username.trim() === '') {
    return res.status(400).json({ message: 'Username is required' });
  }
  
  if (!email || email.trim() === '') {
    return res.status(400).json({ message: 'Email is required' });
  }
  
  if (!password || password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }
  
  next();
};

module.exports = { validateTask, validateUser };