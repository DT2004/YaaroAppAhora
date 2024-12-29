const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['hangout', 'spontaneous', 'weekend'],
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  location: {
    name: String,
    coordinates: {
      type: { type: String, default: 'Point' },
      coordinates: [Number], // [longitude, latitude]
    },
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  maxAttendees: {
    type: Number,
    required: true,
  },
  currentAttendees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  image: {
    type: String,
    default: null,
  },
  status: {
    type: String,
    enum: ['active', 'full', 'cancelled', 'completed'],
    default: 'active',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for location-based queries
eventSchema.index({ 'location.coordinates': '2dsphere' });

// Virtual for number of attendees
eventSchema.virtual('attendeeCount').get(function() {
  return this.currentAttendees.length;
});

// Virtual for spots left
eventSchema.virtual('spotsLeft').get(function() {
  return this.maxAttendees - this.currentAttendees.length;
});

// Method to check if event is full
eventSchema.methods.isFull = function() {
  return this.currentAttendees.length >= this.maxAttendees;
};

// Method to add attendee
eventSchema.methods.addAttendee = async function(userId) {
  if (this.isFull()) {
    throw new Error('Event is full');
  }
  if (this.currentAttendees.includes(userId)) {
    throw new Error('User already joined');
  }
  this.currentAttendees.push(userId);
  await this.save();
};

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
