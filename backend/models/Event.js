const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  userId: String,
  message: String,
  timestamp: String
});

const groupChatSchema = new mongoose.Schema({
  messages: [messageSchema],
  participants: [{ type: String }]
});

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['food', 'sports', 'music', 'social', 'study', 'other']
  },
  location: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        required: true,
        validate: {
          validator: function(v) {
            return v.length === 2 && 
                   v[0] >= -180 && v[0] <= 180 && 
                   v[1] >= -90 && v[1] <= 90;
          },
          message: 'Invalid coordinates'
        }
      }
    }
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
      },
      message: 'Time must be in HH:MM format'
    }
  },
  maxParticipants: {
    type: Number,
    required: true,
    min: 2,
    max: 50
  },
  attendees: [{
    _id: String,
    name: String
  }],
  budget: {
    min: {
      type: Number,
      required: true,
      min: 0
    },
    max: {
      type: Number,
      required: true
    }
  },
  image: {
    type: String,
    required: false
  },
  status: {
    type: String,
    required: true,
    enum: ['open', 'full', 'cancelled', 'completed'],
    default: 'open'
  },
  groupChat: groupChatSchema
}, {
  timestamps: true
});

// Create 2dsphere index for location-based queries
eventSchema.index({ 'location.coordinates': '2dsphere' });

module.exports = mongoose.model('Event', eventSchema);
