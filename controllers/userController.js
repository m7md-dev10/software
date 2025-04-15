const User = require('../models/User');
const Booking = require('../models/Booking');
const Event = require('../models/Event');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET;


const userController = {
  // admin
getAllUsers: async (req, res) => {
  try {
    if (req.user.role !== 'System Admin') {
      return res.status(403).json({ 
        success: false,
        message: "Unauthorized: Admin access required" 
      });
    }

    const users = await User.find().select('-password');
    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
    
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ 
      success: false,
      message: "Server error",
      error: error.message 
    });
  }
},
  // admin
getUserById: async (req, res) => {
  try {
    if (req.user.role !== 'System Admin') {
      return res.status(403).json({ 
        message: "Forbidden: Admin access required" 
      });
    }

    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json(user);
    
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Server error" });
  }
},
  // admin
updateUserRole: async (req, res) => {
  try {
    if (req.user.role !== 'System Admin') {
      return res.status(403).json({ 
        message: "Forbidden: Admin privileges required" 
      });
    }

    const { id } = req.params;
    const { role } = req.body;

    const validRoles = ['Standard User', 'Organizer', 'System Admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ 
        message: "Invalid role",
        validRoles 
      });
    }

    if (id === req.user.userId && role !== 'System Admin') {
      return res.status(403).json({ 
        message: "Cannot remove your own admin privileges" 
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ 
      message: "Role updated successfully",
      user: updatedUser 
    });

  } catch (error) {
    console.error("Role update error:", error);
    res.status(500).json({ message: "Server error" });
  }
},
   // admin
  deleteUser: async (req, res) => {
    try {
      if (req.user.role !== 'System Admin') {
        return res.status(403).json({ 
          message: "Forbidden: Admin access required" 
        });
      }
  
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.status(200).json({ 
        message: "User deleted successfully",
        deletedUserId: user._id 
      });
      
    } catch (error) {
      console.error("Delete error:", error);
      res.status(500).json({ message: "Server error" });
    }
  },
  // user
  getUserBookings: async (req, res) => {
    try {
      const bookings = await Booking.find({ userId: req.user.userId })
        .populate('eventId', 'title date location');
      
      res.status(200).json(bookings);
    } catch (error) {
      console.error("Get bookings error:", error);
      res.status(500).json({ message: "Server error" });
    }
  },
  // organizer
  getOrganizerEvents: async (req, res) => {
    try {
      if (req.user.role !== 'Organizer') {
        return res.status(403).json({ message: "Only organizers can access this" });
      }

      const events = await Event.find({ 
        organizerId: req.user.userId 
      }).select('-__v');

      res.status(200).json(events);
    } catch (error) {
      console.error("Get organizer events error:", error);
      res.status(500).json({ message: "Server error" });
    }
  },
   // organizer
   getOrganizerAnalytics: async (req, res) => {
    try {
      if (req.user.role !== 'Organizer') {
        return res.status(403).json({
          success: false,
          message: "Only organizers can access analytics"
        });
      }

      const events = await Event.find({ 
        organizerId: req.user.userId,
        status: 'Approved'
      }).lean();

      const analytics = await Promise.all(
        events.map(async event => {
          const confirmedBookings = await Booking.countDocuments({
            eventId: event._id,
            status: 'Confirmed'
          });
  
          const percentageBooked = Math.round(
            (confirmedBookings / event.totalTickets) * 100
          );
  
          return {
            eventId: event._id,
            title: event.title,
            totalTickets: event.totalTickets,
            ticketsSold: confirmedBookings,
            percentageBooked,
            revenue: confirmedBookings * event.ticketPrice
          };
        })
      );
  
      const graphData = {
        labels: analytics.map(item => item.title),
        datasets: [
          {
            label: 'Booking Percentage',
            data: analytics.map(item => item.percentageBooked),
            backgroundColor: '#4f46e5',
            borderColor: '#3730a3'
          }
        ]
      };
  
      res.status(200).json({
        success: true,
        analytics,
        graphData
      });
  
    } catch (error) {
      console.error("Analytics error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to fetch analytics"
      });
    }
  },
  //get user profile
 getProfile: async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select('-password -__v');

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    res.status(200).json({
      success: true,
      profile: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture
      }
    });

  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch profile" 
    });
  }
},
  // update user profile
 updateProfile: async (req, res) => {
  try {
    const updates = {
      name: req.body.name,
      email: req.body.email,
      profilePicture: req.body.profilePicture
    };

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      updates,
      { 
        new: true, 
        runValidators: true
      }
    ).select('-password -__v');

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture
      }
    });

  } catch (error) {
    console.error("Update error:", error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors).map(e => e.message).join(', ')
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Email already in use"
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update profile"
    });
  }
},
   // logout
  logout: (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: "Logged out successfully" });
  }

};



module.exports = userController;