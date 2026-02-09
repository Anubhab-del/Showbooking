const mongoose = require('mongoose');

// Define the structure of a booking
// Think of this as a form template that must be filled
const bookingSchema = new mongoose.Schema({
  movie: {
    type: String,        // Movie name is text
    required: true       // You MUST fill this!
  },
  slot: {
    type: String,        // Time is text like "10:00 AM"
    required: true       // You MUST fill this too!
  },
  seats: {
    // Each seat type can have a number (how many seats)
    A1: { type: Number, default: 0 },
    A2: { type: Number, default: 0 },
    A3: { type: Number, default: 0 },
    A4: { type: Number, default: 0 },
    D1: { type: Number, default: 0 },
    D2: { type: Number, default: 0 }
  }
}, {
  timestamps: true  // Automatically add date/time when created
});

// Create a model (factory for making bookings)
const Booking = mongoose.model('Booking', bookingSchema);

// Let other files use this
module.exports = Booking;