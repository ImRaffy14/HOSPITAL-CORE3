const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  fullName: { type: String, required: true },
  role: { type: String, enum: ['Admin', 'Superadmin'], required: true },
  twoFAToken: String,
  twoFATokenExpires: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});


module.exports = mongoose.model('UserData', userSchema);