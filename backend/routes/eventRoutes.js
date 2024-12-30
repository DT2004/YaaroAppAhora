const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// Event routes
router.get('/', eventController.getEvents);
router.get('/nearby', eventController.getNearbyEvents);
router.post('/', eventController.createEvent);
router.post('/:eventId/join', eventController.joinEvent);
router.get('/:eventId/messages', eventController.getEventMessages);
router.post('/:eventId/messages', eventController.sendMessage);

module.exports = router;