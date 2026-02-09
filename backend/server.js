const express = require('express');
const cors = require('cors');
const Booking = require('./Schema');
require('./connection'); // This connects to MongoDB

// Create the server app
const app = express();
const PORT = 8080;

// Middleware (helpers that process every request)
app.use(cors());           // Allows frontend to talk to backend
app.use(express.json());   // Understands JSON data in requests

// ========================================
// ENDPOINT 1: POST /api/booking
// Purpose: Save a new booking to database
// ========================================
app.post('/api/booking', async (req, res) => {
  try {
    // Get data from the request
    const { movie, seats, slot } = req.body;
    
    // VALIDATION: Check if movie and slot are provided
    if (!movie || !slot) {
      return res.status(400).json({ 
        error: 'Movie and slot are required!' 
      });
    }
    
    // VALIDATION: Check if at least one seat is booked
    // This adds up all seat numbers: A1 + A2 + A3 + A4 + D1 + D2
    const totalSeats = Object.values(seats).reduce((sum, count) => sum + count, 0);
    if (totalSeats === 0) {
      return res.status(400).json({ 
        error: 'Please book at least one seat!' 
      });
    }
    
    // Create a new booking object
    const newBooking = new Booking({
      movie,
      slot,
      seats
    });
    
    // Save it to the database
    await newBooking.save();
    
    // Send success response
    res.status(200).json({ 
      message: 'Booking successful!',
      booking: newBooking
    });
    
  } catch (error) {
    console.error('Error saving booking:', error);
    res.status(500).json({ 
      error: 'Failed to save booking' 
    });
  }
});

// ========================================
// ENDPOINT 2: GET /api/booking
// Purpose: Get the most recent booking
// ========================================
app.get('/api/booking', async (req, res) => {
  try {
    // Find the most recent booking
    // sort({ _id: -1 }) = sort by newest first
    // limit(1) = get only 1 result
    const lastBooking = await Booking.findOne().sort({ _id: -1 }).limit(1);
    
    // If no booking exists
    if (!lastBooking) {
      return res.status(200).json({ 
        message: 'No previous booking found' 
      });
    }
    
    // Send the last booking data
    res.status(200).json({
      movie: lastBooking.movie,
      slot: lastBooking.slot,
      seats: lastBooking.seats
    });
    
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ 
      error: 'Failed to fetch booking' 
    });
  }
});

// Handle invalid URLs (any other endpoint)
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found' 
  });
});

// Start the server on port 8080
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
});