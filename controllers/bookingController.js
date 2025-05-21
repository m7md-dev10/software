const Booking = require('../models/Booking');
const Event = require('../models/Event');

const bookingController = {
   // user
  bookTickets: async (req, res) => {
    try {
      const { eventId, numberOfTickets } = req.body;

      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      if (event.remainingTickets < numberOfTickets) {
        return res.status(400).json({ 
          message: 'Only ${event.remainingTickets} tickets available' 
        });
      }

      const totalPrice = event.ticketPrice * numberOfTickets;

      const newBooking = await Booking.create({
        userId: req.user.userId,
        eventId,
        numberOfTickets,
        totalPrice,
        bookingStatus: 'Confirmed'
      });

      event.remainingTickets -= numberOfTickets;
      await event.save();

      res.status(201).json({
        message: "Booking confirmed",
        booking: newBooking
      });

    } catch (error) {
      console.error("Booking error:", error);
      res.status(500).json({ message: "Server error" });
    }
  },

   // user
  cancelBooking: async (req, res) => {
    try {
      const { id } = req.params;

      const booking = await Booking.findOne({
        _id: id,
        userId: req.user.userId
      });
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      if (booking.bookingStatus === 'Canceled') {
        return res.status(400).json({ message: "Booking already canceled" });
      }

      const event = await Event.findById(booking.eventId);
      if (event) {
        event.remainingTickets += booking.numberOfTickets;
        await event.save();
      }

      // Update the booking status using findByIdAndUpdate to ensure atomic operation
      const updatedBooking = await Booking.findByIdAndUpdate(
        id,
        { bookingStatus: 'Canceled' },
        { new: true, runValidators: true }
      );

      if (!updatedBooking) {
        return res.status(404).json({ message: "Failed to update booking" });
      }

      res.status(200).json({
        message: "Booking canceled successfully",
        updatedBooking
      });

    } catch (error) {
      console.error("Cancel booking error:", error);
      if (error.name === 'ValidationError') {
        return res.status(400).json({ 
          message: "Invalid booking status",
          error: error.message 
        });
      }
      res.status(500).json({ message: "Server error" });
    }
  },

   // user
  getBookingById: async (req, res) => {
    try {
      const booking = await Booking.findOne({
        _id: req.params.id,
        userId: req.user.userId
      }).populate('eventId', 'title date location ticketPrice');

      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      res.status(200).json(booking);
    } catch (error) {
      console.error("Get booking error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
};

module.exports = bookingController;