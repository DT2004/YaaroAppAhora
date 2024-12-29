const express = require('express'); // Importing Express
const router = express.Router(); // Creating a router instance
const messageController = require('../controllers/messageController'); // Importing message controller

// Define routes for messages
router.get('/:eventId', messageController.getMessages); // Get messages for an event
router.post('/:eventId', messageController.sendMessage); // Send a message to an event

module.exports = router; // Exporting the router
