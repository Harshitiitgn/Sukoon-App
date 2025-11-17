const Reminder = require('../models/Reminder');

exports.createReminder = async (req, res) => {
  try {
    const reminder = await Reminder.create(req.body);
    res.status(201).json(reminder);
  } catch (err) {
    console.error('Create reminder error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getRemindersByDate = async (req, res) => {
  try {
    const { user, date } = req.query;
    const reminders = await Reminder.find({ user, date }).sort({ time: 1 });
    res.json(reminders);
  } catch (err) {
    console.error('Get reminders error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteReminder = async (req, res) => {
  try {
    const { id } = req.params;
    await Reminder.findByIdAndDelete(id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('Delete reminder error', err);
    res.status(500).json({ message: 'Server error' });
  }
};