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
  date: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: '',
  },
  ticketPrice: {
    type: Number,
    required: true,
  },
  totalTickets: {
    type: Number,
    required: true,
  },
  remainingTickets: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Approved', 'Pending', 'Declined'],
    default: 'Pending',
  },
  organizerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model (Organizer)
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;