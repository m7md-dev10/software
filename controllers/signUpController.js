const crypto = require('crypto');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendPasswordResetEmail } = require('../utils/emailService');
const secretKey = process.env.JWT_SECRET;
    
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

  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;
      
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const resetToken = crypto.randomBytes(20).toString('hex');
      user.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
      user.resetPasswordExpire = Date.now() + 3600000; // 1 hour
      
      await user.save();

      // Create reset URL
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

      // Send email
      try {
        await sendPasswordResetEmail(email, resetUrl);
        res.status(200).json({ 
          success: true,
          message: "Password reset email sent"
        });
      } catch (emailError) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        
        console.error("Email send error:", emailError);
        return res.status(500).json({ message: "Failed to send password reset email" });
      }

    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({ message: "Server error" });
    }
  },
   // reset
  resetPassword: async (req, res) => {
try {
  const { token } = req.params;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  user.password = await bcrypt.hash(password, 10);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.status(200).json({ 
    success: true,
    message: "Password updated successfully" 
  });

} catch (error) {
  console.error("Reset password error:", error);
  res.status(500).json({ message: "Server error" });
}
}
}

module.exports = signUpController;