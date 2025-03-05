const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
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
});


const User = mongoose.model('User', userSchema);

module.exports = User;