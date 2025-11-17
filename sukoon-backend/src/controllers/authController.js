const User = require('../models/User');

exports.register = async (req, res) => {
  try {
    const { fullName, mobile, age, gender, preferredLanguage } = req.body;
    const existing = await User.findOne({ mobile });
    if (existing) {
      return res.status(400).json({ message: 'User already exists with this mobile number' });
    }
    const user = await User.create({ fullName, mobile, age, gender, preferredLanguage });
    res.status(201).json(user);
  } catch (err) {
    console.error('Register error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { mobile } = req.body;
    const user = await User.findOne({ mobile });
    if (!user) {
      return res.status(404).json({ message: 'User not found, please register' });
    }
    res.json(user);
  } catch (err) {
    console.error('Login error', err);
    res.status(500).json({ message: 'Server error' });
  }
};