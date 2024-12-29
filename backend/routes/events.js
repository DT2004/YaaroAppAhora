const express = require('express'); // Importing Express
const router = express.Router(); // Creating a router instance
const eventController = require('../controllers/eventController'); // Importing event controller

// Define routes for events
router.get('/', eventController.getEvents); // Get all events
router.get('/nearby', eventController.getNearbyEvents); // Get nearby events
router.post('/', eventController.createEvent); // Create a new event
router.post('/:eventId/join', eventController.joinEvent); // Join an event
router.get('/:eventId/messages', eventController.getEventMessages); // Get messages for an event
router.post('/:eventId/messages', eventController.sendMessage); // Send a message to an event

module.exports = router; // Exporting the router
