const MedicalFile = require('../models/MedicalFile');

exports.listFiles = async (req, res) => {
  try {
    const { user } = req.query;
    const files = await MedicalFile.find({ user }).sort({ createdAt: -1 });
    res.json(files);
  } catch (err) {
    console.error('List medical files error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.uploadFile = async (req, res) => {
  try {
    const { user } = req.body;
    const file = req.file;
    const record = await MedicalFile.create({
      user,
      fileName: file.originalname,
      url: `/uploads/${file.filename}`,
    });
    res.status(201).json(record);
  } catch (err) {
    console.error('Upload medical file error', err);
    res.status(500).json({ message: 'Server error' });
  }
};