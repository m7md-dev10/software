const crypto = require('crypto');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config();
const secretKey = process.env.JWT_SECRET;

// Email transporter configuration
const createTransporter = () => {
  console.log('Starting to create transporter...');
  console.log('Email Config:', {
    user: process.env.EMAIL_USER,
    passLength: process.env.EMAIL_PASSWORD ? process.env.EMAIL_PASSWORD.length : 0,
    hasUser: !!process.env.EMAIL_USER,
    hasPass: !!process.env.EMAIL_PASSWORD
  });

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    throw new Error('Email configuration missing. Please set EMAIL_USER and EMAIL_PASSWORD in .env file');
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    },
    debug: true, // Enable debug logging
    logger: true  // Enable built-in logger
  });

  return transporter;
};
    
const signUpController = {
 // register
 register: async (req, res) => {
  try {
    const { name, email, password, role, profilePicture } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'Standard User',
      profilePicture: profilePicture || ''
    });

    await newUser.save();
    res.status(201).json({ 
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        profilePicture: newUser.profilePicture
      }
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
},
  // login
login: async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      secretKey,
      { expiresIn: '3h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3 * 60 * 60 * 1000
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
},

  // Forgot password with verification code
  forgotPassword: async (req, res) => {
    try {
      console.log('Starting forgot password process...');
      const { email } = req.body;
      console.log('Request for email:', email);
      
      const user = await User.findOne({ email });

      if (!user) {
        console.log('User not found for email:', email);
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Generate 6-digit verification code
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      console.log('Generated verification code:', verificationCode);
      
      // Set verification code expiry (10 minutes)
      const verificationCodeExpiry = new Date(Date.now() + 10 * 60 * 1000);

      try {
        console.log('Creating email transporter...');
        const transporter = createTransporter();
        
        // Send verification code email
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: 'Password Reset Verification Code',
          html: `
            <h2>Password Reset Request</h2>
            <p>Your verification code is: <strong>${verificationCode}</strong></p>
            <p>This code will expire in 10 minutes.</p>
            <p>If you didn't request this, please ignore this email.</p>
          `
        };

        console.log('Mail options prepared:', {
          from: process.env.EMAIL_USER,
          to: email,
          subject: 'Password Reset Verification Code'
        });

        console.log('Attempting to send email...');
        
        // Add more detailed verification
        try {
          console.log('Verifying transporter configuration...');
          const verifyResult = await transporter.verify();
          console.log('Transporter verification result:', verifyResult);
        } catch (verifyError) {
          console.error('Transporter verification failed:', verifyError);
          throw verifyError;
        }
        
        try {
          const info = await transporter.sendMail(mailOptions);
          console.log('Email sent successfully. Message ID:', info.messageId);
          console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
          console.log('Full email info:', info);
        } catch (sendError) {
          console.error('Failed to send email:', sendError);
          console.error('SMTP Response:', sendError.response);
          throw sendError;
        }

        // Only save the verification code after email is sent successfully
        user.verificationCode = verificationCode;
        user.verificationCodeExpiry = verificationCodeExpiry;
        await user.save();
        console.log('User updated with verification code');

      res.status(200).json({ 
        success: true,
          message: 'Verification code sent to email'
        });

      } catch (emailError) {
        console.error('Detailed email error:', emailError);
        console.error('Error stack:', emailError.stack);
        return res.status(500).json({
          success: false,
          message: `Failed to send verification code email: ${emailError.message}`
        });
      }

    } catch (error) {
      console.error('Forgot password error:', error);
      console.error('Error stack:', error.stack);
      res.status(500).json({
        success: false,
        message: error.message || 'Error in forgot password process'
      });
    }
  },

  // Reset password with verification code
  resetPassword: async (req, res) => {
try {
      const { email, verificationCode, password } = req.body;

  const user = await User.findOne({
        email,
        verificationCode,
        verificationCodeExpiry: { $gt: Date.now() }
  });

  if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired verification code'
        });
  }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Update password and clear verification code
      user.password = hashedPassword;
      user.verificationCode = undefined;
      user.verificationCodeExpiry = undefined;
  await user.save();

  res.status(200).json({ 
    success: true,
        message: 'Password reset successful'
  });

} catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({
        success: false,
        message: 'Error in password reset process'
      });
}
}
};

module.exports = signUpController;