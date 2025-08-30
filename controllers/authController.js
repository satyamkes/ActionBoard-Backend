const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Register user
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if user exists
    const userExists = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Create user
    const user = await User.create({
      username,
      email,
      password,
      categories: [
        { id: 'work', name: 'Work', color: 'bg-blue-500' },
        { id: 'personal', name: 'Personal', color: 'bg-green-500' },
        { id: 'health', name: 'Health', color: 'bg-red-500' },
        { id: 'learning', name: 'Learning', color: 'bg-purple-500' },
        { id: 'finance', name: 'Finance', color: 'bg-amber-500' },
        { id: 'social', name: 'Social', color: 'bg-pink-500' },
        { id: 'creative', name: 'Creative', color: 'bg-indigo-500' },
        { id: 'other', name: 'Other', color: 'bg-gray-500' }
      ],
      tags: ['urgent', 'important', 'meeting', 'idea', 'follow-up']
    });
    
    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        darkMode: user.darkMode,
        notifications: user.notifications,
        token: generateToken(user._id)
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    
    if (user && (await user.correctPassword(password, user.password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        darkMode: user.darkMode,
        notifications: user.notifications,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (user) {
      user.darkMode = req.body.darkMode ?? user.darkMode;
      user.notifications = req.body.notifications ?? user.notifications;
      user.tags = req.body.tags ?? user.tags;
      
      const updatedUser = await user.save();
      
      res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        darkMode: updatedUser.darkMode,
        notifications: updatedUser.notifications,
        tags: updatedUser.tags
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile
};