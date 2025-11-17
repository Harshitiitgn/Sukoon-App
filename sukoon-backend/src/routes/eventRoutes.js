const express = require('express');
const router = express.Router();
const { createEvent, getEvents, getEvent } = require('../controllers/eventController');

router.post('/', createEvent);
router.get('/', getEvents);
router.get('/:id', getEvent);

module.exports = router;