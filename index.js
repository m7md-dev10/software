const mongoose = require('mongoose');
const User = require('./models/User');
const Event = require('./models/Event'); 
const Booking = require('./models/Booking'); 

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/prj')
    .then(() => {
        console.log('Connected to MongoDB successfully!');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });

// Function to create a new user
async function createUser() {
    const newUser = new User({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'securepassword123',
        role: 'Standard User',
    });

    try {
        await newUser.save();
        console.log('User saved successfully!');
    } catch (err) {
        console.error('Error saving user:', err);
    }
}

// Function to create a new event
async function createEvent() {
    const newEvent = new Event({
        title: 'Tech Conference 2023',
        description: 'A conference about the latest in technology.',
        date: new Date('2023-12-15T09:00:00Z'),
        location: 'San Francisco, CA',
        category: 'Conference',
        ticketPrice: 100,
        totalTickets: 500,
        organizerId: 'organizer123',
    });

    try {
        await newEvent.save();
        console.log('Event saved successfully!');
    } catch (err) {
        console.error('Error saving event:', err);
    }
}

// Function to create a new booking
async function createBooking() {
    const newBooking = new Booking({
        userId: 'user123',
        eventId: 'event456',
        numberOfTickets: 2,
        totalPrice: 200,
    });

    try {
        await newBooking.save();
        console.log('Booking saved successfully!');
    } catch (err) {
        console.error('Error saving booking:', err);
    }
}

// Function to find all users
async function findAllUsers() {
    try {
        const users = await User.find();
        console.log('All users:', users);
    } catch (err) {
        console.error('Error finding users:', err);
    }
}

// Function to find all events
async function findAllEvents() {
    try {
        const events = await Event.find();
        console.log('All events:', events);
    } catch (err) {
        console.error('Error finding events:', err);
    }
}

// Function to find all bookings
async function findAllBookings() {
    try {
        const bookings = await Booking.find();
        console.log('All bookings:', bookings);
    } catch (err) {
        console.error('Error finding bookings:', err);
    }
}

// Example usage
(async () => {
    await createUser(); 
    await createEvent(); 
    await createBooking(); 
    await findAllUsers();
    await findAllEvents();
    await findAllBookings();
})();