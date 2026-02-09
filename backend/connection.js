const mongoose = require('mongoose');

// MongoDB connection URL
// This is like the address of your database
// 127.0.0.1 = your computer
// 27017 = MongoDB's door number
// bookmyshow = database name
const mongoURL = 'mongodb://127.0.0.1:27017/bookmyshow';

// Connect to database
mongoose.connect(mongoURL, {
  useNewUrlParser: true,      // Modern way to read the address
  useUnifiedTopology: true    // Modern way to maintain connection
});

// Get the connection object
const db = mongoose.connection;

// If connection fails, show error
db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

// When successfully connected, show success message
db.once('open', () => {
  console.log('✅ Connected to MongoDB successfully!');
});

// Let other files use this connection
module.exports = db;