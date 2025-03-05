const mongoose = require('mongoose');

// Define the Booking schema
const bookingSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true, 
    },
    eventId: {
        type: String,
        required: true, 
    },
    numberOfTickets: {
        type: Number,
        required: true,
        min: 1, 
    },
    totalPrice: {
        type: Number,
        required: true, 
        min: 0,
    },
    bookingStatus: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Canceled'], 
        default: 'Pending', 
    },
    createdAt: {
        type: Date,
        default: Date.now, 
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});


const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;