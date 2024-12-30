const User = require('../models/User'); // Importing User model
const bcrypt = require('bcrypt'); // Importing bcrypt for password hashing

// Register a new user
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body; // Destructuring request body
  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Hashing the password
    const newUser = new User({ name, email, password: hashedPassword }); // Creating a new user
    await newUser.save(); // Saving the user to the database
    res.status(201).json({ message: 'User registered successfully', userId: newUser._id }); // Success response
  } catch (error) {
    res.status(400).json({ message: error.message }); // Error response
  }
};

// Login a user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body; // Destructuring request body
  try {
    const user = await User.findOne({ email }); // Finding the user by email
    if (!user) return res.status(404).json({ message: 'User not found' }); // User not found

    const isMatch = await bcrypt.compare(password, user.password); // Comparing passwords
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' }); // Invalid credentials

    res.json({ userId: user._id }); // Sending user ID
  } catch (error) {
    res.status(500).json({ message: error.message }); // Error response
  }
};

// Get user profile by ID
exports.getUserProfile = async (req, res) => {
  const { userId } = req.params; // Getting user ID from params
  try {
    const user = await User.findById(userId).select('-password'); // Finding user and excluding password
    if (!user) return res.status(404).json({ message: 'User not found' }); // User not found
    res.json(user); // Sending user data
  } catch (error) {
    res.status(500).json({ message: error.message }); // Error response
  }
};
