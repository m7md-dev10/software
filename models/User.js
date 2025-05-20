const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
<<<<<<< Updated upstream
    name: {
        type: String,
        required: true, 
        minlength: 1,
        maxlength: 100, 
    },
    email: {
        type: String,
        required: true, 
        unique: true, 
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 
    },
    profilePicture: {
        type: String,
        default: 'default-profile-picture-url', 
    },
    password: {
        type: String,
        required: true, 
        minlength: 8, 
    },
    role: {
        type: String,
        enum: ['Standard User', 'Organizer', 'System Admin'], 
        default: 'Standard User', 
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
=======
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  profilePicture: {
    type: String,
    default: '',
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['Standard User', 'Organizer', 'System Admin'],
    default: 'Standard User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  verificationCode: String,
  verificationCodeExpiry: Date,
>>>>>>> Stashed changes
});


const User = mongoose.model('User', userSchema);

module.exports = User;