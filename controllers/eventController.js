const Event = require('../models/Event');

const eventController = {
    // public
  getAllEvents: async (req, res) => {
    try {
      const events = await Event.find({ status: 'Approved' });
      res.status(200).json(events);
    } catch (error) {
      console.error("Get events error:", error);
      res.status(500).json({ message: "Server error" });
    }
  },
    //public
  getEvent: async (req, res) => {
    try {
      const event = await Event.findById(req.params.id)
        .select('-__v');
  
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      if (event.status !== 'Approved') {
        return res.status(404).json({ message: "Event not available" });
      }
  
      res.status(200).json(event);
    } catch (error) {
      console.error("Get event error:", error);
      res.status(500).json({ message: "Server error" });
    }
  },
  // admin
   getAllEventsForAdmin: async (req, res) => {
    try {
      if (req.user.role !== 'System Admin') {
        return res.status(403).json({
          success: false,
          message: "Only system admins can access all events"
        });
      }
      const events = await Event.find()
        .select('-__v')
        .populate('organizerId', 'name email')
        .sort({ createdAt: -1 });
  
      const categorized = {
        approved: events.filter(e => e.status === 'Approved'),
        pending: events.filter(e => e.status === 'Pending'),
        declined: events.filter(e => e.status === 'Declined')
      };
  
      res.status(200).json({
        success: true,
        count: events.length,
        ...categorized
      });
  
    } catch (error) {
      console.error("Admin get events error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch events"
      });
    }
  },
     // organizer
  createEvent: async (req, res) => {
    try {
      if (req.user.role !== 'Organizer') {
        return res.status(403).json({ message: "Only organizers can create events" });
      }

      const eventData = {
        ...req.body,
        organizerId: req.user.userId,
        remainingTickets: req.body.totalTickets
      };

      const newEvent = await Event.create(eventData);
      res.status(201).json({
        message: "Event created successfully",
        event: newEvent
      });
    } catch (error) {
      console.error("Create event error:", error);
      res.status(500).json({ message: "Server error" });
    }
  },
    // organizer & admin
    updateEvent: async (req, res) => {
      try {
        const event = await Event.findById(req.params.id);
        
        if (!event) {
          return res.status(404).json({ 
            success: false,
            message: "Event not found" 
          });
        }
    
        // Authorization check
        if (
          req.user.role !== 'System Admin' && 
          (req.user.role !== 'Organizer' || event.organizerId.toString() !== req.user.userId)
        ) {
          return res.status(403).json({ 
            success: false,
            message: "Unauthorized: Only event organizer or admin can update" 
          });
        }
    
        // Prepare updates with number validation
        const updates = {
          title: req.body.title,
          description: req.body.description,
          category: req.body.category,
          image: req.body.image,
          date: req.body.date,
          location: req.body.location,
          ticketPrice: req.body.ticketPrice
        };
    
        // Handle ticket changes safely
        if (req.body.totalTickets) {
          const newTotal = Number(req.body.totalTickets);
          const ticketsSold = event.totalTickets - event.remainingTickets;
    
          if (isNaN(newTotal) || newTotal <= 0) {
            return res.status(400).json({
              success: false,
              message: "Total tickets must be a positive number"
            });
          }
    
          if (newTotal < ticketsSold) {
            return res.status(400).json({
              success: false,
              message: `Cannot reduce tickets below ${ticketsSold} (already sold)`
            });
          }
    
          updates.totalTickets = newTotal;
          updates.remainingTickets = newTotal - ticketsSold;
        }
    
        const updatedEvent = await Event.findByIdAndUpdate(
          req.params.id,
          updates,
          { 
            new: true,
            runValidators: true 
          }
        ).select('-__v');
    
        res.status(200).json({
          success: true,
          message: "Event updated successfully",
          event: updatedEvent
        });
    
      } catch (error) {
        console.error("Update event error:", error);
        
        if (error.name === 'ValidationError') {
          return res.status(400).json({
            success: false,
            message: Object.values(error.errors).map(e => e.message).join(', ')
          });
        }
    
        res.status(500).json({ 
          success: false,
          message: "Server error during update" 
        });
      }
    },
    // organizer & admin
  deleteEvent: async (req, res) => {
    try {
      const event = await Event.findById(req.params.id);
      
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }

      if (
        req.user.role !== 'System Admin' && 
        (req.user.role !== 'Organizer' || event.organizerId.toString() !== req.user.userId)
      ) {
        return res.status(403).json({ 
          message: "Unauthorized: Only event organizer or admin can delete" 
        });
      }
  
      await Event.findByIdAndDelete(req.params.id);
      res.status(200).json({ 
        message: "Event deleted successfully",
        deletedEventId: req.params.id 
      });
      
    } catch (error) {
      console.error("Delete event error:", error);
      res.status(500).json({ message: "Server error" });
    }
  },
    // admin
  updateEventStatus: async (req, res) => {
    try {
      if (req.user.role !== 'System Admin') {
        return res.status(403).json({ message: "Only admins can approve/reject events" });
      }

      const { status } = req.body;
      if (!['Approved', 'Declined'].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const updatedEvent = await Event.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );

      if (!updatedEvent) {
        return res.status(404).json({ message: "Event not found" });
      }

      res.status(200).json({
        message: `Event ${status.toLowerCase()} successfully`,
        event: updatedEvent
      });
    } catch (error) {
      console.error("Status update error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
};

module.exports = eventController;