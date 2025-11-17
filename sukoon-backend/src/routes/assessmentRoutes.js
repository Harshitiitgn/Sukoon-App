const express = require('express');
const router = express.Router();
const { saveAssessment, getHistory } = require('../controllers/assessmentController');

router.post('/', saveAssessment);
router.get('/', getHistory);

module.exports = router;