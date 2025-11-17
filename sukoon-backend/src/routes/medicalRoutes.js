const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { uploadFile, listFiles } = require('../controllers/medicalController');

router.get('/', listFiles);
router.post('/', upload.single('file'), uploadFile);

module.exports = router;