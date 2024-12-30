const Event = require('../models/Event');

// Get all events
exports.getEvents = async (req, res) => {
  try {
    const { type, status = 'open', id } = req.query;
    let query = {};
    
    if (id) {
      query._id = id;
    } else {
      if (status) query.status = status;
      if (type) query.type = type;
    }

    const events = await Event.find(query)
      .select('-__v')
      .populate('attendees', 'name')
      .sort('-date')
      .lean();

    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};

// Get nearby events
exports.getNearbyEvents = async (req, res) => {
  try {
    const { longitude, latitude, maxDistance = 10000 } = req.query;

    if (!longitude || !latitude) {
      return res.status(400).json({ error: 'Location coordinates are required' });
    }

    const events = await Event.find({
      status: 'open',
      'location.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      }
    })
    .select('-__v')
    .populate('attendees', 'name')
    .lean();

    res.json(events);
  } catch (error) {
    console.error('Error fetching nearby events:', error);
    res.status(500).json({ error: 'Failed to fetch nearby events' });
  }
};

// Create a new event
exports.createEvent = async (req, res) => {
  try {
    const eventData = req.body;
    const event = new Event(eventData);
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
};

// Join an event
exports.joinEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    // For testing, use a mock user ID since we don't have auth yet
    const userId = "user123";

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (event.status !== 'open') {
      return res.status(400).json({ error: 'Event is not open for joining' });
    }

    if (event.attendees.length >= event.maxParticipants) {
      event.status = 'full';
      await event.save();
      return res.status(400).json({ error: 'Event is full' });
    }

    // Check if user already joined
    const alreadyJoined = event.attendees.some(
      attendee => attendee._id.toString() === userId || attendee._id === userId
    );
    
    if (alreadyJoined) {
      return res.status(400).json({ error: 'Already joined this event' });
    }

    // Add user to attendees
    event.attendees.push({ _id: userId, name: 'Test User' });
    
    // Check if event is now full
    if (event.attendees.length === event.maxParticipants) {
      event.status = 'full';
    }

    await event.save();
    res.json(event);
  } catch (error) {
    console.error('Error joining event:', error);
    res.status(500).json({ error: 'Failed to join event' });
  }
};

// Get event messages
exports.getEventMessages = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId).populate('groupChat.messages');
    
    if (!event || !event.groupChat) {
      return res.status(404).json({ error: 'Chat not found' });
    }
    
    res.json(event.groupChat.messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

// Send message to event
exports.sendMessage = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { message } = req.body;
    // For testing, use a mock user ID since we don't have auth yet
    const userId = "user123";

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (!event.groupChat) {
      event.groupChat = {
        messages: [],
        participants: []
      };
    }

    const newMessage = {
      userId,
      message,
      timestamp: new Date().toISOString()
    };

    event.groupChat.messages.push(newMessage);
    await event.save();

    res.json(newMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
};

// Create sample events for testing
exports.createSampleEvents = async () => {
  const sampleEvents = [
    {
      title: 'Weekend Movie Night',
      description: 'Join us for a fun movie night!',
      type: 'movie',
      location: {
        name: 'PVR Cinemas, Juhu',
        coordinates: { type: 'Point', coordinates: [72.8277, 19.0760] }
      },
      date: new Date(Date.now() + 86400000), // Tomorrow
      time: '18:30',
      maxParticipants: 4
    },
    {
      title: 'Cricket at Oval Maidan',
      description: 'Sunday morning cricket session',
      type: 'sports',
      location: {
        name: 'Oval Maidan, Mumbai',
        coordinates: { type: 'Point', coordinates: [72.8259, 18.9321] }
      },
      date: new Date(Date.now() + 172800000), // Day after tomorrow
      time: '07:00',
      maxParticipants: 6
    }
  ];

  try {
    await Event.deleteMany({}); // Clear existing events
    await Event.insertMany(sampleEvents);
    console.log('Sample events created successfully');
  } catch (error) {
    console.error('Error creating sample events:', error);
  }
};
