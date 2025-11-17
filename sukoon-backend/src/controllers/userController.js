const User = require('../models/User');

exports.getProfile = async (req, res) => {
  try {
    const { id } = req.query;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('Get profile error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { id, fullName, mobile, age, emergencyContact } = req.body;

    const update = {
      fullName,
      mobile,
    };

    if (age !== undefined) {
      update.age = age;
    }

    // Allow setting or clearing emergencyContact
    if (emergencyContact !== undefined) {
      update.emergencyContact = emergencyContact;
    }

    const user = await User.findByIdAndUpdate(id, update, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    console.error('Update profile error', err);
    res.status(500).json({ message: 'Server error' });
  }
};
