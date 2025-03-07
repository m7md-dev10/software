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


const newUser = new User({
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'hashedPassword123', // Hash the password before saving
    role: 'Standard User',
  });
  
  newUser.save()
    .then((user) => console.log('User created:', user))
    .catch((err) => console.error('Error creating user:', err));


const newEvent = new Event({
  title: 'Tech Conference 2023',
  description: 'A conference about the latest in technology.',
  date: new Date('2023-12-15'),
  location: 'San Francisco, CA',
  category: 'Conference',
  ticketPrice: 100,
  totalTickets: 500,
  remainingTickets: 500,
  organizerId: '654321abcdef123456789012', // Replace with a valid User ID (Organizer)
});

newEvent.save()
  .then((event) => console.log('Event created:', event))
  .catch((err) => console.error('Error creating event:', err));


  const newBooking = new Booking({
    userId: '123456abcdef123456789012', // Replace with a valid User ID
    eventId: '654321abcdef123456789012', // Replace with a valid Event ID
    numberOfTickets: 2,
    totalPrice: 200,
    status: 'Confirmed',
  });
  
  newBooking.save()
    .then((booking) => console.log('Booking created:', booking))
    .catch((err) => console.error('Error creating booking:', err));


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