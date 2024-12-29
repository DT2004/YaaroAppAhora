const express = require('express'); // Importing Express
const router = express.Router(); // Creating a router instance
const userController = require('../controllers/userController'); // Importing user controller

// Define routes for users
router.post('/register', userController.registerUser); // Register a new user
router.post('/login', userController.loginUser); // Login a user
router.get('/:userId', userController.getUserProfile); // Get user profile by ID

module.exports = router; // Exporting the router
