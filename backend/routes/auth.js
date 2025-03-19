// This code handles user authentication (register & login) in Express.js using MongoDB, bcrypt, and JWT.
const bcrypt = require('bcryptjs');
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require("dotenv").config(); 

const router = express.Router();

// User registration route
router.post('/register', async (req, res) => { 
    const { username, password } = req.body;
    try {
        //Check if user already exists
        let existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        //Hash password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({ username, password: hashedPassword });
        await user.save();

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

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials (USERNAME FOUND, WRONG PASSWORD" });

    // Generate JWT token using secret from .env
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message});
  }
});

module.exports = router;