const express = require('express');
const cors = require('cors');
const http = require('http');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);

// CORS configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Test endpoint
app.get('/health', (req, res) => {
  console.log('Health check endpoint hit from:', req.ip);
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    clientIP: req.ip 
  });
});

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

const startServer = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/yaaro');
    console.log('MongoDB connected successfully');

    server.listen(PORT, HOST, () => {
      console.log('\nServer is running!');
      console.log(`- Local URL: http://localhost:${PORT}`);
      console.log(`- Network URL: http://192.168.2.200:${PORT}`);
      console.log('\nTest your connection:');
      console.log(`curl http://localhost:${PORT}/health`);
      console.log(`curl http://192.168.2.200:${PORT}/health`);
    });

  } catch (error) {
    console.error('Startup error:', error);
    process.exit(1);
  }
};

startServer();

// Basic error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Something went wrong!' });
});