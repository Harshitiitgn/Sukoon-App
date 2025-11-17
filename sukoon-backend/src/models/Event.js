const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    dateTime: { type: String, required: true },
    location: { type: String, required: true },
    contactNumber: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);