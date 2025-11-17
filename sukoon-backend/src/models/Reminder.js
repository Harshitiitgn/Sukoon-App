const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    time: { type: String, required: true },
    date: { type: String, required: true },
    category: { type: String },
    repeat: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Reminder', reminderSchema);