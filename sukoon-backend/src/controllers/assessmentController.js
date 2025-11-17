const Assessment = require('../models/Assessment');

exports.saveAssessment = async (req, res) => {
  try {
    const assessment = await Assessment.create(req.body);
    res.status(201).json(assessment);
  } catch (err) {
    console.error('Save assessment error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const { user } = req.query;
    const list = await Assessment.find({ user }).sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    console.error('Get assessment history error', err);
    res.status(500).json({ message: 'Server error' });
  }
};