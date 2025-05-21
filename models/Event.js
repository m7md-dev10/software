const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true, 
        minlength: 1, 
        maxlength: 200, 
    },
    description: {
        type: String,
        required: true, 
        minlength: 1, 
        maxlength: 1000, 
    },
    date: {
        type: Date,
        required: true, 
    },
    location: {
        type: String,
        required: true, 
        minlength: 1,
        maxlength: 200, 
    },
    category: {
        type: String,
        required: true, 
        enum: ['Concert', 'Conference', 'Workshop', 'Sports', 'Music', 'Other'],
    },
    image: {
        type: String,
        default: 'default_event_image_url', 
    },
    ticketPrice: {
        type: Number,
        required: true,
        min: 0,
    },
    totalTickets: {
        type: Number,
        required: true,
        min: 1,
    },
    remainingTickets: {
        type: Number,
        default: function () {
            return this.totalTickets;
        },
        min: 0,
    },
    organizerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Declined'],
        default: 'Pending'
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

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;