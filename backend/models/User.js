const mongoose = require('mongoose'); // Importing Mongoose

// Defining the user schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Name is required
  },
  email: {
    type: String,
    required: true, // Email is required
    unique: true, // Email must be unique
  },
  password: {
    type: String,
    required: true, // Password is required
  },
  avatar: {
    type: String,
    default: null, // Default avatar is null
  },
  createdAt: {
    type: Date,
    default: Date.now, // Default createdAt is current date
  },
});

// Creating User model
const User = mongoose.model('User', userSchema);
module.exports = User; // Exporting User model
