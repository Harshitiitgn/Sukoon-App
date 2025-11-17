const express = require('express');
const router = express.Router();
const { createReminder, getRemindersByDate, deleteReminder } = require('../controllers/reminderController');

router.post('/', createReminder);
router.get('/', getRemindersByDate);
router.delete('/:id', deleteReminder);

module.exports = router;