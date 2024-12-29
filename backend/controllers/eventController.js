const Event = require('../models/Event');
const Message = require('../models/Message');
const io = require('../socket');

// Sample event data for testing
const sampleEvent = {
  title: 'Dinner at Bandra Mall & Arcade',
  description: 'Join us for a fun dinner at Bandra Mall followed by arcade games!',
  type: 'hangout',
  category: 'dinner',
  location: {
    name: 'Bandra Mall',
    coordinates: {
      type: 'Point',
      coordinates: [72.8347, 19.0759] // Example coordinates
    }
  },
  date: '2024-12-30',
  time: '19:00',
  maxAttendees: 20,
  currentAttendees: [],
  creator: 'user_id_here', // Replace with a valid user ID
};

// Get all events with filters
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort('-createdAt');
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEventsByType = async (req, res) => {
  try {
    const { type } = req.params;
    const events = await Event.find({ type }).sort('-createdAt');
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get nearby events
exports.getNearbyEvents = async (req, res) => {
  try {
    const { longitude, latitude, maxDistance = 10000 } = req.query;

    const events = await Event.find({
      'location.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: parseInt(maxDistance),
        },
      },
    })
    .populate('creator', 'name avatar')
    .populate('currentAttendees', 'name avatar');

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new event
exports.createEvent = async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Join event
exports.joinEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (event.isFull()) {
      return res.status(400).json({ message: 'Event is full' });
    }

    await event.addAttendee(req.user._id);

    // Create join message
    const message = await Message.create({
      eventId,
      userId: req.user._id,
      userName: req.user.name,
      type: 'join',
      message: `${req.user.name} joined the event`,
    });

    // Emit join event to all clients in the event room
    io.to(`event_${eventId}`).emit('user_joined', {
      user: req.user,
      message,
    });

    res.json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get event messages
exports.getEventMessages = async (req, res) => {
  try {
    const { eventId } = req.params;
    const messages = await Message.find({ eventId })
      .sort('-createdAt')
      .limit(50);
    res.json(messages.reverse());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Send message to event
exports.sendMessage = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { userId, userName, message } = req.body;
    
    const newMessage = await Message.create({
      eventId,
      userId,
      userName,
      message,
    });

    // Emit message to all clients in the event room
    io.to(`event_${eventId}`).emit('new_message', newMessage);

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Add sample event to the database (for testing purposes)
exports.createSampleEvent = async (req, res) => {
  try {
    const event = await Event.create(sampleEvent);
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
