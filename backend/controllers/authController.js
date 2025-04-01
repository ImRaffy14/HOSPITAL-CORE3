const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/UserData');
const { send2FAEmail } = require('../utils/emailSender');

// Registration controller
const register = async (req, res) => {
  const { username, password, email, fullName, role } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Username already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      password: hashedPassword,
      email,
      fullName,
      role
    });

    // Save the user to the database
    const account = await newUser.save(); 

    res.status(201).json({ success: true, message: 'User registered successfully' });
    req.io.emit('new-user', account)
  } catch (error) {
    res.status(500).json({ success: false, message: 'User registration failed', error: error.message });
    console.error(error.message)
  }
};

// Login with 2FA
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // 2. Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // 3. Generate 2FA token
    const twoFAToken = Math.floor(100000 + Math.random() * 900000).toString();
    const tokenExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // 4. Save token to user
    user.twoFAToken = twoFAToken;
    user.twoFATokenExpires = tokenExpires;
    await user.save();

    // 5. Send 2FA email
    await send2FAEmail(user.email, twoFAToken);

    res.status(200).json({
      success: true,
      message: '2FA code sent to email',
      userId: user._id
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
};

// Verify 2FA
const verify2FA = async (req, res) => {
  const { userId, token } = req.body;

  try {
    // 1. Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // 2. Check token validity
    if (user.twoFAToken !== token || 
        new Date() > user.twoFATokenExpires) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }

    // 3. Clear 2FA token
    user.twoFAToken = undefined;
    user.twoFATokenExpires = undefined;
    await user.save();

    // 4. Generate JWT
    const authToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // 5. Set cookie
    res.cookie('token', authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    res.status(200).json({
      success: true,
      token: authToken
    });

  } catch (error) {
    console.error('2FA verification error:', error);
    res.status(500).json({
      success: false,
      message: '2FA verification failed',
      error: error.message
    });
  }
};

// LOGOUT
const logout = (req,res) => {
  const { username } = req.body
  res.clearCookie('token').send('User logged out')
  console.log(`${username} logged out`)
}


module.exports = { register, login, logout, verify2FA};