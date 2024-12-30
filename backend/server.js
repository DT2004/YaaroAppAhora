const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');
const Event = require('./models/Event');
const Chat = require('./models/Chat');
const eventRoutes = require('./routes/events');
const userRoutes = require('./routes/users');

const app = express();
const server = http.createServer(app);

// Configure Socket.IO with all necessary options
const io = socketIO(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true
  },
  transports: ['websocket', 'polling'],
});

// Middleware
app.use(cors());
app.use(express.json());

// Log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  // Handle joining event rooms
  socket.on('joinEventRoom', async (eventId) => {
    try {
      socket.join(`event_${eventId}`);
      console.log(`Client ${socket.id} joined event room: ${eventId}`);
      
      // Notify others in the room
      socket.to(`event_${eventId}`).emit('userJoined', {
        eventId,
        userId: socket.id,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error joining event room:', error);
    }
  });

  // Handle leaving event rooms
  socket.on('leaveEventRoom', (eventId) => {
    socket.leave(`event_${eventId}`);
    console.log(`Client ${socket.id} left event room: ${eventId}`);
  });

  // Handle chat messages
  socket.on('sendMessage', async ({ eventId, message }) => {
    try {
      // Broadcast the message to all clients in the event room
      io.to(`event_${eventId}`).emit('chatMessage', {
        eventId,
        userId: socket.id,
        message,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
});

// Routes
app.use('/api/events', eventRoutes);
app.use('/api/users', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message });
});

// Test endpoint to verify server is running
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Create sample events
const createSampleEvents = async () => {
  try {
    console.log('Creating sample events...');
    
    // Clear existing events
    await Event.deleteMany({});
    await Chat.deleteMany({});
    console.log('Cleared existing events and chats');

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Create sample events
    const events = [
      {
        title: 'Escape Room Adventure',
        description: 'Join us for an exciting escape room adventure! We\'ll be solving puzzles and having fun together.',
        type: 'social',
        location: {
          name: 'Bandra Mall',
          coordinates: {
            type: 'Point',
            coordinates: [72.8347, 19.0759]
          }
        },
        date: tomorrow,
        time: '19:00',
        maxParticipants: 6,
        budget: {
          min: 500,
          max: 800
        },
        image: 'https://images.unsplash.com/photo-1511882150382-421056c89033',
        status: 'open'
      },
      {
        title: 'Asian Fusion Dinner',
        description: 'Let\'s enjoy authentic Asian fusion cuisine together!',
        type: 'food',
        location: {
          name: 'AsianFusion Restaurant, Powai',
          coordinates: {
            type: 'Point',
            coordinates: [72.9088, 19.1176]
          }
        },
        date: tomorrow,
        time: '20:00',
        maxParticipants: 6,
        budget: {
          min: 600,
          max: 1000
        },
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
        status: 'open'
      },
      {
        title: 'Beach Cricket',
        description: 'Let\'s play cricket together! All skill levels welcome.',
        type: 'sports',
        location: {
          name: 'Juhu Beach',
          coordinates: {
            type: 'Point',
            coordinates: [72.8282, 19.0883]
          }
        },
        date: tomorrow,
        time: '16:00',
        maxParticipants: 12,
        budget: {
          min: 0,
          max: 100
        },
        image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da',
        status: 'open'
      }
    ];

    for (const eventData of events) {
      try {
        const event = new Event(eventData);
        const chat = await Chat.create({
          eventId: event._id,
          type: 'event',
          messages: []
        });
        event.groupChat = chat._id;
        await event.save();
        console.log('Created event:', event.title);
      } catch (error) {
        console.error('Error creating event:', eventData.title, error);
      }
    }

    console.log('Sample events created successfully!');
  } catch (error) {
    console.error('Error creating sample events:', error);
  }
};

async function startServer() {
  try {
    // Connect to MongoDB with proper options
    await mongoose.connect('mongodb://localhost:27017/yaaro', {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
    });
    
    console.log('Connected to MongoDB');

    // Create sample data
    await createSampleEvents();

    // Listen on all network interfaces
    const port = process.env.PORT || 3000;
    const host = '0.0.0.0';
    
    server.listen(port, host, () => {
      console.log(`Server is running on http://${host}:${port}`);
      console.log('Available on your network at:');
      require('os').networkInterfaces()['en0']?.forEach(interface => {
        if (interface.family === 'IPv4') {
          console.log(`  http://${interface.address}:${port}`);
        }
      });
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();