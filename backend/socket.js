const http = require('http'); // Importing HTTP module
const socketIO = require('socket.io'); // Importing Socket.IO

let io; // Declare io variable

// Function to initialize Socket.IO
const initSocket = (server) => {
  io = socketIO(server, {
    cors: {
      origin: "*", // Allow all origins for CORS
      methods: ["GET", "POST"] // Allow GET and POST methods
    }
  });
};

// Function to get the Socket.IO instance
const getSocket = () => {
  if (!io) {
    throw new Error("Socket not initialized!"); // Error if socket not initialized
  }
  return io; // Return the Socket.IO instance
};

module.exports = { initSocket, getSocket }; // Export the functions
