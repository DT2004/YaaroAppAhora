const Message = require('../models/Message'); // Importing Message model

// Get messages for an event
exports.getMessages = async (req, res) => {
  const { eventId } = req.params; // Getting event ID from params
  try {
    const messages = await Message.find({ eventId }); // Finding messages for the event
    res.json(messages); // Sending messages
  } catch (error) {
    res.status(500).json({ message: error.message }); // Error response
  }
};

// Send a message to an event
exports.sendMessage = async (req, res) => {
  const { eventId } = req.params; // Getting event ID from params
  const { userId, userName, message } = req.body; // Destructuring request body
  try {
    const newMessage = new Message({ eventId, userId, userName, message }); // Creating a new message
    await newMessage.save(); // Saving the message to the database
    res.status(201).json(newMessage); // Success response
  } catch (error) {
    res.status(400).json({ message: error.message }); // Error response
  }
};
