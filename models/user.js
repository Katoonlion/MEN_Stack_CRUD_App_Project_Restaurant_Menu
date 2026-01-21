const mongoose = require('mongoose');

// models/user.js

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true }, // keep hash
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
  });

// Create the model based on the schema
const User = mongoose.model('User', userSchema);

// Export it to the world
module.exports = User;

