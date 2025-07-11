const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  googleId: { type: String, unique: true, sparse: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  name: { type: String },
  avatar: { type: String },
  role: { type: String, default: "user" },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema); 