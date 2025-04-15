// routes/chatbot.js
const express = require('express');
const router = express.Router();
const User = require('../models/User.js');
const auth = require('../../middleware/authenticateToken.js'); // Import your authentication middleware


// Apply authentication middleware to all routes
router.use(auth);

// Get user responses and streak information
router.get('/getResponses', async (req, res) => {
  try {
    // Get user ID from authenticated request
    const userId = req.userId;
    
    // Find user data
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Return empty responses array and streak info
    return res.json({ 
      responses: [], 
      streak: user.streakData ? user.streakData.streak : 0 
    });
  } catch (error) {
    console.error('Error fetching responses:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Save completion and update streak
router.post('/saveResponses', async (req, res) => {
  try {
    // Get user ID from authenticated request
    const userId = req.userId;
    
    // Get current date (reset time to midnight for comparison)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Initialize streak data if it doesn't exist
    if (!user.streakData) {
      user.streakData = {
        streak: 0,
        lastCompletionDate: null
      };
    }
    
    // Get last completion date
    let lastCompletionDate = user.streakData.lastCompletionDate ? 
      new Date(user.streakData.lastCompletionDate) : null;
    
    if (lastCompletionDate) {
      lastCompletionDate.setHours(0, 0, 0, 0);
    }
    
    // Check if this is their first completion or if they already completed today
    if (!lastCompletionDate || lastCompletionDate.getTime() !== today.getTime()) {
      // Check if they completed yesterday (to continue streak)
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastCompletionDate && lastCompletionDate.getTime() === yesterday.getTime()) {
        // They completed yesterday, increment streak
        user.streakData.streak += 1;
      } else if (!lastCompletionDate || lastCompletionDate.getTime() < yesterday.getTime()) {
        // They missed a day (or it's their first time), reset streak to 1
        user.streakData.streak = 1;
      }
      
      // Update last completion date to today
      user.streakData.lastCompletionDate = today;
      
      // Save user with updated streak data
      await user.save();
    }
    
    // Return the current streak
    console.log('Updated streak for user:', userId, 'Streak:', user.streakData.streak);
    return res.json({ streak: user.streakData.streak });
  } catch (error) {
    console.error('Error saving responses:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
