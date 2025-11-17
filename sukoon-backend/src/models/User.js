const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    mobile: { type: String, required: true, unique: true },
    age: { type: Number },
    gender: { type: String },
    preferredLanguage: { type: String },
    // New optional field
    emergencyContact: { type: String }, // e.g. "Neha - 9876543210" or just number
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
