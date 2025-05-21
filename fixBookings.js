const mongoose = require('mongoose');
const Booking = require('./models/Booking');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/prj')
  .then(() => {
    console.log('Connected to MongoDB successfully!');
    fixBookings();
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

async function fixBookings() {
  try {
    // Find all bookings with invalid status
    const bookings = await Booking.find({
      $or: [
        { bookingStatus: { $exists: false } },
        { bookingStatus: 'Pending' }
      ]
    });

    console.log(`Found ${bookings.length} bookings to fix`);

    // Update each booking to have a valid status
    for (const booking of bookings) {
      booking.bookingStatus = 'Confirmed';
      await booking.save();
      console.log(`Updated booking ${booking._id}`);
    }

    console.log('All bookings have been fixed!');
    process.exit(0);
  } catch (error) {
    console.error('Error fixing bookings:', error);
    process.exit(1);
  }
} 