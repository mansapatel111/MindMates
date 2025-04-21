// This code handles user authentication (register & login) in Express.js using MongoDB, bcrypt, and JWT.
const bcrypt = require('bcryptjs');
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require("dotenv").config(); 

const router = express.Router();

// User registration route
router.post('/register', async (req, res) => { 
    const { username, password, firstName, lastName } = req.body;
    console.log('Received data:', { username, password, firstName, lastName });
    try {
        //Check if user already exists
        let existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        //Hash password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({ username, password: hashedPassword, firstName, lastName });
        await user.save();
        console.log(req.body); //debug statement

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).json({ message: 'User not registered. Operation unsuccessful' });
    }
});


// User login route
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "Invalid credentials (NO USERNAME EXISTS)" });

    console.log("User smilestones:", user.smilestones);

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials (USERNAME FOUND, WRONG PASSWORD" });

    // Generate JWT token using secret from .env
    const token = jwt.sign(
      { userId: user._id, firstName: user.firstName, lastName: user.lastName },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, firstName: user.firstName, lastName: user.lastName, smilestones: user.smilestones || 0}); //this is sending the token to the front end
    } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message});
  }
});

module.exports = router;